// Renderer Markdown minimalista i sense dependències externes.
// Suporta: # h1..h6, paràgrafs, llistes (ul/ol), cites, codi en línia,
// **negreta**, *cursiva*, enllaços [text](url), `---` com a separador.
// Prou per a fitxes senzilles com les d'aquesta app.
import { Fragment, type ReactNode } from 'react';

// Aplica el format en línia (negreta, cursiva, codi, enllaços) a un fragment
// de text i retorna un array de nodes React.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Expressió que captura una de les marques de format en línia.
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
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
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
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
