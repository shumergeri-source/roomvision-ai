/* ============================================
   RoomVision AI — App Logic
   ============================================ */

// --- Mock Data ---

const CHAT_MESSAGES = [
  {
    text: "I've analyzed your room. It's a <strong>mid-century modern living space</strong> with approximately 320 sq ft of usable area. The natural light from the west-facing windows is a strong asset you're not fully utilizing.",
    delay: 800
  },
  {
    text: "A few key observations: Your current color palette skews cool-neutral, which works well but could benefit from warmer accent tones. The sofa placement is blocking about 15% of your natural light path.",
    delay: 2200
  },
  {
    text: "I'd recommend rotating the seating area 45 degrees and introducing a <strong>warm brass floor lamp</strong> to the reading corner. Adding a textured area rug (think bouclé or sisal) would create better spatial definition.",
    delay: 3800
  },
  {
    text: "For wall art, the space above the sofa is ideal for a 40x60\" piece. I'd suggest abstract work in warm earth tones to complement the existing palette without overwhelming the minimalist feel.",
    delay: 5200
  },
  {
    text: "Based on your room dimensions, I've curated a selection of pieces below. You can select a budget tier to see options that match your preferred price range. Want me to focus on any particular area?",
    delay: 6800
  }
];

const PRODUCTS = [
  // Budget
  { id: 1, name: "Linen Throw Pillow Set", desc: "Set of 3, warm terracotta tones", price: 45, tier: "budget", badge: "Best Value", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop" },
  { id: 2, name: "Ceramic Table Lamp", desc: "Matte white with linen shade", price: 79, tier: "budget", image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=300&fit=crop" },
  { id: 3, name: "Woven Jute Area Rug", desc: "5x7 ft, natural fiber weave", price: 120, tier: "budget", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=300&fit=crop" },
  { id: 4, name: "Floating Wall Shelf", desc: "Solid oak, 36\" mounting", price: 55, tier: "budget", image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&h=300&fit=crop" },

  // Mid-Range
  { id: 5, name: "Arc Floor Lamp", desc: "Brushed brass with marble base", price: 320, tier: "mid", badge: "AI Pick", image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=300&fit=crop" },
  { id: 6, name: "Velvet Accent Chair", desc: "Forest green, solid walnut legs", price: 450, tier: "mid", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop" },
  { id: 7, name: "Abstract Canvas Print", desc: "40x60\", earth tone composition", price: 280, tier: "mid", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop" },
  { id: 8, name: "Bouclé Throw Blanket", desc: "Oversized, cream textured weave", price: 185, tier: "mid", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },

  // Premium
  { id: 9, name: "Italian Leather Sofa", desc: "3-seat, cognac top-grain leather", price: 2400, tier: "premium", badge: "Premium", image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=400&h=300&fit=crop" },
  { id: 10, name: "Handwoven Kilim Rug", desc: "8x10 ft, vintage geometric pattern", price: 1200, tier: "premium", image: "https://images.unsplash.com/photo-1575414003552-1fa0e3e07595?w=400&h=300&fit=crop" },
  { id: 11, name: "Sculptural Coffee Table", desc: "Solid travertine stone, oval", price: 1800, tier: "premium", image: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=400&h=300&fit=crop" },

  // Luxury
  { id: 12, name: "B&B Italia Sectional", desc: "Modular, bouclé fabric, Italian made", price: 8500, tier: "luxury", badge: "Luxury", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
  { id: 13, name: "Flos IC Floor Light", desc: "Blown glass sphere, brass stem", price: 1100, tier: "luxury", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop" },
  { id: 14, name: "Custom Gallery Wall Set", desc: "5-piece curated originals", price: 4200, tier: "luxury", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop" },
  { id: 15, name: "Solid Marble Console", desc: "Calacatta gold, waterfall edges", price: 6800, tier: "luxury", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop" },
];

// State
let selectedTier = 'mid';
let selectedItems = [];
let chatIndex = 0;
let isProcessing = false;

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initUpload();
  initChat();
  initItemMatch();
  initBudget();
  renderProducts();
  initRedesignSlider();
  initVisualization();
  initScrollReveal();
});

// --- Navigation ---
function initNav() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// --- Upload ---
function initUpload() {
  const area = document.getElementById('uploadArea');
  const processing = document.getElementById('uploadProcessing');
  const result = document.getElementById('roomAnalyzed');

  if (!area) return;

  // Drag events
  ['dragenter', 'dragover'].forEach(evt => {
    area.addEventListener(evt, e => {
      e.preventDefault();
      area.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    area.addEventListener(evt, e => {
      e.preventDefault();
      area.classList.remove('drag-over');
    });
  });

  // Click / Drop triggers upload
  area.addEventListener('click', () => startProcessing());
  area.addEventListener('drop', () => startProcessing());

  function startProcessing() {
    if (isProcessing) return;
    isProcessing = true;

    area.style.display = 'none';
    processing.classList.add('active');

    const steps = processing.querySelectorAll('.processing-step');
    const delays = [600, 1800, 3200, 4400];

    steps.forEach((step, i) => {
      setTimeout(() => {
        step.classList.add('active');
        if (i > 0) steps[i - 1].classList.remove('active');
        if (i > 0) steps[i - 1].classList.add('done');
      }, delays[i]);
    });

    setTimeout(() => {
      steps[steps.length - 1].classList.remove('active');
      steps[steps.length - 1].classList.add('done');
    }, 5200);

    setTimeout(() => {
      processing.classList.remove('active');
      processing.style.display = 'none';
      result.classList.add('active');
      isProcessing = false;

      // Start chat
      startChat();
    }, 5800);
  }
}

// --- Chat ---
function initChat() {
  const input = document.querySelector('.chat-input');
  const sendBtn = document.querySelector('.chat-send-btn');

  if (!input || !sendBtn) return;

  sendBtn.addEventListener('click', () => {
    if (input.value.trim()) {
      addUserMessage(input.value.trim());
      input.value = '';

      // Fake AI response
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
addAIMessage("That's a great point! I'd suggest pairing that with some ambient lighting to really bring the space together. Let me update my recommendations based on your input.");
        }, 2000);
      }, 500);
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendBtn.click();
  });
}

function startChat() {
  chatIndex = 0;
  deliverNextMessage();
}

function deliverNextMessage() {
  if (chatIndex >= CHAT_MESSAGES.length) return;

  const msg = CHAT_MESSAGES[chatIndex];
  showTyping();

  setTimeout(() => {
    hideTyping();
    addAIMessage(msg.text);
    chatIndex++;
    if (chatIndex < CHAT_MESSAGES.length) {
      setTimeout(deliverNextMessage, 1200);
    }
  }, 1500 + Math.random() * 800);
}

function addAIMessage(html) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const div = document.createElement('div');
  div.className = 'chat-message';
  div.innerHTML = `
    <div class="chat-message-avatar">R</div>
    <div class="chat-message-content">
      <div class="chat-message-text">${html}</div>
      <div class="chat-message-time">${time}</div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const div = document.createElement('div');
  div.className = 'chat-message';
  div.style.flexDirection = 'row-reverse';
  div.innerHTML = `
    <div class="chat-message-avatar" style="background: var(--border-light); color: var(--text-primary);">U</div>
    <div class="chat-message-content" style="align-items: flex-end;">
      <div class="chat-message-text" style="background: rgba(176,125,142,0.06); border-color: rgba(176,125,142,0.15); border-radius: 14px 4px 14px 14px;">${text}</div>
      <div class="chat-message-time">${time}</div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const el = document.getElementById('chatTyping');
  if (el) el.style.display = 'flex';
}

function hideTyping() {
  const el = document.getElementById('chatTyping');
  if (el) el.style.display = 'none';
}

// --- Budget Tiers ---
function initBudget() {
  document.querySelectorAll('.budget-tier').forEach(tier => {
    tier.addEventListener('click', () => {
      document.querySelectorAll('.budget-tier').forEach(t => t.classList.remove('active'));
      tier.classList.add('active');
      selectedTier = tier.dataset.tier;
      renderProducts();
    });
  });
}

// --- Products ---
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const count = document.getElementById('productsCount');
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => p.tier === selectedTier);
  if (count) count.textContent = `${filtered.length} items curated for your space`;

  grid.innerHTML = '';
  filtered.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.5s ease-out ${i * 0.1}s forwards`;

    const isAdded = selectedItems.find(item => item.id === product.id);

    card.innerHTML = `
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<div class="product-card-badge">${product.badge}</div>` : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${product.name}</div>
        <div class="product-card-desc">${product.desc}</div>
        <div class="product-card-footer">
          <div class="product-card-price">$${product.price.toLocaleString()}</div>
          <button class="product-add-btn ${isAdded ? 'added' : ''}" data-id="${product.id}">
            ${isAdded ? '&#10003; Added' : 'Add to Room'}
          </button>
        </div>
      </div>
    `;

    const btn = card.querySelector('.product-add-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleProduct(product);
    });

    grid.appendChild(card);
  });
}

function toggleProduct(product) {
  const idx = selectedItems.findIndex(item => item.id === product.id);
  if (idx > -1) {
    selectedItems.splice(idx, 1);
    showToast(`Removed ${product.name}`);
  } else {
    selectedItems.push(product);
    showToast(`Added ${product.name} to your room`);
  }
  renderProducts();
  renderVisualization();
}

// --- Redesign Slider ---
function initRedesignSlider() {
  const container = document.querySelector('.redesign-comparison');
  if (!container) return;

  const handle = container.querySelector('.redesign-slider-handle');
  const before = container.querySelector('.redesign-before');
  let isDragging = false;

  function updateSlider(x) {
    const rect = container.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    pos = Math.max(2, Math.min(98, pos));
    before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    handle.style.left = `${pos}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) updateSlider(e.clientX);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  container.addEventListener('touchmove', (e) => {
    if (isDragging) updateSlider(e.touches[0].clientX);
  });

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Style buttons
  document.querySelectorAll('.redesign-style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.redesign-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Showing ${btn.textContent.trim()} redesign`);
    });
  });
}

// --- Visualization ---
function initVisualization() {
  renderVisualization();
}

function renderVisualization() {
  const chipsContainer = document.getElementById('selectedItemsGrid');
  const totalEl = document.getElementById('visualizeTotal');
  const roomContainer = document.querySelector('.visualize-room');

  if (!chipsContainer) return;

  // Remove old placed items
  document.querySelectorAll('.placed-item').forEach(el => el.remove());

  // Render chips
  chipsContainer.innerHTML = '';
  if (selectedItems.length === 0) {
    chipsContainer.innerHTML = '<div style="font-size: 13px; color: var(--text-tertiary); padding: 12px 0;">Select items from the shop above to see them placed in your room.</div>';
  }

  const positions = [
    { bottom: '8%', left: '15%' },
    { bottom: '12%', right: '20%' },
    { top: '30%', right: '10%' },
    { bottom: '5%', left: '45%' },
    { top: '20%', left: '10%' },
  ];

  selectedItems.forEach((item, i) => {
    // Chip
    const chip = document.createElement('div');
    chip.className = 'selected-item-chip';
    chip.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="selected-item-chip-info">
        <div class="selected-item-chip-name">${item.name}</div>
        <div class="selected-item-chip-price">$${item.price.toLocaleString()}</div>
      </div>
      <button class="selected-item-chip-remove" data-id="${item.id}">&times;</button>
    `;
    chip.querySelector('.selected-item-chip-remove').addEventListener('click', () => {
      toggleProduct(item);
    });
chipsContainer.appendChild(chip);

    // Place in room
    if (roomContainer && i < positions.length) {
      const placed = document.createElement('div');
      placed.className = 'placed-item';
      const pos = positions[i];
      Object.entries(pos).forEach(([k, v]) => placed.style[k] = v);
      placed.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 8px; border: 2px solid rgba(176,125,142,0.3);">
        <div class="placed-item-label">${item.name}</div>
      `;
      placed.style.animation = `fadeInUp 0.4s ease-out ${i * 0.1}s forwards`;
      placed.style.opacity = '0';
      roomContainer.appendChild(placed);
    }
  });

  // Total
  if (totalEl) {
    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
    totalEl.textContent = `$${total.toLocaleString()}`;
  }
}

// --- Item Match ---
function initItemMatch() {
  const roomBox = document.getElementById('roomUploadBox');
  const itemBox = document.getElementById('itemUploadBox');
  const analyzeBtn = document.getElementById('analyzeMatchBtn');
  const resultEl = document.getElementById('itemMatchResult');

  if (!roomBox || !itemBox) return;

  // Room photo upload
  setupMatchUpload(roomBox, 'roomPreview', 'roomPreviewImg',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop');

  // Item photo upload
  setupMatchUpload(itemBox, 'itemPreview', 'itemPreviewImg',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop');

  // Analyze button
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      // Show both preview images (mock) then show result
      const roomPreview = document.getElementById('roomPreview');
      const itemPreview = document.getElementById('itemPreview');
      const roomImg = document.getElementById('roomPreviewImg');
      const itemImg = document.getElementById('itemPreviewImg');

      // Set mock images if not already set
      if (roomPreview.style.display === 'none') {
        roomImg.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop';
        roomPreview.style.display = 'block';
        roomBox.classList.add('has-image');
      }
      if (itemPreview.style.display === 'none') {
        itemImg.src = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop';
        itemPreview.style.display = 'block';
        itemBox.classList.add('has-image');
      }

      // Show loading then result
      analyzeBtn.innerHTML = '<div class="processing-spinner" style="width:20px;height:20px;margin:0;border-width:2px;"></div> Analyzing...';
      analyzeBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        analyzeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Analysis Complete`;
        resultEl.classList.add('active');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
          analyzeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7-7h6m6 0h6"/></svg> Analyze Compatibility`;
          analyzeBtn.style.pointerEvents = 'auto';
        }, 2000);
      }, 2200);
    });
  }
}

function setupMatchUpload(box, previewId, imgId, mockSrc) {
  const preview = document.getElementById(previewId);
  const img = document.getElementById(imgId);

  // Drag events
  ['dragenter', 'dragover'].forEach(evt => {
    box.addEventListener(evt, e => {
      e.preventDefault();
      box.style.borderColor = 'var(--accent)';
      box.style.background = 'rgba(176, 125, 142, 0.06)';
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    box.addEventListener(evt, e => {
      e.preventDefault();
      box.style.borderColor = '';
      box.style.background = '';
    });
  });

  // Click to upload (mock)
  box.addEventListener('click', () => {
    if (box.classList.contains('has-image')) return;
    img.src = mockSrc;
    preview.style.display = 'block';
    box.classList.add('has-image');
    showToast('Photo uploaded successfully');
  });

  // Drop to upload (mock)
  box.addEventListener('drop', (e) => {
    e.preventDefault();
    if (box.classList.contains('has-image')) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.src = ev.target.result;
        preview.style.display = 'block';
        box.classList.add('has-image');
        showToast('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    } else {
      img.src = mockSrc;
      preview.style.display = 'block';
      box.classList.add('has-image');
      showToast('Photo uploaded successfully');
    }
  });
}

// --- Scroll Reveal ---
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Toast ---
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="toast-icon">&#10003;</span> ${message}`;
  toast.classList.remove('show');
  void toast.offsetWidth; // reflow
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}
