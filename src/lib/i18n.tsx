// Sistema de traduccions (i18n) de la app.
// Gestió: guardem l'idioma al localStorage i sincronitzem amb l'atribut
// `lang` del <html>. Per defecte, espanyol.
//
// Ús a un component:
//   const { t, locale, setLocale } = useT();
//   <h1>{t('home.title')}</h1>
//
// Les claus són "estables" i funcionen com a identificadors — si una clau
// no existeix en algun idioma, es retorna la clau tal qual (perquè saltin
// a la vista les mancances).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Locale = 'es' | 'ca';
const STORAGE_KEY = 'infopol-locale';

type Dict = Record<string, string>;

const DICT: Record<Locale, Dict> = {
  es: {
    // Header / layout
    'app.tagline': 'Consulta operativa',
    'nav.home': 'Inicio',
    'search.label': 'Buscar',
    'search.placeholder': 'Buscar por artículo, norma, palabra clave…',
    'theme.toLight': 'Cambiar a modo claro',
    'theme.toDark': 'Cambiar a modo oscuro',
    'theme.light': 'Tema claro',
    'theme.dark': 'Tema oscuro',
    'lang.toggle': 'Cambiar idioma',
    'footer': 'InfoPol · Consulta personal · Información no oficial.',

    // Home (landing principal: 2 grandes opciones)
    'home.badge': 'Esquema operativo policial',
    'home.title': 'Consulta rápida',
    'home.subtitle':
      'Normativa, infografías y procedimientos operativos para el agente de policía local. Elige una sección.',
    'home.sections': 'Secciones',
    'home.leyes.badge': 'Temario',
    'home.leyes.title': 'Leyes',
    'home.leyes.desc':
      'Constitución, Código Penal, LECrim, FCS, Tráfico, Seguridad Ciudadana y más. Todas las infografías y normativa.',
    'home.leyes.cta': 'Abrir leyes',
    'home.operativa.badge': 'En la calle',
    'home.operativa.title': 'Operativa',
    'home.operativa.desc':
      'Procedimientos por situación: tráfico, seguridad ciudadana… Selecciona y obtén la norma aplicable.',
    'home.operativa.cta': 'Abrir operativa',

    // Leyes
    'leyes.badge': 'Temario · Normativa',
    'leyes.title': 'Leyes',
    'leyes.subtitle':
      'Normativa, infografías y fichas operativas para el agente de policía local. Elige una sección o usa el buscador para ir directo.',

    // Operativa
    'operativa.badge': 'Procedimientos en la calle',
    'operativa.title': 'Operativa',
    'operativa.subtitle': 'Selecciona el tema operativo con el que estás trabajando.',
    'operativa.comingSoon': 'En construcción',
    'operativa.open': 'Abrir',
    'operativa.trafico.title': 'Tráfico',
    'operativa.trafico.desc': 'Identifica la infracción y aplica la norma',
    'operativa.seguretat-ciutadana.title': 'Seguridad Ciudadana / Penal',
    'operativa.seguretat-ciutadana.desc': 'Procedimientos operativos: identificación, escorcoll, detención, lesiones, VG/VD…',
    'penal.totalScenarios': 'escenarios',
    'penal.backToList': 'Volver al listado de Seguridad Ciudadana / Penal',
    'penal.references': 'Referencias rápidas',
    'penal.taulaActes': 'Tabla de actas policiales',
    'penal.taulaActes.desc': 'Cuándo usar D-10, D-10.b, A-10, A-20, atestado…',
    'penal.taulaDrogues': 'Tabla drogas (consumo vs tráfico)',
    'penal.taulaDrogues.title': 'Tabla de cantidades — consumo propio vs tráfico',
    'penal.taulaDrogues.desc': 'Pautas UF 3.3 — orientativo, no constitutivo',
    'penal.taulaDrogues.warning': 'Tabla orientativa',
    'penal.taulaDrogues.warningText': 'Las cantidades indicadas son orientativas (Pautas UF 3.3 ISPC). Cada caso requiere valoración judicial. La presencia de báscula, dosis preparadas, dinero fraccionado o substancias adulterantes son indicios de tráfico independientemente de la cantidad.',
    'penal.taulaDrogues.substance': 'Substancia',
    'penal.taulaDrogues.usualDose': 'Dosis habitual',
    'penal.taulaDrogues.limit35': 'Límite consumo 3-5 días',
    'penal.taulaDrogues.howToInterpret': 'Cómo se interpreta',
    'penal.taulaDrogues.note1': 'Por debajo del límite + sin indicios de tráfico → infracción administrativa Art. 36.16 LOPSC (D-10)',
    'penal.taulaDrogues.note2': 'Por encima del límite SIN indicios → procedimiento mixto (A-10 + atestado)',
    'penal.taulaDrogues.note3': 'Cualquier cantidad con indicios de tráfico → tráfico Art. 368 CP (A-20 + atestado penal)',
    'penal.taulaDrogues.note4': 'Indicios típicos: báscula, papelinas preparadas, dinero fraccionado en denominaciones de venta, substancias de corte',
    'penal.recursos': 'Recursos para víctimas',
    'penal.recursos.title': 'Recursos / teléfonos de atención',
    'penal.recursos.desc': 'Atención a víctimas, emergencias, salud y servicios sociales',
    'penal.dretsDetingut': 'Derechos del detenido',
    'penal.dretsDetingut.title': 'Derechos del detenido — Art. 520 LECrim',
    'penal.dretsDetingut.desc': 'Lectura íntegra obligatoria al practicar la detención. También aplicable parcialmente en citaciones (Art. 796.1.4 LECrim).',
    'penal.dretsDetingut.special': 'Casos especiales',
    'penal.dretsDetingut.copyAll': 'Copiar texto completo',
    'penal.dretsDetingut.copied': 'Copiado',
    'penal.dretsDetingut.print': 'Imprimir',

    // Tráfico — listado y runner de checklists
    'checklist.notFound': 'Ese checklist no existe.',
    'checklist.backToList': 'Volver al listado de Tráfico',
    'checklist.start': 'Empezar checklist',
    'checklist.back': 'Atrás',
    'checklist.restart': 'Reiniciar',
    'checklist.startOver': 'Empezar de nuevo',
    'checklist.step': 'Paso {n}',
    'checklist.brokenLink': 'Enlace de checklist roto',
    'checklist.brokenLinkDetail':
      'El nodo "{id}" no existe en este checklist. Reinicia para empezar de cero.',
    'checklist.fine': 'Multa',
    'checklist.points': 'Puntos',
    'checklist.penalty': 'Pena',
    'checklist.action': 'Acción',
    'checklist.actions': 'Actuaciones',
    'checklist.requirements': 'Requisitos',
    'checklist.document': 'Documento a generar',
    'checklist.legalBasis': 'Base legal',
    'checklist.kind.ok': 'Todo correcto',
    'checklist.kind.administrativa': 'Infracción administrativa',
    'checklist.kind.penal': 'Delito (vía penal)',
    'checklist.kind.procediment': 'Procedimiento',
    'checklist.kind.mixta': 'Vía mixta (administrativa + penal)',
    'checklist.kind.avis': 'Aviso / atención',

    // Sanción (campos de la butlleta y variantes de pena)
    'checklist.forTicket': 'Para el boletín de denuncia',
    'checklist.parallelTicket': 'Sanción administrativa paralela',
    'checklist.pointsBiciVmp': 'Puntos (bici/VMP)',
    'checklist.penaltyVariants': 'Variantes de pena',
    'checklist.penaltySection1': 'Apartado 1',
    'checklist.penaltySection2': 'Apartado 2',
    'checklist.penaltyWithDanger': 'Con peligro concreto',
    'checklist.penaltyNoDanger': 'Sin peligro concreto',
    'checklist.penaltyGrossNeg': 'Imprudencia grave',
    'checklist.penaltyLessNeg': 'Imprudencia menos grave',
    'checklist.penaltyRef': 'Pena referencial',
    'checklist.standardWarning': 'Frase de advertencia estándar',

    // Acciones / actuaciones
    'checklist.criticalSteps': 'Pasos críticos (orden estricto)',
    'checklist.orderedSteps': 'Pasos ordenados',
    'checklist.operativeActions': 'Actuaciones operativas',

    // Documentación
    'checklist.documentation': 'Documentación',
    'checklist.keyDocumentation': 'Documentación clave',
    'checklist.ticket': 'Tique / comprobante',

    // Drets, símptomes, elements, requisits, excepcions, exemples
    'checklist.driverRights': 'Derechos a informar al conductor',
    'checklist.symptomsToProve': 'Síntomas a acreditar',
    'checklist.elementsToProve': 'Elementos a acreditar',
    'checklist.keyEvidence': 'Elementos probatorios clave',
    'checklist.keyRequirements': 'Requisitos clave',
    'checklist.mandatoryRequirements': 'Requisitos obligatorios',
    'checklist.exceptions': 'Excepciones',
    'checklist.legitExceptions': 'Excepciones legítimas',
    'checklist.examples': 'Ejemplos',
    'checklist.conditionExamples': 'Ejemplos de condiciones',
    'checklist.caseLaw': 'Jurisprudencia',

    // Notas info_*
    'checklist.keyInfo': 'Información clave',
    'checklist.extraInfo': 'Información adicional',
    'checklist.ticketInfo': 'Sobre el boletín',
    'checklist.applicabilityInfo': 'Aplicabilidad',
    'checklist.immobilizationInfo': 'Inmovilización',
    'checklist.commonModifications': 'Reformas habituales',

    // Misc
    'checklist.obligation': 'Obligatoriedad',
    'checklist.responsibility': 'Responsabilidad',
    'checklist.competence': 'Competencia',
    'checklist.compatibleWith': 'Compatible con',
    'checklist.concurrenceArt195': 'Concurso con art. 195 CP',
    'checklist.differenceWithAdmin': 'Diferencia con vía administrativa',

    // Notas técnicas (raíz del checklist)
    'checklist.tech.title': 'Notas técnicas y referencias rápidas',
    'checklist.tech.alcoholMargins': 'Márgenes de error etilómetro',
    'checklist.tech.speedMargins': 'Márgenes de error cinemómetros',
    'checklist.tech.speedCameraTypes': 'Tipos de cinemómetros',
    'checklist.tech.speedLimits': 'Límites genéricos por vía',
    'checklist.tech.itvDeadlines': 'ITV — plazos vigentes',
    'checklist.tech.itvStates': 'Estados posibles de la ITV',
    'checklist.tech.permitDeadlines': 'Caducidad del permiso',
    'checklist.tech.diffAdminPenal': 'Diferencias clave admin / penal',
    'checklist.tech.priorChecks': 'Comprobaciones previas',
    'checklist.tech.actionPriorities': 'Prioridades de actuación',
    'checklist.tech.drugsDetected': 'Sustancias detectadas (drogotest)',
    'checklist.tech.keyDiff': 'Diferencia clave',
    'checklist.tech.finalNotes': 'Notas finales (recordatorios)',

    // Counts
    'cards.one': 'ficha',
    'cards.other': 'fichas',
    'results.one': 'resultado',
    'results.other': 'resultados',

    // Section
    'section.notFound': 'Sección no encontrada.',
    'section.empty': 'Todavía no hay fichas en esta sección.',

    // Card
    'card.notFound': 'Ficha no encontrada.',
    'card.lang.notice.es': 'Esta ficha está en castellano.',
    'card.lang.notice.ca': 'Esta ficha está en catalán.',
    'card.lang.notice.hint':
      'El contenido todavía no está traducido al idioma seleccionado.',

    // Search
    'search.resultsLabel': 'Resultados',
    'search.query': 'Búsqueda:',
    'search.none': 'sin coincidencias',
    'search.operativaSection': 'Operativa (procedimientos en la calle)',
    'search.leyesSection': 'Leyes (temario)',
    'search.openChecklist': 'Abrir checklist',

    // Not found
    'notFound.text': 'Página no encontrada.',
    'back.home': 'Volver al inicio',

    // Modules
    'module.ce78.title': 'CE78',
    'module.ce78.desc': 'Constitución Española de 1978.',
    'module.codi-penal.title': 'Código penal',
    'module.codi-penal.desc': 'Ley Orgánica 10/1995, del Código penal.',
    'module.eac.title': 'EAC',
    'module.eac.desc': 'Estatuto de Autonomía de Cataluña.',
    'module.fcs.title': 'FCS',
    'module.fcs.desc': 'Fuerzas y Cuerpos de Seguridad.',
    'module.lecrim.title': 'LECrim',
    'module.lecrim.desc': 'Ley de Enjuiciamiento Criminal.',
    'module.menors.title': 'Menores',
    'module.menors.desc': 'Normativa relativa a menores.',
    'module.municipi.title': 'Municipio',
    'module.municipi.desc': 'Régimen municipal y ordenanzas.',
    'module.sc.title': 'SC',
    'module.sc.desc': 'Seguridad Ciudadana (LOPSC).',
    'module.transit.title': 'Tráfico',
    'module.transit.desc': 'Tráfico, circulación y seguridad vial.',
  },
  ca: {
    // Header / layout
    'app.tagline': 'Consulta operativa',
    'nav.home': 'Inici',
    'search.label': 'Cerca',
    'search.placeholder': 'Cerca per article, norma, paraula clau…',
    'theme.toLight': 'Canvia a mode clar',
    'theme.toDark': 'Canvia a mode fosc',
    'theme.light': 'Tema clar',
    'theme.dark': 'Tema fosc',
    'lang.toggle': "Canvia d'idioma",
    'footer': 'InfoPol · Consulta personal · Informació no oficial.',

    // Home (landing principal: 2 grans opcions)
    'home.badge': 'Esquema operatiu policial',
    'home.title': 'Consulta ràpida',
    'home.subtitle':
      "Normativa, infografies i procediments operatius per a l'agent de policia local. Tria una secció.",
    'home.sections': 'Seccions',
    'home.leyes.badge': 'Temari',
    'home.leyes.title': 'Lleis',
    'home.leyes.desc':
      'Constitució, Codi penal, LECrim, FCS, Trànsit, Seguretat Ciutadana i més. Totes les infografies i normativa.',
    'home.leyes.cta': 'Obrir lleis',
    'home.operativa.badge': 'Al carrer',
    'home.operativa.title': 'Operativa',
    'home.operativa.desc':
      "Procediments per situació: trànsit, seguretat ciutadana… Selecciona i obtén la norma aplicable.",
    'home.operativa.cta': 'Obrir operativa',

    // Lleis
    'leyes.badge': 'Temari · Normativa',
    'leyes.title': 'Lleis',
    'leyes.subtitle':
      "Normativa, infografies i fitxes operatives per a l'agent de policia local. Tria una secció o usa el cercador per anar directe.",

    // Operativa
    'operativa.badge': 'Procediments al carrer',
    'operativa.title': 'Operativa',
    'operativa.subtitle': "Tria el tema operatiu amb el qual estàs treballant.",
    'operativa.comingSoon': 'En construcció',
    'operativa.open': 'Obrir',
    'operativa.trafico.title': 'Trànsit',
    'operativa.trafico.desc': "Identifica la infracció i aplica la norma",
    'operativa.seguretat-ciutadana.title': 'Seguretat Ciutadana / Penal',
    'operativa.seguretat-ciutadana.desc': 'Procediments operatius: identificació, escorcoll, detenció, lesions, VG/VD…',
    'penal.totalScenarios': 'escenaris',
    'penal.backToList': 'Torna al llistat de Seguretat Ciutadana / Penal',
    'penal.references': 'Referències ràpides',
    'penal.taulaActes': "Taula d'actes policials",
    'penal.taulaActes.desc': "Quan usar D-10, D-10.b, A-10, A-20, atestat…",
    'penal.taulaDrogues': 'Taula drogues (consum vs tràfic)',
    'penal.taulaDrogues.title': 'Taula de quantitats — consum propi vs tràfic',
    'penal.taulaDrogues.desc': 'Pautes UF 3.3 — orientatiu, no constitutiu',
    'penal.taulaDrogues.warning': 'Taula orientativa',
    'penal.taulaDrogues.warningText': "Les quantitats indicades són orientatives (Pautes UF 3.3 ISPC). Cada cas requereix valoració judicial. La presència de bàscula, dosis preparades, diners fraccionats o substàncies adulterants són indicis de tràfic independentment de la quantitat.",
    'penal.taulaDrogues.substance': 'Substància',
    'penal.taulaDrogues.usualDose': 'Dosi habitual',
    'penal.taulaDrogues.limit35': 'Límit consum 3-5 dies',
    'penal.taulaDrogues.howToInterpret': "Com s'interpreta",
    'penal.taulaDrogues.note1': "Per sota del límit + sense indicis de tràfic → infracció administrativa Art. 36.16 LOPSC (D-10)",
    'penal.taulaDrogues.note2': "Per sobre del límit SENSE indicis → procediment mixt (A-10 + atestat)",
    'penal.taulaDrogues.note3': "Qualsevol quantitat amb indicis de tràfic → tràfic Art. 368 CP (A-20 + atestat penal)",
    'penal.taulaDrogues.note4': "Indicis típics: bàscula, papelines preparades, diners fraccionats en denominacions de venda, substàncies de tall",
    'penal.recursos': 'Recursos per a víctimes',
    'penal.recursos.title': "Recursos / telèfons d'atenció",
    'penal.recursos.desc': "Atenció a víctimes, emergències, salut i serveis socials",
    'penal.dretsDetingut': 'Drets del detingut',
    'penal.dretsDetingut.title': 'Drets del detingut — Art. 520 LECrim',
    'penal.dretsDetingut.desc': "Lectura íntegra obligatòria en practicar la detenció. També aplicable parcialment en citacions (Art. 796.1.4 LECrim).",
    'penal.dretsDetingut.special': 'Casos especials',
    'penal.dretsDetingut.copyAll': 'Copiar text complet',
    'penal.dretsDetingut.copied': 'Copiat',
    'penal.dretsDetingut.print': 'Imprimir',

    // Trànsit — llistat i runner de checklists
    'checklist.notFound': 'Aquest checklist no existeix.',
    'checklist.backToList': 'Torna al llistat de Trànsit',
    'checklist.start': 'Comença checklist',
    'checklist.back': 'Enrere',
    'checklist.restart': 'Reinicia',
    'checklist.startOver': 'Tornar a començar',
    'checklist.step': 'Pas {n}',
    'checklist.brokenLink': 'Enllaç de checklist trencat',
    'checklist.brokenLinkDetail':
      "El node \"{id}\" no existeix en aquest checklist. Reinicia per començar de zero.",
    'checklist.fine': 'Multa',
    'checklist.points': 'Punts',
    'checklist.penalty': 'Pena',
    'checklist.action': 'Acció',
    'checklist.actions': 'Actuacions',
    'checklist.requirements': 'Requisits',
    'checklist.document': 'Document a generar',
    'checklist.legalBasis': 'Base legal',
    'checklist.kind.ok': 'Tot correcte',
    'checklist.kind.administrativa': 'Infracció administrativa',
    'checklist.kind.penal': 'Delicte (via penal)',
    'checklist.kind.procediment': 'Procediment',
    'checklist.kind.mixta': 'Via mixta (administrativa + penal)',
    'checklist.kind.avis': 'Avís / atenció',

    // Sanció (camps de la butlleta i variants de pena)
    'checklist.forTicket': 'Per a la butlleta de denúncia',
    'checklist.parallelTicket': 'Sanció administrativa paral·lela',
    'checklist.pointsBiciVmp': 'Punts (bici/VMP)',
    'checklist.penaltyVariants': 'Variants de pena',
    'checklist.penaltySection1': 'Apartat 1',
    'checklist.penaltySection2': 'Apartat 2',
    'checklist.penaltyWithDanger': 'Amb perill concret',
    'checklist.penaltyNoDanger': 'Sense perill concret',
    'checklist.penaltyGrossNeg': 'Imprudència greu',
    'checklist.penaltyLessNeg': 'Imprudència menys greu',
    'checklist.penaltyRef': 'Pena referencial',
    'checklist.standardWarning': "Frase d'advertiment estàndard",

    // Accions / actuacions
    'checklist.criticalSteps': 'Passos crítics (ordre estricte)',
    'checklist.orderedSteps': 'Passos ordenats',
    'checklist.operativeActions': 'Actuacions operatives',

    // Documentació
    'checklist.documentation': 'Documentació',
    'checklist.keyDocumentation': 'Documentació clau',
    'checklist.ticket': 'Tiquet / comprovant',

    // Drets, símptomes, elements, requisits, excepcions, exemples
    'checklist.driverRights': 'Drets a informar al conductor',
    'checklist.symptomsToProve': 'Símptomes a acreditar',
    'checklist.elementsToProve': 'Elements a acreditar',
    'checklist.keyEvidence': 'Elements probatoris clau',
    'checklist.keyRequirements': 'Requisits clau',
    'checklist.mandatoryRequirements': 'Requisits obligatoris',
    'checklist.exceptions': 'Excepcions',
    'checklist.legitExceptions': 'Excepcions legítimes',
    'checklist.examples': 'Exemples',
    'checklist.conditionExamples': 'Exemples de condicions',
    'checklist.caseLaw': 'Jurisprudència',

    // Notes info_*
    'checklist.keyInfo': 'Informació clau',
    'checklist.extraInfo': 'Informació addicional',
    'checklist.ticketInfo': 'Sobre la butlleta',
    'checklist.applicabilityInfo': 'Aplicabilitat',
    'checklist.immobilizationInfo': 'Immobilització',
    'checklist.commonModifications': 'Reformes habituals',

    // Misc
    'checklist.obligation': 'Obligatorietat',
    'checklist.responsibility': 'Responsabilitat',
    'checklist.competence': 'Competència',
    'checklist.compatibleWith': 'Compatible amb',
    'checklist.concurrenceArt195': 'Concurs amb art. 195 CP',
    'checklist.differenceWithAdmin': 'Diferència amb via administrativa',

    // Notes tècniques (arrel del checklist)
    'checklist.tech.title': 'Notes tècniques i referències ràpides',
    'checklist.tech.alcoholMargins': "Marges d'error etilòmetre",
    'checklist.tech.speedMargins': "Marges d'error cinemòmetres",
    'checklist.tech.speedCameraTypes': 'Tipus de cinemòmetres',
    'checklist.tech.speedLimits': 'Límits genèrics per via',
    'checklist.tech.itvDeadlines': 'ITV — terminis vigents',
    'checklist.tech.itvStates': 'Estats possibles de la ITV',
    'checklist.tech.permitDeadlines': 'Caducitat del permís',
    'checklist.tech.diffAdminPenal': 'Diferències clau admin / penal',
    'checklist.tech.priorChecks': 'Comprovacions prèvies',
    'checklist.tech.actionPriorities': 'Prioritats d\'actuació',
    'checklist.tech.drugsDetected': 'Substàncies detectades (drogotest)',
    'checklist.tech.keyDiff': 'Diferència clau',
    'checklist.tech.finalNotes': 'Notes finals (recordatoris)',

    // Counts
    'cards.one': 'fitxa',
    'cards.other': 'fitxes',
    'results.one': 'resultat',
    'results.other': 'resultats',

    // Section
    'section.notFound': 'Secció no trobada.',
    'section.empty': 'Encara no hi ha fitxes en aquesta secció.',

    // Card
    'card.notFound': 'Fitxa no trobada.',
    'card.lang.notice.es': 'Aquesta fitxa està en castellà.',
    'card.lang.notice.ca': 'Aquesta fitxa està en català.',
    'card.lang.notice.hint':
      "El contingut encara no està traduït a l'idioma seleccionat.",

    // Search
    'search.resultsLabel': 'Resultats',
    'search.query': 'Cerca:',
    'search.none': 'cap coincidència',
    'search.operativaSection': 'Operativa (procediments al carrer)',
    'search.leyesSection': 'Lleis (temari)',
    'search.openChecklist': 'Obrir checklist',

    // Not found
    'notFound.text': 'Pàgina no trobada.',
    'back.home': "Torna a l'inici",

    // Modules
    'module.ce78.title': 'CE78',
    'module.ce78.desc': 'Constitució Espanyola de 1978.',
    'module.codi-penal.title': 'Codi penal',
    'module.codi-penal.desc': 'Llei Orgànica 10/1995, del Codi penal.',
    'module.eac.title': 'EAC',
    'module.eac.desc': "Estatut d'Autonomia de Catalunya.",
    'module.fcs.title': 'FCS',
    'module.fcs.desc': 'Forces i Cossos de Seguretat.',
    'module.lecrim.title': 'LECrim',
    'module.lecrim.desc': "Llei d'Enjudiciament Criminal.",
    'module.menors.title': 'Menors',
    'module.menors.desc': 'Normativa relativa a menors.',
    'module.municipi.title': 'Municipi',
    'module.municipi.desc': 'Règim municipal i ordenances.',
    'module.sc.title': 'SC',
    'module.sc.desc': 'Seguretat Ciutadana (LOPSC).',
    'module.transit.title': 'Trànsit',
    'module.transit.desc': 'Trànsit, circulació i seguretat viària.',
  },
};

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'ca' ? 'ca' : 'es';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
  }

  function t(key: string): string {
    const d = DICT[locale];
    return d[key] ?? key;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useT(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useT ha d’usar-se dins de <LocaleProvider>.');
  return ctx;
}

// Helper per a plurals simples (1 → one, altres → other).
export function plural(t: Ctx['t'], count: number, keyBase: string): string {
  return t(`${keyBase}.${count === 1 ? 'one' : 'other'}`);
}
