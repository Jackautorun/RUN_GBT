// server.js (ESM)
import express from "express";
import cors from "cors";
import crypto from "crypto";

const API_KEY = process.env.COMMAND_API_KEY ?? "dev-key";
const ORIGIN  = process.env.CORS_ORIGIN ?? "*";
const PORT    = Number(process.env.PORT ?? 8080);
const HOST    = process.env.HOST ?? "0.0.0.0";

const app = express();
app.use(cors({
  origin: ORIGIN,
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Authorization","Content-Type"],
  maxAge: 600
}));
app.use((req,res,next)=> req.method==="OPTIONS" ? res.sendStatus(204) : next());
app.use(express.json({ limit: "1mb" }));

// health + simple GET
app.get("/healthz", (req,res)=> res.json({ ok:true, time: Date.now() }));
app.get("/ping",    (req,res)=> res.json({ pong: Date.now() }));

// ---- simple event bus ----
const clients = new Set();
const jobs = [];
const emit = (evt) => {
  const line = `data: ${JSON.stringify(evt)}\n\n`;
  for (const res of clients) res.write(line);
};

// ---- auth middleware ----
function auth(req,res,next){
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : "";
  if (token !== API_KEY) return res.status(401).json({ error: "unauthorized" });
  next();
}

// ---- commands API ----
app.post("/commands", auth, async (req,res)=>{
  const { type, params = {} } = req.body || {};
  if (!type) return res.status(400).json({ error: "bad_request" });

  const id = crypto.randomUUID();
  jobs.unshift({ id, type, params, status: "queued", enqueuedAt: Date.now() });
  emit({ job: { id, status: "queued", ...params } });
  res.json({ id, status: "queued" });

  setTimeout(async () => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    job.status = "running";
    job.startedAt = Date.now();
    emit({ job: { id, status: "running" } });

    try {
      // แทนที่งานจริงได้ที่นี่
      await new Promise(r => setTimeout(r, 800));
      job.result = { ok: true, ...params };
      job.status = "completed";
    } catch (e) {
      job.status = "failed";
      job.error = String(e?.message || e);
    } finally {
      job.finishedAt = Date.now();
      emit({ job: { id, status: job.status, result: job.result, error: job.error } });

      const completed = jobs.filter(j => j.status === "completed").length;
      const failed    = jobs.filter(j => j.status === "failed").length;
      emit({ kpi: { jobs: completed } });
      emit({ donut: [
        { name: "Completed", value: completed },
        { name: "Failed",    value: failed },
        { name: "Cancelled", value: 0 }
      ]});
    }
  }, 200);
});

// ---- Server-Sent Events ----
app.get("/api/events", (req,res)=>{
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.write("retry: 2000\n\n");
  clients.add(res);

  // heartbeat กันพร็อกซีปิด
  const ka = setInterval(() => res.write(":keepalive\n\n"), 25000);
  req.on("close", () => { clearInterval(ka); clients.delete(res); });
});

// 404 + error handler
app.use((req,res)=> res.status(404).json({ error: "not_found" }));
app.use((err,req,res,next)=> {
  console.error("internal_error:", err);
  res.status(500).json({ error: "internal_error" });
});

app.listen(PORT, HOST, () => {
  console.log(`Command API on http://${HOST}:${PORT}`);
});
