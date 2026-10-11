/**
 * hero-3d.js
 * Subtle kinetic ambient field with monochrome drifting particles.
 * Three.js is self-hosted (./vendor/three.module.min.js) and loaded lazily
 * only when the hero canvas exists and reduced-motion is not requested.
 */

let renderer = null;
let scene = null;
let camera = null;
let particlesMesh = null;
let animationFrameId = null;
let isAnimating = false;
let resizeTimeout = null;
let THREE = null;

let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

export async function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    THREE = await import('./vendor/three.module.min.js');
  } catch (err) {
    return;
  }

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, heroSection.clientWidth / heroSection.clientHeight, 0.1, 100);
  camera.position.z = 7;

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance'
  });

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);

  const particleCount = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const darkTone = new THREE.Color(0x18181B);
  const lightTone = new THREE.Color(0xD4D4D8);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

    const mixedColor = darkTone.clone().lerp(lightTone, Math.random() * 0.7);
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.032,
    vertexColors: true,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });

  particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  window.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
  }, { passive: true });

  const clock = new THREE.Clock();

  function render() {
    if (!isAnimating) return;

    const elapsedTime = clock.getElapsedTime();

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    if (particlesMesh) {
      particlesMesh.rotation.y = elapsedTime * 0.02 + mouse.x * 0.08;
      particlesMesh.rotation.x = mouse.y * 0.06;
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(render);
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      clock.start();
      render();
    }
  }

  function stopAnimation() {
    if (isAnimating) {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation();
      } else {
        stopAnimation();
      }
    });
  }, { threshold: 0.05 });

  observer.observe(heroSection);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        startAnimation();
      }
    }
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!renderer || !heroSection || !camera) return;
      const width = heroSection.clientWidth;
      const height = heroSection.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }, 150);
  }, { passive: true });

  startAnimation();
}
