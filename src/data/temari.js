// Temari — contingut de les lliçons de cada bloc.
// Contingut de reserva que viatja dins del binari. El temari real i actualitzat
// arriba per OTA des de content/content.json (clau `temari`).
//
// Format d'una lliçó:
//   { id, title, minutes, summary, blocks: [ { h?, p?, list?, note? } ] }

export const TEMARI = {
  1: {
    intro: 'Norma suprema de l\'ordenament jurídic espanyol. És el bloc amb més pes a l\'examen.',
    lessons: [
      {
        id: 't1-l1',
        title: 'Estructura i característiques de la CE',
        minutes: 12,
        summary: 'Títol preliminar, 10 títols, 169 articles, 4 disposicions addicionals.',
        blocks: [
          { h: 'Estructura', p: 'La Constitució de 1978 consta d\'un preàmbul, un títol preliminar, deu títols numerats amb 169 articles, quatre disposicions addicionals, nou de transitòries, una de derogatòria i una de final.' },
          { h: 'Característiques', list: [
            'Rígida: la reforma segueix els procediments dels arts. 167 i 168 CE.',
            'Consensuada: fruit del pacte entre les forces polítiques de la Transició.',
            'Extensa i derivada de l\'experiència constitucional europea.',
            'Directament aplicable, especialment en matèria de drets fonamentals.',
          ] },
          { note: 'Pregunta clàssica: 169 articles (no 159 ni 176).' },
        ],
      },
      {
        id: 't1-l2',
        title: 'Títol preliminar (arts. 1 a 9)',
        minutes: 14,
        summary: 'Valors superiors, sobirania, llengües, banderes i principis de l\'art. 9.3.',
        blocks: [
          { h: 'Art. 1 CE', p: 'Espanya es constitueix en un Estat social i democràtic de Dret, que propugna com a valors superiors del seu ordenament jurídic la llibertat, la justícia, la igualtat i el pluralisme polític. La sobirania nacional resideix en el poble espanyol. La forma política és la Monarquia parlamentària.' },
          { h: 'Art. 9.3 CE — principis garantits', list: [
            'Legalitat',
            'Jerarquia normativa',
            'Publicitat de les normes',
            'Irretroactivitat de les disposicions sancionadores no favorables o restrictives de drets individuals',
            'Seguretat jurídica',
            'Responsabilitat i interdicció de l\'arbitrarietat dels poders públics',
          ] },
        ],
      },
      {
        id: 't1-l3',
        title: 'La reforma constitucional',
        minutes: 10,
        summary: 'Procediment ordinari (art. 167) i agravat (art. 168).',
        blocks: [
          { h: 'Procediment ordinari (art. 167)', p: 'Aprovació per majoria de 3/5 de cada cambra. Si no hi ha acord, comissió mixta i, si cal, majoria absoluta al Senat i 2/3 al Congrés. Referèndum si ho demana 1/10 dels membres de qualsevol cambra.' },
          { h: 'Procediment agravat (art. 168)', p: 'S\'aplica a la revisió total o a la que afecti el títol preliminar, la secció 1a del capítol II del títol I o el títol II. Exigeix 2/3 de cada cambra, dissolució de les Corts, ratificació per les noves cambres per 2/3 i referèndum obligatori.' },
        ],
      },
    ],
  },

  3: {
    intro: 'Drets fonamentals i llibertats públiques: el bloc que més es pregunta en l\'actuació policial.',
    lessons: [
      {
        id: 't3-l1',
        title: 'Classificació dels drets al títol I',
        minutes: 12,
        summary: 'Secció 1a, secció 2a, principis rectors i els seus nivells de protecció.',
        blocks: [
          { h: 'Nivells de protecció', list: [
            'Arts. 15–29 (secció 1a) + art. 14 i objecció de consciència: recurs d\'empara, reserva de llei orgànica i procediment preferent i sumari.',
            'Arts. 30–38 (secció 2a): reserva de llei ordinària i respecte al contingut essencial.',
            'Arts. 39–52 (principis rectors): informen la legislació, però només són al·legables segons el que disposin les lleis que els despleguin.',
          ] },
        ],
      },
      {
        id: 't3-l2',
        title: 'Dret a la llibertat: la detenció (art. 17 CE)',
        minutes: 16,
        summary: 'Límit de 72 hores, habeas corpus i drets del detingut.',
        blocks: [
          { h: 'Termini', p: 'La detenció preventiva no pot durar més del temps estrictament necessari per a les investigacions. En tot cas, en el termini màxim de 72 hores el detingut ha de ser posat en llibertat o a disposició de l\'autoritat judicial.' },
          { h: 'Drets del detingut (art. 520 LECrim)', list: [
            'Ser informat dels fets i dels motius de la detenció, de forma comprensible.',
            'Guardar silenci i no declarar contra si mateix ni declarar-se culpable.',
            'Designar advocat i ser assistit per ell sense demora.',
            'Accés als elements de les actuacions essencials per impugnar la detenció.',
            'Comunicar la detenció i el lloc de custòdia a un familiar o tercer.',
            'Ser assistit per intèrpret i reconegut pel metge forense.',
          ] },
          { note: 'L\'habeas corpus (LO 6/1984) permet posar immediatament a disposició judicial qualsevol persona detinguda il·legalment.' },
        ],
      },
      {
        id: 't3-l3',
        title: 'Inviolabilitat del domicili i secret de les comunicacions (art. 18 CE)',
        minutes: 14,
        summary: 'Honor, intimitat, pròpia imatge, domicili i comunicacions.',
        blocks: [
          { h: 'Entrada al domicili', p: 'Cap entrada o registre pot fer-se sense consentiment del titular o resolució judicial, llevat del cas de delicte flagrant.' },
          { h: 'Comunicacions', p: 'Es garanteix el secret de les comunicacions, especialment de les postals, telegràfiques i telefòniques, excepte resolució judicial motivada.' },
        ],
      },
      {
        id: 't3-l4',
        title: 'Suspensió de drets (art. 55 CE)',
        minutes: 8,
        summary: 'Estats d\'alarma, excepció i setge, i suspensió individual.',
        blocks: [
          { p: 'Els arts. 17, 18.2 i 3, 19, 20.1 a) i d) i 5, 21, 28.2 i 37.2 poden ser suspesos quan s\'acordi la declaració de l\'estat d\'excepció o de setge. L\'art. 17.3 només se suspèn en estat de setge.' },
        ],
      },
    ],
  },

  4: {
    intro: 'Organització i estructura de la Policia de la Generalitat – Mossos d\'Esquadra.',
    lessons: [
      {
        id: 't4-l1',
        title: 'Marc legal del cos',
        minutes: 12,
        summary: 'Llei 10/1994, LO 2/1986 i Llei 4/2003.',
        blocks: [
          { h: 'Normes clau', list: [
            'LO 2/1986, de 13 de març, de Forces i Cossos de Seguretat.',
            'Llei 10/1994, d\'11 de juliol, de la Policia de la Generalitat – Mossos d\'Esquadra.',
            'Llei 4/2003, de 7 d\'abril, d\'ordenació del sistema de seguretat pública de Catalunya.',
          ] },
        ],
      },
      {
        id: 't4-l2',
        title: 'Escales, categories i funcions',
        minutes: 14,
        summary: 'Escala bàsica, intermèdia, executiva i superior.',
        blocks: [
          { h: 'Escales', list: [
            'Escala bàsica: mosso/a i caporal/a.',
            'Escala intermèdia: sergent/a i sotsinspector/a.',
            'Escala executiva: inspector/a.',
            'Escala superior: intendent/a, comissari/ària i major.',
          ] },
        ],
      },
      {
        id: 't4-l3',
        title: 'Desplegament territorial',
        minutes: 10,
        summary: 'Regions policials, àrees bàsiques policials i comissaries.',
        blocks: [
          { p: 'El territori s\'organitza en regions policials, que es divideixen en àrees bàsiques policials (ABP), unitat bàsica de desplegament amb comissaria de referència.' },
        ],
      },
    ],
  },

  7: {
    intro: 'LO 4/2015, de protecció de la seguretat ciutadana: la norma d\'ús diari en via pública.',
    lessons: [
      {
        id: 't7-l1',
        title: 'Identificació de persones (art. 16)',
        minutes: 12,
        summary: 'Requisits, trasllat a dependències i límit de 6 hores.',
        blocks: [
          { h: 'Requisits', p: 'Els agents poden requerir la identificació quan hi hagi indicis que la persona pot haver participat en una infracció, o quan sigui necessari per prevenir un delicte.' },
          { h: 'Trasllat a dependències', p: 'Si no es pot identificar la persona per cap mitjà, se la pot traslladar a dependències properes per a la seva identificació. La diligència no pot durar més de sis hores i s\'ha d\'estendre un llibre-registre.' },
        ],
      },
      {
        id: 't7-l2',
        title: 'Registres corporals externs (art. 20)',
        minutes: 10,
        summary: 'Proporcionalitat, respecte a la dignitat i registre amb despullament.',
        blocks: [
          { list: [
            'Cal respectar els principis d\'injerència mínima, igualtat i proporcionalitat.',
            'Es fa preferentment per agent del mateix sexe.',
            'El registre amb despullament parcial exigeix motivació i lloc reservat, i s\'ha de deixar constància escrita.',
          ] },
        ],
      },
      {
        id: 't7-l3',
        title: 'Règim sancionador',
        minutes: 14,
        summary: 'Infraccions molt greus, greus i lleus i les seves quanties.',
        blocks: [
          { h: 'Quanties', list: [
            'Molt greus: de 30.001 a 600.000 €.',
            'Greus: de 601 a 30.000 €.',
            'Lleus: de 100 a 600 €.',
          ] },
        ],
      },
    ],
  },

  8: {
    intro: 'Trànsit, circulació de vehicles de motor i seguretat viària.',
    lessons: [
      {
        id: 't8-l1',
        title: 'Taxes d\'alcohol i drogues',
        minutes: 12,
        summary: 'Límits administratius i el llindar penal de l\'art. 379.2 CP.',
        blocks: [
          { h: 'Límits administratius', list: [
            'Conductors en general: 0,25 mg/l en aire espirat (0,5 g/l en sang).',
            'Conductors novells i professionals: 0,15 mg/l en aire espirat (0,3 g/l en sang).',
          ] },
          { h: 'Llindar penal', p: 'Superar 0,60 mg/l en aire espirat (1,2 g/l en sang) constitueix delicte de l\'art. 379.2 CP en tot cas.' },
        ],
      },
      {
        id: 't8-l2',
        title: 'Classificació de les infraccions de trànsit',
        minutes: 12,
        summary: 'Lleus, greus i molt greus; punts i imports.',
        blocks: [
          { list: [
            'Lleus: fins a 100 €, sense pèrdua de punts.',
            'Greus: 200 €, amb pèrdua de fins a 6 punts en alguns supòsits.',
            'Molt greus: 500 € (o 1.000 € en alcohol i drogues), amb pèrdua de fins a 6 punts.',
          ] },
        ],
      },
    ],
  },

  17: {
    intro: 'Deontologia policial, ètica professional i codi de conducta.',
    lessons: [
      {
        id: 't17-l1',
        title: 'Principis bàsics d\'actuació (art. 5 LO 2/1986)',
        minutes: 12,
        summary: 'Adequació a l\'ordenament, relacions amb la comunitat, tractament de detinguts i secret professional.',
        blocks: [
          { list: [
            'Actuar amb absolut respecte a la Constitució i a la resta de l\'ordenament jurídic.',
            'Actuar amb integritat i dignitat, sense recórrer a la tortura ni a tractes inhumans o degradants.',
            'Impedir qualsevol pràctica abusiva, arbitrària o discriminatòria.',
            'Utilitzar les armes només en les situacions de risc racionalment greu per a la vida o la integritat.',
            'Guardar rigorós secret professional de les informacions conegudes per raó del càrrec.',
          ] },
          { note: 'Congruència, oportunitat i proporcionalitat són els tres criteris rectors de l\'ús de la força.' },
        ],
      },
    ],
  },
};
