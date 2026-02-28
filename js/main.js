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
   Sidebar — loader & Path Updater
   ============================================ */
function loadSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  // 1. คำนวณ path กลับไปที่ root จาก URL ปัจจุบันให้ถูกต้อง (แก้ไขสูตรลบ 1)
  const parts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
  const docsIndex = parts.indexOf('docs');
  const levelsDeep = docsIndex >= 0 ? (parts.length - 1) - docsIndex : 0;
  const prefix = levelsDeep > 0 ? '../'.repeat(levelsDeep) : './';

  // 2. ดึงไฟล์ sidebar.html
  fetch(prefix + 'components/sidebar.html')
    .then(r => r.text())
    .then(html => {
      // ตัดทุกอย่างตั้งแต่ </body> ลงไป
      // live-server จะ inject script ก่อน </body> เสมอ → ตัดทิ้งได้เลย
      const bodyClose = html.indexOf('</body>');
      if (bodyClose !== -1) html = html.substring(0, bodyClose);

      container.innerHTML = html;

      // 3. อัปเดต Path ของทุกลิงก์และรูปภาพใน Sidebar ให้อ้างอิงจากโฟลเดอร์ root
      const elementsWithPaths = container.querySelectorAll('a[href], img[src]');
      elementsWithPaths.forEach(el => {
        // จัดการแท็ก <a>
        if (el.hasAttribute('href')) {
          let href = el.getAttribute('href');
          // ข้ามพวกลิงก์ออกเว็บนอก (http) หรือลิงก์กระโดดข้ามหน้า (#)
          if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            el.setAttribute('href', prefix + href);
          }
        }
        // จัดการแท็ก <img>
        if (el.hasAttribute('src')) {
          let src = el.getAttribute('src');
          // ข้ามลิงก์รูปเว็บนอก (http) หรือ base64 data
          if (!src.startsWith('http') && !src.startsWith('data:')) {
            el.setAttribute('src', prefix + src);
          }
        }
      });

      // เรียกใช้งาน Highlight เมนูตอนเลื่อนหน้าจอ
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
      if (current && n.getAttribute('href').endsWith('#' + current)) {
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
  if (document.querySelector('.sidebar-overlay')) {
    document.querySelector('.sidebar-overlay').classList.add('open');
  }
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  if (document.querySelector('.sidebar-overlay')) {
    document.querySelector('.sidebar-overlay').classList.remove('open');
  }
}