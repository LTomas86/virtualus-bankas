# React + Node.js (Express) Virtual Bank

This project is a complete example of how to build a secure banking-style system using React (frontend) and Node.js/Express (backend) with a MongoDB database.

## Features

✅ User registration and login  
✅ JWT authentication  
✅ Account creation, deposit/withdraw funds, delete accounts  
✅ Photo upload (e.g. passport copies)  
✅ Cookies usage (sessions, CSRF protection)  
✅ CSRF protection (with `csurf` middleware)  
✅ CORS protection (only from a specified origin)  
✅ Secure password storage (bcrypt)

---

## Getting Started

### 1. Backend (server)

1. Go to the `server` folder:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the server:
    ```bash
    npm run dev
    ```
    The server will run at **http://localhost:3000**

---

### 2. Frontend (client)

1. Go to the `client` folder:
    ```bash
    cd ../client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the React application:
    ```bash
    npm run dev
    ```
    The app will be available at **http://localhost:5173**

---

## Security Features

🔒 **CSRF protection:**  
Before POST/PUT/DELETE requests, the frontend obtains a CSRF token from `/api/csrf-token` and sends it in the `X-CSRF-Token` header.

🔒 **Cookies:**  
Uses `cookie-parser` with HttpOnly, Secure, and SameSite attributes.

🔒 **CORS:**  
Allowed only from http://localhost:5173 (or your specified address).

🔒 **Passwords:**  
All passwords are securely stored using bcrypt hashing.

---

## Project Structure
frontend-backend/

├── client/ # React (Vite) frontend

└── server/ # Node.js/Express backend





## Usage

1. Register via `/register`
2. Log in via `/login`
3. Create accounts, deposit/withdraw funds, delete accounts
4. Test cookies and CSRF via `/cookie-test`

---

## Notes

- Ensure the backend server is running before using the frontend.
- If you want to use another frontend address, update the CORS settings on the server.
- MongoDB must be running locally or in the cloud (update the connection string as needed).

---

### 🚀 Ready to build your Virtual Bank.



