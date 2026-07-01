#!/usr/bin/env python3
"""
InfoPol — Actualització automàtica de notícies diàries
Llegeix RSS de fonts catalanes, espanyoles i internacionals.
"""
import json
import sys
from datetime import date
from urllib.request import urlopen, Request
from urllib.error import URLError
import xml.etree.ElementTree as ET
from html import unescape
import re

TODAY = date.today()
DATE_STR = TODAY.isoformat()
DATE_LABEL = TODAY.strftime('%m·%d')
DATE_ID = TODAY.strftime('%Y%m%d')

# (url, categoria_per_defecte, àmbit)
FEEDS = [
    ('https://www.vilaweb.cat/feed/',                                           'Política',  'CAT'),
    ('https://www.ara.cat/feed.xml',                                            'Política',  'CAT'),
    ('https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',        'Política',  'ESP'),
    ('https://www.elconfidencial.com/rss/tags/espana_0/',                       'Política',  'ESP'),
    ('https://www.rtve.es/api/items/portada/lastItems.rss',                     'Política',  'ESP'),
    ('https://feeds.bbci.co.uk/mundo/rss.xml',                                  'Política',  'INT'),
    ('https://www.marca.com/rss/portada.html',                                  'Esports',   'ESP'),
    ('https://www.sport.es/rss/',                                               'Esports',   'CAT'),
    ('https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/seccion/economia', 'Economia', 'ESP'),
    ('https://www.elconfidencial.com/rss/tags/ciencia_51/',                     'Ciència',   'INT'),
]

KEYWORDS = {
    'Política':  ['president', 'govern', 'parlament', 'congr', 'senat', 'vot', 'elecci',
                  'parti', 'minister', 'ajuntament', 'alcald', 'generalitat', 'independ'],
    'Economia':  ['econom', 'pib', 'inflaci', 'atur', 'mercat', 'bors', 'empresa',
                  'salari', 'taxa', 'euro', 'impost', 'pressupost', 'factura'],
    'Esports':   ['futbol', 'barça', 'madrid', 'lliga', 'champions', 'nba', 'tenis',
                  'moto', 'formula', 'atletism', 'ciclism', 'bàsquet', 'basket'],
    'Policial':  ['polici', 'detenc', 'detingut', 'robo', 'assalt', 'droga', 'tràfic',
                  'mossos', 'guàrdia civil', 'narcot', 'estafa', 'frau'],
    'Judicial':  ['jutjat', 'tribunal', 'sentència', 'judici', 'condemn', 'absolci',
                  'fiscal', 'advocat', 'recurs', 'apel'],
    'Cultura':   ['festival', 'cine', 'teatre', 'museu', 'art', 'llibre', 'música',
                  'exposici', 'director', 'actor', 'novel·la', 'literatura'],
    'Ciència':   ['invest', 'descobrim', 'estudi', 'científ', 'universit', 'salut',
                  'medic', 'tecnol', 'intel·ligència artif', 'ia ', ' ai '],
    'Premis':    ['premi', 'osca', 'nobel', 'golden', 'award', 'guanyad', 'goya',
                  'planet', 'gaudí', 'laureus'],
}

def infer_tag(title, desc, default_cat, ambit):
    text = (title + ' ' + (desc or '')).lower()
    for cat, kws in KEYWORDS.items():
        if any(kw in text for kw in kws):
            return f'{cat} · {ambit}'
    return f'{default_cat} · {ambit}'

def clean(text):
    if not text:
        return ''
    text = re.sub(r'<[^>]+>', ' ', text)
    text = unescape(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def trunc(text, n):
    if len(text) <= n:
        return text
    return text[:n - 1].rsplit(' ', 1)[0] + '…'

def find_text(el, *tags):
    NS = {'atom': 'http://www.w3.org/2005/Atom', 'media': 'http://search.yahoo.com/mrss/'}
    for tag in tags:
        v = el.findtext(tag) or el.findtext(tag, namespaces=NS)
        if v and v.strip():
            return v.strip()
    return ''

def fetch_feed(url, default_cat, ambit):
    items = []
    try:
        req = Request(url, headers={'User-Agent': 'InfoPolNewsBot/1.0'})
        with urlopen(req, timeout=12) as f:
            root = ET.fromstring(f.read())
    except Exception as e:
        print(f'  ✗ {url[:55]}: {e}', file=sys.stderr)
        return items

    entries = root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')

    for entry in entries[:6]:
        title = clean(find_text(entry, 'title', '{http://www.w3.org/2005/Atom}title'))
        desc  = clean(find_text(entry, 'description', '{http://www.w3.org/2005/Atom}summary',
                                '{http://www.w3.org/2005/Atom}content'))
        link  = find_text(entry, 'link')
        if not link:
            link_el = entry.find('{http://www.w3.org/2005/Atom}link')
            if link_el is not None:
                link = link_el.get('href', '')

        if not title or not link:
            continue

        items.append({
            'title': title,
            'desc':  trunc(desc, 160) if desc else '',
            'url':   link.strip(),
            'tag':   infer_tag(title, desc, default_cat, ambit),
        })

    print(f'  ✓ {url[:55]}: {len(items)} articles', file=sys.stderr)
    return items

def main():
    print(f'InfoPol News — {DATE_STR}', file=sys.stderr)
    all_items = []
    for url, cat, ambit in FEEDS:
        all_items.extend(fetch_feed(url, cat, ambit))

    # Deduplicar per títol
    seen, unique = set(), []
    for item in all_items:
        key = re.sub(r'\W+', '', item['title'].lower())[:40]
        if key not in seen:
            seen.add(key)
            unique.append(item)

    # Selecció diversa: màx 2 per tag
    counts = {}
    selected = []
    for item in unique:
        tag = item['tag']
        if counts.get(tag, 0) < 2:
            selected.append(item)
            counts[tag] = counts.get(tag, 0) + 1
        if len(selected) >= 14:
            break

    noticias = [
        {
            'id':        f"gn_{DATE_ID}_{i:03d}",
            'date':      DATE_STR,
            'dateLabel': DATE_LABEL,
            'tag':       item['tag'],
            'title':     trunc(item['title'], 100),
            'desc':      item['desc'],
            'url':       item['url'],
        }
        for i, item in enumerate(selected, 1)
    ]

    out = 'server/data/noticias.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(noticias, f, ensure_ascii=False, indent=2)

    print(f'✓ {len(noticias)} notícies escrites → {out}')
    cats = sorted({n["tag"].split(" · ")[0] for n in noticias})
    print(f'  Categories: {", ".join(cats)}')

if __name__ == '__main__':
    main()
