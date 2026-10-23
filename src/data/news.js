// Notícies diàries d'InfoPol — actualitzat automàticament cada dia a les 22h
// Categories: politica, economia, internacional, policial, premis, cultura, esports

export const CATEGORIES = {
  politica:      { label: 'Política',       color: '#3B6BF5', bg: '#EEF2FF' },
  economia:      { label: 'Economia',       color: '#1FB286', bg: '#E8FBF5' },
  internacional: { label: 'Internacional',  color: '#9C4FE0', bg: '#F5EEFF' },
  policial:      { label: 'Policial',       color: '#FF4B4B', bg: '#FFF0F0' },
  premis:        { label: 'Premis',         color: '#FF7A1A', bg: '#FFF3EA' },
  cultura:       { label: 'Cultura',        color: '#E0A020', bg: '#FFFBEA' },
  esports:       { label: 'Esports',        color: '#1E9E5B', bg: '#E8FBF0' },
};

// — 23 d'octubre de 2026 —
export const NEWS = [
  // ── POLÍTICA ──────────────────────────────────────────────────────────────
  {
    id: 'pol-01-20261023',
    date: '10·23',
    cat: 'politica',
    tag: 'Eleccions 29N · Catalunya',
    title: 'El PP confirma Albiol cap de llista per Barcelona i el CEO situa Aliança Catalana per davant de Junts',
    desc: 'El Partit Popular reconfirma Xavier García Albiol com a candidat principal per a Barcelona per a les eleccions del 29 de novembre. Un nou baròmetre del CEO col·loca Aliança Catalana per primera vegada per davant de Junts en intenció de vot, mentre el PSC d\'Illa manté el lideratge global.',
    url: 'https://www.elnacional.cat/es/politica.html',
  },
  {
    id: 'pol-02-20261023',
    date: '10·23',
    cat: 'politica',
    tag: 'Vivienda · Huelga 11N',
    title: 'El Sindicat de Llogateres ocupa la UB per preparar la vaga general del 11 de novembre',
    desc: 'El Sindicat de Llogateres ha ocupat l\'edifici històric de la Universitat de Barcelona com a acció de protesta i punt d\'organització de cara a la vaga general contra la crisi d\'habitatge convocada per al proper 11 de novembre.',
    url: 'https://theobjective.com/espana/cataluna/',
  },
  {
    id: 'pol-03-20261023',
    cat: 'politica',
    date: '10·23',
    tag: 'Mossos d\'Esquadra',
    title: 'L\'Audiència de Barcelona obre diligències pel tret de foam dels Mossos a un fotoperiodista',
    desc: 'El tribunal ha ordenat investigar un incident en el qual una unitat dels Mossos d\'Esquadra va disparar munició de foam contra un fotoperiodista durant una manifestació a Barcelona.',
    url: 'https://theobjective.com/espana/cataluna/',
  },

  // ── ECONOMIA ──────────────────────────────────────────────────────────────
  {
    id: 'eco-01-20261023',
    date: '10·23',
    cat: 'economia',
    tag: 'Borsa · Ibex 35',
    title: 'L\'Ibex 35 perd els 19.000 punts i tanca la setmana a la baixa',
    desc: 'L\'índex borsari espanyol ha pujat un 0,4% en la sessió del divendres però tanca la setmana amb una caiguda de prop del 2% i certifica la pèrdua del nivell dels 19.000 punts acumulada en els darrers dies.',
    url: 'https://eleconomista.es/flash/20261023',
  },
  {
    id: 'eco-02-20261023',
    date: '10·23',
    cat: 'economia',
    tag: 'Combustibles · IPC',
    title: 'Els combustibles s\'encareixen un 28% al setembre i empenten la inflació al 4,9%',
    desc: 'La pujada dels carburants ha estat el principal factor darrere l\'acceleració de la inflació espanyola fins al 4,9% interanual al setembre, la xifra més alta dels darrers mesos.',
    url: 'https://www.publico.es/economia',
  },
  {
    id: 'eco-03-20261023',
    date: '10·23',
    cat: 'economia',
    tag: 'Huelga · Renfe',
    title: 'Els maquinistes de Renfe convoquen vaga de 24 hores per al 29 d\'octubre',
    desc: 'El sindicat de maquinistes ha convocat una aturada de 24 hores el proper dimecres 29 d\'octubre en protesta per les condicions laborals i el bloqueig de la negociació col·lectiva.',
    url: 'https://www.publico.es/economia',
  },

  // ── INTERNACIONAL ─────────────────────────────────────────────────────────
  {
    id: 'int-01-20261023',
    date: '10·23',
    cat: 'internacional',
    tag: 'França · Disturbis',
    title: 'França mobilitza 70.000 policies davant les convocatòries de saquejos per a dissabte',
    desc: 'El govern francès ha activat un desplegament policial massiu per a la nit del dissabte davant les crides a saquejos difoses per xarxes socials. París estudia suspendre TikTok i Snapchat, mesura que ha obert una crisi política interna.',
    url: 'https://www.infobae.com/america/agencias/2026/10/23/temas-del-dia-de-efe-internacional-del-viernes-23-de-octubre-de-2026-1200-gmt/',
  },
  {
    id: 'int-02-20261023',
    date: '10·23',
    cat: 'internacional',
    tag: 'França · Terrorisme',
    title: 'La Fiscalia Antiterrorista francesa investiga uns tiroteos prop de París: 1 mort i 4 ferits greus',
    desc: 'La Fiscalia Antiterrorista s\'ha fet càrrec de la investigació d\'uns tiroteos ocorreguts a uns trenta quilòmetres de París que han deixat un mort i quatre persones ferides de gravetat.',
    url: 'https://www.infobae.com/america/agencias/2026/10/23/temas-del-dia-de-efe-internacional-del-viernes-23-de-octubre-de-2026-1200-gmt/',
  },
  {
    id: 'int-03-20261023',
    date: '10·23',
    cat: 'internacional',
    tag: 'Xina · Seisme',
    title: 'Terratrèmol de magnitud 7 al Tibet: almenys 16 morts i 12.489 evacuats',
    desc: 'Un sisme de magnitud 7 ha sacsat la regió del Tibet. Les operacions de rescat continuen amb el balanç oficial de 16 morts, 65 ferits i quasi 12.500 persones desplaçades de les seves llars.',
    url: 'https://www.infobae.com/america/agencias/2026/10/23/viernes-23-de-octubre-de-2026-0700-gmt/',
  },
  {
    id: 'int-04-20261023',
    date: '10·23',
    cat: 'internacional',
    tag: 'Pròxim Orient',
    title: 'Netanyahu ordena el tancament total de Cisjordània després que un atac mati dos soldats',
    desc: 'El primer ministre israelià ha decretat el blocatge total de Cisjordània com a represàlia per un atac armat que ha causat la mort de dos soldats i ha ferit tres persones més.',
    url: 'https://www.infobae.com/america/agencias/2026/10/23/viernes-23-de-octubre-de-2026-0700-gmt/',
  },
  {
    id: 'int-05-20261023',
    date: '10·23',
    cat: 'internacional',
    tag: 'Brasil · Eleccions',
    title: 'Lula i Flávio Bolsonaro arriben en empat tècnic a la segona volta presidencial del 25 d\'octubre',
    desc: 'L\'enquesta Datafolha situa Lula da Silva i el candidat ultraderetà Flávio Bolsonaro igualats de cara al segon torn de les eleccions presidencials brasileres, previst per al proper diumenge.',
    url: 'https://www.infobae.com/america/agencias/2026/10/23/temas-del-dia-de-efe-internacional-del-viernes-23-de-octubre-de-2026-1200-gmt/',
  },

  // ── POLICIAL / LEGAL ──────────────────────────────────────────────────────
  {
    id: 'polic-01-20261023',
    date: '10·23',
    cat: 'policial',
    tag: 'Policia Nacional',
    title: 'La Policia Nacional recomana als agents mantenir 3 metres de distància en l\'ús del nou esprai de defensa',
    desc: 'La Direcció General de la Policia ha emès un protocol intern que recomana una distància mínima de tres metres en l\'ús dels nous esprais de defensa, i n\'amplia el repartiment més enllà de les unitats de seguretat ciutadana per l\'augment d\'agressions.',
    url: 'https://www.infobae.com/espana/agencias/2026/10/23/la-policia-recomienda-a-los-agentes-una-distancia-de-3-metros-para-usar-espray-de-defensa/',
  },
  {
    id: 'polic-02-20261023',
    date: '10·23',
    cat: 'policial',
    tag: 'Sucesos · Ciudad Real',
    title: 'Tres lladres assalten la casa d\'una anciana discapacitada a Ciudad Real i amordacen el cuidador',
    desc: 'Es busca a tres individus que van assaltar el domicili d\'una dona gran amb discapacitat a Ciudad Real. Els autors van amordaçar el cuidador i s\'emportaren telèfons mòbils, joies i una petita quantitat de diners. Encara no hi ha detencions.',
    url: 'https://www.elespanol.com/eldigitalcastillalamancha/sociedad/sucesos/20261023/buscan-ladrones-asaltaron-casa-anciana-discapacidad-ciudad-real-amordazaron-cuidador/1003744432692_0.html',
  },

  // ── PREMIS ────────────────────────────────────────────────────────────────
  {
    id: 'pre-01-20261023',
    date: '10·23',
    cat: 'premis',
    tag: 'Princesa d\'Astúries 2026',
    title: 'Messi, Patti Smith i Studio Ghibli reben els Premis Princesa d\'Astúries en la cerimònia d\'Oviedo',
    desc: 'La cerimònia presidida pels Reis d\'Espanya ha lliurat els guardons 2026: Leo Messi (Esports), Patti Smith (Arts), Studio Ghibli (Comunicació i Humanitats), Julian Barnes (Lletres), Christina Koch (Concordia), Bóveda Global de Llavors (Cooperació) i Timothy Garton Ash (Ciències Socials).',
    url: 'https://www.infobae.com/espana/2026/10/23/premios-princesa-de-asturias-2026-en-directo-ultima-hora-de-la-ceremonia-de-entrega-alfombra-roja-y-discursos/',
  },
  {
    id: 'pre-02-20261023',
    date: '10·23',
    cat: 'premis',
    tag: 'Nobel Medicina 2026',
    title: 'Nobel de Medicina per als creadors de l\'optogenètica: Deisseroth, Hegemann i Nagel',
    desc: 'Karl Deisseroth, Peter Hegemann i Georg Nagel han rebut el Nobel de Medicina per la seva feina pionera en optogenètica, una tècnica que permet controlar neurones individuals amb llum. El descobriment revoluciona el tractament de malalties neurològiques.',
    url: 'https://www.eluniversal.com.mx/ciencia-y-salud/arrancan-los-premios-nobel-2026-el-de-medicina-va-a-investigacion-de-los-canales-ionicos-activados-por-luz-y-la-optogenetica/',
  },
  {
    id: 'pre-03-20261023',
    date: '10·23',
    cat: 'premis',
    tag: 'Nobel Física 2026',
    title: 'Nobel de Física per a Francis Halzen per la detecció de neutrins còsmics des del gel antàrtic',
    desc: 'El físic belga Francis Halzen ha estat reconegut per la construcció del detector IceCube, que va convertir un quilòmetre cúbic de gel al Pol Sud en un telescopi de neutrins. El projecte ha obert una nova finestra per observar l\'univers.',
    url: 'https://impactotic.co/ciencia/premios-nobel-2026-de-ciencia-ganadores/',
  },

  // ── ESPORTS ───────────────────────────────────────────────────────────────
  {
    id: 'esp-01-20261023',
    date: '10·23',
    cat: 'esports',
    tag: 'Futbol · FIFA',
    title: 'Messi recull a Oviedo el Premi Princesa d\'Astúries d\'Esports com «el futbolista més reeixit de tots els temps»',
    desc: 'Leo Messi ha acceptat personalment el guardó esportiu de la Fundació Princesa d\'Astúries, que el reconeix com el millor futbolista de la història per la seva trajectòria amb l\'Argentina i els seus clubs.',
    url: 'https://www.articulo14.es/cultura/las-mujeres-que-protagonizan-los-premios-princesa-de-asturias-2026-20261020.html',
  },
  {
    id: 'esp-02-20261023',
    date: '10·23',
    cat: 'esports',
    tag: 'NFL · França',
    title: 'La NFL disputa un partit a França malgrat les protestes per la tensió social',
    desc: 'La lliga nord-americana de futbol americà ha mantingut el partit programat a París malgrat la situació de tensió social al país gàl. Les autoritats han desplegat efectius addicionals per garantir la seguretat del camp i dels seus voltants.',
    url: 'https://www.infobae.com/america/agencias/2026/10/23/temas-del-dia-de-efe-internacional-del-viernes-23-de-octubre-de-2026-1200-gmt/',
  },

  // ── CULTURA ───────────────────────────────────────────────────────────────
  {
    id: 'cul-01-20261023',
    date: '10·23',
    cat: 'cultura',
    tag: 'Princesa d\'Astúries · Arts',
    title: 'Patti Smith recull el Premi Princesa d\'Astúries de les Arts 2026 a Oviedo',
    desc: 'La cantant i escriptora Patti Smith, considerada la «mare del punk» i una de les veus més influents de la cultura contemporània, ha rebut el premi de les Arts en la cerimònia d\'Oviedo.',
    url: 'https://www.infobae.com/espana/2026/10/23/premios-princesa-de-asturias-2026-en-directo-ultima-hora-de-la-ceremonia-de-entrega-alfombra-roja-y-discursos/',
  },
  {
    id: 'cul-02-20261023',
    date: '10·23',
    cat: 'cultura',
    tag: 'Princesa d\'Astúries · Comunicació',
    title: 'Studio Ghibli, el llegendari estudi d\'animació japonès, guanya el Premi Princesa d\'Astúries de Comunicació i Humanitats',
    desc: 'L\'estudi de Hayao Miyazaki i Isao Takahata, creadors de clàssics com «El meu veí Totoro» o «La princesa Mononoke», ha estat reconegut pel seu llegat humanístic i cultural en el món de l\'animació.',
    url: 'https://www.infobae.com/espana/2026/10/23/premios-princesa-de-asturias-2026-en-directo-ultima-hora-de-la-ceremonia-de-entrega-alfombra-roja-y-discursos/',
  },
];
