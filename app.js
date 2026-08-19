/* ==========================================================================
   Valentine's Day Game - Core Application Logic
   State Machines, Route Navigation, Audio Synth, and Canvas Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- State Variables ---
  let noClickCount = 0;
  let audioEnabled = true;

  // Exact 6 NO refusal stages from Figma design
  const noRefusalTexts = [
    "NO 💔",
    "Sorry, no 🥺",
    "lol, no haha 😅",
    "NOOOOO 😭",
    "LET ME GO! 🏃‍♀️",
    "I SAID NO! 😡"
  ];

  // Messages for screens that use loading transitions (flightDelivery, preQuestion)
  const loadingMessages = {
    flightDelivery: "Flying in special delivery... ✈️💌",
    preQuestion: "Unfolding romantic letter... 💌",
    seguirConTu: "Redirecting to happiness... ✨"
  };

  // DOM Elements
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    flightDelivery: document.getElementById('screen-flight-delivery'),
    preQuestion: document.getElementById('screen-pre-question'),
    inicio: document.getElementById('screen-inicio'),
    opcionNo: document.getElementById('screen-opcion-no'),
    opcionSi: document.getElementById('screen-opcion-si'),
    boda: document.getElementById('screen-boda'),
    seguirConTu: document.getElementById('screen-seguir-con-tu')
  };

  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingText = document.getElementById('loading-text');

  const btnWelcomeNext = document.getElementById('btn-welcome-next');
  const interactiveEnvelope = document.getElementById('interactive-envelope');
  const btnPreQuestionNext = document.getElementById('btn-pre-question-next');

  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const btnAdmit = document.getElementById('btn-admit');
  const btnTryAgain = document.getElementById('btn-try-again');
  const btnWedding = document.getElementById('btn-wedding');
  const btnContinueLife = document.getElementById('btn-continue-life');
  const btnRestart = document.getElementById('btn-restart');
  const btnReturnYes = document.getElementById('btn-return-yes');

  const audioToggle = document.getElementById('audio-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  // Safe event listener binder
  function bindClick(element, handler) {
    if (element) {
      element.addEventListener('click', handler);
    }
  }

  // --- Instant Screen Navigation (No Loading Overlay) ---
  function navigateToInstant(screenId, triggerConfetti = false) {
    playSound('pop');
    
    Object.values(screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    if (screens[screenId]) {
      screens[screenId].classList.add('active');
    }

    if (triggerConfetti) {
      launchConfetti();
      playSound('victory');
    }
  }

  // --- Router with Loading Transition (for story intro flight/envelope) ---
  function navigateTo(screenId, triggerConfetti = false) {
    playSound('pop');
    
    const msg = loadingMessages[screenId] || "Loading romance... ✨";
    if (loadingText) loadingText.textContent = msg;
    
    if (loadingOverlay) loadingOverlay.classList.add('active');

    setTimeout(() => {
      Object.values(screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
      });

      if (screens[screenId]) {
        screens[screenId].classList.add('active');
      }

      if (loadingOverlay) loadingOverlay.classList.remove('active');

      if (triggerConfetti) {
        launchConfetti();
        playSound('victory');
      }
    }, 2500);
  }

  // --- Web Audio API Synthesizer ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playSound(type) {
    if (!audioEnabled) return;
    initAudio();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === 'pop') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } 
    else if (type === 'boop') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } 
    else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const noteTime = now + (idx * 0.09);
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    }
  }

  // --- Audio Toggle Switch ---
  bindClick(audioToggle, () => {
    audioEnabled = !audioEnabled;
    if (soundIconOn) soundIconOn.style.display = audioEnabled ? 'block' : 'none';
    if (soundIconOff) soundIconOff.style.display = audioEnabled ? 'none' : 'block';
  });

  // --- 0. WELCOME SCREEN LOGIC ---
  bindClick(btnWelcomeNext, () => {
    navigateTo('flightDelivery');
  });

  // --- 0.5. ENVELOPE DELIVERY SCREEN LOGIC ---
  bindClick(interactiveEnvelope, () => {
    launchConfetti();
    navigateTo('preQuestion');
  });

  // --- 0.8. PRE-QUESTION CONFESSION SCREEN LOGIC ---
  bindClick(btnPreQuestionNext, () => {
    navigateToInstant('inicio');
  });

  // --- 1. START QUESTION SCREEN LOGIC ---

  // YES Button handling (Instant transition without loading screen)
  bindClick(btnYes, () => {
    navigateToInstant('opcionSi', true);
  });

  // NO Button handling (Cycles 6 refusal variants -> Instant transition to opcion-no)
  bindClick(btnNo, () => {
    noClickCount++;

    if (noClickCount < noRefusalTexts.length) {
      btnNo.textContent = noRefusalTexts[noClickCount];
      playSound('boop');

      const yesScale = 1 + (noClickCount * 0.08);
      const noScale = Math.max(0.7, 1 - (noClickCount * 0.05));

      if (btnYes) btnYes.style.transform = `scale(${yesScale})`;
      if (btnNo) btnNo.style.transform = `scale(${noScale})`;
    } else {
      // 6th Click ("I SAID NO!") -> Instant transition to Opcion no
      navigateToInstant('opcionNo');
    }
  });

  // --- 2. OPCION NO SCREEN LOGIC (Returns to PREVIOUS SCREEN - screen-inicio) ---
  bindClick(btnAdmit, () => {
    resetGame();
    navigateToInstant('inicio');
  });

  bindClick(btnTryAgain, () => {
    resetGame();
    navigateToInstant('inicio');
  });

  // --- 3. OPCION SI SCREEN LOGIC ---
  bindClick(btnWedding, () => {
    navigateToInstant('boda', true);
  });

  bindClick(btnContinueLife, () => {
    navigateToInstant('seguirConTu');
  });

  // --- 4. DATE INVITATION SCREEN LOGIC ---
  bindClick(btnRestart, () => {
    resetGame();
    navigateToInstant('welcome');
  });

  // --- 5. ERROR SCREEN LOGIC ---
  bindClick(btnReturnYes, () => {
    navigateToInstant('opcionSi', true);
  });

  // --- Reset Game Helper ---
  function resetGame() {
    noClickCount = 0;
    if (btnNo) btnNo.textContent = noRefusalTexts[0];
    if (btnYes) {
      btnYes.classList.remove('variant-dark');
      btnYes.style.transform = 'scale(1)';
    }
    if (btnNo) btnNo.style.transform = 'scale(1)';
    if (btnTryAgain) btnTryAgain.classList.remove('variant-dark');
  }

  // --- Background Floating Hearts Generator ---
  function initFloatingHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;
    const heartSymbols = ['💖', '💕', '💗', '💓', '✨'];
    
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${6 + Math.random() * 8}s`;
      heart.style.animationDelay = `${Math.random() * 6}s`;
      heart.style.fontSize = `${14 + Math.random() * 20}px`;
      container.appendChild(heart);
    }
  }

  initFloatingHearts();

  // --- Particle Confetti System ---
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let confettiAnimationId = null;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = 8 + Math.random() * 10;
        this.speedY = 2 + Math.random() * 4;
        this.speedX = (Math.random() - 0.5) * 3;
        this.color = ['#FF4D6D', '#FF758F', '#FFB3C1', '#FFD166', '#FF85A1'][Math.floor(Math.random() * 5)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 5;
        this.shape = Math.random() > 0.4 ? 'heart' : 'rect';
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;

        if (this.shape === 'rect') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
          // Draw Heart Particle
          ctx.beginPath();
          const topCurveHeight = this.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
          ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    }

    window.launchConfetti = function() {
      particles = [];
      for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
      }

      if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, idx) => {
          p.update();
          p.draw();
          if (p.y > canvas.height + 20) {
            particles.splice(idx, 1);
          }
        });

        if (particles.length > 0) {
          confettiAnimationId = requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      animate();
    };
  } else {
    window.launchConfetti = function() {};
  }

});
