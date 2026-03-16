# 🛡️ Internet Safety Scanner (MERN)

A modern, full-stack cybersecurity application built to intelligently analyze URLs and identify potential threats, malicious IPs, and phishing attempts before they can do harm.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Features

- **Heuristic Threat Detection:** Evaluates URLs against common phishing vectors (Homoglyphs, masked IPs, suspicious keywords).
- **JWT Authentication:** Secure user registration and login ensuring personalized data isolation.
- **Glassmorphism UI:** A stunning, highly responsive frontend styling system natively built with CSS variables.
- **Interactive Analytics:** Visualizes your scanning history through dynamically scaling Recharts `BarChart` integrations.
- **Light & Dark Theming:** Instant layout transitions managed via React Context mapping.
- **History Dashboard:** A dedicated log archiving every URL you've investigated alongside its safety rating.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance running on `mongodb://127.0.0.1:27017`)

### 1. Clone & Install Dependencies
First, install the backend server environment:
```bash
cd backend
npm install
```

Next, open a new terminal and install the frontend client environment:
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/internet_safety_scanner
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Run the Application
**Start the Backend Server (Term 1):**
```bash
cd backend
npm start
# Server running on port 5000
# MongoDB connected
```

**Start the React Vite Client (Term 2):**
```bash
cd frontend
npm run dev
# App running at http://localhost:5173/
```

---

## 🧠 How the Scanner Works (Heuristics)

The internal `checkUrlSafety()` engine in `scanController.js` evaluates incoming requests across 5 main vectors. It starts at a `0` risk score and penalizes the URL cumulatively:

1. **Insecure Protocol (+30 Risk):** Is the URL serving content over `http://` instead of `https://`?
2. **IP Masking (+40 Risk):** Does the hostname rely entirely on a raw IPv4 layout instead of a standard domain format?
3. **Keyword Bait (+25 Risk):** Does the URL contain dictionary strings frequently used to trick users (e.g., `login`, `verify`, `banking`, `secure`, `update`)?
4. **Length and Complexity (+15 Risk):** Is the URL exceptionally long (>75 chars) or bloated with excess subdomains (>3)?
5. **Look-Alike Domains (+50 Risk):** *Crucial for Phishing*. The algorithm checks against a dictionary of popular brands (Google, Amazon, etc.) and analyzes character substitution (like replacing `o` with `0` or `l` with `1`), immediately flagging high-priority impersonation attacks.

---

## 📡 API Reference

All protected API endpoints require an `Authorization: Bearer <token>` header supplied after `/api/auth/login`.

### Authentication
*   `POST /api/auth/register` - Creates a new user account.
    *   *Body:* `{ email, password }`
*   `POST /api/auth/login` - Authenticates a user and returns a JWT.
    *   *Body:* `{ email, password }`

### Scanner Operations (Protected)
*   `POST /api/scan` - Submits a URL to the heuristics engine.
    *   *Body:* `{ url }`
*   `GET /api/history` - Returns an array of isolated past scan records linked to the JWT context.
*   `GET /api/analytics` - Aggregates the user's scan counts mapped to Safe/Warning/Danger thresholds.
