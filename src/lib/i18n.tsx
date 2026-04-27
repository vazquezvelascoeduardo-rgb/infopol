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
    'footer.rights': 'Todos los derechos reservados.',
    'footer.legal': 'Aviso legal',
    'footer.privacy': 'Política de privacidad',

    // Aviso legal
    'legal.title': 'Aviso legal',
    'legal.updated': 'Última actualización',
    'legal.s1.title': '1. Identificación del titular',
    'legal.s1.p1': 'En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE), se informa de los datos identificativos del titular de este sitio web:',
    'legal.s1.url': 'Sitio web',
    'legal.s1.purpose': 'Finalidad',
    'legal.s1.purposeDesc': 'consulta personal de normativa, infografías y procedimientos operativos para agentes de policía local. No es un sitio oficial.',
    'legal.s1.contact': 'Contacto',
    'legal.s2.title': '2. Naturaleza no oficial',
    'legal.s2.p1': 'InfoPol es una herramienta privada de consulta personal. NO es un sitio oficial de ninguna administración pública, cuerpo policial ni ayuntamiento. La información se proporciona "tal cual", sin garantía de exactitud o vigencia.',
    'legal.s2.p2': 'Para uso oficial o profesional crítico, contrasta siempre la normativa con las publicaciones oficiales (BOE, BOPB, DOGC, etc.) y los catálogos internos del cuerpo correspondiente.',
    'legal.s3.title': '3. Propiedad intelectual',
    'legal.s3.p1': 'El diseño del sitio, los esquemas y la organización del contenido son propiedad del titular. Los textos legales reproducidos provienen de fuentes oficiales y son de dominio público. Las marcas, logos y escudos institucionales pertenecen a sus respectivos titulares.',
    'legal.s4.title': '4. Limitación de responsabilidad',
    'legal.s4.p1': 'El titular no se hace responsable del uso que terceros hagan de la información publicada, ni de los daños que pudieran derivarse de errores, omisiones o desactualizaciones del contenido. La normativa cambia frecuentemente; el usuario es el único responsable de verificar la versión vigente.',
    'legal.s5.title': '5. Enlaces a terceros',
    'legal.s5.p1': 'Algunas secciones enlazan a sitios web de terceros (Google Maps, AIAC, Cofb, etc.) para facilitar el acceso a recursos externos. El titular no se hace responsable del contenido, políticas ni disponibilidad de esos sitios.',
    'legal.s6.title': '6. Legislación aplicable',
    'legal.s6.p1': 'La relación entre el usuario y el titular se rige por la legislación española vigente. Para cualquier conflicto, las partes se someten a los Juzgados y Tribunales del domicilio del titular, salvo que la ley imponga otro fuero.',

    // Política de privacidad
    'privacy.title': 'Política de privacidad',
    'privacy.updated': 'Última actualización',
    'privacy.s1.title': '1. Datos personales',
    'privacy.s1.p1': 'InfoPol es una aplicación web estática. No requiere registro, no pide datos personales y no envía información a ningún servidor del titular. Toda la funcionalidad ocurre en tu navegador.',
    'privacy.s1.highlight': 'No tratamos ningún dato personal identificable.',
    'privacy.s2.title': '2. Almacenamiento local en tu dispositivo',
    'privacy.s2.intro': 'La aplicación guarda algunas preferencias en el almacenamiento local (localStorage) de tu navegador. Estos datos no salen de tu dispositivo:',
    'privacy.s2.theme': 'tema visual elegido (claro/oscuro).',
    'privacy.s2.locale': 'idioma elegido (ES/CA).',
    'privacy.s2.rgpd': 'aceptación del aviso de privacidad para no volver a mostrarlo.',
    'privacy.s2.swTitle': 'Caché del Service Worker',
    'privacy.s2.sw': 'archivos estáticos (HTML, CSS, JS, imágenes) cacheados para que la app funcione sin conexión.',
    'privacy.s2.howClear': 'Puedes borrar estos datos en cualquier momento desde los ajustes de tu navegador (Borrar datos del sitio) o desinstalando la app si la añadiste a la pantalla de inicio.',
    'privacy.s3.title': '3. Servicios de terceros',
    'privacy.s3.p1': 'Algunas funciones cargan recursos externos cuando los usas:',
    'privacy.s3.fonts': 'Google Fonts: tipografías cargadas desde fonts.googleapis.com (queda registrado tu IP en sus servidores).',
    'privacy.s3.maps': 'Google Maps: al pulsar enlaces a "Cómo llegar" se abre Google Maps en una nueva pestaña.',
    'privacy.s3.aiac': 'Anàlisi Integrada d\'Accidents (AIAC): al pulsar el botón AIAC se abre el enlace externo.',
    'privacy.s3.farmacia': 'COFB (farmacias de guardia): al pulsar el enlace se abre el sitio del Col·legi de Farmacèutics.',
    'privacy.s3.note': 'El titular no controla la política de privacidad de estos terceros. Consulta sus políticas si te preocupa el tratamiento de datos por su parte.',
    'privacy.s4.title': '4. Cookies',
    'privacy.s4.p1': 'No utilizamos cookies. Solo localStorage técnico (necesario para recordar el tema y el idioma). Por la naturaleza estrictamente funcional de este almacenamiento, no se requiere consentimiento previo según el considerando 32 del RGPD y el artículo 22.2 de la LSSICE.',
    'privacy.s5.title': '5. Tus derechos',
    'privacy.s5.p1': 'Como no tratamos datos personales, no aplican los derechos del RGPD frente a InfoPol. Si tienes dudas o quieres reportar algo:',
    'privacy.s5.contact': 'Contacto',

    // Banner RGPD
    'rgpd.title': 'Aviso de privacidad',
    'rgpd.body': 'InfoPol no usa cookies de seguimiento ni recoge datos personales. Solo guarda en tu dispositivo el tema, el idioma y esta aceptación.',
    'rgpd.more': 'Más información',
    'rgpd.privacy': 'Política de privacidad',
    'rgpd.accept': 'Entendido',

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
    'home.superbuscador.badge': 'Tráfico · Catálogo SCT',
    'home.superbuscador.title': 'Multas e infracciones de tráfico',
    'home.superbuscador.desc':
      'Busca por concepto, artículo, multa o puntos en LSV, RGC, RGCond, RGV, Aseguranza y CP. Resultados con cuantía y DTE.',
    'home.superbuscador.cta': 'Buscar multa',
    'home.recursos.badge': 'Atajos',
    'home.recursos.title': 'Recursos rápidos',
    'home.recursos.desc':
      'AIAC, farmacia de guardia, validador DNI, libreta, calculadora alcoholemia y más.',
    'superbuscador.title': 'Multas e infracciones de tráfico',
    'superbuscador.badge': 'Catálogo SCT 2026',
    'superbuscador.subtitle':
      'Busca por concepto, artículo, multa o puntos a la vez en TODAS las leyes y reglamentos del catálogo (LSV, RGC, RGCond, RGV, Aseguranza y CP).',
    'superbuscador.placeholder':
      'Escribe: alcoholemia, 14.1, móvil, 500, cinturón, drogas...',
    'superbuscador.totalRows': 'infracciones indexadas',
    'superbuscador.minChars': 'Mínimo 2 caracteres para buscar.',
    'superbuscador.noResults': 'Sin coincidencias para',
    'superbuscador.resultsFound': 'resultados encontrados',
    'superbuscador.tipsTitle': 'Cómo buscar',
    'superbuscador.clear': 'Borrar',
    'superbuscador.tip1.examples': 'alcoholemia, drogas, cinturón...',
    'superbuscador.tip2.byArticle': 'Por artículo',
    'superbuscador.tip3.byFine': 'Por multa',
    'superbuscador.tip4.multiword': 'Multipalabra',
    'superbuscador.tip4.examples': 'cinturón conductor, móvil mano...',
    'superbuscador.veryGrave': 'Muy grave',
    'superbuscador.grave': 'Grave',
    'superbuscador.minor': 'Leve',

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
    'checklist.previousChecks': 'Comprobaciones previas',
    'checklist.evidentialTest': 'Prueba evidencial — pasos',
    'checklist.symptoms': 'Síntomas a observar',
    'checklist.copyToClipboard': 'Copiar al portapapeles',
    'checklist.copy': 'Copiar',
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
    'back.button': 'Atrás',

    // Sidebar (menú lateral)
    'sidebar.title': 'Menú',
    'sidebar.open': 'Abrir menú',
    'sidebar.close': 'Cerrar menú',
    'sidebar.home': 'Inicio',
    'sidebar.superbuscador': 'Multas tráfico',
    'sidebar.leyes': 'Leyes',
    'sidebar.leyes.all': 'Todas las leyes',
    'sidebar.operativa': 'Operativa',
    'sidebar.operativa.home': 'Operativa (inicio)',
    'sidebar.references': 'Referencias rápidas',
    'sidebar.recursos': 'Recursos rápidos',

    // Recursos rápidos (página)
    'recursos.title': 'Recursos rápidos',
    'recursos.badge': 'Herramientas',
    'recursos.subtitle':
      'Acceso directo a información útil durante una intervención.',
    'recursos.section.external': 'Enlaces externos',
    'recursos.section.phones': 'Teléfonos útiles',
    'recursos.section.tools': 'Herramientas',
    'recursos.section.reference': 'Referencia rápida',
    'recursos.section.local': 'Información local · Viladecans',
    'recursos.farmacia.badge': 'Salud · Viladecans',
    'recursos.farmacia.title': 'Farmacia de guardia · Viladecans',
    'recursos.farmacia.desc':
      'Localiza la farmacia de guardia más cercana en Viladecans (FarmaGuia.net).',
    'recursos.aiac.badge': 'Animales · Catalunya',
    'recursos.aiac.title': 'AIAC — Buscar chip animal',
    'recursos.aiac.desc':
      'Arxiu d\'Identificació d\'Animals de Companyia (Veterinaris de Catalunya).',
    'recursos.grua.badge': 'Tráfico · Viladecans',
    'recursos.grua.title': 'Grúa municipal',
    'recursos.grua.note': 'Para inmovilizaciones y traslados al depósito.',
    'recursos.codi.badge': 'Comunicaciones · radio',
    'recursos.codi.title': 'Código alfanumérico (NATO)',
    'recursos.codi.desc':
      'Alfabeto fonético internacional NATO/ICAO con extensiones Ç=Capça y Ñ=Ñoño.',
    'recursos.openMaps': 'Abrir en Google Maps',
    // Calculadora alcoholèmia
    'recursos.alcohol.title': 'Calculadora alcoholemia',
    'recursos.alcohol.desc':
      'Introduce la lectura confirmada del etilómetro y el tipo de conductor: te dice tramo, multa, puntos y vía aplicable.',
    'recursos.alcohol.driverType': 'Tipo de conductor',
    'recursos.alcohol.general': 'General (>2 años)',
    'recursos.alcohol.novell': 'Novel / Profesional',
    'recursos.alcohol.menor': 'Menor de edad',
    'recursos.alcohol.bici': 'Bicicleta / VMP',
    'recursos.alcohol.reincident': 'Reincidente (sancionado año anterior)',
    'recursos.alcohol.reincidentHint':
      'Sanción firme por alcohol en los 12 meses previos. Duplica el importe pero mantiene los puntos.',
    'recursos.alcohol.reading': 'Lectura confirmada (mg/l aire espirado)',
    'recursos.alcohol.readingHint':
      'Usa la 2ª medición del etilómetro evidencial. Criterio prudente: penal solo si > 0,65 mg/l confirmado.',
    'recursos.alcohol.fine': 'Multa',
    'recursos.alcohol.points': 'Puntos',
    'recursos.alcohol.article': 'Artículo',
    'recursos.alcohol.action': 'Acción operativa',
    'recursos.alcohol.disclaimer':
      'Orientativo. La determinación final depende del aparato (homologado y verificado), las dos mediciones, el procedimiento y la valoración judicial cuando aplique.',
    'recursos.matricules.title': 'Códigos provinciales de matrículas',
    'recursos.matricules.desc':
      'Matrículas anteriores al 2000 (formato letra-letra-número).',
    'recursos.matricules.note':
      'Desde el 2000 las matrículas son uniformes (NNNN-LLL) sin código provincial.',
    'recursos.dni.title': 'Validador DNI/NIE',
    'recursos.dni.desc':
      'Comprueba si la letra de control es correcta. Útil contra documentación falsa.',
    'recursos.dni.docLabel': 'Documento',
    'recursos.dni.empty': 'Escribe un DNI o NIE.',
    'recursos.dni.formatHint': 'Formato esperado: 8 dígitos + letra (DNI) o X/Y/Z + 7 dígitos + letra (NIE).',
    'recursos.dni.validMsg': 'Número {n} con letra {l}.',
    'recursos.dni.invalidMsg': 'La letra no corresponde al número.',
    'recursos.dni.valid': 'válido',
    'recursos.dni.invalid': 'INVÁLIDO',
    'recursos.dni.incomplete': 'Incompleto o formato desconocido',
    'recursos.dni.expectedLetter': 'Letra correcta',
    'recursos.dni.footer': 'Calcula la letra de control según el cálculo oficial (módulo 23).',
    'recursos.notes.title': 'Libreta operativa',
    'recursos.notes.desc':
      'Notas privadas (matrículas, observaciones, recordatorios). Solo en tu dispositivo.',
    'recursos.notes.placeholder': 'Notas operativas del turno (matrículas, observaciones, recordatorios…). Se guarda automáticamente en tu navegador.',
    'recursos.notes.confirmClear': '¿Borrar todas las notas?',
    'recursos.notes.saved': 'Guardado',
    'recursos.notes.autosave': 'Se guarda automáticamente en tu dispositivo',
    'recursos.notes.clear': 'Borrar',
    'recursos.notes.privacy': 'Privacidad: las notas solo se guardan en tu navegador (localStorage), nunca se envían a ningún servidor.',
    'recursos.jutjats.badge': 'Judicial',
    'recursos.jutjats.title': 'Juzgados de Gavà',
    'recursos.jutjats.note':
      'Juzgado de Guardia · puesta a disposición · juicios rápidos.',
    'recursos.hospital.badge': 'Salud',
    'recursos.hospital.title': 'Hospital / CAP de referencia',
    'recursos.hospital.note':
      'Para evacuaciones, atestados de lesiones, contraste alcoholemia.',
    'recursos.tir.badge': 'Armas · Reglamento',
    'recursos.tir.title': 'Centros de tiro autorizados',
    'recursos.tir.note':
      'Para verificar uso de licencias y prácticas obligatorias.',
    'recursos.moreToCome':
      'Más recursos próximamente. ¿Tienes ideas? Dímelas.',

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
    'footer.rights': 'Tots els drets reservats.',
    'footer.legal': 'Avís legal',
    'footer.privacy': 'Política de privacitat',

    // Avís legal
    'legal.title': 'Avís legal',
    'legal.updated': 'Última actualització',
    'legal.s1.title': '1. Identificació del titular',
    'legal.s1.p1': 'En compliment de l\'article 10 de la Llei 34/2002, d\'11 de juliol, de Serveis de la Societat de la Informació i Comerç Electrònic (LSSICE), s\'informen les dades identificatives del titular d\'aquest lloc web:',
    'legal.s1.url': 'Lloc web',
    'legal.s1.purpose': 'Finalitat',
    'legal.s1.purposeDesc': 'consulta personal de normativa, infografies i procediments operatius per a agents de policia local. No és un lloc oficial.',
    'legal.s1.contact': 'Contacte',
    'legal.s2.title': '2. Naturalesa no oficial',
    'legal.s2.p1': 'InfoPol és una eina privada de consulta personal. NO és un lloc oficial de cap administració pública, cos policial ni ajuntament. La informació es proporciona "tal qual", sense garantia d\'exactitud ni vigència.',
    'legal.s2.p2': 'Per a ús oficial o professional crític, contrasta sempre la normativa amb les publicacions oficials (BOE, BOPB, DOGC, etc.) i els catàlegs interns del cos corresponent.',
    'legal.s3.title': '3. Propietat intel·lectual',
    'legal.s3.p1': 'El disseny del lloc, els esquemes i l\'organització del contingut són propietat del titular. Els textos legals reproduïts provenen de fonts oficials i són de domini públic. Les marques, logotips i escuts institucionals pertanyen als seus respectius titulars.',
    'legal.s4.title': '4. Limitació de responsabilitat',
    'legal.s4.p1': 'El titular no es fa responsable de l\'ús que tercers facin de la informació publicada, ni dels danys que se\'n puguin derivar per errors, omissions o desactualitzacions del contingut. La normativa canvia freqüentment; l\'usuari és l\'únic responsable de verificar la versió vigent.',
    'legal.s5.title': '5. Enllaços a tercers',
    'legal.s5.p1': 'Algunes seccions enllacen a llocs webs de tercers (Google Maps, AIAC, Cofb, etc.) per facilitar l\'accés a recursos externs. El titular no es fa responsable del contingut, polítiques ni disponibilitat d\'aquests llocs.',
    'legal.s6.title': '6. Legislació aplicable',
    'legal.s6.p1': 'La relació entre l\'usuari i el titular es regeix per la legislació espanyola vigent. Per a qualsevol conflicte, les parts se sotmeten als Jutjats i Tribunals del domicili del titular, llevat que la llei imposi un altre fur.',

    // Política de privacitat
    'privacy.title': 'Política de privacitat',
    'privacy.updated': 'Última actualització',
    'privacy.s1.title': '1. Dades personals',
    'privacy.s1.p1': 'InfoPol és una aplicació web estàtica. No requereix registre, no demana dades personals i no envia informació a cap servidor del titular. Tota la funcionalitat passa al teu navegador.',
    'privacy.s1.highlight': 'No tractem cap dada personal identificable.',
    'privacy.s2.title': '2. Emmagatzematge local al teu dispositiu',
    'privacy.s2.intro': 'L\'aplicació guarda algunes preferències a l\'emmagatzematge local (localStorage) del teu navegador. Aquestes dades no surten del teu dispositiu:',
    'privacy.s2.theme': 'tema visual triat (clar/fosc).',
    'privacy.s2.locale': 'idioma triat (ES/CA).',
    'privacy.s2.rgpd': 'acceptació de l\'avís de privacitat per no tornar a mostrar-lo.',
    'privacy.s2.swTitle': 'Cau del Service Worker',
    'privacy.s2.sw': 'fitxers estàtics (HTML, CSS, JS, imatges) cachejats perquè l\'app funcioni sense connexió.',
    'privacy.s2.howClear': 'Pots esborrar aquestes dades en qualsevol moment des dels ajustos del teu navegador (Esborrar dades del lloc) o desinstal·lant l\'app si la vas afegir a la pantalla d\'inici.',
    'privacy.s3.title': '3. Serveis de tercers',
    'privacy.s3.p1': 'Algunes funcions carreguen recursos externs quan els fas servir:',
    'privacy.s3.fonts': 'Google Fonts: tipografies carregades des de fonts.googleapis.com (queda registrada la teva IP als seus servidors).',
    'privacy.s3.maps': 'Google Maps: en prémer enllaços a "Com arribar" s\'obre Google Maps en una pestanya nova.',
    'privacy.s3.aiac': 'Anàlisi Integrada d\'Accidents (AIAC): en prémer el botó AIAC s\'obre l\'enllaç extern.',
    'privacy.s3.farmacia': 'COFB (farmàcies de guàrdia): en prémer l\'enllaç s\'obre el lloc del Col·legi de Farmacèutics.',
    'privacy.s3.note': 'El titular no controla la política de privacitat d\'aquests tercers. Consulta\'n les polítiques si et preocupa el tractament de dades per part seva.',
    'privacy.s4.title': '4. Galetes (cookies)',
    'privacy.s4.p1': 'No fem servir cookies. Només localStorage tècnic (necessari per recordar el tema i l\'idioma). Per la naturalesa estrictament funcional d\'aquest emmagatzematge, no cal consentiment previ segons el considerant 32 del RGPD i l\'article 22.2 de la LSSICE.',
    'privacy.s5.title': '5. Els teus drets',
    'privacy.s5.p1': 'Com que no tractem dades personals, no s\'apliquen els drets del RGPD davant d\'InfoPol. Si tens dubtes o vols reportar alguna cosa:',
    'privacy.s5.contact': 'Contacte',

    // Banner RGPD
    'rgpd.title': 'Avís de privacitat',
    'rgpd.body': 'InfoPol no fa servir cookies de seguiment ni recull dades personals. Només desa al teu dispositiu el tema, l\'idioma i aquesta acceptació.',
    'rgpd.more': 'Més informació',
    'rgpd.privacy': 'Política de privacitat',
    'rgpd.accept': 'Entès',

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
    'home.superbuscador.badge': 'Trànsit · Catàleg SCT',
    'home.superbuscador.title': "Multes i infraccions de trànsit",
    'home.superbuscador.desc':
      "Busca per concepte, article, multa o punts a LSV, RGC, RGCond, RGV, Assegurança i CP. Resultats amb quantia i DTE.",
    'home.superbuscador.cta': 'Buscar multa',
    'home.recursos.badge': 'Dreceres',
    'home.recursos.title': 'Recursos ràpids',
    'home.recursos.desc':
      "AIAC, farmàcia de guàrdia, validador DNI, llibreta, calculadora alcoholèmia i més.",
    'superbuscador.title': "Multes i infraccions de trànsit",
    'superbuscador.badge': 'Catàleg SCT 2026',
    'superbuscador.subtitle':
      "Busca per concepte, article, multa o punts alhora a TOTES les lleis i reglaments del catàleg (LSV, RGC, RGCond, RGV, Assegurança i CP).",
    'superbuscador.placeholder':
      "Escriu: alcoholèmia, 14.1, mòbil, 500, cinturó, drogues...",
    'superbuscador.totalRows': 'infraccions indexades',
    'superbuscador.minChars': 'Mínim 2 caràcters per buscar.',
    'superbuscador.noResults': 'Cap coincidència per a',
    'superbuscador.resultsFound': 'resultats trobats',
    'superbuscador.tipsTitle': 'Com buscar',
    'superbuscador.clear': 'Esborra',
    'superbuscador.tip1.examples': 'alcoholèmia, drogues, cinturó...',
    'superbuscador.tip2.byArticle': "Per article",
    'superbuscador.tip3.byFine': 'Per multa',
    'superbuscador.tip4.multiword': 'Multiparaula',
    'superbuscador.tip4.examples': "cinturó conductor, mòbil mà...",
    'superbuscador.veryGrave': 'Molt greu',
    'superbuscador.grave': 'Greu',
    'superbuscador.minor': 'Lleu',

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
    'checklist.previousChecks': 'Comprovacions prèvies',
    'checklist.evidentialTest': 'Prova evidencial — passos',
    'checklist.symptoms': 'Símptomes a observar',
    'checklist.copyToClipboard': "Copiar al porta-retalls",
    'checklist.copy': 'Copiar',
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
    'back.button': 'Enrere',

    // Sidebar (menú lateral)
    'sidebar.title': 'Menú',
    'sidebar.open': 'Obre el menú',
    'sidebar.close': 'Tanca el menú',
    'sidebar.home': 'Inici',
    'sidebar.superbuscador': 'Multes trànsit',
    'sidebar.leyes': 'Lleis',
    'sidebar.leyes.all': 'Totes les lleis',
    'sidebar.operativa': 'Operativa',
    'sidebar.operativa.home': 'Operativa (inici)',
    'sidebar.references': 'Referències ràpides',
    'sidebar.recursos': 'Recursos ràpids',

    // Recursos ràpids (pàgina)
    'recursos.title': 'Recursos ràpids',
    'recursos.badge': 'Eines',
    'recursos.subtitle':
      "Accés directe a informació útil durant una intervenció.",
    'recursos.section.external': 'Enllaços externs',
    'recursos.section.phones': 'Telèfons útils',
    'recursos.section.tools': 'Eines',
    'recursos.section.reference': 'Referència ràpida',
    'recursos.section.local': 'Informació local · Viladecans',
    'recursos.farmacia.badge': 'Salut · Viladecans',
    'recursos.farmacia.title': 'Farmàcia de guàrdia · Viladecans',
    'recursos.farmacia.desc':
      "Localitza la farmàcia de guàrdia més propera a Viladecans (FarmaGuia.net).",
    'recursos.aiac.badge': 'Animals · Catalunya',
    'recursos.aiac.title': 'AIAC — Cerca xip animal',
    'recursos.aiac.desc':
      "Arxiu d'Identificació d'Animals de Companyia (Veterinaris de Catalunya).",
    'recursos.grua.badge': 'Trànsit · Viladecans',
    'recursos.grua.title': 'Grua municipal',
    'recursos.grua.note': "Per a immobilitzacions i trasllats al dipòsit.",
    'recursos.codi.badge': 'Comunicacions · ràdio',
    'recursos.codi.title': 'Codi alfanumèric (NATO)',
    'recursos.codi.desc':
      "Alfabet fonètic internacional NATO/ICAO amb extensions Ç=Capça i Ñ=Ñoño.",
    'recursos.openMaps': 'Obrir a Google Maps',
    // Calculadora alcoholèmia
    'recursos.alcohol.title': 'Calculadora alcoholèmia',
    'recursos.alcohol.desc':
      "Introdueix la lectura confirmada de l'etilòmetre i el tipus de conductor: et diu tram, multa, punts i via aplicable.",
    'recursos.alcohol.driverType': 'Tipus de conductor',
    'recursos.alcohol.general': 'General (>2 anys)',
    'recursos.alcohol.novell': 'Novell / Professional',
    'recursos.alcohol.menor': "Menor d'edat",
    'recursos.alcohol.bici': 'Bicicleta / VMP',
    'recursos.alcohol.reincident': 'Reincident (sancionat any anterior)',
    'recursos.alcohol.reincidentHint':
      "Sanció ferma per alcohol en els 12 mesos previs. Duplica l'import però manté els punts.",
    'recursos.alcohol.reading': 'Lectura confirmada (mg/l aire espirat)',
    'recursos.alcohol.readingHint':
      "Usa la 2a medició de l'etilòmetre evidencial. Criteri prudent: penal només si > 0,65 mg/l confirmat.",
    'recursos.alcohol.fine': 'Multa',
    'recursos.alcohol.points': 'Punts',
    'recursos.alcohol.article': 'Article',
    'recursos.alcohol.action': 'Acció operativa',
    'recursos.alcohol.disclaimer':
      "Orientatiu. La determinació final depèn de l'aparell (homologat i verificat), les dues mediciones, el procediment i la valoració judicial quan apliqui.",
    'recursos.matricules.title': 'Codis provincials de matrícules',
    'recursos.matricules.desc':
      "Matrícules anteriors al 2000 (format lletra-lletra-número).",
    'recursos.matricules.note':
      "Des del 2000 les matrícules són uniformes (NNNN-LLL) sense codi provincial.",
    'recursos.dni.title': 'Validador DNI/NIE',
    'recursos.dni.desc':
      "Comprova si la lletra de control és correcta. Útil contra documentació falsa.",
    'recursos.dni.docLabel': 'Document',
    'recursos.dni.empty': 'Escriu un DNI o NIE.',
    'recursos.dni.formatHint': 'Format esperat: 8 dígits + lletra (DNI) o X/Y/Z + 7 dígits + lletra (NIE).',
    'recursos.dni.validMsg': 'Número {n} amb lletra {l}.',
    'recursos.dni.invalidMsg': 'La lletra no correspon al número.',
    'recursos.dni.valid': 'vàlid',
    'recursos.dni.invalid': 'INVÀLID',
    'recursos.dni.incomplete': 'Incomplet o format desconegut',
    'recursos.dni.expectedLetter': 'Lletra correcta',
    'recursos.dni.footer': "Calcula la lletra de control segons el càlcul oficial (mòdul 23).",
    'recursos.notes.title': 'Llibreta operativa',
    'recursos.notes.desc':
      "Notes privades (matrícules, observacions, recordatoris). Només al teu dispositiu.",
    'recursos.notes.placeholder': "Notes operatives del torn (matrícules, observacions, recordatoris…). Es desa al teu navegador automàticament.",
    'recursos.notes.confirmClear': "Esborrar totes les notes?",
    'recursos.notes.saved': 'Desat',
    'recursos.notes.autosave': "Es desa automàticament al teu dispositiu",
    'recursos.notes.clear': 'Esborrar',
    'recursos.notes.privacy': "Privadesa: les notes només es guarden al teu navegador (localStorage), mai s'envien a cap servidor.",
    'recursos.jutjats.badge': 'Judicial',
    'recursos.jutjats.title': 'Jutjats de Gavà',
    'recursos.jutjats.note':
      "Jutjat de Guàrdia · posada a disposició · judicis ràpids.",
    'recursos.hospital.badge': 'Salut',
    'recursos.hospital.title': 'Hospital / CAP de referència',
    'recursos.hospital.note':
      "Per a evacuacions, atestats de lesions, contrast alcoholèmia.",
    'recursos.tir.badge': 'Armes · Reglament',
    'recursos.tir.title': 'Centres de tir autoritzats',
    'recursos.tir.note':
      "Per a verificar ús de llicències i pràctiques obligatòries.",
    'recursos.moreToCome':
      'Més recursos pròximament. Tens idees? Digue-me-les.',

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
