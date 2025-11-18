// ПРИМЕР: gateway/handlers/oauth_forward.ts
import fetch from 'node-fetch';

export async function forwardExternalAuth(req, res) {
  try {
    const body = req.body;
    const provider = body.provider || req.params.provider;
    // normalize
    const payload = {
      provider,
      external_id: String(body.external_id),
      username: body.username || null,
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      signature: body.signature
    };
    // Check OpenAPI existence (ПРИМЕР) - in production, validate against real openapi.json
    const CORE_URL = process.env.CORE_URL || 'http://localhost:8000';
    const endpoint = `${CORE_URL}/api/v1/auth/oauth/${provider}`;
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await r.json();
    res.status(r.status).json(json);
  } catch (err) {
    res.status(500).json({ detail: String(err) });
  }
}
