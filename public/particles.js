// A decorative background; the interface remains usable without canvas.
(() => {
  const canvas = document.getElementById('backgroundParticles');
  const context = canvas.getContext('2d');
  if (!context) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let particles = [];
  let frame = 0;
  let lastTime = 0;

  function draw(seconds = 0) {
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.x += particle.vx * seconds;
      particle.y -= particle.vy * seconds;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;

      const glow = context.createRadialGradient(
        particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 5
      );
      glow.addColorStop(0, `rgba(104, 218, 255, ${particle.opacity * 0.5})`);
      glow.addColorStop(1, 'rgba(104, 218, 255, 0)');
      context.fillStyle = glow;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = `rgba(170, 232, 255, ${particle.opacity})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(75, Math.max(18, Math.round(width * height / 18000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.6 + Math.random() * 1.2,
      opacity: 0.18 + Math.random() * 0.3,
      vx: (Math.random() - 0.5) * 5,
      vy: 3 + Math.random() * 7
    }));
    draw();
  }

  function animate(time) {
    if (time - lastTime >= 1000 / 30) {
      draw(lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0);
      lastTime = time;
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    cancelAnimationFrame(frame);
    lastTime = 0;
    draw();
    if (!motion.matches && !document.hidden) frame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncMotion);
  motion.addEventListener('change', syncMotion);
  resize();
  syncMotion();
})();
