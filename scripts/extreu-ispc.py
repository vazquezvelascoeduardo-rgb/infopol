"""Extreu candidats amb una correcció explícita; desa'ls fora del repositori."""
import collections
import hashlib
import json
import pathlib
import re
import sys
import unicodedata

root = pathlib.Path(sys.argv[1])
inventory = json.loads((root / 'inventory.json').read_text(encoding='utf-8'))
topics = {}
questions = []
rejected = collections.Counter()
seen = set()

def clean(text):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', text)).strip()

for file in inventory:
    parts = file['path'].split('/')
    code = parts[2].split(' ')[0]
    slug = 'ispc-' + code.replace('.', '-')
    topic = topics.setdefault(slug, dict(slug=slug, title=unicodedata.normalize('NFC', parts[2]), module=unicodedata.normalize('NFC', parts[1]), source_count=0, question_count=0))
    topic['source_count'] += 1
    if 'duplicate' in file or 'error' in file:
        continue
    document = json.loads((root / (file['sha256'] + '.json')).read_text(encoding='utf-8'))
    for page_no, page in enumerate(document['pages'], 1):
        # No es combinen pàgines: una pregunta incompleta queda pendent de revisió.
        chunks = re.split(r'(?m)^\s*Pregunta\s+\d+\s*$', page)[1:]
        for chunk in chunks:
            if 'Trieu-ne una:' not in chunk:
                rejected['sense_selector'] += 1
                continue
            before, answers = chunk.split('Trieu-ne una:', 1)
            before = re.sub(r'^.*?Puntuació[^\n]*\n', '', before, flags=re.S)
            prompt = clean(before)
            markers = list(re.finditer(r'(?m)^\s*([a-d])\.\s+', answers))
            if [m[1] for m in markers] != list('abcd'):
                rejected['opcions_incompletes'] += 1
                continue
            options = [answers[m.end():markers[i+1].start() if i<3 else len(answers)] for i,m in enumerate(markers)]
            options[-1] = re.split(r'(?m)^\s*(?:La resposta correcta|La resposta és|La vostra resposta|La seva resposta|\d+\s*/\s*\d+|◄|Salta a|Qüestionari|https?://|\d{1,2}/\d{1,2}/\d{2,4})', options[-1])[0]
            ticks = [i for i, option in enumerate(options) if '\uf00c' in option or '✓' in option]
            if len(ticks) != 1 or '\uf00d' in ''.join(options):
                rejected['sense_correccio_inequivoca'] += 1
                continue
            options = [clean(o.replace('\uf00c', '').replace('✓', '')) for o in options]
            if not prompt or len(prompt)>1500 or any(not o or len(o)>1500 for o in options) or any(c in prompt+''.join(options) for c in ['\x00','�']):
                rejected['text_incomplet'] += 1
                continue
            if any(s in options[-1] for s in ['Pregunta ', 'Puntuació ', 'Trieu-ne', 'Correcte', 'Incorrecte']):
                rejected['restes_interficie'] += 1
                continue
            # No publiquem materials mal classificats a la carpeta 1.1.
            if code == '1.1' and any(s in parts[-1].lower() for s in ['seguretat privada','comerc','joc','espectacles','administrativa','blica_']):
                rejected['carpeta_incorrecta'] += 1
                continue
            key = hashlib.sha256(clean(prompt + '|' + '|'.join(sorted(options))).casefold().encode()).hexdigest()
            if key in seen:
                continue
            seen.add(key)
            questions.append(dict(id='ispc-'+key[:24], topic_slug=slug, text=prompt, options=options, correct=ticks[0], reference=unicodedata.normalize('NFC', parts[-1])+f' · pàg. {page_no}', explanation=None, source_hash=file['sha256'], source_page=page_no, reviewed=False))
            topic['question_count'] += 1

(root / 'candidates.json').write_text(json.dumps(questions,ensure_ascii=False,indent=2),encoding='utf-8')
(root / 'topics.json').write_text(json.dumps(list(topics.values()),ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(dict(pages=sum(f.get('pages',0) for f in inventory), candidates=len(questions), rejected=rejected,topics=[(t['title'],t['question_count']) for t in topics.values()]),ensure_ascii=False,indent=2))
