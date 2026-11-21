import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const localTtsPlugin = () => ({
  name: 'local-tts',
  configureServer(server) {
    server.middlewares.use('/api/tts', async (req, res) => {
      const urlObj = new URL(req.url, 'http://localhost');
      const text = urlObj.searchParams.get('text') || 'Hello';
      const sources = [
        `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`,
        `https://api.streamelements.com/kappa/v2/speech?voice=Salli&text=${encodeURIComponent(text)}`
      ];

      for (const src of sources) {
        try {
          const r = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (r.ok) {
            const buf = Buffer.from(await r.arrayBuffer());
            res.setHeader('Content-Type', 'audio/mpeg');
            res.end(buf);
            return;
          }
        } catch (e) {}
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