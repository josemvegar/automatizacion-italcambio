import express from "express";
import { runAppointment } from "./run.js";

const app = express();
app.use(express.json());

app.post("/reserve", async (req, res) => {
  try {
    await runAppointment(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8000, "0.0.0.0", () => {
  console.log("Bot listening on port 8000");
});
