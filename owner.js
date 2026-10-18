/**
 * AMARA — Owner Command Portal Logic
 * Secure standalone manager for Menu, Atmosphere Photos, and Reservations.
 * Protected with SHA-256 cryptographic hashing & brute-force rate-limiting lockout.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. CRYPTOGRAPHIC UTILITIES & RATE-LIMITING
     ========================================================== */
  // Default master passphrase: "Balur1450@Amara"
  const DEFAULT_MASTER_HASH = '1740107afe97b6d53014b19543d6839b3cce8137b8854aaa49d38f84571db96d';
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

  async function computeSha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getStoredMasterHash() {
    return localStorage.getItem('amara_master_pass_hash') || DEFAULT_MASTER_HASH;
  }

  function saveStoredMasterHash(hash) {
    localStorage.setItem('amara_master_pass_hash', hash);
  }

  function getFailedAttempts() {
    return parseInt(sessionStorage.getItem('amara_failed_attempts') || '0', 10);
  }

  function setFailedAttempts(n) {
    sessionStorage.setItem('amara_failed_attempts', String(n));
  }

  function getLockoutUntil() {
    return parseInt(localStorage.getItem('amara_lockout_until') || '0', 10);
  }

  function setLockoutUntil(timestamp) {
    localStorage.setItem('amara_lockout_until', String(timestamp));
  }

  // Gateway DOM Elements
  const gatewayScreen = document.getElementById('gatewayScreen');
  const portalLayout = document.getElementById('portalLayout');
  const gatewayForm = document.getElementById('gatewayForm');
  const masterPassInput = document.getElementById('masterPassInput');
  const gatewayPassToggle = document.getElementById('gatewayPassToggle');
  const gatewayErrorMsg = document.getElementById('gatewayErrorMsg');
  const gatewayAttemptsLine = document.getElementById('gatewayAttemptsLine');
  const attemptsCountText = document.getElementById('attemptsCountText');
  const lockoutBanner = document.getElementById('lockoutBanner');
  const lockoutTimerMsg = document.getElementById('lockoutTimerMsg');
  const gatewayUnlockBtn = document.getElementById('gatewayUnlockBtn');
  const portalSignOutBtn = document.getElementById('portalSignOutBtn');

  let lockoutInterval = null;

  function checkLockoutState() {
    const lockoutUntil = getLockoutUntil();
    const now = Date.now();

    if (lockoutUntil > now) {
      if (lockoutBanner) lockoutBanner.style.display = 'flex';
      if (gatewayForm) {
        masterPassInput.disabled = true;
        gatewayUnlockBtn.disabled = true;
      }
      if (gatewayAttemptsLine) gatewayAttemptsLine.style.display = 'none';

      clearInterval(lockoutInterval);
      lockoutInterval = setInterval(() => {
        const remaining = getLockoutUntil() - Date.now();
        if (remaining <= 0) {
          clearInterval(lockoutInterval);
          localStorage.removeItem('amara_lockout_until');
          setFailedAttempts(0);
          if (lockoutBanner) lockoutBanner.style.display = 'none';
          masterPassInput.disabled = false;
          gatewayUnlockBtn.disabled = false;
          if (gatewayAttemptsLine) gatewayAttemptsLine.style.display = 'flex';
          if (attemptsCountText) attemptsCountText.textContent = String(MAX_ATTEMPTS);
        } else {
          const mins = Math.floor(remaining / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          if (lockoutTimerMsg) {
            lockoutTimerMsg.textContent = `Too many incorrect attempts. Retry in ${mins}:${secs < 10 ? '0' : ''}${secs}.`;
          }
        }
      }, 1000);
      return true;
    } else {
      if (lockoutBanner) lockoutBanner.style.display = 'none';
      if (masterPassInput) masterPassInput.disabled = false;
      if (gatewayUnlockBtn) gatewayUnlockBtn.disabled = false;
      return false;
    }
  }

  function updateAttemptsDisplay() {
    const failed = getFailedAttempts();
    const remaining = Math.max(0, MAX_ATTEMPTS - failed);
    if (attemptsCountText) attemptsCountText.textContent = String(remaining);
  }

  // Passphrase visibility toggle
  if (gatewayPassToggle && masterPassInput) {
    gatewayPassToggle.addEventListener('click', () => {
      const isPass = masterPassInput.type === 'password';
      masterPassInput.type = isPass ? 'text' : 'password';
      gatewayPassToggle.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // Check existing session
  const isSessionValid = sessionStorage.getItem('amara_portal_authenticated') === 'valid';
  if (isSessionValid) {
    unlockPortal();
  } else {
    checkLockoutState();
    updateAttemptsDisplay();
  }

  // Gateway form submission with SHA-256 check
  if (gatewayForm) {
    gatewayForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (checkLockoutState()) return;

      const enteredPass = masterPassInput.value.trim();
      if (!enteredPass) return;

      const enteredHash = await computeSha256(enteredPass);
      const expectedHash = getStoredMasterHash();

      if (enteredHash === expectedHash) {
        // Success
        setFailedAttempts(0);
        sessionStorage.setItem('amara_portal_authenticated', 'valid');
        unlockPortal();
        showPortalToast('Welcome to AMARA Command Desk.');
      } else {
        // Failed attempt
        const failed = getFailedAttempts() + 1;
        setFailedAttempts(failed);
        updateAttemptsDisplay();

        if (failed >= MAX_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS);
          checkLockoutState();
        } else {
          if (gatewayErrorMsg) {
            gatewayErrorMsg.textContent = `Invalid master passphrase. ${MAX_ATTEMPTS - failed} attempt(s) left before lockout.`;
            gatewayErrorMsg.style.display = 'block';
          }
          masterPassInput.select();
        }
      }
    });
  }

  function unlockPortal() {
    if (gatewayScreen) gatewayScreen.style.display = 'none';
    if (portalLayout) portalLayout.style.display = 'flex';
    initPortalDashboard();
  }

  function lockPortal() {
    sessionStorage.removeItem('amara_portal_authenticated');
    if (portalLayout) portalLayout.style.display = 'none';
    if (gatewayScreen) gatewayScreen.style.display = 'flex';
    if (masterPassInput) {
      masterPassInput.value = '';
      masterPassInput.focus();
    }
    if (gatewayErrorMsg) gatewayErrorMsg.style.display = 'none';
  }

  if (portalSignOutBtn) portalSignOutBtn.addEventListener('click', lockPortal);


  /* ==========================================================
     2. LIVE CLOCK DISPLAY
     ========================================================== */
  const clockTimeText = document.getElementById('clockTimeText');
  function updateLiveClock() {
    if (!clockTimeText) return;
    const now = new Date();
    clockTimeText.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }) + ' · ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();


  /* ==========================================================
     3. TAB NAVIGATION
     ========================================================== */
  const tabButtons = document.querySelectorAll('.nav-tab-item');
  const panels = document.querySelectorAll('.portal-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (target === 'menu') {
        document.getElementById('panelMenu')?.classList.add('active');
        renderMenuModule();
      } else if (target === 'photos') {
        document.getElementById('panelPhotos')?.classList.add('active');
        renderPhotosModule();
      } else if (target === 'reservations') {
        document.getElementById('panelReservations')?.classList.add('active');
        renderReservationsModule();
      } else if (target === 'settings') {
        document.getElementById('panelSettings')?.classList.add('active');
      }
    });
  });


  /* ==========================================================
     4. DATA STORE ACCESSORS & DEFAULTS
     ========================================================== */
  const DEFAULT_MENU_ITEMS = [
    { id: 'm1', name: 'Flat White', price: 260, category: 'coffee', inStock: true },
    { id: 'm2', name: 'Cardamom Cortado', price: 280, category: 'coffee', inStock: true },
    { id: 'm3', name: 'Cappuccino', price: 250, category: 'coffee', inStock: true },
    { id: 'm4', name: 'Balur Estate V60', price: 320, category: 'coffee', inStock: true },
    { id: 'm5', name: '24h Cold Drip', price: 330, category: 'coffee', inStock: true },
    { id: 'm6', name: 'Butter Croissant', price: 240, category: 'bakes', inStock: true },
    { id: 'm7', name: 'Almond Frangipane', price: 320, category: 'bakes', inStock: true },
    { id: 'm8', name: 'Chocolate Babka', price: 280, category: 'bakes', inStock: true },
    { id: 'm9', name: 'Truffle Egg Brioche', price: 440, category: 'bakes', inStock: true },
    { id: 'm10', name: 'Ricotta & Fig Toast', price: 390, category: 'bakes', inStock: true },
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
      specialWants: 'Quiet spot for morning discussion',
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

  function getMenuItems() {
    try {
      const data = localStorage.getItem('amara_menu_items');
      return data ? JSON.parse(data) : [...DEFAULT_MENU_ITEMS];
    } catch (e) {
      return [...DEFAULT_MENU_ITEMS];
    }
  }

  function setMenuItems(items) {
    localStorage.setItem('amara_menu_items', JSON.stringify(items));
  }

  function getGalleryPhotos() {
    try {
      const data = localStorage.getItem('amara_gallery_photos');
      return data ? JSON.parse(data) : [...DEFAULT_GALLERY_PHOTOS];
    } catch (e) {
      return [...DEFAULT_GALLERY_PHOTOS];
    }
  }

  function setGalleryPhotos(photos) {
    localStorage.setItem('amara_gallery_photos', JSON.stringify(photos));
  }

  function getReservations() {
    try {
      const data = localStorage.getItem('amara_reservations');
      return data ? JSON.parse(data) : [...DEFAULT_RESERVATIONS];
    } catch (e) {
      return [...DEFAULT_RESERVATIONS];
    }
  }

  function setReservations(res) {
    localStorage.setItem('amara_reservations', JSON.stringify(res));
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


  /* ==========================================================
     5. MODULE: MENU & BAR MANAGER
     ========================================================== */
  const menuTableBody = document.getElementById('menuTableBody');
  const tabBadgeMenu = document.getElementById('tabBadgeMenu');
  const menuCategoryFilter = document.getElementById('menuCategoryFilter');
  const addMenuForm = document.getElementById('addMenuForm');

  function renderMenuModule() {
    const items = getMenuItems();
    if (tabBadgeMenu) tabBadgeMenu.textContent = items.length;
    if (!menuTableBody) return;

    const filterVal = menuCategoryFilter ? menuCategoryFilter.value : 'all';
    const filtered = filterVal === 'all' ? items : items.filter(it => it.category === filterVal);

    if (filtered.length === 0) {
      menuTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <i class="fa-solid fa-mug-saucer"></i>
            <p>No menu items found for this category.</p>
          </td>
        </tr>
      `;
      return;
    }

    menuTableBody.innerHTML = filtered.map(it => {
      const catClass = `cat-${it.category}`;
      const catLabel = it.category === 'coffee' ? 'Coffee' : it.category === 'bakes' ? 'Bakes' : 'Cold';

      return `
        <tr data-item-id="${it.id}">
          <td><span class="cat-pill ${catClass}">${catLabel}</span></td>
          <td><strong>${escapeHTML(it.name)}</strong></td>
          <td>₹${it.price}</td>
          <td>
            <button type="button" class="status-toggle-btn ${it.inStock ? 'in-stock' : 'sold-out'}" data-action="toggle-stock" data-item-id="${it.id}">
              ${it.inStock ? '<i class="fa-solid fa-check"></i> In Stock' : '<i class="fa-solid fa-ban"></i> Sold Out'}
            </button>
          </td>
          <td class="text-right">
            <button type="button" class="btn-action-icon" data-action="edit-price" data-item-id="${it.id}" title="Edit Price">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action-icon danger" data-action="delete-item" data-item-id="${it.id}" title="Delete Item">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (menuCategoryFilter) {
    menuCategoryFilter.addEventListener('change', renderMenuModule);
  }

  if (addMenuForm) {
    addMenuForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('menuItemName')?.value.trim();
      const price = parseInt(document.getElementById('menuItemPrice')?.value, 10);
      const category = document.getElementById('menuItemCat')?.value || 'coffee';
      const inStock = document.getElementById('menuItemStock')?.checked ?? true;

      if (!name || isNaN(price) || price <= 0) {
        showPortalToast('Please enter a valid item name and price.');
        return;
      }

      const items = getMenuItems();
      items.push({
        id: 'm_' + Date.now(),
        name,
        price,
        category,
        inStock
      });
      setMenuItems(items);
      renderMenuModule();
      addMenuForm.reset();
      showPortalToast(`Added "${name}" (₹${price}) to the live menu.`);
    });
  }

  if (menuTableBody) {
    menuTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-item-id');
      const items = getMenuItems();
      const item = items.find(it => it.id === id);
      if (!item) return;

      if (action === 'toggle-stock') {
        item.inStock = !item.inStock;
        setMenuItems(items);
        renderMenuModule();
        showPortalToast(`"${item.name}" is now marked as ${item.inStock ? 'In Stock' : 'Sold Out'}.`);
      } else if (action === 'edit-price') {
        const input = prompt(`Update price for "${item.name}" (in ₹):`, item.price);
        if (input !== null) {
          const newPrice = parseInt(input.trim(), 10);
          if (!isNaN(newPrice) && newPrice > 0) {
            item.price = newPrice;
            setMenuItems(items);
            renderMenuModule();
            showPortalToast(`Price for "${item.name}" updated to ₹${newPrice}.`);
          } else {
            showPortalToast('Invalid price entered.');
          }
        }
      } else if (action === 'delete-item') {
        if (confirm(`Remove "${item.name}" from the live AMARA menu?`)) {
          const updated = items.filter(it => it.id !== id);
          setMenuItems(updated);
          renderMenuModule();
          showPortalToast(`Removed "${item.name}" from menu.`);
        }
      }
    });
  }


  /* ==========================================================
     6. MODULE: ATMOSPHERE SPACES
     ========================================================== */
  const spacesGalleryGrid = document.getElementById('spacesGalleryGrid');
  const photoCountBadge = document.getElementById('photoCountBadge');
  const tabBadgePhotos = document.getElementById('tabBadgePhotos');
  const addPhotoForm = document.getElementById('addPhotoForm');
  const photoFileInput = document.getElementById('photoFileInput');
  const photoDropzonePrompt = document.getElementById('photoDropzonePrompt');
  const photoSourceRadios = document.querySelectorAll('input[name="photoSourceRadio"]');
  const photoLocalGroup = document.getElementById('photoLocalGroup');
  const photoUrlGroup = document.getElementById('photoUrlGroup');

  let localPhotoBase64 = null;

  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showPortalToast('Please select an image file (JPG, PNG, WebP).');
          return;
        }
        if (photoDropzonePrompt) photoDropzonePrompt.textContent = `Selected: ${file.name}`;
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          localPhotoBase64 = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  photoSourceRadios.forEach(r => {
    r.addEventListener('change', () => {
      if (r.value === 'file') {
        if (photoLocalGroup) photoLocalGroup.style.display = 'block';
        if (photoUrlGroup) photoUrlGroup.style.display = 'none';
      } else {
        if (photoLocalGroup) photoLocalGroup.style.display = 'none';
        if (photoUrlGroup) photoUrlGroup.style.display = 'block';
      }
    });
  });

  function renderPhotosModule() {
    const photos = getGalleryPhotos();
    if (tabBadgePhotos) tabBadgePhotos.textContent = photos.length;
    if (photoCountBadge) photoCountBadge.textContent = `${photos.length} Spaces`;
    if (!spacesGalleryGrid) return;

    if (photos.length === 0) {
      spacesGalleryGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fa-regular fa-images"></i>
          <p>No atmosphere photos added yet.</p>
        </div>
      `;
      return;
    }

    spacesGalleryGrid.innerHTML = photos.map(p => `
      <div class="space-card" data-photo-id="${p.id}">
        <img src="${escapeHTML(p.url)}" alt="${escapeHTML(p.title)}" class="space-card-img" onerror="this.src='assets/images/cafe-interior.jpg'">
        <div class="space-card-meta">
          <span class="space-card-title" title="${escapeHTML(p.title)}">${escapeHTML(p.title)}</span>
          <button type="button" class="btn-action-icon danger" data-action="delete-photo" data-photo-id="${p.id}" title="Remove Photo">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('photoSpaceTitle')?.value.trim();
      const sourceType = document.querySelector('input[name="photoSourceRadio"]:checked')?.value || 'file';

      let finalUrl = '';
      if (sourceType === 'file') {
        if (!localPhotoBase64) {
          showPortalToast('Please select a photo file from your device.');
          return;
        }
        finalUrl = localPhotoBase64;
      } else {
        finalUrl = document.getElementById('photoUrlInput')?.value.trim();
        if (!finalUrl) {
          showPortalToast('Please provide an image URL.');
          return;
        }
      }

      const photos = getGalleryPhotos();
      photos.push({
        id: 'p_' + Date.now(),
        title: title || 'Atmosphere Space',
        url: finalUrl
      });
      setGalleryPhotos(photos);
      renderPhotosModule();

      addPhotoForm.reset();
      localPhotoBase64 = null;
      if (photoDropzonePrompt) photoDropzonePrompt.textContent = 'Click or drag & drop photo here';
      showPortalToast(`Added "${title}" to atmosphere gallery.`);
    });
  }

  if (spacesGalleryGrid) {
    spacesGalleryGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="delete-photo"]');
      if (!btn) return;
      const photoId = btn.getAttribute('data-photo-id');
      const photos = getGalleryPhotos();
      const photo = photos.find(p => p.id === photoId);
      if (photo && confirm(`Remove "${photo.title}" from the atmosphere gallery?`)) {
        const updated = photos.filter(p => p.id !== photoId);
        setGalleryPhotos(updated);
        renderPhotosModule();
        showPortalToast(`Removed "${photo.title}" from gallery.`);
      }
    });
  }


  /* ==========================================================
     7. MODULE: TABLE RESERVATIONS
     ========================================================== */
  const resTableBody = document.getElementById('resTableBody');
  const kpiTotal = document.getElementById('kpiTotal');
  const kpiConfirmed = document.getElementById('kpiConfirmed');
  const kpiSeated = document.getElementById('kpiSeated');
  const kpiCancelled = document.getElementById('kpiCancelled');
  const tabBadgeRes = document.getElementById('tabBadgeRes');
  const resSearchInput = document.getElementById('resSearchInput');
  const resFilterChips = document.querySelectorAll('.filter-chip');

  let currentResFilter = 'all';
  let currentResQuery = '';

  function renderReservationsModule() {
    const list = getReservations();
    const confirmedCount = list.filter(b => b.status === 'Confirmed').length;
    const seatedCount = list.filter(b => b.status === 'Seated').length;
    const cancelledCount = list.filter(b => b.status === 'Cancelled').length;

    if (kpiTotal) kpiTotal.textContent = list.length;
    if (kpiConfirmed) kpiConfirmed.textContent = confirmedCount;
    if (kpiSeated) kpiSeated.textContent = seatedCount;
    if (kpiCancelled) kpiCancelled.textContent = cancelledCount;
    if (tabBadgeRes) tabBadgeRes.textContent = list.length;

    if (!resTableBody) return;

    let filtered = list;
    if (currentResFilter !== 'all') {
      filtered = filtered.filter(b => b.status === currentResFilter);
    }
    if (currentResQuery.trim()) {
      const q = currentResQuery.trim().toLowerCase();
      filtered = filtered.filter(b =>
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.phone && b.phone.toLowerCase().includes(q)) ||
        (b.bookingRef && b.bookingRef.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      resTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <i class="fa-regular fa-calendar-xmark"></i>
            <p>No reservations found for this filter.</p>
          </td>
        </tr>
      `;
      return;
    }

    resTableBody.innerHTML = filtered.map(b => `
      <tr data-res-id="${b.id}">
        <td><span class="ref-code">#${escapeHTML(b.bookingRef || 'AMARA')}</span></td>
        <td>
          <strong>${escapeHTML(b.name)}</strong>
          <div style="font-size:0.78rem;color:var(--text-dim);">${escapeHTML(b.phone)}</div>
        </td>
        <td>
          <div>${escapeHTML(b.time)}</div>
          <div style="font-size:0.78rem;color:var(--text-dim);">${escapeHTML(b.formattedDate || b.date)}</div>
        </td>
        <td><strong>${escapeHTML(String(b.guests))} ${b.guests === '1' ? 'Guest' : 'Guests'}</strong></td>
        <td><small style="color:var(--text-muted);">${escapeHTML(b.specialWants || '—')}</small></td>
        <td>
          <select class="res-status-select" data-res-id="${b.id}" data-status="${b.status || 'Confirmed'}" aria-label="Change Status">
            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Seated" ${b.status === 'Seated' ? 'selected' : ''}>Seated</option>
            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td class="text-right">
          <button type="button" class="btn-action-icon danger" data-action="delete-res" data-res-id="${b.id}" title="Delete Booking">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  if (resSearchInput) {
    resSearchInput.addEventListener('input', (e) => {
      currentResQuery = e.target.value;
      renderReservationsModule();
    });
  }

  resFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      resFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentResFilter = chip.getAttribute('data-res-filter');
      renderReservationsModule();
    });
  });

  // Table action delegates (status change, delete)
  if (resTableBody) {
    resTableBody.addEventListener('change', (e) => {
      if (e.target.classList.contains('res-status-select')) {
        const select = e.target;
        const id = select.getAttribute('data-res-id');
        const newStatus = select.value;
        const list = getReservations();
        const booking = list.find(b => b.id === id);
        if (booking) {
          booking.status = newStatus;
          setReservations(list);
          select.setAttribute('data-status', newStatus);
          renderReservationsModule();
          showPortalToast(`Booking #${booking.bookingRef} set to ${newStatus}.`);
        }
      }
    });

    resTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="delete-res"]');
      if (!btn) return;
      const id = btn.getAttribute('data-res-id');
      const list = getReservations();
      const booking = list.find(b => b.id === id);
      if (booking && confirm(`Delete booking #${booking.bookingRef} for ${booking.name}?`)) {
        const updated = list.filter(b => b.id !== id);
        setReservations(updated);
        renderReservationsModule();
        showPortalToast(`Deleted booking #${booking.bookingRef}.`);
      }
    });
  }

  // Walk-in form handling
  const toggleWalkInFormBtn = document.getElementById('toggleWalkInFormBtn');
  const walkInCard = document.getElementById('walkInCard');
  const closeWalkInBtn = document.getElementById('closeWalkInBtn');
  const walkInForm = document.getElementById('walkInForm');
  const walkInDate = document.getElementById('walkInDate');

  if (toggleWalkInFormBtn && walkInCard) {
    toggleWalkInFormBtn.addEventListener('click', () => {
      const isClosed = walkInCard.style.display === 'none';
      walkInCard.style.display = isClosed ? 'block' : 'none';
      if (isClosed && walkInDate) {
        walkInDate.value = new Date().toISOString().split('T')[0];
      }
    });
  }

  if (closeWalkInBtn && walkInCard) {
    closeWalkInBtn.addEventListener('click', () => {
      walkInCard.style.display = 'none';
    });
  }

  if (walkInForm) {
    walkInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('walkInName')?.value.trim();
      const phone = document.getElementById('walkInPhone')?.value.trim();
      const dateVal = document.getElementById('walkInDate')?.value;
      const time = document.getElementById('walkInTime')?.value;
      const guests = document.getElementById('walkInGuests')?.value;
      const notes = document.getElementById('walkInNotes')?.value.trim();

      const bookingRef = 'WALK-' + Math.floor(1000 + Math.random() * 9000);
      const newBooking = {
        id: 'res_' + Date.now(),
        bookingRef,
        name,
        phone,
        date: dateVal,
        formattedDate: dateVal ? new Date(dateVal + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
        time,
        guests,
        specialWants: notes || 'Walk-in',
        status: 'Seated',
        createdAt: Date.now()
      };

      const list = getReservations();
      list.unshift(newBooking);
      setReservations(list);
      renderReservationsModule();
      walkInForm.reset();
      if (walkInCard) walkInCard.style.display = 'none';
      showPortalToast(`Walk-in confirmed and seated: ${name} (#${bookingRef})`);
    });
  }

  // Copy Sheet to Clipboard
  const copySheetBtn = document.getElementById('copySheetBtn');
  if (copySheetBtn) {
    copySheetBtn.addEventListener('click', () => {
      const list = getReservations();
      if (list.length === 0) {
        showPortalToast('No bookings to copy.');
        return;
      }
      let text = `AMARA — RESERVATION SHEET\nGenerated: ${new Date().toLocaleString()}\n` +
        `Total: ${list.length} | Confirmed: ${list.filter(b => b.status === 'Confirmed').length} | Seated: ${list.filter(b => b.status === 'Seated').length}\n` +
        '----------------------------------------------------\n';

      list.forEach((b, idx) => {
        text += `${idx + 1}. #${b.bookingRef} | ${b.time} (${b.formattedDate || b.date}) | ${b.guests} Guests | ${b.name} (${b.phone}) | Status: ${b.status}${b.specialWants ? ' | Note: ' + b.specialWants : ''}\n`;
      });

      navigator.clipboard.writeText(text).then(() => {
        showPortalToast('Reservation sheet copied to clipboard!');
      }).catch(() => {
        showPortalToast('Copied to clipboard.');
      });
    });
  }

  // Export CSV
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const list = getReservations();
      if (list.length === 0) {
        showPortalToast('No bookings to export.');
        return;
      }

      const headers = ['Booking Ref', 'Guest Name', 'Phone', 'Date', 'Time', 'Guests', 'Special Wants', 'Status'];
      const rows = list.map(b => [
        `"${b.bookingRef || ''}"`,
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${b.phone || ''}"`,
        `"${b.formattedDate || b.date || ''}"`,
        `"${b.time || ''}"`,
        `"${b.guests || ''}"`,
        `"${(b.specialWants || '').replace(/"/g, '""')}"`,
        `"${b.status || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `AMARA_Reservations_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showPortalToast('CSV exported successfully.');
    });
  }


  /* ==========================================================
     8. MODULE: SECURITY & SETTINGS
     ========================================================== */
  const changePassForm = document.getElementById('changePassForm');
  const currentPassInput = document.getElementById('currentPassInput');
  const newPassInput = document.getElementById('newPassInput');
  const confirmNewPassInput = document.getElementById('confirmNewPassInput');
  const exportBackupBtn = document.getElementById('exportBackupBtn');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  if (changePassForm) {
    changePassForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPass = currentPassInput.value.trim();
      const newPass = newPassInput.value.trim();
      const confirmPass = confirmNewPassInput.value.trim();

      const currentHash = await computeSha256(currentPass);
      const expectedHash = getStoredMasterHash();

      if (currentHash !== expectedHash) {
        showPortalToast('Current master passphrase does not match.');
        currentPassInput.select();
        return;
      }

      if (newPass.length < 8) {
        showPortalToast('New passphrase must be at least 8 characters.');
        return;
      }

      if (newPass !== confirmPass) {
        showPortalToast('New passphrases do not match.');
        confirmNewPassInput.select();
        return;
      }

      const newHash = await computeSha256(newPass);
      saveStoredMasterHash(newHash);
      changePassForm.reset();
      showPortalToast('Master passphrase updated successfully!');
    });
  }

  // Export full JSON backup
  if (exportBackupBtn) {
    exportBackupBtn.addEventListener('click', () => {
      const backup = {
        exportedAt: new Date().toISOString(),
        menu: getMenuItems(),
        photos: getGalleryPhotos(),
        reservations: getReservations()
      };
      const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', jsonStr);
      link.setAttribute('download', `AMARA_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showPortalToast('Full JSON backup downloaded.');
    });
  }

  // Reset defaults
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore all original café defaults? Any customizations will be reset.')) {
        localStorage.removeItem('amara_menu_items');
        localStorage.removeItem('amara_gallery_photos');
        localStorage.removeItem('amara_reservations');
        renderMenuModule();
        renderPhotosModule();
        renderReservationsModule();
        showPortalToast('Restored all original café defaults.');
      }
    });
  }


  /* ==========================================================
     9. TOAST UTILITY
     ========================================================== */
  const portalToastContainer = document.getElementById('portalToastContainer');
  function showPortalToast(msg) {
    if (!portalToastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
    portalToastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  function initPortalDashboard() {
    renderMenuModule();
    renderPhotosModule();
    renderReservationsModule();
  }

});
