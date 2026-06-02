const DEFAULT_ADMIN_EMAIL = "blaz.gyoha@oegb.at";
const EVENT_SLUG = "stay-shape-vienna-2026";
const EVENT_TITLE =
  "Stay & Shape: Youth, Migration and the Digital Transformation of Work in Southeast Europe";
const EVENT_LOCATION = "Vienna, Austria";
const EVENT_DATES = "18-19 June 2026";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const body = parseBody(req.body);
  const validation = validatePayload(body);

  if (!validation.ok) {
    return res.status(400).json({
      error: "validation_failed",
      fieldErrors: validation.fieldErrors,
    });
  }

  const language = body.language;
  const name = normalizeName(body.name);
  const email = String(body.email).trim().toLowerCase();
  const organisation = normalizeOptionalText(body.organisation);
  const submittedAt = new Date().toISOString();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase configuration");
    return res.status(500).json({ error: "server_misconfigured" });
  }

  const insertResult = await insertRegistration({
    name,
    email,
    organisation,
    language,
    consentTimestamp: submittedAt,
    submittedAt,
  });

  if (insertResult.duplicate) {
    return res.status(409).json({ error: "duplicate" });
  }

  if (!insertResult.ok) {
    return res.status(500).json({ error: "storage_failed" });
  }

  const emailResults = await Promise.allSettled([
    sendAttendeeEmail({ name, email, language }),
    sendAdminEmail({ name, email, organisation, language, submittedAt }),
  ]);

  emailResults.forEach((result, index) => {
    if (result.status === "rejected") {
      const label = index === 0 ? "attendee" : "admin";
      console.error(`Failed to send ${label} email`, result.reason);
    }
  });

  return res.status(201).json({ ok: true });
};

function parseBody(body) {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }
  return body;
}

function validatePayload(body) {
  const fieldErrors = {};

  if (String(body.website || "").trim() !== "") {
    fieldErrors.website = "spam_detected";
  }

  const name = normalizeName(body.name);
  if (!name) {
    fieldErrors.name = "required_name";
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email) {
    fieldErrors.email = "required_email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "invalid_email";
  }

  if (body.consent !== true) {
    fieldErrors.consent = "consent_required";
  }

  if (!["en", "de"].includes(body.language)) {
    fieldErrors.language = "invalid_language";
  }

  return {
    ok: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

function normalizeName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeOptionalText(value) {
  const normalized = String(value || "")
    .trim()
    .replace(/\s+/g, " ");
  return normalized || null;
}

async function insertRegistration({
  name,
  email,
  organisation,
  language,
  consentTimestamp,
  submittedAt,
}) {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/registrations`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name,
          email,
          organisation,
          language,
          consent_given: true,
          consent_timestamp: consentTimestamp,
          submitted_at: submittedAt,
          source_event: EVENT_SLUG,
        }),
      }
    );

    if (response.ok) {
      return { ok: true };
    }

    const errorBody = await safeJson(response);
    if (
      response.status === 409 ||
      (errorBody && (errorBody.code === "23505" || errorBody.message?.includes("duplicate")))
    ) {
      return { ok: false, duplicate: true };
    }

    console.error("Supabase insert failed", response.status, errorBody);
    return { ok: false };
  } catch (error) {
    console.error("Supabase insert request failed", error);
    return { ok: false };
  }
}

async function sendAttendeeEmail({ name, email, language }) {
  const localized = getAttendeeEmailCopy(language);
  return sendEmail({
    to: email,
    subject: localized.subject,
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f1713;line-height:1.6">
        <p>${escapeHtml(localized.greeting(name))}</p>
        <p>${escapeHtml(localized.body)}</p>
        <p><strong>${escapeHtml(EVENT_TITLE)}</strong><br />${escapeHtml(EVENT_DATES)}<br />${escapeHtml(EVENT_LOCATION)}</p>
        <p>${escapeHtml(localized.footer)}</p>
      </div>
    `,
  });
}

async function sendAdminEmail({ name, email, organisation, language, submittedAt }) {
  return sendEmail({
    to: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
    subject: `New registration: ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f1713;line-height:1.6">
        <p>A new registration was submitted for ${escapeHtml(EVENT_SLUG)}.</p>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(name)}</li>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Organisation:</strong> ${escapeHtml(organisation || "Not provided")}</li>
          <li><strong>Language:</strong> ${escapeHtml(language)}</li>
          <li><strong>Registration timestamp:</strong> ${escapeHtml(submittedAt)}</li>
        </ul>
      </div>
    `,
  });
}

function getAttendeeEmailCopy(language) {
  if (language === "de") {
    return {
      subject: "Bestätigung Ihrer Registrierung für Stay & Shape",
      greeting: (name) => `Hallo ${name},`,
      body:
        "vielen Dank für Ihre Registrierung für die Wiener Veranstaltung von Stay & Shape. Ihre Anmeldung ist bei uns eingegangen.",
      footer:
        "Weitere praktische Informationen und Programmdetails senden wir Ihnen rechtzeitig vor der Veranstaltung.",
    };
  }

  return {
    subject: "Your Stay & Shape registration confirmation",
    greeting: (name) => `Hello ${name},`,
    body:
      "Thank you for registering for the Vienna event of Stay & Shape. Your submission has been received successfully.",
    footer:
      "Further practical information and detailed programme updates will be shared with you closer to the event.",
  };
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error("Missing Resend configuration");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new Error(
      `Resend request failed with ${response.status}: ${JSON.stringify(errorBody)}`
    );
  }
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
