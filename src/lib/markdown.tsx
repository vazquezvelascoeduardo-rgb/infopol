// Renderer Markdown minimalista i sense dependències externes.
// Suporta: # h1..h6, paràgrafs, llistes (ul/ol), cites, codi en línia,
// **negreta**, *cursiva*, ==marcador==, enllaços [text](url) i `---`.
// Prou per a fitxes senzilles com les d'aquesta app.
import { Fragment, type ReactNode } from 'react';

// Aplica el format en línia (negreta, cursiva, marcador, codi, enllaços) a
// un fragment de text i retorna un array de nodes React.
//
// El marcador `==així==` pinta el text com si l'haguessis repassat amb un
// retolador, igual que al temari de Policia Local. Es reserva per al que
// cau a l'examen: si es marca tot, no destaca res.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Expressió que captura una de les marques de format en línia.
  const regex = /(\*\*[^*]+\*\*|==[^=]+==|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('==')) {
      nodes.push(
        <mark className="tm" key={key++}>{renderInline(token.slice(2, -2))}</mark>,
      );
    } else if (token.startsWith('`')) {
      nodes.push(<code key={key++}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        nodes.push(
          <a key={key++} href={m[2]} target="_blank" rel="noreferrer">
            {m[1]}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

// Renderitza el cos Markdown a JSX.
export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];

  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Línia en blanc → saltar
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Separador horitzontal
    if (/^\s*---\s*$/.test(line)) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }

    // Encapçalaments #..######
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      blocks.push(<Tag key={key++}>{renderInline(text)}</Tag>);
      i++;
      continue;
    }

    // Cita ">"
    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote key={key++}>{renderInline(quoteLines.join(' '))}</blockquote>,
      );
      continue;
    }

    // Llista ordenada (1. 2. ...)
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((t, idx) => (
            <li key={idx}>{renderInline(t)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Llista amb vinyetes
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((t, idx) => (
            <li key={idx}>{renderInline(t)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Paràgraf: agrupa línies consecutives no-buides fins a línia buida.
    const para: string[] = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}|>|\s*[-*]\s+|\s*\d+\.\s+|---)/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    if (para.length > 0) {
      blocks.push(<p key={key++}>{renderInline(para.join(' '))}</p>);
    }
  }

  return (
    <Fragment>
      {blocks}
    </Fragment>
  );
}

/**
 * El mateix Markdown, però a HTML en text.
 *
 * El lector del mode estudi necessita HTML de veritat, no JSX: hi ha
 * d'anar tallant nodes de text per pintar-hi els subratllats, i això no
 * es pot fer sobre un arbre que React torna a dibuixar. Cada bloc de
 * primer nivell d'aquest HTML és una unitat ancorable — el mateix
 * criteri que fa servir l'app.
 */
export function mdToHtml(source: string): string {
  // Les cometes també s'escapen: sense això, un enllaç com
  // `[x](" onmouseover="…)` tancava l'atribut href i n'hi afegia un de
  // seu. El text del xat el redacta un model, i un model es pot
  // convèncer d'escriure gairebé qualsevol cosa.
  const esc = (t: string) =>
    t
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  /** Només deixem passar enllaços que porten a algun lloc de debò. */
  const urlSegura = (u: string): string | null => {
    const net = u.trim();
    if (/^(https?:|mailto:)/i.test(net)) return net;
    // Relatius dins de la mateixa app, però mai `//host` ni `javascript:`.
    if (/^\/(?!\/)/.test(net) || /^#/.test(net)) return net;
    return null;
  };

  // Format en línia. S'escapa PRIMER i després es posen les etiquetes,
  // perquè el contingut de les fitxes no pugui injectar HTML pel seu compte.
  const inline = (t: string) =>
    esc(t)
      .replace(/==([^=]+)==/g, '<mark class="tm">$1</mark>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_tot, text: string, url: string) => {
        const segura = urlSegura(url);
        // Si no és una adreça acceptable, es queda el text i prou.
        return segura
          ? `<a href="${segura}" target="_blank" rel="noreferrer noopener">${text}</a>`
          : text;
      });

  const linies = source.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < linies.length) {
    const l = linies[i];

    if (/^\s*$/.test(l)) { i++; continue; }

    // Separador
    if (/^\s*---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }

    // Encapçalaments
    const h = l.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const n = h[1].length;
      out.push(`<h${n}>${inline(h[2].trim())}</h${n}>`);
      i++;
      continue;
    }

    // Cita
    if (/^\s*>\s?/.test(l)) {
      const buf: string[] = [];
      while (i < linies.length && /^\s*>\s?/.test(linies[i])) {
        buf.push(linies[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    // Llistes
    const ordenada = /^\s*\d+[.)]\s+/.test(l);
    const sensOrdre = /^\s*[-*+]\s+/.test(l);
    if (ordenada || sensOrdre) {
      const tag = ordenada ? 'ol' : 'ul';
      const re = ordenada ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/;
      const items: string[] = [];
      while (i < linies.length && re.test(linies[i])) {
        items.push(`<li>${inline(linies[i].replace(re, ''))}</li>`);
        i++;
      }
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    // Paràgraf: línies seguides fins a la següent en blanc.
    const buf: string[] = [];
    while (i < linies.length && !/^\s*$/.test(linies[i])
      && !/^(#{1,6})\s/.test(linies[i]) && !/^\s*[-*+]\s/.test(linies[i])
      && !/^\s*\d+[.)]\s/.test(linies[i]) && !/^\s*>/.test(linies[i])
      && !/^\s*---+\s*$/.test(linies[i])) {
      buf.push(linies[i].trim());
      i++;
    }
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  return out.join('\n');
}
