/**
 * AMARA — Coffee Sanctuary & Slow Bakes — Bengaluru
 * Lightweight client logic for navigation, 1.5s preloader, continuous fluid coffee pour,
 * taste profiler, quick date selection, and reservation desk.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. PRELOADER (EXACTLY 1.5 SECONDS / 1500 MS)
     ========================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  const PRELOADER_DURATION = 1500; // Exact 1.5s as requested
  const preloaderStartTime = performance.now();
  let preloaderDismissed = false;

  function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;
    if (preloaderProgress) preloaderProgress.style.width = '100%';
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 350);
    }
  }

  function animatePreloader(currentTime) {
    if (preloaderDismissed) return;
    const elapsed = currentTime - preloaderStartTime;
    const progress = Math.min((elapsed / PRELOADER_DURATION) * 100, 100);

    if (preloaderProgress) {
      preloaderProgress.style.width = `${progress}%`;
    }

    if (elapsed < PRELOADER_DURATION) {
      requestAnimationFrame(animatePreloader);
    } else {
      dismissPreloader();
    }
  }

  requestAnimationFrame(animatePreloader);

  // Absolute safety fallback timer: guarantees removal at 1.5s regardless of RAF
  setTimeout(dismissPreloader, PRELOADER_DURATION);


  /* ==========================================================
     2. INTERACTIVE BREW BAR ENGINE (3 LIVE SLOW-BREW STYLES)
     ========================================================== */
  const canvas = document.getElementById('coffeePourCanvas');
  const brewTabs = document.querySelectorAll('.brew-tab');
  const brewSpecBadge = document.getElementById('brewSpecBadge');

  const BREW_SPECS = {
    espresso: {
      state: '<i class="fa-solid fa-circle-dot live-indicator"></i> 9 Bar Sinuous Extraction',
      estate: 'Balur Estate Washed Lot',
      notes: 'Notes: Raw Honey, Sweet Lime & Cacao'
    },
    colddrip: {
      state: '<i class="fa-solid fa-circle-dot live-indicator"></i> 42 Drops / Min · 24h Cold Drip',
      estate: 'Kalledevarapura Estate',
      notes: 'Notes: Dark Plum, Molasses & Cocoa Nibs'
    },
    pourover: {
      state: '<i class="fa-solid fa-circle-dot live-indicator"></i> 92°C Spiral Hand Pour · V60',
      estate: 'Chikmagalur Red Honey Lot',
      notes: 'Notes: Jasmine, Meyer Lemon & Cane Sugar'
    }
  };

  let currentBrewMode = 'espresso';

  function updateBrewBadge(mode) {
    if (!brewSpecBadge || !BREW_SPECS[mode]) return;
    const spec = BREW_SPECS[mode];
    brewSpecBadge.style.opacity = '0';
    setTimeout(() => {
      brewSpecBadge.innerHTML = `
        <span class="spec-state">${spec.state}</span>
        <span class="spec-divider">·</span>
        <span class="spec-estate">${spec.estate}</span>
        <span class="spec-divider">·</span>
        <span class="spec-notes">${spec.notes}</span>
      `;
      brewSpecBadge.style.opacity = '1';
    }, 150);
  }

  brewTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-brew-mode');
      if (mode === currentBrewMode) return;

      brewTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentBrewMode = mode;
      updateBrewBadge(mode);

      // Trigger mode switch ripple burst
      if (canvasTriggerBurst) canvasTriggerBurst();
    });
  });

  let canvasTriggerBurst = null;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const baseW = 420;
    const baseH = 280;

    canvas.width = baseW * dpr;
    canvas.height = baseH * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;
    const centerX = 210;

    // Fluid state variables
    let ripples = [];
    let droplets = [];
    let steamParticles = [];

    // Mode-specific state
    let coldDripY = 48;
    let coldDripVy = 0;
    let coldDripActive = false;
    let coldDripRadius = 2.4;
    let dripFormProgress = 0;

    function initSteam(yOffset) {
      steamParticles = [];
      for (let i = 0; i < 8; i++) {
        steamParticles.push({
          x: centerX - 24 + Math.random() * 48,
          y: yOffset - Math.random() * 80,
          vy: 0.45 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          life: Math.random(),
          maxLife: 0.8 + Math.random() * 0.4,
          size: 10 + Math.random() * 14
        });
      }
    }

    initSteam(165);

    function spawnRipple(customX, customY, maxR, speed) {
      ripples.push({
        x: customX || centerX,
        y: customY || (currentBrewMode === 'colddrip' ? 180 : (currentBrewMode === 'pourover' ? 190 : 162)),
        r: 3,
        maxR: maxR || 42,
        alpha: 0.85,
        speed: speed || 0.6
      });
    }

    function spawnDroplet(customX, customY, color) {
      if (droplets.length < 8) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.1 + Math.random() * 1.8;
        droplets.push({
          x: customX || centerX,
          y: customY || (currentBrewMode === 'colddrip' ? 180 : 162),
          vx: Math.cos(angle) * (speed * 0.8),
          vy: -Math.abs(Math.sin(angle) * speed) - 1.2,
          radius: 1.1 + Math.random() * 1.2,
          alpha: 1,
          gravity: 0.12,
          color: color || '#d9a05b'
        });
      }
    }

    canvasTriggerBurst = function() {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => spawnRipple(centerX, null, 48, 0.7), i * 60);
      }
      for (let i = 0; i < 5; i++) {
        spawnDroplet();
      }
    };

    canvas.addEventListener('click', () => {
      canvasTriggerBurst();
    });

    let frameCount = 0;

    function renderBrewAnimation() {
      time += 0.035;
      frameCount++;

      ctx.clearRect(0, 0, baseW, baseH);

      // --- 1. AMBIENT BACKLIGHT GLOW ---
      const glowGrad = ctx.createRadialGradient(centerX, 160, 15, centerX, 160, 150);
      glowGrad.addColorStop(0, 'rgba(217, 160, 91, 0.16)');
      glowGrad.addColorStop(1, 'rgba(248, 245, 239, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, 160, 150, 0, Math.PI * 2);
      ctx.fill();


      // ==========================================
      // --- MODE A: HONEY ESPRESSO EXTRACTION ---
      // ==========================================
      if (currentBrewMode === 'espresso') {
        const cupSurfaceY = 162;

        if (frameCount % 20 === 0) spawnRipple(centerX, cupSurfaceY, 44, 0.6);
        if (frameCount % 24 === 0) spawnDroplet(centerX, cupSurfaceY, '#d9a05b');

        // Saucer Ambient Shadow
        ctx.fillStyle = 'rgba(51, 36, 27, 0.08)';
        ctx.beginPath();
        ctx.ellipse(centerX, 246, 96, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Saucer
        const saucerGrad = ctx.createLinearGradient(centerX - 95, 238, centerX + 95, 238);
        saucerGrad.addColorStop(0, '#e5ded2');
        saucerGrad.addColorStop(0.2, '#faf7f2');
        saucerGrad.addColorStop(0.5, '#ffffff');
        saucerGrad.addColorStop(0.8, '#f3ede2');
        saucerGrad.addColorStop(1, '#dbd1c1');
        ctx.fillStyle = saucerGrad;
        ctx.strokeStyle = '#d6ccbe';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(centerX, 238, 92, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cup Handle
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#ebd9c3';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(centerX + 62, 192, 18, -Math.PI * 0.4, Math.PI * 0.55);
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#faf7f2';
        ctx.beginPath();
        ctx.arc(centerX + 62, 192, 18, -Math.PI * 0.35, Math.PI * 0.5);
        ctx.stroke();

        // Cup Body
        const cupGrad = ctx.createLinearGradient(centerX - 65, 162, centerX + 65, 162);
        cupGrad.addColorStop(0, '#ded4c4');
        cupGrad.addColorStop(0.15, '#f5efe4');
        cupGrad.addColorStop(0.5, '#ffffff');
        cupGrad.addColorStop(0.85, '#ede6da');
        cupGrad.addColorStop(1, '#d8cdbb');
        ctx.fillStyle = cupGrad;
        ctx.strokeStyle = '#d0c4b2';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 60, 162);
        ctx.quadraticCurveTo(centerX - 58, 202, centerX - 35, 230);
        ctx.lineTo(centerX + 35, 230);
        ctx.quadraticCurveTo(centerX + 58, 202, centerX + 60, 162);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Outer Rim
        ctx.fillStyle = '#faf7f2';
        ctx.strokeStyle = '#b85e35';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(centerX, 162, 60, 19, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Liquid Surface (Clipped)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(centerX, cupSurfaceY, 56, 16.5, 0, 0, Math.PI * 2);
        ctx.clip();

        const coffeeGrad = ctx.createRadialGradient(centerX, cupSurfaceY, 4, centerX, cupSurfaceY, 55);
        coffeeGrad.addColorStop(0, '#5a3118');
        coffeeGrad.addColorStop(0.4, '#3a1e12');
        coffeeGrad.addColorStop(0.8, '#26130b');
        coffeeGrad.addColorStop(1, '#1b0d07');
        ctx.fillStyle = coffeeGrad;
        ctx.fillRect(centerX - 65, cupSurfaceY - 20, 130, 40);

        // Crema Marbling
        const cremaGrad = ctx.createRadialGradient(centerX, cupSurfaceY, 18, centerX, cupSurfaceY, 55);
        cremaGrad.addColorStop(0, 'rgba(197, 131, 63, 0)');
        cremaGrad.addColorStop(0.7, 'rgba(217, 160, 91, 0.45)');
        cremaGrad.addColorStop(0.95, 'rgba(217, 160, 91, 0.85)');
        cremaGrad.addColorStop(1, 'rgba(150, 85, 35, 0.95)');
        ctx.fillStyle = cremaGrad;
        ctx.fillRect(centerX - 65, cupSurfaceY - 20, 130, 40);

        // Swirling Crema Rings
        for (let s = 0; s < 3; s++) {
          ctx.strokeStyle = `rgba(224, 172, 108, ${0.28 - s * 0.06})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const swirlAngle = time * 0.4 + s * (Math.PI * 0.65);
          ctx.ellipse(
            centerX + Math.cos(swirlAngle) * 10,
            cupSurfaceY + Math.sin(swirlAngle) * 3,
            28 + s * 9,
            8 + s * 2.5,
            swirlAngle * 0.2,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }

        // Concentric Ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.r += rip.speed;
          rip.alpha -= 0.018;
          if (rip.alpha <= 0 || rip.r >= rip.maxR) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(255, 230, 185, ${rip.alpha * 0.85})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.r, rip.r * 0.32, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();

        // Shower Screen Portafilter Head at Top
        ctx.fillStyle = '#3a2c23';
        ctx.fillRect(centerX - 42, 6, 84, 12);
        const brassGrad = ctx.createLinearGradient(centerX - 40, 18, centerX + 40, 18);
        brassGrad.addColorStop(0, '#8c582f');
        brassGrad.addColorStop(0.4, '#e2ab69');
        brassGrad.addColorStop(1, '#7a4a25');
        ctx.fillStyle = brassGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, 18, 42, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bottomless Extraction Gathering Cone
        ctx.fillStyle = '#6e381b';
        ctx.beginPath();
        ctx.moveTo(centerX - 12, 18);
        ctx.quadraticCurveTo(centerX - 5, 24, centerX - 3, 28);
        ctx.lineTo(centerX + 3, 28);
        ctx.quadraticCurveTo(centerX + 5, 24, centerX + 12, 18);
        ctx.closePath();
        ctx.fill();

        // Continuous Sinuous Stream
        const startY = 28;
        const targetY = cupSurfaceY;
        const steps = 24;

        ctx.beginPath();
        ctx.lineCap = 'round';
        for (let i = 0; i <= steps; i++) {
          const p = i / steps;
          const currY = startY + (targetY - startY) * p;
          const wave = Math.sin(currY * 0.055 - time * 8) * 1.6 + Math.cos(currY * 0.025 + time * 4) * 0.7;
          const currX = centerX + wave;
          if (i === 0) ctx.moveTo(currX, currY);
          else ctx.lineTo(currX, currY);
        }

        ctx.strokeStyle = '#2b140b';
        ctx.lineWidth = 5.5;
        ctx.stroke();

        ctx.strokeStyle = '#7c4320';
        ctx.lineWidth = 3.8;
        ctx.stroke();

        ctx.strokeStyle = '#e2ab69';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([10, 14]);
        ctx.lineDashOffset = -time * 115;
        ctx.stroke();
        ctx.setLineDash([]);

        // Impact Froth Pulse
        const frothPulse = Math.sin(time * 12) * 1.3;
        const frothGrad = ctx.createRadialGradient(centerX, cupSurfaceY, 1, centerX, cupSurfaceY, 8 + frothPulse);
        frothGrad.addColorStop(0, '#ffe8c2');
        frothGrad.addColorStop(0.5, '#c5833f');
        frothGrad.addColorStop(1, 'rgba(184, 94, 53, 0)');
        ctx.fillStyle = frothGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, cupSurfaceY, 9 + frothPulse, 4.2 + frothPulse * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }


      // ==========================================
      // --- MODE B: SLOW COLD DRIP TOWER ---
      // ==========================================
      else if (currentBrewMode === 'colddrip') {
        const beakerSurfaceY = 180;

        // Droplet Formation & Fall Physics
        if (!coldDripActive) {
          dripFormProgress += 0.024; // Slow deliberate drip formation
          coldDripRadius = 2.0 + dripFormProgress * 2.8;

          if (dripFormProgress >= 1.0) {
            coldDripActive = true;
            coldDripY = 48;
            coldDripVy = 0.5;
          }
        } else {
          coldDripY += coldDripVy;
          coldDripVy += 0.32; // Gravity

          if (coldDripY >= beakerSurfaceY) {
            coldDripActive = false;
            dripFormProgress = 0;
            spawnRipple(centerX, beakerSurfaceY, 52, 0.7);
            spawnDroplet(centerX, beakerSurfaceY, '#7c4320');
            spawnDroplet(centerX, beakerSurfaceY, '#d9a05b');
          }
        }

        // Crystal Beaker Shadow
        ctx.fillStyle = 'rgba(51, 36, 27, 0.08)';
        ctx.beginPath();
        ctx.ellipse(centerX, 252, 70, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Laboratory Crystal Beaker Body (Glass with Amber Cold Brew)
        const beakerGrad = ctx.createLinearGradient(centerX - 50, 160, centerX + 50, 160);
        beakerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        beakerGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.15)');
        beakerGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.15)');
        beakerGrad.addColorStop(1, 'rgba(255, 255, 255, 0.5)');

        ctx.fillStyle = beakerGrad;
        ctx.strokeStyle = 'rgba(214, 204, 190, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 42, 140);
        ctx.lineTo(centerX - 46, 235);
        ctx.quadraticCurveTo(centerX - 46, 246, centerX - 32, 246);
        ctx.lineTo(centerX + 32, 246);
        ctx.quadraticCurveTo(centerX + 46, 246, centerX + 46, 235);
        ctx.lineTo(centerX + 42, 140);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Beaker Measurement Ticks
        ctx.strokeStyle = 'rgba(184, 94, 53, 0.4)';
        ctx.lineWidth = 1.2;
        for (let m = 0; m < 4; m++) {
          const my = 220 - m * 14;
          ctx.beginPath();
          ctx.moveTo(centerX - 43, my);
          ctx.lineTo(centerX - 35, my);
          ctx.stroke();
        }

        // Cold Brew Liquid in Beaker (Clipped)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX - 45, beakerSurfaceY);
        ctx.lineTo(centerX - 46, 235);
        ctx.quadraticCurveTo(centerX - 46, 246, centerX - 32, 246);
        ctx.lineTo(centerX + 32, 246);
        ctx.quadraticCurveTo(centerX + 46, 246, centerX + 46, 235);
        ctx.lineTo(centerX + 45, beakerSurfaceY);
        ctx.closePath();
        ctx.clip();

        // Chilled dark amber liquid
        const coldGrad = ctx.createLinearGradient(centerX, beakerSurfaceY, centerX, 246);
        coldGrad.addColorStop(0, '#5a2d16');
        coldGrad.addColorStop(0.5, '#35180c');
        coldGrad.addColorStop(1, '#1e0c05');
        ctx.fillStyle = coldGrad;
        ctx.fillRect(centerX - 50, beakerSurfaceY - 10, 100, 80);

        // Floating Ice Crystal Cube
        ctx.save();
        ctx.translate(centerX - 10, beakerSurfaceY + 14);
        ctx.rotate(0.2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1;
        ctx.fillRect(-12, -12, 24, 24);
        ctx.strokeRect(-12, -12, 24, 24);
        ctx.restore();

        // Surface Ripples in Beaker
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.r += rip.speed;
          rip.alpha -= 0.02;
          if (rip.alpha <= 0 || rip.r >= rip.maxR) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(240, 198, 141, ${rip.alpha})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.r * 0.7, rip.r * 0.22, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();

        // Beaker Top Rim
        ctx.strokeStyle = 'rgba(214, 204, 190, 0.9)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(centerX, 140, 42, 7, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Kyoto Glass Drip Tower Nozzle at Top
        ctx.strokeStyle = 'rgba(200, 190, 175, 0.9)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 18, 10);
        ctx.lineTo(centerX - 8, 36);
        ctx.lineTo(centerX - 3, 44);
        ctx.lineTo(centerX + 3, 44);
        ctx.lineTo(centerX + 8, 36);
        ctx.lineTo(centerX + 18, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Amber Drip Valve Collar
        ctx.fillStyle = '#b85e35';
        ctx.fillRect(centerX - 6, 32, 12, 4);

        // Drawing Falling Droplet or Forming Droplet
        if (coldDripActive) {
          // Elongated tear-drop falling
          ctx.fillStyle = '#7c4320';
          ctx.beginPath();
          ctx.ellipse(centerX, coldDripY, 2.6, 4.4, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#e2ab69';
          ctx.beginPath();
          ctx.arc(centerX + 0.8, coldDripY - 1, 1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Swelling Meniscus at Nozzle
          const neckY = 44 + dripFormProgress * 4;
          ctx.fillStyle = '#7c4320';
          ctx.beginPath();
          ctx.ellipse(centerX, neckY, coldDripRadius * 0.85, coldDripRadius * 1.1, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#e2ab69';
          ctx.beginPath();
          ctx.arc(centerX + 0.8, neckY - 0.5, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }


      // ==========================================
      // --- MODE C: POUR-OVER V60 SPIRAL BLOOM ---
      // ==========================================
      else if (currentBrewMode === 'pourover') {
        const decanterSurfaceY = 196;

        if (frameCount % 18 === 0) spawnRipple(centerX, decanterSurfaceY, 40, 0.55);
        if (frameCount % 30 === 0) spawnDroplet(centerX, decanterSurfaceY, '#d9a05b');

        // Glass Decanter Base Shadow
        ctx.fillStyle = 'rgba(51, 36, 27, 0.08)';
        ctx.beginPath();
        ctx.ellipse(centerX, 252, 75, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glass Decanter Carafe Body
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeStyle = 'rgba(214, 204, 190, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 24, 150);
        ctx.lineTo(centerX - 52, 238);
        ctx.quadraticCurveTo(centerX - 52, 248, centerX - 36, 248);
        ctx.lineTo(centerX + 36, 248);
        ctx.quadraticCurveTo(centerX + 52, 248, centerX + 52, 238);
        ctx.lineTo(centerX + 24, 150);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Decanter Glass Handle on Left
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(214, 204, 190, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX - 50, 196, 18, Math.PI * 0.6, Math.PI * 1.55);
        ctx.stroke();

        // Filtered Amber Brew in Decanter (Clipped)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX - 40, decanterSurfaceY);
        ctx.lineTo(centerX - 52, 238);
        ctx.quadraticCurveTo(centerX - 52, 248, centerX - 36, 248);
        ctx.lineTo(centerX + 36, 248);
        ctx.quadraticCurveTo(centerX + 52, 248, centerX + 52, 238);
        ctx.lineTo(centerX + 40, decanterSurfaceY);
        ctx.closePath();
        ctx.clip();

        const pouroverGrad = ctx.createLinearGradient(centerX, decanterSurfaceY, centerX, 248);
        pouroverGrad.addColorStop(0, '#9e5a2b');
        pouroverGrad.addColorStop(0.6, '#6b3616');
        pouroverGrad.addColorStop(1, '#3b1c0b');
        ctx.fillStyle = pouroverGrad;
        ctx.fillRect(centerX - 60, decanterSurfaceY - 10, 120, 80);

        // Ripples in Decanter
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.r += rip.speed;
          rip.alpha -= 0.02;
          if (rip.alpha <= 0 || rip.r >= rip.maxR) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(255, 230, 185, ${rip.alpha * 0.9})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.r * 0.75, rip.r * 0.22, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();

        // Decanter Rim Collar
        ctx.strokeStyle = 'rgba(214, 204, 190, 0.9)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(centerX, 150, 24, 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Minimalist Ceramic V60 Dripper Cone
        const v60Grad = ctx.createLinearGradient(centerX - 48, 70, centerX + 48, 70);
        v60Grad.addColorStop(0, '#e5ded2');
        v60Grad.addColorStop(0.3, '#ffffff');
        v60Grad.addColorStop(0.7, '#fbf8f2');
        v60Grad.addColorStop(1, '#d8cdbb');

        ctx.fillStyle = v60Grad;
        ctx.strokeStyle = '#d0c4b2';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(centerX - 48, 70);
        ctx.lineTo(centerX - 14, 136);
        ctx.lineTo(centerX + 14, 136);
        ctx.lineTo(centerX + 48, 70);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // V60 Handle Ring
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX + 50, 92, 11, -Math.PI * 0.3, Math.PI * 0.6);
        ctx.stroke();

        // Pleated Paper Filter Inside V60
        ctx.fillStyle = '#faf6ed';
        ctx.strokeStyle = '#ebd9c3';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 42, 70);
        ctx.lineTo(centerX - 10, 132);
        ctx.lineTo(centerX + 10, 132);
        ctx.lineTo(centerX + 42, 70);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Blooming Fresh Coffee Bed with CO2 Micro Bubbles
        const bloomGrad = ctx.createRadialGradient(centerX, 78, 2, centerX, 78, 30);
        bloomGrad.addColorStop(0, '#5a3118');
        bloomGrad.addColorStop(0.8, '#331b0e');
        bloomGrad.addColorStop(1, '#211008');
        ctx.fillStyle = bloomGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, 78, 34, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dynamic Blooming Froth Bubbles
        for (let b = 0; b < 5; b++) {
          const bAngle = time * 0.3 + (b * Math.PI / 2.5);
          const bx = centerX + Math.cos(bAngle) * (14 + Math.sin(time + b) * 5);
          const by = 78 + Math.sin(bAngle) * (3.8 + Math.cos(time + b) * 1.5);
          ctx.fillStyle = 'rgba(217, 160, 91, 0.85)';
          ctx.beginPath();
          ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Hot Water Spiral Pour Stream into V60 Cone
        const spiralX = centerX + Math.cos(time * 3.5) * 10;
        const spiralY = 78 + Math.sin(time * 3.5) * 3;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, 12);
        ctx.quadraticCurveTo(centerX - 5, 45, spiralX, spiralY);
        ctx.stroke();

        // Extraction Stream dripping from V60 Cone into Decanter
        const streamStart = 136;
        const streamEnd = decanterSurfaceY;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#8c4820';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(centerX, streamStart);
        ctx.lineTo(centerX, streamEnd);
        ctx.stroke();

        ctx.strokeStyle = '#e2ab69';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([6, 8]);
        ctx.lineDashOffset = -time * 80;
        ctx.stroke();
        ctx.setLineDash([]);
      }


      // ==========================================
      // --- ACTIVE IMPACT DROPLETS ---
      // ==========================================
      for (let d = droplets.length - 1; d >= 0; d--) {
        const drop = droplets[d];
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vy += drop.gravity;
        drop.alpha -= 0.026;

        if (drop.alpha <= 0 || drop.y > 220) {
          droplets.splice(d, 1);
          continue;
        }

        ctx.fillStyle = drop.color || '#d9a05b';
        ctx.globalAlpha = Math.max(drop.alpha, 0);
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }


      // ==========================================
      // --- RISING STEAM / CHILL PLUMES ---
      // ==========================================
      const baseSteamY = currentBrewMode === 'colddrip' ? 180 : 160;

      steamParticles.forEach(p => {
        p.y -= p.vy;
        p.life += 0.007;

        if (p.life >= p.maxLife || p.y < 30) {
          p.x = centerX - 24 + Math.random() * 48;
          p.y = baseSteamY;
          p.life = 0;
          p.vy = 0.4 + Math.random() * 0.45;
          p.size = 10 + Math.random() * 14;
        }

        const steamAlpha = Math.sin((p.life / p.maxLife) * Math.PI) * (currentBrewMode === 'colddrip' ? 0.09 : 0.16);
        const driftX = Math.sin(time * 1.5 + p.phase + p.y * 0.04) * 10;

        ctx.save();
        const steamGrad = ctx.createRadialGradient(p.x + driftX, p.y, 0, p.x + driftX, p.y, p.size);
        steamGrad.addColorStop(0, `rgba(255, 255, 255, ${steamAlpha * 1.5})`);
        steamGrad.addColorStop(0.5, `rgba(255, 255, 255, ${steamAlpha * 0.7})`);
        steamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(p.x + driftX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderBrewAnimation);
    }

    renderBrewAnimation();
  }


  /* ==========================================================
     3. HEADER SCROLL & PROGRESS BAR
     ========================================================== */
  const header = document.getElementById('mainHeader');
  const scrollProgressBar = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollProgressBar && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }
  }, { passive: true });


  /* ==========================================================
     4. MOBILE DRAWER NAVIGATION
     ========================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const drawerReserveBtn = document.getElementById('drawerReserveBtn');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.classList.add('lock-scroll');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.classList.remove('lock-scroll');
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
  if (drawerReserveBtn) drawerReserveBtn.addEventListener('click', closeDrawer);





  /* ==========================================================
     6. QUICK DATE SELECTION & RESERVATION DESK
     ========================================================== */
  const resDateInput = document.getElementById('resDate');
  const qDateBtns = document.querySelectorAll('.q-date-btn');

  function formatDateToISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Set default reservation date to Today
  const today = new Date();
  if (resDateInput) {
    resDateInput.value = formatDateToISO(today);
    resDateInput.min = formatDateToISO(today);
  }

  qDateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qDateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const offset = btn.getAttribute('data-date-offset');
      const weekend = btn.getAttribute('data-date-weekend');
      const targetDate = new Date();

      if (offset !== null) {
        targetDate.setDate(targetDate.getDate() + parseInt(offset, 10));
      } else if (weekend === 'sat') {
        const day = targetDate.getDay();
        const diff = (6 - day + 7) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + diff);
      } else if (weekend === 'sun') {
        const day = targetDate.getDay();
        const diff = (7 - day) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + diff);
      }

      if (resDateInput) {
        resDateInput.value = formatDateToISO(targetDate);
      }
    });
  });

  if (resDateInput) {
    resDateInput.addEventListener('change', () => {
      // Clear quick date active states when user custom picks a date
      qDateBtns.forEach(b => b.classList.remove('active'));
    });
  }


  /* ==========================================================
     7. TABLE RESERVATIONS SUBMISSION & CONFIRMATION
     ========================================================== */
  const simpleReserveForm = document.getElementById('simpleReserveForm');
  const confirmationModal = document.getElementById('confirmationModal');
  const confirmModalClose = document.getElementById('confirmModalClose');
  const dismissTicketBtn = document.getElementById('dismissTicketBtn');
  const copyDetailsBtn = document.getElementById('copyDetailsBtn');
  const ticketDetailsBox = document.getElementById('ticketDetailsBox');

  let currentBookingSummary = '';

  if (simpleReserveForm) {
    simpleReserveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestElem = document.querySelector('input[name="resGuests"]:checked');
      const guests = guestElem ? guestElem.value : '2';
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const name = document.getElementById('resName').value.trim();
      const phone = document.getElementById('resPhone').value.trim();
      const specialWants = document.getElementById('resSpecialWants').value.trim();

      const bookingRef = `AMR-${Math.floor(1000 + Math.random() * 9000)}`;
      const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      currentBookingSummary = `AMARA Reservation Confirmed\nRef: #${bookingRef}\nGuest: ${name}\nWhen: ${formattedDate} at ${time}\nParty: ${guests} ${guests === '1' ? 'Guest' : 'Guests'}${specialWants ? `\nSpecial Wants: ${specialWants}` : ''}\nVenue: AMARA · Coffee Sanctuary & Slow Bakes, 12th Main, Indiranagar, Bengaluru`;

      if (ticketDetailsBox) {
        ticketDetailsBox.innerHTML = `
          <div class="ticket-item">
            <span>Booking Ref:</span>
            <strong>#${bookingRef}</strong>
          </div>
          <div class="ticket-item">
            <span>Guest Name:</span>
            <strong>${name}</strong>
          </div>
          <div class="ticket-item">
            <span>Contact:</span>
            <strong>${phone}</strong>
          </div>
          <div class="ticket-item">
            <span>When:</span>
            <strong>${formattedDate} at ${time}</strong>
          </div>
          <div class="ticket-item">
            <span>Party Size:</span>
            <strong>${guests} ${guests === '1' ? 'Guest' : 'Guests'}</strong>
          </div>
          ${specialWants ? `
          <div class="ticket-item">
            <span>Special Wants:</span>
            <strong>${specialWants}</strong>
          </div>` : ''}
        `;
      }

      confirmationModal.classList.add('open');
      document.body.classList.add('lock-scroll');
      showToast(`Table confirmed for ${name}! Ref: #${bookingRef}`);
      simpleReserveForm.reset();

      // Reset date to today and radio to 2
      if (resDateInput) resDateInput.value = formatDateToISO(new Date());
      const radio2 = document.querySelector('input[name="resGuests"][value="2"]');
      if (radio2) radio2.checked = true;
      qDateBtns.forEach(b => {
        if (b.getAttribute('data-date-offset') === '0') b.classList.add('active');
        else b.classList.remove('active');
      });
    });
  }

  function closeModal() {
    if (confirmationModal) {
      confirmationModal.classList.remove('open');
      document.body.classList.remove('lock-scroll');
    }
  }

  if (confirmModalClose) confirmModalClose.addEventListener('click', closeModal);
  if (dismissTicketBtn) dismissTicketBtn.addEventListener('click', closeModal);

  // Copy details button
  if (copyDetailsBtn) {
    copyDetailsBtn.addEventListener('click', () => {
      if (navigator.clipboard && currentBookingSummary) {
        navigator.clipboard.writeText(currentBookingSummary).then(() => {
          showToast('Reservation details copied to clipboard!');
        }).catch(() => {
          showToast('Copied reservation reference!');
        });
      } else {
        showToast('Reservation confirmed!');
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });


  /* ==========================================================
     8. TOAST NOTIFICATION UTILITY
     ========================================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }


  /* ==========================================================
     9. SCROLL ACTIVE LINK OBSERVER & REVEALS
     ========================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});