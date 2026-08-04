# Sisu audit — "Mis teeb sellest erilise" / "Mida tasub antud auto ostmisel silmas pidada"

Seisuga see fail kajastab `assets/cars-data.js` sisu. Ei ühtegi kirjeldust ei ole
siia juurde genereeritud — kõik allolev on olemasolev omaniku tekst või selle
puudumise märge. Kui `special` / `caution` on tühjad, jäetakse vastav sektsioon
auto.html detaillehel peidetuks (vt `d-special-section` / `d-caution-section`),
ei kuvata AI-täidetud asendustekstina.

## Staatus tabel

| Auto | `special` ("Mis teeb sellest erilise") | `caution` ("Mida tasub ... silmas pidada") | Märkus |
|---|---|---|---|
| Aston Martin DB9 | ✅ olemas | ✅ olemas | — |
| BMW M6 | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Mercedes-Benz 560 SL | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Mercedes-Benz S500 4MATIC | ✅ olemas | ✅ olemas | — |
| Jaguar XK | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Jaguar S-Type (müüdud) | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Daimler Double Six | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Fiat 130 | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Maserati Spyder (müüdud) | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| **Bentley Arnage** | ❌ puudub | ❌ puudub | **PRIORITEET — vt allpool, olemasolev `description` on omaniku hinnangul täiesti vale** |
| Jaguar XJ Series III | ✅ olemas | ✅ olemas | uuendatud — omanik saatis uue kirjelduse + plokid otse |
| Opel Omega 3000 (müüdud) | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Mercedes-Benz 230.4 (müüdud) | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Pontiac Fiero (müüdud) | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| BMW M535i (müüdud) | ❌ puudub | ❌ puudub | vajab omaniku teksti |
| Jaguar XJ-S V12 | ❌ puudub | ✅ olemas | uus kuulutus — omanik andis kirjelduse + "mida silmas pidada" teksti, "Mis teeb erilise" pole veel antud |

**11 / 16 autol puudub `special` tekst, 12 / 16 puudub `caution` tekst.**
DB9, S500 4MATIC ja Jaguar XJ Series III on ainsad, kel mõlemad plokid täidetud.

## Prioriteet: Bentley Arnage

Omanik märkis, et Bentley Arnage praegune `description` (Kirjeldus-plokk) on
**täiesti vale** — sisu tuleb üle kirjutada, mitte ainult `special`/`caution`
juurde lisada. Praegune tekst (`assets/cars-data.js`, `bentley-arnage.description`):

> "Bentley Arnage on üks väheseid autosid maailmas, kus iga detail tunneb end
> nagu käsitsivalmistatud — sest ta ongi. Crewe tehases toodetud Arnage on
> varustatud BMW ja Cosworths koostöös loodud V8 mootoriga [...]"

See tekst on jäetud muutmata (vastavalt juhisele "Ära genereeri ise ühtegi
kirjeldust juurde"), kuid on siia märgitud puuduolevaks/valeks — vajab
omanikult uut `description` + `special` + `caution` teksti. Kuni uus tekst
saabub, ei tohiks Bentley Arnage't kasutada näidiseksemplarina teiste autode
sisu stiili osas.

## Järgmised sammud

1. Küsi omanikult kirjalik sisu (description / special / caution) iga autot
   kohta, mis on ülal märgitud puuduvaks — alusta Bentley Arnage'ist.
2. Kui tekst saabub, lisa see `assets/cars-data.js` vastava auto `special` /
   `caution` väljale (vt Aston Martin DB9 ja S500 4MATIC struktuuri näiteks).
3. Uuenda see fail (audit.md) pärast igat lisatud teksti — eemalda rida
   nimekirjast või märgi ✅.
