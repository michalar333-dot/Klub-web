/* Interaktivita webu Next Generation Legal Business Club */
(function () {
  'use strict';
  var D = window.CLUB_DATA;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function chipStyle(active) {
    return 'padding: 11px 18px; border-radius: 999px; font: inherit; font-size: 14px; font-weight: 500; cursor: pointer; border: 1px solid ' +
      (active ? '#1E366D' : '#D6D9E2') + '; background: ' + (active ? '#1E366D' : '#FFFFFF') + '; color: ' + (active ? '#FFFFFF' : '#111114') + ';';
  }
  function renderChips(el, defs, current, counts, onPick) {
    el.innerHTML = defs.map(function (d) {
      var active = d[0] === current;
      return '<button type="button" data-key="' + d[0] + '" aria-pressed="' + active + '" style="' + chipStyle(active) + '">' +
        esc(d[1]) + ' <span style="opacity: 0.7;">' + counts[d[0]] + '</span></button>';
    }).join('');
    el.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { onPick(b.getAttribute('data-key')); });
    });
  }

  /* ---------- Úvodní animace s logem ---------- */
  (function intro() {
    var root = document.documentElement;
    var logo = document.getElementById('intro-logo');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!logo || reduce) { root.classList.add('intro-done'); return; }
    var target = document.getElementById('header-logo');
    setTimeout(function () {
      var from = logo.getBoundingClientRect();
      var to = target.getBoundingClientRect();
      var scale = to.width / from.width;
      var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
      logo.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + scale + ')';
      root.classList.add('intro-moving');
    }, 1300);
    setTimeout(function () { root.classList.add('intro-done'); }, 2450);
  })();

  /* ---------- Historie setkání ---------- */
  (function events() {
    var list = document.getElementById('events-list');
    var filters = document.getElementById('year-filters');
    if (!list) return;
    var year = 'all', open = 0;
    var defs = [['all', 'Vše'], ['2026', '2026'], ['2025', '2025'], ['2024', '2024']];
    var counts = { all: D.events.length };
    D.events.forEach(function (e) { counts[e.year] = (counts[e.year] || 0) + 1; });

    function render() {
      renderChips(filters, defs, year, counts, function (k) { year = k; open = -1; render(); });
      var items = D.events.filter(function (e) { return year === 'all' || e.year === year; });
      list.innerHTML = items.map(function (e, i) {
        var isOpen = i === open;
        var id = 'setkani-' + e.num.replace('.', '');
        return '<div style="border: 1px solid #DFE3EC; border-radius: 16px; background: #F7F8FB; overflow: hidden;">' +
          '<button type="button" data-i="' + i + '" aria-expanded="' + isOpen + '" aria-controls="' + id + '" style="width: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 20px; padding: 22px 24px; background: transparent; border: 0; cursor: pointer; text-align: left; font: inherit; color: inherit;">' +
          '<span style="min-width: 64px; font-family: \'Cormorant Garamond\', Georgia, serif; font-size: 30px; font-weight: 600; color: #1E366D;">' + esc(e.num) + '</span>' +
          '<span style="flex: 999 1 300px; min-width: 0;">' +
          '<span style="display: block; font-size: 13px; color: #5A5F70; font-weight: 500;">' + esc(e.date) + ' · ' + esc(e.place) + '</span>' +
          '<span style="display: block; margin-top: 4px; font-family: \'Cormorant Garamond\', Georgia, serif; font-size: 20px; font-weight: 600; line-height: 1.3;">' + esc(e.topic) + '</span>' +
          '</span>' +
          '<span aria-hidden="true" style="width: 40px; height: 40px; border-radius: 50%; background: #FFFFFF; border: 1px solid #DADAD6; display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; color: #111114;">' + (isOpen ? '−' : '+') + '</span>' +
          '</button>' +
          (isOpen ?
            '<div id="' + id + '" style="padding: 4px 0 24px; border-top: 1px solid #E6E9F0; margin: 0 24px; display: flex; flex-direction: column; gap: 18px; color: #3A3A42; font-size: 15px;">' +
            '<p style="margin: 16px 0 0; font-size: 16px; color: #33374A; max-width: 820px;">' + esc(e.summary) + '</p>' +
            '<div style="display: flex; flex-wrap: wrap; gap: 24px;">' +
            '<div style="flex: 2 1 300px; min-width: 0;"><p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A5F70; font-weight: 600;">Hosté</p><p style="margin: 0;">' + esc(e.guests) + '</p></div>' +
            '<div style="flex: 1 1 220px; min-width: 0;"><p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A5F70; font-weight: 600;">Moderace</p><p style="margin: 0;">' + esc(e.host) + '</p></div>' +
            '</div></div>' : '') +
          '</div>';
      }).join('');
      list.querySelectorAll('button[data-i]').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.getAttribute('data-i');
          open = open === i ? -1 : i;
          render();
          var again = list.querySelector('button[data-i="' + i + '"]');
          if (again) again.focus();
        });
      });
    }
    render();
  })();

  /* ---------- Reference členů ---------- */
  (function quotes() {
    var q = 0, n = D.quotes.length;
    var dots = document.getElementById('quote-dots');
    if (!dots) return;
    function show(i) {
      q = (i % n + n) % n;
      var item = D.quotes[q];
      document.getElementById('quote-text').textContent = item.text;
      document.getElementById('quote-initials').textContent = item.initials;
      document.getElementById('quote-name').textContent = item.name;
      document.getElementById('quote-role').textContent = item.role;
      dots.innerHTML = D.quotes.map(function (it, j) {
        var a = j === q;
        return '<button type="button" data-j="' + j + '" aria-label="Reference ' + (j + 1) + ': ' + esc(it.name) + '"' + (a ? ' aria-current="true"' : '') +
          ' style="width: ' + (a ? '32px' : '12px') + '; height: 12px; border-radius: 999px; border: 0; padding: 0; cursor: pointer; background: ' + (a ? '#FFFFFF' : '#7D91C2') + ';"></button>';
      }).join('');
      dots.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () { show(+b.getAttribute('data-j')); });
      });
    }
    document.getElementById('quote-prev').addEventListener('click', function () { show(q - 1); });
    document.getElementById('quote-next').addEventListener('click', function () { show(q + 1); });
    show(0);
  })();

  /* ---------- Napsali o nás ---------- */
  (function press() {
    var list = document.getElementById('press-list');
    var filters = document.getElementById('press-filters');
    var count = document.getElementById('press-count');
    if (!list) return;
    var type = 'all';
    var labels = { clanek: 'Článek', rozhovor: 'Rozhovor', podcast: 'Podcast / video', akce: 'Akce' };
    var defs = [['all', 'Vše'], ['clanek', 'Články'], ['rozhovor', 'Rozhovory'], ['podcast', 'Podcasty a video'], ['akce', 'Akce']];
    var counts = { all: D.press.length };
    D.press.forEach(function (p) { counts[p.type] = (counts[p.type] || 0) + 1; });
    defs.forEach(function (d) { counts[d[0]] = counts[d[0]] || 0; });

    function render() {
      renderChips(filters, defs, type, counts, function (k) { type = k; render(); });
      var items = D.press.filter(function (p) { return type === 'all' || p.type === type; });
      var m = items.length;
      count.textContent = m + (m === 1 ? ' zmínka' : (m >= 2 && m <= 4 ? ' zmínky' : ' zmínek'));
      list.innerHTML = items.map(function (p) {
        return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" style="display: flex; flex-direction: column; gap: 12px; background: #FFFFFF; border: 1px solid #DFE3EC; border-radius: 18px; padding: 24px; text-decoration: none; color: #111114; min-height: 220px;">' +
          '<span style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">' +
          '<span style="font-family: \'Cormorant Garamond\', Georgia, serif; font-weight: 700; font-size: 15px; letter-spacing: 0.01em;">' + esc(p.outlet) + '</span>' +
          '<span style="padding: 4px 10px; border-radius: 999px; background: #EEF1F7; font-size: 12px; color: #44444C; font-weight: 500;">' + esc(labels[p.type]) + '</span>' +
          '</span>' +
          '<span style="font-family: \'Cormorant Garamond\', Georgia, serif; font-size: 19px; font-weight: 600; line-height: 1.3;">' + esc(p.title) + '</span>' +
          '<span style="color: #55555E; font-size: 15px; flex-grow: 1;">' + esc(p.summary) + '</span>' +
          '<span style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #5A5F70; padding-top: 12px; border-top: 1px solid #EDEFF4;">' +
          '<span>' + esc(p.date) + '</span><span style="color: #1E366D; font-weight: 600;">Číst ↗</span></span></a>';
      }).join('');
    }
    render();
  })();

  /* ---------- Formulář členství ----------
     Formulář zatím data nikam neodesílá. Pro ostrý provoz nastavte
     v index.html atribut action (např. Formspree nebo vlastní endpoint)
     a smažte e.preventDefault() níže. */
  (function form() {
    var f = document.getElementById('join-form');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      f.hidden = true;
      document.getElementById('form-thanks').hidden = false;
    });
  })();
})();
