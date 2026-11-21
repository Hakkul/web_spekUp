function splitTextIntoChunks(text, maxLen = 180) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks = [];
  let current = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    if ((current + ' ' + trimmed).trim().length <= maxLen) {
      current = (current + ' ' + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= maxLen) {
        current = trimmed;
      } else {
        const words = trimmed.split(/\s+/);
        let part = '';
        for (const w of words) {
          if ((part + ' ' + w).trim().length <= maxLen) {
            part = (part + ' ' + w).trim();
          } else {
            if (part) chunks.push(part);
            part = w;
          }
        }
        current = part;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function fetchChunkAudio(chunk) {
  const sources = [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=en-US&q=${encodeURIComponent(chunk)}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(chunk)}`,
    `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(chunk)}&type=2`
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }
    } catch (e) {}
  }
  return null;
}

export default async function handler(req, res) {
  const text = (req.query.text || 'Hello').trim();
  const chunks = splitTextIntoChunks(text, 180);
  const buffers = [];

  for (const chunk of chunks) {
    const buf = await fetchChunkAudio(chunk);
    if (buf) buffers.push(buf);
  }

  if (buffers.length === 0) {
    return res.status(502).send('Gagal mengambil audio');
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.send(Buffer.concat(buffers));
}