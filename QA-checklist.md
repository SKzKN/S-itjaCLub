# QA checklist — autode andmemudel (T3–T8)

Genereeritud pärast T3–T7 muudatusi. Kontrolli see nimekiri läbi enne, kui
loed sisu "valmis"-staatusesse. Andmeallikas: `assets/cars-data.js`. Käivita
`node scripts/validate-car-photos.js` piltide kontrolli kordamiseks.

## Süsteemsed kontrollid (kehtivad kõigile autodele korraga)

| Kontroll | Staatus | Märkus |
|---|---|---|
| Kaardid (esileht + täisnimekiri) tulevad ühest andmeallikast | ✅ | `assets/cars-data.js` + `assets/cars-shared.js`, laetud `index.html`, `autod.html`, `auto.html`-is |
| Kaardi eelvaate pikkus konfigureeritav, mitte käsitsi | ✅ | `CARD_PREVIEW_MAX_PARAGRAPHS` / `CARD_PREVIEW_MAX_CHARS` `assets/cars-shared.js`-is |
| Müüdud autod alati lõpus (esileht + täisnimekiri) | ✅ | `sortCarsForDisplay()` — sorteerib `sold` järgi, seejärel `order` väljal; uus müüdud auto ei vaja käsitsi järjestamist |
| Plussid/miinused bullet-list eemaldatud kõikjalt | ✅ | vt eelnev migratsioon → "Mis teeb sellest erilise" / "Mida tasub antud auto ostmisel silmas pidada" |
| Piltide järjekord andmepõhine (mitte kausta tähestik) | ✅ | `images[]` massiivi järjekord `cars-data.js`-is, iga foto märgistatud `imageViews[]`-is |
| Piltide valideerimisskript olemas | ✅ | `scripts/validate-car-photos.js` — kontrollib ≥5 pilti ja interjööri-/mootoripildi olemasolu |

## Auto-spetsiifiline kontroll

Lühendid: **3 plokki** = Kirjeldus + Mis teeb erilise + Mida silmas pidada kõik täidetud. **Pildid** = valideerimisskripti tulemus (OK / hoiatus, vt põhjus). **AI-tekst** = kaardil ei kuvata enam eraldi käsitsi kirjutatud "hook" teksti, ainult tõesta description'ist tuletatud eelvaade.

| Auto | 3 plokki | Pildid | AI-tekst kaardil | Märkus |
|---|---|---|---|---|
| Aston Martin DB9 | ✅ | ⚠️ 5 pilti, puudub interjöör/mootor | ✅ eemaldatud | ainult eksterjööri fotod olemas |
| BMW M6 | ❌ vajab special/caution | ✅ 5 pilti, interjöör olemas | ✅ eemaldatud | — |
| Mercedes-Benz 560 SL | ❌ vajab special/caution | ⚠️ 4 pilti | ✅ eemaldatud | interjöör olemas, aga alla 5 pildi |
| Mercedes-Benz S500 4MATIC | ✅ | ⚠️ 4 pilti | ✅ eemaldatud | interjöör (eest+taga) olemas, aga alla 5 pildi |
| Jaguar XK | ❌ vajab special/caution | ⚠️ 4 pilti | ✅ eemaldatud | interjöör olemas, aga alla 5 pildi |
| Jaguar S-Type (müüdud) | ❌ vajab special/caution | ✅ 6 pilti, interjöör olemas | ✅ eemaldatud | — |
| Daimler Double Six | ❌ vajab special/caution | ⚠️ 5 pilti, puudub interjöör/mootor | ✅ eemaldatud | ainult eksterjööri fotod olemas |
| Fiat 130 | ❌ vajab special/caution | ⚠️ 4 pilti, puudub interjöör/mootor | ✅ eemaldatud | ainult eksterjööri fotod olemas |
| Maserati Spyder (müüdud) | ❌ vajab special/caution | ⚠️ 4 pilti | ✅ eemaldatud | interjöör olemas, aga alla 5 pildi |
| **Bentley Arnage** | ❌ vajab special/caution | ⚠️ 4 pilti | ✅ eemaldatud | **description omaniku hinnangul vale, vt audit.md** — võib kuni 7 pilti lisada hiljem |
| Jaguar XJ Series III | ✅ | ✅ 5 pilti, interjöör + mootor olemas | ✅ eemaldatud | uuendatud: uus description/special/caution, Läbisõit 146 000 km, Mudeliaasta 1986; 2 uut fotot lisatud, FENESTRA sildiga side-pilt eemaldatud |
| Opel Omega 3000 (müüdud) | ❌ vajab special/caution | ⚠️ 3 pilti | ✅ eemaldatud | interjöör + mootor olemas, aga vaid 3 pilti |
| Mercedes-Benz 230.4 (müüdud) | ❌ vajab special/caution | ⚠️ 4 pilti | ✅ eemaldatud | interjöör + mootor olemas, aga alla 5 pildi |
| Pontiac Fiero (müüdud) | ❌ vajab special/caution | ✅ 5 pilti, interjöör olemas | ✅ eemaldatud | — |
| BMW M535i (müüdud) | ❌ vajab special/caution | ⚠️ 4 pilti, puudub interjöör/mootor | ✅ eemaldatud | ainult eksterjööri fotod olemas |
| Jaguar XJ-S V12 | ❌ vajab special (caution olemas) | ✅ 5 pilti, interjöör (eest+taga) + mootor olemas | ✅ eemaldatud | **uus kuulutus** — hind puudub (`Küsi hinda`), vt märkus allpool |

**Kokkuvõte:** 3/16 autol on kõik 3 sisuplokki (DB9, S500 4MATIC, Jaguar XJ
Series III — vt `audit.md` ülejäänud kohta). 5/16 autol on valideerimisskripti
järgi täiesti korras pildid (BMW M6, Jaguar S-Type, Pontiac Fiero, Jaguar XJ
Series III, Jaguar XJ-S V12); ülejäänutel on kas alla 5 pildi või puudub
interjööri-/mootoripilt — see on olemasolevate fotode piirang, mitte
andmevea tulemus (rohkem fotosid ei saa ilma omanikult juurde küsimata lisada).

### Uus kuulutus: Jaguar XJ-S V12

Lisatud sinu antud 5 foto ja teksti põhjal (description + caution). Ei
hinda ega `special` teksti ei antud — `price` on hetkel `'Küsi hinda'` ja
`special` on jäetud täitmata (vt `audit.md`). Auto ei ole `featured` (ei
kuva esilehel), kuna seda ei palutud — ilmub `autod.html` täisnimekirja
"Grand Tourer" kategoorias, sordituna `order: 16` järgi (viimane
saadaolevatest, kuna kõigil teistel autodel on väiksem `order`).

## Väljaspool algset T3 skoopi, aga parandatud järjepidevuse huvides

- `auto.html` "Seotud autod" (3 kaardi) plokk kasutas samuti käsitsi kirjutatud
  `tagline` teksti — muudetud kasutama sama `cardPreviewText()` loogikat, et
  kõik "kaardi" kujul elemendid järgiksid ühtset reeglit.
- `tagline` väli on endiselt kasutuses `auto.html` detaillehe hero-alapealkirjas
  (`d-tagline`) — see ei ole "kaart" T3 tähenduses, jäetud muutmata.

## Käsitsi kontrollimata (vajab brauserit)

Selles keskkonnas ei olnud Node/brauserit käepärast, mistõttu renderdust ei
saanud visuaalselt kontrollida. Enne "valmis" märkimist ava käsitsi:
`index.html`, `autod.html` (koos filtriga) ja `auto.html?id=<mudel>` paari
mudeli peal, veendu, et kaardid renderduvad ja pikkused mõjuvad ühtlased.
