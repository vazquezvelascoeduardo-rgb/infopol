# -*- coding: utf-8 -*-
"""Genera src/data/infractions.js a partir de sct.json."""
import json, re, unicodedata

d = json.load(open('sct.json'))
rows, barems = d['rows'], d['barems']

NORMES = {
    'trlsv':   ('TRLSV',   'Text refós de la Llei de Seguretat Viària',
                'Reial decret legislatiu 6/2015, de 30 d’octubre'),
    'rgc':     ('RGC',     'Reglament general de circulació',
                'Reial decret 1428/2003, de 21 de novembre'),
    'rgcond':  ('RG Cond', 'Reglament general de conductors',
                'Reial decret 818/2009, de 8 de maig'),
    'rgv':     ('RGV',     'Reglament general de vehicles',
                'Reial decret 2822/1998, de 23 de desembre'),
    'lrcscvm': ('LRCSCVM', 'Llei sobre responsabilitat civil i assegurança en la circulació de vehicles de motor',
                'Reial decret legislatiu 8/2004, de 29 d’octubre'),
    'repc':    ('REPC',    'Reglament regulador de les escoles particulars de conductors',
                'Reial decret 1295/2003, de 17 d’octubre'),
}
SHORT = {'trlsv': 'LSV', 'rgc': 'RGC', 'rgcond': 'CND', 'rgv': 'VEH',
         'lrcscvm': 'ASS', 'repc': 'ESC'}
SEV = {'L': ('l', 'Lleu'), 'G': ('g', 'Greu'), 'MG': ('mg', 'Molt greu'),
       'G/MG': ('gmg', 'Greu / molt greu'), None: (None, 'Quantia específica')}

STOP = {'sobre', 'altres', 'dels', 'amb', 'per', 'les', 'els', 'una', 'del',
        'que', 'general', 'generals', 'normes', 'obligacions', 'condicions',
        'circulació', 'vehicle', 'vehicles', 'conductors', 'aquest', 'seva'}

def deacc(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower())
                   if unicodedata.category(c) != 'Mn')

def kw(row):
    base = ' '.join(filter(None, [row.get('sub'), row.get('block')]))
    out = []
    for w in re.findall(r"[\wàèéíòóúïüç·]+", base.lower()):
        w = w.strip('·')
        if len(w) >= 5 and w not in STOP and w not in out:
            out.append(w)
        if len(out) == 3:
            break
    return out

def js(s):
    if s is None:
        return 'null'
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"

counters = {}
entries = []
for r in rows:
    n = r['norm']
    counters[n] = counters.get(n, 0) + 1
    i = counters[n]
    sev, tag = SEV[r['sev']]
    title = r['concept']
    note = r.get('note')
    m = re.search(r'\s(Atenció\s*:.*)$', title)
    if m:
        note = ' '.join(filter(None, [m.group(1).strip(), note]))
        title = title[:m.start()].strip()
    art_full = f"Art. {r['article']} {NORMES[n][0]}"
    fine = r['quantia'] if isinstance(r['quantia'], int) else 0
    e = {
        'id': f"{SHORT[n]}-{i:03d}",
        'code': f"{SHORT[n]}·{i:03d}",
        'norm': n,
        'cat': 'transito',
        'article': art_full,
        'articleRef': r['article'],
        'sev': sev,
        'tag': tag,
        'title': title,
        'fine': fine,
        'fine50': r['dte'],
        'points': r['punts'] or 0,
        'block': r.get('block'),
        'sub': r.get('sub'),
        'note': note,
        'page': r['page'],
        'keywords': kw(r),
    }
    if r['quantia'] == 'barem':
        ctx = deacc(' '.join(filter(None, [r.get('block'), r.get('sub'), title])))
        alcohol = 'alcohol' in ctx or 'taxa d' in ctx
        e['barem'] = 'alcohol' if alcohol else 'velocitat'
        e['fineLabel'] = ('Segons barem d’alcoholèmia' if alcohol
                          else 'Segons barem de velocitat')
    if r.get('dteNo'):
        e['dteNo'] = True
    if n == 'lrcscvm':
        e['fineLabel'] = f"{fine:,} €".replace(',', '.')
    entries.append(e)

ORDER = ['id', 'code', 'norm', 'cat', 'article', 'articleRef', 'sev', 'tag',
         'title', 'fine', 'fine50', 'dteNo', 'barem', 'fineLabel', 'points',
         'block', 'sub', 'note', 'page', 'keywords']

def render(e):
    parts = []
    for k in ORDER:
        if k not in e or e[k] is None:
            continue
        v = e[k]
        if k == 'keywords':
            if not v:
                continue
            v = '[' + ', '.join(js(x) for x in v) + ']'
        elif isinstance(v, bool):
            v = 'true' if v else 'false'
        elif isinstance(v, int):
            v = str(v)
        else:
            v = js(v)
        parts.append(f'{k}: {v}')
    return '  { ' + ', '.join(parts) + ' },'

# ── barem de velocitat: es descarta la columna 130 km/h ────────────────
vel = barems['velocitat']
keep = [i for i, l in enumerate(vel['limits']) if l <= 120]
vel_limits = [vel['limits'][i] for i in keep]
vel_bands = []
for b in vel['bands']:
    vel_bands.append({
        'fine': b['fine'], 'punts': b['punts'],
        'from': [b['ranges'][i][0] for i in keep],
        'to': [b['ranges'][i][1] if len(b['ranges'][i]) > 1 else None for i in keep],
    })

out = open('infractions.generated.js', 'w')
w = out.write
w(f"""// ─────────────────────────────────────────────────────────────────────────────
//  CATÀLEG D'INFRACCIONS DE TRÀNSIT
//
//  Font única d'aquest fitxer:
//    Servei Català de Trànsit — «Catàleg d'Infraccions»
//    Versió d'1 de febrer de 2026 (41 pàgines).
//
//  Transcripció literal del catàleg. No s'hi ha afegit cap supòsit, article,
//  import ni pèrdua de punts que no consti al document original.
//
//  Dues úniques desviacions respecte del PDF, totes dues documentades:
//    1) Al barem de velocitat s'ha omès la columna «130 km/h», que al PDF
//       repeteix els valors de la columna «120 km/h» i que no es correspon
//       amb cap límit genèric vigent a l'Estat espanyol.
//    2) S'han corregit dos artefactes tipogràfics del PDF («un- veh icle»).
//
//  Límits que el mateix catàleg es posa (pàg. 3 i 4) i que la interfície ha
//  de mostrar a l'usuari:
//    · «inclou la majoria dels fets... però en cap cas en pressuposa una
//       llista tancada»
//    · si el fet no hi encaixa, «es redactarà segons el criteri de l'agent»
//
//  Generat automàticament. No editar a mà: regenerar des del PDF font.
// ─────────────────────────────────────────────────────────────────────────────

export const FONT = {{
  entitat: 'Servei Català de Trànsit',
  document: "Catàleg d'Infraccions",
  versio: '2026-02-01',
  versioLabel: "1 de febrer de 2026",
  llistaTancada: false,
  notaFont:
    "El catàleg inclou la majoria dels fets constitutius d'infracció, però no és una llista tancada. " +
    "Si el fet no hi encaixa, l'agent l'ha de redactar segons el seu criteri i consignar l'article aplicable.",
  avisLegal:
    "Contingut de consulta, orientatiu. No substitueix la lectura de la norma vigent ni cap instrucció " +
    "del cos. Els imports són els del procediment sancionador del Servei Català de Trànsit; una " +
    "denúncia per ordenança municipal pot tenir una quantia diferent. InfoPol no té cap vinculació " +
    "amb el Servei Català de Trànsit, el Departament d'Interior ni la Generalitat de Catalunya.",
}};

export const NORMES = {{
""")
for k, (code, nom, ref) in NORMES.items():
    w(f"  {k}: {{ code: {js(code)}, nom: {js(nom)}, ref: {js(ref)} }},\n")
w("};\n\nexport const INFRACTIONS = [\n")

last = None
for e, r in zip(entries, rows):
    if r['norm'] != last:
        last = r['norm']
        w(f"\n  // ─── {NORMES[last][1]} ({NORMES[last][2]}) "
          f"{'─' * max(0, 30)}\n")
    w(render(e) + '\n')
w("];\n\n")

w(f"""// Barem sancionador de velocitat — annex del RGC (pàg. 32 del catàleg).
// «bands» va de menys a més greu. `to: null` = sense límit superior.
export const BAREM_VELOCITAT = {{
  limits: {vel_limits},
  bands: [
""")
for b in vel_bands:
    w(f"    {{ fine: {b['fine']}, punts: {b['punts']}, "
      f"from: {b['from']}, to: {[('null' if t is None else t) for t in b['to']]} }},\n".replace("'null'", 'null'))
w("""  ],
  nota:
    "En excessos de velocitat en autopistes i autovies d'accés a ciutats on el límit específic " +
    "de la via és inferior a 100 km/h s'aplica l'import que correspongui pel límit establert, " +
    "però la detracció de punts corresponent al límit de 100 km/h.",
};

// Barem sancionador d'alcoholèmia — pàg. 34 i 35 del catàleg.
// Taxes en mg/l d'alcohol en aire espirat.
export const BAREM_ALCOHOL = {
  perfils: [
    {
      id: 'general',
      nom: 'Conductors en general, majors d’edat',
      trams: [
        { from: 0.26, to: 0.50, fine: 500, fine50: 250, punts: 4 },
        { from: 0.51, to: null, fine: 1000, fine50: 500, punts: 6 },
      ],
      reincident: { fine: 1000, fine50: 500, punts: 4 },
    },
    {
      id: 'professional',
      nom: 'Resta de conductors',
      detall:
        'Vehicles de transport de mercaderies amb MMA > 3.500 kg; transport de viatgers de més de ' +
        '9 places; servei públic; transport escolar o de menors; servei d’urgència; transport ' +
        'especial; i permís o llicència de conducció amb antiguitat inferior a 2 anys.',
      trams: [
        { from: 0.16, to: 0.30, fine: 500, fine50: 250, punts: 4 },
        { from: 0.31, to: null, fine: 1000, fine50: 500, punts: 6 },
      ],
      reincident: { fine: 1000, fine50: 500, punts: 4 },
    },
    {
      id: 'menor',
      nom: 'Menors d’edat',
      trams: [
        { from: 0.01, to: 0.15, fine: 500, fine50: 250, punts: 0 },
      ],
      subperfils: [
        {
          id: 'menor-novell',
          nom: 'Amb permís o llicència d’antiguitat inferior a 2 anys',
          trams: [
            { from: 0.16, to: 0.30, fine: 500, fine50: 250, punts: 4, condicional: true },
            { from: 0.31, to: null, fine: 1000, fine50: 500, punts: 6, condicional: true },
          ],
        },
        {
          id: 'menor-experimentat',
          nom: 'Amb permís o llicència d’antiguitat superior a 2 anys',
          trams: [
            { from: 0.26, to: 0.50, fine: 500, fine50: 250, punts: 4, condicional: true },
            { from: 0.51, to: null, fine: 1000, fine50: 500, punts: 6, condicional: true },
          ],
        },
      ],
      reincident: { fine: 1000, fine50: 500, punts: 4, condicional: true },
    },
  ],
  notaCondicional:
    'En tot cas, la detracció de punts de l’autorització per conduir s’aplicarà quan aquesta sigui ' +
    'necessària per a la conducció del vehicle que conduïa la persona infractora sotmesa al control.',
  reincidencia:
    'Haver estat sancionat l’any immediatament anterior per superar la taxa d’alcoholèmia.',
};
""")
out.close()
print('entries', len(entries))
