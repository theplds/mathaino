#!/usr/bin/env python3
"""One-time importer: seven authentic trademark badges from Commons, normalized PNG.
Rendered for a brand-identification exercise. No manufacturer endorsement.
Sources and permissions recorded in assets/badges/SOURCES.md.
"""
import base64, hashlib, io, json, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path
import cairosvg
from PIL import Image, ImageOps

brand=sys.argv[1]
source=Path('extra-lessons.js').read_text(encoding='utf-8')
bank=json.loads(source.split('const badgeBank=',1)[1].split(';',1)[0])
badge=next((x for x in bank if x['brand']==brand),None)
if badge is None: raise SystemExit('Unknown badge '+brand)
file=badge['file']
canonical=file.replace(' ','_')
digest=hashlib.md5(canonical.encode('utf-8')).hexdigest()
url='https://upload.wikimedia.org/wikipedia/commons/'+digest[0]+'/'+digest[:2]+'/'+urllib.parse.quote(canonical,safe='()')
other='https://commons.wikimedia.org/wiki/Special:FilePath/'+urllib.parse.quote(file)+'?width=960'
raw=Path('assets/badges/source-porsche.svg').read_bytes() if brand=='Porsche' else (base64.b64decode(Path('assets/badges/source-chevrolet.b64').read_text()) if brand=='Chevrolet' else None)
for attempt in range(0 if brand in ('Porsche','Chevrolet') else 6):
    endpoint=url if attempt < 4 else other
    try:
        request=urllib.request.Request(endpoint,headers={'User-Agent':'MathainoEducationalBadgeImporter/0.6.82 (source credit in GitHub)', 'Accept':'image/*'})
        with urllib.request.urlopen(request,timeout=28) as response:
            raw=response.read(13000000)
            typ=response.headers.get('Content-Type','')
        if len(raw)<(150 if canonical.lower().endswith('.svg') else 1000) or raw[:4]==b'<!DO':raise ValueError('Invalid image payload '+typ)
        break
    except Exception as e:
        print('retry',attempt+1,'on',brand,type(e).__name__,str(e)[:120],flush=True)
        time.sleep(2+attempt*3)
if raw is None or len(raw)<(150 if canonical.lower().endswith('.svg') else 1000):raise SystemExit('Missing badge '+brand)
if canonical.lower().endswith('.svg'):
    if b'<svg' not in raw[:3000] and b'<svg' not in raw[:3000].lower():raise ValueError('SVG not found')
    raster=cairosvg.svg2png(bytestring=raw,output_width=900)
    img=Image.open(io.BytesIO(raster)).convert('RGBA')
else:
    img=Image.open(io.BytesIO(raw)).convert('RGBA')
if img.width < 80 or img.height < 30:raise ValueError('Logo resolution too small '+str(img.size))
# Center an authentic logo on a consistent pale neutral card, no brand name added.
# Keep a 42px quiet inset, while preserving shield / crest aspect ratios.
frame=Image.new('RGB',(720,480),'#f5f8fa')
fit=ImageOps.contain(img,(620,395),method=Image.Resampling.LANCZOS)
x=(720-fit.width)//2
y=(480-fit.height)//2
frame.paste(fit,(x,y),fit)
out=Path('badge-staging')/badge['localName']
out.parent.mkdir(parents=True,exist_ok=True)
frame.save(out,'PNG',optimize=True)
result=Image.open(out)
if result.size!=(720,480):raise ValueError('Wrong output dimensions')
print(f'{brand}: {file} -> {out} {out.stat().st_size} bytes (source {img.size}, {len(raw)} bytes)',flush=True)
