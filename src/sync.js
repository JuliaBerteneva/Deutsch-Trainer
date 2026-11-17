/* ============================ GitHub-Sync ============================ */
const GH_KEY = 'vokabeltrainer_gh';
const GH = { cfg: null, status: 'off', msg: '', timer: null, busy: false, again: false, last: 0 };
try { GH.cfg = JSON.parse(localStorage.getItem(GH_KEY) || 'null'); if (GH.cfg && GH.cfg.token) GH.status = 'idle'; } catch (e) { }
const b64e = s => btoa(unescape(encodeURIComponent(s)));
const b64d = s => decodeURIComponent(escape(atob(s.replace(/\s/g, ''))));
function ghReq(method, body) {
  const c = GH.cfg;
  return fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path || 'progress.json'}`, {
    method, headers: { Authorization: 'Bearer ' + c.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: body ? JSON.stringify(body) : undefined, cache: 'no-store'
  });
}
async function ghSync(push = true, silent = true) {
  if (!GH.cfg || !GH.cfg.token) return;
  if (GH.busy) { GH.again = true; return; }
  GH.busy = true; GH.status = 'sync';
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await ghReq('GET');
      let sha = null;
      if (r.status === 200) {
        const j = await r.json(); sha = j.sha;
        try { const n = mergeState(JSON.parse(b64d(j.content))); rebuild(); if (n && (SCREEN === 'home' || SCREEN === 'settings')) render(); } catch (e) { throw new Error('Datei im Repository ist kein gültiger Fortschritt'); }
      } else if (r.status !== 404) {
        throw new Error(r.status === 401 || r.status === 403 ? 'Token ungültig oder ohne Rechte' : 'GitHub-Fehler ' + r.status);
      }
      if (!push) break;
      const text = JSON.stringify({ app: 'vokabeltrainer', v: 1, exported: new Date().toISOString(), state: S });
      const w = await ghReq('PUT', { message: 'Fortschritt ' + new Date().toISOString().slice(0, 16), content: b64e(text), sha: sha || undefined });
      if (w.status === 200 || w.status === 201) break;
      if ((w.status === 409 || w.status === 422) && attempt === 0) continue;   // кто-то записал раньше — перечитать и слить
      throw new Error(w.status === 401 || w.status === 403 ? 'Token ohne Schreibrechte' : 'Speichern fehlgeschlagen (' + w.status + ')');
    }
    GH.status = 'ok'; GH.msg = ''; GH.last = Date.now();
    try { localStorage.setItem('vokabeltrainer_v1', JSON.stringify(S)); } catch (e) { }
  } catch (e) {
    GH.status = 'err'; GH.msg = (e && e.message) || 'Netzwerkfehler';
    if (!silent) toast(GH.msg);
  }
  GH.busy = false;
  if (GH.again) { GH.again = false; scheduleGhPush(); }
  if (SCREEN === 'settings' || SCREEN === 'home') render();
}
function scheduleGhPush() {
  if (!GH.cfg || !GH.cfg.token) return;
  clearTimeout(GH.timer);
  GH.timer = setTimeout(() => ghSync(true), 8000);
}
document.addEventListener('visibilitychange', () => {
  if (!GH.cfg || !GH.cfg.token) return;
  if (document.visibilityState === 'hidden') { clearTimeout(GH.timer); ghSync(true); } else ghSync(false);
});
function ghSave(cfg) { GH.cfg = cfg; try { localStorage.setItem(GH_KEY, JSON.stringify(cfg)); } catch (e) { } }
function ghOff() { GH.cfg = null; GH.status = 'off'; try { localStorage.removeItem(GH_KEY); } catch (e) { } render(); }
function githubCard() {
  const c = h('div', { class: 'card' }, h('div', { class: 'h2' }, 'Synchronisieren über GitHub (Handy + Computer)'));
  if (GH.cfg && GH.cfg.token) {
    c.append(
      h('div', null, GH.status === 'err' ? '⚠ ' : '✓ ', h('b', null, `${GH.cfg.owner}/${GH.cfg.repo}`)),
      h('div', { class: 'muted small' }, GH.status === 'err' ? GH.msg : GH.status === 'sync' ? 'Synchronisiere…' : GH.last ? 'Zuletzt synchronisiert: ' + new Date(GH.last).toLocaleTimeString() : 'Aktiv. Der Fortschritt wird nach jeder Runde in das Repository geschrieben.'),
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn', onclick: () => ghSync(true, false) }, '🔄 Jetzt synchronisieren'),
        h('button', { class: 'btn', onclick: ghOff }, 'Ausschalten')));
  } else {
    const o = h('input', { class: 'inp', value: 'JuliaBerteneva', placeholder: 'Benutzername' });
    const r = h('input', { class: 'inp', value: 'Deutsch-Progress', placeholder: 'Repository' });
    const t = h('input', { class: 'inp', type: 'password', placeholder: 'Token (github_pat_…)', autocomplete: 'off' });
    c.append(
      h('div', { class: 'muted small' }, 'Der Token gilt nur für das Repository mit dem Fortschritt (Contents: Read and write). Er wird nur in diesem Browser gespeichert und nicht in den Fortschrittscode exportiert.'),
      o, r, t,
      h('button', { class: 'btn primary', onclick: async () => {
        if (!t.value.trim()) { toast('Token einfügen'); return; }
        ghSave({ owner: o.value.trim(), repo: r.value.trim(), token: t.value.trim(), path: 'progress.json' });
        await ghSync(true, false); if (GH.status === 'err') { return; } toast('Verbunden ✓'); render();
      } }, 'Verbinden'));
  }
  return c;
}
