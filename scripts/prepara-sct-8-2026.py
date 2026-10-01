"""Extreu les 88 opcions del comunicat aportat, sense modificar el PDF signat."""
import json, re, sys
from pathlib import Path
import pdfplumber

pdf = Path(sys.argv[1])
dest = Path(__file__).resolve().parents[1] / 'src/data/sct-8-2026.json'
rows = []
with pdfplumber.open(pdf) as doc:
    for page in doc.pages[14:20]:
        for table in page.extract_tables():
            for cells in table:
                if not cells[0] or not cells[1] or not cells[2] or not cells[2].strip().isdigit():
                    continue
                vals = [re.sub(r'\s+', ' ', x).strip() for x in cells if x and x.strip()]
                concept, article, option, fine, dte, *points = vals
                rows.append(dict(numero=len(rows)+1, lawId='lsv' if 'LSV' in article else 'rgc',
                    article=article.replace(' LSV',''), opcio=option, concepte=concept,
                    severity='L' if int(fine)<=100 else 'G', fine=fine, dte=dte,
                    points=points[0] if points else '', pagina=page.page_number,
                    vigentDesDe='2026-10-01', font='Comunicat SCT 8/2026'))
assert len(rows)==87
rows.append(dict(numero=88,lawId='rgv',article='19',opcio='',
    concepte='No tenir, el vehicle ressenyat, els recanvis o accessoris reglamentaris (les motocicletes han de portar una armilla reflectora d’alta visibilitat que compleixi els requisits dels equips de protecció individual).',
    severity='L',fine='80',dte='40',points='',pagina=15,vigentDesDe='2026-10-01',font='Comunicat SCT 8/2026'))
notes = {
 5:'Excepció de l’art. 12.2: majors de 7 anys amb pare, mare, tutor o adult autoritzat, casc i condicions reglamentàries.',
 6:'Excepció de l’art. 12.2: majors de 7 anys amb pare, mare, tutor o adult autoritzat, casc i condicions reglamentàries.',
 21:'Neu: amb dos carrils, circular pel dret; amb tres o més, també es pot utilitzar el contigu al dret. La resta de carrils de l’esquerra queden lliures (art. 32.2 BOE).',
 23:'Motocicletes pel voral només en trams habilitats i senyalitzats, amb trànsit detingut per congestió, en fila d’un i a un màxim de 30 km/h.',
 26:'Es mantenen les prohibicions en autopistes, autovies i travessies. Excepció de vies interurbanes i túnels urbans: vies ciclistes o prohibides a vehicles de motor, si la senyalització no ho prohibeix.',
 28:'L’art. 64.1 estableix la prioritat general dels conductors sobre vianants i animals, amb les excepcions dels arts. 65 i 66. El text SCT es refereix a aquesta prioritat; no interpretar-lo com una obligació universal dels conductors de cedir el pas. Identificar el subjecte infractor i les excepcions.',
 41:'DISCREPÀNCIA: l’art. 92.4.b BOE permet descansar només sobre pneumàtics, amb possibilitat de calços. No obliga a utilitzar-los. No denunciar la mera absència de calços amb aquest redactat.',
 43:'Règim transitori: guants de protecció d’ús actual des de l’1-10-2026. No exigir homologació o especificacions tècniques noves fins a l’ordre ministerial (DT 2a BOE). Verificar el criteri SCT abans d’utilitzar aquesta opció de guants homologats.',
 44:'Règim transitori: guants de protecció d’ús actual des de l’1-10-2026. No exigir homologació o especificacions tècniques noves fins a l’ordre ministerial (DT 2a BOE). Verificar el criteri SCT abans d’utilitzar aquesta opció de guants homologats.',
 45:'Excepció: estructura d’autoprotecció i cinturó, que constin a la documentació del vehicle; aleshores cal utilitzar el cinturó (art. 118.1).',
 46:'Excepció: estructura d’autoprotecció i cinturó, que constin a la documentació del vehicle; aleshores cal utilitzar el cinturó (art. 118.1).',
 50:'Àmbit interurbà segons l’art. 118.2 BOE. Element lluminós o reflectant visible a 150 m; no confondre amb l’armilla professional en totes les vies.',
 53:'Àmbit interurbà segons l’art. 118.4 BOE. Els punts no s’apliquen a VMP ni bicicletes.',
 54:'Àmbit interurbà; personal auxiliar dels vehicles pilot de protecció i acompanyament (art. 118.4 BOE).',
 59:'DISCREPÀNCIA: l’art. 122.2.c BOE obliga a anar per la dreta quan no sigui segur anar per l’esquerra; el text del comunicat sanciona anar per la dreta sense justificació. Verificar la tipificació exacta amb el SCT.',
 64:'DISCREPÀNCIA: l’art. 124.4 BOE exigeix vorejar la plaça o glorieta, llevat que hi hagi un pas habilitat. El redactat del comunicat diu «existint un pas». No denunciar l’ús d’un pas habilitat.',
 66:'Àmbit urbà: no confondre vorera amb la resta de zones de vianants. L’ordenança pot permetre bicicletes d’infants de fins a 12 anys a càrrec d’un adult a peu (art. 152.1).',
 68:'DISCREPÀNCIA: l’art. 153.1 BOE estableix ús preferent, no obligatori, del carril bici. L’obligatorietat requereix senyal R-407a. No denunciar només perquè existeix un carril bici.',
 69:'Excepció de menors prevista a l’art. 152.1 i autoritzada per ordenança municipal.',
 70:'Es permet utilitzar altres carrils per canviar de direcció o per raons de seguretat (art. 153.3).',
 74:'DT 2a: fins a l’ordre ministerial, els seients addicionals han de ser homologats. No exigir especificacions futures. L’art. 154.2 fixa fins a 22 kg i capacitat de seure per si sol.',
 75:'DT 2a: els seients han de ser homologats durant el període transitori; no confondre aquesta exigència vigent amb especificacions futures pendents d’ordre ministerial.',
 79:'DISCREPÀNCIA: l’art. 154.4 BOE permet càrrega; el límit de 15 kg s’aplica als animals. La DT 2a permet remolcs mentre no entri en vigor l’ordre tècnica. No denunciar el simple transport de càrrega.',
 81:'Per remissió a l’art. 153.3, es permeten altres carrils per canviar de direcció o per seguretat.',
 86:'Aquesta opció és enllumenat NOCTURN (1-10-2026). L’enllumenat DIÜRN no s’exigeix fins a l’1-10-2027 (DT 3a).',
 88:'El comunicat no facilita un codi d’opció per a aquest supòsit RGV: no inventar-lo.',
}
for row in rows:
    n=row['numero']
    row['nota']=notes.get(n,'')
    if n in [41,59,64,68,79]: row['estat']='revisio'
    elif n in [43,44]: row['estat']='pendent-ordre'
    else: row['estat']='ordinari'
dest.write_text(json.dumps({'meta':{'source':pdf.name,'dataRevisio':'2026-09-29','entradaGeneral':'2026-10-01','boe':'https://www.boe.es/eli/es/rd/2026/06/24/518','total':88},'rows':rows},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('88 opcions extretes; 5 discrepàncies i 2 opcions d’homologació de guants assenyalades.')
