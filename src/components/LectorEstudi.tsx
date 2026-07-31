// Lector del mode estudi: llegir, subratllar, repassar i tapar.
//
// Tres maneres de mirar el mateix text:
//   llegir  — el temari sencer; selecciones i subratlles
//   repàs   — només el que has subratllat; la resta s'apaga
//   oclusió — el subratllat surt tapat i el destapes quan creus que hi caus
//
// L'ancoratge dels subratllats és el MATEIX que el de l'app: (índex del
// bloc, offset inicial, offset final) calculats sobre el text pla del
// bloc, no sobre l'HTML. Cada fill directe del contenidor és un bloc.
// Gràcies a això, el que subratlles al mòbil surt aquí i a l'inrevés —
// però també vol dir que si algú canvia com es parteixen els blocs en un
// dels dos, els subratllats de l'altre queden desancorats.
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  COLORS, afegeix, canviaColor, colorInfo, esborra, llegeix,
  type ColorSubratllat, type Subratllat,
} from '../lib/subratllats';
import { I, RV, V } from '../lib/v3';

export type ModeLectura = 'llegir' | 'repas' | 'oclusio';

const MODES: { key: ModeLectura; etiqueta: string; ajuda: string }[] = [
  { key: 'llegir', etiqueta: 'Llegir', ajuda: 'Selecciona text per subratllar' },
  { key: 'repas', etiqueta: 'Repàs', ajuda: 'Només el que has subratllat' },
  { key: 'oclusio', etiqueta: 'Oclusió', ajuda: 'Destapa el que recordis' },
];

/** L'invers: (node, offset) del DOM → posició dins del text pla del bloc. */
function offsetDe(bloc: Element, node: Node, off: number): number {
  const it = document.createTreeWalker(bloc, NodeFilter.SHOW_TEXT);
  let acumulat = 0;
  let n = it.nextNode();
  while (n) {
    if (n === node) return acumulat + off;
    acumulat += n.nodeValue?.length ?? 0;
    n = it.nextNode();
  }
  return acumulat;
}

/**
 * Marca un tram de text del bloc.
 *
 * No es fa amb `surroundContents` perquè peta en quant la selecció creua
 * una etiqueta — i al temari passa contínuament: una negreta, un enllaç,
 * un <br> pel mig. Aquí s'embolcalla cada tros de text per separat, que
 * aguanta qualsevol selecció.
 */
function marca(
  bloc: Element, ini: number, fi: number,
  aplica: (m: HTMLElement) => void,
): boolean {
  const it = document.createTreeWalker(bloc, NodeFilter.SHOW_TEXT);
  const trossos: { node: Text; des: number; fins: number }[] = [];
  let acumulat = 0;
  let n = it.nextNode() as Text | null;
  while (n) {
    const llarg = n.nodeValue?.length ?? 0;
    const inici = acumulat;
    const final = acumulat + llarg;
    if (final > ini && inici < fi) {
      trossos.push({
        node: n,
        des: Math.max(0, ini - inici),
        fins: Math.min(llarg, fi - inici),
      });
    }
    acumulat = final;
    if (acumulat >= fi) break;
    n = it.nextNode() as Text | null;
  }
  if (!trossos.length) return false;

  for (const t of trossos) {
    if (t.fins <= t.des) continue;
    const r = document.createRange();
    r.setStart(t.node, t.des);
    r.setEnd(t.node, t.fins);
    const m = document.createElement('mark');
    aplica(m);
    r.surroundContents(m);   // segur: el rang és dins d'un sol node de text
  }
  return true;
}

type Seleccio = { bloc: number; ini: number; fi: number; text: string; context: string };

export default function LectorEstudi({
  doc, html, senseSessio,
}: {
  /** Identificador del document: "<modul>/<slug>". El mateix que a l'app. */
  doc: string;
  /** Cos ja renderitzat a HTML. */
  html: string;
  /** Si no hi ha sessió no es pot desar res; es diu clarament. */
  senseSessio: boolean;
}) {
  const cos = useRef<HTMLDivElement>(null);
  const [subs, setSubs] = useState<Subratllat[]>([]);
  const [mode, setMode] = useState<ModeLectura>('llegir');
  const [sel, setSel] = useState<Seleccio | null>(null);
  const [obert, setObert] = useState<Subratllat | null>(null);
  const [carregant, setCarregant] = useState(true);

  useEffect(() => {
    let viu = true;
    setCarregant(true);
    llegeix(doc)
      .then((s) => { if (viu) setSubs(s); })
      .finally(() => { if (viu) setCarregant(false); });
    return () => { viu = false; };
  }, [doc]);

  /**
   * Pinta els subratllats sobre el text.
   *
   * Es fa de darrere cap endavant: si es pintés en ordre, cada tall
   * mouria les posicions dels següents dins del mateix bloc.
   */
  const pinta = useCallback(() => {
    const arrel = cos.current;
    if (!arrel) return;

    // Partim de l'HTML net cada vegada: així no s'acumulen capes de
    // marques d'un pintat anterior.
    const blocs = Array.from(arrel.children);
    blocs.forEach((b, i) => {
      b.classList.add('bloc');
      b.classList.remove('te-hl');
      (b as HTMLElement).dataset.bloc = String(i);
    });

    const ordenats = [...subs].sort((a, b) => b.bloc - a.bloc || b.ini - a.ini);
    for (const s of ordenats) {
      const bloc = blocs[s.bloc];
      if (!bloc) continue;
      const fet = marca(bloc, s.ini, s.fi, (m) => {
        m.dataset.hl = s.id;
        m.className = 'hl';
        m.style.background = colorInfo(s.color).fons;
        m.style.color = 'inherit';
        m.style.borderRadius = '3px';
        m.style.padding = '1px 0';
        m.style.cursor = 'pointer';
        if (s.nota) m.title = s.nota;
      });
      if (fet) bloc.classList.add('te-hl');
    }
  }, [subs]);

  // Cada cop que canvien els subratllats o l'HTML, es reconstrueix el cos
  // net i es torna a pintar.
  useEffect(() => {
    const arrel = cos.current;
    if (!arrel) return;
    arrel.innerHTML = html;
    pinta();
  }, [html, pinta]);

  /** Selecció de text de l'usuari dins d'un bloc. */
  function mira() {
    if (mode !== 'llegir') return;
    const s = window.getSelection();
    if (!s || s.isCollapsed || s.rangeCount === 0) { setSel(null); return; }
    const r = s.getRangeAt(0);
    const arrel = cos.current;
    if (!arrel || !arrel.contains(r.commonAncestorContainer)) { setSel(null); return; }

    // De quin bloc surt la selecció.
    let node: Node | null = r.commonAncestorContainer;
    while (node && node.parentElement !== arrel) node = node.parentElement;
    const bloc = node as HTMLElement | null;
    if (!bloc || bloc.parentElement !== arrel) { setSel(null); return; }

    const i = Number(bloc.dataset.bloc ?? -1);
    if (i < 0) { setSel(null); return; }

    const ini = offsetDe(bloc, r.startContainer, r.startOffset);
    const fi = offsetDe(bloc, r.endContainer, r.endOffset);
    const text = r.toString().trim();
    if (!text || fi <= ini) { setSel(null); return; }

    setSel({ bloc: i, ini, fi, text, context: bloc.textContent ?? '' });
  }

  async function subratlla(color: ColorSubratllat) {
    if (!sel) return;
    const nou = await afegeix({
      doc, bloc: sel.bloc, ini: sel.ini, fi: sel.fi,
      color, text: sel.text, context: sel.context,
    });
    if (nou) setSubs((p) => [...p, nou]);
    setSel(null);
    window.getSelection()?.removeAllRanges();
  }

  /** Clic sobre un subratllat ja fet: obre el menú per canviar-lo. */
  function clicCos(e: React.MouseEvent) {
    const t = (e.target as HTMLElement).closest('mark[data-hl]') as HTMLElement | null;
    if (!t) { setObert(null); return; }
    if (mode === 'oclusio') { t.classList.toggle('destapat'); return; }
    const s = subs.find((x) => x.id === t.dataset.hl);
    setObert(s ?? null);
  }

  async function canvia(color: ColorSubratllat) {
    if (!obert) return;
    if (await canviaColor(obert.id, color)) {
      setSubs((p) => p.map((x) => (x.id === obert.id ? { ...x, color } : x)));
    }
    setObert(null);
  }

  async function treu() {
    if (!obert) return;
    if (await esborra(obert.id)) setSubs((p) => p.filter((x) => x.id !== obert.id));
    setObert(null);
  }

  const ajuda = MODES.find((m) => m.key === mode)?.ajuda ?? '';

  return (
    <div>
      {/* Barra de modes */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        marginBottom: 16, position: 'sticky', top: 0, zIndex: 20,
        background: V.paper, paddingBottom: 10,
      }}>
        <div style={{ display: 'inline-flex', background: V.surface2, borderRadius: RV.pill, padding: 4, gap: 4 }}>
          {MODES.map((m) => {
            const on = mode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                aria-pressed={on}
                style={{
                  border: 'none', cursor: 'pointer', borderRadius: RV.pill, padding: '8px 16px',
                  fontSize: 12.5, fontWeight: on ? 800 : 600,
                  background: on ? V.surface : 'transparent', color: on ? V.ink : V.muted,
                  boxShadow: on ? V.shadow : 'none',
                }}>
                {m.etiqueta}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: 12.5, color: V.muted }}>{ajuda}</span>
        {subs.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 12.5, color: V.muted }}>
            {subs.length} subratllat{subs.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {senseSessio && (
        <div style={{
          background: V.terraSoft, color: V.terraInk, borderRadius: RV.md,
          padding: '12px 16px', fontSize: 13.5, marginBottom: 16,
        }}>
          Inicia sessió per desar els teus subratllats i tenir-los també a l'app.
        </div>
      )}

      {carregant && (
        <div style={{ fontSize: 13, color: V.muted, marginBottom: 12 }}>Carregant els subratllats…</div>
      )}

      {/* El text */}
      <div
        ref={cos}
        className={`estudi-cos estudi-${mode}`}
        onMouseUp={mira}
        onTouchEnd={mira}
        onClick={clicCos}
      />

      {/* Tria de color en seleccionar */}
      {sel && (
        <div style={{
          position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)',
          zIndex: 120, background: V.surface, borderRadius: RV.lg, padding: 12,
          boxShadow: '0 14px 30px var(--v-shadow)', display: 'flex', gap: 8, flexWrap: 'wrap',
          maxWidth: 'calc(100vw - 32px)',
        }}>
          {COLORS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => void subratlla(c.key)}
              title={c.ajuda}
              style={{
                border: 'none', cursor: 'pointer', borderRadius: RV.md, padding: '9px 13px',
                background: c.fons, color: V.ink, fontSize: 12.5, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.punt }} />
              {c.etiqueta}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setSel(null); window.getSelection()?.removeAllRanges(); }}
            aria-label="Cancel·la"
            style={{
              border: 'none', cursor: 'pointer', borderRadius: RV.md, padding: '9px 11px',
              background: V.surface2, color: V.muted,
            }}>
            <I n="x" size={16} sw={2.2} />
          </button>
        </div>
      )}

      {/* Menú d'un subratllat ja fet */}
      {obert && (
        <div style={{
          position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)',
          zIndex: 120, background: V.surface, borderRadius: RV.lg, padding: 12,
          boxShadow: '0 14px 30px var(--v-shadow)', display: 'flex', gap: 8, flexWrap: 'wrap',
          alignItems: 'center', maxWidth: 'calc(100vw - 32px)',
        }}>
          {COLORS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => void canvia(c.key)}
              title={c.etiqueta}
              aria-label={c.etiqueta}
              style={{
                border: obert.color === c.key ? `2px solid ${V.ink}` : '2px solid transparent',
                cursor: 'pointer', borderRadius: '50%', width: 30, height: 30, background: c.punt,
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => void treu()}
            style={{
              border: 'none', cursor: 'pointer', borderRadius: RV.md, padding: '9px 13px',
              background: V.granateSoft, color: V.granate, fontSize: 12.5, fontWeight: 700,
            }}>
            Treure
          </button>
          <button
            type="button"
            onClick={() => setObert(null)}
            aria-label="Tanca"
            style={{
              border: 'none', cursor: 'pointer', borderRadius: RV.md, padding: '9px 11px',
              background: V.surface2, color: V.muted,
            }}>
            <I n="x" size={16} sw={2.2} />
          </button>
        </div>
      )}
    </div>
  );
}
