/**
 * AMARA BOTANICAL ROASTERY & CAFÉ — BENGALURU
 * Lightweight client logic for navigation, reservation desk, and modal.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. PRELOADER
     ========================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');

  let pVal = 0;
  const pInterval = setInterval(() => {
    pVal += 12;
    if (preloaderProgress) preloaderProgress.style.width = `${Math.min(pVal, 100)}%`;
    if (pVal >= 100) {
      clearInterval(pInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
      }, 180);
    }
  }, 20);

  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 900);


  /* ==========================================================
     2. HEADER SCROLL & PROGRESS BAR
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
     3. MOBILE DRAWER NAVIGATION
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
     4. TABLE RESERVATIONS (WITH SPECIAL WANTS)
     ========================================================== */
  const simpleReserveForm = document.getElementById('simpleReserveForm');
  const resDateInput = document.getElementById('resDate');
  const confirmationModal = document.getElementById('confirmationModal');
  const confirmModalClose = document.getElementById('confirmModalClose');
  const dismissTicketBtn = document.getElementById('dismissTicketBtn');
  const ticketDetailsBox = document.getElementById('ticketDetailsBox');

  // Set default reservation date to tomorrow
  if (resDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    resDateInput.value = tomorrow.toISOString().split('T')[0];
    resDateInput.min = new Date().toISOString().split('T')[0];
  }

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
            <span>Guests:</span>
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
    });
  }

  function closeModal() {
    confirmationModal.classList.remove('open');
    document.body.classList.remove('lock-scroll');
  }

  if (confirmModalClose) confirmModalClose.addEventListener('click', closeModal);
  if (dismissTicketBtn) dismissTicketBtn.addEventListener('click', closeModal);


  /* ==========================================================
     5. TOAST NOTIFICATION UTILITY
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
     6. SCROLL ACTIVE LINK OBSERVER & REVEALS
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