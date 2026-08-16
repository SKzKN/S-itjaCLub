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
| Jaguar XJ-S V12 (valge) | ✅ | ✅ | uuendatud 2026-08-05 (vana `description` tõsteti `special`-isse); **märgitud müüdud auto 2026-08-07** |
| Jaguar XJ-S 5.3 V12 (roheline) | ✅ | ✅ | **lisatud 2026-08-07** (id `jaguar-xjs-v12-green`), tekst omanikult samal kuupäeval |

**17/17 praegu andmestikus oleval autol on mõlemad plokid täidetud.**

## 2026-08-07 — andmete koristus

Omanik palus ühtlustada ja koristada spec-tabeleid üle kõigi autode:

- **Võimsuse ühik ühtlustatud kW-le** kõikjal (DB9, BMW M6, Mercedes 560 SL,
  Jaguar XK, BMW M535i) — varem osa kW, osa hj esikohal.
- **"Päritoluriik"/"Päritolu" rida eemaldatud** kõikide autode `specs`/
  `heroSpecs` alt (19 rida) — segadust tekitav, kuna näitas vahel tootjariiki,
  vahel riiki, kust auto toodi (nt DB9 puhul USA, kuigi auto ise Inglise).
- **"Spetsifikatsioon" sõna eemaldatud** `auto.html` sektsiooni pealkirjast
  (nüüd "Tehnilised andmed.").
- **Bentley Arnage**: "Limuusin"/"Täislimuusin" (`Tüüp` rida specs+heroSpecs
  alt, ja hero subtitle) eemaldatud/asendatud — Arnage on sedaan, mitte
  limusiin.
- **Daimler Double Six**: "Turule: 1993" asendatud "Mudeliaasta: 1994"-ga.
- **Jaguar XJ Series III**: "Tootmine: Kuni 1992" rida eemaldatud.
- **Pontiac Fiero**: mootor on ikka R4, "Pontiac R4 või V6" → "Pontiac R4",
  heroSpecs "Valik: V6 / R4" → "Valik: R4".
- **Foto raamistuse viga parandatud**: `auto.html` peapildi `.is-photo`
  klass sundis 440px kõrgust + `object-fit: cover`, mis lõikas osa fotost
  ära (nt W220 2. ja 3. pilt, Bentley). Nüüd `object-fit: contain` — kogu
  foto alati näha, kõrgus paindlik.
