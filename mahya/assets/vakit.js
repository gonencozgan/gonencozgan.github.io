// The live part of a place page: today's times from the page's data, the
// current one picked out and the time left to the next. Türkiye keeps
// UTC+3 all year, so the place's clock is UTC plus three hours.
(function () {
  var el = document.getElementById('vakit-data');
  if (!el) return;
  var data = JSON.parse(el.textContent);
  var days = data.t.split(';').map(function (d) { return d.split(',').map(Number); });
  var s = data.start.split('-').map(Number);
  var start = Date.UTC(s[0], s[1] - 1, s[2]);
  var DAY = 864e5, OFFSET = 3 * 36e5;
  var datives = ["İmsak'a", "Güneş'e", "Öğle'ye", "İkindi'ye", "Akşam'a", "Yatsı'ya"];
  var months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var weekdays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  var hijriNames = ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'];
  var card = document.getElementById('bugun');
  var rows = card.querySelectorAll('.six tr');
  var shownDay = -1;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clock(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function hijri(dayMs) {
    var h = null;
    data.h.forEach(function (m) {
      var p = m[0].split('-').map(Number);
      var at = Date.UTC(p[0], p[1] - 1, p[2]);
      if (at <= dayMs) h = [Math.round((dayMs - at) / DAY) + 1, m[1], m[2]];
    });
    return h ? h[0] + ' ' + hijriNames[h[1] - 1] + ' ' + h[2] : '';
  }
  function tick() {
    var local = Date.now() + OFFSET;
    var i = Math.floor((local - start) / DAY);
    var today = days[i], tomorrow = days[i + 1];
    if (!today || !tomorrow) { card.classList.add('old'); return; }
    var dayMs = start + i * DAY;
    if (i !== shownDay) {
      shownDay = i;
      var d = new Date(dayMs);
      document.getElementById('tarih').textContent =
        d.getUTCDate() + ' ' + months[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ' ' + weekdays[d.getUTCDay()];
      document.getElementById('hicri').textContent = hijri(dayMs);
      for (var v = 0; v < 6; v++) rows[v].querySelector('td').textContent = clock(today[v]);
      var iso = d.toISOString().substring(0, 10);
      document.querySelectorAll('.month tbody tr').forEach(function (r) {
        r.classList.toggle('today', r.getAttribute('data-d') === iso);
      });
    }
    var secs = Math.floor((local - dayMs) / 1000);
    var current = -1;
    for (var k = 0; k < 6; k++) if (today[k] * 60 <= secs) current = k;
    var next = current + 1, at;
    if (next < 6) { at = today[next] * 60; } else { next = 0; at = 86400 + tomorrow[0] * 60; }
    var left = at - secs;
    for (var r = 0; r < 6; r++) rows[r].classList.toggle('now', r === (current < 0 ? 5 : current));
    document.getElementById('kalan-ad').textContent = datives[next] + ' kalan';
    document.getElementById('kalan').textContent =
      Math.floor(left / 3600) + ':' + pad(Math.floor(left / 60) % 60) + ':' + pad(left % 60);
    document.getElementById('kalan-kutu').hidden = false;
  }
  tick();
  setInterval(tick, 1000);
})();
