// Cycle maths for the calculator pages: the same defaults as the app
// (lib/domain/cycle.dart). Ovulation is 14 days before the next period;
// the fertile window is the five days before it, the day itself and the
// day after. Estimates only, not a method of birth control.
const DAY = 86400000;
const luteal = 14;

function parseDay(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, n) {
  const r = new Date(date);
  r.setDate(r.getDate() + n);
  return r;
}

function daysBetween(a, b) {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / DAY);
}

const long = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
const short = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' });
const withYear = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

function range(a, b) {
  return a.getMonth() === b.getMonth() ? `${a.getDate()}–${short.format(b)}` : `${short.format(a)} – ${short.format(b)}`;
}

// The next [count] cycles after the one that started on [last], each with
// the ovulation inside it (14 days before the period after it).
function cycles(last, cycleLength, periodLength, count) {
  const out = [];
  for (let i = 1; i <= count; i++) {
    const start = addDays(last, cycleLength * i);
    const ovulation = addDays(start, cycleLength - luteal);
    out.push({
      start,
      periodEnd: addDays(start, periodLength - 1),
      ovulation,
      fertileStart: addDays(ovulation, -5),
      fertileEnd: addDays(ovulation, 1),
    });
  }
  return out;
}

// The ovulation of the cycle that started on [last].
function currentOvulation(last, cycleLength) {
  const ovulation = addDays(last, cycleLength - luteal);
  return { ovulation, fertileStart: addDays(ovulation, -5), fertileEnd: addDays(ovulation, 1) };
}

// Local yyyy-mm-dd, for date inputs (toISOString would give UTC).
function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

// Fills a date input with a default a couple of weeks back and limits it.
function setUpDateInput(input, daysBack) {
  const t = today();
  input.max = iso(t);
  input.min = iso(addDays(t, -300));
  if (!input.value) input.value = iso(addDays(t, -daysBack));
}

function clampNumber(input, min, max, fallback) {
  const v = parseInt(input.value, 10);
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
}
