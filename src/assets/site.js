(function () {
  'use strict';
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* navbar: zmienia się tylko linia, nigdy rozmiar */
  var nav = document.getElementById('nav'), links = document.getElementById('nav-links'), toggle = document.getElementById('nav-toggle'), dock = document.getElementById('dock');
  var small = matchMedia('(max-width: 1020px)');
  function setMenu(open) { links.hidden = !open && small.matches; toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Zamknij' : 'Menu'; }
  setMenu(false);
  small.addEventListener('change', function () { setMenu(false); });
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  var ticking = false;
  function onScroll() { ticking = false; nav.classList.toggle('is-scrolled', scrollY > 24); dock.classList.toggle('is-up', scrollY > 520); }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  var navA = [].slice.call(links.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      var cur = null; navA.forEach(function (a) { var id = a.getAttribute('href').slice(1); if (seen[id]) cur = id; });
      navA.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + cur)); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    navA.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
  }

  /* kafle: pochylenie 3D i światło za kursorem */
  if (fine && !calm) [].forEach.call(document.querySelectorAll('.tile:not(.s)'), function (t) {
    t.addEventListener('pointermove', function (e) {
      var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      var k = Math.min(1, 420 / r.width);
      t.style.setProperty('--ry', ((x - .5) * 9 * k).toFixed(2) + 'deg');
      t.style.setProperty('--rx', ((.5 - y) * 9 * k).toFixed(2) + 'deg');
      t.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); t.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      t.classList.add('is-live');
    });
    t.addEventListener('pointerleave', function () { t.classList.remove('is-live'); t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
  });

  /* kopiowanie */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.copy'); if (!b) return;
    var label = b.textContent, text = b.dataset.copy;
    function done() { b.textContent = 'Skopiowano'; b.classList.add('is-done'); setTimeout(function () { b.textContent = label; b.classList.remove('is-done'); }, 1600); }
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (err) { b.textContent = text; }
      t.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  });

  /* formularz → gotowy e-mail (bez serwera). Adres pochodzi z atrybutu data-mail. */
  var form = document.getElementById('wycena'), err = document.getElementById('f-err');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    if (v('f-tel').replace(/\D/g, '').length < 9) { err.hidden = false; document.getElementById('f-tel').focus(); return; }
    err.hidden = true;
    var body = 'Temat: ' + v('f-temat') + '\n\n' + (v('f-opis') || '(bez opisu)') + '\n\nMiejscowość: ' + (v('f-miejsce') || '-') + '\nTelefon: ' + v('f-tel');
    location.href = 'mailto:' + form.dataset.mail + '?subject=' + encodeURIComponent('Zapytanie o wycenę: ' + v('f-temat')) + '&body=' + encodeURIComponent(body);
  });

  /* HERO: stos kafli w 3D, lekko podąża za kursorem */
  (function () {
    var stack = document.getElementById('stack'), hero = document.getElementById('hero');
    if (!stack || calm || !fine) return;
    var bx = 7, by = -16, tx = bx, ty = by, cx = bx, cy = by, raf = 0;
    function step() {
      cx += (tx - cx) * .1; cy += (ty - cy) * .1;
      stack.style.setProperty('--rx', cx.toFixed(2) + 'deg'); stack.style.setProperty('--ry', cy.toFixed(2) + 'deg');
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .02 ? requestAnimationFrame(step) : 0;
    }
    function go() { if (!raf) raf = requestAnimationFrame(step); }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = bx - ((e.clientY - r.top) / r.height - .5) * 10; ty = by + ((e.clientX - r.left) / r.width - .5) * 16; go();
    });
    hero.addEventListener('pointerleave', function () { tx = bx; ty = by; go(); });
  })();

  /* podgląd zdjęć: klik w miniaturę, strzałki, Esc */
  (function () {
    var shots = [].slice.call(document.querySelectorAll('.shot')); if (!shots.length) return;
    var box = document.createElement('div'); box.className = 'lb'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Podgląd zdjęcia');
    box.innerHTML = '<div class="lb-top"><p></p><button type="button" data-a="x">Zamknij</button></div><div class="lb-stage"><img alt=""></div><div class="lb-bot"><button type="button" data-a="p">Poprzednie</button><span></span><button type="button" data-a="n">Następne</button></div>';
    document.body.appendChild(box);
    var img = box.querySelector('img'), cap = box.querySelector('p'), cnt = box.querySelector('span'), set = [], at = 0, last = null;
    function show(i) {
      at = (i + set.length) % set.length; var b = set[at];
      img.src = b.dataset.full; img.alt = b.dataset.cap; cap.textContent = b.dataset.cap; cnt.textContent = (at + 1) + ' z ' + set.length;
      box.querySelector('.lb-bot').hidden = set.length < 2;
    }
    function close() { box.hidden = true; img.removeAttribute('src'); document.documentElement.style.overflow = ''; if (last) last.focus(); }
    shots.forEach(function (b) {
      b.addEventListener('click', function () {
        last = b; set = shots.filter(function (s) { return s.dataset.set === b.dataset.set; });
        box.hidden = false; document.documentElement.style.overflow = 'hidden'; show(set.indexOf(b)); box.querySelector('[data-a="x"]').focus();
      });
    });
    box.addEventListener('click', function (e) {
      var a = e.target.closest('button'); if (!a) { if (e.target === box || e.target.classList.contains('lb-stage')) close(); return; }
      if (a.dataset.a === 'x') close(); else show(at + (a.dataset.a === 'n' ? 1 : -1));
    });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(at + 1); else if (e.key === 'ArrowLeft') show(at - 1);
    });
  })();
})();
