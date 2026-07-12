#!/usr/bin/env python3
"""
Script diari de recollida de notícies per a InfoPol.
Obté les últimes notícies de Catalunya, Espanya i internacional,
les classifica per categoria i actualitza server/data/news.json.
"""

import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent.parent
NEWS_FILE = ROOT / "server" / "data" / "news.json"
MAX_ITEMS = 40  # màxim d'ítems a conservar al fitxer

# ── Fonts RSS ─────────────────────────────────────────────────────────────────

SOURCES = [
    # Catalunya
    {"url": "https://www.ara.cat/rss/portada/", "scope": "Catalunya", "lang": "ca"},
    {"url": "https://www.ccma.cat/324/rss/", "scope": "Catalunya", "lang": "ca"},
    # Espanya
    {"url": "https://www.lavanguardia.com/rss/home.xml", "scope": "Espanya", "lang": "es"},
    {"url": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada", "scope": "Espanya", "lang": "es"},
    {"url": "https://www.elmundo.es/rss/portada.xml", "scope": "Espanya", "lang": "es"},
    {"url": "https://www.rtve.es/api/noticias.rss", "scope": "Espanya", "lang": "es"},
    # Internacional
    {"url": "https://feeds.bbci.co.uk/mundo/rss.xml", "scope": "Internacional", "lang": "es"},
    {"url": "https://www.europapress.es/rss/rss.aspx", "scope": "Internacional", "lang": "es"},
]

# ── Classificació per categories ──────────────────────────────────────────────

CATEGORIES = [
    ("Seguretat",    ["polici", "mosso", "detenci", "delinquen", "crimin", "pres", "robator", "homicid",
                      "assassin", "judici", "tribunal", "sentenci", "fiscal", "guàrdi", "guardia civil",
                      "policía", "detenido", "crimen", "juicio", "sentencia", "cárcel"]),
    ("Esports",      ["futbol", "barça", "espanyol", "girona", "real madrid", "atlético", "liga", "champions",
                      "tennis", "bàsquet", "ciclisme", "natació", "atletisme", "olimpi", "mundial",
                      "campionat", "copa", "gol", "torneig", "deporte", "baloncesto"]),
    ("Economia",     ["economia", "mercat", "bors", "inversió", "pib", "inflació", "atur", "salari",
                      "empresa", "negoci", "banc", "pressupost", "impost", "deute", "erario",
                      "economía", "mercado", "inflación", "desempleo", "empresa", "bolsa"]),
    ("Política Cat.", ["govern", "generalitat", "parlament", "president", "conseller", "independèn",
                       "catalun", "cdi", "psc", "esquerra", "cup", "junts", "pp catalun",
                       "govern català", "govern de la generalitat"]),
    ("Política Esp.", ["congres", "senat", "president del govern", "pedro sánchez", "pp", "psoe",
                       "vox", "sumar", "rajoy", "feijóo", "ministr", "govern", "gobierno",
                       "congreso", "senado", "moncloa", "parlamento"]),
    ("Internacional", ["ucraïna", "rússia", "israel", "palestina", "gaza", "ue", "unió europea",
                       "onu", "otan", "trump", "biden", "macron", "anglaterra", "alemanya",
                       "ucrania", "rusia", "eeuu", "estados unidos", "china", "brexit"]),
    ("Ciència",       ["investigació", "descobriment", "estudi", "ciència", "salut", "medicina",
                       "hospital", "vacuna", "càncer", "virus", "ia ", "intel·ligència artificial",
                       "investigación", "descubrimiento", "ciencia", "salud", "inteligencia artificial"]),
    ("Premis",        ["premi", "guardonat", "oscar", "goya", "nobel", "emmy", "grammy",
                       "medalla", "distinció", "reconeixement",
                       "premio", "galardonado", "medalla", "distinción"]),
    ("Cultura",       ["cultura", "art", "museu", "exposició", "concert", "teatre", "llibre",
                       "cinema", "pel·lícula", "música", "festival", "patrimoni",
                       "museo", "exposición", "película", "película", "concierto", "teatro"]),
]

DEFAULT_TAG = "Actualitat"

# ── Utilitats ─────────────────────────────────────────────────────────────────

def clean_html(text):
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"&quot;", '"', text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&[a-z]+;", " ", text)
    text = re.sub(r"&#\d+;", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def truncate_to_sentences(text, max_chars=180):
    text = clean_html(text)
    if len(text) <= max_chars:
        return text
    # Tallar per punt, coma o espai
    cut = text[:max_chars]
    for sep in (".", "!", "?"):
        idx = cut.rfind(sep)
        if idx > 60:
            return cut[: idx + 1].strip()
    idx = cut.rfind(" ")
    return (cut[:idx].strip() + "…") if idx > 0 else cut.strip()


def classify(title, desc):
    haystack = (title + " " + (desc or "")).lower()
    for tag, keywords in CATEGORIES:
        if any(kw in haystack for kw in keywords):
            return tag
    return DEFAULT_TAG


def fetch_rss(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "InfoPol-NewsBot/1.0 (+https://infopol.cat)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
        return ET.fromstring(data)
    except Exception as exc:
        print(f"  AVÍS: no s'ha pogut obtenir {url} — {exc}", file=sys.stderr)
        return None


def parse_rss(root, default_scope):
    items = []
    for item in root.findall(".//item"):
        title = clean_html(item.findtext("title", ""))
        link = (item.findtext("link") or "").strip()
        desc_raw = item.findtext("description", "") or item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded", "")
        desc = truncate_to_sentences(desc_raw)
        pub = item.findtext("pubDate", "")
        if title and link:
            items.append({"title": title, "desc": desc, "url": link, "pub": pub, "scope": default_scope})
    return items


def make_id(today_str, index):
    compact = today_str.replace("-", "")
    return f"n{compact}-{index:02d}"


def make_date_label(iso_date):
    parts = iso_date.split("-")
    if len(parts) == 3:
        return f"{parts[1]}·{parts[2]}"
    return iso_date

# ── Principal ─────────────────────────────────────────────────────────────────

def main():
    today = date.today()
    today_str = today.isoformat()
    print(f"InfoPol News Fetcher — {today_str}")

    # Carrega les notícies existents
    existing = []
    if NEWS_FILE.exists():
        try:
            existing = json.loads(NEWS_FILE.read_text(encoding="utf-8"))
        except Exception:
            existing = []

    existing_urls = {n.get("url") for n in existing if n.get("url")}

    # Recull i parseja totes les fonts
    all_items = []
    for source in SOURCES:
        print(f"  → {source['url']}")
        root = fetch_rss(source["url"])
        if root is None:
            continue
        items = parse_rss(root, source["scope"])
        all_items.extend(items)

    # Deduplica per URL i filtra ja existents
    seen_urls = set(existing_urls)
    unique = []
    for item in all_items:
        url = item["url"]
        if url not in seen_urls:
            seen_urls.add(url)
            unique.append(item)

    if not unique:
        print("Cap notícia nova trobada.")
        return

    print(f"{len(unique)} notícies noves trobades.")

    # Classifica i construeix entrades
    new_entries = []
    for idx, item in enumerate(unique[:20], start=1):  # màx. 20 noves per execució
        tag = classify(item["title"], item["desc"])
        entry = {
            "id": make_id(today_str, idx),
            "date": today_str,
            "dateLabel": make_date_label(today_str),
            "tag": tag,
            "title": item["title"],
            "desc": item["desc"] or item["title"],
            "url": item["url"],
        }
        new_entries.append(entry)
        print(f"  [{tag}] {item['title'][:70]}")

    # Combina: noves primer + existents, trunca a MAX_ITEMS
    combined = new_entries + existing
    combined = combined[:MAX_ITEMS]

    # Desa
    NEWS_FILE.write_text(json.dumps(combined, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDesar {len(combined)} notícies a {NEWS_FILE}")


if __name__ == "__main__":
    main()
