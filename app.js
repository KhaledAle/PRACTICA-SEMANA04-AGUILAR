(() => {
  'use strict';

  // ==========================================
  // #region PASO 1: Explorador de Planetas
  // Efecto implementado: Sol brillante que gira y muestra el nombre del astronauta.
  // Concepto técnico aplicado: IIFE para encapsular la práctica, DOM manipulation para
  // leer controles y requestAnimationFrame para actualizar el Canvas sin bloquear la UI.
  // ==========================================
  const setupCanvas = document.querySelector('#setupCanvas');
  const setupContext = setupCanvas.getContext('2d');
  const displayText = document.querySelector('#displayText');
  const setupSpeed = document.querySelector('#setupSpeed');
  const setupSpeedValue = document.querySelector('#setupSpeedValue');
  const setupMessage = document.querySelector('#setupMessage');
  const setupPlay = document.querySelector('#setupPlay');
  const setupPause = document.querySelector('#setupPause');
  const setupReset = document.querySelector('#setupReset');
  const setupState = { animationId: null, isRunning: true, angle: 0, speed: 1, lastTimestamp: 0 };

  const resizeSetupCanvas = () => {
    const bounds = setupCanvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    setupCanvas.width = Math.floor(bounds.width * ratio);
    setupCanvas.height = Math.floor(bounds.height * ratio);
    setupContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const drawSetupCanvas = () => {
    const width = setupCanvas.clientWidth;
    const height = setupCanvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const text = displayText.value.trim() || 'Astronauta';
    const orbitRadiusX = Math.min(105, width * .23);
    const orbitRadiusY = Math.min(58, height * .25);
    const sunX = centerX;
    const sunY = centerY;
    const textX = centerX + Math.cos(setupState.angle) * orbitRadiusX;
    const textY = centerY + Math.sin(setupState.angle) * orbitRadiusY;
    setupContext.clearRect(0, 0, width, height);
    setupContext.fillStyle = '#0d123b';
    setupContext.fillRect(0, 0, width, height);
    for (let index = 0; index < 35; index += 1) {
      setupContext.fillStyle = index % 3 === 0 ? '#ffe58b' : '#ffffff';
      setupContext.globalAlpha = index % 3 === 0 ? .7 : .3;
      setupContext.beginPath();
      setupContext.arc((index * 83) % width, (index * 47) % height, index % 3 + 1, 0, Math.PI * 2);
      setupContext.fill();
    }
    setupContext.globalAlpha = 1;
    const glow = setupContext.createRadialGradient(sunX, sunY, 12, sunX, sunY, 80);
    glow.addColorStop(0, '#fff4ad');
    glow.addColorStop(.45, '#ffc857');
    glow.addColorStop(1, 'rgba(255,120,168,0)');
    setupContext.fillStyle = glow;
    setupContext.beginPath();
    setupContext.arc(sunX, sunY, 82, 0, Math.PI * 2);
    setupContext.fill();
    setupContext.fillStyle = '#ffc857';
    setupContext.beginPath();
    setupContext.arc(sunX, sunY, 48, 0, Math.PI * 2);
    setupContext.fill();
    setupContext.fillStyle = '#fffdf6';
    setupContext.font = '700 20px Trebuchet MS, sans-serif';
    setupContext.textAlign = 'center';
    setupContext.fillText(text, textX, textY + 7);
    setupContext.fillStyle = '#452c00';
    setupContext.font = '700 12px Trebuchet MS, sans-serif';
    setupContext.fillText('SOL', sunX, sunY + 5);
  };

  const animateSetup = (timestamp) => {
    if (!setupState.isRunning) return;
    if (!setupState.lastTimestamp) setupState.lastTimestamp = timestamp;
    const deltaTime = Math.min((timestamp - setupState.lastTimestamp) / 1000, .05);
    setupState.lastTimestamp = timestamp;
    setupState.angle += deltaTime * setupState.speed * 1.4;
    drawSetupCanvas();
    setupState.animationId = requestAnimationFrame(animateSetup);
  };

  const playSetup = () => {
    setupState.isRunning = true;
    setupState.lastTimestamp = 0;
    if (setupState.animationId === null) setupState.animationId = requestAnimationFrame(animateSetup);
    setupMessage.textContent = 'El Sol está girando. ¡Misión en marcha!';
  };

  const pauseSetup = () => {
    setupState.isRunning = false;
    if (setupState.animationId !== null) cancelAnimationFrame(setupState.animationId);
    setupState.animationId = null;
    setupState.lastTimestamp = 0;
    setupMessage.textContent = 'Vista pausada. Puedes continuar cuando quieras.';
  };

  const resetSetup = () => {
    displayText.value = 'Astronauta';
    setupSpeed.value = '1';
    setupState.speed = 1;
    setupState.angle = 0;
    setupState.lastTimestamp = 0;
    setupSpeedValue.textContent = '1.0x';
    playSetup();
    drawSetupCanvas();
    setupMessage.textContent = 'La nave volvió a su punto de partida.';
  };

  const handleSetupText = () => drawSetupCanvas();
  const handleSetupSpeed = () => {
    setupState.speed = Number(setupSpeed.value);
    setupSpeedValue.textContent = `${setupState.speed.toFixed(1)}x`;
  };
  const handleSetupResize = () => { resizeSetupCanvas(); drawSetupCanvas(); };
  setupPlay.addEventListener('click', playSetup);
  setupPause.addEventListener('click', pauseSetup);
  setupReset.addEventListener('click', resetSetup);
  displayText.addEventListener('input', handleSetupText);
  setupSpeed.addEventListener('input', handleSetupSpeed);
  window.addEventListener('resize', handleSetupResize);
  resizeSetupCanvas();
  drawSetupCanvas();
  playSetup();
  // #endregion PASO 1

  // ==========================================
  // #region PASO 2: Scope y Closures
  // Efecto implementado: contador de estrellas y datos descubiertos.
  // Concepto técnico aplicado: Closure privado; count vive en el scope de la fábrica y
  // sus métodos lo retienen entre clicks sin exponer una variable global.
  // ==========================================
  const createDiscoveryCounter = () => {
    let count = 0;
    return {
      discover: () => { count += 1; return count; },
      read: () => count
    };
  };
  const discoveryCounter = createDiscoveryCounter();
  const closureCount = document.querySelector('#closureCount');
  const closureAction = document.querySelector('#closureAction');
  const closureIncrement = document.querySelector('#closureIncrement');
  const handleDiscovery = () => {
    const discoveries = discoveryCounter.discover();
    closureCount.textContent = discoveries;
    closureAction.textContent = discoveries === 1 ? '¡Encontraste tu primer dato!' : '¡Tu diario tiene un nuevo descubrimiento!';
  };
  closureIncrement.addEventListener('click', handleDiscovery);
  // #endregion PASO 2

  // ==========================================
  // #region PASO 3: Manipulación DOM y Validación
  // Efecto implementado: ficha de Marte con brillo, pulso y registro del explorador.
  // Concepto técnico aplicado: DOM manipulation con classList.toggle/add/remove y
  // validación dinámica; los estados visuales viven en CSS, sin estilos inline.
  // ==========================================
  const marsCard = document.querySelector('#dynamicBox');
  const toggleHighlight = document.querySelector('#toggleHighlight');
  const addPulse = document.querySelector('#addPulse');
  const resetDom = document.querySelector('#resetDom');
  const explorerInput = document.querySelector('#emailInput');
  const explorerMessage = document.querySelector('#emailMessage');

  const validateExplorer = () => {
    const value = explorerInput.value.trim();
    const isValid = value.length >= 2;
    explorerMessage.classList.toggle('is-valid', isValid);
    explorerMessage.classList.toggle('is-invalid', !isValid && value.length > 0);
    explorerMessage.textContent = isValid ? `¡Hola, ${value}! Marte te espera.` : value ? 'Escribe al menos dos letras, astronauta.' : '¿Cómo se llama el explorador?';
  };
  const handleHighlight = () => marsCard.classList.toggle('is-highlighted');
  const handlePulse = () => {
    marsCard.classList.remove('is-pulsing');
    requestAnimationFrame(() => marsCard.classList.add('is-pulsing'));
  };
  const handleDomReset = () => { marsCard.classList.remove('is-highlighted', 'is-pulsing'); explorerInput.value = ''; validateExplorer(); };
  toggleHighlight.addEventListener('click', handleHighlight);
  addPulse.addEventListener('click', handlePulse);
  resetDom.addEventListener('click', handleDomReset);
  explorerInput.addEventListener('input', validateExplorer);
  // #endregion PASO 3

  // ==========================================
  // #region PASO 4: Canvas API y requestAnimationFrame
  // Efecto implementado: planetas de colores orbitando alrededor del Sol.
  // Concepto técnico aplicado: Canvas 2D, requestAnimationFrame y tiempo delta (dt)
  // para que la velocidad sea uniforme aunque cambien los frames por segundo.
  // ==========================================
  const orbitCanvas = document.querySelector('#particleCanvas');
  const orbitContext = orbitCanvas.getContext('2d');
  const particleCount = document.querySelector('#particleCount');
  const deltaValue = document.querySelector('#deltaValue');
  const particleMessage = document.querySelector('#particleMessage');
  const particleState = { animationId: null, isRunning: false, lastTimestamp: 0, gravity: 1, particles: [] };
  const planetColors = ['#68c5ff', '#ff78a8', '#75e0c1', '#ffe58b', '#ed746e', '#c8a7ff'];

  const resizeOrbitCanvas = () => {
    const bounds = orbitCanvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    orbitCanvas.width = Math.floor(bounds.width * ratio);
    orbitCanvas.height = Math.floor(bounds.height * ratio);
    orbitContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const makePlanet = (index = particleState.particles.length) => ({ angle: Math.random() * Math.PI * 2, orbit: 35 + index * 22, size: 4 + (index % 3) * 2, speed: .45 + index * .08, color: planetColors[index % planetColors.length] });
  const seedPlanets = () => { particleState.particles = Array.from({ length: 5 }, (_, index) => makePlanet(index)); particleCount.textContent = particleState.particles.length; };
  const drawOrbitScene = () => {
    const width = orbitCanvas.clientWidth;
    const height = orbitCanvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxOrbit = Math.min(width, height) * .43;
    orbitContext.clearRect(0, 0, width, height);
    orbitContext.fillStyle = '#0d123b';
    orbitContext.fillRect(0, 0, width, height);
    for (let star = 0; star < 38; star += 1) { orbitContext.fillStyle = star % 4 === 0 ? '#ffe58b' : '#ffffff'; orbitContext.globalAlpha = .35; orbitContext.fillRect((star * 61) % width, (star * 37) % height, 2, 2); }
    orbitContext.globalAlpha = 1;
    particleState.particles.forEach((planet) => { orbitContext.beginPath(); orbitContext.strokeStyle = 'rgba(255,255,255,.16)'; orbitContext.arc(centerX, centerY, Math.min(planet.orbit, maxOrbit), 0, Math.PI * 2); orbitContext.stroke(); });
    const sun = orbitContext.createRadialGradient(centerX, centerY, 5, centerX, centerY, 30); sun.addColorStop(0, '#fff4ad'); sun.addColorStop(1, '#ff9d38'); orbitContext.fillStyle = sun; orbitContext.beginPath(); orbitContext.arc(centerX, centerY, 22, 0, Math.PI * 2); orbitContext.fill();
    particleState.particles.forEach((planet) => { const radius = Math.min(planet.orbit, maxOrbit); const x = centerX + Math.cos(planet.angle) * radius; const y = centerY + Math.sin(planet.angle) * radius; orbitContext.fillStyle = planet.color; orbitContext.beginPath(); orbitContext.arc(x, y, planet.size, 0, Math.PI * 2); orbitContext.fill(); });
  };
  const animateOrbits = (timestamp) => {
    if (!particleState.isRunning) return;
    if (!particleState.lastTimestamp) particleState.lastTimestamp = timestamp;
    const dt = Math.min((timestamp - particleState.lastTimestamp) / 1000, .05);
    particleState.lastTimestamp = timestamp;
    particleState.particles.forEach((planet) => { planet.angle += dt * planet.speed * particleState.gravity; });
    drawOrbitScene();
    deltaValue.textContent = `${Math.round(dt * 1000)} ms`;
    particleState.animationId = requestAnimationFrame(animateOrbits);
    updatePerformanceReading(dt);
  };
  const startOrbits = () => { if (particleState.animationId !== null) cancelAnimationFrame(particleState.animationId); particleState.isRunning = true; particleState.lastTimestamp = 0; particleMessage.textContent = '¡Los planetas están viajando!'; particleState.animationId = requestAnimationFrame(animateOrbits); };
  const stopOrbits = () => { particleState.isRunning = false; if (particleState.animationId !== null) cancelAnimationFrame(particleState.animationId); particleState.animationId = null; particleMessage.textContent = 'Órbitas detenidas para observar mejor.'; };
  const addPlanet = () => { particleState.particles.push(makePlanet()); particleCount.textContent = particleState.particles.length; drawOrbitScene(); particleMessage.textContent = '¡Nuevo planeta incorporado a la misión!'; };
  const increaseGravity = () => { particleState.gravity = particleState.gravity >= 2 ? 1 : particleState.gravity + .5; particleMessage.textContent = `Gravedad espacial: ${particleState.gravity.toFixed(1)}x`; };
  const handleOrbitResize = () => { resizeOrbitCanvas(); drawOrbitScene(); };
  document.querySelector('#particleStart').addEventListener('click', startOrbits);
  document.querySelector('#particleStop').addEventListener('click', stopOrbits);
  document.querySelector('#particleAdd').addEventListener('click', addPlanet);
  document.querySelector('#gravityButton').addEventListener('click', increaseGravity);
  window.addEventListener('resize', handleOrbitResize);
  resizeOrbitCanvas(); seedPlanets(); drawOrbitScene();
  // #endregion PASO 4

  // ==========================================
  // #region PASO 5: Centro de Mando y Memory Cleanup
  // Efecto implementado: monitor espacial de FPS, memoria, elementos activos y fugas.
  // Concepto técnico aplicado: cancelAnimationFrame y removeEventListener para detener
  // cohetes y remover listeners huérfanos, evitando callbacks y memory leaks.
  // ==========================================
  const perfFps = document.querySelector('#perfFps');
  const perfMemory = document.querySelector('#perfMemory');
  const perfListeners = document.querySelector('#perfListeners');
  const perfLeaks = document.querySelector('#perfLeaks');
  const listenerState = document.querySelector('#listenerState');
  const performanceMessage = document.querySelector('#performanceMessage');
  const fpsChart = document.querySelector('#fpsChart');
  const performanceState = { history: [48, 52, 56, 60, 57, 59], sampleFrames: 0, sampleStart: 0, fps: 0, leaks: 0, listeners: 15 };

  const buildChart = () => { fpsChart.replaceChildren(); performanceState.history.forEach((fps) => { const bar = document.createElement('span'); bar.className = 'chart-bar'; bar.dataset.level = Math.max(10, Math.min(100, Math.round((fps / 60) * 10) * 10)); bar.setAttribute('aria-label', `${fps} FPS`); fpsChart.appendChild(bar); }); };
  const estimateMemory = () => (4.8 + particleState.particles.length * .12 + performanceState.leaks * 1.8).toFixed(1);
  const updatePerformanceReading = (dt) => {
    const now = performance.now(); performanceState.sampleFrames += 1; if (!performanceState.sampleStart) performanceState.sampleStart = now;
    if (now - performanceState.sampleStart >= 500) { performanceState.fps = Math.round(performanceState.sampleFrames * 1000 / (now - performanceState.sampleStart)); performanceState.history.push(performanceState.fps); performanceState.history = performanceState.history.slice(-18); performanceState.sampleFrames = 0; performanceState.sampleStart = now; buildChart(); }
    perfFps.textContent = performanceState.fps || '--'; perfMemory.textContent = `${estimateMemory()} MB`; perfListeners.textContent = performanceState.listeners + performanceState.leaks; perfLeaks.textContent = performanceState.leaks; deltaValue.textContent = `${Math.round(dt * 1000)} ms`;
  };
  const simulateLeak = () => { performanceState.leaks += 3; listenerState.textContent = 'hay señales por limpiar'; performanceMessage.textContent = 'Se simuló un problema para practicar la limpieza.'; updatePerformanceReading(0); };
  const cleanMemory = () => { performanceState.leaks = 0; listenerState.textContent = 'conectados'; performanceMessage.textContent = '¡Estrellas limpias! La nave quedó ordenada.'; updatePerformanceReading(0); };
  const stopRockets = () => { stopOrbits(); pauseSetup(); performanceMessage.textContent = 'Todos los cohetes se detuvieron con cancelAnimationFrame.'; };
  const leakButton = document.querySelector('#simulateLeak'); const cleanButton = document.querySelector('#cleanMemory'); const stopButton = document.querySelector('#stopRockets');
  leakButton.addEventListener('click', simulateLeak); cleanButton.addEventListener('click', cleanMemory); stopButton.addEventListener('click', stopRockets); buildChart(); updatePerformanceReading(0); startOrbits();
  // #endregion PASO 5

  // ==========================================
  // #region NAVEGACIÓN Y DESMONTAJE
  // Efecto implementado: progreso visual de la misión y apagado seguro de la experiencia.
  // Concepto técnico aplicado: Memory cleanup con cancelAnimationFrame y removeEventListener
  // en pagehide para que ninguna animación o referencia siga viva al salir de la página.
  // ==========================================
  const stepCards = [...document.querySelectorAll('.step-card')];
  const progressValue = document.querySelector('#progressValue');
  const progressBar = document.querySelector('#progressBar');
  const updateProgress = () => { const middle = window.innerHeight * .55; const active = stepCards.reduce((best, card, index) => { const distance = Math.abs(card.getBoundingClientRect().top - middle); return distance < best.distance ? { index, distance } : best; }, { index: 0, distance: Infinity }); const number = active.index + 1; progressValue.textContent = `Paso ${number} de 5`; progressBar.className = `progress-${number * 20}`; stepCards.forEach((card, index) => card.classList.toggle('is-complete', index < active.index)); };
  const teardown = () => {
    stopOrbits();
    pauseSetup();
    setupPlay.removeEventListener('click', playSetup);
    setupPause.removeEventListener('click', pauseSetup);
    setupReset.removeEventListener('click', resetSetup);
    displayText.removeEventListener('input', handleSetupText);
    setupSpeed.removeEventListener('input', handleSetupSpeed);
    closureIncrement.removeEventListener('click', handleDiscovery);
    toggleHighlight.removeEventListener('click', handleHighlight);
    addPulse.removeEventListener('click', handlePulse);
    resetDom.removeEventListener('click', handleDomReset);
    explorerInput.removeEventListener('input', validateExplorer);
    document.querySelector('#particleStart').removeEventListener('click', startOrbits);
    document.querySelector('#particleStop').removeEventListener('click', stopOrbits);
    document.querySelector('#particleAdd').removeEventListener('click', addPlanet);
    document.querySelector('#gravityButton').removeEventListener('click', increaseGravity);
    leakButton.removeEventListener('click', simulateLeak);
    cleanButton.removeEventListener('click', cleanMemory);
    stopButton.removeEventListener('click', stopRockets);
    window.removeEventListener('resize', handleSetupResize);
    window.removeEventListener('resize', handleOrbitResize);
    window.removeEventListener('scroll', updateProgress);
    listenerState.textContent = 'desconectados';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('pagehide', teardown, { once: true });
  updateProgress();
  // #endregion NAVEGACIÓN Y DESMONTAJE
})();
