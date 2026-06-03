const cardCanvases = [...document.querySelectorAll("[data-card-three]")];

if (cardCanvases.length > 0) {
  initCardVisuals(cardCanvases);
}

async function initCardVisuals(canvases) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let threeModule;

  try {
    threeModule = await import("https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.js");
  } catch (error) {
    console.warn("Three.js card visuals could not be loaded.", error);
    canvases.forEach((canvas) => canvas.classList.add("is-unavailable"));
    return;
  }

  const cleanups = canvases
    .map((canvas) => createCardScene(threeModule, canvas, reduceMotion))
    .filter(Boolean);

  window.addEventListener(
    "pagehide",
    () => {
      cleanups.forEach((cleanup) => cleanup());
    },
    { once: true }
  );
}

function createCardScene(THREE, canvas, reduceMotion) {
  const type = canvas.getAttribute("data-card-three");
  const buildVisual = visualBuilders[type];

  if (!buildVisual) {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: "high-performance",
  });
  const visual = buildVisual(THREE);

  camera.position.set(0, 0, 6);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  scene.add(visual.group);

  let frameId = null;
  let width = 0;
  let height = 0;

  const resize = () => {
    const nextWidth = Math.max(1, canvas.clientWidth);
    const nextHeight = Math.max(1, canvas.clientHeight);
    if (nextWidth === width && nextHeight === height) {
      return;
    }

    width = nextWidth;
    height = nextHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const render = (time = 0) => {
    resize();
    visual.update(time * 0.001);
    renderer.render(scene, camera);

    if (!reduceMotion) {
      frameId = window.requestAnimationFrame(render);
    }
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reduceMotion) {
      renderer.render(scene, camera);
    }
  });

  resizeObserver.observe(canvas);
  canvas.classList.add("is-ready");
  render();

  return () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
    resizeObserver.disconnect();
    disposeGroup(visual.group);
    renderer.dispose();
  };
}

const visualBuilders = {
  threat: buildThreatVisual,
  opportunity: buildOpportunityVisual,
  share: buildShareVisual,
  develop: buildDevelopVisual,
  formulate: buildFormulateVisual,
};

function buildThreatVisual(THREE) {
  const group = new THREE.Group();
  const red = makeLineMaterial(THREE, 0xef3028, 0.84);
  const ink = makeLineMaterial(THREE, 0x050505, 0.78);

  const frame = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.35, 0),
      new THREE.Vector3(1.45, -1.05, 0),
      new THREE.Vector3(-1.45, -1.05, 0),
    ]),
    ink
  );
  group.add(frame);

  const shards = makeSegments(
    THREE,
    [
      [-1.65, 0.45, 0, -0.72, 0.92, 0],
      [0.62, 1.18, 0, 1.58, 0.58, 0],
      [-1.05, -1.36, 0, -0.1, -0.82, 0],
      [0.34, -0.72, 0, 1.38, -1.28, 0],
      [-0.22, 1.62, 0, 0.28, 0.82, 0],
    ],
    red
  );
  group.add(shards);

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.46, 0),
    new THREE.MeshBasicMaterial({
      color: 0xef3028,
      transparent: true,
      opacity: 0.72,
      wireframe: true,
    })
  );
  group.add(core);

  return {
    group,
    update(seconds) {
      group.rotation.z = Math.sin(seconds * 0.7) * 0.08;
      core.scale.setScalar(1 + Math.sin(seconds * 1.7) * 0.08);
      shards.rotation.z = seconds * -0.12;
    },
  };
}

function buildOpportunityVisual(THREE) {
  const group = new THREE.Group();
  const white = makeLineMaterial(THREE, 0xffffff, 0.78);
  const yellow = makeLineMaterial(THREE, 0xffd21a, 0.92);

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.012, 8, 120),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    })
  );
  orbit.rotation.x = Math.PI * 0.36;
  orbit.rotation.y = Math.PI * 0.14;
  group.add(orbit);

  const rise = makeSegments(
    THREE,
    [
      [-1.35, -1.2, 0, -0.35, -0.25, 0],
      [-0.35, -0.25, 0, 0.2, -0.25, 0],
      [0.2, -0.25, 0, 1.15, 1.05, 0],
      [0.72, 0.98, 0, 1.15, 1.05, 0],
      [1.08, 0.62, 0, 1.15, 1.05, 0],
    ],
    yellow
  );
  group.add(rise);

  const node = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 18, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd21a })
  );
  group.add(node);

  return {
    group,
    update(seconds) {
      orbit.rotation.z = seconds * 0.34;
      const angle = seconds * 0.95;
      node.position.set(Math.cos(angle) * 1.1, Math.sin(angle) * 0.48 + 0.08, Math.sin(angle) * 0.22);
      rise.rotation.z = Math.sin(seconds * 0.5) * 0.06;
      white.opacity = 0.48 + Math.sin(seconds) * 0.08;
    },
  };
}

function buildShareVisual(THREE) {
  const group = new THREE.Group();
  const lineMaterial = makeLineMaterial(THREE, 0x050505, 0.76);
  const redMaterial = makeLineMaterial(THREE, 0xef3028, 0.86);
  const positions = [
    new THREE.Vector3(-1.18, -0.7, 0),
    new THREE.Vector3(0, 0.82, 0),
    new THREE.Vector3(1.18, -0.62, 0),
  ];

  group.add(
    makeSegments(
      THREE,
      [
        [-1.18, -0.7, 0, 0, 0.82, 0],
        [0, 0.82, 0, 1.18, -0.62, 0],
        [1.18, -0.62, 0, -1.18, -0.7, 0],
      ],
      lineMaterial
    )
  );

  const nodes = positions.map((position, index) => {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(index === 1 ? 0.18 : 0.15, 20, 14),
      new THREE.MeshBasicMaterial({
        color: index === 1 ? 0xef3028 : 0x050505,
        transparent: true,
        opacity: 0.88,
        wireframe: index !== 1,
      })
    );
    node.position.copy(position);
    group.add(node);
    return node;
  });

  group.add(
    makeSegments(
      THREE,
      [
        [-1.65, 1.1, 0, -1.05, 1.1, 0],
        [1.05, 1.1, 0, 1.65, 1.1, 0],
      ],
      redMaterial
    )
  );

  return {
    group,
    update(seconds) {
      group.rotation.y = Math.sin(seconds * 0.45) * 0.32;
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(seconds * 1.4 + index) * 0.08);
      });
    },
  };
}

function buildDevelopVisual(THREE) {
  const group = new THREE.Group();
  const materials = [
    makeLineMaterial(THREE, 0x050505, 0.72),
    makeLineMaterial(THREE, 0x0642d9, 0.82),
    makeLineMaterial(THREE, 0xef3028, 0.68),
  ];

  const blocks = [
    [-0.82, -0.7, 0, 0.72],
    [0.1, -0.28, 0.2, 0.84],
    [0.86, 0.28, -0.08, 0.62],
    [-0.38, 0.78, -0.18, 0.54],
  ].map(([x, y, z, size], index) => {
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
    const block = new THREE.LineSegments(geometry, materials[index % materials.length]);
    block.position.set(x, y, z);
    block.rotation.set(0.38, 0.52, index * 0.2);
    group.add(block);
    return block;
  });

  return {
    group,
    update(seconds) {
      group.rotation.y = Math.sin(seconds * 0.45) * 0.34;
      group.rotation.x = Math.sin(seconds * 0.32) * 0.12;
      blocks.forEach((block, index) => {
        block.rotation.y += 0.0025 + index * 0.0008;
      });
    },
  };
}

function buildFormulateVisual(THREE) {
  const group = new THREE.Group();
  const ink = makeLineMaterial(THREE, 0x050505, 0.72);
  const yellow = makeLineMaterial(THREE, 0xffd21a, 0.88);
  const red = makeLineMaterial(THREE, 0xef3028, 0.76);

  const outline = makeSegments(
    THREE,
    [
      [-1.18, 1.2, 0, 0.78, 1.2, 0],
      [0.78, 1.2, 0, 1.18, 0.82, 0],
      [1.18, 0.82, 0, 1.18, -1.2, 0],
      [1.18, -1.2, 0, -1.18, -1.2, 0],
      [-1.18, -1.2, 0, -1.18, 1.2, 0],
      [0.78, 1.2, 0, 0.78, 0.82, 0],
      [0.78, 0.82, 0, 1.18, 0.82, 0],
    ],
    ink
  );
  group.add(outline);

  group.add(
    makeSegments(
      THREE,
      [
        [-0.72, 0.48, 0, 0.72, 0.48, 0],
        [-0.72, 0.06, 0, 0.72, 0.06, 0],
        [-0.72, -0.36, 0, 0.44, -0.36, 0],
        [-0.72, -0.78, 0, 0.18, -0.78, 0],
      ],
      ink
    )
  );

  const scan = makeSegments(THREE, [[-0.96, 0, 0.04, 0.96, 0, 0.04]], yellow);
  const corner = makeSegments(
    THREE,
    [
      [-1.42, 1.42, 0, -0.92, 1.42, 0],
      [-1.42, 1.42, 0, -1.42, 0.92, 0],
      [0.98, -1.42, 0, 1.42, -1.42, 0],
      [1.42, -1.42, 0, 1.42, -0.98, 0],
    ],
    red
  );
  group.add(scan, corner);

  return {
    group,
    update(seconds) {
      group.rotation.y = Math.sin(seconds * 0.36) * 0.18;
      scan.position.y = Math.sin(seconds * 1.1) * 0.82;
      yellow.opacity = 0.62 + Math.sin(seconds * 1.4) * 0.2;
    },
  };
}

function makeLineMaterial(THREE, color, opacity) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
}

function makeSegments(THREE, coordinates, material) {
  const points = [];
  coordinates.forEach(([x1, y1, z1, x2, y2, z2]) => {
    points.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
  });

  return new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(points),
    material
  );
}

function disposeGroup(group) {
  group.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }
  });
}
