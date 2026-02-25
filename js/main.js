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

// Docs sidebar — active nav highlight on scroll
const sections = document.querySelectorAll('.tutorial-section');
const navItems = document.querySelectorAll('.nav-item');

if (sections.length && navItems.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navItems.forEach(n => {
      n.classList.remove('active');
      if (n.getAttribute('href') === '#' + current) n.classList.add('active');
    });
  });
}
