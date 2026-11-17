#!/usr/bin/env python3
"""Собирает Vokabeltrainer.html: встраивает все *.md со словами из папки Vocab.
Использование: python3 build.py <папка_Vocab> <выходной_файл.html>"""
import sys, os, json, re
here = os.path.dirname(os.path.abspath(__file__))
vocab_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, 'Vocab')
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, 'Vokabeltrainer.html')
files = []
for fn in sorted(os.listdir(vocab_dir)):
    if fn.lower().endswith('.md'):
        name = re.sub(r'\s*Vocab Julia\.md$', '', fn, flags=re.I)
        name = re.sub(r'\.md$', '', name, flags=re.I)
        files.append({'name': name, 'text': open(os.path.join(vocab_dir, fn), encoding='utf-8').read()})
emb = json.dumps(files, ensure_ascii=False).replace('<', '\\u003c')
t = open(os.path.join(here, 'template.html'), encoding='utf-8').read()
t = t.replace('/*__PARSER__*/', open(os.path.join(here, 'parser.js'), encoding='utf-8').read())
t = t.replace('/*__APP__*/', open(os.path.join(here, 'app.js'), encoding='utf-8').read())
t = t.replace('/*__GRAMMAR__*/', open(os.path.join(here, 'grammar.js'), encoding='utf-8').read())
gj = os.path.join(here, 'grammar.json')
gdata = open(gj, encoding='utf-8').read() if os.path.exists(gj) else '[]'
t = t.replace('/*__GDATA__*/[]', json.dumps(json.loads(gdata), ensure_ascii=False).replace('<', '\\u003c'))
t = t.replace('/*__EMBED__*/[]', emb)
open(out, 'w', encoding='utf-8').write(t)
print(f'OK: {len(files)} файлов, {len(t)//1024} КБ -> {out}')
