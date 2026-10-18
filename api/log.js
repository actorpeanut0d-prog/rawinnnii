export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const loc = (req.body && req.body.location) || {};

  const row = {
    ip,
    city: req.headers["x-vercel-ip-city"] || null,
    country: req.headers["x-vercel-ip-country"] || null,
    lat: loc.lat ?? null,
    lng: loc.lng ?? null,
    accuracy: loc.accuracy ?? null
  };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY");
    return res.status(500).json({ ok: false, error: "server not configured" });
  }

  const headers = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "return=minimal"
  };
  // กุญแจแบบเก่า (service_role) เป็น JWT ต้องส่งใน Authorization ด้วย
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key;

  try {
    const r = await fetch(url.replace(/\/$/, "") + "/rest/v1/logs", {
      method: "POST",
      headers,
      body: JSON.stringify(row)
    });
    if (!r.ok) {
      console.error("Supabase error", r.status, await r.text());
      return res.status(502).json({ ok: false });
    }
  } catch (e) {
    console.error("Supabase fetch failed", e);
    return res.status(502).json({ ok: false });
  }

  res.status(200).json({ ok: true });
}
