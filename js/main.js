/* ============================================
   main.js — shared JavaScript
   ============================================ */

// Panel open/close
function openPanel(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close panel on backdrop click
document.querySelectorAll('.sub-panel').forEach(panel => {
  panel.addEventListener('click', e => {
    if (e.target === panel) closePanel(panel.id);
  });
});

// Close panel on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.sub-panel.open').forEach(p => closePanel(p.id));
  }
});

/* ============================================
   Sidebar — toggle functions
   ============================================ */
function toggleGroup(header) {
  header.closest('.nav-group').classList.toggle('open');
}

function toggleSubgroup(header) {
  header.closest('.nav-subgroup').classList.toggle('open');
}

/* ============================================
   Sidebar — loader
   ============================================ */
function loadSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  // คำนวณ path กลับไปที่ root จาก URL ปัจจุบัน
  const parts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
  const docsIndex = parts.indexOf('docs');
  const levelsDeep = docsIndex >= 0 ? parts.length - docsIndex : 0;
  const prefix = levelsDeep > 0 ? '../'.repeat(levelsDeep) : './';

  fetch(prefix + 'components/sidebar.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      initScrollHighlight();
    })
    .catch(err => console.error('Sidebar load failed:', err));
}

/* ============================================
   Sidebar — active nav highlight on scroll
   ============================================ */
function initScrollHighlight() {
  const sections = document.querySelectorAll('.tutorial-section');
  const navItems = document.querySelectorAll('.nav-item[href^="#"]:not([href="#"])');

  if (!sections.length || !navItems.length) return;

  function updateActive() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navItems.forEach(n => {
      n.classList.remove('active');
      if (current && n.getAttribute('href') === '#' + current) {
        n.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive);
  updateActive();
}

/* ============================================
   Init
   ============================================ */
document.addEventListener('DOMContentLoaded', loadSidebar);


/* ============================================
   Sidebar — mobile toggle
   ============================================ */
function openSidebar() {
  document.querySelector('.sidebar').classList.add('open');
  document.querySelector('.sidebar-overlay').classList.add('open');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay').classList.remove('open');
}