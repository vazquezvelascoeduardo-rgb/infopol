# -*- coding: utf-8 -*-
"""Extreu el «Catàleg d'Infraccions» del Servei Català de Trànsit (PDF) a JSON."""
import json, re
import pdfplumber

PDF = '/root/.claude/uploads/84ef51bd-d0ad-5e55-929b-ba78cf72dceb/9f33a419-SCT_Nomenclator__022026_compressed.pdf'
STRAT = {"vertical_strategy": "lines", "horizontal_strategy": "lines"}

NORM_MARKERS = [
    ('Reial Decret Legislatiu 6/2015', 'trlsv'),
    ('Reial decret 1428/2003',          'rgc'),
    ('Reial decret 818/2009',           'rgcond'),
    ('Reial decret 2822/1998',          'rgv'),
    ('RDL 8/2004',                      'lrcscvm'),
    ('Reial decret 1295/2003',          'repc'),
]
SEVS = {'L', 'G', 'MG', 'G/MG', 'MG/G'}
# concepte que el PDF parteix entre dues pàgines (p39 → p40)
PATCH_CONCEPT = {
    ('rgv', '46.2'): "Circular amb un permís temporal per a ús d’empreses sense el conductor "
                     "o l’acompanyant reglamentaris, o bé superant el límit de persones reglamentàries",
}

def clean(s):
    if not s:
        return ''
    return re.sub(r'[ \t]+', ' ', s.replace('\n', ' ').replace('­', '')).strip()

def is_header_row(row):
    return bool(row) and 'Concepte' in (row[0] or '')

def num(v):
    if v is None:
        return None
    v = clean(v).replace('.', '').replace('€', '')
    return int(v) if re.fullmatch(r'\d+', v) else None

def is_block(c):
    letters = [ch for ch in c if ch.isalpha()]
    return bool(letters) and sum(ch.isupper() for ch in letters) / len(letters) > 0.7

rows, barems, skipped = [], {}, []
with pdfplumber.open(PDF) as pdf:
    norm = None
    for pno, page in enumerate(pdf.pages, 1):
        text = page.extract_text() or ''
        pending = [k for m, k in NORM_MARKERS if m in text]
        block = sub = None
        for table in page.extract_tables(STRAT):
            flat = ' '.join(clean(c) for c in (table[0] or []))
            if 'LIMITACIÓ DE VELOCITAT' in flat or 'TAXA' in flat:
                continue                                  # barems: es tracten a part
            if is_header_row(table[0]):
                if pending:
                    norm = pending.pop(0)
                block = sub = None
            if norm is None or pno in (33, 34, 35):
                continue
            for row in table:
                if is_header_row(row) or not row:
                    continue
                concept = clean(row[0])
                vals = [clean(c) for c in row[1:] if clean(c)]
                if vals and vals[0] in ('50%', '30%', 'punts', 'Retirada'):
                    continue                              # 2a línia de capçalera
                if not concept and not vals:
                    continue

                if not vals:                              # cap dada numèrica
                    if concept.lower().startswith(('atenció', 'nota')) or concept.startswith('*'):
                        if rows:
                            rows[-1]['note'] = ' '.join(filter(None, [rows[-1].get('note'), concept]))
                    elif len(concept) <= 110 and not concept.endswith(('.', ',')):
                        if is_block(concept):
                            block, sub = concept, None
                        else:
                            sub = concept
                    elif rows:
                        rows[-1]['note'] = ' '.join(filter(None, [rows[-1].get('note'), concept]))
                    continue

                article, rest = vals[0], vals[1:]
                sev = None
                if rest and re.sub(r'\s', '', rest[0]) in SEVS:
                    sev, rest = re.sub(r'\s', '', rest[0]), rest[1:]
                quantia = dte = punts = None
                dte_no = False
                if rest:
                    if re.search(r'barem|veure', rest[0], re.I):
                        quantia, rest = 'barem', rest[1:]
                    else:
                        quantia, rest = num(rest[0]), rest[1:]
                if rest:
                    if rest[0].upper() == 'NO':
                        dte_no, rest = True, rest[1:]
                    else:
                        dte, rest = num(rest[0]), rest[1:]
                if rest:
                    m = re.match(r'(\d)', rest[0])
                    punts = int(m.group(1)) if m else None

                # sub-capçalera amb soroll a la columna Quantia (p.ex. «0»)
                if sev is None and dte is None and punts is None and quantia == 0 \
                        and norm != 'lrcscvm':
                    if is_block(concept):
                        block, sub = concept, None
                    else:
                        sub = concept
                    continue

                # continuació vertical d'una fila que ve de la pàgina/fila anterior
                if sev is None and dte is None and punts is None \
                        and quantia in (None, 'barem') and norm != 'lrcscvm' and rows:
                    prev = rows[-1]
                    prev['concept'] = f"{prev['concept']} {concept}".strip()
                    if article and article != 'barem' and article not in prev['article']:
                        prev['article'] = f"{prev['article']} / {article}"
                    continue

                if not concept:
                    concept = PATCH_CONCEPT.get((norm, article), '')
                    if not concept:
                        skipped.append((pno, article, '<buit>'))
                        continue

                rows.append({
                    'norm': norm, 'article': article, 'sev': sev,
                    'quantia': quantia, 'dte': dte, 'punts': punts,
                    'dteNo': dte_no or None,
                    'block': block, 'sub': sub, 'concept': concept, 'page': pno,
                })

        # ── barem de velocitat (p32) ────────────────────────────────────
        if pno == 32:
            for t in page.extract_tables(STRAT):
                if 'LIMITACIÓ DE VELOCITAT' not in ' '.join(clean(c) for c in (t[0] or [])):
                    continue
                limits = [int(c) for c in t[1] if c and c.strip().isdigit()]
                bands = []
                for r in t[2:]:
                    cells = [clean(c) for c in r]
                    vals = [c for c in cells if re.fullmatch(r'\d+( \d+)?', c or '')]
                    if len(vals) < len(limits) + 1:
                        continue
                    rngs = [tuple(int(x) for x in v.split()) for v in vals[:len(limits)]]
                    fine = int(vals[len(limits)])
                    pts = vals[len(limits) + 1] if len(vals) > len(limits) + 1 else '0'
                    bands.append({'ranges': rngs, 'fine': fine,
                                  'punts': int(pts) if pts.isdigit() else 0})
                barems['velocitat'] = {'limits': limits, 'bands': bands}

        # ── barem d'alcoholèmia (p34-35) ────────────────────────────────
        if pno in (34, 35):
            for t in page.extract_tables(STRAT):
                if any('TAXA' in (c or '') for c in (t[0] or [])):
                    barems.setdefault('alcohol_raw', []).append(
                        [[clean(c) for c in r] for r in t])

print('ROWS', len(rows), '| SKIPPED', len(skipped))
from collections import Counter
print(Counter(r['norm'] for r in rows))
print(Counter(r['sev'] for r in rows))
print('sense quantia ni barem:',
      sum(1 for r in rows if r['quantia'] is None))
print('velocitat limits', barems['velocitat']['limits'],
      'bands', len(barems['velocitat']['bands']))
for s in skipped:
    print('  skip', s)
json.dump({'rows': rows, 'barems': barems}, open('sct.json', 'w'),
          ensure_ascii=False, indent=1)
