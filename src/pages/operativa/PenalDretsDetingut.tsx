// Pàgina de referència ràpida — Drets del detingut (Art. 520 LECrim).
// Pensada per a llegir-se ràpidament durant una intervenció. Inclou
// botó per copiar el text complet (per exemple per imprimir o
// adjuntar a l'atestat).
import { useState } from 'react';
import { useT } from '../../lib/i18n';

const DRETS_BASIC: Array<{ num: number; titol: string; desc: string }> = [
  { num: 1, titol: 'Guardar silenci', desc: 'Dret a guardar silenci, no contestar a alguna pregunta o manifestar que només declararà davant del jutge' },
  { num: 2, titol: 'No declarar contra si mateix', desc: 'Dret a no declarar contra si mateix ni a confessar-se culpable' },
  { num: 3, titol: 'No declarar contra cònjuge / parents', desc: "Dret a no declarar contra cònjuge, parents en línia recta i col·laterals fins al 2n grau (Art. 416 LECrim)" },
  { num: 4, titol: 'Designar advocat', desc: "Dret a designar advocat de la seva elecció. Si no en designa o no és localitzable, advocat d'ofici" },
  { num: 5, titol: 'Entrevista reservada amb advocat', desc: "Dret a entrevistar-se reservadament amb el seu advocat (abans i després de la declaració)" },
  { num: 6, titol: 'Comunicar la detenció', desc: "Dret a comunicar la seva detenció i el lloc de custòdia a un familiar o persona designada" },
  { num: 7, titol: 'Intèrpret gratuït', desc: "Dret a la traducció i interpretació gratuïtes si no entén el castellà / català o és sord" },
  { num: 8, titol: 'Reconeixement mèdic', desc: "Dret a ser reconegut pel metge forense (o el seu substitut)" },
  { num: 9, titol: 'Accés a elements essencials', desc: "Dret a accedir als elements de les actuacions essencials per impugnar la legalitat de la detenció" },
  { num: 10, titol: 'Habeas Corpus', desc: "Dret a sol·licitar el procediment d'Habeas Corpus (LO 6/1984) si considera que la detenció és il·legal" },
];

const DRETS_EXTRA: Array<{ num: number; titol: string; desc: string }> = [
  { num: 11, titol: 'Notificació consular (estrangers)', desc: "Si el detingut és estranger, dret a comunicar la detenció a l'autoritat consular del seu país" },
  { num: 12, titol: 'Pares / tutors + Fiscalia (menors)', desc: "Si és menor, dret a la presència dels pares/tutors durant les diligències i comunicació immediata al Ministeri Fiscal de Menors" },
];

export default function PenalDretsDetingut() {
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  // Text complet per copiar/imprimir
  const fullText = [
    'DRETS DEL DETINGUT — Art. 520 LECrim',
    '',
    ...DRETS_BASIC.map((d) => `${d.num}. ${d.titol}\n   ${d.desc}`),
    '',
    'CASOS ESPECIALS:',
    ...DRETS_EXTRA.map((d) => `${d.num}. ${d.titol}\n   ${d.desc}`),
  ].join('\n');

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent
    }
  }

  return (
    <div className="v3-page v3-anim" style={{ maxWidth: 760 }}>

      <header
        className="op-runner-head"
        style={{ ['--accent' as never]: '#ef4444' } as React.CSSProperties}
      >
        <span className="op-runner-icon" aria-hidden>📜</span>
        <div className="op-runner-text">
          <span className="eyebrow">SC / PENAL · ART. 520 LECRIM</span>
          <h1>{t('penal.dretsDetingut.title')}</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: '6px 0 10px' }}>
            {t('penal.dretsDetingut.desc')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyAll}
              className="rounded-lg border border-line bg-paper hover:bg-paper-2 px-3 py-1.5 text-sm font-bold inline-flex items-center gap-1.5 text-ink"
            >
              <span aria-hidden>{copied ? '✓' : '📋'}</span>
              {copied ? t('penal.dretsDetingut.copied') : t('penal.dretsDetingut.copyAll')}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-line bg-paper hover:bg-paper-2 px-3 py-1.5 text-sm font-bold inline-flex items-center gap-1.5 text-ink"
            >
              <span aria-hidden>🖨️</span> {t('penal.dretsDetingut.print')}
            </button>
          </div>
        </div>
      </header>

      {/* Drets bàsics */}
      <ol className="drets-list">
        {DRETS_BASIC.map((d) => (
          <li key={d.num} className="dret-item">
            <span className="dret-num" style={{ background: '#ef4444' }}>{d.num}</span>
            <div className="dret-text">
              <div className="dret-titol">{d.titol}</div>
              <p className="dret-desc">{d.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div
        className="section-head"
        style={{ ['--accent' as never]: '#9A5B00', marginTop: 28 } as React.CSSProperties}
      >
        <span className="eyebrow">⚠️ {t('penal.dretsDetingut.special').toUpperCase()}</span>
        <span className="rule" />
      </div>

      <ol className="drets-list">
        {DRETS_EXTRA.map((d) => (
          <li key={d.num} className="dret-item dret-warn">
            <span className="dret-num" style={{ background: '#c99d2a' }}>{d.num}</span>
            <div className="dret-text">
              <div className="dret-titol">{d.titol}</div>
              <p className="dret-desc">{d.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
