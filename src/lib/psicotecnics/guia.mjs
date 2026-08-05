// L'explicació de cada família, per posar-la davant de les preguntes.
//
// Als quaderns, abans de cada model d'exercici hi ha tres coses: què s'ha de
// fer, un exemple resolt pas a pas i un truc. Això és el mateix, en text, per
// a les divuit famílies.
//
// La `resolucio` són els passos d'un exemple qualsevol —no d'un ítem
// concret—, perquè el que s'ha d'aprendre és el mètode, no la resposta. Qui
// ho fa servir té l'exemple resolt al davant, amb la lletra bona marcada.
export const GUIA = {
  'cubs-desplegat': {
    titol: 'Cubs desplegats',
    pregunta: 'Quin cub surt d\'aquest desplegable?',
    explicacio: 'Es dona un desplegable de sis caselles, cadascuna amb una '
      + 'figura, i quatre cubs muntats. Cal dir quin dels quatre és el que '
      + 'surt de plegar-lo. Una de cada quatre preguntes ho demana al revés: '
      + 'quin NO pot ser. Llegeix bé l\'enunciat.',
    resolucio: [
      'Tria la casella que et vagi millor —la que tingui la figura més '
        + 'fàcil de recordar— i imagina-te-la a la cara de davant.',
      'Les caselles que la toquen al paper són les que la toquen al cub. '
        + 'Col·loca-les al voltant sense pensar en les altres.',
      'Ara mira els quatre cubs i descarta. No busquis el bo: busca els '
        + 'dolents, que es veuen abans.',
      'Compte amb les figures que es giren. Una mateixa figura pot ser '
        + 'bona en una posició i dolenta girada un quart de volta.',
    ],
    truc: 'Dues caselles separades per una altra al paper van a cares '
      + 'OPOSADES del cub, i les cares oposades no es veuen mai alhora. Si '
      + 'un cub n\'ensenya dues de cop, ja el pots descartar.',
  },

  'cubs-mirall': {
    titol: 'Cubs i mirall',
    pregunta: 'Quin desplegable correspon a aquest cub?',
    explicacio: 'Es dona un cub i, al darrere, un mirall que ensenya algunes '
      + 'de les cares ocultes. Amb això s\'ha de dir quin dels quatre '
      + 'desplegables li correspon. Com abans, una de cada quatre ho demana '
      + 'al revés.',
    resolucio: [
      'Del cub en surten tres cares directes. Aquestes són les segures: '
        + 'comença per elles.',
      'El mirall n\'ensenya dues més, però CAPGIRADES. Una figura al '
        + 'mirall es veu com si la miressis des de dins.',
      'La cara de baix no la veus enlloc, ni al cub ni al mirall. Als '
        + 'desplegables, aquella casella queda en blanc: no la comparis.',
      'Amb cinc cares i el blanc, ja pots anar descartant desplegables.',
    ],
    truc: 'Cap mirall pla no pot ensenyar les tres cares ocultes alhora. '
      + 'Per això l\'enunciat diu «algunes»: sempre en falta una.',
  },

  'figura-reflectida': {
    titol: 'Imatge reflectida',
    pregunta: 'Quina figura és la mostra reflectida en un mirall?',
    explicacio: 'Es dona una figura de mostra i quatre més. Cal trobar la '
      + 'que seria la mostra vista en un mirall. Les altres tres són la '
      + 'mostra GIRADA, que no és el mateix.',
    resolucio: [
      'Busca una part de la figura que estigui a un costat i no a l\'altre: '
        + 'una punta, un forat, la casella marcada.',
      'Al mirall, aquella part canvia de banda. Si era a la dreta, passa a '
        + 'l\'esquerra.',
      'Girant, en canvi, no canvia de banda mai: només fa la volta.',
      'Aquesta és tota la diferència. Mira la marca i decideix.',
    ],
    truc: 'No intentis girar la figura amb el cap fins que et quadri: si és '
      + 'un reflex, no quadrarà mai, per moltes voltes que li donis.',
  },

  'figura-girada': {
    titol: 'Imatge girada',
    pregunta: 'Quina figura és la mostra girada, sense reflectir?',
    explicacio: 'La mateixa cosa del revés. Aquí la bona és la mostra GIRADA '
      + 'i les altres tres són reflexos.',
    resolucio: [
      'Localitza la marca de la mostra i mira a quin costat de la figura cau.',
      'Gira la mostra amb el cap un quart de volta, mitja i tres quarts.',
      'La que coincideixi amb una d\'aquestes tres és la bona.',
      'Si una figura et sembla igual però la marca ha canviat de banda, és '
        + 'un reflex: descarta-la.',
    ],
    truc: 'Comença sempre per la marca, no pel contorn. El contorn de la '
      + 'figura girada i la reflectida s\'assemblen molt; la marca, no.',
  },

  disc: {
    titol: 'Rotació de disc',
    pregunta: 'Quin disc és el model girat?',
    explicacio: 'Un disc amb figures repartides al voltant i quatre discos '
      + 'més, cada un amb la marca en un lloc diferent. Cal trobar el que és '
      + 'el mateix disc, només girat.',
    resolucio: [
      'Fixa\'t en la marca del model —el punt de referència— i mira quina '
        + 'figura hi ha just al costat.',
      'A cada opció, busca la marca i mira si hi torna a haver la mateixa '
        + 'figura al costat, i cap al mateix cantó.',
      'Si hi és, segueix comprovant la següent, i la següent.',
      'Amb dues o tres que coincideixin ja n\'hi ha prou per decidir.',
    ],
    truc: 'Girar no canvia mai l\'ORDRE de les figures al voltant del disc. '
      + 'Si a una opció l\'ordre està canviat, és un reflex i no serveix.',
  },

  abstracte: {
    titol: 'Matrius',
    pregunta: 'Quina peça completa la matriu?',
    explicacio: 'Una graella de figures amb un forat. Cal trobar la peça que '
      + 'hi va. La regla pot anar per files, per columnes o per totes dues '
      + 'coses alhora.',
    resolucio: [
      'Llegeix la primera fila d\'esquerra a dreta i digues en veu baixa què '
        + 'canvia: una figura de més, un gir, un color.',
      'Comprova-ho a la segona fila. Si es compleix, ja tens la regla.',
      'Ara mira les columnes: sovint n\'hi ha una segona regla.',
      'Aplica les dues a la casella del forat i busca la peça que en surti.',
    ],
    truc: 'Si no veus la regla, compta. Quantes ratlles hi ha a cada '
      + 'figura, quants punts, quants costats. Els números es veuen quan les '
      + 'formes no diuen res.',
  },

  'series-figures': {
    titol: 'Sèries de figures',
    pregunta: 'Quina figura continua la sèrie?',
    explicacio: 'Una filera de figures que segueixen una regla i quatre '
      + 'opcions per continuar-la.',
    resolucio: [
      'Compara la primera figura amb la segona: què ha canviat?',
      'Comprova que entre la segona i la tercera passi el mateix.',
      'Si el canvi no és sempre igual, mira si va creixent: un, dos, tres.',
      'Aplica el canvi a l\'última figura i busca el resultat entre les opcions.',
    ],
    truc: 'Vigila les sèries que tornen al punt de partida. Si una figura '
      + 'avança dos llocs de quatre, al cap de dos passos torna on era, i '
      + 'llavors «avançar» i «recular» semblen la mateixa cosa.',
  },

  ruleta: {
    titol: 'Ruleta',
    pregunta: 'Quina figura falta a la ruleta?',
    explicacio: 'Les figures donen la volta a un disc i n\'hi falta una. És '
      + 'una sèrie de tota la vida, només que posada en cercle: que faci la '
      + 'rotllana no canvia res.',
    resolucio: [
      'Comença pel forat i ves comptant enrere, com si la ruleta fos una '
        + 'línia recta.',
      'Mira primer NOMÉS les formes, sense fer cas del color. Cada quantes '
        + 'posicions es repeteixen?',
      'Ara mira NOMÉS els colors, sense fer cas de la forma. Cada quantes?',
      'Les dues rodes no van al mateix pas. Amb les dues comptades, ja saps '
        + 'quina forma i quin color van al forat.',
    ],
    truc: 'Les quatre opcions són parades: n\'hi ha una amb la forma bona i '
      + 'el color equivocat, i una amb el color bo i la forma equivocada. Si '
      + 'només comptes una de les dues rodes, cauràs.',
  },

  'dau-planol': {
    titol: 'El dau que roda',
    pregunta: 'Quin número queda a dalt en arribar a la X?',
    explicacio: 'Un dau que rueda per un camí de caselles. Cal dir quin '
      + 'número queda a la cara de dalt en arribar al final.',
    resolucio: [
      'Recorda la regla del dau: les cares oposades sumen set. L\'1 amb el '
        + '6, el 2 amb el 5, el 3 amb el 4.',
      'Cada volta canvia dues cares i deixa dues quietes. Les que es queden '
        + 'són les de l\'eix del gir.',
      'Ves casella a casella. No intentis fer-ho tot de cop.',
      'Al final només et cal la de dalt: la de baix és set menys aquella.',
    ],
    truc: 'Quatre voltes en la mateixa direcció tornen el dau com estava. Si '
      + 'el camí té cinc caselles cap al mateix costat, és com si en tingués '
      + 'una.',
  },

  'comptar-simbols': {
    titol: 'Comptar símbols',
    pregunta: 'Quants n\'hi ha d\'iguals a aquest?',
    explicacio: 'Es dona un símbol i una filera llarga. Cal comptar quants '
      + 'n\'hi ha d\'iguals —o de diferents, que també ho demanen. Aquí no hi '
      + 'ha res a pensar: és velocitat i no equivocar-se.',
    resolucio: [
      'Mira bé el símbol de mostra abans de començar. Quedar-se\'l bé és '
        + 'mig exercici.',
      'Recorre la filera amb el dit o amb la punta del llapis, sense saltar.',
      'Compta de dos en dos o de tres en tres si vas ràpid, però no perdis '
        + 'el compte.',
      'Si et demanen els DIFERENTS, compta els iguals i resta del total. '
        + 'Sol anar més de pressa.',
    ],
    truc: 'Els símbols semblants estan posats a posta al costat dels bons. '
      + 'Si vas massa de pressa, els comptaràs; si vas massa a poc a poc, no '
      + 'acabaràs. Val més fer-ne menys i bé.',
  },

  correspondencies: {
    titol: 'Correspondències',
    pregunta: 'Quantes correspondències són correctes?',
    explicacio: 'Dues taules: la primera diu quina parella va amb quina, i '
      + 'la segona en porta unes quantes. Cal comptar quantes són bones —o '
      + 'quantes són dolentes.',
    resolucio: [
      'No memoritzis la primera taula. La tindràs al davant tota l\'estona.',
      'Ves parella per parella de la segona taula i busca-la a la primera.',
      'Marca amb el dit la que estàs comprovant, que és fàcil saltar-se\'n una.',
      'Si demanen les INCORRECTES, compta les bones i resta.',
    ],
    truc: 'Fixa\'t si et demanen les correctes o les incorrectes ABANS de '
      + 'començar a comptar. Aquí es perden més punts per llegir malament '
      + 'l\'enunciat que per equivocar-se comptant.',
  },

  numeric: {
    titol: 'Aritmètica i sèries de números',
    pregunta: 'Resol.',
    explicacio: 'Problemes de càlcul, percentatges, proporcions, '
      + 'probabilitat i sèries de números.',
    resolucio: [
      'Llegeix la pregunta fins al final abans de calcular. Sovint el que '
        + 'demana no és el que sembla al principi.',
      'Escriu les dades. Amb quatre números al cap es perd temps i es '
        + 'confonen.',
      'Fes el càlcul amb números rodons per saber per on ha d\'anar la '
        + 'resposta.',
      'Mira les opcions: si només una és a prop del teu càlcul rodó, ja la tens.',
    ],
    truc: 'A les sèries de números, calcula primer les diferències entre '
      + 'números seguits. Si les diferències no diuen res, prova els '
      + 'quocients: pot ser que es multipliqui en comptes de sumar.',
  },

  dades: {
    titol: 'Taules i gràfics',
    pregunta: 'Llegeix les dades i respon.',
    explicacio: 'Una taula, un gràfic de barres o un de sectors, i preguntes '
      + 'sobre el que hi diu: diferències, mitjanes, percentatges.',
    resolucio: [
      'Abans de res, mira què hi ha a cada eix i en quines unitats. Una '
        + 'columna llegida a la fila del costat és un zero segur.',
      'Localitza NOMÉS els números que necessites. No llegeixis tota la taula.',
      'Fes el càlcul a part, escrit.',
      'Torna a l\'enunciat i comprova que has respost el que et demanava.',
    ],
    truc: 'Les mitjanes són la trampa més habitual: fixa\'t bé de quants '
      + 'anys o de quantes files et demanen la mitjana. «Els últims tres» no '
      + 'és el mateix que «tots».',
  },

  rubik: {
    titol: 'Cubs de Rubik',
    pregunta: 'Com quedarà el cub després dels moviments?',
    explicacio: 'Un cub amb unes caselles pintades i dos moviments dibuixats '
      + 'amb fletxes. Cal dir com queda el cub un cop fets tots dos, en '
      + 'aquest ordre.',
    resolucio: [
      'Mira el primer moviment: la capa que gira va pintada de gris, i la '
        + 'fletxa diu cap on.',
      'Fes-lo amb el cap i queda\'t com queda el cub. Només et calen les '
        + 'tres cares que es veuen.',
      'Ara el segon, sobre el resultat del primer. L\'ordre importa: fer-los '
        + 'a l\'inrevés dona un altre cub.',
      'Compara amb les quatre opcions.',
    ],
    truc: 'Sovint va més ràpid descartar. Mira una sola casella —una que '
      + 'canviï de lloc— i tomba totes les opcions on no hi hagi anat a '
      + 'parar. Amb una o dues caselles ja en queda una de sola.',
  },

  'punt-fuga': {
    titol: 'Punt de fuga',
    pregunta: 'Quina és la mateixa imatge amb l\'ull en un altre lloc?',
    explicacio: 'Una escena rodona i un ull a fora que diu des d\'on la '
      + 'mires. Les quatre opcions tenen l\'ull en un altre lloc: cal trobar '
      + 'la que és la MATEIXA escena vista des d\'allà.',
    resolucio: [
      'Canviar l\'ull de lloc és girar l\'escena. Res més.',
      'Gira l\'escena del model amb el cap fins que l\'ull et quedi on el té '
        + 'l\'opció que estàs mirant.',
      'Ara compara: la franja ha d\'anar en la mateixa direcció i els '
        + 'objectes han de quedar als mateixos llocs.',
      'Si tot quadra, és aquella.',
    ],
    truc: 'Les tres dolentes són l\'escena REFLECTIDA, no girada. Busca un '
      + 'objecte que miri cap a un costat —el cotxe, la barca, la tassa— i '
      + 'comprova cap a on mira. Si mira a l\'altra banda, és un reflex.',
  },

  'cara-interrogant': {
    titol: 'La cara de l\'interrogant',
    pregunta: 'Quina figura va a l\'interrogant?',
    explicacio: 'Un cub de vidre —s\'hi veuen les sis cares, les tres del '
      + 'fons més fluixes— i, al costat, un desplegable del mateix cub amb '
      + 'dues caselles dibuixades i una amb un interrogant.',
    resolucio: [
      'Al desplegable hi ha dues figures dibuixades. Busca-les al cub: '
        + 'et diran com encaixa el paper amb el cub.',
      'Amb aquestes dues ja no queda cap altra manera de plegar-lo. Tot '
        + 'està lligat.',
      'Segueix el desplegable des d\'una de les dues fins a la casella de '
        + 'l\'interrogant, comptant els plecs.',
      'Mira quina cara del cub és aquella i llegeix-hi la figura. Recorda '
        + 'que les del fons es veuen del revés.',
    ],
    truc: 'Comença sempre per una casella que TOQUI la de l\'interrogant. '
      + 'Si comences per la de l\'altra punta del paper, has de comptar més '
      + 'plecs i és més fàcil perdre\'s.',
  },

  sinonims: {
    titol: 'Sinònims i antònims',
    pregunta: 'Quina paraula hi va?',
    explicacio: 'Es dona una paraula i cal triar la de significat més '
      + 'semblant —o més oposat. Llegeix quina de les dues coses et demanen.',
    resolucio: [
      'Mira si demana el SEMBLANT o l\'OPOSAT. Les dues coses hi són, i es '
        + 'confonen.',
      'Digues la paraula en una frase teva. Sovint el significat surt sol.',
      'Descarta les que ni de lluny. En solen quedar dues.',
      'Entre aquestes dues, tria la que podries posar a la frase sense que '
        + 'canviés res.',
    ],
    truc: 'Si demanen l\'oposat, entre les opcions n\'hi ha gairebé sempre '
      + 'un SINÒNIM posat a posta. És la parada més vella que hi ha.',
  },

  analogies: {
    titol: 'Analogies',
    pregunta: 'Completa la relació.',
    explicacio: 'Dues paraules que van juntes per algun motiu, i una tercera '
      + 'que n\'espera la seva. Cal trobar-la.',
    resolucio: [
      'Digues en veu baixa QUINA relació hi ha entre les dues primeres: '
        + '«el cirerer fa cireres».',
      'Diu-la amb la tercera: «el taronger fa...».',
      'La resposta ha de completar la frase igual de bé.',
      'Si més d\'una hi encaixa, la relació que has trobat és massa àmplia. '
        + 'Torna-hi i fes-la més precisa.',
    ],
    truc: 'La relació ha d\'anar en el mateix SENTIT. Si la primera parella '
      + 'és de l\'arbre al fruit, la segona també: del fruit a l\'arbre no '
      + 'val, encara que la paraula sigui de la família.',
  },
};
