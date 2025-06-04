# React + Vite Frontend

Šis projektas yra React aplikacija, sukurta naudojant Vite. Ji skirta jungtis prie Node.js backend API (http://localhost:3000/api/users) vartotojų registracijai ir duomenų atvaizdavimui.

## Paleidimas

1. Įdiekite priklausomybes:
   ```powershell
   npm install
   ```
2. Paleiskite aplikaciją:
   ```powershell
   npm run dev
   ```

Aplikacija bus pasiekiama per naršyklę adresu, kurį nurodys terminalas (pvz., http://localhost:5173).

## API naudojimas
- POST /api/users – naujo vartotojo registracija
- GET /api/users – vartotojų sąrašo gavimas (jei backend palaiko)

## Pastabos
- Prieš naudojant frontend, įsitikinkite, kad backend serveris veikia.
- Jei jungiatės iš kito kompiuterio ar per tinklą, gali reikėti pakeisti API adresą.
