# Regenerar el catàleg d'infraccions

`src/data/infractions.js` **no s'edita a mà**. Es genera a partir del PDF del
«Catàleg d'Infraccions» del Servei Català de Trànsit.

## Requisits

```bash
pip install pdfplumber
```

## Procediment

1. Obtenir la versió vigent del catàleg del SCT en PDF.
2. Executar:

```bash
python3 tools/_parse_sct_rows.py        # PDF  → sct.json
python3 tools/_gen_infractions_js.py    # JSON → infractions.generated.js
```

3. Concatenar el fitxer generat amb el bloc manual (llindars penals, delictes
   de trànsit, seguretat ciutadana i les funcions de cerca i càlcul), que viu a
   partir del comentari `LLINDAR PENAL` del fitxer actual.
4. Actualitzar `FONT.versio` i `FONT.versioLabel`.
5. Comprovar el recompte i que cap fila quedi sense quantia ni barem:

```bash
node --input-type=module -e "import('./src/data/infractions.js').then(m=>{
  console.log(m.INFRACTIONS.length);
  console.log(m.INFRACTIONS.filter(i=>!i.fine && !i.barem && !i.fineLabel).length);
})"
```

## Desviacions conegudes respecte del PDF

Totes estan documentades a la capçalera de `src/data/infractions.js`:

- **Barem de velocitat**: s'omet la columna «130 km/h». Al PDF repeteix els
  valors de la columna «120 km/h» i no es correspon amb cap límit genèric
  vigent. Les columnes de 20 a 120 km/h s'han contrastat amb l'annex IV del
  text refós de la Llei de Seguretat Viària i hi coincideixen.
- Dos artefactes tipogràfics del PDF corregits (`un- veh icle`).

Res més s'ha alterat: ni un article, ni un import, ni una pèrdua de punts.
