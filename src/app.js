'use strict';
/* ============================================================
   Vokabeltrainer — тренажёр немецких слов (один файл, без сервера)
   ============================================================ */
const DAY = 864e5;
const INTERVALS = [0, 1, 3, 7, 14, 30, 60];      // дни до повторения для коробок 0..6
const LS_KEY = 'vokabeltrainer_v1';
const LETTER = /[A-Za-zÄÖÜäöüß]/;
const SPECIAL = /[ÄÖÜäöüß]/;

/* ---------- состояние и хранилище ---------- */
const defaults = () => ({
  v: 1, progress: {}, extra: [], log: {}, lastExport: 0, gr: {}, gri: {},
  settings: { size: 20, newMax: 8, knownAfter: 3, newOrder: 'fresh', cardDir: 'mixed', tts: true, excl: {} }
});
let storageOK = true;
function loadState() {
  const d = defaults();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const j = JSON.parse(raw);
      return Object.assign(d, j, { settings: Object.assign(d.settings, j.settings || {}) });
    }
  } catch (e) { storageOK = false; }
  return d;
}
let S = loadState();
function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); }
  catch (e) { storageOK = false; }
  if (typeof scheduleFileSave === 'function') scheduleFileSave();
}

/* ---------- словарь ---------- */
let VOCAB = [], BYKEY = new Map();
const keyOf = e => (e.article || '') + '|' + e.lemma.toLowerCase().replace(/·/g, '');
function rebuild() {
  const map = new Map();
  const srcs = [...EMBEDDED, ...S.extra];
  // свежие файлы раньше — важно для порядка «новые слова»
  for (const src of srcs) {
    const r = VocabParser.parseMarkdown(src.text, src.name);
    for (const e of r.entries) {
      const key = keyOf(e);
      if (map.has(key)) {
        const m = map.get(key);
        if (!m.files.includes(src.name)) m.files.push(src.name);
        const a = m.ru.toLowerCase(), b = e.ru.toLowerCase();
        if (!a.includes(b) && !b.includes(a) && m.ru.length < 80) m.ru += '; ' + e.ru;
      } else {
        e.key = key; e.files = [src.name]; map.set(key, e);
      }
    }
  }
  VOCAB = [...map.values()];
  BYKEY = map;
}
const FILES = () => {
  const names = [...EMBEDDED.map(s => s.name), ...S.extra.map(s => s.name)];
  return [...new Set(names)].sort();
};

/* ---------- прогресс ---------- */
const P0 = { box: 0, seen: 0, ok: 0, bad: 0, due: 0, last: 0, hidden: false, streak: 0 };
const getP = k => S.progress[k] || P0;
const setP = k => S.progress[k] || (S.progress[k] = Object.assign({}, P0));
const KN = () => Math.max(2, S.settings.knownAfter || 3);
function status(w) {
  const p = getP(w.key);
  if (p.hidden || p.box >= 5) return 'known';
  if (p.seen === 0 && p.box === 0) return 'new';
  if (p.box >= 3 || (p.streak || 0) >= KN() - 1) return 'familiar';
  return 'learning';
}
const STATUS_RU = { new: 'neu', learning: 'im Lernen', familiar: 'fast sicher', known: 'gelernt' };
function schedule(p, box) {
  p.box = Math.max(0, Math.min(6, box));
  p.due = p.box === 0 ? Date.now() : Date.now() + INTERVALS[p.box] * DAY;
  p.last = Date.now();
}
function today() { return new Date().toISOString().slice(0, 10); }
function logAnswer(ok) {
  const d = today(); const l = S.log[d] || (S.log[d] = { n: 0, ok: 0 });
  l.n++; if (ok) l.ok++;
}
function streak() {
  let n = 0; const d = new Date();
  if (!S.log[d.toISOString().slice(0, 10)]) d.setDate(d.getDate() - 1);
  while (S.log[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function counts(words) {
  const c = { new: 0, learning: 0, familiar: 0, known: 0, due: 0, total: words.length };
  const now = Date.now();
  for (const w of words) {
    const s = status(w); c[s]++;
    const p = getP(w.key);
    if (s !== 'new' && !p.hidden && p.due <= now) c.due++;
  }
  return c;
}

/* ---------- утилиты ---------- */
const $ = s => document.querySelector(s);
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.setAttribute('style', v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of kids.flat(Infinity)) { if (c == null || c === false) continue; el.append(c.nodeType ? c : document.createTextNode(c)); }
  return el;
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const base = w => w.lemma.replace(/·/g, '');
const fullDe = w => (w.article ? w.article + ' ' : '') + w.lemma;
const pluralWord = w => (w.article && w.plural != null && w.plural !== '') ? applyPlural(base(w), w.plural) : null;
function applyPlural(lemma, rule) {
  const um = rule.includes('¨');
  let suffix = rule.replace('¨', '').replace(/^-/, '');
  let s = lemma;
  if (um) {
    const m = [...s.matchAll(/au|[aou]/gi)];
    if (m.length) {
      const l = m[m.length - 1], map = { a: 'ä', o: 'ö', u: 'ü', au: 'äu', A: 'Ä', O: 'Ö', U: 'Ü', Au: 'Äu', AU: 'ÄU' };
      s = s.slice(0, l.index) + (map[l[0]] || l[0]) + s.slice(l.index + l[0].length);
    }
  }
  return s + suffix;
}
function trivialPlural(w) {
  const b = base(w), r = w.plural;
  if (r === '-n' && /e$/.test(b)) return true;
  if (r === '-en' && /(ung|heit|keit|schaft|ion|tät|ur)$/i.test(b)) return true;
  if (r === '-nen' && /in$/.test(b)) return true;
  return false;
}
function plausibleWrong(b, right) {
  const rules = ['-e', '¨-e', '-n', '-en', '-er', '¨-er', '-s', '-', '¨-'];
  const out = [];
  for (const r of shuffle(rules)) {
    const suf = r.replace('¨', '').replace(/^-/, '');
    if (r.includes('¨')) { const lv = (b.match(/[aeiouäöü]/gi) || []).pop(); if (!lv || !/[aou]/i.test(lv)) continue; }  // умлаут только если последняя гласная a/o/u
    if (/e$/i.test(b) && /^e/.test(suf)) continue;            // Lampee
    if (/(er|el|en)$/i.test(b) && /^(e|er|en)$/.test(suf)) continue; // Fensterer
    if (/n$/i.test(b) && suf === 'n') continue;
    if (suf === 'n' && !/([aeiouäöü]|el|er)$/i.test(b)) continue;   // Einfahrtn
    if (suf === 's' && !/[aeiouäöü]$/i.test(b)) continue;              // Bestellnummers
    const x = applyPlural(b, r);
    if (x !== right && x !== b + '' && !out.includes(x)) out.push(x);
    if (out.length === 3) break;
  }
  for (const r of ['-e', '-en', '-s', '-er']) { if (out.length >= 3) break; const x = applyPlural(b, r); if (x !== right && !out.includes(x)) out.push(x); }
  return out;
}
function speakable() { return !!(S.settings.tts && voiceDE); }
let voiceDE = null;
(function initVoice() {
  if (!('speechSynthesis' in window)) return;
  const f = () => { voiceDE = speechSynthesis.getVoices().find(v => /^de/i.test(v.lang)) || null; };
  f(); speechSynthesis.onvoiceschanged = () => { f(); if (SCREEN === 'home') render(); };
})();
function speak(t) {
  if (!voiceDE) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t.replace(/·/g, '').replace(/\s*\/\s*/g, ', '));
  u.lang = 'de-DE'; u.voice = voiceDE; u.rate = .9;
  speechSynthesis.speak(u);
}
function speakBtn(text) {
  return speakable() ? h('button', { class: 'icon', title: 'Anhören', onclick: e => { e.stopPropagation(); speak(text); } }, '🔊') : null;
}
function toast(msg) {
  const t = h('div', { class: 'toast' }, msg);
  document.body.append(t); setTimeout(() => t.remove(), 2600);
}

/* ---------- выбор слов для сессии ---------- */
const activeWords = () => VOCAB.filter(w => !getP(w.key).hidden);
function newOrder(list) {
  const o = S.settings.newOrder;
  if (o === 'random') return shuffle(list);
  const byFile = new Map();
  for (const w of list) { const f = w.files[0]; (byFile.get(f) || byFile.set(f, []).get(f)).push(w); }
  const names = [...byFile.keys()].sort(); if (o === 'fresh') names.reverse();
  return names.flatMap(n => shuffle(byFile.get(n)));
}
function pickWords(mode, size) {
  const now = Date.now(), pool = activeWords();
  const due = [], fresh = [], rest = [];
  for (const w of pool) {
    const p = getP(w.key), st = status(w);
    if (st === 'new') fresh.push(w);
    else if (p.due <= now) due.push(w); else rest.push(w);
  }
  due.sort((a, b) => getP(a.key).due - getP(b.key).due);
  if (mode === 'new') return newOrder(fresh).slice(0, size);
  if (mode === 'weak') {
    return pool.filter(w => { const p = getP(w.key); return p.seen > 0 && (p.box <= 1 || p.bad > p.ok); })
      .sort((a, b) => getP(a.key).box - getP(b.key).box || getP(b.key).bad - getP(a.key).bad).slice(0, size);
  }
  const nNew = Math.min(S.settings.newMax, fresh.length, size);
  const nDue = Math.min(due.length, size - nNew);
  const newList = newOrder(fresh);
  const taken = new Set();
  let out = [];
  const take = list => { for (const w of list) { if (out.length >= size) break; if (!taken.has(w.key)) { taken.add(w.key); out.push(w); } } };
  take(due.slice(0, nDue));                       // 1) пора повторять (в т.ч. прошлые ошибки)
  take(newList.slice(0, nNew));                   // 2) порция new слов
  const fresh12h = now - 12 * 3600 * 1000;
  const restOld = rest.filter(w => getP(w.key).last < fresh12h)
    .sort((a, b) => getP(a.key).box - getP(b.key).box || getP(a.key).last - getP(b.key).last);
  take(restOld);                                  // 3) слова из прошлых дней, ещё не выученные
  take(newList);                                  // 4) если всё ещё мало — ещё новые слова
  take(rest.slice().sort((a, b) => getP(a.key).box - getP(b.key).box || getP(a.key).last - getP(b.key).last)); // 5) крайний случай
  return shuffle(out);
}

/* ---------- навигация ---------- */
let SCREEN = 'home', KEYS = null, SES = null;
function go(screen) { SCREEN = screen; KEYS = null; window.scrollTo(0, 0); render(); }
document.addEventListener('keydown', e => { if (KEYS && !e.ctrlKey && !e.metaKey && !e.altKey) KEYS(e); });
function render() {
  const app = $('#app'); app.replaceChildren();
  const fn = { home: viewHome, dict: viewDict, settings: viewSettings, summary: viewSummary, ex: viewExercise, gex: viewGEx, gsum: viewGSum, gtopic: viewGTopic }[SCREEN];
  app.append(fn());
}
function topbar(title, back) {
  return h('div', { class: 'top' },
    back ? h('button', { class: 'icon', onclick: back, 'aria-label': 'Zurück' }, '←') : null,
    h('div', { class: 'title' }, title));
}
function bar(v, total, cls) {
  return h('div', { class: 'bar ' + (cls || '') }, h('div', { style: `width:${total ? Math.round(100 * v / total) : 0}%` }));
}

/* ============================ ГЛАВНАЯ ============================ */
function viewHome() {
  const all = VOCAB, c = counts(all), act = counts(activeWords());
  const learned = c.known;
  const pct = c.total ? Math.round(100 * learned / c.total) : 0;
  const sn = streak();
  const root = h('div', { class: 'wrap' });
  root.append(
    h('div', { class: 'top' }, h('div', { class: 'title big' }, 'Vokabeltrainer'),
      h('div', { class: 'sub' }, sn ? `🔥 ${sn}-Tage-Serie` : '')),
    h('div', { class: 'card hero' },
      h('div', { class: 'row between' }, h('div', { class: 'h2' }, `Gelernt: ${learned} von ${c.total}`), h('div', { class: 'pct' }, pct + '%')),
      bar(learned, c.total, 'big'),
      h('div', { class: 'stats' },
        stat(c.new, 'neu', 'new'), stat(c.learning, 'im Lernen', 'learning'),
        stat(c.familiar, 'fast sicher', 'familiar'), stat(c.known, 'gelernt', 'known')),
      h('div', { class: 'muted' }, act.due ? `Zur Wiederholung fällig: ${act.due}` : 'Nichts zu wiederholen — Zeit für neue Wörter'),
      h('div', { class: 'muted small' }, `Ein Wort gilt als gelernt, wenn du es ${KN()}-mal hintereinander richtig beantwortest, in verschiedenen Übungsrunden (ohne Tipp). Danach rutscht es ans Ende der Warteschlange und kommt etwa einmal im Monat wieder. Ein Fehler schickt es zurück ins Lernen.`)),
    h('div', { class: 'card' },
      h('div', { class: 'h2' }, 'Was möchtest du tun?'),
      h('button', { class: 'btn primary', onclick: () => startSession('smart', 'ex') }, `▶ Üben (${S.settings.size} Wörter)`),
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn', onclick: () => startSession('weak', 'ex') }, '🎯 Schwache Wörter'),
        h('button', { class: 'btn', onclick: () => startSession('new', 'ex') }, '✨ Nur neue Wörter')),
      h('div', { class: 'muted small' }, h('b', null, 'Üben'), ' — wählt, was zur Wiederholung ansteht, und fügt ein paar neue Wörter hinzu. ',
        h('b', null, 'Schwache Wörter'), ' — nur Wörter, die du schon probiert hast, aber noch verwechselst: kürzlich falsch oder öfter falsch als richtig. ',
        h('b', null, 'Nur neue Wörter'), ' — Wörter, die du noch nie gesehen hast.')),
    grammarCard(),
    h('div', { class: 'nav' },
      h('button', { class: 'btn', onclick: () => go('dict') }, '📖 Wörterbuch'),
      h('button', { class: 'btn', onclick: () => go('settings') }, '⚙ Einstellungen & Daten')),
    ...[!storageOK ? h('div', { class: 'warn' }, 'Der Browser speichert den Fortschritt nicht (privater Modus?). Nutze den Export in den Einstellungen.') : null,
    FSA.status === 'needs' ? h('div', { class: 'warn' }, 'Speichern in Datei pausiert: ', h('button', { class: 'link', onclick: fileResume }, 'erlauben und weiter')) : null,
    FSA.status === 'ok' ? h('div', { class: 'muted small', style: 'text-align:center' }, '💾 Automatisch in Datei speichern: ' + FSA.name) : null,
    (!S.lastExport && FSA.status === 'none' && Object.keys(S.progress).length > 40) ? h('div', { class: 'warn' }, 'Der Fortschritt wird nur in diesem Browser gespeichert. Aktiviere in den Einstellungen das automatische Speichern in eine Datei.') : null
    ].filter(Boolean)
  );
  return root;
}
const stat = (n, label, cls) => h('div', { class: 'stat ' + cls }, h('div', { class: 'n' }, n), h('div', { class: 'l' }, label));

/* ============================ СЕССИЯ ============================ */
function startSession(mode, kind, words) {
  const ws = words || pickWords(mode, S.settings.size);
  if (!ws.length) {
    toast(mode === 'weak' ? 'Noch keine schwachen Wörter 👍' : mode === 'new' ? 'Keine neuen Wörter mehr' : 'Keine Wörter verfügbar — füge in den Einstellungen Vokabeldateien hinzu');
    return;
  }
  SES = { kind, mode, words: ws, queue: ws.map(w => ({ w, tries: 0 })), total: ws.length, done: 0, firstOk: 0, missed: new Map(), lastType: null, known: 0 };
  go(kind);
}
function gradeWord(item, ok, opts = {}) {      // упражнение: запись прогресса по первой попытке
  if (item.tries > 0) return;
  const p = setP(item.w.key);
  p.seen++; logAnswer(ok && !opts.hinted);
  if (ok && !opts.hinted) {
    p.ok++; p.streak = (p.streak || 0) + 1; SES.firstOk++;
    const N = KN();
    // N верных подряд => слово выучено и уходит в конец очереди (повтор раз в месяц и реже)
    schedule(p, p.streak >= N ? Math.max(p.box + 1, 5) : Math.max(p.box, Math.min(p.streak, N - 1)));
  }
  else if (opts.hinted && ok) { schedule(p, p.box); }
  else { p.bad++; p.streak = 0; schedule(p, p.box <= 2 ? 0 : p.box - 2); SES.missed.set(item.w.key, item.w); }
  save();
}
function advance(ok) {
  const item = SES.queue[0];
  item.tries++;
  if (ok || item.tries >= 3) { SES.queue.shift(); SES.done++; }
  else { SES.queue.shift(); SES.queue.splice(Math.min(3, SES.queue.length), 0, item); }
  if (!SES.queue.length) { go('summary'); return; }
  render();
}
function sessionHeader(title) {
  return h('div', null,
    h('div', { class: 'top' },
      h('button', { class: 'icon', onclick: () => { if (SES.done === 0 || confirm('Runde beenden? Dein Fortschritt ist schon gespeichert.')) go(SES.done ? 'summary' : 'home'); }, 'aria-label': 'Schließen' }, '✕'),
      h('div', { class: 'title' }, title),
      h('div', { class: 'sub' }, `${SES.done}/${SES.total}`)),
    bar(SES.done, SES.total));
}

/* ---------- выбор типа упражнения ---------- */
const TIER = { mc_de_ru: 1, mc_ru_de: 1, article: 1, listen: 1, plural: 2, verbforms: 2, scramble: 2, gap: 2, type: 3, order: 3 };
function applicable(w) {
  const t = [];
  if (w.phrase) return ['mc_de_ru', 'order', 'order'];
  const b = base(w);
  t.push('mc_de_ru', 'mc_ru_de');
  if (w.article) t.push('article');
  if (w.article && pluralWord(w) && pluralWord(w) !== b && !trivialPlural(w)) t.push('plural');
  if (w.pos === 'verb' && /^(hat|ist)\s+\S+$/.test(w.forms[w.forms.length - 1])) t.push('verbforms');
  const letters = b.replace(/[^A-Za-zÄÖÜäöüß]/g, '').length;
  if (w.typable && letters >= 3) {
    if (!/\s/.test(b) && b.length <= 14) t.push('scramble');
    if (!/\s/.test(b) && b.length <= 18 && letters >= 4) t.push('gap');
    t.push('type');
  }
  if (speakable()) t.push('listen');
  return t;
}
function chooseType(item) {
  const w = item.w, p = getP(w.key);
  const tier = item.tries > 0 ? 1 : (p.seen === 0 ? 1 : p.box <= 1 ? 1.6 : p.box <= 3 ? 2.3 : 3);
  const opts = applicable(w).filter(t => t !== SES.lastType);
  const pool = opts.length ? opts : applicable(w);
  const weights = pool.map(t => Math.exp(-Math.abs(TIER[t] - tier) * 1.4));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) return pool[i]; }
  return pool[0];
}

/* ---------- общий каркас упражнения ---------- */
function viewExercise() {
  const item = SES.queue[0], w = item.w;
  if (!item.type) item.type = chooseType(item);
  SES.lastType = item.type;
  const root = h('div', { class: 'wrap' });
  root.append(sessionHeader('Üben'));
  const card = h('div', { class: 'card ex' });
  const fb = h('div', { class: 'fb', hidden: true });
  const state = { answered: false };
  const ctx = {
    item, w, card, fb,
    finish(ok, opts = {}) {
      if (state.answered) return; state.answered = true; KEYS = null;
      gradeWord(item, ok, opts);
      showFeedback(fb, w, ok, opts, () => { item.type = null; advance(ok); });
      fb.hidden = false;
      fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };
  root.append(card, fb);
  root.append(h('div', { class: 'skip' },
    h('button', { class: 'link', onclick: () => { hideForever(w); item.tries = 99; SES.queue.shift(); SES.done++; if (!SES.queue.length) go('summary'); else { item.type = null; render(); } } }, 'Ich kenne das Wort — nicht mehr anzeigen')));
  RENDERERS[item.type](ctx);
  return root;
}
function hideForever(w) { const p = setP(w.key); p.hidden = true; p.seen = Math.max(1, p.seen); p.last = Date.now(); save(); SES.known++; }
function showFeedback(fb, w, ok, opts, next) {
  fb.className = 'fb ' + (ok ? 'ok' : 'bad');
  const extra = [];
  if (w.plural != null && w.plural !== '' && w.article) extra.push('Plural: die ' + pluralWord(w));
  if (w.sg) extra.push('nur Singular');
  if (w.forms) extra.push(w.forms.join(', '));
  if (w.note) extra.push('(' + w.note + ')');
  const nextBtn = h('button', { class: 'btn primary', id: 'nextBtn', onclick: next }, 'Weiter →');
  fb.replaceChildren(...[
    h('div', { class: 'fbhead' }, ok ? (opts.hinted ? '✓ Richtig (mit Tipp)' : '✓ Richtig!') : '✗ Falsch'),
    h('div', { class: 'ans' }, fullDe(w), ' ', speakBtn(fullDe(w))),
    h('div', { class: 'ru' }, w.ru),
    extra.length ? h('div', { class: 'muted' }, extra.join(' · ')) : null,
    h('div', { class: 'btnrow' },
      nextBtn,
      ok ? h('button', { class: 'btn small', onclick: () => { const p = setP(w.key); p.streak = Math.max(p.streak || 0, KN() - 1); schedule(p, p.box + 2); save(); toast('Wird seltener gezeigt'); } }, 'Kenne ich — seltener zeigen') : null)
  ].filter(Boolean));
  KEYS = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } };
  nextBtn.focus({ preventScroll: true });
}
function lemmaHint(w) {
  const bits = [];
  if (w.article) bits.push('Nomen');
  else if (w.pos === 'verb') bits.push('Verb');
  return bits.join(' · ');
}

/* ---------- варианты ответа (общая функция) ---------- */
function distractors(w, getText, n = 3) {
  const same = VOCAB.filter(x => x.key !== w.key && !!x.article === !!w.article && !x.phrase === !w.phrase);
  const topic = same.filter(x => x.files[0] === w.files[0]);
  const cand = shuffle(topic).concat(shuffle(same));
  const out = [], seen = new Set([getText(w).toLowerCase()]);
  for (const x of cand) {
    const t = getText(x), k = t.toLowerCase();
    if (seen.has(k) || t.length > 70) continue;
    seen.add(k); out.push(t);
    if (out.length === n) break;
  }
  return out;
}
function choiceUI(ctx, { prompt, sub, options, correct, onAfter, speak }) {
  const { card } = ctx;
  const btns = [];
  const opts = shuffle(options);
  const pickIt = (i, ev) => {
    if (btns[0].disabled) return;
    const ok = opts[i] === correct;
    btns.forEach((b, j) => { b.disabled = true; if (opts[j] === correct) b.classList.add('right'); });
    if (!ok) btns[i].classList.add('wrong');
    if (onAfter) onAfter();
    ctx.finish(ok);
  };
  card.append(h('div', { class: 'tag' }, sub || ''), prompt, h('div', { class: 'opts' },
    opts.map((o, i) => { const b = h('button', { class: 'opt', onclick: ev => pickIt(i, ev) }, h('span', { class: 'k' }, i + 1), h('span', null, o)); btns.push(b); return b; })));
  KEYS = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= opts.length) pickIt(n - 1); };
  if (speak) speak();
}
const bigWord = (w, text) => h('div', { class: 'big-word' }, text || fullDe(w), ' ', speakBtn(base(w)));

/* ---------- упражнения ---------- */
const RENDERERS = {
  mc_de_ru(ctx) {
    const { w } = ctx;
    choiceUI(ctx, {
      sub: 'Übersetzung wählen', prompt: w.phrase ? h('div', { class: 'big-word sentence' }, w.lemma, ' ', speakBtn(w.lemma)) : bigWord(w),
      options: [w.ru, ...distractors(w, x => x.ru)], correct: w.ru
    });
  },
  mc_ru_de(ctx) {
    const { w } = ctx;
    choiceUI(ctx, {
      sub: 'Wie sagt man das auf Deutsch?', prompt: h('div', { class: 'big-word' }, w.ru),
      options: [fullDe(w), ...distractors(w, fullDe)], correct: fullDe(w)
    });
  },
  listen(ctx) {
    const { w } = ctx;
    choiceUI(ctx, {
      sub: 'Hören und Übersetzung wählen',
      prompt: h('div', { class: 'big-word' }, h('button', { class: 'btn bigspeak', onclick: () => speak(base(w)) }, '🔊 Anhören')),
      options: [w.ru, ...distractors(w, x => x.ru)], correct: w.ru, speak: () => setTimeout(() => speak(base(w)), 150)
    });
  },
  article(ctx) {
    const { w } = ctx;
    choiceUI(ctx, {
      sub: 'Welcher Artikel?', prompt: h('div', { class: 'big-word' }, '___ ', w.lemma, h('div', { class: 'ru-sub' }, w.ru)),
      options: ['der', 'die', 'das'], correct: w.article
    });
  },
  plural(ctx) {
    const { w } = ctx, b = base(w), right = pluralWord(w);
    const wrong = plausibleWrong(b, right).slice(0, 3);
    choiceUI(ctx, {
      sub: 'Plural wählen', prompt: h('div', { class: 'big-word' }, fullDe(w), h('div', { class: 'ru-sub' }, w.ru)),
      options: ['die ' + right, ...wrong.map(x => 'die ' + x)], correct: 'die ' + right
    });
  },
  verbforms(ctx) {
    const { w } = ctx, right = w.forms[w.forms.length - 1];
    const others = shuffle(VOCAB.filter(x => x.forms && x.key !== w.key && x.forms[x.forms.length - 1] !== right)).map(x => x.forms[x.forms.length - 1]);
    const wrong = [...new Set(others)].slice(0, 3);
    choiceUI(ctx, {
      sub: 'Partizip II (Perfekt)', prompt: h('div', { class: 'big-word' }, w.lemma, h('div', { class: 'ru-sub' }, w.ru)),
      options: [right, ...wrong], correct: right
    });
  },

  scramble(ctx) {
    const { w, card } = ctx, b = base(w);
    const chars = [...b].map((c, i) => ({ c, id: i }));
    let bank = shuffle(chars); if (b.length > 3) { let t = 0; while (bank.map(x => x.c).join('') === b && t++ < 9) bank = shuffle(chars); }
    let built = [], hinted = false;
    const area = h('div', { class: 'slots' }), bankEl = h('div', { class: 'tiles' }), msg = h('div', { class: 'muted' });
    const checkBtn = h('button', { class: 'btn primary', onclick: check }, 'Prüfen');
    function draw() {
      area.replaceChildren(...built.map((t, i) => h('button', { class: 'tile in', onclick: () => { built.splice(i, 1); bank.push(t); draw(); } }, t.c)),
        ...Array.from({ length: bank.length }, () => h('span', { class: 'tile empty' })));
      bankEl.replaceChildren(...bank.map(t => h('button', { class: 'tile', onclick: () => { bank.splice(bank.indexOf(t), 1); built.push(t); draw(); } }, t.c)));
      checkBtn.disabled = bank.length > 0;
    }
    function check() {
      const ok = built.map(t => t.c).join('').toLowerCase() === b.toLowerCase();
      area.classList.add(ok ? 'good' : 'bad'); lock(); ctx.finish(ok, { hinted });
    }
    function lock() { card.querySelectorAll('button').forEach(x => x.disabled = true); }
    // подсказка: подставляет следующую верную букву
    function hint2() {
      hinted = true;
      let i = 0; while (i < built.length && built[i].c === b[i]) i++;
      if (i < built.length) { bank = bank.concat(built.splice(i)); }
      const t = bank.find(x => x.c === b[i]); if (!t) return;
      bank.splice(bank.indexOf(t), 1); built.push(t); draw();
    }
    card.append(h('div', { class: 'tag' }, 'Wort aus Buchstaben bauen'), h('div', { class: 'big-word' }, w.ru, h('div', { class: 'ru-sub' }, lemmaHint(w))),
      area, bankEl, h('div', { class: 'btnrow' }, checkBtn,
        h('button', { class: 'btn', onclick: () => { bank = bank.concat(built); built = []; draw(); } }, 'Zurücksetzen'),
        h('button', { class: 'btn', onclick: hint2 }, '💡 Tipp')), msg);
    draw();
  },

  gap(ctx) {
    const { w, card } = ctx, b = base(w), chars = [...b];
    const idx = chars.map((c, i) => LETTER.test(c) ? i : -1).filter(i => i >= 0);
    const k = Math.max(2, Math.min(5, Math.round(idx.length * .4)));
    const sp = idx.filter(i => SPECIAL.test(chars[i]));
    const others = shuffle(idx.filter(i => !SPECIAL.test(chars[i]) && i !== 0));
    const blanks = [...sp.slice(0, k), ...others].slice(0, Math.max(k, Math.min(sp.length, 6))).sort((a, c) => a - c);
    const need = blanks.map(i => chars[i]);
    const pool = ['a', 'e', 'i', 'o', 'u', 'n', 'r', 's', 't', 'h', 'l', 'd', 'c', 'm', 'g', 'b', 'k', 'f', 'w', 'z'];
    const extras = shuffle(pool.filter(x => !need.map(y => y.toLowerCase()).includes(x))).slice(0, 3);
    if (!sp.length && Math.random() < .5) extras[0] = pick(['ä', 'ö', 'ü', 'ß']);
    if (sp.length) { const miss = ['ä', 'ö', 'ü', 'ß'].filter(x => !need.includes(x)); extras[0] = pick(miss); }
    let bank = shuffle(need.map((c, i) => ({ c: c.toLowerCase(), id: 'n' + i })).concat(extras.map((c, i) => ({ c, id: 'x' + i }))));
    const fill = new Array(blanks.length).fill(null); let hinted = false;
    const wordEl = h('div', { class: 'gapword' }), bankEl = h('div', { class: 'tiles' });
    const checkBtn = h('button', { class: 'btn primary', onclick: check }, 'Prüfen');
    function draw() {
      let bi = 0;
      wordEl.replaceChildren(...chars.map((c, i) => {
        const j = blanks.indexOf(i);
        if (j < 0) return h('span', { class: 'gl' }, c);
        const f = fill[j];
        return h('button', { class: 'tile slot ' + (f ? 'in' : 'empty'), onclick: () => { if (fill[j]) { bank.push(fill[j]); fill[j] = null; draw(); } } }, f ? f.c : '');
      }));
      bankEl.replaceChildren(...bank.map(t => h('button', { class: 'tile', onclick: () => { const j = fill.indexOf(null); if (j < 0) return; fill[j] = t; bank.splice(bank.indexOf(t), 1); draw(); } }, t.c)));
      checkBtn.disabled = fill.includes(null);
    }
    function check() {
      const ok = fill.every((f, j) => f.c.toLowerCase() === need[j].toLowerCase());
      wordEl.classList.add(ok ? 'good' : 'bad');
      card.querySelectorAll('button').forEach(x => x.disabled = true);
      ctx.finish(ok, { hinted });
    }
    function hint() {
      hinted = true;
      for (let j = 0; j < blanks.length; j++) {
        if (!fill[j] || fill[j].c.toLowerCase() !== need[j].toLowerCase()) {
          if (fill[j]) { bank.push(fill[j]); fill[j] = null; }
          const t = bank.find(x => x.c === need[j].toLowerCase()); if (!t) return;
          bank.splice(bank.indexOf(t), 1); fill[j] = t; break;
        }
      }
      draw();
    }
    card.append(h('div', { class: 'tag' }, 'Fehlende Buchstaben ergänzen'), h('div', { class: 'big-word' }, w.ru, h('div', { class: 'ru-sub' }, lemmaHint(w))),
      wordEl, bankEl, h('div', { class: 'btnrow' }, checkBtn, h('button', { class: 'btn', onclick: hint }, '💡 Tipp')));
    draw();
  },

  type(ctx) {
    const { w, card } = ctx, b = base(w);
    let buf = '', hinted = false;
    const out = h('div', { class: 'typed' }), msg = h('div', { class: 'muted small' }, 'ä = ae oder a: · ö = oe oder o: · ü = ue oder u: · ß = ss');
    const checkBtn = h('button', { class: 'btn primary', onclick: check }, 'Prüfen');
    const norm = VocabParser.normAnswer;
    function draw() { out.textContent = buf; out.append(h('span', { class: 'caret' })); }
    function add(c) { buf += c; draw(); }
    function back() { buf = buf.slice(0, -1); draw(); }
    function check() {
      if (!buf.trim()) return;
      const u = norm(buf);
      const ok = u === norm(b) || (w.article && u === norm(w.article + b));
      out.classList.add(ok ? 'good' : 'bad'); KEYS = null;
      card.querySelectorAll('button').forEach(x => x.disabled = true);
      ctx.finish(ok, { hinted });
    }
    function hint() {
      hinted = true;
      let i = 0; const nb = b.toLowerCase();
      while (i < buf.length && i < nb.length && buf[i].toLowerCase() === nb[i]) i++;
      buf = b.slice(0, i + 1); draw();
    }
    const rows = [['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'], ['y', 'x', 'c', 'v', 'b', 'n', 'm', 'ß', '⌫']];
    const kb = h('div', { class: 'kb' }, rows.map(r => h('div', { class: 'kbrow' }, r.map(k =>
      h('button', { class: 'key' + (/[äöüß]/.test(k) ? ' sp' : '') + (k === '⌫' ? ' wide' : ''), onclick: () => k === '⌫' ? back() : add(k) }, k)))),
      h('div', { class: 'kbrow' }, h('button', { class: 'key spaceKey', onclick: () => add(' ') }, 'Leertaste')));
    card.append(h('div', { class: 'tag' }, 'Auf Deutsch schreiben'), h('div', { class: 'big-word' }, w.ru, h('div', { class: 'ru-sub' }, lemmaHint(w))),
      out, kb, h('div', { class: 'btnrow' }, checkBtn, h('button', { class: 'btn', onclick: hint }, '💡 Tipp')), msg);
    draw();
    KEYS = e => {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
      else if (e.key === 'Backspace') { e.preventDefault(); back(); }
      else if (e.key.length === 1) { e.preventDefault(); add(e.key); }
    };
  },

  order(ctx) {
    const { w, card } = ctx;
    const toks = w.lemma.split(/\s+/).map((c, i) => ({ c, id: i }));
    let bank = shuffle(toks); let t = 0;
    while (bank.map(x => x.c).join(' ') === w.lemma && t++ < 9) bank = shuffle(toks);
    let built = [], hinted = false;
    const area = h('div', { class: 'words' }), bankEl = h('div', { class: 'tiles words' });
    const checkBtn = h('button', { class: 'btn primary', onclick: check }, 'Prüfen');
    function draw() {
      area.replaceChildren(...built.map((x, i) => h('button', { class: 'tile wide in', onclick: () => { built.splice(i, 1); bank.push(x); draw(); } }, x.c)));
      if (!built.length) area.append(h('span', { class: 'muted' }, 'Wörter der Reihe nach antippen'));
      bankEl.replaceChildren(...bank.map(x => h('button', { class: 'tile wide', onclick: () => { bank.splice(bank.indexOf(x), 1); built.push(x); draw(); } }, x.c)));
      checkBtn.disabled = bank.length > 0;
    }
    function check() {
      const ok = built.map(x => x.c).join(' ').toLowerCase() === w.lemma.toLowerCase();
      area.classList.add(ok ? 'good' : 'bad');
      card.querySelectorAll('button').forEach(x => x.disabled = true);
      ctx.finish(ok, { hinted });
    }
    function hint() {
      hinted = true;
      const correct = w.lemma.split(/\s+/);
      let i = 0; while (i < built.length && built[i].c === correct[i]) i++;
      if (i < built.length) bank = bank.concat(built.splice(i));
      const x = bank.find(y => y.c === correct[i]); if (!x) return;
      bank.splice(bank.indexOf(x), 1); built.push(x); draw();
    }
    card.append(h('div', { class: 'tag' }, 'Satz bilden'), h('div', { class: 'big-word sentence' }, w.ru),
      area, bankEl, h('div', { class: 'btnrow' }, checkBtn,
        h('button', { class: 'btn', onclick: () => { bank = bank.concat(built); built = []; draw(); } }, 'Zurücksetzen'),
        h('button', { class: 'btn', onclick: hint }, '💡 Tipp')));
    draw();
  }
};

/* ============================ ИТОГИ ============================ */
function viewSummary() {
  const r = h('div', { class: 'wrap' });
  const total = SES.total, ok = SES.firstOk, missed = [...SES.missed.values()];
  r.append(
    h('div', { class: 'top' }, h('div', { class: 'title big' }, 'Fertig!')),
    h('div', { class: 'card hero' },
      h('div', { class: 'h2' }, `Beim ersten Versuch richtig: ${ok} von ${total}`),
      bar(ok, total, 'big'),
      SES.known ? h('div', { class: 'muted' }, `Aus dem Üben genommen: ${SES.known}`) : null),
    missed.length ? h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Wörter zum Nacharbeiten'),
      missed.map(w => h('div', { class: 'miss' }, h('b', null, fullDe(w)), ' — ', w.ru))) : h('div', { class: 'card' }, '🎉 Keine Fehler!'),
    h('div', { class: 'card' },
      missed.length ? h('button', { class: 'btn primary', onclick: () => startSession('x', 'ex', missed) }, '🔁 Fehler noch einmal üben') : null,
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn', onclick: () => startSession(SES.mode === 'x' ? 'smart' : SES.mode, 'ex') }, '▶ Noch eine Runde'),
        h('button', { class: 'btn', onclick: () => go('home') }, 'Startseite'))));
  return r;
}

/* ============================ СЛОВАРЬ ============================ */
let DICT = { q: '', st: 'all', file: 'all', limit: 100 };
function viewDict() {
  const root = h('div', { class: 'wrap' });
  root.append(topbar('Wörterbuch', () => go('home')));
  const q = DICT.q.trim().toLowerCase();
  let list = VOCAB.filter(w => {
    if (DICT.file !== 'all' && !w.files.includes(DICT.file)) return false;
    const st = getP(w.key).hidden ? 'hidden' : status(w);
    if (DICT.st !== 'all' && st !== DICT.st) return false;
    if (q && !(w.lemma.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q))) return false;
    return true;
  });
  const search = h('input', { type: 'search', class: 'inp', placeholder: 'Suche nach Wort oder Übersetzung', value: DICT.q,
    oninput: e => { DICT.q = e.target.value; DICT.limit = 100; clearTimeout(search._t); search._t = setTimeout(() => { render(); const i = $('.inp'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); } });
  const sel = (opts, key) => h('select', { class: 'inp', onchange: e => { DICT[key] = e.target.value; DICT.limit = 100; render(); } },
    opts.map(([v, l]) => h('option', { value: v, selected: DICT[key] === v || null }, l)));
  root.append(h('div', { class: 'card' }, search,
    h('div', { class: 'row gap' },
      sel([['all', 'Alle Status'], ['new', 'Neu'], ['learning', 'Im Lernen'], ['familiar', 'Fast sicher'], ['known', 'Gelernt'], ['hidden', 'Ausgeblendet']], 'st'),
      sel([['all', 'Alle Dateien'], ...FILES().slice().reverse().map(f => [f, f])], 'file')),
    h('div', { class: 'row between' }, h('div', { class: 'muted' }, `Gefunden: ${list.length}`),
      h('div', { class: 'row gap' },
        bulk('Alle → gelernt', list, w => { const p = setP(w.key); p.hidden = false; p.seen = Math.max(1, p.seen); p.streak = KN(); schedule(p, 5); }),
        bulk('Alle → zurücksetzen', list, w => { delete S.progress[w.key]; }),
        bulk('Alle → ausblenden', list, w => { const p = setP(w.key); p.hidden = true; p.seen = Math.max(1, p.seen); })))));
  const box = h('div', { class: 'card list' });
  for (const w of list.slice(0, DICT.limit)) {
    const p = getP(w.key), st = p.hidden ? 'hidden' : status(w);
    const pl = (w.plural != null && w.plural !== '' && w.article) ? `, Pl.: ${pluralWord(w)}` : '';
    box.append(h('div', { class: 'item' },
      h('div', { class: 'itext' },
        h('div', { class: 'iw' }, fullDe(w), h('span', { class: 'ipl' }, pl), ' ', speakBtn(base(w))),
        h('div', { class: 'ir' }, w.ru), h('div', { class: 'muted small' }, (st === 'known' || st === 'hidden' || st === 'new' ? '' : `richtig in Folge: ${p.streak || 0} von ${KN()} · `) + w.files.join(', ') + (w.forms ? ' · ' + w.forms.join(', ') : ''))),
      h('div', { class: 'iact' },
        h('span', { class: 'chip ' + st }, st === 'hidden' ? 'ausgeblendet' : STATUS_RU[st]),
        h('button', { class: 'mini', title: 'Known', onclick: () => { const q2 = setP(w.key); q2.hidden = false; q2.seen = Math.max(1, q2.seen); q2.streak = KN(); schedule(q2, 5); save(); render(); } }, '✓'),
        h('button', { class: 'mini', title: 'Neu lernen', onclick: () => { delete S.progress[w.key]; save(); render(); } }, '↺'),
        h('button', { class: 'mini', title: p.hidden ? 'Zurück ins Üben' : 'Vom Üben ausschließen', onclick: () => { const q2 = setP(w.key); q2.hidden = !q2.hidden; if (q2.hidden) q2.seen = Math.max(1, q2.seen); save(); render(); } }, p.hidden ? '👁' : '⊘'))));
  }
  if (list.length > DICT.limit) box.append(h('button', { class: 'btn', onclick: () => { DICT.limit += 200; render(); } }, `Mehr anzeigen (${list.length - DICT.limit})`));
  root.append(box);
  return root;
}
function bulk(label, list, fn) {
  return h('button', { class: 'link', onclick: () => {
    if (!list.length) return;
    if (!confirm(`${label}: ${list.length} Wörter. Fortfahren?`)) return;
    list.forEach(fn); save(); render();
  } }, label);
}

/* ============================ НАСТРОЙКИ ============================ */
function viewSettings() {
  const root = h('div', { class: 'wrap' });
  root.append(topbar('Einstellungen & Daten', () => go('home')));
  const set = (k, conv = x => x) => e => { S.settings[k] = conv(e.target.type === 'checkbox' ? e.target.checked : e.target.value); save(); };
  const select = (k, opts, conv) => h('select', { class: 'inp', onchange: set(k, conv) }, opts.map(([v, l]) => h('option', { value: v, selected: String(S.settings[k]) === String(v) || null }, l)));
  root.append(
    h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Üben'),
      field('Wörter pro Runde', select('size', [10, 15, 20, 30, 50].map(n => [n, n]), Number)),
      field('Neue Wörter pro Runde (max.)', select('newMax', [0, 3, 5, 8, 12, 20].map(n => [n, n]), Number)),
      field('Richtige Antworten in Folge, bis ein Wort als gelernt gilt', select('knownAfter', [2, 3, 4, 5].map(n => [n, n]), Number)),
      field('Welche neuen Wörter zuerst', select('newOrder', [['fresh', 'aus den neuesten Dateien'], ['old', 'aus den ältesten Dateien'], ['random', 'zufällig']])),
      voiceDE ? h('label', { class: 'field' }, h('span', null, 'Sprachausgabe für deutsche Wörter'), h('input', { type: 'checkbox', checked: S.settings.tts || null, onchange: set('tts') })) : h('div', { class: 'muted small' }, 'Keine deutsche Stimme in diesem Browser gefunden — Sprachausgabe aus.')),
    h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Vokabeldateien'),
      h('div', { class: 'muted small' }, `Eingebaute Dateien: ${EMBEDDED.length}. Manuell hinzugefügt: ${S.extra.length}. Einzigartige Wörter: ${VOCAB.length}.`),
      h('div', { class: 'muted small' }, 'Neue Liste nach den Hausaufgaben: „Dateien hinzufügen“ klicken und die .md aus dem Ordner Vocab wählen. Doppelte Wörter werden zusammengeführt, der Fortschritt bleibt erhalten.'),
      h('input', { type: 'file', id: 'mdfiles', accept: '.md,.txt,text/markdown,text/plain', multiple: true, hidden: true, onchange: addFiles }),
      h('button', { class: 'btn', onclick: () => $('#mdfiles').click() }, '＋ Vokabeldateien hinzufügen (.md)'),
      S.extra.length ? S.extra.map(f => h('div', { class: 'row between' }, h('span', null, f.name), h('button', { class: 'link', onclick: () => { S.extra = S.extra.filter(x => x !== f); save(); rebuild(); render(); } }, 'entfernen'))) : null),
    autosaveCard(),
    h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Fortschritt: Sicherung und Übertragung'),
      h('div', { class: 'muted small' }, 'Der Fortschritt wird im Browser gespeichert. Zum Übertragen aufs Handy oder als Sicherung: in eine Datei exportieren und auf dem anderen Gerät importieren.' + (S.lastExport ? ` Letzter Export: ${new Date(S.lastExport).toLocaleDateString('de')}.` : '')),
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn', onclick: exportData }, '⬇ Fortschritt exportieren'),
        h('button', { class: 'btn', onclick: () => $('#impfile').click() }, '⬆ Importieren (zusammenführen)'),
        h('input', { type: 'file', id: 'impfile', accept: '.json,application/json', hidden: true, onchange: importData })),
      h('div', { class: 'muted small' }, 'Wenn der Download nicht funktioniert (z. B. im Chat oder auf dem Handy), nutze den Textcode:'),
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn', onclick: () => codeDialog(false) }, '📋 Fortschrittscode anzeigen'),
        h('button', { class: 'btn', onclick: () => codeDialog(true) }, '📥 Code einfügen')),
      h('button', { class: 'link danger', onclick: () => { if (confirm('Gesamten Fortschritt löschen? Das kann nicht rückgängig gemacht werden.')) { S.progress = {}; S.log = {}; save(); toast('Fortschritt zurückgesetzt'); render(); } } }, 'Gesamten Fortschritt zurücksetzen')),
    h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Umlaute eingeben'),
      h('div', null, 'Die Übungen haben eine Bildschirmtastatur mit ä ö ü ß. Mit der normalen Tastatur kannst du ae / a: für ä, oe / o: für ö, ue / u: für ü und ss für ß schreiben — das wird ebenfalls als richtig gewertet.')));
  return root;
}
const field = (label, input) => h('label', { class: 'field' }, h('span', null, label), input);
async function addFiles(e) {
  const files = [...e.target.files]; let added = 0;
  for (const f of files) {
    const text = await f.text(); const name = f.name.replace(/\.(md|txt)$/i, '').replace(/ Vocab Julia$/i, '');
    const emb = EMBEDDED.find(x => x.name === name);
    if (emb && emb.text === text) continue;
    S.extra = S.extra.filter(x => x.name !== name); S.extra.push({ name, text }); added++;
  }
  save(); rebuild(); toast(added ? `Dateien hinzugefügt: ${added}` : 'Diese Dateien sind schon vorhanden'); render();
}
function exportData() {
  S.lastExport = Date.now(); save();
  const blob = new Blob([JSON.stringify({ app: 'vokabeltrainer', v: 1, exported: new Date().toISOString(), state: S }, null, 1)], { type: 'application/json' });
  const a = h('a', { href: URL.createObjectURL(blob), download: `vokabeltrainer-progress-${today()}.json` });
  document.body.append(a); a.click(); a.remove(); render();
}
async function importData(e) {
  const f = e.target.files[0]; if (!f) return;
  importText(await f.text());
}
function mergeState(j) {
  const st = j.state || j;
  if (!st.progress) throw new Error('bad');
  let n = 0;
  if (!Object.keys(S.progress).length && st.settings) S.settings = Object.assign(S.settings, st.settings);
  for (const [k, p] of Object.entries(st.progress)) { const mine = S.progress[k]; if (!mine || (p.last || 0) > (mine.last || 0)) { S.progress[k] = p; n++; } }
  for (const [k, p] of Object.entries(st.gr || {})) { const m = (S.gr = S.gr || {})[k]; if (!m || (p.last || 0) > (m.last || 0)) { S.gr[k] = p; n++; } }
  S.gri = Object.assign({}, st.gri || {}, S.gri || {});
  for (const x of (st.extra || [])) if (!S.extra.find(y => y.name === x.name) && !EMBEDDED.find(y => y.name === x.name)) S.extra.push(x);
  for (const [d, l] of Object.entries(st.log || {})) { const m = S.log[d]; if (!m || l.n > m.n) S.log[d] = l; }
  S.lastExport = Math.max(S.lastExport || 0, st.lastExport || 0);
  return n;
}
function importText(text) {
  try {
    const n = mergeState(JSON.parse(text));
    save(); rebuild(); toast(`Importierte Einträge: ${n}`); render();
  } catch (err) { toast('Datei konnte nicht gelesen werden'); }
}

/* ---------- автосохранение в файл на компьютере (Chrome / Edge) ---------- */
const FSA = { handle: null, status: ('showSaveFilePicker' in window) ? 'none' : 'unsupported', name: '', timer: null };
function idb() { return new Promise((res, rej) => { const r = indexedDB.open('vokabeltrainer', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
async function idbGet(k) { const db = await idb(); return new Promise((res, rej) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
async function idbSet(k, v) { const db = await idb(); return new Promise((res, rej) => { const q = db.transaction('kv', 'readwrite').objectStore('kv').put(v, k); q.onsuccess = () => res(); q.onerror = () => rej(q.error); }); }
async function fileWrite() {
  const w = await FSA.handle.createWritable();
  await w.write(JSON.stringify({ app: 'vokabeltrainer', v: 1, exported: new Date().toISOString(), state: S }));
  await w.close();
}
async function fileSync() {                       // прочитать файл, слить с локальным, записать обратно
  const f = await FSA.handle.getFile(), txt = await f.text();
  if (txt.trim()) { try { mergeState(JSON.parse(txt)); rebuild(); } catch (e) { } }
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { }
  await fileWrite(); FSA.status = 'ok';
}
function scheduleFileSave() {
  if (FSA.status !== 'ok') return;
  clearTimeout(FSA.timer);
  FSA.timer = setTimeout(async () => {
    try { await fileWrite(); } catch (e) { FSA.status = 'needs'; if (SCREEN === 'home') render(); }
  }, 700);
}
async function fileInit() {
  if (FSA.status === 'unsupported') return;
  try {
    const h = await idbGet('fh'); if (!h) return;
    FSA.handle = h; FSA.name = h.name;
    if ((await h.queryPermission({ mode: 'readwrite' })) === 'granted') await fileSync(); else FSA.status = 'needs';
  } catch (e) { FSA.status = 'none'; }
  if (SCREEN === 'home' || SCREEN === 'settings') render();
}
async function fileLink() {
  try {
    const h = await showSaveFilePicker({ suggestedName: 'vokabeltrainer-progress.json', types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }] });
    FSA.handle = h; FSA.name = h.name; await idbSet('fh', h); await fileSync(); toast('Automatisches Speichern aktiviert');
  } catch (e) { if (e.name !== 'AbortError') toast('Datei konnte nicht verbunden werden'); }
  render();
}
async function fileResume() {
  try { if ((await FSA.handle.requestPermission({ mode: 'readwrite' })) === 'granted') { await fileSync(); toast('Automatisches Speichern fortgesetzt'); } }
  catch (e) { toast('Kein Zugriff auf die Datei'); }
  render();
}
async function fileUnlink() { FSA.handle = null; FSA.status = 'none'; try { await idbSet('fh', null); } catch (e) { } render(); }
function autosaveCard() {
  const c = h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Fortschritt automatisch in Datei speichern'));
  if (FSA.status === 'unsupported') {
    c.append(h('div', { class: 'muted small' }, 'Dieser Browser kann nicht selbst in eine Datei schreiben. Es funktioniert in Chrome und Edge am Computer. Nutze vorerst den manuellen Export unten.'));
  } else if (FSA.status === 'ok') {
    c.append(h('div', null, '✓ Aktiv: ', h('b', null, FSA.name)), h('div', { class: 'muted small' }, 'Jede Antwort wird automatisch in diese Datei geschrieben. Beim Start liest die App sie und führt sie mit dem Stand im Browser zusammen.'),
      h('button', { class: 'link danger', onclick: fileUnlink }, 'Ausschalten'));
  } else if (FSA.status === 'needs') {
    c.append(h('div', { class: 'muted small' }, `Datei „${FSA.name}“ ist verbunden, aber der Browser fragt nach Schreibrechten (einmal pro Sitzung).`),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn primary', onclick: fileResume }, 'Erlauben und weiter'), h('button', { class: 'btn', onclick: fileUnlink }, 'Ausschalten')));
  } else {
    c.append(h('div', { class: 'muted small' }, 'Wähle einmal eine Datei (z. B. im Ordner Deutsch\\Trainer) — danach wird der Fortschritt automatisch dort gespeichert. Du kannst dieselbe Datei auch auf einem anderen Computer öffnen.'),
      h('button', { class: 'btn primary', onclick: fileLink }, '💾 Datei für automatisches Speichern wählen'));
  }
  return c;
}

function codeDialog(importMode) {
  const ta = h('textarea', { class: 'inp', rows: 8, style: 'font:12px monospace' });
  if (!importMode) { ta.value = JSON.stringify({ app: 'vokabeltrainer', v: 1, state: S }); ta.readOnly = true; }
  const ov = h('div', { class: 'overlay' }, h('div', { class: 'card dlg' },
    h('div', { class: 'h2' }, importMode ? 'Fortschrittscode einfügen' : 'Fortschrittscode — kopieren und sichern'),
    ta,
    h('div', { class: 'btnrow' },
      importMode
        ? h('button', { class: 'btn primary', onclick: () => { importText(ta.value); ov.remove(); } }, 'Importieren')
        : h('button', { class: 'btn primary', onclick: () => { ta.select(); try { navigator.clipboard.writeText(ta.value); toast('Kopiert'); } catch (e) { document.execCommand && document.execCommand('copy'); } S.lastExport = Date.now(); save(); } }, 'Kopieren'),
      h('button', { class: 'btn', onclick: () => ov.remove() }, 'Schließen'))));
  document.body.append(ov); ta.focus();
}
/* ---------- старт ---------- */
rebuild();
render();
fileInit();
