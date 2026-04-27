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
  const { t } = useT();
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
        <PreCheckBox label={t('checklist.previousChecks')} icon="✅" items={node.checklist_previ} />
      )}
      {node.checklist_evidencial && node.checklist_evidencial.length > 0 && (
        <PreCheckBox label={t('checklist.evidentialTest')} icon="🧪" items={node.checklist_evidencial} />
      )}
      {node.checklist_simptomes && node.checklist_simptomes.length > 0 && (
        <PreCheckBox label={t('checklist.symptoms')} icon="👁️" items={node.checklist_simptomes} />
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

      {/* Bloc "Per a la butlleta" — concepte i article (amb botó copiar) */}
      {(node.concepte_butlleta || node.article_butlleta || node.barem) && (
        <div className="rounded-xl border-2 p-4
          border-current/40 bg-white/60 dark:bg-black/20">
          <div className="text-[11px] uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
            📝 {t('checklist.forTicket')}
          </div>
          {node.concepte_butlleta && (
            <div className="flex items-start gap-2">
              <p className="text-sm font-medium leading-snug flex-1">
                {node.concepte_butlleta}
              </p>
              <CopyButton text={node.concepte_butlleta} />
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-xs items-center">
            {node.article_butlleta && (
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono
                border-current/40 bg-white/40 dark:bg-black/30">
                <span aria-hidden>§</span> {node.article_butlleta}
                <CopyButton text={node.article_butlleta} compact />
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

      {/* Camps "extra" no enumerats explícitament. Pinten qualsevol
          camp string o string[] que el JSON tingui i que no s'hagi
          renderitzat ja en seccions anteriors. Útil per al mòdul Penal,
          que té dotzenes de camps específics (pena_149, accions_clau,
          frases_prohibides_pautes_3_3, criteris_habitualitat_TS, etc.) */}
      <ExtraFields node={node} />

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

// Botó per copiar text al porta-retalls amb feedback visual breu.
function CopyButton({ text, compact }: { text: string; compact?: boolean }) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback si clipboard API no disponible (HTTP, etc.)
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // Silent fail.
      }
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      title={t('checklist.copyToClipboard')}
      aria-label={t('checklist.copy')}
      className={`inline-flex items-center justify-center shrink-0 rounded-md border transition
        ${compact ? 'h-5 w-5 text-[10px]' : 'h-7 w-7 text-xs'}
        border-current/40 hover:bg-white/40 dark:hover:bg-black/30
        ${copied ? 'bg-green-200 dark:bg-green-400/30' : ''}`}
    >
      <span aria-hidden>{copied ? '✓' : '📋'}</span>
    </button>
  );
}

// Camps que ja s'han renderitzat explícitament a FinalCard. La resta
// es pinten amb el renderer genèric ExtraFields.
const HANDLED_FIELDS = new Set<string>([
  'final', 'tipus', 'titol', 'text', 'info',
  // Butlleta
  'concepte_butlleta', 'article_butlleta', 'barem',
  'concepte_butlleta_paral·lel', 'article_paralel_admin',
  // Multa / punts / pena
  'import', 'punts', 'punts_bici_vmp', 'pena',
  'pena_apartat_1', 'pena_apartat_2', 'pena_amb_perill',
  'pena_sense_perill_concret', 'pena_imprudencia_greu',
  'pena_imprudencia_menys_greu', 'pena_referencial',
  // Accions
  'accio', 'accions', 'accions_operatives',
  'accions_ordenades', 'accions_ordenades_critiques',
  // Documentació
  'document', 'documentacio', 'documentacio_clau', 'tiquet',
  // Drets / símptomes / requisits / excepcions / exemples
  'drets_informar_conductor', 'simptomes_clau_acreditar',
  'elements_a_acreditar', 'elements_provatoris_clau',
  'requisits', 'requisits_clau', 'requisits_obligatoris',
  'excepcions', 'excepcions_legitimes',
  'exemples', 'exemples_condicions', 'exemples_jurisprudència',
  // Notes
  'frase_advertiment_estandard',
  'info_clau', 'info_extra', 'info_butlleta', 'info_aplicabilitat',
  'info_immobilitzacio', 'info_reformes_habituals',
  // Misc
  'obligatorietat', 'responsabilitat', 'competencia',
  'compatible_amb', 'concurs_195_cp', 'diferencia_amb_admin',
  'base_legal',
]);

// Etiquetes humanes per a camps coneguts del mòdul Penal. Si un camp
// no és aquí, fem un format automàtic des del nom.
const FIELD_LABELS: Record<string, { label: string; icon?: string; tone?: 'warn' | 'info' | 'critical' }> = {
  // Penes específiques (CP)
  pena_basica: { label: 'Pena bàsica', icon: '⚖️' },
  pena_basica_163: { label: 'Pena bàsica (Art. 163)', icon: '⚖️' },
  pena_agreujada: { label: 'Pena agreujada', icon: '⚖️' },
  pena_combinada: { label: 'Pena combinada', icon: '⚖️' },
  pena_mort: { label: 'Pena (mort)', icon: '⚖️' },
  pena_violencia: { label: 'Pena (amb violència)', icon: '⚖️' },
  pena_sense_violencia: { label: 'Pena (sense violència)', icon: '⚖️' },
  pena_amb_violencia: { label: 'Pena (amb violència)', icon: '⚖️' },
  pena_amb_penetracio: { label: 'Pena (amb penetració)', icon: '⚖️' },
  pena_persona_vulnerable: { label: 'Pena (persona vulnerable)', icon: '⚖️' },
  pena_menor_165: { label: 'Pena (menor — Art. 165)', icon: '⚖️' },
  pena_segrest_164: { label: 'Pena (segrest — Art. 164)', icon: '⚖️' },
  pena_extrema_370: { label: 'Pena extrema (Art. 370)', icon: '⚖️' },
  pena_VG_VD: { label: 'Pena VG / VD', icon: '⚖️' },
  pena_no_greu: { label: 'Pena (no greu)', icon: '⚖️' },
  pena_greu_dany: { label: 'Pena (dany greu)', icon: '⚖️' },
  pena_habitada: { label: 'Pena (vivenda habitada)', icon: '⚖️' },
  pena_lesions_149: { label: 'Pena lesions (Art. 149)', icon: '⚖️' },
  pena_lesions_150: { label: 'Pena lesions (Art. 150)', icon: '⚖️' },
  pena_restitucio_48h: { label: 'Pena (sense restitució 48h)', icon: '⚖️' },
  pena_agreujada_estranger: { label: 'Pena agreujada (estranger)', icon: '⚖️' },
  // Accions específiques
  accio_immediata: { label: 'Acció immediata', icon: '⚡', tone: 'critical' },
  accions_clau: { label: 'Actuacions clau', icon: '🔑' },
  accions_essencials: { label: 'Actuacions essencials', icon: '⭐' },
  accions_ordenades_completes: { label: 'Actuacions ordenades (completes)', icon: '📋' },
  accions_ordenades_pautes: { label: 'Actuacions (Pautes UF)', icon: '📋' },
  accions_ordenades_pautes_3_3: { label: 'Actuacions (Pautes UF 3.3)', icon: '📋' },
  accions_pautes_3_3: { label: 'Actuacions (Pautes 3.3)', icon: '📋' },
  accions_operatives_ordenades: { label: 'Actuacions operatives ordenades', icon: '🚓' },
  accions_per_tipus: { label: 'Actuacions per tipus', icon: '📂' },
  accions_policia: { label: 'Actuacions policials', icon: '👮' },
  // Articles / concursos
  article: { label: 'Article aplicable', icon: '§' },
  articles: { label: 'Articles aplicables', icon: '§' },
  concepte: { label: 'Concepte', icon: '📝' },
  concepte_butlleta_atestat: { label: 'Concepte butlleta / atestat', icon: '📝' },
  concurs: { label: 'Concurs', icon: '🤝' },
  concurs_aplicable: { label: 'Concurs aplicable', icon: '🤝' },
  concurs_possible: { label: 'Concurs possible', icon: '🤝' },
  // Documentació
  documentacio_obligatoria: { label: 'Documentació obligatòria', icon: '📑' },
  documentacio_si_intervencio: { label: 'Documentació si hi ha intervenció', icon: '📑' },
  // Drets
  drets_a_llegir: { label: 'Drets a llegir', icon: '📢' },
  drets_obligatoris_informar: { label: 'Drets obligatoris a informar', icon: '📢' },
  drets_victima_obligatoris: { label: 'Drets víctima (obligatoris)', icon: '📢' },
  // Exemples
  exemple: { label: 'Exemple', icon: '💡' },
  exemples_36_6_pautes: { label: 'Exemples Art. 36.6 (Pautes)', icon: '💡' },
  exemples_pautes: { label: 'Exemples (Pautes)', icon: '💡' },
  exemples_per_sobre_80000: { label: 'Exemples > 80.000€', icon: '💡' },
  // Frases
  frases_prohibides_pautes_3_3: { label: 'Frases PROHIBIDES (Pautes 3.3)', icon: '🚫', tone: 'critical' },
  frases_evitar: { label: "Frases a evitar", icon: '🚫', tone: 'warn' },
  frases_utils: { label: 'Frases útils', icon: '💬', tone: 'info' },
  // Info
  info_VPR: { label: 'Info VPR (valoració risc)', icon: 'ℹ️', tone: 'info' },
  info_acta_A20: { label: "Info acta A-20", icon: 'ℹ️', tone: 'info' },
  info_concurs: { label: 'Info concurs', icon: 'ℹ️', tone: 'info' },
  info_critica: { label: 'Info crítica', icon: '🚨', tone: 'critical' },
  info_dubte_jutjat: { label: 'Dubte → Jutjat', icon: 'ℹ️', tone: 'info' },
  info_operativa_pautes: { label: 'Info operativa (Pautes)', icon: 'ℹ️', tone: 'info' },
  info_pautes_3_3: { label: 'Info (Pautes 3.3)', icon: 'ℹ️', tone: 'info' },
  info_suspensio_80_2: { label: "Info suspensió Art. 80.2", icon: 'ℹ️', tone: 'info' },
  informacio: { label: 'Informació', icon: 'ℹ️' },
  informacio_familia: { label: "Informació a la família", icon: 'ℹ️' },
  informacio_propietari: { label: "Informació al propietari", icon: 'ℹ️' },
  // Regla / criteris
  regla: { label: 'Regla', icon: '📐' },
  regla_concurs_pautes: { label: 'Regla del concurs (Pautes)', icon: '📐' },
  regla_pautes: { label: 'Regla (Pautes)', icon: '📐' },
  regla_principi_especialitat: { label: 'Principi d\'especialitat', icon: '📐' },
  criteri_clau_pautes: { label: 'Criteri clau (Pautes)', icon: '🔑' },
  criteris_habitualitat_TS: { label: 'Criteris d\'habitualitat (TS)', icon: '⚖️' },
  criteris_penal_229: { label: 'Criteris penals (Art. 229)', icon: '⚖️' },
  // Subjectes / àmbit / supòsits
  subjectes: { label: 'Subjectes', icon: '👥' },
  context_aplicable: { label: 'Context aplicable', icon: '🎯' },
  supòsits: { label: 'Supòsits', icon: '📂' },
  supòsits_agreujats: { label: 'Supòsits agreujats', icon: '⬆️' },
  supòsits_aplicables: { label: 'Supòsits aplicables', icon: '📂' },
  supòsits_típics: { label: 'Supòsits típics', icon: '📂' },
  conductes_típiques: { label: 'Conductes típiques', icon: '📂' },
  // Diferenciacions
  diferencia_admin: { label: 'Diferència amb via administrativa', icon: '↔️', tone: 'info' },
  diferencia_lleu: { label: 'Diferència (lleu)', icon: '↔️', tone: 'info' },
  diferencia_penal: { label: 'Diferència (penal)', icon: '↔️', tone: 'info' },
  diferenciacio: { label: 'Diferenciació', icon: '↔️' },
  // Altres
  agreujants: { label: 'Agreujants', icon: '⬆️', tone: 'warn' },
  agreujants_180: { label: 'Agreujants (Art. 180)', icon: '⬆️', tone: 'warn' },
  evidencies_clau: { label: 'Evidències clau', icon: '🔍' },
  internament_involuntari_763_LEC: { label: 'Internament involuntari (Art. 763 LEC)', icon: '🏥', tone: 'info' },
  perseguibilitat: { label: 'Perseguibilitat', icon: '⚖️' },
  que_NO_fer: { label: 'Què NO fer', icon: '🚫', tone: 'critical' },
  que_es_pot_revisar: { label: 'Què es pot revisar', icon: '👀' },
  requisit_clau: { label: 'Requisit clau', icon: '🔑' },
  requisits_per_practicar: { label: 'Requisits per practicar', icon: '✅' },
  requisits_pautes_3_3: { label: 'Requisits (Pautes 3.3)', icon: '✅' },
  subsupòsits: { label: 'Subsupòsits', icon: '📂' },
  tipologia_pautes_3_3: { label: 'Tipologia (Pautes 3.3)', icon: '📂' },
  tipus_accident: { label: 'Tipus d\'accident', icon: '💥' },
  transparencia_clau: { label: 'Transparència (clau)', icon: '🔍' },
  vies_aplicables: { label: 'Vies aplicables', icon: '🛣️' },
  vies_per_propietari: { label: 'Vies per al propietari', icon: '🛣️' },
  base_legal_extra: { label: 'Base legal addicional', icon: '📕' },
  delictes_aplicables: { label: 'Delictes aplicables', icon: '⚖️' },
  elements_essencials: { label: 'Elements essencials', icon: '🧷' },
  import_LOPSC: { label: 'Import (LOPSC)', icon: '💶' },
  import_llei_11_2009: { label: 'Import (Llei 11/2009)', icon: '💶' },
  indicis_homicidi_simulat: { label: 'Indicis d\'homicidi simulat', icon: '🚨', tone: 'critical' },
  casos_aixecament_obligatori_tot_i_natural: { label: 'Casos d\'aixecament obligatori', icon: '⚖️' },
};

// Converteix snake_case a "Snake case" amb la primera majúscula.
function humanize(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/^(.)/, (m) => m.toUpperCase());
}

function ExtraFields({ node }: { node: ChecklistFinalNode }) {
  // Iterem totes les claus del node, saltant les ja gestionades.
  const items: { key: string; value: string | string[] }[] = [];
  for (const [k, v] of Object.entries(node)) {
    if (HANDLED_FIELDS.has(k)) continue;
    if (v == null) continue;
    if (typeof v === 'string') {
      items.push({ key: k, value: v });
    } else if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
      items.push({ key: k, value: v as string[] });
    }
    // (objectes anidats: no els pintem aquí — molt rar a final node)
  }
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map(({ key, value }) => {
        const meta = FIELD_LABELS[key];
        const label = meta?.label ?? humanize(key);
        const icon = meta?.icon;
        const tone = meta?.tone;
        if (Array.isArray(value)) {
          if (tone === 'critical' || tone === 'warn') {
            return (
              <div
                key={key}
                className={`rounded-xl border-l-4 p-3 text-sm ${
                  tone === 'critical'
                    ? 'border-l-red-500 bg-red-50 text-red-900 dark:border-l-red-400/70 dark:bg-red-400/10 dark:text-red-100'
                    : 'border-l-amber-500 bg-amber-50 text-amber-900 dark:border-l-amber-400/70 dark:bg-amber-400/10 dark:text-amber-100'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                  {icon && <span aria-hidden>{icon}</span>}
                  {label}
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {value.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            );
          }
          return (
            <Section key={key} label={label} icon={icon}>
              <ul className="list-disc pl-5 space-y-1.5">
                {value.map((it, i) => <li key={i}>{it}</li>)}
              </ul>
            </Section>
          );
        }
        // String: el pintem com a InfoBox (info-style) o MiniField segons el to.
        if (tone === 'critical') {
          return (
            <div
              key={key}
              className="rounded-xl border-l-4 border-l-red-500 bg-red-50 p-3 text-sm text-red-900
                dark:border-l-red-400/70 dark:bg-red-400/10 dark:text-red-100"
            >
              <div className="text-[10px] uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                {icon && <span aria-hidden>{icon}</span>}
                {label}
              </div>
              <p>{value}</p>
            </div>
          );
        }
        if (tone === 'info') {
          return <InfoBox key={key} label={label} icon={icon} text={value} />;
        }
        return <MiniField key={key} label={label} value={value} icon={icon} />;
      })}
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
    case 'mixta':
      return {
        border: 'border-l-purple-500 dark:border-l-purple-400/70',
        bg: 'bg-purple-50 dark:bg-purple-400/10',
        text: 'text-purple-900 dark:text-purple-100',
        label: 'text-purple-700 dark:text-purple-300',
      };
    case 'avis':
      return {
        border: 'border-l-yellow-500 dark:border-l-yellow-400/70',
        bg: 'bg-yellow-50 dark:bg-yellow-400/10',
        text: 'text-yellow-900 dark:text-yellow-100',
        label: 'text-yellow-700 dark:text-yellow-300',
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
