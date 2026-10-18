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
     2. CONTINUOUS FLUID COFFEE EXTRACTION (SOMETHING POURING ONLY)
     ========================================================== */
  const canvas = document.getElementById('coffeePourCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const baseW = 300;
    const baseH = 260;

    // Set high-DPI canvas resolution
    canvas.width = baseW * dpr;
    canvas.height = baseH * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;
    let ripples = [];
    let droplets = [];
    let steamParticles = [];
    const centerX = 150;
    const cupSurfaceY = 154;

    // Initialize steam particles
    for (let i = 0; i < 7; i++) {
      steamParticles.push({
        x: centerX - 18 + Math.random() * 36,
        y: cupSurfaceY - 10 - Math.random() * 75,
        vy: 0.45 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        life: Math.random(),
        maxLife: 0.8 + Math.random() * 0.4,
        size: 9 + Math.random() * 12
      });
    }

    // Add concentric ripples
    function spawnRipple() {
      ripples.push({
        r: 3,
        maxR: 38 + Math.random() * 8,
        alpha: 0.85,
        speed: 0.55 + Math.random() * 0.2
      });
    }

    // Add active micro-droplets
    function spawnDroplet() {
      if (droplets.length < 5) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 1.8;
        droplets.push({
          x: centerX,
          y: cupSurfaceY,
          vx: Math.cos(angle) * (speed * 0.8),
          vy: -Math.abs(Math.sin(angle) * speed) - 1.2,
          radius: 1.1 + Math.random() * 1.3,
          alpha: 1,
          gravity: 0.12
        });
      }
    }

    // Interactive ripple boost on click / tap
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

      // --- 1. AMBIENT BACKLIGHT GLOW ---
      const glowGrad = ctx.createRadialGradient(centerX, 150, 10, centerX, 150, 120);
      glowGrad.addColorStop(0, 'rgba(217, 160, 91, 0.12)');
      glowGrad.addColorStop(1, 'rgba(248, 245, 239, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, 150, 120, 0, Math.PI * 2);
      ctx.fill();

      // ==========================================
      // --- 2. CERAMIC CUP & SAUCER (CENTERED) ---
      // ==========================================

      // Saucer Ambient Shadow
      ctx.fillStyle = 'rgba(51, 36, 27, 0.08)';
      ctx.beginPath();
      ctx.ellipse(centerX, 238, 92, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Saucer Outer Ceramic Rim
      const saucerGrad = ctx.createLinearGradient(centerX - 90, 230, centerX + 90, 230);
      saucerGrad.addColorStop(0, '#e5ded2');
      saucerGrad.addColorStop(0.2, '#faf7f2');
      saucerGrad.addColorStop(0.5, '#ffffff');
      saucerGrad.addColorStop(0.8, '#f3ede2');
      saucerGrad.addColorStop(1, '#dbd1c1');

      ctx.fillStyle = saucerGrad;
      ctx.strokeStyle = '#d6ccbe';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, 230, 86, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Saucer Inner Well Ring
      ctx.strokeStyle = 'rgba(184, 94, 53, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, 230, 56, 9, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Cup Handle on Right Side
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#ebd9c3';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(centerX + 56, 185, 17, -Math.PI * 0.4, Math.PI * 0.55);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#faf7f2';
      ctx.beginPath();
      ctx.arc(centerX + 56, 185, 17, -Math.PI * 0.35, Math.PI * 0.5);
      ctx.stroke();

      // Cup Ceramic Body
      const cupGrad = ctx.createLinearGradient(centerX - 60, 152, centerX + 60, 152);
      cupGrad.addColorStop(0, '#ded4c4');
      cupGrad.addColorStop(0.15, '#f5efe4');
      cupGrad.addColorStop(0.5, '#ffffff');
      cupGrad.addColorStop(0.85, '#ede6da');
      cupGrad.addColorStop(1, '#d8cdbb');

      ctx.fillStyle = cupGrad;
      ctx.strokeStyle = '#d0c4b2';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(centerX - 56, 152);
      ctx.quadraticCurveTo(centerX - 54, 192, centerX - 32, 222);
      ctx.lineTo(centerX + 32, 222);
      ctx.quadraticCurveTo(centerX + 54, 192, centerX + 56, 152);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cup Base Ellipse
      ctx.fillStyle = '#dbd0bf';
      ctx.beginPath();
      ctx.ellipse(centerX, 222, 32, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cup Outer Ceramic Rim
      ctx.fillStyle = '#faf7f2';
      ctx.strokeStyle = '#b85e35';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(centerX, 152, 56, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Liquid Surface with Inner Clipping
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, cupSurfaceY, 52, 15.5, 0, 0, Math.PI * 2);
      ctx.clip();

      // Deep rich espresso base
      const coffeeGrad = ctx.createRadialGradient(centerX, cupSurfaceY, 4, centerX, cupSurfaceY, 50);
      coffeeGrad.addColorStop(0, '#5a3118');
      coffeeGrad.addColorStop(0.35, '#3a1e12');
      coffeeGrad.addColorStop(0.75, '#26130b');
      coffeeGrad.addColorStop(1, '#1b0d07');
      ctx.fillStyle = coffeeGrad;
      ctx.fillRect(centerX - 60, cupSurfaceY - 20, 120, 40);

      // Crema foam outer perimeter ring
      const cremaGrad = ctx.createRadialGradient(centerX, cupSurfaceY, 20, centerX, cupSurfaceY, 50);
      cremaGrad.addColorStop(0, 'rgba(197, 131, 63, 0)');
      cremaGrad.addColorStop(0.7, 'rgba(217, 160, 91, 0.45)');
      cremaGrad.addColorStop(0.95, 'rgba(217, 160, 91, 0.85)');
      cremaGrad.addColorStop(1, 'rgba(150, 85, 35, 0.95)');
      ctx.fillStyle = cremaGrad;
      ctx.fillRect(centerX - 60, cupSurfaceY - 20, 120, 40);

      // Swirling crema marbling textures
      for (let s = 0; s < 3; s++) {
        ctx.strokeStyle = `rgba(224, 172, 108, ${0.25 - s * 0.05})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const swirlAngle = time * 0.4 + s * (Math.PI * 0.65);
        ctx.ellipse(
          centerX + Math.cos(swirlAngle) * 9,
          cupSurfaceY + Math.sin(swirlAngle) * 3,
          26 + s * 9,
          7 + s * 2.5,
          swirlAngle * 0.2,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Concentric Expanding Wave Ripples
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
        ctx.ellipse(centerX, cupSurfaceY, rip.r, rip.r * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(58, 30, 18, ${rip.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(centerX, cupSurfaceY + 0.5, rip.r * 0.92, rip.r * 0.29, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Froth micro-bubbles
      for (let b = 0; b < 6; b++) {
        const bAngle = time * 0.25 + (b * Math.PI / 3);
        const bx = centerX + Math.cos(bAngle) * (14 + Math.sin(time + b) * 3);
        const by = cupSurfaceY + Math.sin(bAngle) * (4.5 + Math.cos(time + b) * 1);
        ctx.fillStyle = 'rgba(235, 195, 140, 0.75)';
        ctx.beginPath();
        ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // Restore cup clipping


      // =======================================================
      // --- 3. ARCHITECTURAL EXTRACTION GROUP HEAD (TOP CENTER) ---
      // =======================================================
      // Brushed Stainless Steel & Brass extraction group flush at top
      ctx.save();

      // Top Mounting Collar
      const groupGrad = ctx.createLinearGradient(centerX - 42, 10, centerX + 42, 10);
      groupGrad.addColorStop(0, '#2c221b');
      groupGrad.addColorStop(0.2, '#5a4639');
      groupGrad.addColorStop(0.5, '#8c705c');
      groupGrad.addColorStop(0.8, '#5a4639');
      groupGrad.addColorStop(1, '#2c221b');

      ctx.fillStyle = groupGrad;
      ctx.fillRect(centerX - 40, 6, 80, 10);

      // Polished Brass Accent Ring
      const brassCollar = ctx.createLinearGradient(centerX - 40, 16, centerX + 40, 16);
      brassCollar.addColorStop(0, '#8c582f');
      brassCollar.addColorStop(0.3, '#d9a05b');
      brassCollar.addColorStop(0.7, '#f0c68d');
      brassCollar.addColorStop(1, '#7a4a25');

      ctx.fillStyle = brassCollar;
      ctx.beginPath();
      ctx.ellipse(centerX, 16, 38, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Micro-mesh Shower Screen Underneath
      ctx.fillStyle = '#18100b';
      ctx.beginPath();
      ctx.ellipse(centerX, 16, 34, 3.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fluid Extraction Gathering Cone
      const coneGrad = ctx.createLinearGradient(centerX - 10, 16, centerX + 10, 26);
      coneGrad.addColorStop(0, '#5a3118');
      coneGrad.addColorStop(0.5, '#8c4820');
      coneGrad.addColorStop(1, '#4a2512');

      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - 12, 16);
      ctx.quadraticCurveTo(centerX - 6, 22, centerX - 3, 26);
      ctx.lineTo(centerX + 3, 26);
      ctx.quadraticCurveTo(centerX + 6, 22, centerX + 12, 16);
      ctx.closePath();
      ctx.fill();

      ctx.restore();


      // ==========================================
      // --- 4. CONTINUOUS FLUID COFFEE STREAM ---
      // ==========================================
      // The stream flows continuously from gathering cone (y=26) down to cup (y=154)
      const startX = centerX;
      const startY = 26;
      const targetX = centerX;
      const targetY = cupSurfaceY;
      const streamSteps = 24;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Sinuous fluid stream path
      ctx.beginPath();
      for (let i = 0; i <= streamSteps; i++) {
        const progress = i / streamSteps;
        const currY = startY + (targetY - startY) * progress;
        // Natural fluid wave oscillation
        const wave = Math.sin(currY * 0.055 - time * 8) * 1.5 + Math.cos(currY * 0.025 + time * 4) * 0.6;
        const currX = startX + wave;

        if (i === 0) {
          ctx.moveTo(currX, currY);
        } else {
          ctx.lineTo(currX, currY);
        }
      }

      // Base stream shadow/depth
      ctx.strokeStyle = '#2b140b';
      ctx.lineWidth = 5.4;
      ctx.stroke();

      // Amber liquid core
      ctx.strokeStyle = '#7c4320';
      ctx.lineWidth = 3.8;
      ctx.stroke();

      // Shimmering Golden Crema Highlight rushing down at 60fps
      ctx.strokeStyle = '#e2ab69';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([9, 14]);
      ctx.lineDashOffset = -time * 110; // High-velocity fluid extraction
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash


      // ==========================================
      // --- 5. IMPACT SPLASH & MICRO DROPLETS ---
      // ==========================================
      const frothPulse = Math.sin(time * 12) * 1.2;
      const frothGrad = ctx.createRadialGradient(centerX, cupSurfaceY, 1, centerX, cupSurfaceY, 8 + frothPulse);
      frothGrad.addColorStop(0, '#ffe8c2');
      frothGrad.addColorStop(0.5, '#c5833f');
      frothGrad.addColorStop(1, 'rgba(184, 94, 53, 0)');
      ctx.fillStyle = frothGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, cupSurfaceY, 9 + frothPulse, 4.2 + frothPulse * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Active Droplets bouncing up
      for (let d = droplets.length - 1; d >= 0; d--) {
        const drop = droplets[d];
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vy += drop.gravity;
        drop.alpha -= 0.028;

        if (drop.alpha <= 0 || drop.y > cupSurfaceY + 6) {
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

        if (p.life >= p.maxLife || p.y < 30) {
          p.x = centerX - 16 + Math.random() * 32;
          p.y = cupSurfaceY - 5;
          p.life = 0;
          p.vy = 0.45 + Math.random() * 0.45;
          p.size = 9 + Math.random() * 12;
        }

        const steamAlpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.16;
        const driftX = Math.sin(time * 1.5 + p.phase + p.y * 0.04) * 8;

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