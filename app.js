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
     2. INTERACTIVE ZERO-GRAVITY FLOATING GRAVITY FIELD ENGINE
     ========================================================== */
  const gravityCanvas = document.getElementById('gravityFieldCanvas');

  if (gravityCanvas) {
    const ctx = gravityCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    function resizeGravityCanvas() {
      const rect = gravityCanvas.parentElement ? gravityCanvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      gravityCanvas.width = width * dpr;
      gravityCanvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    resizeGravityCanvas();
    window.addEventListener('resize', resizeGravityCanvas);

    // Mouse / Touch Tracking
    let mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
      lastMoveTime: 0
    };

    let shockwaves = [];

    function updatePointerPos(clientX, clientY) {
      const rect = gravityCanvas.getBoundingClientRect();
      mouse.targetX = clientX - rect.left;
      mouse.targetY = clientY - rect.top;
      mouse.active = true;
      mouse.lastMoveTime = performance.now();
    }

    window.addEventListener('mousemove', (e) => {
      const rect = gravityCanvas.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        updatePointerPos(e.clientX, e.clientY);
      } else {
        mouse.active = false;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.active = false;
    });

    // Shockwave Impulse on Click / Tap
    function triggerShockwave(x, y) {
      shockwaves.push({
        x: x,
        y: y,
        radius: 10,
        maxRadius: 180,
        strength: 9.0,
        alpha: 0.8
      });
    }

    gravityCanvas.addEventListener('click', (e) => {
      const rect = gravityCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerShockwave(clickX, clickY);
    });

    // Particle Generation: Roasted Coffee Beans & Amber Honey Orbs
    const particleCount = window.innerWidth < 640 ? 28 : 46;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const isBean = Math.random() < 0.65; // 65% beans, 35% amber beads
      const depth = 0.6 + Math.random() * 0.8; // Parallax depth layer

      particles.push({
        isBean: isBean,
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.45 * depth,
        vy: (Math.random() - 0.5) * 0.45 * depth,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.015,
        baseSize: isBean ? (14 + Math.random() * 14) : (7 + Math.random() * 9),
        depth: depth,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.015,
        roastTone: Math.random(), // Variant shades of roast
        aspect: 1.35 + Math.random() * 0.25 // Bean elongation
      });
    }

    let time = 0;
    let isVisible = true;

    // Pause physics rendering when hero is scrolled out of viewport
    const heroObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    heroObserver.observe(gravityCanvas);

    function drawRoastedBean(ctx, p) {
      const size = p.baseSize * p.depth;
      const w = size * p.aspect;
      const h = size;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Bean Drop Shadow
      ctx.fillStyle = `rgba(51, 36, 27, ${0.12 * p.depth})`;
      ctx.beginPath();
      ctx.ellipse(3 * p.depth, 6 * p.depth, w * 0.9, h * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Roasted Bean Body Gradient
      const beanGrad = ctx.createLinearGradient(-w, -h, w, h);
      if (p.roastTone > 0.6) {
        // Dark French Roast
        beanGrad.addColorStop(0, '#422214');
        beanGrad.addColorStop(0.3, '#2a140b');
        beanGrad.addColorStop(0.7, '#1b0c06');
        beanGrad.addColorStop(1, '#120703');
      } else if (p.roastTone > 0.3) {
        // Medium Estate Roast
        beanGrad.addColorStop(0, '#5a2e1a');
        beanGrad.addColorStop(0.35, '#3b1c0e');
        beanGrad.addColorStop(0.75, '#261108');
        beanGrad.addColorStop(1, '#1a0b05');
      } else {
        // Light Honey Process Roast
        beanGrad.addColorStop(0, '#703c21');
        beanGrad.addColorStop(0.35, '#4e2714');
        beanGrad.addColorStop(0.8, '#33180c');
        beanGrad.addColorStop(1, '#220e06');
      }

      ctx.fillStyle = beanGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Specular Shell Highlight
      ctx.strokeStyle = `rgba(255, 230, 190, ${0.12 * p.depth})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(-1, -1, w * 0.92, h * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Signature Sinuous Center Crevice (The Coffee Bean Crease)
      ctx.beginPath();
      ctx.moveTo(-w * 0.85, 0);
      ctx.bezierCurveTo(-w * 0.3, -h * 0.3, w * 0.3, h * 0.3, w * 0.85, 0);
      ctx.strokeStyle = '#0e0502';
      ctx.lineWidth = Math.max(1.5 * p.depth, 1.2);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Cream/Chaff Golden Edge in the crease
      ctx.beginPath();
      ctx.moveTo(-w * 0.65, 0.4);
      ctx.bezierCurveTo(-w * 0.2, -h * 0.25, w * 0.25, h * 0.25, w * 0.65, 0.4);
      ctx.strokeStyle = `rgba(224, 185, 130, ${0.35 * p.depth})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    function drawAmberOrb(ctx, p) {
      const radius = p.baseSize * p.depth;

      ctx.save();
      ctx.translate(p.x, p.y);

      // Soft Radiant Glow
      const glowGrad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius * 2.2);
      glowGrad.addColorStop(0, `rgba(217, 160, 91, ${0.35 * p.depth})`);
      glowGrad.addColorStop(1, 'rgba(217, 160, 91, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Amber Bead Body
      const orbGrad = ctx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
      orbGrad.addColorStop(0, '#fff3db');
      orbGrad.addColorStop(0.35, '#e5a557');
      orbGrad.addColorStop(0.8, '#b85e35');
      orbGrad.addColorStop(1, '#662c11');

      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Core Highlight Sparkle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.24, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function renderGravityField() {
      if (isVisible) {
        time += 0.016;

        // Smooth mouse easing
        if (mouse.active) {
          mouse.x += (mouse.targetX - mouse.x) * 0.15;
          mouse.y += (mouse.targetY - mouse.y) * 0.15;
        } else {
          mouse.x = -9999;
          mouse.y = -9999;
        }

        ctx.clearRect(0, 0, width, height);

        // Update & Render Shockwaves
        for (let s = shockwaves.length - 1; s >= 0; s--) {
          const sw = shockwaves[s];
          sw.radius += 5.5;
          sw.alpha -= 0.022;

          if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
            shockwaves.splice(s, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(184, 94, 53, ${sw.alpha * 0.4})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Update & Render Particles
        particles.forEach(p => {
          // 1. Natural Zero-Gravity Harmonic Buoyancy
          p.phase += p.wobbleSpeed;
          const buoyancyX = Math.cos(p.phase) * 0.18;
          const buoyancyY = Math.sin(p.phase * 0.8) * 0.22;

          p.x += p.vx + buoyancyX;
          p.y += p.vy + buoyancyY;
          p.angle += p.vAngle;

          // 2. Interactive Magnetic & Vortex Cursor Repulsion
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const interactionRadius = 180;

            if (dist < interactionRadius && dist > 1) {
              const force = (1 - dist / interactionRadius);
              const push = force * force * 4.2;

              // Repulsion vector
              p.vx += (dx / dist) * push;
              p.vy += (dy / dist) * push;

              // Sinuous vortex swirl
              const tangentX = -dy / dist;
              const tangentY = dx / dist;
              p.vx += tangentX * force * 1.5;
              p.vy += tangentY * force * 1.5;

              // Angular spin kick
              p.vAngle += (Math.random() - 0.5) * 0.02 * force;
            }
          }

          // 3. Shockwave Push
          shockwaves.forEach(sw => {
            const dx = p.x - sw.x;
            const dy = p.y - sw.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const waveWidth = 45;

            if (Math.abs(dist - sw.radius) < waveWidth && dist > 1) {
              const push = sw.strength * sw.alpha * 1.8;
              p.vx += (dx / dist) * push;
              p.vy += (dy / dist) * push;
              p.vAngle += (Math.random() - 0.5) * 0.08;
            }
          });

          // 4. Fluid Air Resistance Dampening
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.vAngle *= 0.985;

          // 5. Boundary Wrap Around Screen
          const padding = 50;
          if (p.x < -padding) p.x = width + padding;
          if (p.x > width + padding) p.x = -padding;
          if (p.y < -padding) p.y = height + padding;
          if (p.y > height + padding) p.y = -padding;

          // 6. Draw Particle
          if (p.isBean) {
            drawRoastedBean(ctx, p);
          } else {
            drawAmberOrb(ctx, p);
          }
        });
      }

      requestAnimationFrame(renderGravityField);
    }

    renderGravityField();
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
     6. RESERVATION DESK
     ========================================================== */
  const resDateInput = document.getElementById('resDate');

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

      // Record in AMARA live reservations desk
      const newReservationEntry = {
        id: 'res_' + Date.now(),
        bookingRef: bookingRef,
        name: name,
        phone: phone,
        date: rawDate,
        formattedDate: formattedDate,
        time: time,
        guests: guests,
        specialWants: specialWants || '',
        status: 'Confirmed',
        createdAt: Date.now()
      };
      if (typeof addNewReservation === 'function') {
        addNewReservation(newReservationEntry);
      }

      simpleReserveForm.reset();

      // Reset date to today and radio to 2
      if (resDateInput) resDateInput.value = formatDateToISO(new Date());
      const radio2 = document.querySelector('input[name="resGuests"][value="2"]');
      if (radio2) radio2.checked = true;
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
      if (typeof closeOwnerPinModal === 'function') closeOwnerPinModal();
      if (typeof closeStudioModal === 'function') closeStudioModal();
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


  /* ==========================================================
     10. OWNER MANAGEMENT STUDIO (MENU, PHOTOS & RESERVATIONS)
     ========================================================== */

  // --- Default datasets ---
  const DEFAULT_MENU_ITEMS = [
    // Coffee
    { id: 'm1', name: 'Flat White', price: 260, category: 'coffee', inStock: true },
    { id: 'm2', name: 'Cardamom Cortado', price: 280, category: 'coffee', inStock: true },
    { id: 'm3', name: 'Cappuccino', price: 250, category: 'coffee', inStock: true },
    { id: 'm4', name: 'Balur Estate V60', price: 320, category: 'coffee', inStock: true },
    { id: 'm5', name: '24h Cold Drip', price: 330, category: 'coffee', inStock: true },
    // Bakes & Food
    { id: 'm6', name: 'Butter Croissant', price: 240, category: 'bakes', inStock: true },
    { id: 'm7', name: 'Almond Frangipane', price: 320, category: 'bakes', inStock: true },
    { id: 'm8', name: 'Chocolate Babka', price: 280, category: 'bakes', inStock: true },
    { id: 'm9', name: 'Truffle Egg Brioche', price: 440, category: 'bakes', inStock: true },
    { id: 'm10', name: 'Ricotta & Fig Toast', price: 390, category: 'bakes', inStock: true },
    // Cold & Teas
    { id: 'm11', name: 'Espresso Tonic', price: 320, category: 'cold', inStock: true },
    { id: 'm12', name: 'Iced Uji Matcha', price: 360, category: 'cold', inStock: true },
    { id: 'm13', name: 'Cascara Spritz', price: 290, category: 'cold', inStock: true },
    { id: 'm14', name: 'Silver Needle White Tea', price: 280, category: 'cold', inStock: true },
    { id: 'm15', name: 'Iced Oat Latte', price: 310, category: 'cold', inStock: true }
  ];

  const DEFAULT_GALLERY_PHOTOS = [
    { id: 'p1', title: 'The Courtyard', url: 'assets/images/cafe-interior.jpg' },
    { id: 'p2', title: 'The Coffee Bar', url: 'assets/images/space-bar.jpg' },
    { id: 'p3', title: 'The Reading Lounge', url: 'assets/images/space-lounge.jpg' }
  ];

  const DEFAULT_RESERVATIONS = [
    {
      id: 'res_sample1',
      bookingRef: 'BALUR-4192',
      name: 'Aarav Mehta',
      phone: '+91 98451 22891',
      date: '2026-10-18',
      formattedDate: 'Oct 18, 2026',
      time: '08:30 AM',
      guests: '2',
      specialWants: 'Corner table by the courtyard garden',
      status: 'Confirmed',
      createdAt: Date.now() - 3600000
    },
    {
      id: 'res_sample2',
      bookingRef: 'SANCT-8821',
      name: 'Dr. Priya Sen',
      phone: '+91 97410 44923',
      date: '2026-10-18',
      formattedDate: 'Oct 18, 2026',
      time: '11:00 AM',
      guests: '4',
      specialWants: 'Quiet spot for a morning discussion',
      status: 'Seated',
      createdAt: Date.now() - 7200000
    },
    {
      id: 'res_sample3',
      bookingRef: 'INDRA-9024',
      name: 'Kabir & Ananya',
      phone: '+91 99002 11482',
      date: '2026-10-19',
      formattedDate: 'Oct 19, 2026',
      time: '04:30 PM',
      guests: '2',
      specialWants: 'Celebrating anniversary',
      status: 'Confirmed',
      createdAt: Date.now() - 10800000
    }
  ];

  // --- Storage Helper Functions ---
  function getStoredMenuItems() {
    try {
      const data = localStorage.getItem('amara_menu_items');
      return data ? JSON.parse(data) : [...DEFAULT_MENU_ITEMS];
    } catch (e) {
      return [...DEFAULT_MENU_ITEMS];
    }
  }

  function saveStoredMenuItems(items) {
    try {
      localStorage.setItem('amara_menu_items', JSON.stringify(items));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }

  function getStoredGalleryPhotos() {
    try {
      const data = localStorage.getItem('amara_gallery_photos');
      return data ? JSON.parse(data) : [...DEFAULT_GALLERY_PHOTOS];
    } catch (e) {
      return [...DEFAULT_GALLERY_PHOTOS];
    }
  }

  function saveStoredGalleryPhotos(photos) {
    try {
      localStorage.setItem('amara_gallery_photos', JSON.stringify(photos));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }

  function getStoredReservations() {
    try {
      const data = localStorage.getItem('amara_reservations');
      return data ? JSON.parse(data) : [...DEFAULT_RESERVATIONS];
    } catch (e) {
      return [...DEFAULT_RESERVATIONS];
    }
  }

  function saveStoredReservations(reservations) {
    try {
      localStorage.setItem('amara_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }

  function addNewReservation(res) {
    const list = getStoredReservations();
    list.unshift(res);
    saveStoredReservations(list);
    renderStudioReservations();
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Public DOM Renderers ---
  function renderPublicMenu() {
    const container = document.getElementById('menuGridContainer');
    if (!container) return;
    const items = getStoredMenuItems();

    const categories = [
      { key: 'coffee', title: 'Coffee' },
      { key: 'bakes', title: 'Bakes & Food' },
      { key: 'cold', title: 'Cold & Teas' }
    ];

    container.innerHTML = categories.map(cat => {
      const catItems = items.filter(it => it.category === cat.key);
      const itemsHtml = catItems.map(item => `
        <div class="clean-item ${item.inStock ? '' : 'is-sold-out'}">
          <span class="item-name">
            ${escapeHTML(item.name)}
            ${item.inStock ? '' : '<span class="sold-out-tag">(Sold Out)</span>'}
          </span>
          <span class="item-price">₹${item.price}</span>
        </div>
      `).join('');

      return `
        <div class="menu-clean-col" data-col-category="${cat.key}">
          <h3 class="menu-col-title">${cat.title}</h3>
          <div class="menu-clean-list">
            ${itemsHtml || '<p class="text-muted text-center" style="font-size:0.85rem;padding:12px;">No items listed in this category.</p>'}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPublicGallery() {
    const galleryGrid = document.getElementById('atmosphereGalleryGrid');
    if (!galleryGrid) return;
    const photos = getStoredGalleryPhotos();

    galleryGrid.innerHTML = photos.map(photo => `
      <div class="atmosphere-photo-card">
        <img src="${escapeHTML(photo.url)}" alt="${escapeHTML(photo.title)}" loading="lazy" onerror="this.src='assets/images/cafe-interior.jpg'">
        <h4 class="atmosphere-title">${escapeHTML(photo.title)}</h4>
      </div>
    `).join('');
  }

  // --- Studio DOM Renderers ---
  function renderStudioMenu() {
    const menuList = document.getElementById('studioMenuList');
    const badge = document.getElementById('studioMenuBadge');
    const totalBadge = document.getElementById('studioMenuTotalBadge');
    const items = getStoredMenuItems();

    if (badge) badge.textContent = items.length;
    if (totalBadge) totalBadge.textContent = `${items.length} items`;
    if (!menuList) return;

    if (items.length === 0) {
      menuList.innerHTML = `
        <div class="res-empty-state">
          <i class="fa-solid fa-mug-saucer"></i>
          <p>No menu items yet. Use the form on the left to add your first brew or bake.</p>
        </div>
      `;
      return;
    }

    menuList.innerHTML = items.map(item => {
      const catClass = `cat-${item.category}`;
      const catLabel = item.category === 'coffee' ? 'Coffee' : item.category === 'bakes' ? 'Bakes' : 'Cold';

      return `
        <div class="studio-menu-item-row ${item.inStock ? '' : 'is-sold-out'}" data-item-id="${item.id}">
          <div class="menu-row-info">
            <span class="menu-cat-pill ${catClass}">${catLabel}</span>
            <div class="menu-item-title-box">
              <span class="menu-item-name-text">${escapeHTML(item.name)}</span>
              <span class="menu-item-price-text">₹${item.price}</span>
            </div>
          </div>
          <div class="menu-row-actions">
            <button type="button" class="btn-stock-toggle ${item.inStock ? 'in-stock' : 'sold-out'}" data-action="toggle-stock" data-item-id="${item.id}" title="Toggle Availability">
              ${item.inStock ? '<i class="fa-solid fa-check"></i> In Stock' : '<i class="fa-solid fa-ban"></i> Sold Out'}
            </button>
            <button type="button" class="btn-action-icon" data-action="edit-price" data-item-id="${item.id}" title="Edit Price">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action-icon btn-danger" data-action="delete-item" data-item-id="${item.id}" title="Delete Item">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderStudioPhotos() {
    const photosGrid = document.getElementById('studioPhotosGrid');
    const badge = document.getElementById('studioPhotoBadge');
    const totalBadge = document.getElementById('studioPhotoTotalBadge');
    const photos = getStoredGalleryPhotos();

    if (badge) badge.textContent = photos.length;
    if (totalBadge) totalBadge.textContent = `${photos.length} spaces`;
    if (!photosGrid) return;

    if (photos.length === 0) {
      photosGrid.innerHTML = `
        <div class="res-empty-state">
          <i class="fa-regular fa-images"></i>
          <p>No atmosphere photos yet. Upload or link an image on the left.</p>
        </div>
      `;
      return;
    }

    photosGrid.innerHTML = photos.map(photo => `
      <div class="studio-photo-card" data-photo-id="${photo.id}">
        <img src="${escapeHTML(photo.url)}" alt="${escapeHTML(photo.title)}" class="studio-photo-thumb" onerror="this.src='assets/images/cafe-interior.jpg'">
        <div class="studio-photo-caption">
          <span class="studio-photo-title" title="${escapeHTML(photo.title)}">${escapeHTML(photo.title)}</span>
          <button type="button" class="btn-action-icon btn-danger" data-action="delete-photo" data-photo-id="${photo.id}" title="Remove photo from gallery">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  let currentResFilter = 'all';
  let currentResSearch = '';

  function renderStudioReservations() {
    const listEl = document.getElementById('studioReservationsList');
    const resBadge = document.getElementById('studioResBadge');
    const kpiTotal = document.getElementById('resKpiTotal');
    const kpiConfirmed = document.getElementById('resKpiConfirmed');
    const kpiSeated = document.getElementById('resKpiSeated');
    const kpiCancelled = document.getElementById('resKpiCancelled');

    const allBookings = getStoredReservations();

    const confirmedCount = allBookings.filter(b => b.status === 'Confirmed').length;
    const seatedCount = allBookings.filter(b => b.status === 'Seated').length;
    const cancelledCount = allBookings.filter(b => b.status === 'Cancelled').length;

    if (kpiTotal) kpiTotal.textContent = allBookings.length;
    if (kpiConfirmed) kpiConfirmed.textContent = confirmedCount;
    if (kpiSeated) kpiSeated.textContent = seatedCount;
    if (kpiCancelled) kpiCancelled.textContent = cancelledCount;
    if (resBadge) resBadge.textContent = allBookings.length;

    if (!listEl) return;

    let filtered = allBookings;
    if (currentResFilter !== 'all') {
      filtered = filtered.filter(b => b.status === currentResFilter);
    }
    if (currentResSearch.trim()) {
      const q = currentResSearch.trim().toLowerCase();
      filtered = filtered.filter(b => 
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.phone && b.phone.toLowerCase().includes(q)) ||
        (b.bookingRef && b.bookingRef.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="res-empty-state">
          <i class="fa-regular fa-calendar-xmark"></i>
          <p>No reservations found matching this view.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(b => `
      <div class="res-card-row status-${(b.status || 'Confirmed').toLowerCase()}" data-res-id="${b.id}">
        <div class="res-card-main">
          <span class="res-card-ref">#${escapeHTML(b.bookingRef || 'AMARA')}</span>
          <div class="res-card-guest">
            <span class="res-guest-name">${escapeHTML(b.name)}</span>
            <span class="res-guest-phone">${escapeHTML(b.phone)}</span>
          </div>
          <div class="res-card-time-slot">
            <span class="res-time-badge">${escapeHTML(b.time)}</span>
            <span class="res-date-sub">${escapeHTML(b.formattedDate || b.date)}</span>
          </div>
          <span class="res-party-badge">
            <i class="fa-solid fa-user-group"></i> ${escapeHTML(String(b.guests))} ${b.guests === '1' ? 'Guest' : 'Guests'}
          </span>
          ${b.specialWants ? `<span class="res-special-note" title="${escapeHTML(b.specialWants)}"><i class="fa-regular fa-comment-dots"></i> "${escapeHTML(b.specialWants)}"</span>` : ''}
        </div>
        <div class="res-card-ctrls">
          <select class="res-status-select" data-res-id="${b.id}" data-status="${b.status || 'Confirmed'}" aria-label="Change Reservation Status">
            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Seated" ${b.status === 'Seated' ? 'selected' : ''}>Seated</option>
            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          <button type="button" class="btn-action-icon btn-danger" data-action="delete-res" data-res-id="${b.id}" title="Delete reservation entry">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Initial public render on startup
  renderPublicMenu();
  renderPublicGallery();

  // --- Modal Elements & Controls ---
  const openOwnerPortalBtn = document.getElementById('openOwnerPortalBtn');
  const drawerOwnerBtn = document.getElementById('drawerOwnerBtn');
  const footerOwnerBtn = document.getElementById('footerOwnerBtn');
  const ownerPinModal = document.getElementById('ownerPinModal');
  const ownerPinCloseBtn = document.getElementById('ownerPinCloseBtn');
  const ownerPinForm = document.getElementById('ownerPinForm');
  const ownerPinInput = document.getElementById('ownerPinInput');
  const pinToggleBtn = document.getElementById('pinToggleBtn');
  const pinErrorMessage = document.getElementById('pinErrorMessage');
  const ownerStudioModal = document.getElementById('ownerStudioModal');
  const studioCloseBtn = document.getElementById('studioCloseBtn');
  const studioResetDefaultsBtn = document.getElementById('studioResetDefaultsBtn');

  const ownerSessionFloatingPill = document.getElementById('ownerSessionFloatingPill');
  const studioLockBtn = document.getElementById('studioLockBtn');

  function updateOwnerFloatingPill() {
    if (!ownerSessionFloatingPill) return;
    const isUnlocked = sessionStorage.getItem('amara_owner_unlocked') === 'true';
    ownerSessionFloatingPill.style.display = isUnlocked ? 'inline-flex' : 'none';
  }

  // Check on load
  updateOwnerFloatingPill();

  if (ownerSessionFloatingPill) {
    ownerSessionFloatingPill.addEventListener('click', openStudioModal);
  }

  if (studioLockBtn) {
    studioLockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('amara_owner_unlocked');
      updateOwnerFloatingPill();
      closeStudioModal();
      showToast('Owner Desk locked. Session ended.');
    });
  }

  function openOwnerPortal() {
    closeDrawer();
    const isUnlocked = sessionStorage.getItem('amara_owner_unlocked') === 'true';
    if (isUnlocked) {
      openStudioModal();
    } else {
      openOwnerPinModal();
    }
  }

  function openOwnerPinModal() {
    if (ownerPinModal) {
      ownerPinModal.classList.add('open');
      document.body.classList.add('lock-scroll');
      if (ownerPinInput) {
        ownerPinInput.value = '';
        setTimeout(() => ownerPinInput.focus(), 120);
      }
      if (pinErrorMessage) pinErrorMessage.style.display = 'none';
    }
  }

  function closeOwnerPinModal() {
    if (ownerPinModal) {
      ownerPinModal.classList.remove('open');
      document.body.classList.remove('lock-scroll');
    }
  }

  function openStudioModal() {
    if (ownerStudioModal) {
      ownerStudioModal.classList.add('open');
      document.body.classList.add('lock-scroll');
      renderStudioMenu();
      renderStudioPhotos();
      renderStudioReservations();
      updateOwnerFloatingPill();
    }
  }

  function closeStudioModal() {
    if (ownerStudioModal) {
      ownerStudioModal.classList.remove('open');
      document.body.classList.remove('lock-scroll');
    }
  }

  // --- Secret Trigger 1: URL Hash (#owner, #admin, #desk, #sanctuary) ---
  function checkUrlForOwnerDesk() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#owner' || hash === '#admin' || hash === '#desk' || hash === '#sanctuary' || hash === '#portal') {
      openOwnerPortal();
    }
  }
  checkUrlForOwnerDesk();
  window.addEventListener('hashchange', checkUrlForOwnerDesk);

  // --- Secret Trigger 2: Keyboard Shortcut (Ctrl+Shift+O, Cmd+Shift+O, or Alt+O) ---
  document.addEventListener('keydown', (e) => {
    const isO = e.key === 'O' || e.key === 'o';
    if ((e.ctrlKey && e.shiftKey && isO) ||
        (e.metaKey && e.shiftKey && isO) ||
        (e.altKey && isO)) {
      e.preventDefault();
      openOwnerPortal();
    }
  });

  // --- Secret Trigger 3: Secret Word Typing ("owner" or "amara") ---
  let secretKeyBuffer = '';
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      secretKeyBuffer += e.key.toLowerCase();
      if (secretKeyBuffer.length > 8) {
        secretKeyBuffer = secretKeyBuffer.slice(-8);
      }
      if (secretKeyBuffer.endsWith('owner') || secretKeyBuffer.endsWith('amara') || secretKeyBuffer.endsWith('desk')) {
        secretKeyBuffer = '';
        openOwnerPortal();
      }
    }
  });

  // --- Secret Trigger 4: Triple-Click on AMARA Logo Dot or Footer Period ---
  const secretLogoDot = document.getElementById('secretLogoDot');
  const secretFooterDot = document.getElementById('secretFooterDot');
  let secretClickCount = 0;
  let secretClickTimer = null;

  function registerSecretDotClick(e) {
    e.preventDefault();
    e.stopPropagation();
    secretClickCount++;
    clearTimeout(secretClickTimer);
    if (secretClickCount >= 3) {
      secretClickCount = 0;
      openOwnerPortal();
    } else {
      secretClickTimer = setTimeout(() => {
        secretClickCount = 0;
      }, 1000);
    }
  }

  if (secretLogoDot) secretLogoDot.addEventListener('click', registerSecretDotClick);
  if (secretFooterDot) secretFooterDot.addEventListener('click', registerSecretDotClick);

  // Modal dismiss buttons
  if (ownerPinCloseBtn) ownerPinCloseBtn.addEventListener('click', closeOwnerPinModal);
  if (studioCloseBtn) studioCloseBtn.addEventListener('click', closeStudioModal);

  // PIN visibility toggle
  if (pinToggleBtn && ownerPinInput) {
    pinToggleBtn.addEventListener('click', () => {
      const isPassword = ownerPinInput.type === 'password';
      ownerPinInput.type = isPassword ? 'text' : 'password';
      pinToggleBtn.innerHTML = isPassword ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // Owner PIN check (Default: 1450)
  const OWNER_PIN = '1450';
  if (ownerPinForm) {
    ownerPinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = ownerPinInput ? ownerPinInput.value.trim() : '';
      if (enteredPin === OWNER_PIN) {
        sessionStorage.setItem('amara_owner_unlocked', 'true');
        updateOwnerFloatingPill();
        closeOwnerPinModal();
        openStudioModal();
        showToast('Welcome, AMARA Roastery & Café Owner.');
      } else {
        if (pinErrorMessage) {
          pinErrorMessage.textContent = 'Incorrect PIN. Balur Estate altitude is 1450.';
          pinErrorMessage.style.display = 'block';
        }
        if (ownerPinInput) {
          ownerPinInput.select();
        }
      }
    });
  }

  // Studio Tab Switching
  const studioTabs = document.querySelectorAll('.studio-tab');
  const studioPanels = document.querySelectorAll('.studio-panel');

  studioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-studio-tab');

      studioTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      studioPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (tabTarget === 'menu') {
        const p = document.getElementById('studioPanelMenu');
        if (p) p.classList.add('active');
        renderStudioMenu();
      } else if (tabTarget === 'photos') {
        const p = document.getElementById('studioPanelPhotos');
        if (p) p.classList.add('active');
        renderStudioPhotos();
      } else if (tabTarget === 'reservations') {
        const p = document.getElementById('studioPanelReservations');
        if (p) p.classList.add('active');
        renderStudioReservations();
      }
    });
  });

  // --- TAB 1: MENU MANAGER INTERACTIONS ---
  const studioAddMenuForm = document.getElementById('studioAddMenuForm');
  if (studioAddMenuForm) {
    studioAddMenuForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('newItemName');
      const priceInput = document.getElementById('newItemPrice');
      const catInput = document.getElementById('newItemCategory');
      const stockInput = document.getElementById('newItemInStock');

      const name = nameInput ? nameInput.value.trim() : '';
      const price = priceInput ? parseInt(priceInput.value, 10) : 0;
      const category = catInput ? catInput.value : 'coffee';
      const inStock = stockInput ? stockInput.checked : true;

      if (!name || isNaN(price) || price <= 0) {
        showToast('Please provide a valid item name and price.');
        return;
      }

      const items = getStoredMenuItems();
      items.push({
        id: 'm_' + Date.now(),
        name: name,
        price: price,
        category: category,
        inStock: inStock
      });

      saveStoredMenuItems(items);
      renderPublicMenu();
      renderStudioMenu();
      studioAddMenuForm.reset();
      if (stockInput) stockInput.checked = true;
      showToast(`Added "${name}" (₹${price}) to the live menu!`);
    });
  }

  // Menu List Actions: stock toggle, price edit, delete
  const studioMenuList = document.getElementById('studioMenuList');
  if (studioMenuList) {
    studioMenuList.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (!actionBtn) return;
      const action = actionBtn.getAttribute('data-action');
      const itemId = actionBtn.getAttribute('data-item-id');
      const items = getStoredMenuItems();
      const targetItem = items.find(it => it.id === itemId);

      if (!targetItem) return;

      if (action === 'toggle-stock') {
        targetItem.inStock = !targetItem.inStock;
        saveStoredMenuItems(items);
        renderPublicMenu();
        renderStudioMenu();
        showToast(`${targetItem.name} is now marked as ${targetItem.inStock ? 'In Stock' : 'Sold Out'}.`);
      } else if (action === 'edit-price') {
        const newPriceStr = prompt(`Update price for "${targetItem.name}" (in ₹):`, targetItem.price);
        if (newPriceStr !== null) {
          const newPrice = parseInt(newPriceStr.trim(), 10);
          if (!isNaN(newPrice) && newPrice > 0) {
            targetItem.price = newPrice;
            saveStoredMenuItems(items);
            renderPublicMenu();
            renderStudioMenu();
            showToast(`Updated "${targetItem.name}" price to ₹${newPrice}.`);
          } else {
            showToast('Invalid price entered.');
          }
        }
      } else if (action === 'delete-item') {
        if (confirm(`Remove "${targetItem.name}" from the AMARA menu?`)) {
          const updated = items.filter(it => it.id !== itemId);
          saveStoredMenuItems(updated);
          renderPublicMenu();
          renderStudioMenu();
          showToast(`Removed "${targetItem.name}" from menu.`);
        }
      }
    });
  }

  // --- TAB 2: ATMOSPHERE PHOTOS INTERACTIONS ---
  let selectedPhotoBase64 = null;
  const photoFileDropzone = document.getElementById('photoFileDropzone');
  const newPhotoFile = document.getElementById('newPhotoFile');
  const photoFilePrompt = document.getElementById('photoFilePrompt');

  if (newPhotoFile) {
    newPhotoFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file (JPG, PNG, WebP).');
          return;
        }
        if (photoFilePrompt) photoFilePrompt.textContent = `Selected: ${file.name}`;
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          selectedPhotoBase64 = loadEvent.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const photoSourceRadios = document.querySelectorAll('input[name="photoSourceType"]');
  const photoFileInputGroup = document.getElementById('photoFileInputGroup');
  const photoUrlInputGroup = document.getElementById('photoUrlInputGroup');

  photoSourceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'file') {
        if (photoFileInputGroup) photoFileInputGroup.style.display = 'block';
        if (photoUrlInputGroup) photoUrlInputGroup.style.display = 'none';
      } else {
        if (photoFileInputGroup) photoFileInputGroup.style.display = 'none';
        if (photoUrlInputGroup) photoUrlInputGroup.style.display = 'block';
      }
    });
  });

  const studioAddPhotoForm = document.getElementById('studioAddPhotoForm');
  if (studioAddPhotoForm) {
    studioAddPhotoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('newPhotoTitle');
      const urlInput = document.getElementById('newPhotoUrl');
      const title = titleInput ? titleInput.value.trim() : '';
      const sourceType = document.querySelector('input[name="photoSourceType"]:checked')?.value || 'file';

      let finalUrl = '';
      if (sourceType === 'file') {
        if (!selectedPhotoBase64) {
          showToast('Please choose an image file from your device.');
          return;
        }
        finalUrl = selectedPhotoBase64;
      } else {
        finalUrl = urlInput ? urlInput.value.trim() : '';
        if (!finalUrl) {
          showToast('Please enter an image URL.');
          return;
        }
      }

      const photos = getStoredGalleryPhotos();
      photos.push({
        id: 'photo_' + Date.now(),
        title: title || 'Atmosphere Space',
        url: finalUrl
      });
      saveStoredGalleryPhotos(photos);
      renderPublicGallery();
      renderStudioPhotos();

      studioAddPhotoForm.reset();
      selectedPhotoBase64 = null;
      if (photoFilePrompt) photoFilePrompt.textContent = 'Choose or drag an image here';
      showToast(`Added "${title}" to atmosphere gallery!`);
    });
  }

  const studioPhotosGrid = document.getElementById('studioPhotosGrid');
  if (studioPhotosGrid) {
    studioPhotosGrid.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-action="delete-photo"]');
      if (!delBtn) return;
      const photoId = delBtn.getAttribute('data-photo-id');
      const photos = getStoredGalleryPhotos();
      const targetPhoto = photos.find(p => p.id === photoId);

      if (targetPhoto && confirm(`Remove "${targetPhoto.title}" from the atmosphere gallery?`)) {
        const updated = photos.filter(p => p.id !== photoId);
        saveStoredGalleryPhotos(updated);
        renderPublicGallery();
        renderStudioPhotos();
        showToast(`Removed "${targetPhoto.title}" from gallery.`);
      }
    });
  }

  // --- TAB 3: RESERVATIONS DESK INTERACTIONS ---
  const studioResSearch = document.getElementById('studioResSearch');
  if (studioResSearch) {
    studioResSearch.addEventListener('input', (e) => {
      currentResSearch = e.target.value;
      renderStudioReservations();
    });
  }

  const resFilterButtons = document.querySelectorAll('.res-filter-btn');
  resFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      resFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentResFilter = btn.getAttribute('data-res-filter');
      renderStudioReservations();
    });
  });

  const toggleWalkInBtn = document.getElementById('toggleWalkInBtn');
  const studioWalkInCard = document.getElementById('studioWalkInCard');
  const closeWalkInBtn = document.getElementById('closeWalkInBtn');
  const studioWalkInForm = document.getElementById('studioWalkInForm');
  const walkInDate = document.getElementById('walkInDate');

  if (toggleWalkInBtn && studioWalkInCard) {
    toggleWalkInBtn.addEventListener('click', () => {
      const isHidden = studioWalkInCard.style.display === 'none' || !studioWalkInCard.style.display;
      studioWalkInCard.style.display = isHidden ? 'block' : 'none';
      if (isHidden && walkInDate) {
        walkInDate.value = formatDateToISO(new Date());
      }
    });
  }

  if (closeWalkInBtn && studioWalkInCard) {
    closeWalkInBtn.addEventListener('click', () => {
      studioWalkInCard.style.display = 'none';
    });
  }

  if (studioWalkInForm) {
    studioWalkInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('walkInName')?.value.trim();
      const phone = document.getElementById('walkInPhone')?.value.trim();
      const dateVal = document.getElementById('walkInDate')?.value;
      const time = document.getElementById('walkInTime')?.value;
      const guests = document.getElementById('walkInGuests')?.value;
      const wants = document.getElementById('walkInWants')?.value.trim();

      const bookingRef = 'WALK-' + Math.floor(1000 + Math.random() * 9000);
      const newBooking = {
        id: 'res_' + Date.now(),
        bookingRef: bookingRef,
        name: name,
        phone: phone,
        date: dateVal,
        formattedDate: dateVal ? new Date(dateVal + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
        time: time,
        guests: guests,
        specialWants: wants || 'Walk-in guest',
        status: 'Seated',
        createdAt: Date.now()
      };

      addNewReservation(newBooking);
      studioWalkInForm.reset();
      if (studioWalkInCard) studioWalkInCard.style.display = 'none';
      showToast(`Walk-in confirmed & seated: ${name} (#${bookingRef})`);
    });
  }

  const studioReservationsList = document.getElementById('studioReservationsList');
  if (studioReservationsList) {
    // Change status via dropdown select
    studioReservationsList.addEventListener('change', (e) => {
      if (e.target.classList.contains('res-status-select')) {
        const select = e.target;
        const resId = select.getAttribute('data-res-id');
        const newStatus = select.value;
        const list = getStoredReservations();
        const booking = list.find(b => b.id === resId);

        if (booking) {
          booking.status = newStatus;
          saveStoredReservations(list);
          select.setAttribute('data-status', newStatus);
          const row = select.closest('.res-card-row');
          if (row) {
            row.className = `res-card-row status-${newStatus.toLowerCase()}`;
          }
          renderStudioReservations();
          showToast(`Booking #${booking.bookingRef} updated to ${newStatus}.`);
        }
      }
    });

    // Delete reservation
    studioReservationsList.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-action="delete-res"]');
      if (!delBtn) return;
      const resId = delBtn.getAttribute('data-res-id');
      const list = getStoredReservations();
      const booking = list.find(b => b.id === resId);

      if (booking && confirm(`Delete booking #${booking.bookingRef} (${booking.name})?`)) {
        const updated = list.filter(b => b.id !== resId);
        saveStoredReservations(updated);
        renderStudioReservations();
        showToast(`Deleted reservation #${booking.bookingRef}.`);
      }
    });
  }

  // Copy Sheet to Clipboard
  const copyTodaySummaryBtn = document.getElementById('copyTodaySummaryBtn');
  if (copyTodaySummaryBtn) {
    copyTodaySummaryBtn.addEventListener('click', () => {
      const all = getStoredReservations();
      if (all.length === 0) {
        showToast('No reservations to copy.');
        return;
      }
      let summaryText = `AMARA BENGALURU — RESERVATION SHEET\nGenerated: ${new Date().toLocaleString()}\n` +
        `Total Bookings: ${all.length} | Confirmed: ${all.filter(b => b.status === 'Confirmed').length} | Seated: ${all.filter(b => b.status === 'Seated').length}\n` +
        '----------------------------------------------------\n';

      all.forEach((b, idx) => {
        summaryText += `${idx + 1}. #${b.bookingRef} | ${b.time} (${b.formattedDate || b.date}) | ${b.guests} Guests | ${b.name} (${b.phone}) | Status: ${b.status}${b.specialWants ? ' | Note: ' + b.specialWants : ''}\n`;
      });

      if (navigator.clipboard) {
        navigator.clipboard.writeText(summaryText).then(() => {
          showToast('Reservation sheet copied to clipboard!');
        }).catch(() => {
          showToast('Reservation sheet formatted!');
        });
      } else {
        showToast('Reservation sheet generated!');
      }
    });
  }

  // Reset to Defaults Button
  if (studioResetDefaultsBtn) {
    studioResetDefaultsBtn.addEventListener('click', () => {
      const confirmReset = confirm('Reset all menu items, atmosphere photos, and reservations to original AMARA café defaults?');
      if (confirmReset) {
        localStorage.removeItem('amara_menu_items');
        localStorage.removeItem('amara_gallery_photos');
        localStorage.removeItem('amara_reservations');
        renderPublicMenu();
        renderPublicGallery();
        renderStudioMenu();
        renderStudioPhotos();
        renderStudioReservations();
        showToast('Restored original AMARA café defaults.');
      }
    });
  }

});