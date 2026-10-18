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
     10. PUBLIC DATA SYNC (MENU & SPACES RENDERERS)
     ========================================================== */
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

  function getStoredMenuItems() {
    try {
      const data = localStorage.getItem('amara_menu_items');
      return data ? JSON.parse(data) : [...DEFAULT_MENU_ITEMS];
    } catch (e) {
      return [...DEFAULT_MENU_ITEMS];
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

  function getStoredReservations() {
    try {
      const data = localStorage.getItem('amara_reservations');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
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

  // Initial render
  renderPublicMenu();
  renderPublicGallery();

  // Instant cross-tab sync when owner modifies items in external owner portal
  window.addEventListener('storage', (e) => {
    if (e.key === 'amara_menu_items') {
      renderPublicMenu();
    } else if (e.key === 'amara_gallery_photos') {
      renderPublicGallery();
    }
  });

});