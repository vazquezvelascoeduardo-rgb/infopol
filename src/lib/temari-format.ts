// Format del temari i el seu lector.
//
// Els temes s'escriuen en Markdown amb quatre marques pròpies. La idea
// és que escriure un tema sigui escriure text, no maquetar: qui el
// redacta posa el contingut i la pantalla ja el pinta com toca.
//
// ┌─ FORMAT ────────────────────────────────────────────────────┐
// │ ---                                                          │
// │ subtitol: Delictes contra el patrimoni · art. 234 a 267 CP   │
// │ ---                                                          │
// │                                                              │
// │ ## Concepte i bé jurídic protegit      ← obre un APARTAT     │
// │ > Què protegeix el títol XIII del CP   ← subtítol (opcional) │
// │                                                              │
// │ Text normal en paràgrafs, amb **negreta**.                   │
// │                                                              │
// │ ### Un subapartat                      ← dins de l'apartat   │
// │                                                              │
// │ - Llistes                                                    │
// │ - amb els seus punts                                         │
// │                                                              │
// │ :::clau                                ← CAIXA "Clau d'examen"│
// │ El que cau a l'examen i on tothom rellisca.                  │
// │ :::                                                          │
// │                                                              │
// │ :::avis                                ← CAIXA d'advertiment │
// │ Compte amb això.                                             │
// │ :::                                                          │
// │                                                              │
// │ :::articles                            ← TARGETES d'article  │
// │ art. 234 CP | Furt                                           │
// │ Pren coses mobles alienes sense violència ni força.          │
// │                                                              │
// │ art. 237 CP | Robatori                                       │
// │ Amb força en les coses o violència sobre les persones.       │
// │ :::                                                          │
// └──────────────────────────────────────────────────────────────┘
//
// Cada `##` és un apartat i surt a l'índex de l'esquerra. La resta
// (subapartats, llistes, caixes i targetes) va dins de l'apartat obert.

export type Article = { ref: string; titol: string; text: string };

export type BlocContingut =
  | { tipus: 'text'; html: string }
  | { tipus: 'clau'; html: string }
  | { tipus: 'avis'; html: string }
  | { tipus: 'articles'; articles: Article[] };

export type Apartat = {
  /** "01", "02"… tal com surt a l'índex. */
  num: string;
  titol: string;
  subtitol?: string;
  blocs: BlocContingut[];
  /** Minuts de lectura estimats a partir del text real. */
  minuts: number;
};

export type TemaContingut = {
  subtitol?: string;
  apartats: Apartat[];
};

/** Escapa HTML: el contingut no ha de poder injectar etiquetes pel seu compte. */
function esc(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Format en línia: negreta, cursiva, codi, enllaços i marcador.
 *
 * El marcador `==així==` pinta el text com si l'haguessis repassat amb
 * un retolador. Es reserva per al que cau a l'examen: si es marca tot,
 * no destaca res.
 *
 * S'escapa primer, sempre: el contingut no ha de poder injectar HTML.
 */
function inline(t: string): string {
  return esc(t)
    .replace(/==([^=]+)==/g, '<mark class="tm">$1</mark>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

/** Converteix un tros de Markdown senzill a HTML. */
function aHtml(linies: string[]): string {
  const out: string[] = [];
  let i = 0;
  while (i < linies.length) {
    const l = linies[i];
    if (/^\s*$/.test(l)) { i++; continue; }

    const h = l.match(/^(#{3,6})\s+(.*)$/);
    if (h) {
      out.push(`<h4>${inline(h[2].trim())}</h4>`);
      i++;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l)) {
      const ordenada = /^\s*\d+[.)]\s+/.test(l);
      const re = ordenada ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/;
      const items: string[] = [];
      while (i < linies.length && re.test(linies[i])) {
        items.push(`<li>${inline(linies[i].replace(re, ''))}</li>`);
        i++;
      }
      out.push(`<${ordenada ? 'ol' : 'ul'}>${items.join('')}</${ordenada ? 'ol' : 'ul'}>`);
      continue;
    }

    const buf: string[] = [];
    while (i < linies.length && !/^\s*$/.test(linies[i])
      && !/^#{3,6}\s/.test(linies[i])
      && !/^\s*[-*+]\s/.test(linies[i]) && !/^\s*\d+[.)]\s/.test(linies[i])) {
      buf.push(linies[i].trim());
      i++;
    }
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

/** Les targetes d'article: "ref | títol" i, a sota, el text. */
function llegeixArticles(linies: string[]): Article[] {
  const out: Article[] = [];
  let actual: Article | null = null;
  for (const l of linies) {
    if (/^\s*$/.test(l)) continue;
    const cap = l.match(/^(.+?)\s*\|\s*(.+)$/);
    if (cap) {
      if (actual) out.push(actual);
      actual = { ref: cap[1].trim(), titol: cap[2].trim(), text: '' };
      continue;
    }
    if (actual) actual.text += (actual.text ? ' ' : '') + l.trim();
  }
  if (actual) out.push(actual);
  return out;
}

/** ~200 paraules per minut, mínim 1. */
function minutsDe(text: string): number {
  const paraules = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(paraules / 200));
}

export function parseTema(md: string): TemaContingut {
  const linies = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  let subtitolTema: string | undefined;

  // Capçalera opcional entre ---
  if (linies[0]?.trim() === '---') {
    i = 1;
    while (i < linies.length && linies[i].trim() !== '---') {
      const m = linies[i].match(/^(\w+):\s*(.*)$/);
      if (m && m[1] === 'subtitol') subtitolTema = m[2].trim();
      i++;
    }
    i++;
  }

  const apartats: Apartat[] = [];
  let actual: Apartat | null = null;
  let buffer: string[] = [];

  const buidaBuffer = () => {
    if (!actual || !buffer.length) { buffer = []; return; }
    const html = aHtml(buffer);
    if (html) actual.blocs.push({ tipus: 'text', html });
    buffer = [];
  };

  while (i < linies.length) {
    const l = linies[i];

    // Nou apartat
    const h2 = l.match(/^##\s+(.*)$/);
    if (h2) {
      buidaBuffer();
      if (actual) apartats.push(actual);
      actual = {
        num: String(apartats.length + 1).padStart(2, '0'),
        titol: h2[1].trim(),
        blocs: [],
        minuts: 0,
      };
      // Subtítol de l'apartat: una cita just a sota.
      if (linies[i + 1] && /^>\s?/.test(linies[i + 1])) {
        actual.subtitol = linies[i + 1].replace(/^>\s?/, '').trim();
        i++;
      }
      i++;
      continue;
    }

    // Caixes :::
    const obre = l.match(/^:::(clau|avis|articles)\s*$/);
    if (obre && actual) {
      buidaBuffer();
      const tipus = obre[1] as 'clau' | 'avis' | 'articles';
      const dins: string[] = [];
      i++;
      while (i < linies.length && !/^:::\s*$/.test(linies[i])) {
        dins.push(linies[i]);
        i++;
      }
      i++;   // salta el ::: de tancament
      if (tipus === 'articles') {
        const articles = llegeixArticles(dins);
        if (articles.length) actual.blocs.push({ tipus: 'articles', articles });
      } else {
        const html = aHtml(dins);
        if (html) actual.blocs.push({ tipus, html });
      }
      continue;
    }

    buffer.push(l);
    i++;
  }

  buidaBuffer();
  if (actual) apartats.push(actual);

  // Temps de lectura per apartat, comptat sobre el text de debò.
  for (const a of apartats) {
    const text = a.blocs
      .map((b) => (b.tipus === 'articles'
        ? b.articles.map((x) => `${x.titol} ${x.text}`).join(' ')
        : b.html.replace(/<[^>]+>/g, ' ')))
      .join(' ');
    a.minuts = minutsDe(text);
  }

  return { subtitol: subtitolTema, apartats };
}
