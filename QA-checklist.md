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

## Auto-spetsiifiline kontroll

| Auto | special + caution | Pildid | Märkus |
|---|---|---|---|
| Aston Martin DB9 | ✅ | ⚠️ 5 pilti, puudub interjöör/mootor | ainult eksterjööri fotod olemas |
| BMW M6 | ✅ | ✅ 5 pilti, interjöör olemas | — |
| Mercedes-Benz 560 SL | ✅ | ⚠️ 4 pilti | interjöör olemas, aga alla 5 pildi |
| Mercedes-Benz S500 4MATIC | ✅ | ⚠️ 4 pilti | interjöör (eest+taga) olemas, aga alla 5 pildi |
| Jaguar XK | ✅ | ⚠️ 4 pilti | interjöör olemas, aga alla 5 pildi |
| Jaguar S-Type (müüdud) | ✅ | ✅ 6 pilti, interjöör olemas | — |
| Daimler Double Six | ✅ | ⚠️ 5 pilti, puudub interjöör/mootor | ainult eksterjööri fotod olemas |
| Fiat 130 | ✅ | ⚠️ 4 pilti, puudub interjöör/mootor | ainult eksterjööri fotod olemas |
| Maserati Spyder (müüdud) | ✅ | ⚠️ 4 pilti | interjöör olemas, aga alla 5 pildi |
| Bentley Arnage | ✅ | ⚠️ 4 pilti | **vana vale sisu lahendatud** — võib kuni 7 pilti lisada hiljem |
| Jaguar XJ Series III | ✅ | ✅ 5 pilti, interjöör + mootor olemas | — |
| Opel Omega 3000 (müüdud) | ✅ | ⚠️ 3 pilti | interjöör + mootor olemas, aga vaid 3 pilti |
| Mercedes-Benz 230.4 (müüdud) | ✅ | ⚠️ 4 pilti | interjöör + mootor olemas, aga alla 5 pildi |
| Pontiac Fiero (müüdud) | ✅ | ✅ 5 pilti, interjöör olemas | — |
| BMW M535i (müüdud) | ✅ | ⚠️ 4 pilti, puudub interjöör/mootor | ainult eksterjööri fotod olemas |
| Jaguar XJ-S V12 (valge) | ✅ | ✅ 5 pilti, interjöör (eest+taga) + mootor olemas | hind puudub (`Küsi hinda`) |
| Jaguar XJ-S V12 (roheline) | ⚠️ tekst olemas, **auto pole veel lisatud** | ❌ pole fotosid | vt `audit.md` "Pooleli" — vajab vähemalt 1 fotot enne lisamist |

**Kokkuvõte:** kõigil 16 praegu saidil oleval autol on nüüd nii `special` kui
`caution` täidetud — sisu poolelt pole enam midagi puudu (vt `audit.md`).
5/16 autol on valideerimisskripti järgi täiesti korras pildid (BMW M6,
Jaguar S-Type, Pontiac Fiero, Jaguar XJ Series III, Jaguar XJ-S V12);
ülejäänutel on kas alla 5 pildi või puudub interjööri-/mootoripilt — see on
olemasolevate fotode piirang, mitte andmevea tulemus. Roheline XJ-S V12
seisab pooleli, kuna selle kohta pole ühtegi fotot saadetud.

## Käsitsi kontrollimata (vajab brauserit)

Selles keskkonnas ei olnud Node/brauserit käepärast, mistõttu renderdust ei
saanud visuaalselt kontrollida. Enne "valmis" märkimist ava käsitsi:
`index.html`, `autod.html` (koos filtriga) ja `auto.html?id=<mudel>` paari
mudeli peal, veendu, et kaardid renderduvad ja pikkused mõjuvad ühtlased ning
et detailleht ei kuva enam Kirjeldus/tagline plokki.
