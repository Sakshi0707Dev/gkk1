# Gawande Krushi Kendra — Backend Setup Guide

---

## 1. Project Structure

```
backend/
├── server.js                  # Entry point
├── app.js                     # Express app (middleware, routes, error handler)
├── package.json
├── .env.example
├── .gitignore
│
├── config/
│   ├── db.js                  # MongoDB connection
│   └── env.js                 # Validated env variables
│
├── controllers/
│   └── auth.controller.js     # All route handler logic
│
├── middleware/
│   ├── auth.middleware.js      # protect + restrictTo
│   └── error.middleware.js    # Centralised error handler
│
├── models/
│   └── user.model.js          # Mongoose User schema
│
├── routes/
│   └── auth.routes.js         # Route definitions + rate limits
│
├── services/
│   ├── email.service.js       # Nodemailer (Gmail SMTP)
│   ├── otp.service.js         # Twilio SMS (or console mock)
│   └── google.service.js      # Google ID token verification
│
├── utils/
│   ├── asyncHandler.js        # asyncHandler + AppError
│   ├── jwt.utils.js           # Token sign/verify/cookie helpers
│   └── crypto.utils.js        # Reset token + OTP generators
│
└── validators/
    └── auth.validators.js     # express-validator chains
```

---

## 2. Quick Start

### Step 1 — Place the backend folder

Put the `backend/` folder **at the root of your project**, next to your frontend `src/` folder:

```
gkk/
├── backend/          ← new backend
├── src/              ← your existing React frontend
├── package.json      ← frontend package.json
└── ...
```

### Step 2 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 3 — Create your .env file

```bash
cp .env.example .env
```

Open `.env` and fill in every value (see sections below for each service).

### Step 4 — Generate secure JWT secrets

Run this command **twice** (once for ACCESS, once for REFRESH):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Paste the outputs into `.env`:
```
JWT_ACCESS_SECRET=<first output>
JWT_REFRESH_SECRET=<second output>
```

### Step 5 — Start the backend

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

You should see:
```
✅  MongoDB connected: 127.0.0.1
✅  Server running in development mode on port 5000
```

---

## 3. Frontend Integration Change

Your `Header.jsx` and `LoginModal.jsx` use `http://localhost:5000/api` already. The **only change** needed is updating the API endpoints to match the new routes:

### Old routes (your current server.js) → New routes

| Action          | Old                   | New                         |
|-----------------|-----------------------|-----------------------------|
| Register        | `POST /api/register`  | `POST /api/auth/register`   |
| Login           | `POST /api/login`     | `POST /api/auth/login`      |
| Logout          | `POST /api/logout`    | `POST /api/auth/logout`     |
| Get current user| `GET /api/me`         | `GET /api/auth/me`          |
| Forgot password | `POST /api/forgot-password` | `POST /api/auth/forgot-password` |
| Google login    | *(not implemented)*   | `POST /api/auth/google`     |
| Refresh token   | *(not implemented)*   | `POST /api/auth/refresh-token` |
| Send OTP        | *(not implemented)*   | `POST /api/auth/send-otp`   |
| Verify OTP      | *(not implemented)*   | `POST /api/auth/verify-otp` |

### Update `API_URL` in both Header.jsx and LoginModal.jsx:

```js
// Before
const API_URL = 'http://localhost:5000/api';

// After
const API_URL = 'http://localhost:5000/api/auth';
```

### Update the response format in LoginModal.jsx:

The new backend returns a unified response shape. Update your `handleSubmit`:

```js
// Old — token at top level
const { token, user } = res.data;
localStorage.setItem('agri_token', token);

// New — token inside data{}
const { accessToken, user } = res.data.data;
localStorage.setItem('agri_token', accessToken);
```

Similarly for `getMe` in Header.jsx:
```js
// Old
const freshUser = res.data.user;

// New
const freshUser = res.data.data.user;
```

### Google Login (Real Implementation)

Replace the mock picker in `LoginModal.jsx` with a real Google sign-in:

```bash
npm install @react-oauth/google
```

Wrap your app in `main.jsx`:
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
  <App />
</GoogleOAuthProvider>
```

In `LoginModal.jsx`, replace the mock button with:
```jsx
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    // Exchange access token for ID token via Google userinfo
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
    );
    // Send to your backend
    const res = await axios.post(`${API_URL}/google`, {
      idToken: tokenResponse.access_token, // or use credential flow below
    });
    const { accessToken, user } = res.data.data;
    localStorage.setItem('agri_token', accessToken);
    localStorage.setItem('agri_user', JSON.stringify(user));
    finishLogin(user);
  },
  flow: 'implicit',
});
```

> **Recommended**: Use `flow: 'auth-code'` with `useGoogleLogin` and send the `credential` (ID token) directly — cleaner and more secure.

---

## 4. Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:5000
   ```
7. Add Authorized redirect URIs:
   ```
   http://localhost:5173
   ```
8. Click **Create** — copy the **Client ID**
9. Paste into `.env`:
   ```
   GOOGLE_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com
   ```

---

## 5. Email (Gmail SMTP) Setup

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required)
3. Search for **"App Passwords"** in the security page
4. Select app: **Mail** | Device: **Other** → type "GKK Backend"
5. Click **Generate** — copy the 16-character password
6. Paste into `.env`:
   ```
   SMTP_USER=gawandekrushikendra@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

> **Note**: Remove spaces from the app password when pasting.

---

## 6. OTP (Twilio) Setup

### Option A — Use the console mock (development, zero setup)

Leave the Twilio fields blank in `.env`. OTPs will be printed to your terminal:
```
📱  [OTP MOCK] Phone: +919284518038 | Code: 482910
```

### Option B — Real Twilio SMS

1. Create a free account at [twilio.com](https://twilio.com)
2. From the Console Dashboard, copy:
   - **Account SID**
   - **Auth Token**
3. Go to **Phone Numbers → Manage → Buy a number** (or use the free trial number)
4. Paste into `.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE=+1XXXXXXXXXX
   ```

---

## 7. API Reference

### Response Format (all endpoints)
```json
{
  "success": true,
  "message": "Clear human-readable message",
  "data": { }
}
```

### Endpoints

| Method | Endpoint                          | Auth Required | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| POST   | `/api/auth/register`              | No            | Register with email+pass  |
| POST   | `/api/auth/login`                 | No            | Login with email+pass     |
| POST   | `/api/auth/google`                | No            | Login/register via Google |
| GET    | `/api/auth/me`                    | Yes (Bearer)  | Get current user          |
| POST   | `/api/auth/logout`                | Yes (Bearer)  | Logout + revoke token     |
| POST   | `/api/auth/refresh-token`         | Cookie        | Rotate access token       |
| POST   | `/api/auth/forgot-password`       | No            | Send password reset email |
| POST   | `/api/auth/reset-password/:token` | No            | Reset password via token  |
| POST   | `/api/auth/send-otp`              | Optional      | Send OTP to phone         |
| POST   | `/api/auth/verify-otp`            | No            | Verify OTP + login        |
| GET    | `/api/health`                     | No            | Health check              |

---

## 8. Security Features Summary

| Feature                        | Implementation                              |
|--------------------------------|---------------------------------------------|
| Password hashing               | bcryptjs, cost factor 12                    |
| Access token                   | JWT, 15-minute expiry                       |
| Refresh token                  | JWT, 7-day expiry, httpOnly cookie          |
| Refresh token rotation         | Old token deleted on every refresh          |
| Token reuse detection          | Full session revocation on breach           |
| Rate limiting (auth routes)    | 10 requests / 15 min per IP                 |
| Rate limiting (global)         | 200 requests / 15 min per IP                |
| Rate limiting (OTP)            | 5 requests / 10 min per IP                  |
| Security headers               | Helmet.js                                   |
| NoSQL injection prevention     | express-mongo-sanitize                      |
| Input validation               | express-validator on every route            |
| Email enumeration prevention   | Generic responses on login/forgot-password  |
| Duplicate user prevention      | Unique index on email + pre-check           |
| Password field protection      | `select: false` on Mongoose schema          |
| CORS                           | Whitelist CLIENT_URL only, credentials:true |
| Reset token security           | SHA-256 hashed in DB, raw sent via email    |
| OTP security                   | SHA-256 hashed in DB, 10-min expiry         |

---

## 9. Running Frontend + Backend Together

Update the root `package.json` scripts:

```json
"scripts": {
  "dev": "vite",
  "server": "node --experimental-vm-modules backend/server.js",
  "dev:server": "nodemon backend/server.js",
  "start": "concurrently \"npm run dev\" \"npm run dev:server\"",
  "build": "vite build"
}
```

Or simply run them in **two separate terminals**:

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
cd backend && npm run dev
```
