(() => {
  'use strict';

  // ==========================================
  // #region PASO 1: Setup HTML + UI con Canvas y Controles
  // ==========================================
  const setupCanvas = document.querySelector('#setupCanvas');
  const setupContext = setupCanvas.getContext('2d');
  const displayText = document.querySelector('#displayText');
  const setupSpeed = document.querySelector('#setupSpeed');
  const setupSpeedValue = document.querySelector('#setupSpeedValue');
  const setupMessage = document.querySelector('#setupMessage');
  const setupState = {
    animationId: null,
    isRunning: true,
    angle: 0,
    speed: Number(setupSpeed.value)
  };

  const resizeSetupCanvas = () => {
    const bounds = setupCanvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    setupCanvas.width = Math.floor(bounds.width * pixelRatio);
    setupCanvas.height = Math.floor(bounds.height * pixelRatio);
    setupContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const drawSetupCanvas = () => {
    const width = setupCanvas.clientWidth;
    const height = setupCanvas.clientHeight;
    setupContext.clearRect(0, 0, width, height);
    setupContext.fillStyle = '#061525';
    setupContext.fillRect(0, 0, width, height);
    setupContext.strokeStyle = 'rgba(82, 168, 255, .16)';
    setupContext.lineWidth = 1;
    for (let x = 0; x < width; x += 28) {
      setupContext.beginPath();
      setupContext.moveTo(x, 0);
      setupContext.lineTo(x, height);
      setupContext.stroke();
    }
    for (let y = 0; y < height; y += 28) {
      setupContext.beginPath();
      setupContext.moveTo(0, y);
      setupContext.lineTo(width, y);
      setupContext.stroke();
    }
    const centerX = width / 2;
    const centerY = height / 2;
    const orbitX = centerX + Math.cos(setupState.angle) * 55;
    const orbitY = centerY + Math.sin(setupState.angle) * 26;
    setupContext.beginPath();
    setupContext.arc(orbitX, orbitY, 8, 0, Math.PI * 2);
    setupContext.fillStyle = '#52a8ff';
    setupContext.fill();
    setupContext.fillStyle = '#e9f1fa';
    setupContext.font = '700 22px system-ui, sans-serif';
    setupContext.textAlign = 'center';
    setupContext.fillText(displayText.value || 'Canvas', centerX, centerY + 8);
  };

  const animateSetupCanvas = (timestamp) => {
    if (!setupState.isRunning) return;
    setupState.angle = timestamp * 0.001 * setupState.speed;
    drawSetupCanvas();
    setupState.animationId = requestAnimationFrame(animateSetupCanvas);
  };

  const startSetupAnimation = () => {
    if (setupState.animationId === null) setupState.animationId = requestAnimationFrame(animateSetupCanvas);
    setupState.isRunning = true;
    setupMessage.textContent = 'Loop base ejecutándose con requestAnimationFrame.';
  };

  const stopSetupAnimation = () => {
    setupState.isRunning = false;
    if (setupState.animationId !== null) {
      cancelAnimationFrame(setupState.animationId);
      setupState.animationId = null;
    }
    drawSetupCanvas();
    setupMessage.textContent = 'Animación pausada. El canvas conserva su último frame.';
  };

  const resetSetupAnimation = () => {
    setupState.angle = 0;
    setupSpeed.value = '1';
    setupState.speed = 1;
    setupSpeedValue.textContent = '1.0x';
    displayText.value = 'Semana 04';
    drawSetupCanvas();
    startSetupAnimation();
    setupMessage.textContent = 'Canvas reiniciado con su configuración inicial.';
  };

  const handleSetupText = () => drawSetupCanvas();
  const handleSetupSpeed = () => {
    setupState.speed = Number(setupSpeed.value);
    setupSpeedValue.textContent = `${setupState.speed.toFixed(1)}x`;
  };
  const handleSetupResize = () => {
    resizeSetupCanvas();
    drawSetupCanvas();
  };

  document.querySelector('#setupPlay').addEventListener('click', startSetupAnimation);
  document.querySelector('#setupPause').addEventListener('click', stopSetupAnimation);
  document.querySelector('#setupReset').addEventListener('click', resetSetupAnimation);
  displayText.addEventListener('input', handleSetupText);
  setupSpeed.addEventListener('input', handleSetupSpeed);
  window.addEventListener('resize', handleSetupResize);
  resizeSetupCanvas();
  drawSetupCanvas();
  startSetupAnimation();
  // #endregion PASO 1

  // ==========================================
  // #region PASO 2: IIFE + Closures + Arrow Functions
  // ==========================================
  const createPrivateCounter = () => {
    let count = 0;
    let clicks = 0;

    // El closure conserva count y clicks dentro de esta función, sin exponerlos como variables globales.
    return {
      increment: () => {
        count += 1;
        clicks += 1;
        return { count, clicks };
      },
      read: () => ({ count, clicks })
    };
  };

  const privateCounter = createPrivateCounter();
  const closureFrames = document.querySelector('#closureFrames');
  const closureClicks = document.querySelector('#closureClicks');
  const closureCount = document.querySelector('#closureCount');
  const closureAction = document.querySelector('#closureAction');
  let closureFrameTotal = 0;
  let closureAnimationId = null;

  const renderClosureMetrics = () => {
    const metrics = privateCounter.read();
    closureFrames.textContent = closureFrameTotal;
    closureClicks.textContent = metrics.clicks;
    closureCount.textContent = metrics.count;
  };

  const handleClosureIncrement = () => {
    privateCounter.increment();
    closureAction.textContent = 'Contador incrementado desde el closure';
    renderClosureMetrics();
  };

  const updateClosureFrames = () => {
    closureFrameTotal += 1;
    if (closureFrameTotal % 6 === 0) renderClosureMetrics();
    closureAnimationId = requestAnimationFrame(updateClosureFrames);
  };

  document.querySelector('#closureIncrement').addEventListener('click', handleClosureIncrement);
  requestAnimationFrame(updateClosureFrames);
  renderClosureMetrics();
  // #endregion PASO 2

  // ==========================================
  // #region PASO 3: Manipulación DOM + Validación
  // ==========================================
  const dynamicBox = document.querySelector('#dynamicBox');
  const toggleHighlight = document.querySelector('#toggleHighlight');
  const addPulse = document.querySelector('#addPulse');
  const resetDom = document.querySelector('#resetDom');
  const emailInput = document.querySelector('#emailInput');
  const emailMessage = document.querySelector('#emailMessage');
  const emailIcon = document.querySelector('#emailIcon');
  const emailValidation = emailIcon.parentElement;

  const validateEmail = () => {
    const value = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isEmpty = value.length === 0;
    emailValidation.classList.toggle('is-valid', isValid);
    emailValidation.classList.toggle('is-invalid', !isValid && !isEmpty);
    emailMessage.classList.toggle('is-valid', isValid);
    emailMessage.classList.toggle('is-invalid', !isValid && !isEmpty);
    emailIcon.textContent = isValid ? '✓' : (!isEmpty ? '×' : '○');
    emailMessage.textContent = isValid ? 'Correo válido: el formato cumple la validación.' : (!isEmpty ? 'Revisa el formato: ejemplo@dominio.com.' : 'Escribe un correo para validarlo en tiempo real.');
  };

  const handleToggleHighlight = () => dynamicBox.classList.toggle('is-highlighted');
  const handlePulse = () => {
    dynamicBox.classList.remove('is-pulsing');
    requestAnimationFrame(() => dynamicBox.classList.add('is-pulsing'));
  };
  const handleResetDom = () => {
    dynamicBox.classList.remove('is-highlighted', 'is-pulsing');
    emailInput.value = '';
    validateEmail();
  };

  toggleHighlight.addEventListener('click', handleToggleHighlight);
  addPulse.addEventListener('click', handlePulse);
  resetDom.addEventListener('click', handleResetDom);
  emailInput.addEventListener('input', validateEmail);
  // #endregion PASO 3

  // ==========================================
  // #region PASO 4: Canvas API + requestAnimationFrame
  // ==========================================
  const particleCanvas = document.querySelector('#particleCanvas');
  const particleContext = particleCanvas.getContext('2d');
  const particleCountText = document.querySelector('#particleCount');
  const deltaValue = document.querySelector('#deltaValue');
  const particleMessage = document.querySelector('#particleMessage');
  const particleState = {
    animationId: null,
    lastTimestamp: 0,
    isRunning: false,
    particles: []
  };

  const resizeParticleCanvas = () => {
    const bounds = particleCanvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    particleCanvas.width = Math.floor(bounds.width * pixelRatio);
    particleCanvas.height = Math.floor(bounds.height * pixelRatio);
    particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const makeParticle = (x = Math.random() * particleCanvas.clientWidth, y = Math.random() * particleCanvas.clientHeight) => ({
    x,
    y,
    radius: 2 + Math.random() * 3,
    velocityX: (Math.random() - .5) * 80,
    velocityY: (Math.random() - .5) * 80
  });

  const seedParticles = (amount = 24) => {
    particleState.particles = Array.from({ length: amount }, () => makeParticle());
    particleCountText.textContent = particleState.particles.length;
  };

  const updateParticles = (dt) => {
    particleState.particles.forEach((particle) => {
      particle.x += particle.velocityX * dt;
      particle.y += particle.velocityY * dt;
      if (particle.x < 0 || particle.x > particleCanvas.clientWidth) particle.velocityX *= -1;
      if (particle.y < 0 || particle.y > particleCanvas.clientHeight) particle.velocityY *= -1;
    });
  };

  const drawParticles = () => {
    const width = particleCanvas.clientWidth;
    const height = particleCanvas.clientHeight;
    particleContext.clearRect(0, 0, width, height);
    particleContext.fillStyle = '#061525';
    particleContext.fillRect(0, 0, width, height);
    particleContext.strokeStyle = 'rgba(61, 213, 208, .14)';
    particleContext.beginPath();
    particleContext.moveTo(0, height * .78);
    particleContext.lineTo(width, height * .22);
    particleContext.stroke();
    particleState.particles.forEach((particle) => {
      particleContext.beginPath();
      particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      particleContext.fillStyle = '#3dd5d0';
      particleContext.fill();
    });
  };

  const animateParticles = (timestamp) => {
    if (!particleState.isRunning) return;
    if (!particleState.lastTimestamp) particleState.lastTimestamp = timestamp;
    const dt = Math.min((timestamp - particleState.lastTimestamp) / 1000, .05);
    particleState.lastTimestamp = timestamp;
    updateParticles(dt);
    drawParticles();
    deltaValue.textContent = `${Math.round(dt * 1000)} ms`;
    particleState.animationId = requestAnimationFrame(animateParticles);
    updatePerformanceReading(dt);
  };

  const startParticleAnimation = () => {
    if (particleState.animationId !== null) cancelAnimationFrame(particleState.animationId);
    particleState.lastTimestamp = 0;
    particleState.isRunning = true;
    particleMessage.textContent = 'Loop continuo activo: cada frame calcula su dt.';
    particleState.animationId = requestAnimationFrame(animateParticles);
  };

  const stopParticleAnimation = () => {
    particleState.isRunning = false;
    if (particleState.animationId !== null) {
      cancelAnimationFrame(particleState.animationId);
      particleState.animationId = null;
    }
    particleMessage.textContent = 'Loop detenido con cancelAnimationFrame.';
  };

  const addParticle = () => {
    particleState.particles.push(makeParticle(particleCanvas.clientWidth / 2, particleCanvas.clientHeight / 2));
    particleCountText.textContent = particleState.particles.length;
    drawParticles();
  };

  const handleParticleResize = () => {
    resizeParticleCanvas();
    drawParticles();
  };

  document.querySelector('#particleStart').addEventListener('click', startParticleAnimation);
  document.querySelector('#particleStop').addEventListener('click', stopParticleAnimation);
  document.querySelector('#particleAdd').addEventListener('click', addParticle);
  window.addEventListener('resize', handleParticleResize);
  resizeParticleCanvas();
  seedParticles();
  drawParticles();
  // #endregion PASO 4

  // ==========================================
  // #region PASO 5: Monitor de Rendimiento y Optimización
  // ==========================================
  const perfFps = document.querySelector('#perfFps');
  const perfMemory = document.querySelector('#perfMemory');
  const perfListeners = document.querySelector('#perfListeners');
  const perfLeaks = document.querySelector('#perfLeaks');
  const listenerState = document.querySelector('#listenerState');
  const performanceMessage = document.querySelector('#performanceMessage');
  const chartStatus = document.querySelector('#chartStatus');
  const fpsChart = document.querySelector('#fpsChart');
  const performanceState = {
    fpsHistory: [],
    lastFrame: 0,
    sampleFrames: 0,
    sampleStart: 0,
    fps: 0,
    simulatedLeaks: 0,
    activeListeners: 13
  };

  const buildChart = () => {
    fpsChart.replaceChildren();
    performanceState.fpsHistory.forEach((fps) => {
      const bar = document.createElement('span');
      bar.className = 'chart-bar';
      bar.setAttribute('aria-label', `${fps} FPS`);
      const level = Math.max(10, Math.min(100, Math.round((fps / 60) * 10) * 10));
      bar.dataset.level = level;
      fpsChart.appendChild(bar);
    });
  };

  const getMemoryEstimate = () => {
    const particleMemory = particleState.particles.length * 0.12;
    const leakMemory = performanceState.simulatedLeaks * 1.8;
    return (4.8 + particleMemory + leakMemory).toFixed(1);
  };

  const updatePerformanceReading = (dt) => {
    const timestamp = performance.now();
    performanceState.sampleFrames += 1;
    if (!performanceState.sampleStart) performanceState.sampleStart = timestamp;
    if (timestamp - performanceState.sampleStart >= 500) {
      performanceState.fps = Math.round((performanceState.sampleFrames * 1000) / (timestamp - performanceState.sampleStart));
      performanceState.sampleFrames = 0;
      performanceState.sampleStart = timestamp;
      performanceState.fpsHistory.push(performanceState.fps);
      performanceState.fpsHistory = performanceState.fpsHistory.slice(-18);
      buildChart();
    }
    performanceState.lastFrame = dt;
    perfFps.textContent = performanceState.fps ? performanceState.fps : '--';
    perfMemory.textContent = `${getMemoryEstimate()} MB`;
    perfListeners.textContent = performanceState.activeListeners + performanceState.simulatedLeaks;
    perfLeaks.textContent = performanceState.simulatedLeaks;
  };

  const analyzePerformance = () => {
    chartStatus.textContent = 'Analizado';
    performanceMessage.textContent = performanceState.fps >= 50 ? 'Rendimiento estable: el loop mantiene una cadencia saludable.' : 'Muestra insuficiente: inicia la animación para obtener más datos.';
    chartStatus.classList.add('is-analyzed');
  };

  const simulateMemoryLeak = () => {
    performanceState.simulatedLeaks += 3;
    perfLeaks.textContent = performanceState.simulatedLeaks;
    perfListeners.textContent = performanceState.activeListeners + performanceState.simulatedLeaks;
    perfMemory.textContent = `${getMemoryEstimate()} MB`;
    listenerState.textContent = 'requieren limpieza';
    performanceMessage.textContent = 'Simulación creada: listeners huérfanos detectados por el monitor.';
  };

  const cleanMemory = () => {
    performanceState.simulatedLeaks = 0;
    perfLeaks.textContent = '0';
    perfListeners.textContent = performanceState.activeListeners;
    perfMemory.textContent = `${getMemoryEstimate()} MB`;
    listenerState.textContent = 'registrados';
    performanceMessage.textContent = 'Memoria limpia: referencias y listeners simulados liberados.';
  };

  document.querySelector('#analyzePerformance').addEventListener('click', analyzePerformance);
  document.querySelector('#simulateLeak').addEventListener('click', simulateMemoryLeak);
  document.querySelector('#cleanMemory').addEventListener('click', cleanMemory);
  performanceState.fpsHistory = [48, 52, 55, 58, 57, 60, 59, 60];
  buildChart();
  updatePerformanceReading(0);
  startParticleAnimation();
  // #endregion PASO 5

  // ==========================================
  // #region NAVEGACIÓN Y DESMONTAJE
  // ==========================================
  const stepCards = [...document.querySelectorAll('.step-card')];
  const progressValue = document.querySelector('#progressValue');
  const progressBar = document.querySelector('#progressBar');

  const updateProgress = () => {
    const viewportMiddle = window.innerHeight * .55;
    const activeStep = stepCards.reduce((closest, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().top - viewportMiddle);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity });
    const stepNumber = activeStep.index + 1;
    progressValue.textContent = `${stepNumber} / 5`;
    progressBar.classList.remove('progress-20', 'progress-40', 'progress-60', 'progress-80', 'progress-100');
    progressBar.classList.add(`progress-${stepNumber * 20}`);
    stepCards.forEach((card, index) => card.classList.toggle('is-complete', index < activeStep.index));
  };

  const teardown = () => {
    stopSetupAnimation();
    stopParticleAnimation();
    if (closureAnimationId !== null) cancelAnimationFrame(closureAnimationId);
    window.removeEventListener('resize', handleSetupResize);
    window.removeEventListener('resize', handleParticleResize);
    window.removeEventListener('scroll', updateProgress);
    listenerState.textContent = 'desmontados';
  };

  progressBar.classList.add('progress-20');
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('pagehide', teardown, { once: true });
  // #endregion NAVEGACIÓN Y DESMONTAJE
})();
