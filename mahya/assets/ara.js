// Finds a province or district as you type; Turkish letters and case
// don't matter ("sanliurfa" finds Şanlıurfa).
(function () {
  var input = document.getElementById('ara');
  var list = document.getElementById('sonuc');
  var places = JSON.parse(document.getElementById('yerler').textContent);
  var plain = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
  function fold(s) {
    return s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase()
      .replace(/[çğıöşüâîû]/g, function (c) { return plain[c]; }).replace(/[^a-z0-9 ]/g, ' ');
  }
  var keys = places.map(function (p) { return fold(p[0]).split(/\s+/); });
  input.addEventListener('input', function () {
    var words = fold(input.value).split(/\s+/).filter(Boolean);
    list.innerHTML = '';
    if (!words.length) return;
    var shown = 0;
    for (var i = 0; i < places.length && shown < 12; i++) {
      var ok = words.every(function (w) { return keys[i].some(function (k) { return k.indexOf(w) === 0; }); });
      if (!ok) continue;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = SITE + places[i][1];
      a.textContent = places[i][0] + ' namaz vakitleri';
      li.appendChild(a);
      list.appendChild(li);
      shown++;
    }
  });
})();
