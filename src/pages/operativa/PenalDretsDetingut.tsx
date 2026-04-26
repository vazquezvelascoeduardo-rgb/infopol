// Pàgina de referència ràpida — Drets del detingut (Art. 520 LECrim).
// Pensada per a llegir-se ràpidament durant una intervenció. Inclou
// botó per copiar el text complet (per exemple per imprimir o
// adjuntar a l'atestat).
import { Link } from 'react-router-dom';
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
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa" className="hover:underline">{t('operativa.title')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa/penal" className="hover:underline">
          {t('operativa.seguretat-ciutadana.title')}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 font-medium">
          {t('penal.dretsDetingut')}
        </span>
      </nav>

      <header className="rounded-2xl border p-5 mb-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-3xl shrink-0">📜</span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.25em] text-red-600 dark:text-red-400">
              {t('operativa.seguretat-ciutadana.title')}
            </div>
            <h1 className="mt-0.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {t('penal.dretsDetingut.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('penal.dretsDetingut.desc')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyAll}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition
                  border-slate-200 bg-white hover:bg-slate-50 text-slate-700
                  dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200"
              >
                <span aria-hidden>{copied ? '✓' : '📋'}</span>
                {copied ? t('penal.dretsDetingut.copied') : t('penal.dretsDetingut.copyAll')}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition
                  border-slate-200 bg-white hover:bg-slate-50 text-slate-700
                  dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200"
              >
                <span aria-hidden>🖨️</span> {t('penal.dretsDetingut.print')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Drets bàsics */}
      <ol className="space-y-3 mb-6">
        {DRETS_BASIC.map((d) => (
          <li
            key={d.num}
            className="flex items-start gap-3 rounded-xl border p-4
              border-slate-200 bg-white
              dark:border-white/10 dark:bg-[#0f1d34]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-bold text-sm shrink-0">
              {d.num}
            </span>
            <div className="min-w-0">
              <div className="font-semibold">{d.titol}</div>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                {d.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-3 text-amber-700 dark:text-amber-300">
        ⚠️ {t('penal.dretsDetingut.special')}
      </h2>
      <ol className="space-y-3">
        {DRETS_EXTRA.map((d) => (
          <li
            key={d.num}
            className="flex items-start gap-3 rounded-xl border-l-4 p-4
              border-l-amber-500 border-amber-200 bg-amber-50 text-amber-900
              dark:border-l-amber-400/70 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm shrink-0">
              {d.num}
            </span>
            <div className="min-w-0">
              <div className="font-semibold">{d.titol}</div>
              <p className="mt-0.5 text-sm">{d.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
