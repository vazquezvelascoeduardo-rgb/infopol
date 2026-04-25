// Runner d'un checklist operatiu (arbre de decisió).
//
// Gestiona el recorregut pel graf de nodes: cada node intermedi mostra
// una llista d'opcions (botons grans, pensats per al mòbil); en clicar,
// avancem al node indicat per `va_a` i guardem l'historial.
//
// Quan arribem a un node final, mostrem una targeta amb el resultat:
// import, punts, pena, accions, document i base legal — amb colors
// diferents segons el `tipus`.
import { useEffect, useState } from 'react';
import {
  asList,
  isFinalNode,
  type Checklist,
  type ChecklistFinalNode,
  type ChecklistNode,
  type ChecklistResultKind,
} from '../lib/operativa-trafico';
import { useT } from '../lib/i18n';

type Props = { checklist: Checklist };

export default function ChecklistRunner({ checklist }: Props) {
  const { t } = useT();
  // Pila d'IDs de nodes visitats. El darrer és l'actiu. Comença amb
  // `inici`. En clicar una opció, hi afegim el seu `va_a`. En clicar
  // "enrere", treiem el darrer.
  const [trail, setTrail] = useState<string[]>([checklist.inici]);

  // Si canvia el checklist (l'usuari va a un altre escenari) reiniciem.
  useEffect(() => {
    setTrail([checklist.inici]);
  }, [checklist.id, checklist.inici]);

  const currentId = trail[trail.length - 1];
  const node: ChecklistNode | undefined = checklist.nodes[currentId];

  // Detecció de referències trencades (millor mostrar un error clar).
  if (!node) {
    return (
      <div className="rounded-xl border-l-4 border-l-red-500 bg-red-50 p-4 text-red-900
        dark:bg-red-400/10 dark:text-red-200 dark:border-l-red-400/70">
        <div className="font-semibold">{t('checklist.brokenLink')}</div>
        <div className="text-sm mt-1">
          {t('checklist.brokenLinkDetail').replace('{id}', currentId)}
        </div>
        <button
          type="button"
          onClick={() => setTrail([checklist.inici])}
          className="mt-3 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold
            border-red-300 text-red-700 hover:bg-red-100
            dark:border-red-400/40 dark:text-red-200 dark:hover:bg-red-400/10"
        >
          ↻ {t('checklist.restart')}
        </button>
      </div>
    );
  }

  function goTo(id: string) {
    setTrail((prev) => [...prev, id]);
  }
  function goBack() {
    setTrail((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }
  function restart() {
    setTrail([checklist.inici]);
  }

  return (
    <div className="space-y-4">
      {/* Notes tècniques desplegables (informació del checklist sencer) */}
      <ChecklistTechnicalNotes checklist={checklist} />

      {/* Barra superior amb accions: enrere + reiniciar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          disabled={trail.length <= 1}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition
            border-slate-200 hover:bg-slate-50 text-slate-700
            dark:border-white/10 dark:hover:bg-white/5 dark:text-slate-200
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← {t('checklist.back')}
        </button>
        <button
          type="button"
          onClick={restart}
          disabled={trail.length === 1}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition
            border-slate-200 hover:bg-slate-50 text-slate-700
            dark:border-white/10 dark:hover:bg-white/5 dark:text-slate-200
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↻ {t('checklist.restart')}
        </button>
        {trail.length > 1 && (
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
            {t('checklist.step').replace('{n}', String(trail.length))}
          </span>
        )}
      </div>

      {isFinalNode(node) ? (
        <FinalCard node={node} onRestart={restart} />
      ) : (
        <QuestionPanel node={node} onSelect={goTo} />
      )}

      {/* Notes finals globals del checklist (recordatoris generals) */}
      {checklist.notes_finals && checklist.notes_finals.length > 0 && (
        <div className="rounded-xl border p-4 text-sm
          border-slate-200 bg-slate-50 text-slate-700
          dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <div className="text-[10px] uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
            📌 {t('checklist.tech.finalNotes')}
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {checklist.notes_finals.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function QuestionPanel({
  node,
  onSelect,
}: {
  node: Exclude<ChecklistNode, ChecklistFinalNode>;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {/* Pregunta */}
      <header className="rounded-2xl border p-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        {node.titol && (
          <div className="text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/90">
            {node.titol}
          </div>
        )}
        {node.text && (
          <h2 className="mt-1 text-lg sm:text-xl font-bold tracking-tight">
            {node.text}
          </h2>
        )}
        {node.info && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            ℹ️ {node.info}
          </p>
        )}
      </header>

      {/* Llistes auxiliars opcionals (preparació, evidencial, símptomes…) */}
      {node.checklist_previ && node.checklist_previ.length > 0 && (
        <PreCheckBox label="Comprovacions prèvies" icon="✅" items={node.checklist_previ} />
      )}
      {node.checklist_evidencial && node.checklist_evidencial.length > 0 && (
        <PreCheckBox label="Prova evidencial — passos" icon="🧪" items={node.checklist_evidencial} />
      )}
      {node.checklist_simptomes && node.checklist_simptomes.length > 0 && (
        <PreCheckBox label="Símptomes a observar" icon="👁️" items={node.checklist_simptomes} />
      )}
      {node.frase_advertiment && (
        <blockquote className="rounded-xl border-l-4 border-l-amber-500 bg-amber-50 p-4 text-amber-900 italic
          dark:border-l-amber-400/70 dark:bg-amber-400/10 dark:text-amber-100">
          <div className="text-[10px] uppercase tracking-wider font-bold not-italic mb-1">
            🗣️ Frase d'advertiment
          </div>
          {node.frase_advertiment}
        </blockquote>
      )}

      {/* Opcions (botons grans, mín. 50px alçada per a mòbil) */}
      <ul className="grid grid-cols-1 gap-2.5">
        {node.opcions.map((op, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onSelect(op.va_a)}
              className="w-full text-left flex items-center gap-3 rounded-xl border min-h-[56px] px-4 py-3 transition shadow-sm
                hover:-translate-y-0.5 hover:shadow-md
                border-slate-200 bg-white hover:border-blue-400/60
                dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
            >
              <span className="font-semibold flex-1">{op.etiqueta}</span>
              <span aria-hidden className="text-blue-600 dark:text-blue-400 text-xl">→</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function FinalCard({
  node,
  onRestart,
}: {
  node: ChecklistFinalNode;
  onRestart: () => void;
}) {
  const { t } = useT();
  const style = kindStyle(node.tipus);

  return (
    <article className={`rounded-2xl border-l-8 p-5 sm:p-6 shadow-sm space-y-4
      ${style.border} ${style.bg} ${style.text}`}>
      {/* Etiqueta del tipus + títol */}
      <header>
        <div className={`text-[11px] uppercase tracking-[0.25em] font-bold ${style.label}`}>
          {t(`checklist.kind.${node.tipus ?? 'procediment'}`)}
        </div>
        <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight">
          {node.titol}
        </h2>
        {node.text && (
          <p className="mt-2 text-sm opacity-90">{node.text}</p>
        )}
        {node.info && (
          <p className="mt-2 text-sm opacity-90">ℹ️ {node.info}</p>
        )}
      </header>

      {/* Bloc "Per a la butlleta" — concepte i article */}
      {(node.concepte_butlleta || node.article_butlleta || node.barem) && (
        <div className="rounded-xl border-2 p-4
          border-current/40 bg-white/60 dark:bg-black/20">
          <div className="text-[11px] uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
            📝 {t('checklist.forTicket')}
          </div>
          {node.concepte_butlleta && (
            <p className="text-sm font-medium leading-snug">
              {node.concepte_butlleta}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {node.article_butlleta && (
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono
                border-current/40 bg-white/40 dark:bg-black/30">
                <span aria-hidden>§</span> {node.article_butlleta}
              </span>
            )}
            {node.barem && (
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono
                border-current/40 bg-white/40 dark:bg-black/30">
                <span aria-hidden>📊</span> {node.barem}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sanció administrativa paral·lela (si la via principal és penal) */}
      {(node['concepte_butlleta_paral·lel'] || node.article_paralel_admin) && (
        <div className="rounded-xl border-l-4 border-l-amber-500 bg-amber-50 p-4 text-amber-900
          dark:border-l-amber-400/70 dark:bg-amber-400/10 dark:text-amber-100">
          <div className="text-[11px] uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
            ⚠️ {t('checklist.parallelTicket')}
          </div>
          {node['concepte_butlleta_paral·lel'] && (
            <p className="text-sm leading-snug">
              {node['concepte_butlleta_paral·lel']}
            </p>
          )}
          {node.article_paralel_admin && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-mono
              border-amber-500/50 bg-white/60 dark:bg-black/30">
              <span aria-hidden>§</span> {node.article_paralel_admin}
            </span>
          )}
        </div>
      )}

      {/* Camps clau en graella */}
      {(node.import || node.punts || node.pena || node.punts_bici_vmp) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {node.import && (
            <KeyField label={t('checklist.fine')} value={node.import} icon="💶" />
          )}
          {node.punts && (
            <KeyField label={t('checklist.points')} value={node.punts} icon="🪪" />
          )}
          {node.punts_bici_vmp && (
            <KeyField label={t('checklist.pointsBiciVmp')} value={node.punts_bici_vmp} icon="🚲" />
          )}
          {node.pena && (
            <KeyField label={t('checklist.penalty')} value={node.pena} icon="⚖️" wide />
          )}
        </div>
      )}

      {/* Variants de pena (només per a delictes que tenen distincions) */}
      {(node.pena_apartat_1 ||
        node.pena_apartat_2 ||
        node.pena_amb_perill ||
        node.pena_sense_perill_concret ||
        node.pena_imprudencia_greu ||
        node.pena_imprudencia_menys_greu ||
        node.pena_referencial) && (
        <Section label={t('checklist.penaltyVariants')} icon="⚖️">
          <ul className="space-y-1.5">
            {node.pena_apartat_1 && (
              <li><strong>{t('checklist.penaltySection1')}:</strong> {node.pena_apartat_1}</li>
            )}
            {node.pena_apartat_2 && (
              <li><strong>{t('checklist.penaltySection2')}:</strong> {node.pena_apartat_2}</li>
            )}
            {node.pena_amb_perill && (
              <li><strong>{t('checklist.penaltyWithDanger')}:</strong> {node.pena_amb_perill}</li>
            )}
            {node.pena_sense_perill_concret && (
              <li><strong>{t('checklist.penaltyNoDanger')}:</strong> {node.pena_sense_perill_concret}</li>
            )}
            {node.pena_imprudencia_greu && (
              <li><strong>{t('checklist.penaltyGrossNeg')}:</strong> {node.pena_imprudencia_greu}</li>
            )}
            {node.pena_imprudencia_menys_greu && (
              <li><strong>{t('checklist.penaltyLessNeg')}:</strong> {node.pena_imprudencia_menys_greu}</li>
            )}
            {node.pena_referencial && (
              <li><strong>{t('checklist.penaltyRef')}:</strong> {node.pena_referencial}</li>
            )}
          </ul>
        </Section>
      )}

      {/* Frase d'advertiment estàndard (penal) */}
      {node.frase_advertiment_estandard && (
        <blockquote className="rounded-xl border-l-4 border-l-amber-500 bg-amber-50 p-4 text-amber-900 italic
          dark:border-l-amber-400/70 dark:bg-amber-400/10 dark:text-amber-100">
          <div className="text-[10px] uppercase tracking-wider font-bold not-italic mb-1">
            🗣️ {t('checklist.standardWarning')}
          </div>
          {node.frase_advertiment_estandard}
        </blockquote>
      )}

      {/* Acció única */}
      {node.accio && (
        <Section label={t('checklist.action')} icon="👉">
          <p>{node.accio}</p>
        </Section>
      )}

      {/* Accions ORDENADES CRÍTIQUES (destacades en vermell) */}
      {node.accions_ordenades_critiques && node.accions_ordenades_critiques.length > 0 && (
        <div className="rounded-xl border-l-4 border-l-red-500 bg-red-50 p-4 text-red-900
          dark:border-l-red-400/70 dark:bg-red-400/10 dark:text-red-100">
          <div className="text-[10px] uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
            🚨 {t('checklist.criticalSteps')}
          </div>
          <ol className="space-y-1.5 list-decimal pl-5 text-sm">
            {node.accions_ordenades_critiques.map((a, i) => (
              <li key={i} className="font-medium">{a}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Accions ORDENADES (numerades) */}
      {node.accions_ordenades && node.accions_ordenades.length > 0 && (
        <Section label={t('checklist.orderedSteps')} icon="🚓">
          <ol className="space-y-1.5 list-decimal pl-5">
            {node.accions_ordenades.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        </Section>
      )}

      {/* Accions OPERATIVES */}
      {asList(node.accions_operatives).length > 0 && (
        <Section label={t('checklist.operativeActions')} icon="🛠️">
          <ul className="space-y-1.5 list-disc pl-5">
            {asList(node.accions_operatives).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Llista d'accions genèrica (manté compatibilitat) */}
      {asList(node.accions).length > 0 && (
        <Section label={t('checklist.actions')} icon="📋">
          <ul className="space-y-1.5 list-disc pl-5">
            {asList(node.accions).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Drets a informar al conductor */}
      {node.drets_informar_conductor && node.drets_informar_conductor.length > 0 && (
        <Section label={t('checklist.driverRights')} icon="📢">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.drets_informar_conductor.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Símptomes a acreditar (penal) */}
      {node.simptomes_clau_acreditar && node.simptomes_clau_acreditar.length > 0 && (
        <Section label={t('checklist.symptomsToProve')} icon="🩺">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.simptomes_clau_acreditar.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Elements a acreditar / probatoris clau */}
      {node.elements_a_acreditar && node.elements_a_acreditar.length > 0 && (
        <Section label={t('checklist.elementsToProve')} icon="🔍">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.elements_a_acreditar.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Section>
      )}
      {node.elements_provatoris_clau && node.elements_provatoris_clau.length > 0 && (
        <Section label={t('checklist.keyEvidence')} icon="🧷">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.elements_provatoris_clau.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Requisits (genèric, clau, obligatoris) */}
      {node.requisits && node.requisits.length > 0 && (
        <Section label={t('checklist.requirements')} icon="✅">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.requisits.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      )}
      {node.requisits_clau && node.requisits_clau.length > 0 && (
        <Section label={t('checklist.keyRequirements')} icon="🔑">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.requisits_clau.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      )}
      {node.requisits_obligatoris && node.requisits_obligatoris.length > 0 && (
        <Section label={t('checklist.mandatoryRequirements')} icon="❗">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.requisits_obligatoris.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Excepcions */}
      {node.excepcions && (
        <Section label={t('checklist.exceptions')} icon="🚫">
          <p>{node.excepcions}</p>
        </Section>
      )}
      {node.excepcions_legitimes && node.excepcions_legitimes.length > 0 && (
        <Section label={t('checklist.legitExceptions')} icon="⚖️">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.excepcions_legitimes.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Exemples */}
      {asList(node.exemples).length > 0 && (
        <Section label={t('checklist.examples')} icon="💡">
          <ul className="space-y-1.5 list-disc pl-5">
            {asList(node.exemples).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Section>
      )}
      {node.exemples_condicions && node.exemples_condicions.length > 0 && (
        <Section label={t('checklist.conditionExamples')} icon="📌">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.exemples_condicions.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Section>
      )}
      {node['exemples_jurisprudència'] && node['exemples_jurisprudència'].length > 0 && (
        <Section label={t('checklist.caseLaw')} icon="🏛️">
          <ul className="space-y-1.5 list-disc pl-5">
            {node['exemples_jurisprudència'].map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Document a generar */}
      {node.document && (
        <Section label={t('checklist.document')} icon="📄">
          <p className="font-medium">{node.document}</p>
        </Section>
      )}

      {/* Documentació (variant string més genèrica) */}
      {node.documentacio && (
        <Section label={t('checklist.documentation')} icon="📑">
          <p>{node.documentacio}</p>
        </Section>
      )}

      {/* Documentació clau (string o llista) */}
      {asList(node.documentacio_clau).length > 0 && (
        <Section label={t('checklist.keyDocumentation')} icon="🗂️">
          <ul className="space-y-1.5 list-disc pl-5">
            {asList(node.documentacio_clau).map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Tiquet (instruccions sobre el tiquet/comprovant) */}
      {node.tiquet && (
        <Section label={t('checklist.ticket')} icon="🧾">
          <p>{node.tiquet}</p>
        </Section>
      )}

      {/* Notes informatives addicionals (info_*) */}
      {node.info_clau && (
        <InfoBox label={t('checklist.keyInfo')} icon="🔑" text={node.info_clau} />
      )}
      {node.info_extra && (
        <InfoBox label={t('checklist.extraInfo')} icon="ℹ️" text={node.info_extra} />
      )}
      {node.info_butlleta && (
        <InfoBox label={t('checklist.ticketInfo')} icon="📝" text={node.info_butlleta} />
      )}
      {node.info_aplicabilitat && (
        <InfoBox label={t('checklist.applicabilityInfo')} icon="🎯" text={node.info_aplicabilitat} />
      )}
      {node.info_immobilitzacio && (
        <InfoBox label={t('checklist.immobilizationInfo')} icon="🛑" text={node.info_immobilitzacio} />
      )}
      {node.info_reformes_habituals && node.info_reformes_habituals.length > 0 && (
        <Section label={t('checklist.commonModifications')} icon="🔧">
          <ul className="space-y-1.5 list-disc pl-5">
            {node.info_reformes_habituals.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Camps miscel·lanis (obligatorietat, responsabilitat, competència…) */}
      {node.obligatorietat && (
        <MiniField label={t('checklist.obligation')} value={node.obligatorietat} icon="📌" />
      )}
      {node.responsabilitat && (
        <MiniField label={t('checklist.responsibility')} value={node.responsabilitat} icon="👥" />
      )}
      {node.competencia && (
        <MiniField label={t('checklist.competence')} value={node.competencia} icon="🏛️" />
      )}
      {node.compatible_amb && (
        <MiniField label={t('checklist.compatibleWith')} value={node.compatible_amb} icon="🔗" />
      )}
      {node.concurs_195_cp && (
        <MiniField label={t('checklist.concurrenceArt195')} value={node.concurs_195_cp} icon="🤝" />
      )}
      {node.diferencia_amb_admin && (
        <MiniField label={t('checklist.differenceWithAdmin')} value={node.diferencia_amb_admin} icon="↔️" />
      )}

      {/* Base legal */}
      {node.base_legal && node.base_legal.length > 0 && (
        <Section label={t('checklist.legalBasis')} icon="📕">
          <ul className="flex flex-wrap gap-1.5">
            {node.base_legal.map((b, i) => (
              <li
                key={i}
                className="rounded-md border px-2 py-0.5 text-xs font-mono
                  border-current/40 bg-white/40 dark:bg-black/20"
              >
                {b}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* CTA */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold transition
            border-current/40 hover:bg-white/30 dark:hover:bg-black/20"
        >
          ↻ {t('checklist.startOver')}
        </button>
      </div>
    </article>
  );
}

function KeyField({
  label,
  value,
  icon,
  wide,
}: {
  label: string;
  value: string;
  icon?: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-white/60 dark:bg-black/20 p-3
      border-current/30 ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">{label}</div>
      <div className="flex items-center gap-2 text-base font-bold">
        {icon && <span aria-hidden className="text-lg">{icon}</span>}
        <span>{value}</span>
      </div>
    </div>
  );
}

function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-1.5 flex items-center gap-1.5">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

// Notes tècniques globals d'un checklist (marges d'error, terminis,
// límits genèrics, etc.). Es mostren dins d'un <details> col·lapsable
// perquè ocupin poc espai per defecte però estiguin sempre a mà.
function ChecklistTechnicalNotes({ checklist: c }: { checklist: Checklist }) {
  const { t } = useT();
  const dictSections: Array<{ label: string; dict: Record<string, string> | undefined }> = [
    { label: t('checklist.tech.alcoholMargins'), dict: c.marges_error_etilometre },
    { label: t('checklist.tech.speedMargins'), dict: c.marges_error_cinemometres },
    { label: t('checklist.tech.speedCameraTypes'), dict: c.tipus_cinemometres },
    { label: t('checklist.tech.speedLimits'), dict: c.limits_genics_via },
    { label: t('checklist.tech.itvDeadlines'), dict: c.terminis_itv_vigents },
    { label: t('checklist.tech.itvStates'), dict: c.estats_itv_possibles },
    { label: t('checklist.tech.permitDeadlines'), dict: c.terminis_caducitat_permis },
    { label: t('checklist.tech.diffAdminPenal'), dict: c.diferencia_clau_admin_penal },
  ];
  const hasDiferenciaClau =
    c.diferencia_clau != null &&
    (typeof c.diferencia_clau === 'string'
      ? c.diferencia_clau.length > 0
      : Object.keys(c.diferencia_clau).length > 0);
  const hasAny =
    dictSections.some((s) => s.dict && Object.keys(s.dict).length > 0) ||
    hasDiferenciaClau ||
    (c.comprovacions_previes?.length ?? 0) > 0 ||
    (c.prioritats_actuacio?.length ?? 0) > 0 ||
    (c.substancies_detectades_drogotest?.length ?? 0) > 0 ||
    !!c.barem_oficial_sct;
  if (!hasAny) return null;
  return (
    <details className="rounded-xl border bg-slate-50 dark:bg-white/5 dark:border-white/10
      border-slate-200 group">
      <summary className="cursor-pointer select-none px-4 py-2.5 text-sm font-semibold flex items-center gap-2">
        <span aria-hidden>📚</span>
        {t('checklist.tech.title')}
        <span aria-hidden className="ml-auto text-xs opacity-60 group-open:rotate-90 transition-transform">▶</span>
      </summary>
      <div className="px-4 pb-4 space-y-3 text-sm">
        {c.barem_oficial_sct && (
          <p className="italic text-slate-600 dark:text-slate-400">{c.barem_oficial_sct}</p>
        )}
        {c.comprovacions_previes && c.comprovacions_previes.length > 0 && (
          <div>
            <div className="font-semibold mb-1">{t('checklist.tech.priorChecks')}</div>
            <ul className="list-disc pl-5 space-y-0.5">
              {c.comprovacions_previes.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          </div>
        )}
        {c.prioritats_actuacio && c.prioritats_actuacio.length > 0 && (
          <div>
            <div className="font-semibold mb-1">{t('checklist.tech.actionPriorities')}</div>
            <ul className="list-decimal pl-5 space-y-0.5">
              {c.prioritats_actuacio.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          </div>
        )}
        {c.substancies_detectades_drogotest && c.substancies_detectades_drogotest.length > 0 && (
          <div>
            <div className="font-semibold mb-1">{t('checklist.tech.drugsDetected')}</div>
            <ul className="list-disc pl-5 space-y-0.5">
              {c.substancies_detectades_drogotest.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          </div>
        )}
        {hasDiferenciaClau && typeof c.diferencia_clau === 'string' && (
          <div>
            <div className="font-semibold mb-1">{t('checklist.tech.keyDiff')}</div>
            <p>{c.diferencia_clau}</p>
          </div>
        )}
        {hasDiferenciaClau && typeof c.diferencia_clau === 'object' && (
          <DictTable label={t('checklist.tech.keyDiff')} dict={c.diferencia_clau} />
        )}
        {dictSections.map((s) =>
          s.dict && Object.keys(s.dict).length > 0 ? (
            <DictTable key={s.label} label={s.label} dict={s.dict} />
          ) : null,
        )}
      </div>
    </details>
  );
}

// Pinta un Record<string,string> com a taula clau→valor.
function DictTable({ label, dict }: { label: string; dict: Record<string, string> }) {
  return (
    <div>
      <div className="font-semibold mb-1">{label}</div>
      <dl className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-3 gap-y-1">
        {Object.entries(dict).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-mono text-xs uppercase opacity-70">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Camp inline curt: etiqueta + valor en una sola línia.
function MiniField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm rounded-lg border px-3 py-2
      border-current/30 bg-white/40 dark:bg-black/20">
      {icon && <span aria-hidden className="text-base mt-0.5">{icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider font-bold opacity-70">
          {label}
        </div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

// Caixa de nota informativa amb fons subtil.
function InfoBox({
  label,
  icon,
  text,
}: {
  label: string;
  icon?: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border-l-4 p-3 text-sm
      border-l-blue-400 bg-blue-50/60 text-blue-900
      dark:border-l-blue-400/70 dark:bg-blue-400/10 dark:text-blue-100">
      <div className="text-[10px] uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </div>
      <p>{text}</p>
    </div>
  );
}

// Caixa amb un títol i una llista de bullets. Usada per als checklist_*
// i seccions auxiliars del node intermedi.
function PreCheckBox({
  label,
  icon,
  items,
}: {
  label: string;
  icon?: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border p-4
      border-slate-200 bg-slate-50 text-slate-700
      dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      <div className="text-[11px] uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </div>
      <ul className="space-y-1.5 list-disc pl-5 text-sm">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function kindStyle(kind: ChecklistResultKind | undefined) {
  switch (kind) {
    case 'ok':
      return {
        border: 'border-l-green-500 dark:border-l-green-400/70',
        bg: 'bg-green-50 dark:bg-green-400/10',
        text: 'text-green-900 dark:text-green-100',
        label: 'text-green-700 dark:text-green-300',
      };
    case 'administrativa':
      return {
        border: 'border-l-amber-500 dark:border-l-amber-400/70',
        bg: 'bg-amber-50 dark:bg-amber-400/10',
        text: 'text-amber-900 dark:text-amber-100',
        label: 'text-amber-700 dark:text-amber-300',
      };
    case 'penal':
      return {
        border: 'border-l-red-500 dark:border-l-red-400/70',
        bg: 'bg-red-50 dark:bg-red-400/10',
        text: 'text-red-900 dark:text-red-100',
        label: 'text-red-700 dark:text-red-300',
      };
    case 'procediment':
    default:
      return {
        border: 'border-l-blue-500 dark:border-l-blue-400/70',
        bg: 'bg-blue-50 dark:bg-blue-400/10',
        text: 'text-blue-900 dark:text-blue-100',
        label: 'text-blue-700 dark:text-blue-300',
      };
  }
}
