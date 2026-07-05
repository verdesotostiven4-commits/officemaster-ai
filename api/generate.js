export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return res.status(400).json({
      error: 'AI_NOT_CONFIGURED',
      message: 'Falta configurar AI_API_KEY en Vercel para generar contenido real.'
    });
  }

  const { type, title, prompt, style, level } = req.body || {};

  const system = `Eres OfficeMaster AI, un asistente experto en Word, PowerPoint y Excel. Devuelve solo JSON valido, sin markdown. El contenido debe ser claro, profesional y util. No generes texto de relleno. Si el usuario pide una presentacion, crea diapositivas con titulos y bullets diferentes. Si pide Word, crea secciones con parrafos reales. Si pide Excel, crea columnas, filas de ejemplo, formulas y resumen.`;

  const user = {
    instruction: prompt,
    requested_type: type,
    title,
    style,
    level,
    output_schema: {
      title: 'string',
      type: 'word | ppt | excel',
      summary: 'string',
      sections: [{ title: 'string', paragraphs: ['string'], bullets: ['string'] }],
      slides: [{ title: 'string', subtitle: 'string', bullets: ['string'], speaker_notes: 'string' }],
      table: { columns: ['string'], rows: [['string']], formulas: ['string'], summary: 'string' }
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: 'AI_REQUEST_FAILED', message: text.slice(0, 500) });
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content || '{}';
    const cleaned = raw.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: 'AI_PARSE_FAILED', message: error.message });
  }
}
