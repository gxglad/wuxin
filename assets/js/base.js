/* 「五心」苏式工匠 · 数字形象模板库 — 公共脚本 */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;

  /* ---------- 主题 ---------- */
  var THEME_KEY = 'wuxin-theme';
  function readTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    doc.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', t === 'dark' ? '#111316' : '#F5F2EB');
    });
  }
  var saved = readTheme();
  if (saved) applyTheme(saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');

  /* ---------- 导航 ---------- */
  var nav = doc.querySelector('.nav');
  var drawer = doc.querySelector('.drawer');
  var burger = doc.querySelector('.burger');

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    doc.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      doc.body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  doc.querySelectorAll('.theme-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* ---------- 滚动 ---------- */
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-stuck', y > 12);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 进场动画 ---------- */
  var items = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 进度条 ---------- */
  var bar = doc.querySelector('.progress');
  if (bar) {
    var raf = null;
    function upd() {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, p)) + '%';
      raf = null;
    }
    window.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(upd);
    }, { passive: true });
    upd();
  }

  /* ---------- 年份 ---------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 平滑锚点（补偿导航高度） ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = doc.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
