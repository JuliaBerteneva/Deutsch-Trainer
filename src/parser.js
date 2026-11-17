// Парсер vocab .md -> массив слов. Работает и в браузере, и в node.
(function (root) {
  const CYR = /[А-Яа-яЁё]/;
  const ART = /^(der|die|das)\s+/i;

  function clean(s) {
    return s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
  }

  function findSplit(line) {
    // 1) длинное/среднее тире
    let m = line.match(/\s[—–]\s/);
    if (m) {
      const i = m.index;
      return [line.slice(0, i), line.slice(i + m[0].length)];
    }
    // 2) дефис: берём первый ' - ', перед которым нет запятой и после которого есть кириллица
    const re = /\s-\s/g;
    let x;
    while ((x = re.exec(line))) {
      const before = line.slice(0, x.index);
      const after = line.slice(x.index + x[0].length);
      if (/,\s*$/.test(before)) continue;
      if (!CYR.test(after) || CYR.test(before)) continue;
      return [before, after];
    }
    // особый случай "der Würfel, - - кубик"
    const y = line.match(/^(.*,\s*-)\s-\s(.+)$/);
    if (y && CYR.test(y[2]) && !CYR.test(y[1])) return [y[1], y[2]];
    return null;
  }

  function parsePluralRule(rest) {
    const r = rest.trim();
    if (/^\(?\s*(Sg\.?|Singular)\s*\)?$/i.test(r)) return { plural: null, sg: true };
    if (/^\(?\s*Pl\.?\s*\)?$/i.test(r)) return { plural: null, pl: true };
    if (/^¨?-[a-z]{0,4}$/.test(r)) return { plural: r };
    return null;
  }

  function parseDe(deRaw) {
    let de = clean(deRaw).replace(/^r\s+(?=[A-ZÄÖÜ])/, 'der ').replace(/^e\s+(?=[A-ZÄÖÜ])/, 'die ').replace(/^s\s+(?=[A-ZÄÖÜ])/, 'das ');
    const out = { de, lemma: de, article: null, plural: null, sg: false, pos: 'other', forms: null, note: '' };

    // убрать скобки в конце: (Sg.) / (gerät, geriet, ist geraten) / (Petersilie)
    let paren = null;
    const pm = de.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    if (pm) { paren = pm[2]; de = pm[1]; }

    const am = de.match(ART);
    if (am) {
      out.article = am[1].toLowerCase();
      out.pos = 'noun';
      const parts = de.slice(am[0].length).split(/,\s*/);
      out.lemma = parts[0].trim();
      if (parts.length > 1) {
        const pr = parsePluralRule(parts.slice(1).join(', '));
        if (pr) { out.plural = pr.plural; out.sg = !!pr.sg; }
      }
      if (paren) {
        const pr = parsePluralRule('(' + paren + ')');
        if (pr) { out.sg = !!pr.sg; if (pr.plural) out.plural = pr.plural; }
        else out.note = paren;
      }
      return out;
    }

    // глагол с формами: "schneiden, schneidet, hat geschnitten" или "geraten (gerät, geriet, ist geraten)"
    let formsSrc = null;
    const parts = de.split(/,\s*/);
    if (parts.length >= 2 && /^(hat|ist)\s+\S+/.test(parts[parts.length - 1]) && !CYR.test(de)) {
      out.lemma = parts[0];
      formsSrc = parts.slice(1);
    } else if (paren && /,/.test(paren) && /(hat|ist)\s+\S+\s*$/.test(paren)) {
      out.lemma = de;
      formsSrc = paren.split(/,\s*/);
    } else {
      out.lemma = de;
      if (paren) out.note = paren;
    }
    if (formsSrc) {
      out.forms = formsSrc.map(s => s.trim());
      out.pos = 'verb';
    }
    return out;
  }

  function mkEntry(deRaw, ruRaw, ctx) {
    const de = clean(deRaw);
    const ru = clean(ruRaw).replace(/^["«»“”]+|["«»“”]+$/g, '');
    if (!de || !ru) return null;
    if (CYR.test(de)) return null;
    if (!CYR.test(ru)) return null;
    if (/[→⇒]/.test(de)) return null;
    if (de.length > 90) return null;
    const p = parseDe(de);
    if (/\s\/\s/.test(de)) { p.article = null; p.pos = 'other'; p.lemma = de; p.plural = null; p.sg = false; p.note = ''; }
    const words = p.lemma.split(/\s+/).filter(Boolean);
    const isSentence = !p.article && (/[.!?]$/.test(p.lemma) || (words.length >= 5 && !/\s\/\s/.test(p.lemma))) && !/(\.\.\.|…)/.test(p.lemma);
    const typable = p.lemma.length <= 26 && !/(\.\.\.|…|\+|\/|=|\(|\))/.test(p.lemma) && !isSentence;
    return Object.assign(p, {
      ru,
      topic: ctx.topic,
      file: ctx.file,
      phrase: isSentence,
      typable,
    });
  }

  function splitPairs(deRaw, ruRaw, ctx) {
    const semi = ruRaw.split(/;\s+/);
    if (semi.length > 1 && semi.slice(1).every(c => /\s[—–]\s/.test(c))) {
      const out = splitPairs(deRaw, semi[0], ctx);
      semi.slice(1).forEach(c => { const sp = findSplit(clean(c)); if (sp) out.push(...splitPairs(sp[0], sp[1], ctx)); });
      return out;
    }
    // "der Apfelsaft / der Orangensaft — яблочный/апельсиновый сок" -> две записи, если счёт совпадает
    const deParts = deRaw.split(/\s+\/\s+/);
    const ruParts = ruRaw.split(/\s*\/\s*/);
    if (deParts.length === 2 && ruParts.length === 2 && deParts.every(p => !CYR.test(p))
        && ruParts.every(p => p.trim().split(/\s+/).length === ruParts[0].trim().split(/\s+/).length)
        && deParts.every(p => ART.test(p.trim()) || p.split(/\s+/).length === 1)) {
      return deParts.map((d, i) => mkEntry(d, ruParts[i], ctx)).filter(Boolean);
    }
    const e = mkEntry(deRaw, ruRaw, ctx);
    return e ? [e] : [];
  }

  function parseMarkdown(text, fileName) {
    const entries = [];
    const lines = text.split(/\r?\n/);
    let topic = '';
    let fileTitle = fileName || '';
    const ctx = () => ({ topic: topic || 'Без темы', file: fileTitle });

    for (let raw of lines) {
      const line = raw.replace(/\s+$/, '');
      if (!line.trim()) continue;

      if (/^#\s/.test(line)) { // заголовок файла
        const t = clean(line.replace(/^#\s*/, ''));
        const d = t.match(/(\d{4}-\d{2}-\d{2})/) || t.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        if (d && !fileName) fileTitle = d.length === 2 ? d[1] : `${d[3]}-${d[2]}-${d[1]}`;
        continue;
      }
      if (/^#{2,4}\s/.test(line)) { topic = clean(line.replace(/^#+\s*/, '')); continue; }
      if (/^\*\*[^*]+\*\*\s*$/.test(line)) { topic = clean(line); continue; }
      if (/^\s/.test(line)) continue;           // вложенные примеры
      if (/^\|/.test(line)) continue;           // таблицы
      if (/^---+$/.test(line.trim())) continue;

      if (/^[-*]\s+/.test(line)) {
        let body = clean(line.replace(/^[-*]\s+/, ''));
        // антонимы: "schnell ↔ langsam (быстрый/медленный)"
        const ant = body.match(/^([^↔(]+?)\s*↔\s*([^(]+?)\s*\(([^)]+)\)\s*$/);
        if (ant && CYR.test(ant[3])) {
          const ruP = ant[3].split(/\s*\/\s*/);
          if (ruP.length === 2) {
            [ [ant[1], ruP[0]], [ant[2], ruP[1]] ].forEach(([d, r]) => {
              const e = mkEntry(d, r, ctx()); if (e) entries.push(e);
            });
          }
          continue;
        }
        const sp = findSplit(body);
        if (!sp) continue;
        splitPairs(sp[0], sp[1], ctx()).forEach(e => entries.push(e));
        continue;
      }

      // строки вида "Глаголы: a — b; c — d; ..."
      const lm = line.match(/^([А-Яа-яЁё][^:]{0,40}):\s+(.+)$/);
      if (lm && /\s[—–]\s/.test(lm[2])) {
        lm[2].split(/;\s*/).forEach(chunk => {
          const sp = findSplit(clean(chunk).replace(/\.$/, ''));
          if (sp) { const e = mkEntry(sp[0], sp[1], ctx()); if (e) entries.push(e); }
        });
      }
    }
    return { file: fileTitle, entries };
  }

  // нормализация для сравнения ответов: ä=ae=a:, ö=oe=o:, ü=ue=u:, ß=ss
  function normAnswer(s) {
    return String(s).toLowerCase()
      .replace(/[·\-\s.,!?;"'«»()]/g, '')
      .replace(/ä|a:/g, 'ae').replace(/ö|o:/g, 'oe').replace(/ü|u:/g, 'ue')
      .replace(/ß/g, 'ss');
  }

  const api = { parseMarkdown, normAnswer, parseDe };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.VocabParser = api;
})(typeof window !== 'undefined' ? window : globalThis);
