// Mossos 2024 · Model 01 — examen oficial de la subprova de coneixements.
//
// Surt del PDF oficial de la convocatòria, amb la seva plantilla de
// respostes. Generat amb scripts/mossos-examens.mjs: no s'edita a mà, es
// torna a generar.
import type { TestTopic } from './types';

const examen: TestTopic = {
  slug: 'mossos-examen-2024',
  title: 'Mossos 2024 · Model 01',
  description: 'Examen oficial de Mossos d\'Esquadra de 2024, amb les respostes de la plantilla oficial.',
  icon: '📄',
  accent: 'from-slate-500 to-slate-700',
  category: 'mossos-examens',
  questions: [
    {
      id: 'mossos-examen-2024-1',
      text: 'Segons la Guia d’estudi, quina resta humana té una antiguitat aproximada de 450.000 anys?',
      options: [
        'La mandíbula de Banyoles.',
        'El crani neandertal de l’Abric Romaní.',
        'La mandíbula del Molí del Salt.',
        'L’home de Talteüll del Rosselló.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2024-2',
      text: 'Com s’anomena la norma suprema de tot l’ordenament jurídic de la qual deriva la validesa de tota la resta de normes?',
      options: [
        'Estatut d’autonomia.',
        'Llei de les Corts Generals.',
        'Constitució espanyola.',
        'Llei orgànica del poder judicial.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2024-3',
      text: 'Quina és una de les funcions principals de la Direcció General de Protecció Civil?',
      options: [
        'Coordinar la planificació en infraestructures i la supervisió de les actuacions necessàries per dur-les a terme, així com la seguretat i el manteniment preventiu i correctiu de les instal·lacions i immobles del Departament d’Interior.',
        'Implementar i avaluar el model d’actuació per a l’atenció a les dones que pateixen violències masclistes, i promoure la planificació estratègica, actuacions i estudis de sensibilització, informació i divulgació en matèria d’igualtat en els àmbits de competència del Departament d’Interior.',
        'Elaborar i remetre a la Secretaria General del Departament d’Interior les convocatòries d’accés i provisió, les propostes de modificació de la relació de llocs de treball i les ofertes d’ocupació de la Policia de la Generalitat - Mossos d’Esquadra.',
        'Coordinar i efectuar la comunicació a la població a través dels mitjans de comunicació, amb el personal de premsa de la direcció general i garantir la seva coordinació amb les oficines de premsa de les diferents unitats participants en la gestió de les emergències.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2024-4',
      text: 'Quin és un dels esdeveniments mundials més reconeguts, que se celebra a Barcelona des de l’any 2006, on concorren tecnologia, comunitat i comerç?',
      options: [
        'El Saló de l’Automòbil de Barcelona.',
        'El Mobile World Congress.',
        'La Fira Internacional d’Art Contemporani.',
        'El Saló Internacional de Logística de Barcelona.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-5',
      text: 'Qui va idear el projecte urbanístic de l’Eixample de Barcelona?',
      options: [
        'Pere Falqués.',
        'Ildefons Cerdà.',
        'Antoni Gaudí.',
        'Joan Martorell. 2',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-6',
      text: 'En quins àmbits exerceix les seves funcions la Policia de la Generalitat – Mossos d’Esquadra?',
      options: [
        'En el de la coordinació de les polítiques de seguretat i l’intercanvi d’informació en l’àmbit internacional i a les xarxes de col·laboració i auxili amb altres països.',
        'En el de les funcions governatives sobre l’exercici dels drets de reunió i el compliment de les disposicions per a la conservació de la natura.',
        'En el de la seguretat pública i l’ordre públic, la policia administrativa, la policia judicial i la investigació criminal.',
        'En el de la planificació i regulació del sistema de seguretat pública, i el control i la vigilància del trànsit.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2024-7',
      text: 'Quina és una funció de caràcter propi dels cossos de policia dependents de les comunitats autònomes?',
      options: [
        'Inspeccionar activitats sota les competències de la comunitat i la denúncia de qualsevol activitat il·lícita.',
        'Vetllar per l’acompliment de les disposicions per a la conservació de la naturalesa i del medi ambient.',
        'Cooperar en la resolució amistosa de conflictes privats i prestació d’auxili en accidents i catàstrofes.',
        'Vigilar espais públics, protegir les manifestacions i mantenir l’ordre en grans concentracions humanes.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-8',
      text: 'Quines són les principals serres i massissos de la Serralada Litoral?',
      options: [
        'Les Gavarres, el Montnegre, el Corredor, la serra de Collserola i el massís del Garraf.',
        'Les serres del Penedès, el Vallès, la Selva i el Gironès.',
        'Les Guilleries i el Montseny, amb el cim del Turó de l’Home com a punt culminant del Sistema Mediterrani.',
        'Sant Llorenç del Munt, Montserrat, les muntanyes de Prades, la Serra del Montsant i els Ports de Besseit.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-9',
      text: 'Quina es considera una de les garanties del dret a la llibertat?',
      options: [
        'La designació dels terminis de la detenció, que no pot durar més que el temps estrictament necessari per dur a terme les indagacions per esclarir els fets i, en qualsevol cas, com a màxim 24 hores.',
        'La designació dels drets de la persona detinguda, que ha de ser informada dels seus drets i de les raons de la detenció, tot obligant-la a declarar i amb dret a l’assistència lletrada.',
        'El procediment d’habeas corpus que és un procediment que permet posar immediatament a disposició judicial qualsevol persona detinguda il·legalment.',
        'La designació de les causes de privació de llibertat, que no han d’estar previstes en un reial decret que prevegi la privació, només si aquesta resulta proporcional amb la fi que es vol aconseguir. 3',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2024-10',
      text: 'La Policia de la Generalitat - Mossos d’Esquadra exerceix totes les funcions pròpies d’un cos de policia, en l’àmbit de:',
      options: [
        'La policia administrativa, que inclou la que deriva de la normativa estatal.',
        'La policia judicial i la investigació criminal, sense incloure la investigació del crim organitzat i terrorisme.',
        'L’autorització dels centres de formació del personal de seguretat.',
        'La planificació i la regulació del sistema de seguretat privada de Catalunya.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-11',
      text: 'A quina ciutat se celebraran els propers Jocs Olímpics de l’any 2024?',
      options: [
        'París.',
        'Berlín.',
        'Milà.',
        'Atenes.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-12',
      text: 'Entre el 1905 i el 1908, amb l’aparició de la Llei i del Reglament de la policia governativa, va començar la gran reforma que havia d’iniciar l’organització i la professionalització dels cossos de policia dependents de l’administració civil, un dels quals seria:',
      options: [
        'El cos de Vigilancia, absolutament civil i dedicat a funcions d’investigació i de policia judicial.',
        'El cos de Seguridad, no uniformat però amb organització militar, que faria el servei a les vies públiques i privades.',
        'La Dirección General de Vigilancia, encarregada de la formació dels cossos policials.',
        'El cos de Seguridad, uniformat i absolutament civil, que faria servei a les vies públiques i privades.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-13',
      text: 'Quina és una de les característiques que tenen les comunitats autònomes segons la Constitució espanyola?',
      options: [
        'La seva organització institucional respon al principi clàssic de divisió de poders i al principi de responsabilitat política de l’òrgan de govern davant l’assemblea legislativa de la comunitat autònoma respectiva.',
        'El seu grau d’autonomia és qualitativament igual al de les altres entitats territorials en què s’organitza l’Estat, els municipis i les províncies, a les quals també s’atorga autonomia administrativa.',
        'Són reconegudes com a instruments polítics, però no participen en les instàncies centrals de l’Estat (presentació d’iniciatives legislatives i designació directa de ministres per part dels governs de les comunitats autònomes).',
        'La seva autonomia política es concreta normativament en l’estatut d’autonomia, comú per a totes, i que és la seva norma institucional bàsica.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-14',
      text: 'Quin departament, a través del Pla General de seguretat de Catalunya, recull les actuacions que ha de portar a terme el Govern de la Generalitat per garantir la seguretat de les persones, els béns i el medi ambient?',
      options: [
        'El Departament d’Acció Exterior i Unió Europea.',
        'El Departament de la Presidència.',
        'El Departament de Territori.',
        'El Departament d’Interior. 4',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2024-15',
      text: 'Segons la Guia d’estudi, la primera Guerra Carlina va propiciar l’any 1837 aixecaments populars, coneguts com “bullangues”, a la ciutat de:',
      options: [
        'Barcelona.',
        'Tarragona.',
        'Lleida.',
        'Girona.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-16',
      text: 'Com s’anomena la part del text de l’Estatut d’autonomia de Catalunya de 2006 que conté els principis generals, drets i deures dels ciutadans i principis rectors?',
      options: [
        'Part orgànica.',
        'Part jurídica.',
        'Part principal.',
        'Part dogmàtica.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2024-17',
      text: 'Abans de l’aparició dels Mossos d’Esquadra, la seguretat interior havia estat reservada:',
      options: [
        'Al Rei.',
        'A l’exèrcit.',
        'A les milícies.',
        'Als civils i paisans.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-18',
      text: 'Qui va rebre el Premi Nobel d’Economia l’any 2023 pels seus estudis sobre el paper de la dona en el mercat laboral?',
      options: [
        'Ben Bernanke.',
        'Philip H. Dybvig.',
        'Claudia Goldin.',
        'Esther Duflo.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2024-19',
      text: 'Quin comte va ser el fundador del casal de Barcelona?',
      options: [
        'Jaume I.',
        'Ramon Borrell I.',
        'Guifré el Pilós.',
        'Berenguer Ramon I.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2024-20',
      text: 'Com s’anomena l’òrgan intergovernamental en què els membres de la Unió Europea representen els interessos del seu Estat?',
      options: [
        'Comissió de la Unió Europea.',
        'Consell de la Unió Europea.',
        'Parlament de la Unió Europea.',
        'Tribunal de la Unió Europea. 5',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-21',
      text: 'Amb quins cossos de seguretat van començar a patrullar per primera vegada a Barcelona els agents de la Policia de la Generalitat - Mossos d’Esquadra, dins el dispositiu Turisme?',
      options: [
        'Amb la Guàrdia Urbana de Barcelona i la Guàrdia Civil.',
        'Amb la Guàrdia Civil i amb el Cos Nacional de Policia.',
        'Amb el Cos Nacional de Policia i la Guàrdia Urbana de Barcelona.',
        'Amb la Guàrdia Urbana de Barcelona i la Policia Portuària de Barcelona.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2024-22',
      text: 'Quines tres seccions d’estudi va tenir el Primer Congrés Internacional de la Llengua Catalana celebrat l’any 1906?',
      options: [
        'L’ortogràfica, la sociojurídica i la psicològica.',
        'La filologicohistòrica, la literària i la sociojurídica.',
        'La literària, l’ortogràfica i la semàntica.',
        'La filologicohistòrica, la semàntica i la psicològica.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-23',
      text: 'Quin és el termini màxim que pot durar un estat d’excepció declarat pel Govern de l’Estat?',
      options: [
        '15 dies, prorrogables per un termini igual.',
        '25 dies, prorrogables per 15 dies naturals.',
        '30 dies, prorrogables per un termini igual.',
        '40 dies, no prorrogables.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2024-24',
      text: 'En quines escales s’estructura jeràrquicament la Policia de la Generalitat – Mossos d’Esquadra?',
      options: [
        'Escala de mosso/a, de sergent/a, de sotsinspector/a i inspector/a.',
        'Escala bàsica, intermèdia, executiva, superior i de suport.',
        'Escala bàsica, intermèdia i alta.',
        'Escala d’intendent/a, de major, de facultatiu/iva, de tècnic/a i de suport.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-25',
      text: 'Cap a finals del segle XII i principis del XIII, l’expansió de l’heretgia dels càtars a Occitània va desencadenar un procés bèl·lic entre:',
      options: [
        'El papa Innocenci I i Ramon Berenguer V.',
        'El rei Pere el Catòlic i el rei de França contra els catalans.',
        'Ramon Berenguer IV i Peronella d’Aragó.',
        'El papa Innocenci III i el rei de França contra els catalans. 6',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2024-26',
      text: 'El Consell General del Poder Judicial es compon:',
      options: [
        'D’un president o presidenta i vint-i-vuit vocals nomenats per les Corts Generals i escollits pel rei entre jutges i jutgesses (19) i juristes (9) de reconeguda competència en virtut de criteris de mèrit.',
        'D’un president o presidenta i vint vocals nomenats pel rei i escollits per les Corts Generals entre jutges i jutgesses (12) i juristes (8) de reconeguda competència en virtut de criteris de mèrit i capacitat.',
        'D’un president o presidenta i vint-i-dos vocals nomenats per les Corts Generals i escollits pel rei entre jutges i jutgesses (15) i juristes (7) de reconeguda competència en virtut de criteris de capacitat.',
        'D’un president o presidenta i trenta vocals nomenats pel rei i escollits per les Corts Generals entre jutges i jutgesses (20) i juristes (10) de reconeguda competència en virtut de criteris de mèrit i capacitat.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-27',
      text: 'Quina de les funcions següents s’atribueix al Departament d’Interior de la Generalitat de Catalunya?',
      options: [
        'L’expedició de llicències d’armes i explosius.',
        'La regulació del transport públic.',
        'La regulació d’espectacles privats.',
        'La prevenció, extinció d’incendis i salvament.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2024-28',
      text: 'Què és la Taula de Ciutadania i Immigració creada l’any 2008?',
      options: [
        'Un instrument de planificació del Govern de Catalunya en l’àmbit de les polítiques de ciutadania i de les polítiques d’acollida i d’integració.',
        'Un òrgan de consulta i participació per a les polítiques de gestió del fet migratori que promou la Generalitat de Catalunya.',
        'Un òrgan executiu de polítiques de gestió dels fluxos d’immigrants en funció de les demandes del mercat de treball espanyol.',
        'Un instrument d’integració i col·laboració amb una gran xarxa d’entitats i organitzacions no governamentals.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2024-29',
      text: 'Quina és la finalitat del principi d’inamovibilitat de la Llei orgànica del poder judicial?',
      options: [
        'Evitar que els jutges, jutgesses, magistrats i magistrades puguin ser apartats de les seves funcions per causes que no siguin estrictament professionals, la qual cosa és una garantia per a la seva independència.',
        'Establir mecanismes per a garantir la imparcialitat dels jutges, jutgesses, magistrats i magistrades en relació amb els supòsits concrets que hagin de decidir, com són l’abstenció i la recusació.',
        'Establir la responsabilitat per a l’exercici de la funció jurisdiccional dels jutges, jutgesses, magistrats i magistrades, que pot ser penal, civil (si es produeix un dany o perjudici) i disciplinària (imposició de sancions per part del Consell General).',
        'Evitar que els jutges, jutgesses, magistrats i magistrades puguin exercir altres càrrecs públics, tractant de garantir la independència dels òrgans judicials, i evitant que portin a terme activitats que condicionin la seva llibertat de criteri. 7',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2024-30',
      text: 'Quina és la definició de competència en el camp del dret públic?',
      options: [
        'La designació dels drets de la persona detinguda, que ha de ser informada dels seus drets i de les raons de la detenció, tot obligant-la a declarar i amb dret a l’assistència lletrada.',
        'La designació de les causes de privació de llibertat, que no han d’estar previstes en un reial decret que prevegi la privació, només si aquesta resulta proporcional amb la fi que es vol aconseguir.',
        'El procediment d’habeas corpus que és un procediment que permet posar immediatament a disposició judicial qualsevol persona detinguda il·legalment.',
        'La designació dels terminis de la detenció, que no pot durar més que el temps estrictament necessari per dur a terme les indagacions per esclarir els fets i, en qualsevol cas, com a màxim 24 hores. FI DE LA PROVA',
      ],
      correct: 0,
    },
  ],
};

export default examen;
