import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/run', (req, res) => {
  const { cmd } = req.body || {};
  if (cmd === 'status') return res.json({ ok: true, ts: Date.now() });
  return res.status(400).json({ ok: false, error: 'bad cmd' });
});

app.get('/health', (_req, res) => res.send('OK'));

function getPort() {
  const i = process.argv.indexOf('--port');
  if (i > -1 && process.argv[i + 1]) return Number(process.argv[i + 1]);
  return Number(process.env.PORT || 9900);
}

const PORT = getPort();
app.listen(PORT, '127.0.0.1', () =>
  console.log(`API listening on http://127.0.0.1:${PORT}`)
);
