// Llei 16/1991 · Policies Locals de Catalunya · esquema operatiu policial

export const LLEI_16_1991 = {
  id: '16-1991',
  code: 'Llei 16/1991',
  title: 'POLICIES LOCALS DE CATALUNYA',
  subtitle: 'Esquema operativo policial · Catalunya',
  meta: 'Generalitat · 10 julio · DOGC 1469 · BOE 09/08/1991',
  basis: 'Basada en el art. 13.3 Estatut d\'Autonomia: Catalunya tiene competencia exclusiva en coordinación de PPLL',
  stats: '6 Títulos · 58 artículos · Última modificación: 17/03/2023',

  escalas: [
    { key: 'sup',  icon: '⭐', name: 'Superior',   cats: 'Superintendente · Intendente Mayor · Intendente', grupo: 'A1' },
    { key: 'ejec', icon: '🎖️', name: 'Ejecutiva',  cats: 'Inspector', grupo: 'A2' },
    { key: 'inter',icon: '🏅', name: 'Intermedia', cats: 'Subinspector · Sargento', grupo: 'C1' },
    { key: 'bas',  icon: '👮', name: 'Básica',     cats: 'Cabo · Agente', grupo: 'C1' },
  ],

  bannerEAC: 'Disposición adicional 7ª: Agente y Cabo están clasificados a efectos económicos en el C1 (antes C2). No tiene equivalencia académica.',

  // 11 secciones colapsables
  secciones: [
    {
      id: 'disp-generales',
      icon: '📖',
      num: '1',
      title: 'DISPOSICIONES GENERALES',
      arts: 'Arts. 1–7 · Título I',
      open: true,
      blocks: [
        {
          art: 'Art. 1', title: 'Ámbito de aplicación',
          body: 'Aplica a todos los Cuerpos de Policía dependientes de los Municipios de Cataluña, denominados genéricamente «Policías locales». Los municipios sin Policía Local pueden tener Vigilantes (guardias, alguaciles, agentes o similares).',
          notes: [{ kind: 'agrav', text: 'Prohibición de gestión indirecta: el servicio se presta directamente por la Corporación. NO caben concesiones, arrendamientos ni órganos especiales de gestión.' }],
        },
        {
          art: 'Art. 2', title: 'Naturaleza y denominación',
          body: 'Institutos armados de naturaleza CIVIL con estructura y organización jerarquizadas.',
          chips: [
            { kind: 'info',  label: 'Denominación genérica: Policía Local' },
            { kind: 'local', label: 'Por tradición histórica: Policía Municipal o Guardia Urbana' },
          ],
        },
        {
          art: 'Art. 3', title: 'Creación por tramos de población',
          tabla: {
            cols: ['Población', 'Régimen'],
            rows: [
              ['> 10.000 hab', 'Pueden crear PL libremente', 'medio'],
              ['< 10.000 hab', 'Mayoría absoluta + autorización Conseller', 'leve'],
            ],
          },
          notes: [{ kind: 'clave', text: 'En menos de 10.000 hab: previo informe de la Comisión de Coordinación de las Policías Locales.' }],
        },
        {
          art: 'Art. 4', title: 'Cuerpo único y Mando',
          body: 'La Policía Local se integra en un CUERPO ÚNICO, sin perjuicio de su organización interna.',
          chips: [
            { kind: 'info',  label: 'Mando superior: Alcalde (puede delegar)' },
            { kind: 'local', label: 'Mando inmediato: Jefe del Cuerpo' },
          ],
        },
        {
          art: 'Art. 5', title: 'Ámbito territorial',
          body: 'Actuación limitada al territorio del municipio. Fuera solo en situaciones de emergencia y con autorización previa de autoridades competentes.',
          notes: [{ kind: 'pol', text: 'Se dará cuenta de estas actuaciones al Departament de Governació (actual Departament d\'Interior).' }],
        },
        {
          art: 'Arts. 6 y 7', title: 'Juramento y Agentes de la Autoridad',
          body: 'Antes de tomar posesión, juran o prometen acatar la Constitución y respetar el Estatuto de Autonomía. Los Policías Locales tienen en todo caso la condición de agentes de la autoridad.',
          notes: [{ kind: 'agrav', text: 'Los Vigilantes solo son agentes de la autoridad si: (1) están identificados, (2) ejercen funciones del art. 13 y (3) el municipio NO dispone de Policía Local. Si hay PL, NUNCA son agentes de la autoridad.' }],
        },
      ],
    },
    {
      id: 'armamento',
      icon: '🔫',
      num: '2',
      title: 'ARMAMENTO Y UNIFORME',
      arts: 'Arts. 8–9 · Cap. II',
      blocks: [
        {
          art: 'Art. 8', title: 'Armamento Reglamentario',
          body: 'Los Policías Locales, como integrantes de un instituto armado, llevan el armamento reglamentario que se les asigne.',
          chips: [
            { kind: 'info',     label: 'Alcalde determina (motivadamente) qué servicios se prestan sin armas' },
            { kind: 'negativo', label: 'Vigilantes: NO pueden portar armas de fuego' },
          ],
        },
        {
          art: 'Art. 9', title: 'Uniforme Reglamentario',
          body: 'Obligatorio usar el uniforme reglamentario, que solo puede utilizarse en el cumplimiento del servicio. El Alcalde puede autorizar servicios sin uniforme, en cuyo caso el agente llevará la documentación acreditativa.',
        },
      ],
    },
    {
      id: 'principios',
      icon: '⚖️',
      num: '3',
      title: 'PRINCIPIOS BÁSICOS DE ACTUACIÓN',
      arts: 'Art. 10 · Cap. III',
      blocks: [
        {
          art: 'Art. 10.1.1º', title: '1º · Adecuación al ordenamiento jurídico',
          mini: [
            ['a)', 'Respeto a Constitución, Estatut y ordenamiento'],
            ['b)', 'Neutralidad política, imparcialidad, sin discriminación'],
            ['c)', 'Integridad, dignidad; oposición a la corrupción'],
            ['d)', 'Jerarquía y subordinación'],
            ['e)', 'Colaboración con la Administración de Justicia'],
          ],
          notes: [{ kind: 'agrav', text: 'La obediencia debida NO ampara órdenes que entrañen delito o contrarias a la Constitución, al Estatuto o a las Leyes.' }],
        },
        {
          art: 'Art. 10.1.2º', title: '2º · Relaciones con la comunidad',
          body: 'Impedir prácticas abusivas o discriminatorias; trato correcto y esmerado; actuar con decisión y sin demora ante daño grave; uso de armas solo con riesgo racionalmente grave.',
          chips: [{ kind: 'local', label: 'COP · Congruencia, Oportunidad y Proporcionalidad' }],
        },
        {
          art: 'Art. 10.1.3º', title: '3º · Tratamiento de detenidos',
          body: 'Identificarse al detener · velar por vida, integridad, honor y dignidad · cumplir trámites, plazos y requisitos del ordenamiento jurídico.',
        },
        {
          art: 'Art. 10.1.4º-5º', title: '4º y 5º · Dedicación y Secreto profesional',
          mini: [
            ['Dedicación total', 'intervenir siempre, estén o no de servicio'],
            ['Secreto profesional', 'reserva sobre la información conocida por razón del cargo'],
          ],
          notes: [{ kind: 'clave', text: 'La responsabilidad es personal y directa (art. 10.2); no excluye la responsabilidad patrimonial de la Administración.' }],
        },
      ],
    },
    {
      id: 'funciones',
      icon: '🎯',
      num: '4',
      title: 'FUNCIONES PL Y VIGILANTES',
      arts: 'Arts. 11–13',
      blocks: [
        {
          art: 'Art. 11', title: 'FUNCIONES PL · las 13 letras',
          mini: [
            ['a)', 'Proteger autoridades y edificios locales'],
            ['b)', 'Ordenar, señalizar y dirigir tráfico urbano'],
            ['c)', 'Instruir atestados accidentes en núcleo urbano'],
            ['d)', 'Policía administrativa (ordenanzas, bandos)'],
            ['e)', 'Policía judicial (art. 12)'],
            ['f)', 'Diligencias de prevención de delitos'],
            ['g)', 'Colaborar en manifestaciones y concentraciones'],
            ['h)', 'Cooperar en conflictos privados (si requeridos)'],
            ['i)', 'Vigilar espacios públicos'],
            ['j)', 'Auxilio en accidentes/catástrofes (Prot. Civil)'],
            ['k)', 'Velar por medio ambiente y entorno'],
            ['l)', 'Actuaciones de seguridad vial'],
            ['m)', 'Cualquier otra función encomendada'],
          ],
          notes: [
            { kind: 'agrav', text: 'Las letras c) atestados y f) prevención → las actuaciones deben comunicarse a las FCSE competentes.' },
            { kind: 'pol',   text: 'Diferencias con LO 2/1986 art. 53: la 16/1991 añade explícitamente k) medio ambiente, i) vigilar espacios públicos y l) seguridad vial.' },
          ],
        },
        {
          art: 'Art. 12', title: 'Policía Judicial (art. 11.e)',
          mini: [
            ['a)', 'Auxiliar a Jueces, Tribunales y Mº Fiscal en investigación y detención, cuando sean requeridos'],
            ['b)', 'Practicar primeras diligencias de prevención y custodia de detenidos y objetos del delito'],
          ],
          notes: [{ kind: 'clave', text: 'Cooperación mutua con el resto de FCS. Son COLABORADORAS de las FCSE (art. 29.2 LO 2/1986).' }],
        },
        {
          art: 'Art. 13', title: 'Funciones de los VIGILANTES (limitadas)',
          mini: [
            ['a)', 'Custodiar bienes e instalaciones municipales'],
            ['b)', 'Ordenar y regular tráfico en núcleo urbano'],
            ['c)', 'Auxilio al ciudadano y Protección Civil'],
            ['d)', 'Velar cumplimiento ordenanzas y bandos'],
          ],
          notes: [{ kind: 'agrav', text: 'Los Vigilantes SOLO tienen estas 4 funciones. NO pueden ejercer Policía Judicial, ni prevención de delitos, ni atestados.' }],
        },
      ],
    },
    {
      id: 'coordinacion',
      icon: '🤝',
      num: '5',
      title: 'COORDINACIÓN Y COLABORACIÓN',
      arts: 'Arts. 14–23 · Título II',
      blocks: [
        {
          art: 'Art. 14', title: 'Concepto de Coordinación',
          body: 'Determinación de medios y sistemas de relación para la acción conjunta de las Policías Locales, integrándolas en el sistema de seguridad ciudadana de Cataluña.',
        },
        {
          art: 'Art. 15', title: 'Funciones de coordinación',
          mini: [
            ['a)', 'Homogeneizar medios técnicos'],
            ['b)', 'Sistema de información recíproca'],
            ['c)', 'Asesorar a Policías Locales'],
            ['d)', 'Canalizar colaboración interadministrativa'],
            ['e)', 'Coordinar protección civil'],
            ['f)', 'Normas de estructura y formación'],
            ['g)', 'Actuaciones comunes en seguridad vial'],
          ],
          notes: [{ kind: 'clave', text: 'Todo con respeto a la autonomía local y las competencias municipales en materia de Policía Local.' }],
        },
        {
          art: 'Art. 17', title: 'Junta Local de Seguridad',
          body: 'En municipios con Policía Local que creen la Junta Local de Seguridad (art. 54 LO 2/1986), pueden integrar representantes del Departament de Governació.',
          notes: [{ kind: 'agrav', text: 'La participación del Departament es preceptiva en municipios con presencia operativa de la Policía autonómica (Mossos d\'Esquadra).' }],
        },
        {
          art: 'Art. 20', title: 'Envío anual de Memoria',
          body: 'Las Corporaciones Locales con PL o Vigilantes envían al Departament, en el primer trimestre de cada año:',
          chips: [
            { kind: 'info', label: 'Memoria de servicios del año anterior' },
            { kind: 'info', label: 'Dotación de recursos humanos y materiales' },
          ],
        },
        {
          art: 'Art. 23', title: 'Convenios de cooperación',
          mini: [
            ['1.', 'Municipios sin PL pueden convenir con el Departament para que la Policía autonómica ejerza funciones locales.'],
            ['2.', 'Municipios con PL pueden solicitar apoyo de la Policía autonómica para servicios temporales/concretos.'],
            ['3.', 'Municipios limítrofes pueden suscribir acuerdos entre sus Policías (previa autorización del Conseller).'],
          ],
        },
      ],
    },
    {
      id: 'escalas',
      icon: '🏗️',
      num: '6',
      title: 'ESCALAS Y CATEGORÍAS',
      arts: 'Arts. 24–25 · Título III',
      open: true,
      isLocal: true,
      blocks: [
        {
          art: 'Art. 24', title: 'Las 4 Escalas y 7 Categorías',
          tabla: {
            cols: ['Escala', 'Categorías', 'Grupo'],
            rows: [
              ['Superior', 'Superintendente · Intendente Mayor · Intendente', 'A1', 'medio'],
              ['Ejecutiva', 'Inspector', 'A2', 'medio'],
              ['Intermedia', 'Subinspector · Sargento', 'C1', 'leve'],
              ['Básica', 'Cabo · Agente', 'C1', 'leve'],
            ],
          },
        },
        {
          art: 'Art. 25.3', title: 'Creación de categorías por población',
          tabla: {
            cols: ['Población', 'Categoría'],
            rows: [
              ['> 200.000 hab', 'Puede haber Superintendente', 'grave'],
              ['> 100.000 hab', 'Puede haber Int. Mayor e Intendente', 'medio'],
              ['Excepción (< 100.000 hab)', 'Int. Mayor si > 250 agentes · Intendente si > 100 agentes', 'leve'],
            ],
          },
          notes: [{ kind: 'agrav', text: 'Pregunta muy repetida: Superintendente SOLO en > 200.000 hab. Intendente Mayor e Intendente en > 100.000 hab (o excepcionalmente con muchos agentes).' }],
        },
      ],
    },
    {
      id: 'jefe',
      icon: '👔',
      num: '7',
      title: 'JEFE DEL CUERPO',
      arts: 'Arts. 26–27',
      blocks: [
        {
          art: 'Art. 26', title: 'Designación del Jefe',
          body: 'Es Jefe del Cuerpo el miembro de mayor graduación. En caso de igualdad, nombra el Alcalde según principios de objetividad, mérito, capacidad e igualdad.',
          chips: [
            { kind: 'info',  label: 'Bajo el mando del Alcalde (o persona delegada)' },
            { kind: 'local', label: 'El Alcalde designa al sustituto entre los de mayor graduación' },
          ],
        },
        {
          art: 'Art. 27', title: 'Funciones del Jefe',
          mini: [
            ['a)', 'Dirigir, coordinar y supervisar operaciones'],
            ['b)', 'Evaluar recursos y hacer propuestas'],
            ['c)', 'Transformar directrices en órdenes concretas'],
            ['d)', 'Informar al Alcalde del funcionamiento'],
            ['e)', 'Cualquier otra función del Reglamento municipal'],
          ],
        },
      ],
    },
    {
      id: 'acceso',
      icon: '📝',
      num: '8',
      title: 'ACCESO Y PROMOCIÓN',
      arts: 'Arts. 28–33 · Título IV',
      blocks: [
        {
          art: 'Art. 29', title: 'Acceso a AGENTE (libre)',
          body: 'Por oposición o concurso-oposición libre. Requisitos mínimos: ser español, edad entre mín./máx. del Reglamento, condiciones para ejercer funciones, no estar inhabilitado ni separado del servicio.',
          chips: [
            { kind: 'info',     label: 'Pruebas mínimas: culturales, físicas, médicas y psicotécnicas' },
            { kind: 'positivo', label: 'Curso selectivo en la Escuela de Policía de Cataluña (ISPC)' },
          ],
          notes: [{ kind: 'clave', text: 'Exentos del curso selectivo quienes aporten diploma del curso básico del ISPC.' }],
        },
        {
          art: 'Art. 30', title: 'Cabo, Sargento y Subinspector',
          body: 'Promoción interna mediante concurso-oposición entre miembros con mínimo 2 años en la categoría inmediatamente inferior, con titulación adecuada y curso específico del ISPC.',
        },
        {
          art: 'Art. 31', title: 'Escalas Superior y Ejecutiva',
          body: 'Inspector, Intendente, Intendente Mayor y Superintendente: concurso-oposición libre. Puede reservarse hasta el 50% para promoción interna (mín. 2 años en categoría inmediatamente inferior).',
        },
        {
          art: 'Art. 32', title: 'Tribunal de oposiciones · 1/3-1/3-1/3',
          mini: [
            ['1/3', 'Miembros o funcionarios de la Corporación'],
            ['1/3', 'Personal técnico especializado'],
            ['1/3', 'Departament de Governació (mín: 1 ISPC + 1 DG Seguridad)'],
          ],
        },
        {
          art: 'D.A. 8ª', title: 'Paridad de género',
          body: 'Convocatorias desde 1/1/2020: deben reservar plazas para mujeres para equilibrar la presencia en plantillas.',
          chips: [
            { kind: 'info',     label: 'Máximo: 40% de las plazas convocadas' },
            { kind: 'local',    label: 'Mínimo general: 25% (si > 3 plazas)' },
            { kind: 'positivo', label: 'NO aplica si ya hay ≥ 33% de mujeres en cuerpo/escala/categoría' },
          ],
          notes: [{ kind: 'agrav', text: 'Condición: diferencial negativo de puntuación de la candidata seleccionada no superior al 15% respecto al candidato preterido.' }],
        },
      ],
    },
    {
      id: 'estatuto',
      icon: '📋',
      num: '9',
      title: 'RÉGIMEN ESTATUTARIO',
      arts: 'Arts. 34–45 · Título V',
      blocks: [
        {
          art: 'Arts. 34–36', title: 'Derechos económicos y profesionales',
          body: 'Jornada, horario, vacaciones y permisos fijados por cada Entidad Local. Retribuciones: básicas (igual que el resto de funcionarios) + complementarias (fijadas por el Pleno).',
        },
        {
          art: 'Arts. 37–38', title: 'Incompatibilidad y Huelga',
          chips: [
            { kind: 'negativo', label: 'Incompatibilidad con cualquier otra actividad pública o privada' },
            { kind: 'negativo', label: 'NO huelga ni acciones sustitutivas' },
          ],
          notes: [{ kind: 'agrav', text: 'El derecho sindical sí se reconoce (D.A. 1ª y Ley 9/1987, de 12 de junio).' }],
        },
        {
          art: 'Arts. 41–42', title: 'Defensa jurídica · Seguridad e higiene',
          body: 'La Corporación garantiza la defensa jurídica en causas por actuaciones en el ejercicio de sus funciones.',
          chips: [
            { kind: 'positivo', label: 'Revisión médica anual' },
            { kind: 'positivo', label: 'Prevención de enfermedades contagiosas' },
          ],
        },
        {
          art: 'Arts. 43–44', title: 'Segunda Actividad',
          body: 'Pase a segunda actividad por: edad (nunca < 57 años) o dictamen médico de disminución de capacidad.',
          chips: [
            { kind: 'positivo', label: 'Preferencia: mismo Cuerpo, otras funciones' },
            { kind: 'info',     label: 'Subsidiario: otros puestos de la Corporación' },
            { kind: 'local',    label: 'NO supone disminución de retribuciones básicas ni del grado personal' },
          ],
          notes: [{ kind: 'clave', text: 'Tribunal médico (art. 44): 3 médicos → 1 designado por el Ayto. + 1 por el interesado + 1 por sorteo entre facultativos del Servei Català de la Salut.' }],
        },
      ],
    },
    {
      id: 'disciplinario',
      icon: '⚠️',
      num: '10',
      title: 'RÉGIMEN DISCIPLINARIO · FALTAS',
      arts: 'Arts. 46–53 · Título VI',
      isDisciplinario: true,
      blocks: [
        {
          art: 'Art. 47', title: 'Clasificación de las Faltas',
          chips: [
            { kind: 'negativo', label: '🔴 Muy graves (art. 48)' },
            { kind: 'agravada', label: '🟡 Graves (art. 49)' },
            { kind: 'positivo', label: '🟢 Leves (art. 50)' },
          ],
        },
        {
          art: 'Art. 48', title: 'FALTAS MUY GRAVES (selección de las 22)',
          mini: [
            ['a)', 'Incumplir deber de fidelidad a la CE/Estatut'],
            ['b)', 'Discriminación por raza, sexo, orientación...'],
            ['d)', 'Torturas, maltratos, tratos degradantes'],
            ['e)', 'Conducta constitutiva de delito doloso'],
            ['f)', 'Prevaricación o soborno (o no denunciarlo)'],
            ['g)', 'Abandono del servicio'],
            ['h)', 'Insubordinación a mandos'],
            ['i)', 'Denegación de auxilio / falta de intervención'],
            ['j)', 'Pérdida de armas o permitir sustracción'],
            ['k)', 'Participar en huelgas'],
            ['n)', 'Incumplir incompatibilidades'],
            ['r)', 'Embriagarse en servicio / drogas'],
            ['u)', 'Reincidencia en la comisión de faltas graves'],
          ],
        },
        {
          art: 'Art. 49', title: 'FALTAS GRAVES (las 16)',
          mini: [
            ['a)', 'Desobediencia a superiores'],
            ['b)', 'Faltas de respeto graves'],
            ['d)', 'Daños graves al patrimonio de la Corp.'],
            ['j)', 'Consumir bebidas alcohólicas en servicio'],
            ['k)', 'Pérdida de credenciales'],
            ['l)', 'Falta de asistencia injustificada'],
            ['m)', 'Reincidencia en faltas leves'],
            ['n)', 'Pérdida de armas por negligencia simple'],
          ],
        },
        {
          art: 'Art. 50', title: 'FALTAS LEVES (las 8)',
          mini: [
            ['a)', 'Incorrección con superiores/compañeros/ciudadanos'],
            ['b)', 'Demora o negligencia en cumplimiento'],
            ['c)', 'Descuido en presentación personal'],
            ['d)', 'Descuido en locales/material'],
            ['e)', 'Incumplir jornada de trabajo'],
            ['f)', 'Permuta de destino con ánimo de lucro'],
            ['g)', 'Prescindir del conducto reglamentario'],
            ['h)', 'Impuntualidad repetida en un mes'],
          ],
        },
        {
          art: 'Art. 52', title: 'SANCIONES por tipo de falta',
          tabla: {
            cols: ['Falta', 'Sanción', 'Duración'],
            rows: [
              ['Muy Grave', 'Separación del servicio o suspensión de funciones', '> 1 año y < 6', 'grave'],
              ['Grave',     'Suspensión o traslado',                              '> 15 días y < 1 año', 'medio'],
              ['Leve',      'Suspensión · traslado · deducción · amonestación',   '1–15 días', 'leve'],
            ],
          },
          notes: [{ kind: 'agrav', text: 'La separación del servicio solo procede por falta muy grave y la impone el Pleno (no el Alcalde).' }],
        },
        {
          art: 'Art. 53', title: 'Graduación de sanciones',
          mini: [
            ['a)', 'Intencionalidad'],
            ['b)', 'Perturbación de servicios'],
            ['c)', 'Daños y perjuicios causados'],
            ['d)', 'Reincidencia'],
            ['e)', 'Grado de participación'],
            ['f)', 'Trascendencia para la seguridad pública'],
          ],
        },
      ],
    },
    {
      id: 'procedimiento',
      icon: '📅',
      num: '11',
      title: 'PROCEDIMIENTO Y PRESCRIPCIÓN',
      arts: 'Arts. 54–58',
      blocks: [
        {
          art: 'Art. 54', title: 'Competencia sancionadora',
          mini: [
            ['Alcalde', 'Incoa expediente, nombra instructor y secretario. Sanciona faltas muy graves (salvo separación), graves y leves.'],
            ['Pleno',   'Impone la separación del servicio.'],
          ],
          chips: [
            { kind: 'agravada', label: 'Faltas graves y muy graves: SIEMPRE con expediente' },
            { kind: 'positivo', label: 'Faltas leves: basta audiencia al interesado' },
          ],
        },
        {
          art: 'Arts. 55–57', title: 'Suspensión provisional y medidas cautelares',
          body: 'Suspensión provisional inicial: 1 mes, prorrogable hasta máximo 6 meses (salvo causa imputable al expedientado o procedimiento penal).',
          chips: [
            { kind: 'agravada', label: 'Suspensión: pérdida de complemento específico y gratificaciones' },
            { kind: 'info',     label: 'Retirada de arma, credencial y prohibición de uniforme' },
          ],
        },
        {
          art: 'Art. 58', title: '⏰ PRESCRIPCIÓN DE FALTAS Y SANCIONES',
          tabla: {
            cols: ['Tipo', 'Falta', 'Sanción'],
            rows: [
              ['🔴 Muy Grave', '6 años', '6 años', 'grave'],
              ['🟡 Grave',     '2 años', '2 años', 'medio'],
              ['🟢 Leve',      '1 mes',  '1 mes',  'leve'],
            ],
          },
          notes: [{ kind: 'pol', text: 'Regla mnemotécnica: «6 · 2 · 1» — 6 años muy graves · 2 años graves · 1 mes leves. Aplica TANTO a faltas como a sanciones.' }],
        },
      ],
    },
  ],

  recuerda: [
    'Basada en el art. 13.3 Estatut d\'Autonomia. Cataluña tiene competencia exclusiva en coordinación de PPLL.',
    'La Policía Local es institut armat de naturalesa civil con estructura jerarquizada (art. 2).',
    'Denominación genérica: Policía Local. Por tradición: Policía Municipal o Guardia Urbana.',
    'Solo puede haber PL en municipios > 10.000 hab; en < 10.000 hab, con mayoría absoluta + autorización del Conseller.',
    'Se integra en Cuerpo Único. Mando: Alcalde (superior) y Jefe del Cuerpo (inmediato).',
    'Ámbito: término municipal. Salida solo en emergencia y con autorización previa.',
    'Juran/prometen la Constitución y el Estatut. Son siempre agentes de la autoridad.',
    'Vigilantes: agentes de la autoridad solo si identificados + funciones art. 13 + NO hay PL.',
    'Art. 11: 13 funciones (a-m). Destacan c) atestados y f) prevención (con comunicación a FCSE).',
    'Añadidos propios 16/91 vs LO 2/1986: i) espacios públicos · k) medio ambiente · l) seguridad vial.',
    '4 Escalas, 7 Categorías: Superior (A1) · Ejecutiva (A2) · Intermedia (C1) · Básica (C1).',
    'Superintendente solo en > 200.000 hab; Intendente Mayor e Intendente en > 100.000 hab.',
    'Acceso a Agente: oposición/concurso-oposición libre + curso ISPC.',
    'Promoción interna: mínimo 2 años en la categoría inmediatamente inferior + curso específico.',
    'Tribunal de oposición: composición 1/3 · 1/3 · 1/3.',
    'Segunda actividad: edad mínima 57 años o dictamen médico. NO reduce retribuciones básicas ni grado.',
    'Tribunal médico (segunda actividad): 3 médicos → 1 Ayto. + 1 interesado + 1 sorteo CatSalut.',
    'Sanción de separación del servicio: la impone el Pleno (no el Alcalde).',
    'Prescripción 6-2-1: muy grave 6 años · grave 2 años · leve 1 mes (faltas y sanciones, igual).',
    'Suspensión provisional: máximo 6 meses (salvo proceso penal o dilación imputable).',
    'Paridad (D.A. 8ª): reserva 25%-40% mujeres desde 2020 si presencia femenina < 33%.',
  ],
};

export const LLEIS = { '16-1991': LLEI_16_1991 };
export const LLEIS_LIST = Object.values(LLEIS);
