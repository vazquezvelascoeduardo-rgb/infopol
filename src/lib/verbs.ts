// Els tres verbs de l'Acadèmia i què hi ha a dins de cadascun.
//
// Viu aquí i no a la pàgina perquè ho fan servir dos llocs: la portada
// d'Acadèmia, que ensenya els tres botons, i la pantalla de cada verb,
// que ensenya el que porta a dins. Si estigués duplicat, un dia dirien
// coses diferents —que és el que passava abans entre la portada i el
// submenú de la barra.
import { RUTES, type Cos } from './cos';
import type { ModulPro } from './pla';
import type { NomIc } from './v3';

export type Entrada = {
  titol: string;
  sub: string;
  icona: NomIc;
  to: string;
  insignia?: string;
  /** La principal del verb: és la que es veu gran i primera. */
  destacat?: boolean;
  modul?: ModulPro;
};

export type Verb = {
  id: 'estudiar' | 'practicar' | 'repassar';
  titol: string;
  sub: string;
  icona: NomIc;
  insignia: string;
  entrades: Entrada[];
};

export function verbs(cos: Cos, temes: number): Verb[] {
  const r = RUTES[cos];
  return [
    {
      id: 'estudiar',
      titol: 'Estudiar',
      sub: 'El temari i tot el que entra a l\'examen',
      icona: 'book',
      insignia: `${temes} TEMES`,
      entrades: [
        {
          titol: 'Temari', sub: 'Tema a tema, amb els teus subratllats',
          icona: 'book', to: r.estudi, insignia: `${temes} TEMES`,
          destacat: true, modul: 'temari-complet',
        },
        {
          titol: 'Esquemes', sub: 'La matèria en quadres, per repassar de pressa',
          icona: 'layers', to: r.esquemes, modul: 'esquemes',
        },
        {
          titol: 'Cultura general', sub: '16 àrees, de geografia a esport',
          icona: 'globe', to: '/cultura-general',
        },
        {
          titol: 'Actualitat', sub: 'Notícies, personalitats, premis i esports',
          icona: 'news', to: '/noticies',
        },
      ],
    },
    {
      id: 'practicar',
      titol: 'Practicar',
      sub: 'Posa\'t a prova i mira on ets',
      icona: 'check',
      insignia: 'TESTS',
      entrades: [
        {
          titol: 'Tests', sub: 'Per tema, per blocs o de tot alhora',
          icona: 'check', to: r.test, insignia: 'TESTS', destacat: true,
        },
        {
          titol: 'Psicotècnics', sub: 'Aptitud: figures, cubs, sèries i càlcul',
          icona: 'brain', to: `${r.test}/psicotecnics`,
        },
        {
          titol: 'Flashcards', sub: 'Targetes ràpides, per fixar dades',
          icona: 'cards', to: r.flashcards,
        },
        {
          titol: 'Reptes', sub: 'Missions i objectius per no deixar-ho',
          icona: 'medal', to: '/retos',
        },
      ],
    },
    {
      id: 'repassar',
      titol: 'Repassar',
      sub: 'Què toca avui i on fluixeges',
      icona: 'brain',
      insignia: 'DIARI',
      entrades: [
        {
          titol: 'Repàs intel·ligent', sub: 'El sistema et diu què toca repassar avui',
          icona: 'brain', to: '/repas', insignia: 'DIARI', destacat: true,
        },
        {
          titol: 'Diagnòstic per tema', sub: 'Detecta on fluixeges abans de l\'examen',
          icona: 'chart', to: '/diagnostic', modul: 'diagnostic',
        },
        {
          titol: 'Debilitats', sub: 'Els temes que et costen més',
          icona: 'brain', to: r.debilitats,
        },
        {
          titol: 'Els meus logros', sub: 'El que has desbloquejat pel camí',
          icona: 'chart', to: r.logros,
        },
      ],
    },
  ];
}
