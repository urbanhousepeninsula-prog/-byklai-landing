import type { NextApiRequest, NextApiResponse } from 'next'

const WEBHOOK_URL = process.env.WEBHOOK_URL || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: 'Webhook not configured' })
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    if (response.ok) {
      return res.status(200).json({ ok: true })
    }
    return res.status(502).json({ error: 'Upstream error' })
  } catch {
    return res.status(500).json({ error: 'Internal error' })
  }
}
