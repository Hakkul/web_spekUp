<script setup>
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();

const phraseDictionary = {
  'i study at school': {
    meaning: 'Aku belajar di sekolah',
    phonetic: 'ai stadi at skul',
    explanation: 'Study dipakai untuk kegiatan belajar. Pakai at sebelum nama tempat.'
  },
  'in my free time': {
    meaning: 'di waktu luangku',
    phonetic: 'in mai fri taim',
    explanation: "Gunakan 'in my free time' untuk menjelaskan aktivitas saat tidak sibuk."
  },
  'go to school by bicycle': {
    meaning: 'pergi ke sekolah naik sepeda',
    phonetic: 'gou tu skul bai baisikel',
    explanation: "Pakai 'by' sebelum alat transportasi tanpa kata sandang (by bicycle, by bus)."
  },
  'nice to meet you': {
    meaning: 'Senang bertemu denganmu',
    phonetic: 'nais tu mit yu',
    explanation: 'Ungkapan sopan yang umum dipakai saat pertama kali berkenalan.'
  }
};

const analyzePhrase = () => {
  const raw = store.translation.inputText.trim();
  if (!raw) return;
  const key = raw.toLowerCase();

  if (phraseDictionary[key]) {
    Object.assign(store.translation, phraseDictionary[key]);
    store.showToast('Analisis frasa berhasil diperbarui!', 'success');
    return;
  }

  const phoneticSim = key
    .replace(/tion/g, 'syen')
    .replace(/ee|ea/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/ou/g, 'au')
    .replace(/th/g, 'd')
    .replace(/sh/g, 'sy')
    .replace(/ch/g, 'c')
    .replace(/y\b/g, 'i');

  store.translation.meaning = `Arti frasa: "${raw}" (Kosakata latihan siswa)`;
  store.translation.phonetic = phoneticSim;
  store.translation.explanation = 'Perhatikan jeda antar kata dan tekan suku kata utama saat mengucapkan frasa ini.';
  store.user.newWords += 1;
  store.showToast('Cara baca & penjelasan frasa siap!', 'success');
};
</script>

<template>
  <section class="screen-enter flex-1 flex flex-col justify-between p-5 sm:p-8">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button @click="router.push('/practice/result')" class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-200/60">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="font-display text-lg sm:text-xl font-extrabold text-slate-900">Terjemahan</h1>
        <div class="w-8"></div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">Frasa / Kalimat Bahasa Inggris</label>
        <div class="flex items-center gap-2">
          <input v-model="store.translation.inputText" @keyup.enter="analyzePhrase" type="text"
            class="flex-1 font-display text-base sm:text-lg font-bold text-slate-900 bg-transparent outline-none" />
          <button @click="analyzePhrase"
            class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shrink-0 transition-all">
            Cek
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span class="text-xs font-bold text-brand-600 block mb-1">Arti</span>
          <p class="text-base sm:text-lg font-bold text-slate-900">{{ store.translation.meaning }}</p>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-mint-600 block mb-1">Cara baca</span>
            <p class="text-base sm:text-lg font-extrabold text-slate-800 tracking-wide">{{ store.translation.phonetic }}</p>
          </div>
          <button @click="store.speakEnglish(store.translation.inputText)"
            class="w-11 h-11 rounded-xl bg-mint-50 hover:bg-mint-100 text-mint-600 flex items-center justify-center transition-colors shrink-0" title="Dengarkan cara baca">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="bg-brand-50/60 rounded-2xl p-4 sm:p-5 border border-brand-100">
        <span class="text-xs font-bold text-brand-700 block mb-1">Penjelasan</span>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">{{ store.translation.explanation }}</p>
      </div>
    </div>

    <div class="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button @click="router.push('/practice/record')" class="w-full py-3.5 rounded-2xl bg-white border-2 border-brand-600 text-brand-700 hover:bg-brand-50 font-bold text-sm transition-all">
        Ulangi rekaman
      </button>
      <button @click="router.push('/closing/summary')" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all">
        Lanjut Ringkasan Sesi
      </button>
    </div>
  </section>
</template>