const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const handler = require("../api/register.js");

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function withEnv(env, fn) {
  const previous = { ...process.env };
  Object.keys(process.env).forEach((key) => {
    delete process.env[key];
  });
  Object.assign(process.env, env);
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      Object.keys(process.env).forEach((key) => {
        delete process.env[key];
      });
      Object.assign(process.env, previous);
    });
}

test("returns 405 for non-POST requests", async () => {
  const req = { method: "GET", body: null };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
  assert.deepEqual(res.body, { error: "method_not_allowed" });
});

test("returns 400 with localized field error codes for invalid payloads", async () => {
  const req = {
    method: "POST",
    body: {
      name: "",
      email: "invalid",
      language: "fr",
      consent: false,
      website: "spam",
    },
  };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, "validation_failed");
  assert.deepEqual(res.body.fieldErrors, {
    website: "spam_detected",
    name: "required_name",
    email: "invalid_email",
    consent: "consent_required",
    language: "invalid_language",
  });
});

test("returns 500 if required environment variables are missing", async () => {
  const req = {
    method: "POST",
    body: {
      name: "Blaz Gyoha",
      email: "blaz@example.org",
      organisation: "OGB",
      language: "en",
      consent: true,
      website: "",
    },
  };
  const res = createResponse();

  await withEnv({}, async () => {
    await handler(req, res);
  });

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { error: "server_misconfigured" });
});

test("returns 409 when Supabase reports a duplicate registration", async () => {
  const req = {
    method: "POST",
    body: {
      name: "Blaz Gyoha",
      email: "blaz@example.org",
      language: "en",
      consent: true,
      website: "",
    },
  };
  const res = createResponse();
  const calls = [];
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    calls.push(url);
    return {
      ok: false,
      status: 409,
      async json() {
        return { code: "23505", message: "duplicate key value violates unique constraint" };
      },
    };
  };

  await withEnv(
    {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "supabase-key",
      RESEND_API_KEY: "resend-key",
      EMAIL_FROM: "Stay & Shape <events@example.org>",
      EMAIL_REPLY_TO: "blaz.gyoha@oegb.at",
      ADMIN_EMAIL: "admin@example.org",
    },
    async () => {
      await handler(req, res);
    }
  );

  global.fetch = originalFetch;

  assert.equal(calls.length, 1);
  assert.equal(res.statusCode, 409);
  assert.deepEqual(res.body, { error: "duplicate" });
});

test("stores a registration and sends attendee/admin emails on success", async () => {
  const req = {
    method: "POST",
    body: {
      name: "Blaz Gyoha",
      email: "BLAZ@EXAMPLE.ORG",
      organisation: "OGB International Department",
      language: "de",
      consent: true,
      website: "",
    },
  };
  const res = createResponse();
  const calls = [];
  const originalFetch = global.fetch;

  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    if (String(url).includes("/rest/v1/registrations")) {
      const payload = JSON.parse(options.body);
      assert.equal(payload.email, "blaz@example.org");
      assert.equal(payload.organisation, "OGB International Department");
      assert.equal(payload.language, "de");
      assert.equal(payload.consent_given, true);
      assert.equal(payload.source_event, "stay-shape-vienna-2026");
      return {
        ok: true,
        status: 201,
        async json() {
          return [{ id: "abc" }];
        },
      };
    }

    if (url === "https://api.resend.com/emails") {
      return {
        ok: true,
        status: 200,
        async json() {
          return { id: "email_123" };
        },
      };
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  await withEnv(
    {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "supabase-key",
      RESEND_API_KEY: "resend-key",
      EMAIL_FROM: "Stay & Shape <events@example.org>",
      EMAIL_REPLY_TO: "blaz.gyoha@oegb.at",
      ADMIN_EMAIL: "admin@example.org",
    },
    async () => {
      await handler(req, res);
    }
  );

  global.fetch = originalFetch;

  assert.equal(calls.length, 3);
  assert.equal(JSON.parse(calls[1].options.body).to, "blaz@example.org");
  assert.equal(JSON.parse(calls[1].options.body).reply_to, "blaz.gyoha@oegb.at");
  assert.match(JSON.parse(calls[1].options.body).html, /18-19 June 2026/);
  assert.equal(JSON.parse(calls[2].options.body).to, "admin@example.org");
  assert.equal(JSON.parse(calls[2].options.body).reply_to, "blaz.gyoha@oegb.at");
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, { ok: true });
});

test("keeps the registration successful if Resend fails after storage", async () => {
  const req = {
    method: "POST",
    body: {
      name: "Blaz Gyoha",
      email: "blaz@example.org",
      organisation: "",
      language: "en",
      consent: true,
      website: "",
    },
  };
  const res = createResponse();
  const calls = [];
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;

  console.error = () => {};

  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    if (String(url).includes("/rest/v1/registrations")) {
      return {
        ok: true,
        status: 201,
        async json() {
          return [{ id: "abc" }];
        },
      };
    }

    if (url === "https://api.resend.com/emails") {
      return {
        ok: false,
        status: 500,
        async json() {
          return { message: "email provider unavailable" };
        },
      };
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  await withEnv(
    {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "supabase-key",
      RESEND_API_KEY: "resend-key",
      EMAIL_FROM: "Stay & Shape <events@example.org>",
      ADMIN_EMAIL: "admin@example.org",
    },
    async () => {
      await handler(req, res);
    }
  );

  global.fetch = originalFetch;
  console.error = originalConsoleError;

  assert.equal(calls.length, 3);
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, { ok: true });
});

test("schema keeps registrations unique per event and private by default", () => {
  const schema = fs.readFileSync(
    path.join(__dirname, "../database/schema.sql"),
    "utf8"
  );

  assert.match(schema, /alter table public\.registrations enable row level security;/);
  assert.match(schema, /revoke all on table public\.registrations from anon, authenticated;/);
  assert.match(schema, /registrations_source_event_email_unique/);
  assert.match(schema, /on public\.registrations \(source_event, email\)/);
  assert.doesNotMatch(schema, /on public\.registrations \(email\);/);
});
