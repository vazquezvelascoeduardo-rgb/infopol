// Lleis · fitxes operatives (model Llei 16/1991 PL Catalunya)

export const LLEIS = {
  '16-1991': {
    id: '16-1991',
    code: 'LL · 16/1991',
    shortTitle: 'Llei 16/1991',
    title: 'Llei 16/1991, de les policies locals de Catalunya',
    sub: 'Norma fonamental que regula l\'estructura, funcions, coordinació i règim del personal de les policies locals dels municipis de Catalunya.',
    color: 'leyes', // taronja (categoria T)
    accent: '#E89421',
    state: 'Vigent',
    publishedAt: '25/07/1991',
    publishedAtLong: 'DOGC núm. 1467, 25 juliol 1991 · BOE núm. 209, 31 d\'agost 1991',
    approved: '10 de juliol de 1991',
    summary: 'Article 4 · Mossos d\'Esquadra (LO 2/1986 + Llei 10/1994) i Policies Locals: dues policies pròpies de Catalunya. La 16/91 desplega per al ròssec municipal.',

    stats: [
      { icon: '📘', label: '53 articles' },
      { icon: '📚', label: '5 títols' },
      { icon: '🏛️', label: 'DA · DT · DD · DF' },
      { icon: '🔄', label: 'Diverses reformes' },
    ],

    pillars: [
      {
        accent: '#2FB66B', bg: '#E8F7EE',
        icon: '⚖️', kicker: 'Disposicions generals',
        title: 'NATURA I ÀMBIT', meta: 'Tit. I',
        art: 'Arts. 1–9', desc: 'Cossos de policia, dependència, demarcació.',
      },
      {
        accent: '#2F6BD8', bg: '#EAF1FE',
        icon: '🛡️', kicker: 'Funcions',
        title: 'FUNCIONS', meta: 'Tit. II',
        art: 'Arts. 10–14', desc: 'Funcions, principis d\'actuació, drets i deures.',
      },
      {
        accent: '#E5484D', bg: '#FFEFEC',
        icon: '🏛️', kicker: 'Coordinació',
        title: 'COORDINACIÓ', meta: 'Tit. IV',
        art: 'Arts. 26–35', desc: 'Comissió de Coordinació, ISPC, mobilitat.',
      },
    ],

    cronologia: [
      { date: '14 ABR 1986', text: 'LO 2/1986 de Forces i Cossos de Seguretat · marc estatal de les PL.' },
      { date: '11 GEN 1991', text: 'Inici tramitació al Parlament de Catalunya.' },
      { date: '10 JUL 1991', text: 'Aprovació de la Llei 16/1991 al Parlament.', highlight: true },
      { date: '25 JUL 1991', text: 'Publicació al DOGC núm. 1467 · entrada en vigor.' },
      { date: '31 AGO 1991', text: 'Publicació al BOE núm. 209.' },
      { date: '11 JUL 1994', text: 'Llei 10/1994 dels Mossos d\'Esquadra · complement institucional.' },
      { date: '7 ABR 2003', text: 'Llei 4/2003 d\'ordenació del sistema de seguretat pública · marc integrat.' },
      { date: 'ACTUAL', text: 'Vigent · diverses modificacions puntuals i desplegament reglamentari.' },
    ],

    titols: [
      { id: 'I',  arts: 'Arts. 1–9',   accent: '#2FB66B', name: 'Disposicions generals',
        desc: 'Concepte, dependència orgànica i demarcació territorial dels cossos de policia local.' },
      { id: 'II', arts: 'Arts. 10–14', accent: '#2F6BD8', name: 'Funcions, principis i estatut',
        desc: 'Funcions de la PL (art. 11), principis bàsics d\'actuació, identificació i règim disciplinari.' },
      { id: 'III', arts: 'Arts. 15–25', accent: '#9747D6', name: 'Estructura i organització',
        desc: 'Escales, categories, comandament, prefectura, plantilles i règim intern dels cossos.' },
      { id: 'IV', arts: 'Arts. 26–35', accent: '#E5484D', name: 'Coordinació de les policies locals',
        desc: 'Comissió de Coordinació, ISPC, conveni d\'auxili, mobilitat entre municipis.' },
      { id: 'V',  arts: 'Arts. 36–53', accent: '#E89A1C', name: 'Selecció, formació i mobilitat',
        desc: 'Accés, processos selectius, formació bàsica i contínua a l\'Institut de Seguretat Pública.' },
      { id: 'DD', arts: 'DA · DT · DF', accent: '#8A8A8A', name: 'Disposicions',
        desc: 'Addicionals, transitòries, derogatòria i finals.' },
    ],

    funcions: [
      'Protegir autoritats locals · vigilar edificis i instal·lacions municipals.',
      'Ordenar, senyalitzar i dirigir el trànsit al nucli urbà · disciplina viària (LSV/RGC).',
      'Instruir atestats per accidents de circulació en zona urbana.',
      'Policia administrativa: ordenances, edictes i bans del municipi.',
      'Policia judicial · auxili als jutjats i a la resta de cossos (Mossos, FCSE).',
      'Auxili immediat en cas d\'accident, catàstrofe o calamitat pública.',
      'Prevenció d\'actes delictius i col·laboració amb les FCS de l\'Estat.',
      'Vigilar espais públics i protegir manifestacions / reunions.',
      'Cooperació en la resolució de conflictes privats si en són requerits.',
    ],

    principis: [
      { num: '11.2.a', t: 'Adequació a l\'ordenament jurídic',
        d: 'Lleialtat constitucional, neutralitat política i absoluta imparcialitat.' },
      { num: '11.2.b', t: 'Relacions amb la comunitat',
        d: 'Tracte correcte i acurat. Evitar abusos, arbitrarietat o violència.' },
      { num: '11.2.c', t: 'Tractament del detingut',
        d: 'Respecte als drets, l\'honor i la dignitat. Identificació immediata davant del detingut.' },
      { num: '11.2.d', t: 'Dedicació professional',
        d: 'Servei permanent · intervenir sempre en defensa de la llei i la seguretat.' },
      { num: '11.2.e', t: 'Secret professional',
        d: 'Reserva absoluta de la informació coneguda en raó del càrrec.' },
      { num: '11.2.f', t: 'Responsabilitat',
        d: 'Subjecció jeràrquica · obediència deguda però no a ordres manifestament il·legals.' },
    ],

    operativa: [
      { art: 'Art. 11.a', title: 'Protecció autoritats', desc: 'Custòdia d\'edificis i d\'autoritats municipals.', hl: false },
      { art: 'Art. 11.b', title: 'Trànsit urbà', desc: 'Ordenar, senyalitzar i dirigir el trànsit al nucli urbà.', hl: true },
      { art: 'Art. 11.c', title: 'Atestats accidents', desc: 'Instruir atestats per accidents en zona urbana.', hl: true },
      { art: 'Art. 11.d', title: 'Policia administrativa', desc: 'Vetllar pel compliment d\'ordenances, edictes i bans.', hl: false },
      { art: 'Art. 11.e', title: 'Policia judicial', desc: 'Auxili als jutjats i a la resta de FCS.', hl: true },
      { art: 'Art. 11.f', title: 'Auxili en sinistre', desc: 'Actuació immediata en accident, catàstrofe o calamitat.', hl: false },
      { art: 'Art. 11.g', title: 'Prevenció delictiva', desc: 'Diligències per evitar actes delictius en col·laboració amb FCSE.', hl: true },
      { art: 'Art. 11.h', title: 'Vigilància pública', desc: 'Custòdia d\'espais públics, manifestacions i reunions.', hl: false },
      { art: 'Art. 11.i', title: 'Cooperació veïnal', desc: 'Col·laborar a resoldre conflictes privats si són requerits.', hl: false },
      { art: 'Art. 12',   title: 'Identificació', desc: 'Acreditar la condició d\'agent · número de TIP visible.', hl: true },
      { art: 'Art. 13',   title: 'Drets sindicals', desc: 'Sindicació, formació, condicions dignes i promoció.', hl: false },
      { art: 'Art. 14',   title: 'Règim disciplinari', desc: 'Faltes lleus, greus i molt greus · sancions reglades.', hl: true },
    ],

    territorial: [
      { icon: '🇪🇸', accent: '#E5484D', bg: '#FFEFEC', name: 'Estat', desc: 'LO 2/1986 · marc bàsic FCS estatal i règim general.', meta: 'Cobertura competencial' },
      { icon: '🏞️', accent: '#F26B1F', bg: '#FFE9D8', name: 'Generalitat', desc: 'Llei 16/1991 · coordinació + Mossos (Llei 10/1994).', meta: 'ISPC · DGAS' },
      { icon: '🏘️', accent: '#E89A1C', bg: '#FFF6E0', name: 'Diputació / Vegueria', desc: 'Suport tècnic · cooperació intermunicipal.', meta: 'LBRL 7/1985' },
      { icon: '🏛️', accent: '#2FB66B', bg: '#DFF7E9', name: 'Municipi', desc: 'Cos de PL sota l\'alcalde · cap del cos sota la prefectura.', meta: 'Art. 1 i 5 LL 16/91', highlight: true },
    ],

    reformes: [
      { year: 'L 12/1995', tag: 'Modificació parcial', title: 'Adaptació als ajuntaments petits', desc: 'Vigilants municipals i agutzils · règim per a municipis sense cos PL.', date: 'BOE i DOGC 1995' },
      { year: 'L 4/2003', tag: 'Sistema de seguretat pública', title: 'Encaix dins el sistema integrat', desc: 'Marc de seguretat pública de Catalunya · coordinació amb Mossos.', date: 'DOGC 7 abril 2003' },
    ],

    keywords: ['policia local', 'PL', 'Catalunya', 'coordinació', 'ISPC', 'mobilitat', 'oposicions'],
  },
};

export const LLEIS_LIST = Object.values(LLEIS);
