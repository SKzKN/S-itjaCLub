# Sisu audit — "Mis teeb sellest erilise" / "Mida tasub antud auto ostmisel silmas pidada"

Seisuga see fail kajastab `assets/cars-data.js` sisu. Ei ühtegi kirjeldust ei ole
siia juurde genereeritud — kõik allolev on olemasolev omaniku tekst või selle
puudumise märge.

**2026-08-05 muudatus (suurem):** omanik otsustas, et kuulutustes kasutatakse
**AINULT** `special` ("Mis teeb sellest erilise") ja `caution` ("Mida tasub
antud auto ostmisel silmas pidada") teksti — kõik varasem sisu (vana
"Kirjeldus" plokk / `description`, hero alapealkiri / `tagline`, ja kõik AI
poolt varem lisatud tekst) on eemaldatud, nii andmestikust kui renderdusest.
Esilehe ja täisnimekirja kaardi eelvaade on nüüd **`special[0]` esimene lause**
(vt `assets/cars-shared.js`, `cardPreviewText()`), mitte enam eraldi
lühikirjeldus.

Samas sõnumis sai enamik autosid täieliku `special` + `caution` teksti otse
omanikult — vt tabel allpool.

## Staatus tabel

| Auto | `special` | `caution` | Märkus |
|---|---|---|---|
| Aston Martin DB9 | ✅ | ✅ | uuendatud 2026-08-05 (esimene lause eemaldatud) |
| BMW M6 | ✅ | ✅ | uuendatud 2026-08-05 |
| Mercedes-Benz 560 SL | ✅ | ✅ | uuendatud 2026-08-05 (uus tekst, asendas pika ajaloolise kirjelduse) |
| Mercedes-Benz S500 4MATIC | ✅ | ✅ | kinnitatud muutumatuna 2026-08-05 |
| Jaguar XK | ✅ | ✅ | uuendatud 2026-08-05 |
| Jaguar S-Type (müüdud) | ✅ | ✅ | uuendatud 2026-08-05 |
| Daimler Double Six | ✅ | ✅ | uuendatud 2026-08-05 |
| Fiat 130 | ✅ | ✅ | uuendatud 2026-08-05 |
| Maserati Spyder (müüdud) | ✅ | ✅ | uuendatud 2026-08-05 |
| Bentley Arnage | ✅ | ✅ | **lahendatud** — omanik saatis 2026-08-05 õige teksti, vana vale `description` pole enam kusagil kasutuses |
| Jaguar XJ Series III | ✅ | ✅ | uuendatud 2026-08-05 (caution sai lisalause, special parandatud käändeviga "kaunile") |
| Opel Omega 3000 (müüdud) | ✅ | ✅ | uuendatud 2026-08-05 |
| Mercedes-Benz 230.4 (müüdud) | ✅ | ✅ | uuendatud 2026-08-05 |
| Pontiac Fiero (müüdud) | ✅ | ✅ | uuendatud 2026-08-05 |
| BMW M535i (müüdud) | ✅ | ✅ | uuendatud 2026-08-05 |
| Jaguar XJ-S V12 (valge) | ✅ | ✅ | uuendatud 2026-08-05 (vana `description` tõsteti `special`-isse) |

**16/16 praegu andmestikus oleval autol on mõlemad plokid täidetud.**

## Pooleli: Jaguar XJ-S V12 (roheline / British Racing Green)

Omanik saatis 2026-08-05 täieliku `special`/`caution` teksti teisele XJ-S V12-le
(roheline, valge BRG värv, valge nahkinterjöör asemel):

> **+** Stiilne V12 mootoriga Briti GT-auto koos vääriliste sõiduomadustega.
> British Racing Green ja valge nahkinterjöör loovad suurepärase koosluse. V12
> mootor ja mugav vedrustus on meeldivaks kaaslaseks igal road tripil.
>
> **−** V12 mootoriga kaasnevad alati keskmisest suuremad kulud. Seisukorda
> iseloomustab hästi "sõidan, naudin, kasutan" stiil ja sobib hästi omanikule,
> kes on valmis autosse hoolt ja armastust investeerima.

**Ei ole veel lisatud `cars-data.js`-i**, kuna ei saadetud ühtegi fotot selle
konkreetse (rohelise) auto kohta — sait ei saa kuvada kaarti/detaillehte ilma
vähemalt ühe pildita. Niipea kui fotod saabuvad, lisa uus kirje (nt id
`jaguar-xjs-v12-green`) samamoodi nagu valge XJ-S V12 lisati.
