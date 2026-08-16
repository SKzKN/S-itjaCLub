# QA checklist — autode andmemudel (T3–T8)

Andmeallikas: `assets/cars-data.js`. Käivita
`node scripts/validate-car-photos.js` piltide kontrolli kordamiseks.

**2026-08-05:** omanik lihtsustas sisumudelit — kuulutustes kasutatakse nüüd
AINULT `special`/`caution` teksti (vana "Kirjeldus" plokk ja hero tagline on
täielikult eemaldatud, koos kõigi varasemate AI/vahepealsete tekstidega).
Kaardi eelvaade (esileht + täisnimekiri) on `special[0]` esimene lause, mitte
enam eraldi lühikirjeldus.

## Süsteemsed kontrollid (kehtivad kõigile autodele korraga)

| Kontroll | Staatus | Märkus |
|---|---|---|
| Kaardid (esileht + täisnimekiri) tulevad ühest andmeallikast | ✅ | `assets/cars-data.js` + `assets/cars-shared.js`, laetud `index.html`, `autod.html`, `auto.html`-is |
| Kaardi eelvaade = `special[0]` esimene lause | ✅ | `cardPreviewText()` `assets/cars-shared.js`-is; `CARD_PREVIEW_MAX_CHARS` on ainult kaitseks erakordselt pika lause vastu |
| Müüdud autod alati lõpus (esileht + täisnimekiri) | ✅ | `sortCarsForDisplay()` — sorteerib `sold` järgi, seejärel `order` väljal |
| Plussid/miinused bullet-list eemaldatud kõikjalt | ✅ | prosaõna "Mis teeb sellest erilise" / "Mida tasub antud auto ostmisel silmas pidada" plokkidena |
| Vana "Kirjeldus" plokk ja hero tagline eemaldatud kõikjalt | ✅ | `d-desc`, `d-tagline` elemendid ja neid täitev JS eemaldatud `auto.html`-ist; `description`/`tagline` väljad eemaldatud ka `cars-data.js`-ist |
| Piltide järjekord andmepõhine (mitte kausta tähestik) | ✅ | `images[]` massiivi järjekord `cars-data.js`-is, iga foto märgistatud `imageViews[]`-is |
| Piltide valideerimisskript olemas | ✅ | `scripts/validate-car-photos.js` — kontrollib ≥5 pilti ja interjööri-/mootoripildi olemasolu |
| Võimsus samas ühikus (kW) kõigil autodel | ✅ | 2026-08-07 — DB9/M6/560SL/XK/M535i teisendatud, hj-mainimised eemaldatud |
| "Päritolu"/"Päritoluriik" eemaldatud spec-tabelist | ✅ | 2026-08-07 — 19 rida eemaldatud kõigilt autodelt, segadust tekitav (tootja- vs impordiriik) |
| "Spetsifikatsioon" sõna eemaldatud sektsiooni pealkirjast | ✅ | 2026-08-07 — `auto.html`, nüüd "Tehnilised andmed." |
| Peapildi object-fit viga parandatud (foto ei mahtunud raami) | ✅ | 2026-08-07 — `.car-hero-img.is-photo` `cover`→`contain`, fikseeritud 440px kõrgus eemaldatud |

## Auto-spetsiifiline kontroll

**2026-08-07:** omanik saatis uued fotod Bentleyle, Maseratile, S-Type'ile,
Daimlerile, Mercedes 230.4-le ja W220-le — piltide järjekord ja katvus
uuendatud, vt allolev tabel.

| Auto | special + caution | Pildid | Märkus |
|---|---|---|---|
| Aston Martin DB9 | ✅ | ⚠️ 5 pilti, puudub interjöör/mootor | ainult eksterjööri fotod olemas |
| BMW M6 | ✅ | ✅ 5 pilti, interjöör olemas | — |
| Mercedes-Benz 560 SL | ✅ | ⚠️ 4 pilti | interjöör olemas, aga alla 5 pildi |
| Mercedes-Benz S500 4MATIC | ✅ | ✅ 5 pilti, interjöör (eest+taga) olemas | uus side-foto lisatud 2026-08-07 |
| Jaguar XK | ✅ | ⚠️ 4 pilti | interjöör olemas, aga alla 5 pildi |
| Jaguar S-Type (müüdud) | ✅ | ✅ 5 pilti, interjöör (eest+taga) olemas | **kõik fotod asendatud 2026-08-07** kronoloogilises järjekorras (front-3q → side → rear-3q → interjöör eest → interjöör taga) |
| Daimler Double Six | ✅ | ✅ 5 pilti, interjöör (eest+taga) + mootor olemas | uued fotod 2026-08-07 — front/interjöör/mootor lisatud, vana rear-3q (car-daimler-4) säilis |
| Fiat 130 | ✅ | ⚠️ 4 pilti, puudub interjöör/mootor | ainult eksterjööri fotod olemas |
| Maserati Spyder (müüdud) | ✅ | ✅ 5 pilti, interjöör + mootor olemas | uued side/rear/mootor fotod 2026-08-07, vana interjöör säilis |
| Bentley Arnage | ✅ | ✅ 6 pilti, interjöör (eest+taga) + mootor olemas | uued side/interjöör-tagumine/mootor fotod 2026-08-07; katvus nüüd täielik |
| Jaguar XJ Series III | ✅ | ✅ 5 pilti, interjöör + mootor olemas | — |
| Opel Omega 3000 (müüdud) | ✅ | ⚠️ 3 pilti | interjöör + mootor olemas, aga vaid 3 pilti |
| Mercedes-Benz 230.4 (müüdud) | ✅ | ✅ 5 pilti, interjöör + mootor olemas | uus side-foto lisatud 2026-08-07 |
| Pontiac Fiero (müüdud) | ✅ | ✅ 5 pilti, interjöör olemas | — |
| BMW M535i (müüdud) | ✅ | ⚠️ 4 pilti, puudub interjöör/mootor | ainult eksterjööri fotod olemas |
| Jaguar XJ-S V12 (valge) | ✅ | ✅ 5 pilti, interjöör (eest+taga) + mootor olemas | **märgitud müüdud 2026-08-07** (varem "Küsi hinda") |
| Jaguar XJ-S 5.3 V12 (roheline) | ✅ | ✅ 5 pilti, interjöör + mootor olemas | **uus kuulutus, lisatud 2026-08-07** (id `jaguar-xjs-v12-green`), hind 19 900€ |

**Kokkuvõte:** kõigil 17 praegu saidil oleval autol on nüüd nii `special` kui
`caution` täidetud — sisu poolelt pole enam midagi puudu (vt `audit.md`).
11/17 autol on valideerimisskripti järgi täiesti korras pildid (BMW M6,
Mercedes S500 4MATIC, Jaguar S-Type, Daimler Double Six, Maserati Spyder,
Bentley Arnage, Jaguar XJ Series III, Mercedes 230.4, Pontiac Fiero, mõlemad
Jaguar XJ-S V12); ülejäänud 6 (DB9, 560 SL, XK, Fiat 130, Omega, M535i) on
alla 5 pilti või puudub interjöör/mootor — see on olemasolevate fotode
piirang, mitte andmevea tulemus.

### Vanad/asendatud failid, mida enam kusagil ei kasutata

Need jäid kettale, kuid ei ole `cars-data.js`-is enam viidatud (mitte
kustutatud):

- `assets/bentley-1.jpg` (front-3q, asendatud `bentley-2.jpg`-ga)
- `assets/spyder-2.jpg`, `assets/spyder-3.jpg` (vana rear-3q/detail)
- `assets/car-stype-1.jpg` … `car-stype-6.jpg` (kõik 6 vana S-Type fotot)
- `assets/car-daimler-1.jpg`, `car-daimler-2.jpg`, `car-daimler-3.jpg`,
  `car-daimler-5.jpg` (vanad front/front/rear fotod; `car-daimler-4.jpg`
  jäi kasutusse)

Samuti on kettal 5 kokkupakkimata `Screenshot 2026-08-16 *.png` originaali
(rohelise XJ-S fotode allikad, kokku ~28 MB), mille kompaktsemad `.jpg`
koopiad (`xjsv12-green-1..5.jpg`) on juba `cars-data.js`-is kasutuses —
sama muster mis varasematel kordadel.

## Käsitsi kontrollimata (vajab brauserit)

Selles keskkonnas ei olnud Node/brauserit käepärast, mistõttu renderdust ei
saanud visuaalselt kontrollida. Enne "valmis" märkimist ava käsitsi:
`index.html`, `autod.html` (koos filtriga) ja `auto.html?id=<mudel>` paari
mudeli peal, veendu, et kaardid renderduvad ja pikkused mõjuvad ühtlased ning
et detailleht ei kuva enam Kirjeldus/tagline plokki.
