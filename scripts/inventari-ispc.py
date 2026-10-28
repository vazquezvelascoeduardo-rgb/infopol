"""Inventaria els PDF privats sense copiar-los al repositori públic."""
import hashlib
import io
import json
import logging
import pathlib
import sys
import zipfile
import pymupdf

logging.getLogger('pypdf').setLevel(logging.ERROR)
dest = pathlib.Path(sys.argv[2])
dest.mkdir(parents=True, exist_ok=True)
files, seen = [], {}
with zipfile.ZipFile(sys.argv[1]) as archive:
    for entry in archive.infolist():
        if entry.is_dir():
            continue
        data = archive.read(entry)
        digest = hashlib.sha256(data).hexdigest()
        row = dict(path=entry.filename, sha256=digest, bytes=len(data))
        if digest in seen:
            row['duplicate'] = seen[digest]
        else:
            seen[digest] = entry.filename
            try:
                pdf = pymupdf.open(stream=data, filetype='pdf')
                pages = [page.get_text(sort=True) or '' for page in pdf]
                row.update(pages=len(pages), chars=sum(map(len, pages)))
                (dest / (digest + '.json')).write_text(json.dumps(dict(path=entry.filename, pages=pages), ensure_ascii=False), encoding='utf-8')
            except Exception as error:
                row['error'] = str(error)
        files.append(row)
(dest / 'inventory.json').write_text(json.dumps(files, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(dict(files=len(files), unique=len(seen), errors=sum('error' in row for row in files))))
