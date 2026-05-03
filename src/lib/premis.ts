// Directori de premis — recopilació de premis més rellevants de
// novembre 2025 fins a maig 2026, organitzats per mes. Mateix patró
// que esports.ts i personalitats.ts.
//
// El shape és el mateix que LeaderSection per reaprofitar SectionView.

export type AwardEntry = {
  /** Premi i edició (ex. "PREMI CERVANTES 2025 · 125.000 €"). */
  position: string;
  /** Guanyador/a o obra premiada. */
  name: string;
  /** Detalls (obra, dotació, gala, dates...). */
  detail?: string;
  /** Bandera (emoji) — país del guanyador o icona del premi. */
  flag?: string;
  /** Marca com a premi destacat. */
  recent?: boolean;
};

export type AwardSubsection = {
  title?: string;
  icon?: string;
  compact?: boolean;
  entries: AwardEntry[];
};

export type AwardSection = {
  id: string;
  title: string;
  shortLabel: string;
  icon: string;
  accent: string;
  subsections: AwardSubsection[];
};

export const PREMIS_UPDATED_AT = '2026-05-03';

export const PREMIS: AwardSection[] = [
  {
    id: 'marc-2026-premis',
    title: 'Març 2026',
    shortLabel: "Mar '26",
    icon: '📅',
    accent: 'from-rose-500 to-orange-600',
    subsections: [
      {
        title: 'Cinema · 98a Edició dels Oscars',
        icon: '🎬',
        entries: [
          {
            flag: '🇺🇸',
            position: 'OSCARS 2026 · GALA 15 MARÇ · DOLBY THEATRE',
            name: 'Millor pel·lícula: One Battle After Another (6 estatuetes)',
            detail: 'Direcció: Paul Thomas Anderson. Pel·lícula més premiada de la nit.',
            recent: true,
          },
          {
            flag: '🇺🇸',
            position: 'OSCAR · MILLOR ACTOR',
            name: 'Michael B. Jordan — Sinners',
            detail: 'Película dirigida per Ryan Coogler.',
          },
          {
            flag: '🇮🇪',
            position: 'OSCAR · MILLOR ACTRIU',
            name: 'Jessie Buckley — Hamnet',
            detail: 'Adaptació de la novel·la de Maggie O\'Farrell.',
          },
          {
            flag: '🇺🇸',
            position: 'OSCAR · MILLOR ACTOR DE REPARTIMENT',
            name: 'Sean Penn',
          },
          {
            flag: '🇳🇴',
            position: 'OSCAR · MILLOR PEL·LÍCULA INTERNACIONAL',
            name: 'Sentimental Value (Noruega)',
            detail: 'Primera pel·lícula noruega que guanya aquesta categoria. Direcció: Joachim Trier.',
            recent: true,
          },
        ],
      },
    ],
  },

  {
    id: 'febrer-2026-premis',
    title: 'Febrer 2026',
    shortLabel: "Feb '26",
    icon: '📅',
    accent: 'from-cyan-500 to-blue-700',
    subsections: [
      {
        title: 'Cinema · 40a Edició Premis Goya',
        icon: '🎬',
        entries: [
          {
            flag: '🇪🇸',
            position: 'PREMIS GOYA 2026 · GALA 28 FEBRER · BARCELONA',
            name: 'Millor pel·lícula: Los Domingos (Alauda Ruiz de Azúa)',
            detail: 'Triplet històric: Millor pel·lícula + Millor direcció + Millor guió original, tots per a Alauda Ruiz de Azúa.',
            recent: true,
          },
          {
            flag: '🇪🇸',
            position: 'GOYA · MILLOR ACTRIU PROTAGONISTA',
            name: 'Patricia López Arnaiz — Los Domingos',
          },
          {
            flag: '🇪🇸',
            position: 'GOYA · MILLOR ACTOR PROTAGONISTA',
            name: 'José Ramón Soroiz — Maspalomas',
          },
          {
            flag: '🇪🇸',
            position: 'GOYA · MÉS PREMIADA EN CATEGORIES TÈCNIQUES',
            name: 'Sirât (Oliver Laxe) — 6 estatuetes',
            detail: 'Domini absolut a fotografia, muntatge, so i altres categories tècniques.',
          },
          {
            flag: '🇪🇸',
            position: 'GOYA D\'HONOR',
            name: 'Gonzalo Suárez',
            detail: 'Trajectòria del director, escriptor i guionista asturià.',
          },
          {
            flag: '🇺🇸',
            position: 'GOYA INTERNACIONAL',
            name: 'Susan Sarandon',
          },
        ],
      },
    ],
  },

  {
    id: 'gener-2026-premis',
    title: 'Gener 2026',
    shortLabel: "Gen '26",
    icon: '📅',
    accent: 'from-purple-500 to-violet-700',
    subsections: [
      {
        title: 'Literatura — gala Hotel Palace de Barcelona, nit del 6 gener',
        icon: '📚',
        entries: [
          {
            flag: '🇪🇸',
            position: '82è PREMI NADAL 2026 · 30.000 €',
            name: 'David Uclés (Úbeda, 1990) — La ciudad de las luces muertas',
            detail: 'Novel·la guanyadora del premi de novel·la en castellà més antic d\'Espanya (des de 1944).',
            recent: true,
          },
          {
            flag: '🟥',
            position: '58è PREMI JOSEP PLA 2026',
            name: 'Francesc Torralba — Anatomia de l\'esperança (assaig)',
            detail: 'Filòsof, teòleg i historiador. Lliurat la mateixa nit que el Nadal.',
          },
          {
            flag: '🟥',
            position: '46è PREMI RAMON LLULL 2026 · 60.000 €',
            name: 'Agnès Marquès Pujolar — La segona vida de Ginebra Vern',
            detail: 'Periodista mallorquina (Palma, 1979). Dirigeix el programa "Catalunya nit" de Catalunya Ràdio.',
            recent: true,
          },
          {
            flag: '🟥',
            position: 'PREMI ÒMNIUM A LA MILLOR NOVEL·LA 2025 (9a edició)',
            name: 'Reconeixement a una obra catalana destacada del 2025',
            detail: 'Atorgat per Òmnium Cultural.',
          },
        ],
      },
    ],
  },

  {
    id: 'desembre-2025-premis',
    title: 'Desembre 2025',
    shortLabel: "Des '25",
    icon: '📅',
    accent: 'from-blue-500 to-indigo-700',
    subsections: [
      {
        title: 'Cultura i Societat',
        icon: '🎯',
        entries: [
          {
            flag: '🟥',
            position: 'PREMI CATALÀ DE L\'ANY 2025',
            name: 'Generació de la recerca contra el càncer',
            detail: 'Vinculat a La Marató de 3Cat 2025 (dedicada al càncer). Recaptació rècord: 9.741.627 € (la més alta dels últims 5 anys).',
            recent: true,
          },
        ],
      },
      {
        title: 'Futbol — The Best FIFA 2025',
        icon: '⚽',
        entries: [
          {
            flag: '🇫🇷',
            position: 'THE BEST FIFA · MILLOR JUGADOR',
            name: 'Ousmane Dembélé (PSG)',
            recent: true,
          },
          {
            flag: '🇪🇸',
            position: 'THE BEST FIFA · MILLOR JUGADORA',
            name: 'Aitana Bonmatí (FC Barcelona)',
            detail: 'Confirma la seva hegemonia als premis individuals dels darrers anys.',
            recent: true,
          },
        ],
      },
      {
        title: 'Llengua — Neologisme de l\'any',
        icon: '📖',
        entries: [
          {
            flag: '🟥',
            position: 'NEOLOGISME DE L\'ANY · CATALÀ (IEC)',
            name: '"butpregària"',
          },
          {
            flag: '🇪🇸',
            position: 'NEOLOGISMO DEL AÑO · CASTELLÀ (FUNDÉU)',
            name: '"apagón"',
            detail: 'Reconeixement per l\'impacte de l\'apagada ibèrica del 2025.',
          },
        ],
      },
    ],
  },

  {
    id: 'novembre-2025-premis',
    title: 'Novembre 2025',
    shortLabel: "Nov '25",
    icon: '📅',
    accent: 'from-slate-500 to-slate-700',
    subsections: [
      {
        title: 'Literatura',
        icon: '📚',
        entries: [
          {
            flag: '🇲🇽',
            position: 'PREMIO CERVANTES 2025 · 125.000 €',
            name: 'Gonzalo Celorio (Ciutat de Mèxic, 1948)',
            detail: 'Màxim guardó de les lletres en castellà. Assagista, novel·lista i director de l\'Acadèmia Mexicana de la Llengua.',
            recent: true,
          },
        ],
      },
      {
        title: 'Futbol',
        icon: '⚽',
        entries: [
          {
            flag: '🇪🇸',
            position: 'GOLDEN BOY 2025',
            name: 'Lamine Yamal (FC Barcelona) — 2n any consecutiu',
            detail: 'Premi al millor jugador sub-21 d\'Europa. Repeteix el guardó del 2024.',
            recent: true,
          },
        ],
      },
      {
        title: 'Periodisme i comunicació',
        icon: '📺',
        entries: [
          {
            flag: '🇪🇸',
            position: 'PREMIS ONDAS 2025 · 72a EDICIÓ',
            name: 'Reconeixements a programes de RTVE, Atresmedia i Mediaset',
            detail: 'Premis a presentadors i trajectòries del periodisme espanyol.',
          },
        ],
      },
    ],
  },
];
