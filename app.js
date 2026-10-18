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

  function animatePreloader(currentTime) {
    const elapsed = currentTime - preloaderStartTime;
    const progress = Math.min((elapsed / PRELOADER_DURATION) * 100, 100);

    if (preloaderProgress) {
      preloaderProgress.style.width = `${progress}%`;
    }

    if (elapsed < PRELOADER_DURATION) {
      requestAnimationFrame(animatePreloader);
    } else {
      if (preloaderProgress) preloaderProgress.style.width = '100%';
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 400);
        }
      }, 50);
    }
  }

  requestAnimationFrame(animatePreloader);


  /* ==========================================================
     2. CONTINUOUS FLUID COFFEE POUR ANIMATION (HTML5 CANVAS)
     ========================================================== */
  const canvas = document.getElementById('coffeePourCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const baseW = 380;
    const baseH = 280;

    // Set high-DPI canvas resolution
    canvas.width = baseW * dpr;
    canvas.height = baseH * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;
    let ripples = [];
    let droplets = [];
    let steamParticles = [];
    let kettleSteam = [];
    const cupX = 262;
    const cupY = 176;

    // Initialize cup steam particles
    for (let i = 0; i < 7; i++) {
      steamParticles.push({
        x: cupX - 18 + Math.random() * 36,
        y: cupY - 10 - Math.random() * 80,
        vy: 0.45 + Math.random() * 0.45,
        driftSpeed: 0.02 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        life: Math.random(),
        maxLife: 0.8 + Math.random() * 0.4,
        size: 9 + Math.random() * 12
      });
    }

    // Initialize kettle lid micro-steam
    for (let i = 0; i < 4; i++) {
      kettleSteam.push({
        relX: 0,
        relY: -44,
        life: Math.random(),
        maxLife: 0.6 + Math.random() * 0.3,
        size: 3 + Math.random() * 4
      });
    }

    // Add continuous ripples on cup liquid
    function spawnRipple() {
      ripples.push({
        r: 3,
        maxR: 34 + Math.random() * 8,
        alpha: 0.85,
        speed: 0.52 + Math.random() * 0.2
      });
    }

    // Add micro-splashes / droplets
    function spawnDroplet() {
      if (droplets.length < 5) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.1 + Math.random() * 1.6;
        droplets.push({
          x: cupX,
          y: cupY,
          vx: Math.cos(angle) * (speed * 0.8),
          vy: -Math.abs(Math.sin(angle) * speed) - 1.1,
          radius: 1.1 + Math.random() * 1.3,
          alpha: 1,
          gravity: 0.12
        });
      }
    }

    // Interactive ripple on click or touch
    canvas.addEventListener('click', () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(spawnRipple, i * 75);
      }
      for (let i = 0; i < 4; i++) {
        spawnDroplet();
      }
    });

    let rippleTimer = 0;
    let dropletTimer = 0;

    function renderCoffeePour() {
      time += 0.035;
      rippleTimer++;
      dropletTimer++;

      if (rippleTimer % 18 === 0) spawnRipple();
      if (dropletTimer % 24 === 0) spawnDroplet();

      ctx.clearRect(0, 0, baseW, baseH);

      // --- 1. AMBIENT WARM GLOW BEHIND SCENE ---
      const glowGrad = ctx.createRadialGradient(cupX - 40, cupY - 20, 10, cupX - 40, cupY - 20, 160);
      glowGrad.addColorStop(0, 'rgba(217, 160, 91, 0.14)');
      glowGrad.addColorStop(1, 'rgba(248, 245, 239, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cupX - 40, cupY - 20, 160, 0, Math.PI * 2);
      ctx.fill();

      // ==========================================
      // --- 2. CERAMIC CUP & SAUCER (RIGHT) ---
      // ==========================================

      // Saucer Shadow on Table
      ctx.fillStyle = 'rgba(51, 36, 27, 0.08)';
      ctx.beginPath();
      ctx.ellipse(cupX, 252, 82, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Saucer Ceramic Plate Outer
      const saucerGrad = ctx.createLinearGradient(cupX - 80, 244, cupX + 80, 244);
      saucerGrad.addColorStop(0, '#e5ded2');
      saucerGrad.addColorStop(0.2, '#faf7f2');
      saucerGrad.addColorStop(0.5, '#ffffff');
      saucerGrad.addColorStop(0.8, '#f3ede2');
      saucerGrad.addColorStop(1, '#dbd1c1');

      ctx.fillStyle = saucerGrad;
      ctx.strokeStyle = '#d6ccbe';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cupX, 244, 76, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Saucer Inner Well Ring
      ctx.strokeStyle = 'rgba(184, 94, 53, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cupX, 244, 48, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Cup Handle
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#ebd9c3';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cupX + 48, 202, 16, -Math.PI * 0.4, Math.PI * 0.55);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#faf7f2';
      ctx.beginPath();
      ctx.arc(cupX + 48, 202, 16, -Math.PI * 0.35, Math.PI * 0.5);
      ctx.stroke();

      // Cup Ceramic Body
      const cupGrad = ctx.createLinearGradient(cupX - 52, 175, cupX + 52, 175);
      cupGrad.addColorStop(0, '#ded4c4');
      cupGrad.addColorStop(0.15, '#f5efe4');
      cupGrad.addColorStop(0.5, '#ffffff');
      cupGrad.addColorStop(0.85, '#ede6da');
      cupGrad.addColorStop(1, '#d8cdbb');

      ctx.fillStyle = cupGrad;
      ctx.strokeStyle = '#d0c4b2';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(cupX - 48, 175);
      ctx.quadraticCurveTo(cupX - 46, 208, cupX - 28, 235);
      ctx.lineTo(cupX + 28, 235);
      ctx.quadraticCurveTo(cupX + 46, 208, cupX + 48, 175);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cup Base Ellipse
      ctx.fillStyle = '#dbd0bf';
      ctx.beginPath();
      ctx.ellipse(cupX, 235, 28, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cup Outer Ceramic Rim
      ctx.fillStyle = '#faf7f2';
      ctx.strokeStyle = '#b85e35';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cupX, 175, 48, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Liquid Surface with Inner Clipping
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cupX, 176, 44, 14, 0, 0, Math.PI * 2);
      ctx.clip();

      // Deep rich espresso base
      const coffeeGrad = ctx.createRadialGradient(cupX, 176, 4, cupX, 176, 46);
      coffeeGrad.addColorStop(0, '#5a3118');
      coffeeGrad.addColorStop(0.35, '#3a1e12');
      coffeeGrad.addColorStop(0.75, '#26130b');
      coffeeGrad.addColorStop(1, '#1b0d07');
      ctx.fillStyle = coffeeGrad;
      ctx.fillRect(cupX - 50, 160, 100, 35);

      // Crema foam outer perimeter ring
      const cremaGrad = ctx.createRadialGradient(cupX, 176, 18, cupX, 176, 46);
      cremaGrad.addColorStop(0, 'rgba(197, 131, 63, 0)');
      cremaGrad.addColorStop(0.7, 'rgba(217, 160, 91, 0.45)');
      cremaGrad.addColorStop(0.95, 'rgba(217, 160, 91, 0.85)');
      cremaGrad.addColorStop(1, 'rgba(150, 85, 35, 0.95)');
      ctx.fillStyle = cremaGrad;
      ctx.fillRect(cupX - 50, 160, 100, 35);

      // Dynamic swirling crema textures
      for (let s = 0; s < 3; s++) {
        ctx.strokeStyle = `rgba(224, 172, 108, ${0.25 - s * 0.05})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const swirlAngle = time * 0.4 + s * (Math.PI * 0.65);
        ctx.ellipse(
          cupX + Math.cos(swirlAngle) * 8,
          176 + Math.sin(swirlAngle) * 2.5,
          22 + s * 7,
          6 + s * 2.2,
          swirlAngle * 0.2,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Concentric Expanding Ripples from Impact Point
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
        ctx.ellipse(cupX, 176, rip.r, rip.r * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(58, 30, 18, ${rip.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cupX, 176.5, rip.r * 0.92, rip.r * 0.29, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Froth micro-bubbles
      for (let b = 0; b < 6; b++) {
        const bAngle = time * 0.25 + (b * Math.PI / 3);
        const bx = cupX + Math.cos(bAngle) * (12 + Math.sin(time + b) * 3);
        const by = 176 + Math.sin(bAngle) * (4 + Math.cos(time + b) * 1);
        ctx.fillStyle = 'rgba(235, 195, 140, 0.75)';
        ctx.beginPath();
        ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // Restore cup clipping


      // ==========================================
      // --- 3. THE WHOLE ARTISANAL BARISTA KETTLE ---
      // ==========================================
      const kettleX = 118;
      const kettleY = 114 + Math.sin(time * 1.6) * 1.4; // Barista hand breathing motion
      const tilt = 0.38 + Math.sin(time * 1.6) * 0.015; // Natural ~22° pouring angle

      // Calculate global tip position of the spout nozzle
      const localTipX = 112;
      const localTipY = -36;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const globalTipX = kettleX + (localTipX * cosT - localTipY * sinT);
      const globalTipY = kettleY + (localTipX * sinT + localTipY * cosT);

      // Render Kettle Group
      ctx.save();
      ctx.translate(kettleX, kettleY);
      ctx.rotate(tilt);

      // --- Kettle Ambient Shadow on Table ---
      ctx.fillStyle = 'rgba(51, 36, 27, 0.07)';
      ctx.beginPath();
      ctx.ellipse(0, 52, 38, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- Kettle Handle (Counterbalanced Ergonomic Grip on Left) ---
      ctx.strokeStyle = '#18120e';
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-25, -24);
      ctx.lineTo(-58, -28);
      ctx.quadraticCurveTo(-66, -29, -68, -22);
      ctx.quadraticCurveTo(-72, 0, -64, 22);
      ctx.quadraticCurveTo(-60, 30, -50, 27);
      ctx.lineTo(-28, 22);
      ctx.stroke();

      // Handle top highlight
      ctx.strokeStyle = 'rgba(197, 131, 63, 0.4)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-26, -26);
      ctx.lineTo(-58, -30);
      ctx.stroke();

      // Brass mounting rivets on handle
      ctx.fillStyle = '#c5833f';
      ctx.beginPath();
      ctx.arc(-26, -24, 2, 0, Math.PI * 2);
      ctx.arc(-28, 22, 2, 0, Math.PI * 2);
      ctx.fill();

      // --- Kettle Main Body ---
      const bodyGrad = ctx.createLinearGradient(-32, 0, 32, 0);
      bodyGrad.addColorStop(0, '#150f0c');
      bodyGrad.addColorStop(0.2, '#2c2018');
      bodyGrad.addColorStop(0.55, '#4a3627');
      bodyGrad.addColorStop(0.85, '#322319');
      bodyGrad.addColorStop(1, '#1b120d');

      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#221711';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      // Tapered architectural cylinder with rounded bottom corners
      ctx.moveTo(-24, -34);
      ctx.lineTo(24, -34);
      ctx.lineTo(31, 32);
      ctx.quadraticCurveTo(32, 38, 26, 38);
      ctx.lineTo(-26, 38);
      ctx.quadraticCurveTo(-32, 38, -31, 32);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Body Brushed Metallic Specular Highlight Line
      ctx.strokeStyle = 'rgba(217, 160, 91, 0.32)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(6, -32);
      ctx.lineTo(9, 36);
      ctx.stroke();

      // Bottom Polished Brass Accent Ring
      const brassRingGrad = ctx.createLinearGradient(-32, 35, 32, 35);
      brassRingGrad.addColorStop(0, '#8c582f');
      brassRingGrad.addColorStop(0.4, '#d9a05b');
      brassRingGrad.addColorStop(0.7, '#f0c68d');
      brassRingGrad.addColorStop(1, '#7a4a25');

      ctx.fillStyle = brassRingGrad;
      ctx.beginPath();
      ctx.rect(-30, 34, 60, 4);
      ctx.fill();

      // --- Kettle Lid & Precision Barista Dial Thermometer ---
      // Lid Base Seat
      ctx.fillStyle = '#221711';
      ctx.fillRect(-22, -38, 44, 4);

      // Domed Lid Cap
      ctx.fillStyle = '#35251a';
      ctx.beginPath();
      ctx.ellipse(0, -38, 20, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Micro Steam Vent hole
      ctx.fillStyle = '#100a06';
      ctx.beginPath();
      ctx.arc(11, -39, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Steam puff from vent
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.arc(11, -43 - Math.sin(time * 3) * 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dial Thermometer Knob Base
      ctx.fillStyle = '#c5833f';
      ctx.fillRect(-6, -45, 12, 4);

      // Circular Thermometer Bezel
      ctx.fillStyle = '#faf6ee';
      ctx.strokeStyle = '#d9a05b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, -50, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Gauge face markings & red extraction needle (pointing at 93°C)
      ctx.strokeStyle = '#5c483a';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, -50, 5, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();

      ctx.strokeStyle = '#c53030';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.lineTo(2.8, -53.2); // Needle pointing at sweet-spot brew temp
      ctx.stroke();

      // Center pivot dot
      ctx.fillStyle = '#221a15';
      ctx.beginPath();
      ctx.arc(0, -50, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // --- Artisanal Gooseneck Spout (Originates low on right, curves up and over) ---
      // Outer spout shadow
      ctx.strokeStyle = 'rgba(28, 18, 12, 0.4)';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(27, 26);
      ctx.bezierCurveTo(60, 28, 76, 2, 85, -28);
      ctx.bezierCurveTo(89, -44, 100, -48, 111, -35);
      ctx.stroke();

      // Spout Body (Matte Bronze Metallic)
      const spoutGrad = ctx.createLinearGradient(27, 26, 112, -36);
      spoutGrad.addColorStop(0, '#35251a');
      spoutGrad.addColorStop(0.5, '#4f392a');
      spoutGrad.addColorStop(0.85, '#2f1f15');
      spoutGrad.addColorStop(1, '#24170f');

      ctx.strokeStyle = spoutGrad;
      ctx.lineWidth = 6.8;
      ctx.beginPath();
      ctx.moveTo(27, 25);
      ctx.bezierCurveTo(60, 27, 76, 1, 85, -29);
      ctx.bezierCurveTo(89, -45, 100, -49, 112, -36);
      ctx.stroke();

      // Spout Specular Highlight
      ctx.strokeStyle = 'rgba(217, 160, 91, 0.55)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(30, 23);
      ctx.bezierCurveTo(62, 24, 76, 0, 85, -30);
      ctx.bezierCurveTo(89, -45, 99, -48, 110, -37);
      ctx.stroke();

      // Brass Precision Pour Nozzle Collar
      ctx.fillStyle = '#c5833f';
      ctx.strokeStyle = '#e2ab69';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(112, -36, 4.4, 2.3, Math.PI * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dark inner nozzle aperture
      ctx.fillStyle = '#140a05';
      ctx.beginPath();
      ctx.ellipse(112, -36, 3, 1.4, Math.PI * 0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Restore from Kettle Tilt Matrix


      // ==========================================
      // --- 4. CONTINUOUS FLUID COFFEE STREAM ---
      // ==========================================
      // Continuous stream flowing from the gooseneck tip down into the cup
      const startX = globalTipX;
      const startY = globalTipY;
      const targetX = cupX;
      const targetY = 176;
      const streamSteps = 24;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Stream path with fluid sinusoidal turbulence
      ctx.beginPath();
      for (let i = 0; i <= streamSteps; i++) {
        const progress = i / streamSteps;
        const currY = startY + (targetY - startY) * progress;
        // Natural fluid wave oscillation
        const wave = Math.sin(currY * 0.055 - time * 8) * 1.4 + Math.cos(currY * 0.025 + time * 4) * 0.5;
        const currX = startX + (targetX - startX) * progress + wave;

        if (i === 0) {
          ctx.moveTo(currX, currY);
        } else {
          ctx.lineTo(currX, currY);
        }
      }

      // Base stream shadow/depth
      ctx.strokeStyle = '#2b140b';
      ctx.lineWidth = 5.2;
      ctx.stroke();

      // Amber liquid core
      ctx.strokeStyle = '#7c4320';
      ctx.lineWidth = 3.6;
      ctx.stroke();

      // Shimmering Golden Crema Highlight rushing down at 60fps
      ctx.strokeStyle = '#e2ab69';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([9, 14]);
      ctx.lineDashOffset = -time * 95;
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash


      // ==========================================
      // --- 5. IMPACT SPLASH & ACTIVE DROPLETS ---
      // ==========================================
      const frothPulse = Math.sin(time * 12) * 1.2;
      const frothGrad = ctx.createRadialGradient(cupX, 176, 1, cupX, 176, 8 + frothPulse);
      frothGrad.addColorStop(0, '#ffe8c2');
      frothGrad.addColorStop(0.5, '#c5833f');
      frothGrad.addColorStop(1, 'rgba(184, 94, 53, 0)');
      ctx.fillStyle = frothGrad;
      ctx.beginPath();
      ctx.ellipse(cupX, 176, 9 + frothPulse, 4.2 + frothPulse * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Active Droplets bouncing up
      for (let d = droplets.length - 1; d >= 0; d--) {
        const drop = droplets[d];
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vy += drop.gravity;
        drop.alpha -= 0.028;

        if (drop.alpha <= 0 || drop.y > 182) {
          droplets.splice(d, 1);
          continue;
        }

        ctx.fillStyle = `rgba(217, 160, 91, ${drop.alpha})`;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fill();
      }


      // ==========================================
      // --- 6. RISING STEAM PLUMES FROM CUP ---
      // ==========================================
      steamParticles.forEach(p => {
        p.y -= p.vy;
        p.life += 0.008;

        if (p.life >= p.maxLife || p.y < 35) {
          p.x = cupX - 16 + Math.random() * 32;
          p.y = 172;
          p.life = 0;
          p.vy = 0.45 + Math.random() * 0.45;
          p.size = 9 + Math.random() * 12;
        }

        const steamAlpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.16;
        const driftX = Math.sin(time * 1.5 + p.phase + p.y * 0.04) * 8;

        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${steamAlpha})`;
        ctx.filter = 'blur(6px)';
        ctx.beginPath();
        ctx.arc(p.x + driftX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderCoffeePour);
    }

    renderCoffeePour();
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
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
});