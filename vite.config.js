import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

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
      current = trimmed.slice(0, maxLen);
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

const localTtsPlugin = () => ({
  name: 'local-tts',
  configureServer(server) {
    server.middlewares.use('/api/tts', async (req, res) => {
      const urlObj = new URL(req.url, 'http://localhost');
      const text = (urlObj.searchParams.get('text') || 'Hello').trim();
      const chunks = splitTextIntoChunks(text, 180);
      const buffers = [];

      for (const chunk of chunks) {
        const sources = [
          `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=en-US&q=${encodeURIComponent(chunk)}`,
          `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(chunk)}`,
          `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(chunk)}&type=2`
        ];

        for (const src of sources) {
          try {
            const r = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (r.ok) {
              buffers.push(Buffer.from(await r.arrayBuffer()));
              break;
            }
          } catch (e) {}
        }
      }

      if (buffers.length > 0) {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.end(Buffer.concat(buffers));
        return;
      }

      res.statusCode = 502;
      res.end('TTS gagal');
    });
  }
});

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    localTtsPlugin(),
  ],
})