(() => {
  'use strict';

  // ==========================================
  // #region PASO 1: Estructura DOM y Carga Diferida
  // ==========================================
  const canvas = document.querySelector('#animationCanvas');
  const context = canvas.getContext('2d');
  const controlsForm = document.querySelector('#controlsForm');
  const particleCountInput = document.querySelector('#particleCount');
  const particleCountValue = document.querySelector('#particleCountValue');
  const speedInput = document.querySelector('#speed');
  const speedValue = document.querySelector('#speedValue');
  const accentColorInput = document.querySelector('#accentColor');
  const toggleButton = document.querySelector('#toggleButton');
  const resetButton = document.querySelector('#resetButton');
  const statusText = document.querySelector('#statusText');
  const statusChip = document.querySelector('.status-chip');
  const fpsText = document.querySelector('#fpsText');
  const frameCountText = document.querySelector('#frameCount');
  const activeParticlesText = document.querySelector('#activeParticles');
  const loopStateText = document.querySelector('#loopState');
  const validationMessage = document.querySelector('#validationMessage');
  // #endregion PASO 1

  // ==========================================
  // #region PASO 2: Scope, Closures e IIFE
  // ==========================================
  const createAnimationState = () => {
    let animationId = null;
    let isRunning = true;
    let lastTimestamp = 0;
    let frameCount = 0;
    let fps = 0;
    let fpsWindowStart = 0;
    let particles = [];
    let speed = Number(speedInput.value);
    let accentColor = accentColorInput.value;

    // El closure mantiene estas variables privadas entre llamadas de requestAnimationFrame.
    return {
      get animationId() { return animationId; },
      set animationId(value) { animationId = value; },
      get isRunning() { return isRunning; },
      set isRunning(value) { isRunning = value; },
      get lastTimestamp() { return lastTimestamp; },
      set lastTimestamp(value) { lastTimestamp = value; },
      get frameCount() { return frameCount; },
      incrementFrame() { frameCount += 1; },
      get fps() { return fps; },
      set fps(value) { fps = value; },
      get fpsWindowStart() { return fpsWindowStart; },
      set fpsWindowStart(value) { fpsWindowStart = value; },
      get particles() { return particles; },
      set particles(value) { particles = value; },
      get speed() { return speed; },
      set speed(value) { speed = value; },
      get accentColor() { return accentColor; },
      set accentColor(value) { accentColor = value; }
    };
  };

  const state = createAnimationState();
  // #endregion PASO 2

  // ==========================================
  // #region PASO 3: Manipulacion del DOM e Interaccion
  // ==========================================
  const validateParticleCount = () => {
    const count = Number(particleCountInput.value);
    const isValid = Number.isInteger(count) && count >= 8 && count <= 120;
    validationMessage.textContent = isValid ? '' : 'El numero debe estar entre 8 y 120.';
    return isValid;
  };

  const updateControlLabels = () => {
    particleCountValue.textContent = particleCountInput.value;
    speedValue.textContent = `${Number(speedInput.value).toFixed(1)}x`;
    activeParticlesText.textContent = state.particles.length;
  };

  const setRunningState = (running) => {
    state.isRunning = running;
    toggleButton.textContent = running ? 'Pausar' : 'Continuar';
    statusText.textContent = running ? 'Animacion activa' : 'Animacion pausada';
    loopStateText.textContent = running ? 'RUNNING' : 'PAUSED';
    statusChip.classList.toggle('is-paused', !running);
  };

  const handleParticleCountChange = () => {
    if (validateParticleCount()) {
      createParticles(Number(particleCountInput.value));
      updateControlLabels();
    }
  };

  const handleSpeedChange = () => {
    state.speed = Number(speedInput.value);
    updateControlLabels();
  };

  const handleColorChange = () => {
    state.accentColor = accentColorInput.value;
  };

  const handleToggle = () => {
    if (state.isRunning) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  const handleFormSubmit = (event) => event.preventDefault();

  const handleReset = () => {
    particleCountInput.value = '42';
    speedInput.value = '1';
    accentColorInput.value = '#f4b942';
    state.speed = 1;
    state.accentColor = '#f4b942';
    createParticles(42);
    updateControlLabels();
    validationMessage.textContent = '';
    setRunningState(true);
    startAnimation();
  };

  particleCountInput.addEventListener('input', handleParticleCountChange);
  speedInput.addEventListener('input', handleSpeedChange);
  accentColorInput.addEventListener('input', handleColorChange);
  toggleButton.addEventListener('click', handleToggle);
  resetButton.addEventListener('click', handleReset);
  controlsForm.addEventListener('submit', handleFormSubmit);
  // #endregion PASO 3

  // ==========================================
  // #region PASO 4: Loop de Animacion en Canvas 2D
  // ==========================================
  const resizeCanvas = () => {
    const pixelRatio = window.devicePixelRatio || 1;
    const bounds = canvas.getBoundingClientRect();
    canvas.width = Math.floor(bounds.width * pixelRatio);
    canvas.height = Math.floor(bounds.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const createParticle = (x = Math.random() * canvas.clientWidth, y = Math.random() * canvas.clientHeight) => ({
    x,
    y,
    radius: 2 + Math.random() * 4,
    velocityX: (Math.random() - 0.5) * 90,
    velocityY: (Math.random() - 0.5) * 90,
    life: 1
  });

  const createParticles = (amount) => {
    state.particles = Array.from({ length: amount }, () => createParticle());
  };

  const addBurst = (event) => {
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    state.particles = [...state.particles, ...Array.from({ length: 12 }, () => createParticle(x, y))].slice(-120);
    updateControlLabels();
  };

  const updateParticles = (deltaTime) => {
    state.particles.forEach((particle) => {
      particle.x += particle.velocityX * deltaTime * state.speed;
      particle.y += particle.velocityY * deltaTime * state.speed;
      particle.life -= deltaTime * 0.08;
      if (particle.x < 0 || particle.x > canvas.clientWidth) particle.velocityX *= -1;
      if (particle.y < 0 || particle.y > canvas.clientHeight) particle.velocityY *= -1;
    });
  };

  const drawScene = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#102e35';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'rgba(244, 185, 66, 0.1)';
    context.beginPath();
    context.moveTo(width * 0.08, height * 0.82);
    context.lineTo(width * 0.92, height * 0.18);
    context.stroke();
    state.particles.forEach((particle) => {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = state.accentColor;
      context.globalAlpha = Math.max(0.25, particle.life);
      context.fill();
    });
    context.globalAlpha = 1;
  };

  const animate = (timestamp) => {
    if (!state.isRunning) return;
    if (!state.lastTimestamp) state.lastTimestamp = timestamp;
    const deltaTime = Math.min((timestamp - state.lastTimestamp) / 1000, 0.05);
    state.lastTimestamp = timestamp;
    updateParticles(deltaTime);
    drawScene();
    state.incrementFrame();
    if (!state.fpsWindowStart) state.fpsWindowStart = timestamp;
    if (timestamp - state.fpsWindowStart >= 500) {
      state.fps = Math.round((state.frameCount * 1000) / (timestamp - state.fpsWindowStart));
      state.fpsWindowStart = timestamp;
      fpsText.textContent = `FPS ${state.fps}`;
    }
    frameCountText.textContent = state.frameCount;
    state.animationId = requestAnimationFrame(animate);
  };
  // #endregion PASO 4

  // ==========================================
  // #region PASO 5: Optimizacion, Metricas y Desmontaje
  // ==========================================
  const startAnimation = () => {
    if (state.animationId !== null) cancelAnimationFrame(state.animationId);
    state.lastTimestamp = 0;
    state.isRunning = true;
    setRunningState(true);
    state.animationId = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (state.animationId !== null) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    setRunningState(false);
  };

  const teardown = () => {
    stopAnimation();
    particleCountInput.removeEventListener('input', handleParticleCountChange);
    speedInput.removeEventListener('input', handleSpeedChange);
    accentColorInput.removeEventListener('input', handleColorChange);
    toggleButton.removeEventListener('click', handleToggle);
    resetButton.removeEventListener('click', handleReset);
    controlsForm.removeEventListener('submit', handleFormSubmit);
    canvas.removeEventListener('click', addBurst);
    window.removeEventListener('resize', resizeCanvas);
  };

  canvas.addEventListener('click', addBurst);
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('pagehide', teardown, { once: true });
  resizeCanvas();
  createParticles(Number(particleCountInput.value));
  updateControlLabels();
  startAnimation();
  // #endregion PASO 5
})();