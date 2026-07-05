function titleCase(text) {
  return String(text || '').trim().replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function detectType(type, prompt) {
  const p = String(prompt || '').toLowerCase();
  if (type && type !== 'auto') return type;
  if (p.includes('excel') || p.includes('venta') || p.includes('inventario') || p.includes('presupuesto') || p.includes('tabla')) return 'excel';
  if (p.includes('present') || p.includes('diapositiva') || p.includes('expos') || p.includes('power')) return 'ppt';
  return 'word';
}

function extractTopic(prompt) {
  return String(prompt || 'tema solicitado')
    .replace(/hazme|hacer|crea|crear|una|un|sobre|con|diapositivas|profesional|presentaci[oó]n|informe|excel|word|powerpoint/gi, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'tema solicitado';
}

function slideCount(prompt) {
  const match = String(prompt || '').match(/(\d+)\s*(diapositivas|slides)/i);
  return Math.min(Math.max(match ? Number(match[1]) : 8, 5), 12);
}

function buildOfflinePlan({ type, title, prompt, style, level }) {
  const finalType = detectType(type, prompt);
  const topic = extractTopic(prompt);
  const cleanTitle = title && title !== 'Documento profesional' ? title : titleCase(topic);
  const tone = style || 'Profesional';
  const depth = level || 'Completo';

  if (finalType === 'ppt') {
    const baseSlides = [
      ['Portada', [`Presentación sobre ${topic}`, `Estilo ${tone}`, 'Diseño limpio, claro y visual']],
      ['Objetivo', [`Explicar la importancia de ${topic}`, 'Presentar ideas principales de forma ordenada', 'Facilitar una exposición clara y segura']],
      ['Contexto', [`${titleCase(topic)} se relaciona con aspectos sociales, económicos y culturales.`, 'El tema puede analizarse desde la realidad local y global.', 'Comprender el contexto ayuda a tomar mejores decisiones.']],
      ['Ideas principales', ['Definición y características del tema', 'Beneficios, retos y oportunidades', 'Ejemplos aplicados a la vida real']],
      ['Desarrollo', [`El desarrollo de ${topic} requiere información confiable.`, 'También necesita organización, análisis y presentación clara.', 'Una buena explicación conecta teoría con ejemplos concretos.']],
      ['Aplicaciones', ['Uso educativo para tareas y exposiciones', 'Uso profesional para informes y propuestas', 'Uso en negocios para comunicar ideas y resultados']],
      ['Recomendaciones', ['Usar fuentes confiables y actualizadas', 'Organizar la información por secciones', 'Apoyar la exposición con ejemplos visuales']],
      ['Conclusión', [`${titleCase(topic)} es un tema relevante y útil.`, 'Su análisis permite comprender mejor el problema o la oportunidad.', 'Una presentación clara mejora la comunicación del mensaje.']],
      ['Guion para exponer', ['Saludar y presentar el tema', 'Explicar objetivo, contexto e ideas clave', 'Cerrar con conclusión y recomendación final']]
    ];
    const count = slideCount(prompt);
    const slides = baseSlides.slice(0, count).map(([slideTitle, bullets]) => ({
      title: slideTitle,
      subtitle: slideTitle === 'Portada' ? cleanTitle : '',
      bullets,
      speaker_notes: `Explica esta diapositiva conectándola con ${topic}. Mantén un tono ${tone.toLowerCase()} y directo.`
    }));
    return {
      provider: 'offline',
      title: cleanTitle,
      type: 'ppt',
      summary: `Presentación ${tone.toLowerCase()} sobre ${topic}, organizada en ${slides.length} diapositivas con ideas claras, guion y estructura visual.`,
      sections: [],
      slides,
      table: null
    };
  }

  if (finalType === 'excel') {
    const isInventory = /inventario|stock|producto/i.test(prompt || '');
    const isBudget = /presupuesto|gasto|costos/i.test(prompt || '');
    const columns = isInventory
      ? ['Producto', 'Categoría', 'Stock inicial', 'Entradas', 'Salidas', 'Stock actual', 'Estado']
      : isBudget
        ? ['Concepto', 'Categoría', 'Presupuesto', 'Gasto real', 'Diferencia', 'Estado']
        : ['Producto', 'Cantidad', 'Costo unitario', 'Precio venta', 'Ingreso', 'Ganancia'];
    const rows = isInventory
      ? [['Producto A','General','50','10','8','=C5+D5-E5','Activo'],['Producto B','General','30','5','12','=C6+D6-E6','Revisar'],['Producto C','General','80','0','15','=C7+D7-E7','Activo']]
      : isBudget
        ? [['Publicidad','Marketing','100','80','=C5-D5','OK'],['Materiales','Operación','150','170','=C6-D6','Revisar'],['Transporte','Logística','60','45','=C7-D7','OK']]
        : [['Producto A','10','2.50','4.00','=B5*D5','=E5-(B5*C5)'],['Producto B','8','1.75','3.00','=B6*D6','=E6-(B6*C6)'],['Producto C','12','3.00','5.50','=B7*D7','=E7-(B7*C7)']];
    return {
      provider: 'offline',
      title: cleanTitle || 'Control profesional',
      type: 'excel',
      summary: `Hoja de cálculo ${tone.toLowerCase()} para ${topic}, con estructura editable, fórmulas y resumen de control.`,
      sections: [],
      slides: [],
      table: {
        columns,
        rows,
        formulas: ['Totales automáticos', 'Diferencias calculadas', 'Campos editables para personalizar'],
        summary: 'Archivo base para controlar información y tomar decisiones rápidas.'
      }
    };
  }

  const sections = [
    {
      title: 'Introducción',
      paragraphs: [`${titleCase(topic)} es un tema importante porque permite comprender una situación, necesidad u oportunidad desde una perspectiva ordenada y útil. Este documento presenta una explicación clara, con enfoque ${tone.toLowerCase()}, para facilitar su lectura y aplicación.`],
      bullets: []
    },
    {
      title: 'Objetivo',
      paragraphs: [`El objetivo principal es analizar ${topic} de manera organizada, destacando sus ideas centrales, su importancia y posibles aplicaciones en contextos académicos, personales o de negocio.`],
      bullets: ['Presentar información clara', 'Organizar ideas principales', 'Facilitar una conclusión útil']
    },
    {
      title: 'Desarrollo',
      paragraphs: [`El desarrollo de ${topic} requiere identificar conceptos principales, relacionarlos con ejemplos y explicar su impacto. Para que el contenido sea útil, la información debe dividirse en secciones fáciles de entender y debe evitar repeticiones innecesarias.`],
      bullets: ['Definición del tema', 'Características principales', 'Ejemplos o aplicaciones', 'Beneficios y retos']
    },
    {
      title: 'Análisis',
      paragraphs: [`Desde un análisis ${tone.toLowerCase()}, ${topic} puede entenderse como una oportunidad para mejorar procesos, comunicar ideas y tomar decisiones. Su valor aumenta cuando se presenta con datos, ejemplos y una estructura visual ordenada.`],
      bullets: ['Impacto del tema', 'Relación con el contexto', 'Posibles soluciones o recomendaciones']
    },
    {
      title: 'Conclusión',
      paragraphs: [`En conclusión, ${topic} es relevante porque ayuda a comprender mejor una realidad específica y permite proponer acciones concretas. Una presentación clara del tema mejora la comunicación y facilita el aprendizaje.`],
      bullets: []
    }
  ];
  return {
    provider: 'offline',
    title: cleanTitle || 'Documento profesional',
    type: 'word',
    summary: `Documento ${tone.toLowerCase()} y ${depth.toLowerCase()} sobre ${topic}, creado con estructura formal y contenido editable.`,
    sections,
    slides: [],
    table: null
  };
}

async function askGemini(payload) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const system = 'Eres OfficeMaster AI. Devuelve solo JSON valido. Crea contenido profesional para Word, PowerPoint o Excel. No uses texto de relleno.';
  const schema = {
    title: 'string', type: 'word|ppt|excel', summary: 'string', provider: 'gemini',
    sections: [{ title: 'string', paragraphs: ['string'], bullets: ['string'] }],
    slides: [{ title: 'string', subtitle: 'string', bullets: ['string'], speaker_notes: 'string' }],
    table: { columns: ['string'], rows: [['string']], formulas: ['string'], summary: 'string' }
  };
  const body = { contents: [{ parts: [{ text: `${system}\nSolicitud: ${JSON.stringify(payload)}\nEsquema esperado: ${JSON.stringify(schema)}` }] }] };
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) return null;
  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = raw.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
}

async function askOpenAI(payload) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const system = 'Eres OfficeMaster AI, experto en Word, PowerPoint y Excel. Devuelve solo JSON valido. No uses markdown. Crea contenido real y profesional.';
  const response = await fetch(apiUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, temperature: 0.7, messages: [{ role: 'system', content: system }, { role: 'user', content: JSON.stringify(payload) }] })
  });
  if (!response.ok) return null;
  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content || '{}';
  const cleaned = raw.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(cleaned);
  parsed.provider = 'openai';
  return parsed;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const payload = req.body || {};
  try {
    const gemini = await askGemini(payload).catch(() => null);
    if (gemini) return res.status(200).json(gemini);
    const openai = await askOpenAI(payload).catch(() => null);
    if (openai) return res.status(200).json(openai);
    return res.status(200).json(buildOfflinePlan(payload));
  } catch (error) {
    return res.status(200).json(buildOfflinePlan(payload));
  }
}
