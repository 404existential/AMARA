/**
 * AMARA BOTANICAL ROASTERY & CAFÉ — BENGALURU
 * Interactive Scroll-Pour Engine, Chic Menu Board, and Concierge Reservations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. PRELOADER
     ========================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');

  let pVal = 0;
  const pInterval = setInterval(() => {
    pVal += 10;
    if (preloaderProgress) preloaderProgress.style.width = `${Math.min(pVal, 100)}%`;
    if (pVal >= 100) {
      clearInterval(pInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
      }, 200);
    }
  }, 20);

  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 1000);


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
  });


  /* ==========================================================
     3. INTERACTIVE SCROLL-POUR COFFEE ANIMATION
     ========================================================== */
  const pourStream = document.getElementById('pourStream');
  const cupLiquid = document.getElementById('cupLiquid');
  const cremaFoam = document.getElementById('cremaFoam');
  const pourStatusText = document.getElementById('pourStatusText');
  const pourInteractiveBox = document.getElementById('pourInteractiveBox');

  function updatePourAnimation() {
    const scrollY = window.scrollY;
    // Animate across the first 320px of scroll
    const maxScroll = 280;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    if (pourStream && cupLiquid) {
      if (progress > 0.05) {
        // Stream extends down
        pourStream.style.height = `${Math.min(progress * 130, 100)}%`;
        pourStream.style.opacity = '1';

        // Liquid inside cup rises smoothly from 8% to 88%
        const fillHeight = 8 + (progress * 80);
        cupLiquid.style.height = `${fillHeight}%`;

        if (cremaFoam) {
          cremaFoam.style.opacity = `${0.3 + (progress * 0.7)}`;
        }

        if (pourStatusText) {
          if (progress < 0.85) {
            pourStatusText.textContent = 'Pouring single-origin roast...';
          } else {
            pourStatusText.textContent = 'Freshly poured · Welcome to AMARA';
          }
        }
      } else {
        // Rest state
        pourStream.style.height = '0%';
        cupLiquid.style.height = '8%';
        if (cremaFoam) cremaFoam.style.opacity = '0.3';
        if (pourStatusText) pourStatusText.textContent = 'Scroll down to pour';
      }
    }
  }

  window.addEventListener('scroll', updatePourAnimation, { passive: true });

  // Interactive Click-to-Pour bonus
  if (pourInteractiveBox) {
    let autoPouring = false;
    pourInteractiveBox.addEventListener('click', () => {
      if (autoPouring) return;
      autoPouring = true;
      let step = 0;
      const autoTimer = setInterval(() => {
        step += 0.05;
        if (pourStream && cupLiquid) {
          pourStream.style.height = '100%';
          cupLiquid.style.height = `${8 + (step * 80)}%`;
          if (pourStatusText) pourStatusText.textContent = 'Pouring single-origin roast...';
        }
        if (step >= 1) {
          clearInterval(autoTimer);
          if (pourStatusText) pourStatusText.textContent = 'Freshly poured · Welcome to AMARA';
          setTimeout(() => {
            updatePourAnimation();
            autoPouring = false;
          }, 1400);
        }
      }, 25);
    });
  }


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
     5. CHIC PHYSICAL CAFÉ BOARD MENU DATA
     ========================================================== */
  const menuBoardItems = [
    {
      category: 'coffee',
      name: 'AMARA Flat White',
      badge: 'House Espresso',
      desc: 'Double shot Chikmagalur Arabica with textured velvety whole milk.',
      price: '₹260'
    },
    {
      category: 'coffee',
      name: 'Cardamom & Jaggery Cortado',
      badge: 'Indiranagar Special',
      desc: 'Equal parts estate espresso and warm milk with organic Coorg jaggery.',
      price: '₹280'
    },
    {
      category: 'coffee',
      name: 'Estate Classic Cappuccino',
      badge: '',
      desc: 'Rich extraction with dark cocoa, hazelnut aromatics, and dense microfoam.',
      price: '₹250'
    },
    {
      category: 'pourover',
      name: 'Balur Estate V60 Pour-Over',
      badge: 'Single Origin',
      desc: 'Washed Arabica with delicate clarity, sweet lime, and honey nectar notes.',
      price: '₹320'
    },
    {
      category: 'pourover',
      name: 'Honey-Sun Dried Aeropress',
      badge: 'Rare Lot',
      desc: 'Naturally processed high-altitude lot with notes of blackcurrant and cacao.',
      price: '₹340'
    },
    {
      category: 'pourover',
      name: '24-Hour Cold Drip Kaapi',
      badge: 'Slow Drip',
      desc: 'Slow drop-by-drop extraction over 24 hours. Served over hand-cut ice.',
      price: '₹330'
    },
    {
      category: 'bakehouse',
      name: 'French Butter Croissant',
      badge: 'Fresh Daily',
      desc: 'Crisp golden layers baked fresh every morning with Normandy butter.',
      price: '₹240'
    },
    {
      category: 'bakehouse',
      name: 'Twice-Baked Pistachio Almond Croissant',
      badge: '',
      desc: 'Stuffed with roasted nut frangipane and dusted with powdered sugar.',
      price: '₹320'
    },
    {
      category: 'bakehouse',
      name: 'Dark Chocolate Sea Salt Babka',
      badge: '',
      desc: 'Braided brioche ribbons infused with 70% dark chocolate and sea salt.',
      price: '₹280'
    },
    {
      category: 'bakehouse',
      name: 'Truffle Poached Egg Brioche',
      badge: 'Hearth Brunch',
      desc: 'Avocado mash, pasture poached egg, and black truffle oil on toasted brioche.',
      price: '₹440'
    },
    {
      category: 'cold',
      name: 'Espresso Tonic with Sweet Orange',
      badge: 'Chilled',
      desc: 'Chilled estate espresso floated over craft tonic and dehydrated citrus.',
      price: '₹320'
    },
    {
      category: 'cold',
      name: 'Ceremonial Uji Iced Matcha Latte',
      badge: 'First Harvest',
      desc: 'Whisked Japanese green tea with cold oat milk and light agave nectar.',
      price: '₹360'
    },
    {
      category: 'cold',
      name: 'Bengaluru Cascara Sparkling Spritz',
      badge: 'Botanical',
      desc: 'Sun-dried coffee cherry husk infusion with sparkling soda and rosemary.',
      price: '₹290'
    }
  ];

  const menuBoardWrapper = document.getElementById('menuBoardWrapper');
  const menuFilterBtns = document.querySelectorAll('.menu-pill-btn');
  let currentFilter = 'all';

  function renderMenuBoard() {
    if (!menuBoardWrapper) return;

    const filtered = menuBoardItems.filter(item => {
      if (currentFilter === 'all') return true;
      return item.category === currentFilter;
    });

    menuBoardWrapper.innerHTML = filtered.map(item => `
      <div class="menu-board-card">
        <div class="menu-card-main">
          <div class="menu-card-title-row">
            <h3 class="menu-item-heading">${item.name}</h3>
            ${item.badge ? `<span class="menu-chip-badge">${item.badge}</span>` : ''}
          </div>
          <p class="menu-card-desc">${item.desc}</p>
        </div>
        <div class="menu-card-price">${item.price}</div>
      </div>
    `).join('');
  }

  renderMenuBoard();

  menuFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderMenuBoard();
    });
  });


  /* ==========================================================
     6. CONCIERGE TABLE RESERVATION FORM
     ========================================================== */
  const conciergeForm = document.getElementById('conciergeForm');
  const bookDateInput = document.getElementById('bookDate');
  const confirmationModal = document.getElementById('confirmationModal');
  const confirmModalClose = document.getElementById('confirmModalClose');
  const dismissTicketBtn = document.getElementById('dismissTicketBtn');
  const ticketDetailsBox = document.getElementById('ticketDetailsBox');

  // Set default reservation date to tomorrow
  if (bookDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookDateInput.value = tomorrow.toISOString().split('T')[0];
    bookDateInput.min = new Date().toISOString().split('T')[0];
  }

  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestElem = document.querySelector('input[name="guestCount"]:checked');
      const guests = guestElem ? guestElem.value : '2';
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      const area = document.getElementById('bookArea').value;
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();

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
            <span>Booking Slip:</span>
            <strong>#${bookingRef}</strong>
          </div>
          <div class="ticket-item">
            <span>Guest Name:</span>
            <strong>${name}</strong>
          </div>
          <div class="ticket-item">
            <span>WhatsApp / Phone:</span>
            <strong>${phone}</strong>
          </div>
          <div class="ticket-item">
            <span>Date & Time:</span>
            <strong>${formattedDate} at ${time}</strong>
          </div>
          <div class="ticket-item">
            <span>Seating & Size:</span>
            <strong>${guests} ${guests === '1' ? 'Guest' : 'Guests'} · ${area}</strong>
          </div>
        `;
      }

      confirmationModal.classList.add('open');
      document.body.classList.add('lock-scroll');
      showToast(`Table confirmed for ${name}! Ref: #${bookingRef}`);
      conciergeForm.reset();
    });
  }

  function closeModal() {
    confirmationModal.classList.remove('open');
    document.body.classList.remove('lock-scroll');
  }

  if (confirmModalClose) confirmModalClose.addEventListener('click', closeModal);
  if (dismissTicketBtn) dismissTicketBtn.addEventListener('click', closeModal);


  /* ==========================================================
     7. TOAST NOTIFICATION UTILITY
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
     8. SCROLL ACTIVE LINK OBSERVER & REVEALS
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