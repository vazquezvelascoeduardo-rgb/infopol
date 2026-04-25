// Dades de l'Operativa de Trànsit.
//
// Estructura: arbre de decisió. Cada node té:
//   - id           : identificador estable (s'usa a la URL/breadcrumb)
//   - icon         : emoji opcional
//   - label        : etiqueta del botó/categoria (bilingüe es/ca)
//   - description  : ajuda curta (opcional)
//   - children     : nodes fills (si en té → és una pregunta intermèdia)
//   - result       : si és fulla, el resultat amb la norma aplicable
//
// L'usuari selecciona opcions fins a arribar a una fulla, on es mostra:
//   • Llei (LSV, RGC, RGCond, RGV…)
//   • Article
//   • Gravetat (lleu, greu, molt greu)
//   • Multa
//   • Punts (si aplica)
//   • Notes addicionals (procediment, immobilització, etc.)
//
// Aquest fitxer conté un ESQUELET amb 4-5 escenaris d'exemple. Quan
// arribi el ZIP de Trànsit substituirem aquest contingut per les dades
// reals i opcionalment l'estructurarem en sub-fitxers per categoria.

export type Bilingual = { es: string; ca: string };

export type TraficSeverity = 'leve' | 'grave' | 'muy-grave';

export type TraficResult = {
  // Norma principal aplicable (text complet, p. ex. "RDL 6/2015 (LSV)").
  law: string;
  // Article concret o conjunt d'articles ("Art. 47.1" / "Arts. 47-48").
  article: string;
  // Descripció curta de la conducta sancionada.
  conduct: Bilingual;
  // Gravetat administrativa.
  severity: TraficSeverity;
  // Import de la multa (text lliure: "200€", "500€", "100-500€").
  fine?: string;
  // Punts retirats (si aplica).
  points?: number;
  // Notes operatives: immobilització, intervenció permís, possible
  // delicte penal concurrent, etc.
  notes?: Bilingual;
  // Si la conducta pot constituir delicte (penal), referència opcional
  // a l'article del Codi penal.
  penal?: { article: string; description: Bilingual };
};

export type TraficNode = {
  id: string;
  icon?: string;
  label: Bilingual;
  description?: Bilingual;
  // Pregunta que es mostra a sobre dels fills (només si té children).
  question?: Bilingual;
  children?: TraficNode[];
  // Si és fulla.
  result?: TraficResult;
};

// ────────────────────────────────────────────────────────────────────
// EXEMPLE D'ARBRE — 4-5 escenaris representatius com a esquelet.
// SUBSTITUIR pel contingut real del ZIP de Trànsit.
// ────────────────────────────────────────────────────────────────────

export const TRAFICO_TREE: TraficNode = {
  id: 'root',
  label: { es: 'Tráfico', ca: 'Trànsit' },
  question: {
    es: '¿Qué tipo de situación tienes?',
    ca: 'Quin tipus de situació tens?',
  },
  children: [
    // ─── ALCOHOLEMIA ──────────────────────────────────────────────
    {
      id: 'alcoholemia',
      icon: '🍷',
      label: { es: 'Alcoholemia', ca: 'Alcoholèmia' },
      description: {
        es: 'Conducción bajo influencia de alcohol',
        ca: 'Conducció sota la influència d\'alcohol',
      },
      question: {
        es: '¿Cuánto da en aire espirado?',
        ca: 'Quant dóna en aire espirat?',
      },
      children: [
        {
          id: 'alc-administrativo',
          icon: '⚠️',
          label: {
            es: 'Entre 0,25 y 0,60 mg/l',
            ca: 'Entre 0,25 i 0,60 mg/l',
          },
          description: {
            es: 'Infracción administrativa (sin delito)',
            ca: 'Infracció administrativa (sense delicte)',
          },
          result: {
            law: 'RDL 6/2015 (LSV)',
            article: 'Art. 77.c) y 80',
            conduct: {
              es: 'Conducir con tasa superior a la reglamentaria sin alcanzar el delito.',
              ca: 'Conduir amb taxa superior a la reglamentària sense arribar al delicte.',
            },
            severity: 'muy-grave',
            fine: '500€',
            points: 4,
            notes: {
              es: 'Inmovilización del vehículo si supera la tasa. Posibilidad de retirar el permiso si reincidencia.',
              ca: 'Immobilització del vehicle si supera la taxa. Possible retirada del permís si hi ha reincidència.',
            },
          },
        },
        {
          id: 'alc-penal',
          icon: '🚨',
          label: {
            es: 'Más de 0,60 mg/l',
            ca: 'Més de 0,60 mg/l',
          },
          description: {
            es: 'Posible delito contra la seguridad vial',
            ca: 'Possible delicte contra la seguretat viària',
          },
          result: {
            law: 'Código Penal',
            article: 'Art. 379.2 CP',
            conduct: {
              es: 'Conducir con tasa de alcohol superior a 0,60 mg/l (aire) o 1,2 g/l (sangre).',
              ca: 'Conduir amb taxa d\'alcohol superior a 0,60 mg/l (aire) o 1,2 g/l (sang).',
            },
            severity: 'muy-grave',
            fine: 'Penal: multa 6-12 meses o trabajos comunitarios',
            notes: {
              es: 'Detención si se aprecia riesgo. Atestado al Juzgado de Guardia. Retirada cautelar del permiso.',
              ca: 'Detenció si s\'aprecia risc. Atestat al Jutjat de Guàrdia. Retirada cautelar del permís.',
            },
            penal: {
              article: 'Art. 379.2 CP',
              description: {
                es: 'Pena: prisión 3-6 meses o multa 6-12 meses o trabajos 31-90 días + privación permiso 1-4 años.',
                ca: 'Pena: presó 3-6 mesos o multa 6-12 mesos o treballs 31-90 dies + privació permís 1-4 anys.',
              },
            },
          },
        },
        {
          id: 'alc-negativa',
          icon: '✋',
          label: {
            es: 'Negativa a someterse a la prueba',
            ca: 'Negativa a sotmetre\'s a la prova',
          },
          result: {
            law: 'Código Penal',
            article: 'Art. 383 CP',
            conduct: {
              es: 'Negarse a las pruebas legalmente establecidas para la comprobación de tasas de alcohol o drogas.',
              ca: 'Negar-se a les proves legalment establertes per a la comprovació de taxes d\'alcohol o drogues.',
            },
            severity: 'muy-grave',
            fine: 'Penal: prisión 6 meses-1 año',
            notes: {
              es: 'Delito siempre. Atestado al Juzgado. Privación del derecho a conducir 1-4 años.',
              ca: 'Sempre delicte. Atestat al Jutjat. Privació del dret a conduir 1-4 anys.',
            },
            penal: {
              article: 'Art. 383 CP',
              description: {
                es: 'Prisión 6 meses-1 año + privación permiso 1-4 años.',
                ca: 'Presó 6 mesos-1 any + privació permís 1-4 anys.',
              },
            },
          },
        },
      ],
    },

    // ─── VELOCIDAD ─────────────────────────────────────────────────
    {
      id: 'velocidad',
      icon: '💨',
      label: { es: 'Velocidad', ca: 'Velocitat' },
      description: {
        es: 'Exceso de velocidad o conducción temeraria',
        ca: 'Excés de velocitat o conducció temerària',
      },
      question: {
        es: '¿Tipo de exceso o conducta?',
        ca: 'Tipus d\'excés o conducta?',
      },
      children: [
        {
          id: 'vel-leve',
          label: {
            es: 'Hasta 20 km/h sobre el límite',
            ca: 'Fins a 20 km/h sobre el límit',
          },
          result: {
            law: 'RDL 6/2015 (LSV)',
            article: 'Art. 77.a)',
            conduct: {
              es: 'Exceso leve de velocidad.',
              ca: 'Excés lleu de velocitat.',
            },
            severity: 'leve',
            fine: '100€',
            points: 0,
          },
        },
        {
          id: 'vel-grave',
          label: {
            es: '20-50 km/h sobre el límite',
            ca: '20-50 km/h sobre el límit',
          },
          result: {
            law: 'RDL 6/2015 (LSV)',
            article: 'Art. 76.a) Anexo IV',
            conduct: {
              es: 'Exceso grave de velocidad.',
              ca: 'Excés greu de velocitat.',
            },
            severity: 'grave',
            fine: '300-600€',
            points: 2,
            notes: {
              es: 'Tabla escalonada según tramo y vía. Ver Anexo IV LSV.',
              ca: 'Taula escalonada segons tram i via. Veure Annex IV LSV.',
            },
          },
        },
        {
          id: 'vel-temerario',
          icon: '🚨',
          label: {
            es: 'Conducción temeraria (delito)',
            ca: 'Conducció temerària (delicte)',
          },
          result: {
            law: 'Código Penal',
            article: 'Art. 380 CP',
            conduct: {
              es: 'Conducción manifiestamente temeraria con peligro concreto para la vida o integridad.',
              ca: 'Conducció manifestament temerària amb perill concret per a la vida o integritat.',
            },
            severity: 'muy-grave',
            fine: 'Penal: prisión 6 meses-2 años',
            notes: {
              es: 'Detención si peligro inmediato. Atestado. Retirada cautelar del permiso.',
              ca: 'Detenció si perill immediat. Atestat. Retirada cautelar del permís.',
            },
            penal: {
              article: 'Art. 380 CP',
              description: {
                es: 'Prisión 6 meses-2 años + privación permiso 1-6 años.',
                ca: 'Presó 6 mesos-2 anys + privació permís 1-6 anys.',
              },
            },
          },
        },
      ],
    },

    // ─── DOCUMENTACIÓN ────────────────────────────────────────────
    {
      id: 'documentacion',
      icon: '🪪',
      label: { es: 'Documentación', ca: 'Documentació' },
      description: {
        es: 'Falta de permiso, ITV, seguro…',
        ca: 'Falta de permís, ITV, assegurança…',
      },
      question: {
        es: '¿Qué falta?',
        ca: 'Què falta?',
      },
      children: [
        {
          id: 'doc-permiso',
          label: {
            es: 'No tiene permiso de conducir',
            ca: 'No té permís de conduir',
          },
          result: {
            law: 'Código Penal',
            article: 'Art. 384 CP',
            conduct: {
              es: 'Conducir sin haber obtenido nunca el permiso o tras pérdida total de puntos.',
              ca: 'Conduir sense haver obtingut mai el permís o després de pèrdua total de punts.',
            },
            severity: 'muy-grave',
            fine: 'Penal: 12-24 meses multa o trabajos',
            notes: {
              es: 'Delito. Inmovilización del vehículo. Atestado.',
              ca: 'Delicte. Immobilització del vehicle. Atestat.',
            },
            penal: {
              article: 'Art. 384 CP',
              description: {
                es: 'Multa 12-24 meses o trabajos 31-90 días o prisión 3-6 meses.',
                ca: 'Multa 12-24 mesos o treballs 31-90 dies o presó 3-6 mesos.',
              },
            },
          },
        },
        {
          id: 'doc-itv',
          label: {
            es: 'ITV caducada',
            ca: 'ITV caducada',
          },
          result: {
            law: 'RDL 6/2015 (LSV)',
            article: 'Art. 76.k)',
            conduct: {
              es: 'Circular con un vehículo cuya ITV haya caducado.',
              ca: 'Circular amb un vehicle amb ITV caducada.',
            },
            severity: 'grave',
            fine: '200€',
            points: 0,
            notes: {
              es: 'Inmovilización si la caducidad supera 6 meses o es desfavorable.',
              ca: 'Immobilització si la caducitat supera 6 mesos o és desfavorable.',
            },
          },
        },
        {
          id: 'doc-seguro',
          label: {
            es: 'Sin seguro obligatorio',
            ca: 'Sense assegurança obligatòria',
          },
          result: {
            law: 'Ley 8/2004 (RC)',
            article: 'Art. 3 / Art. 35.b) LOSC',
            conduct: {
              es: 'Circular con un vehículo sin la cobertura de seguro obligatorio en vigor.',
              ca: 'Circular amb un vehicle sense la cobertura d\'assegurança obligatòria en vigor.',
            },
            severity: 'grave',
            fine: '601-3.005€',
            notes: {
              es: 'Inmovilización del vehículo y posible depósito hasta acreditación.',
              ca: 'Immobilització del vehicle i possible dipòsit fins a acreditació.',
            },
          },
        },
      ],
    },

    // ─── DROGAS ───────────────────────────────────────────────────
    {
      id: 'drogas',
      icon: '💊',
      label: { es: 'Drogas', ca: 'Drogues' },
      description: {
        es: 'Conducción bajo influencia de drogas',
        ca: 'Conducció sota la influència de drogues',
      },
      result: {
        law: 'RDL 6/2015 + Código Penal',
        article: 'Art. 14.2 LSV / Art. 379.2 CP',
        conduct: {
          es: 'Conducir habiendo ingerido drogas tóxicas, estupefacientes o psicotrópicas.',
          ca: 'Conduir havent consumit drogues tòxiques, estupefaents o psicotròpiques.',
        },
        severity: 'muy-grave',
        fine: '1.000€ administrativa / penal: prisión 3-6 meses',
        points: 6,
        notes: {
          es: 'Si test salival positivo + signos clínicos → delito. Sin signos clínicos → infracción administrativa MUY GRAVE.',
          ca: 'Si test salival positiu + signes clínics → delicte. Sense signes clínics → infracció administrativa MOLT GREU.',
        },
        penal: {
          article: 'Art. 379.2 CP',
          description: {
            es: 'Prisión 3-6 meses o multa 6-12 meses + privación permiso 1-4 años.',
            ca: 'Presó 3-6 mesos o multa 6-12 mesos + privació permís 1-4 anys.',
          },
        },
      },
    },

    // ─── VMP / PATINETES ──────────────────────────────────────────
    {
      id: 'vmp',
      icon: '🛴',
      label: { es: 'VMP / Patinetes', ca: 'VMP / Patinets' },
      description: {
        es: 'Vehículos de movilidad personal',
        ca: 'Vehicles de mobilitat personal',
      },
      result: {
        law: 'RGC + Ordenanzas municipales',
        article: 'Art. 2 RGC / Manual VMP DGT',
        conduct: {
          es: 'Circular con VMP fuera de las condiciones reglamentarias (acera, sin casco si menor, etc.).',
          ca: 'Circular amb VMP fora de les condicions reglamentàries (vorera, sense casc si menor, etc.).',
        },
        severity: 'leve',
        fine: '100-200€',
        notes: {
          es: 'Aplicables las mismas normas que a ciclistas en muchos casos. Test alcohol/drogas también obligatorio.',
          ca: 'Aplicables les mateixes normes que a ciclistes en molts casos. Test alcohol/drogues també obligatori.',
        },
      },
    },
  ],
};
