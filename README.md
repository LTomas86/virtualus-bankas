# React + Node.js (Express) Virtual Bank

Šis projektas – tai pilnas pavyzdys, kaip sukurti saugią banko tipo sistemą naudojant React (frontend) ir Node.js/Express (backend) su MongoDB duomenų baze.

## Funkcionalumas
- Vartotojų registracija ir prisijungimas
- JWT autentifikacija
- Sąskaitų kūrimas, lėšų pridėjimas/nuskaičiavimas, trynimas
- Nuotraukų (paso kopijų) įkėlimas
- Cookies naudojimas (pvz., sesijoms, CSRF)
- CSRF apsauga (su csurf middleware)
- CORS apsauga (tik iš nurodyto origin)
- Slaptažodžių saugus saugojimas (bcrypt)

## Paleidimas

### 1. Backend (server)
1. Eikite į `server` aplanką:
   ```powershell
   cd server
   ```
2. Įdiekite priklausomybes:
   ```powershell
   npm install
   ```
3. Paleiskite serverį:
   ```powershell
   npm run dev
   ```
   Serveris veiks per http://localhost:3000

### 2. Frontend (client)
1. Eikite į `client` aplanką:
   ```powershell
   cd ../client
   ```
2. Įdiekite priklausomybes:
   ```powershell
   npm install
   ```
3. Paleiskite React aplikaciją:
   ```powershell
   npm run dev
   ```
   Aplikacija bus pasiekiama per http://localhost:5173

## Saugumo ypatybės
- **CSRF apsauga:** Prieš POST/PUT/DELETE užklausas frontend gauna CSRF tokeną iš `/api/csrf-token` ir siunčia jį antraštėje `X-CSRF-Token`.
- **Cookies:** Naudojamas `cookie-parser` ir cookies su HttpOnly, Secure, SameSite atributais.
- **CORS:** Tik iš http://localhost:5173 (arba nurodyto adreso).
- **Slaptažodžiai:** Visi slaptažodžiai saugomi su bcrypt hash.

## Struktūra
```
frontend-backend/
├── client/      # React (Vite) frontend
└── server/      # Node.js/Express backend
```

## Naudojimas
- Registruokitės per /register
- Prisijunkite per /login
- Kurkite sąskaitas, pridėkite/nuskaičiuokite lėšas, trinkite sąskaitas
- Testuokite cookies ir CSRF per /cookie-test

## Pastabos
- Prieš naudojant frontend, įsitikinkite, kad backend serveris veikia.
- Jei norite naudoti kitą frontend adresą, pakeiskite CORS nustatymus serveryje.
- MongoDB turi veikti lokaliai arba debesyje (keiskite connection string pagal poreikį).

---
Sukūrė: GitHub Copilot
2025-06-10
