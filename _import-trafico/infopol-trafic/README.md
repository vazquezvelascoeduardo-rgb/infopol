# Mòdul Trànsit — Checklists operatius per a InfoPol

Aquest paquet conté **12 fitxers JSON** amb arbres de decisió operatius per al mòdul de Trànsit de la teva app InfoPol.

## Què hi ha dins?

```
checklists/
├── _index-trafic.json          ← índex dels 12 escenaris
├── alcoholemia.json            ← proves, taxes, administrativa vs penal, Art. 383
├── drogues.json                ← test salival, influència, Art. 379.2 / 383
├── velocitat.json              ← per tipus de via (urbana 20/30/50 + interurbana)
├── assegurança.json            ← barem Consorci, tipus vehicle i temps
├── itv.json                    ← caducada, desfavorable, negativa
├── permis.json                 ← caducat, sense permís, 384 CP, estranger...
├── mobil-cinturo-casc.json     ← mòbil, auriculars, pantalla, SRI, casc
├── tintats-llums.json          ← 19.1 RGC + casos de llums
├── doc-falsa.json              ← DNI, permís, matrícula... Art. 392 CP
├── temerari-negligent.json     ← Art. 77.e TRLSV + 380/381 CP
├── accident.json               ← danys, ferits, fuga, Art. 382 bis CP
└── vehicle-abandonat.json      ← immobilització, grua, Art. 104-106 TRLSV
```

## Com funciona cada JSON?

Cada escenari és un **arbre de decisió**:

- `inici`: quin node es mostra primer.
- `nodes`: conjunt de pantalles. Cada node té un `titol`, un `text`, i:
  - **Si és intermedi** → una llista `opcions` amb botons. Cada botó porta (`va_a`) a un altre node.
  - **Si és final** (`"final": true`) → mostra la resolució: `titol`, `tipus` (ok/administrativa/penal/procediment), `import`, `punts`, `accions`, `document`, `base_legal`.

Exemple mínim:
```json
{
  "inici": "n1",
  "nodes": {
    "n1": {
      "text": "Pregunta?",
      "opcions": [
        { "etiqueta": "Sí", "va_a": "fi_ok" },
        { "etiqueta": "No", "va_a": "fi_ko" }
      ]
    },
    "fi_ok": { "final": true, "titol": "✅ Tot correcte" },
    "fi_ko": { "final": true, "titol": "⚠️ Infracció", "import": "200€" }
  }
}
```

## Com integrar-ho a la teva app InfoPol

### Pas 1 — Copia els fitxers
Copia la carpeta `checklists/` sencera a la carpeta arrel del teu projecte InfoPol.

### Pas 2 — Passa aquest prompt a Claude Code

```
A la meva app InfoPol, integra el mòdul "Checklists operatius de Trànsit":

1) La carpeta `checklists/` ja conté:
   - `_index-trafic.json` (índex)
   - 12 fitxers JSON d'escenaris (alcoholemia, drogues, velocitat, etc.)

2) Crea un component ChecklistRunner que:
   - Llegeix un fitxer JSON pel seu id.
   - Mostra el node inicial (titol + text + botons segons opcions).
   - Cada botó avança al node indicat a "va_a" amb animació slide.
   - Guarda l'historial de nodes visitats per poder anar "← Enrere".
   - Té botó "🔄 Reiniciar" que torna a l'inici.
   - Si el node té "final": true, pinta una targeta amb:
     * titol en gran + color segons tipus (ok=verd, administrativa=taronja, penal=vermell, procediment=blau)
     * camps: text, import, punts, pena, accions (llista), document, base_legal (llista)
     * botó "📄 Exportar resum PDF"
     * botó "🔄 Tornar a començar"

3) A la pantalla principal d'InfoPol, afegeix una entrada nova al menú
   "🚦 Trànsit — Checklists" que obri la llista llegint `_index-trafic.json`.
   Presenta els 12 escenaris com a targetes amb icona + títol.

4) Guarda també un historial local ("casos recents") amb els últims 10 checklists fets.

5) Estil: segueix la paleta d'InfoPol (fons fosc #0A1628, daurat #C8A028).
   Els botons de decisió ben grans per al mòbil (mínim 50px alçada).

Al final, documenta al README com afegir un nou JSON de checklist
només copiant un fitxer a la carpeta i afegint una línia a l'índex.
```

### Pas 3 — Provar-ho
Obre l'app, ves a "Trànsit — Checklists", tria "Alcoholèmia", i verifica que les opcions t'avancen correctament fins a una targeta final amb la sanció.

## Com afegir nous escenaris

Per a un nou escenari (per exemple "Transport escolar"):

1. Crea `transport-escolar.json` amb la mateixa estructura.
2. Afegeix una línia a `_index-trafic.json`:
   ```json
   { "id": "transport-escolar", "titol": "🚌 Transport escolar", "fitxer": "transport-escolar.json", "ordre": 13 }
   ```
3. Res més. L'app el detectarà automàticament.

## Important — revisió legal

**Correccions aplicades segons Catàleg SCT 2026 (contrastat):**
- ✅ Barem velocitat: punts corregits (Tram 2=2pts, Tram 3=4pts, Tram 4=6pts)
- ✅ Rangs velocitat per via 60/70/80/90/100/110/120 km/h ajustats al barem oficial
- ✅ Assegurança: rewrite complet per tipus de vehicle (AM 1.000€, A 1.250€, B 1.500€, C/D 2.800€…)
- ✅ Mòbil/cinturó/casc: reclassificat com GREU (no MG) amb punts correctes
- ✅ Permís classe inadequada: MG 500€ + 4 pts (Art. 1.1 RG Cond)
- ✅ No portar permís: 80€ LLEU (Art. 3.2 RG Cond)
- ✅ ITV desfavorable fora termini: GREU 200€ (no MG)
- ✅ Alcoholèmia reincidència tram inicial: 1.000€ + 4 pts (no 6 pts)
- ✅ Conducció negligent GREU 200€ vs temerària MG 500€+6pts (Art. 3.1 RGC)

Els arbres estan pensats com a GUIA operativa ràpida, no com a text legal definitiu. 
En qualsevol cas dubtós, consultar directament el Catàleg SCT vigent.
