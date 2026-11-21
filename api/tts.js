export default async function handler(req, res) {
  const text = req.query.text || 'Hello';
  const sources = [
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`,
    `https://api.streamelements.com/kappa/v2/speech?voice=Salli&text=${encodeURIComponent(text)}`
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(Buffer.from(arrayBuffer));
      }
    } catch (e) {}
  }

  res.status(502).send('Gagal mengambil audio');
}