'use strict';
document.body.classList.add('has-js');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const mobileQuery = window.matchMedia('(max-width: 760px)');
const closeMenu = (returnFocus = false) => {
  if (!nav || !navToggle) return;
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', '打开导航');
  if (returnFocus) navToggle.focus();
};
if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', (event) => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
  });
  mobileQuery.addEventListener('change', () => closeMenu());
}
const toast = document.querySelector('[data-toast]');
let toastTimer;
const notify = (text) => {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
};
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      notify('邮箱已复制');
    } catch {
      notify('未能自动复制，请长按或选中页面上的邮箱复制。');
    }
  });
});
// Animate once as content enters. Never hide content pending JS, network, or scrolling.
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionQuery.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (entry.boundingClientRect.top > 0) el.classList.add('is-entering');
      el.addEventListener('animationend', () => el.classList.remove('is-entering'), {once:true});
      observer.unobserve(el);
    });
  }, {threshold:0});
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  motionQuery.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.is-entering').forEach(el => el.classList.remove('is-entering'));
    }
  });
}
