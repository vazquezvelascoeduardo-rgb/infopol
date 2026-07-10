#!/usr/bin/env python3
"""
Genera les notícies del dia per InfoPol cridant Claude amb web search.
S'executa des del GitHub Action daily-news.yml.
"""
import json
import os
import re
import sys
from datetime import datetime

import anthropic

TODAY = datetime.now()
DATE_STR = TODAY.strftime('%Y-%m-%d')
DATE_LABEL = TODAY.strftime('%m') + '·' + TODAY.strftime('%d')
ID_PREFIX = 'n' + TODAY.strftime('%Y%m%d')

PROMPT = f"""Ets el sistema de notícies d'InfoPol. Avui és {DATE_STR}.

Cerca les notícies més importants d'avui (últimes 24h) de:
- **Catalunya**: política, economia, cultura, societat, successos, esports
- **Espanya**: política, economia, tribunals, successos rellevants, esports
- **Internacional**: geopolítica, premis, descobriments científics, successos importants

Fonts recomanades: ACN, La Vanguardia, El País, El Punt Avui, Nació Digital, BBC, Reuters, EFE.

Retorna exactament entre 8 i 12 notícies com un array JSON pur (sense cap text addicional, sense markdown, just el JSON).

Cada element ha de tenir:
{{
  "id": "{ID_PREFIX}_01",
  "date": "{DATE_STR}",
  "dateLabel": "{DATE_LABEL}",
  "tag": "una de: Política | Economia | Cultura | Esports | Policial | Internacional | Descobriment | Premi | Societat",
  "title": "titular en català, màxim 80 caràcters",
  "desc": "resum en 1-2 frases en català, màxim 180 caràcters",
  "url": "URL directa verificada a la notícia completa"
}}

Regles:
- Tots els textos (title, desc) en català
- Mai inventes notícies: cada URL ha de ser real i verificada
- Diversitat de categories i de geografia (Catalunya / Espanya / Internacional)
- La desc ha de ser informativa, no clickbait
- Incrementa el NN del id per cada notícia: _01, _02, _03..."""

NEWS_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'news.js')
MAX_NEWS = 50


def extract_json(text: str) -> list:
    # Intenta parsejar directament
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass
    # Extreu el primer array JSON del text
    match = re.search(r'\[[\s\S]*\]', text)
    if match:
        return json.loads(match.group(0))
    raise ValueError("No s'ha trobat cap array JSON a la resposta")


def read_existing_news(path: str) -> list:
    try:
        with open(path, encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'export const NEWS = (\[[\s\S]*?\]);', content)
        if match:
            return json.loads(match.group(1))
    except Exception:
        pass
    return []


def write_news_file(path: str, news: list) -> None:
    items = []
    for n in news:
        url_val = f"'{n['url']}'" if n.get('url') else 'null'
        desc = n['desc'].replace("'", "\\'")
        title = n['title'].replace("'", "\\'")
        items.append(
            f"  {{\n"
            f"    id: '{n['id']}',\n"
            f"    date: '{n['date']}',\n"
            f"    dateLabel: '{n['dateLabel']}',\n"
            f"    tag: '{n['tag']}',\n"
            f"    title: '{title}',\n"
            f"    desc: '{desc}',\n"
            f"    url: {url_val},\n"
            f"  }}"
        )
    content = "export const NEWS = [\n" + ",\n".join(items) + "\n];\n"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def main():
    client = anthropic.Anthropic()

    print(f"Generant notícies per {DATE_STR}...")

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=4096,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": PROMPT}],
    )

    # Extreu el text final de la resposta
    text_blocks = [b.text for b in response.content if hasattr(b, 'text')]
    if not text_blocks:
        print("ERROR: No s'ha obtingut text de la resposta", file=sys.stderr)
        sys.exit(1)

    raw = text_blocks[-1]

    try:
        new_items = extract_json(raw)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"ERROR parsejant JSON: {e}\nResposta:\n{raw}", file=sys.stderr)
        sys.exit(1)

    print(f"Notícies generades: {len(new_items)}")

    existing = read_existing_news(NEWS_FILE)
    # Elimina notícies del dia per evitar duplicats si s'executa dues vegades
    existing = [n for n in existing if not n.get('id', '').startswith(ID_PREFIX)]
    combined = new_items + existing
    if len(combined) > MAX_NEWS:
        combined = combined[:MAX_NEWS]

    write_news_file(NEWS_FILE, combined)
    print(f"Fitxer actualitzat: {len(combined)} notícies totals")


if __name__ == '__main__':
    main()
