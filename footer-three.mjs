const canvas = document.querySelector("[data-footer-three]");

if (canvas) {
  initFooterThree(canvas);
}

async function initFooterThree(targetCanvas) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let threeModule;

  try {
    threeModule = await import("https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.js");
  } catch (error) {
    console.warn("Three.js footer animation could not be loaded.", error);
    return;
  }

  const THREE = threeModule;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: targetCanvas,
    powerPreference: "high-performance",
  });

  camera.position.set(0, 0.1, 7);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const system = new THREE.Group();
  scene.add(system);

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1.65, 44, 28),
    new THREE.MeshBasicMaterial({
      color: 0xffd21a,
      transparent: true,
      opacity: 0.74,
      wireframe: true,
    })
  );
  system.add(globe);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.69, 44, 28),
    new THREE.MeshBasicMaterial({
      color: 0xffd21a,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    })
  );
  system.add(glow);

  const orbit = new THREE.Group();
  for (let index = 0; index < 5; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.92 + index * 0.13, 0.006, 8, 120),
      new THREE.MeshBasicMaterial({
        color: index % 2 ? 0xef3028 : 0xffffff,
        transparent: true,
        opacity: index % 2 ? 0.32 : 0.18,
      })
    );
    ring.rotation.x = Math.PI / 2 + index * 0.16;
    ring.rotation.y = index * 0.36;
    orbit.add(ring);
  }
  system.add(orbit);

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 420;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.1 + Math.random() * 1.9;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 3.4;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = height;
    particlePositions[index * 3 + 2] = Math.sin(angle) * radius;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.018,
      transparent: true,
      opacity: 0.62,
    })
  );
  system.add(particles);

  const flagShape = new THREE.Shape();
  flagShape.moveTo(-0.12, 0.95);
  flagShape.lineTo(1.02, 1.22);
  flagShape.lineTo(0.84, 0.58);
  flagShape.lineTo(-0.12, 0.74);
  flagShape.lineTo(-0.12, 0.95);

  const flag = new THREE.Mesh(
    new THREE.ShapeGeometry(flagShape),
    new THREE.MeshBasicMaterial({
      color: 0x050505,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    })
  );
  flag.position.set(-1.95, 0.95, 0.2);
  flag.rotation.z = -0.18;
  system.add(flag);

  const poleGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.93, -1.8, 0.2),
    new THREE.Vector3(-1.93, 1.08, 0.2),
  ]);
  const pole = new THREE.Line(
    poleGeometry,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
    })
  );
  system.add(pole);

  system.rotation.x = -0.08;
  system.rotation.y = -0.32;
  system.position.x = -0.15;

  let frameId = null;
  let width = 0;
  let height = 0;

  const resize = () => {
    const nextWidth = Math.max(1, targetCanvas.clientWidth);
    const nextHeight = Math.max(1, targetCanvas.clientHeight);
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
    const seconds = time * 0.001;
    globe.rotation.y = seconds * 0.16;
    glow.rotation.y = seconds * 0.1;
    orbit.rotation.z = seconds * 0.08;
    particles.rotation.y = seconds * -0.035;
    flag.position.y = 0.95 + Math.sin(seconds * 1.2) * 0.045;
    renderer.render(scene, camera);

    if (!reduceMotion) {
      frameId = window.requestAnimationFrame(render);
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(targetCanvas);

  targetCanvas.classList.add("is-ready");
  render();

  window.addEventListener("pagehide", () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
    resizeObserver.disconnect();
    renderer.dispose();
    particleGeometry.dispose();
  });
}
