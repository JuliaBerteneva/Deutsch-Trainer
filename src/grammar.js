/* ============================ GRAMMATIK ============================ */
const GN = 4;                                   // столько верных подряд по теме => «sicher»
const gp = id => (S.gr = S.gr || {}, S.gr[id] || { ok: 0, bad: 0, streak: 0, seen: 0, last: 0 });
const gsetp = id => { S.gr = S.gr || {}; return S.gr[id] || (S.gr[id] = { ok: 0, bad: 0, streak: 0, seen: 0, last: 0 }); };
const gstatus = id => { const p = gp(id); return p.seen === 0 ? 'new' : p.streak >= GN ? 'known' : 'learning'; };
let GSES = null;

function gradeItem(entry, ok) {
  if (entry.tries > 0) return;
  const p = gsetp(entry.topic.id);
  p.seen++; p.last = Date.now();
  if (ok) { p.ok++; p.streak++; GSES.firstOk++; } else { p.bad++; p.streak = 0; GSES.missed.push(entry); }
  S.gri = S.gri || {}; S.gri[entry.topic.id + '#' + entry.idx] = Date.now();
  logAnswer(ok);
  save();
}
function gpick(topicId, n) {
  const gri = S.gri || {};
  const pool = [];
  for (const t of GRAMMAR) {
    if (topicId && t.id !== topicId) continue;
    const need = topicId ? 1 : (gstatus(t.id) === 'known' ? 0.15 : gstatus(t.id) === 'new' ? 1.2 : 1 - Math.min(gp(t.id).streak, GN) / GN * 0.7);
    t.items.forEach((it, idx) => {
      const last = gri[t.id + '#' + idx] || 0;
      const age = last ? Math.min((Date.now() - last) / DAY, 10) / 10 : 1.5;
      pool.push({ topic: t, item: it, idx, tries: 0, score: need + age + Math.random() * 0.6 });
    });
  }
  pool.sort((a, b) => b.score - a.score);
  const out = [], per = {};
  for (const e of pool) {
    if (out.length >= n) break;
    if (!topicId && (per[e.topic.id] || 0) >= 3) continue;
    per[e.topic.id] = (per[e.topic.id] || 0) + 1; out.push(e);
  }
  return shuffle(out);
}
function startGrammar(topicId, entries) {
  const q = entries || gpick(topicId, topicId ? 8 : 10);
  if (!q.length) { toast('Keine Aufgaben verfügbar'); return; }
  GSES = { topicId, queue: q.slice(), total: q.length, done: 0, firstOk: 0, missed: [], rules: !entries, ruled: {} };   // rules: перед первым заданием каждой темы показываем правило
  go('gex');
}
function gtopicsOverview() {
  const n = GRAMMAR.length, known = GRAMMAR.filter(t => gstatus(t.id) === 'known').length;
  return { n, known };
}

/* ---- блок на главной ---- */
function grammarCard() {
  const { n, known } = gtopicsOverview();
  const rows = GRAMMAR.map(t => {
    const p = gp(t.id), st = gstatus(t.id);
    return h('button', { class: 'grow ' + st, onclick: () => { GTOPIC = t.id; go('gtopic'); } },
      h('span', { class: 'gt' }, t.title),
      h('span', { class: 'gb' }, bar(Math.min(p.streak, GN), GN, st === 'known' ? 'ok' : ''), ),
      h('span', { class: 'gs' }, st === 'known' ? '✓' : st === 'new' ? '·' : p.streak + '/' + GN));
  });
  return h('div', { class: 'card' },
    h('div', { class: 'row between' }, h('div', { class: 'h2' }, 'Grammatik'), h('div', { class: 'pct' }, `${known}/${n}`)),
    h('div', { class: 'muted small' }, `Alle Themen aus deinen Hausaufgaben. Ein Thema gilt als sicher nach ${GN} richtigen Antworten hintereinander.`),
    h('button', { class: 'btn primary', onclick: () => startGrammar(null) }, '▶ Grammatik üben (10 Aufgaben)'),
    h('div', { class: 'glist' }, rows));
}
let GTOPIC = null;
function viewGTopic() {
  const t = GRAMMAR.find(x => x.id === GTOPIC), p = gp(t.id);
  return h('div', { class: 'wrap' },
    topbar(t.title, () => go('home')),
    h('div', { class: 'card' },
      h('div', { class: 'muted small' }, t.src),
      h('div', { class: 'rule' }, t.rule.map(l => h('p', null, l))),
      h('div', { class: 'muted small' }, p.seen ? `Richtig ${p.ok}, falsch ${p.bad} · aktuelle Serie ${p.streak}/${GN}` : 'Noch nicht geübt'),
      h('button', { class: 'btn primary', onclick: () => startGrammar(t.id) }, '▶ Dieses Thema üben'),
      h('button', { class: 'btn', onclick: () => { S.gr[t.id] = { ok: 0, bad: 0, streak: 0, seen: 0, last: Date.now() }; save(); toast('Zurückgesetzt'); render(); } }, 'Fortschritt zurücksetzen')));
}

/* ---- упражнения ---- */
function ruleBlock(t) {
  return h('div', { class: 'rule' }, t.rule.map(l => h('p', null, l)));
}
function viewGRule(e) {
  const t = e.topic;
  const go_ = () => { GSES.ruled[t.id] = true; render(); };
  KEYS = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go_(); } };
  return h('div', { class: 'wrap' },
    h('div', null,
      h('div', { class: 'top' },
        h('button', { class: 'icon', 'aria-label': 'Schließen', onclick: () => go(GSES.done ? 'gsum' : 'home') }, '✕'),
        h('div', { class: 'title' }, t.title), h('div', { class: 'sub' }, `${GSES.done}/${GSES.total}`)),
      bar(GSES.done, GSES.total)),
    h('div', { class: 'card' },
      h('div', { class: 'tag' }, 'Regel'),
      h('div', { class: 'muted small' }, t.src),
      ruleBlock(t),
      h('div', { class: 'btnrow' }, h('button', { class: 'btn primary', onclick: go_ }, 'Weiter zu den Aufgaben →'))));
}
function viewGEx() {
  const e = GSES.queue[0], it = e.item;
  if (GSES.rules && !GSES.ruled[e.topic.id]) return viewGRule(e);
  const root = h('div', { class: 'wrap' });
  root.append(h('div', null,
    h('div', { class: 'top' },
      h('button', { class: 'icon', 'aria-label': 'Schließen', onclick: () => { if (GSES.done === 0 || confirm('Runde beenden? Dein Fortschritt ist schon gespeichert.')) go(GSES.done ? 'gsum' : 'home'); } }, '✕'),
      h('div', { class: 'title' }, e.topic.title), h('div', { class: 'sub' }, `${GSES.done}/${GSES.total}`)),
    bar(GSES.done, GSES.total)));
  root.append(h('details', { class: 'rulebox' }, h('summary', null, '📖 Regel ansehen'), ruleBlock(e.topic)));
  const card = h('div', { class: 'card ex' }), fb = h('div', { class: 'fb', hidden: true });
  let answered = false;
  const finish = ok => {
    if (answered) return; answered = true; KEYS = null;
    gradeItem(e, ok);
    const next = () => {
      GSES.queue.shift(); e.tries++;
      if (ok || e.tries >= 3) GSES.done++; else GSES.queue.splice(Math.min(3, GSES.queue.length), 0, e);
      if (!GSES.queue.length) go('gsum'); else render();
    };
    const nb = h('button', { class: 'btn primary', onclick: next }, 'Weiter →');
    fb.className = 'fb ' + (ok ? 'ok' : 'bad'); fb.hidden = false;
    fb.replaceChildren(
      h('div', { class: 'fbhead' }, ok ? '✓ Richtig!' : '✗ Falsch'),
      h('div', { class: 'ans' }, it.t === 'mc' ? it.q.replace('___', it.a) : it.s),
      it.e ? h('div', { class: 'ru' }, it.e) : null,
      h('div', { class: 'btnrow' }, nb));
    KEYS = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); next(); } };
    nb.focus({ preventScroll: true });
    fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  if (it.t === 'mc') {
    const opts = shuffle([it.a, ...it.w]), btns = [];
    const pickIt = i => {
      if (btns[0].disabled) return;
      const ok = opts[i] === it.a;
      btns.forEach((b, j) => { b.disabled = true; if (opts[j] === it.a) b.classList.add('right'); });
      if (!ok) btns[i].classList.add('wrong');
      finish(ok);
    };
    card.append(h('div', { class: 'tag' }, 'Wähle die richtige Form'), h('div', { class: 'big-word sentence' }, it.q),
      h('div', { class: 'opts' }, opts.map((o, i) => { const b = h('button', { class: 'opt', onclick: () => pickIt(i) }, h('span', { class: 'k' }, i + 1), h('span', null, o)); btns.push(b); return b; })));
    KEYS = ev => { const n = parseInt(ev.key, 10); if (n >= 1 && n <= opts.length) pickIt(n - 1); };
  } else {
    const toks = it.s.split(/\s+/).map((c, i) => ({ c, id: i }));
    let bank = shuffle(toks), t = 0;
    while (bank.map(x => x.c).join(' ') === it.s && t++ < 9) bank = shuffle(toks);
    let built = [];
    const area = h('div', { class: 'words' }), bankEl = h('div', { class: 'tiles words' });
    const checkBtn = h('button', { class: 'btn primary', onclick: check }, 'Prüfen');
    const draw = () => {
      area.replaceChildren(...built.map((x, i) => h('button', { class: 'tile wide in', onclick: () => { built.splice(i, 1); bank.push(x); draw(); } }, x.c)));
      if (!built.length) area.append(h('span', { class: 'muted' }, 'Wörter der Reihe nach antippen'));
      bankEl.replaceChildren(...bank.map(x => h('button', { class: 'tile wide', onclick: () => { bank.splice(bank.indexOf(x), 1); built.push(x); draw(); } }, x.c)));
      checkBtn.disabled = bank.length > 0;
    };
    function check() {
      const ok = built.map(x => x.c).join(' ').toLowerCase() === it.s.toLowerCase();
      area.classList.add(ok ? 'good' : 'bad');
      card.querySelectorAll('button').forEach(x => x.disabled = true);
      finish(ok);
    }
    card.append(h('div', { class: 'tag' }, 'Satz bilden'), h('div', { class: 'big-word sentence' }, it.hint || 'Bilde den richtigen Satz'),
      area, bankEl, h('div', { class: 'btnrow' }, checkBtn, h('button', { class: 'btn', onclick: () => { bank = bank.concat(built); built = []; draw(); } }, 'Zurücksetzen')));
    draw();
  }
  root.append(card, fb);
  return root;
}
function viewGSum() {
  const t = GSES.total, ok = GSES.firstOk, miss = GSES.missed;
  return h('div', { class: 'wrap' },
    h('div', { class: 'top' }, h('div', { class: 'title big' }, 'Fertig!')),
    h('div', { class: 'card hero' }, h('div', { class: 'h2' }, `Beim ersten Versuch richtig: ${ok} von ${t}`), bar(ok, t, 'big')),
    miss.length ? h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Zum Nacharbeiten'),
      miss.map(e => h('div', { class: 'miss' }, h('b', null, e.item.t === 'mc' ? e.item.q.replace('___', e.item.a) : e.item.s), e.item.e ? h('div', { class: 'muted small' }, e.item.e) : null))) : h('div', { class: 'card' }, '🎉 Keine Fehler!'),
    h('div', { class: 'card' },
      miss.length ? h('button', { class: 'btn primary', onclick: () => startGrammar(GSES.topicId, miss.map(e => ({ ...e, tries: 0 }))) }, '🔁 Fehler noch einmal üben') : null,
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn', onclick: () => startGrammar(GSES.topicId) }, '▶ Noch eine Runde'),
        h('button', { class: 'btn', onclick: () => go('home') }, 'Startseite'))));
}
