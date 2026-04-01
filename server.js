import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Backend auth/login removed per request — keep a minimal API surface.
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'Backend auth removed.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});