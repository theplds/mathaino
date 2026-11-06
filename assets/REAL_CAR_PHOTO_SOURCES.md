# Μαθαίνω — real-car recognition image manifest (v0.6.79)

These are **verified real-vehicle Wikimedia Commons photos**, not generated illustrations.
The `localName` column records the intended filename under `assets/cars/`
when the binary pictures can be bundled into the repository. **Those local
JPEG files are NOT in this release**. The app currently fetches the canonical
Wikimedia thumbnails, retries the original file and Commons redirect, and
won't ask children to identify an unseen photo. An internet connection is
required to load uncached images. Do not describe these as locally installed.

Each photo is attributed in the quiz. Follow the linked source and licence
before distributing files or making derivatives. CC BY-SA files have
share-alike obligations; this license applies to derivatives of those images,
not automatically to separate app source code.

| Brand | Model | Planned local name | Image source | Photographer | Licence |
|---|---|---|---|---|---|
| Ferrari | 458 Italia | `ferrari-458.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2012_Ferrari_458_Italia_red.jpg) | Calreyn88 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Lamborghini | Huracán Performante | `lamborghini-huracan.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lamborghini_Huracan_Performante_green.jpg) | Calreyn88 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Porsche | 911 GT3 RS | `porsche-911.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Porsche_911_GT3RS.jpg) | Calreyn88 | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| BMW | M4 | `bmw-m4.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:BMW_M4.jpg) | Calreyn88 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Mercedes-Benz | AMG GT | `mercedes-amg-gt.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2024_Mercedes_AMG_GT.jpg) | Calreyn88 | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| Audi | R8 V10 Plus | `audi-r8.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Audi_R8_(front).jpg) | AKS.9955 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Nissan | GT-R | `nissan-gtr.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Nissan_GT-R.jpg) | douglasjose | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| Ford | Mustang GT | `ford-mustang.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ford_Mustang_GT.jpg) | Calreyn88 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Chevrolet | Corvette C8 | `chevrolet-corvette.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chevrolet_Corvette_C8_1.jpg) | Calreyn88 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Tesla | Model S | `tesla-model-s.jpg` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2024_Tesla_Model_S.jpg) | Calreyn88 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

The downloadable image in the current release is a Wikimedia thumbnail,
not a guaranteed always-online resource. Future image bundling requires
transferring properly attributed JPEG binaries into the GitHub project.
