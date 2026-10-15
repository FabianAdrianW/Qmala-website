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
  var homePage = document.body.classList.contains('home');
  if (fine && !calm) [].forEach.call(document.querySelectorAll('.tile:not(.s):not(.float)'), function (t) {
    t.addEventListener('pointermove', function (e) {
      var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      var k = Math.min(1, 420 / r.width) * (homePage ? .45 : 1); /* na stronie głównej pochylenie jest łagodniejsze (max ok. 4°) */
      t.style.setProperty('--ry', ((x - .5) * 9 * k).toFixed(2) + 'deg'); t.style.setProperty('--rx', ((.5 - y) * 9 * k).toFixed(2) + 'deg');
      t.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); t.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      t.classList.add('is-live');
    });
    t.addEventListener('pointerleave', function () { t.classList.remove('is-live'); t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
  });

  /* STRONA GŁÓWNA: pas realizacji (strzałki) i paralaksa zdjęć */
  (function () {
    if (!homePage) return;
    var strip = document.getElementById('strip');
    if (strip) {
      var ctl = document.querySelector('.strip-ctl');
      if (ctl) {
        ctl.hidden = false; /* bez JS pas i tak przewija się palcem i klawiaturą, strzałki są dodatkiem */
        var prev = ctl.querySelector('[data-dir="-1"]'), next = ctl.querySelector('[data-dir="1"]');
        var sync = function () {
          var max = strip.scrollWidth - strip.clientWidth;
          prev.disabled = strip.scrollLeft <= 2; next.disabled = strip.scrollLeft >= max - 2;
        };
        ctl.addEventListener('click', function (e) {
          var b = e.target.closest('button'); if (!b) return;
          var card = strip.querySelector('.tile'), step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(strip).columnGap || 0) : strip.clientWidth * .8;
          strip.scrollBy({ left: step * Number(b.dataset.dir), behavior: calm ? 'auto' : 'smooth' });
        });
        strip.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
        addEventListener('resize', sync);
        sync();
      }
    }
    if (calm) return;
    var imgs = [].slice.call(document.querySelectorAll('.home .photo > img, .home .firm-pic img'));
    var busy = false;
    function frame() {
      busy = false;
      var vh = innerHeight;
      imgs.forEach(function (img) {
        var box = img.parentNode, r = box.getBoundingClientRect();
        if (!box.isConnected || r.bottom < -50 || r.top > vh + 50) return;
        var p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
        img.style.setProperty('--py', (-p * r.height * .05).toFixed(1) + 'px'); /* zapas obrazu to 6% wysokości z każdej strony */
      });
    }
    addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(frame); } }, { passive: true });
    addEventListener('resize', frame);
    frame();
  })();

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

  /* formularz wyceny: wysyłka bez otwierania poczty (Netlify Forms), potwierdzenie z adresem klienta */
  (function () {
    var form = document.getElementById('wycena'); if (!form) return;
    var body = form.querySelector('.form-body'), done = document.getElementById('f-done'), err = document.getElementById('f-err'),
        send = document.getElementById('f-send'), email = document.getElementById('f-email'), tel = document.getElementById('f-tel'),
        temat = document.getElementById('f-temat'), opis = document.getElementById('f-opis');
    // Na qmala.pl i *.netlify.app formularz wysyła się naprawdę. Gdzie indziej (plik, podgląd) to makieta.
    var live = /(^|\.)qmala\.pl$|\.netlify\.app$/.test(location.hostname);
    function showErr(text, field, link) {
      err.textContent = text;
      if (link) { err.appendChild(document.createTextNode(' ')); var a = document.createElement('a'); a.href = link.href; a.textContent = link.text; err.appendChild(a); }
      err.hidden = false;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    }
    function strong(s) { var n = document.createElement('strong'); n.textContent = s; return n; }
    function showDone(em, ph) {
      var p = document.getElementById('f-done-p'); p.textContent = '';
      if (em) {
        p.appendChild(document.createTextNode('Dostaliśmy Twoje zapytanie z adresu ')); p.appendChild(strong(em)); p.appendChild(document.createTextNode('. Odpiszemy na ten adres.'));
        if (ph) { p.appendChild(document.createTextNode(' Możemy też zadzwonić na ')); p.appendChild(strong(ph)); p.appendChild(document.createTextNode('.')); }
      } else { p.appendChild(document.createTextNode('Dostaliśmy Twoje zapytanie. Oddzwonimy na numer ')); p.appendChild(strong(ph)); p.appendChild(document.createTextNode('.')); }
      document.getElementById('f-prev').hidden = live;
      body.hidden = true; done.hidden = false; done.focus();
    }
    document.getElementById('f-again').addEventListener('click', function () { form.reset(); done.hidden = true; body.hidden = false; temat.focus(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true; email.removeAttribute('aria-invalid'); tel.removeAttribute('aria-invalid');
      var em = email.value.trim(), ph = tel.value.trim();
      if (!em && !ph) return showErr('Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.', email);
      if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return showErr('Sprawdź adres e-mail. Powinien wyglądać tak: nazwa@domena.pl.', email);
      if (!em && ph.replace(/\D/g, '').length < 9) return showErr('Numer telefonu jest za krótki. Podaj co najmniej 9 cyfr.', tel);
      send.disabled = true; send.textContent = 'Wysyłam…';
      var req = live
        ? fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); })
        : new Promise(function (r) { setTimeout(r, 900); });
      req.then(function () { showDone(em, ph); }, function () {
        var txt = ['Temat: ' + temat.value, 'Opis: ' + (opis.value.trim() || '-'), 'E-mail: ' + (em || '-'), 'Telefon: ' + (ph || '-')].join('\n');
        showErr('Nie udało się wysłać. Wpisane dane zostały w formularzu. Spróbuj jeszcze raz albo zadzwoń.', null,
          { href: 'mailto:' + (form.dataset.mail || '') + '?subject=' + encodeURIComponent('Zapytanie o wycenę: ' + temat.value) + '&body=' + encodeURIComponent(txt), text: 'Napisz z własnej poczty.' });
      }).then(function () { send.disabled = false; send.textContent = 'Wyślij zapytanie'; });
    });
  })();

  /* HERO ze zdjęciem: lekkie pochylenie za kursorem (tylko mysz, bez reduced motion) */
  (function () {
    var art = document.getElementById('hero-art'); if (!art || calm || !fine) return;
    var st = art.querySelector('.hero-stack');
    art.addEventListener('pointermove', function (e) {
      var r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      st.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg'); st.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
    });
    art.addEventListener('pointerleave', function () { st.style.setProperty('--rx', '0deg'); st.style.setProperty('--ry', '0deg'); });
  })();

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
