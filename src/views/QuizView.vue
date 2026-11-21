<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();

const track = computed(() => store.getCurrentTrack());
const progress = computed(() => store.getTrackProgress());
const activeStage = ref(1); // 1: Kuis, 2: Speaking, 3: Reading

watch(() => store.getTrackKey(), () => {
  activeStage.value = progress.value.unlockedStage;
  resetStage1();
  resetStage2();
  resetStage3();
});

const selectStageTab = (stageNum) => {
  if (stageNum > progress.value.unlockedStage) {
    store.showToast(`Selesaikan Tahap ${stageNum - 1} terlebih dahulu untuk membuka Tahap ${stageNum}!`, 'warning');
    return;
  }
  activeStage.value = stageNum;
};

// ==========================================
// TAHAP 1: KUIS 10 SOAL + REMEDIAL (<= 3 SALAH)
// ==========================================
const isRemedialMode = ref(false);
const questionQueue = ref([]);
const currentQIndex = ref(0);
const selectedOpt = ref(null);
const isQAnswered = ref(false);
const correctCount1 = ref(0);
const wrongQuestions = ref([]);
const stage1Finished = ref(false);
const stage1Outcome = ref(''); // 'passed' | 'remedial' | 'full_reset'

const initStage1 = (remedialList = null) => {
  if (remedialList && remedialList.length > 0) {
    isRemedialMode.value = true;
    questionQueue.value = [...remedialList];
  } else {
    isRemedialMode.value = false;
    questionQueue.value = [...track.value.quiz];
  }
  currentQIndex.value = 0;
  selectedOpt.value = null;
  isQAnswered.value = false;
  correctCount1.value = 0;
  wrongQuestions.value = [];
  stage1Finished.value = false;
  stage1Outcome.value = '';
};

const resetStage1 = () => initStage1(null);
initStage1(null);

const currentQ = computed(() => questionQueue.value[currentQIndex.value] || null);

const answerStage1 = (idx) => {
  if (isQAnswered.value || !currentQ.value) return;
  selectedOpt.value = idx;
  isQAnswered.value = true;

  if (idx === currentQ.value.answer) {
    correctCount1.value += 1;
  } else {
    wrongQuestions.value.push(currentQ.value);
  }
};

const nextStage1 = () => {
  if (currentQIndex.value < questionQueue.value.length - 1) {
    currentQIndex.value += 1;
    selectedOpt.value = null;
    isQAnswered.value = false;
    return;
  }

  const wrongCount = wrongQuestions.value.length;
  stage1Finished.value = true;

  if (wrongCount === 0) {
    stage1Outcome.value = 'passed';
    store.completeStage(1);
    store.showToast('Sempurna! Tahap 2 (Speaking) sekarang terbuka! 🎉', 'success');
  } else if (!isRemedialMode.value && wrongCount <= 3) {
    stage1Outcome.value = 'remedial';
    store.showToast(`Benar ${correctCount1.value}, Salah ${wrongCount}. Masuk Mode Remedial!`, 'warning');
  } else {
    stage1Outcome.value = 'full_reset';
    store.showToast(
      isRemedialMode.value
        ? 'Masih ada jawaban salah saat remedial. Wajib ulang semua 10 soal!'
        : `Salah ${wrongCount} soal (lebih dari 3). Wajib ulang semua 10 soal dari awal!`,
      'warning'
    );
  }
};

// ==========================================
// TAHAP 2: SPEAKING (PENCOCOKAN SUARA >= 80%)
// ==========================================
const isListening = ref(false);
const spokenTranscript = ref('');
const speakingAccuracy = ref(null);
const wordResults = ref([]);
const manualInputFallback = ref('');
const showManualFallback = ref(false);
let recognitionInstance = null;

const personalizedSpeakingText = computed(() => {
  const userName = store.user.name || 'Pelajar';
  return track.value.speaking.targetText.replace(/\b(Dimas|Sania|Reza)\b/g, userName);
});

const resetStage2 = () => {
  isListening.value = false;
  spokenTranscript.value = '';
  speakingAccuracy.value = null;
  wordResults.value = [];
  manualInputFallback.value = '';
  showManualFallback.value = false;
  if (recognitionInstance) {
    try { recognitionInstance.stop(); } catch (e) {}
  }
};

const evaluateSpeaking = (transcript) => {
  spokenTranscript.value = transcript;
  const clean = (str) => str.toLowerCase().replace(/[^a-z0-9\s']/g, '').trim().split(/\s+/).filter(Boolean);

  const targetWords = personalizedSpeakingText.value.split(/\s+/);
  const spokenSet = clean(transcript);

  let matchedCount = 0;
  wordResults.value = targetWords.map((rawWord) => {
    const norm = rawWord.toLowerCase().replace(/[^a-z0-9']/g, '');
    const isMatch = spokenSet.includes(norm);
    if (isMatch) matchedCount += 1;
    return { word: rawWord, matched: isMatch };
  });

  const pct = Math.round((matchedCount / targetWords.length) * 100);
  speakingAccuracy.value = pct;

  if (pct >= 80) {
    store.completeStage(2);
    store.showToast(`Akurasi ${pct}%! Lulus Tahap 2, Tahap 3 (Reading) terbuka! 🎉`, 'success');
  } else {
    store.showToast(`Akurasi baru ${pct}% (minimal 80%). Coba ucapkan lagi lebih jelas!`, 'warning');
  }
};

const startSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showManualFallback.value = true;
    store.showToast('Browser tidak mendukung Speech Recognition. Gunakan mode cek teks di bawah.', 'warning');
    return;
  }

  try {
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'en-US';
    recognitionInstance.interimResults = false;
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onstart = () => {
      isListening.value = true;
      speakingAccuracy.value = null;
    };

    recognitionInstance.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      isListening.value = false;
      evaluateSpeaking(resultText);
    };

    recognitionInstance.onerror = () => {
      isListening.value = false;
      showManualFallback.value = true;
      store.showToast('Mikrofon/layanan suara browser diblokir OS. Gunakan mode alternatif di bawah.', 'warning');
    };

    recognitionInstance.onend = () => {
      isListening.value = false;
    };

    recognitionInstance.start();
  } catch (e) {
    isListening.value = false;
    showManualFallback.value = true;
  }
};

// ==========================================
// TAHAP 3: READING & PEMAHAMAN BACAAN
// ==========================================
const rIndex = ref(0);
const rSelected = ref(null);
const rAnswered = ref(false);
const rScore = ref(0);
const rWrongCount = ref(0);
const rFinished = ref(false);

const readingQuestions = computed(() => track.value.reading.questions);
const currentReadingQ = computed(() => readingQuestions.value[rIndex.value] || null);

const resetStage3 = () => {
  rIndex.value = 0;
  rSelected.value = null;
  rAnswered.value = false;
  rScore.value = 0;
  rWrongCount.value = 0;
  rFinished.value = false;
};

const answerReading = (idx) => {
  if (rAnswered.value || !currentReadingQ.value) return;
  rSelected.value = idx;
  rAnswered.value = true;
  if (idx === currentReadingQ.value.answer) {
    rScore.value += 1;
  } else {
    rWrongCount.value += 1;
  }
};

const nextReading = () => {
  if (rIndex.value < readingQuestions.value.length - 1) {
    rIndex.value += 1;
    rSelected.value = null;
    rAnswered.value = false;
  } else {
    rFinished.value = true;
    if (rScore.value === readingQuestions.value.length) {
      store.completeStage(3);
      store.showToast('Selamat! Kamu menuntaskan semua tahap di tingkatan ini! 🏆', 'success');
    } else {
      store.showToast(`Benar ${rScore.value}, Salah ${rWrongCount.value}. Jawab semua benar untuk lulus Tahap 3!`, 'warning');
    }
  }
};

const upgradeToNextLevel = () => {
  const current = store.getNormalizedLevel();
  if (current === 'Pemula') store.user.level = 'Menengah';
  else if (current === 'Menengah') store.user.level = 'Lanjut';
  store.showToast(`Naik ke tingkatan ${store.user.level}! 🚀`, 'success');
};
</script>

<template>
  <section class="screen-enter p-5 sm:p-8 lg:py-10 max-w-4xl mx-auto w-full space-y-6">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <button @click="router.push('/home')" class="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900">Jalur Latihan Bertahap</h1>
          <p class="text-xs sm:text-sm text-slate-500">
            Jenjang <span class="font-bold text-slate-800">{{ store.user.education }}</span> • Tingkatan
            <span class="font-bold text-brand-600">{{ store.getNormalizedLevel() }}</span>
          </p>
        </div>
      </div>

      <span v-if="progress.stage3Passed" class="px-3.5 py-1.5 rounded-full bg-mint-50 border border-mint-200 text-xs font-bold text-mint-700">
        🏆 Tingkatan Tuntas
      </span>
    </header>

    <!-- Navigasi 3 Tahap (Stepper) -->
    <div class="grid grid-cols-3 gap-3">
      <button @click="selectStageTab(1)"
        :class="activeStage === 1 ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20' : 'border-slate-200 bg-white'"
        class="p-3.5 sm:p-4 rounded-2xl border text-left transition-all">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-brand-600">Tahap 1</span>
          <span v-if="progress.stage1Passed" class="text-mint-600 font-bold text-sm">✓</span>
          <span v-else class="text-xs text-slate-400">10 Soal</span>
        </div>
        <p class="font-display text-xs sm:text-sm font-extrabold text-slate-900">Kuis Pemahaman</p>
      </button>

      <button @click="selectStageTab(2)"
        :class="[
          activeStage === 2 ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20' : 'border-slate-200 bg-white',
          progress.unlockedStage < 2 ? 'opacity-60 cursor-not-allowed' : ''
        ]"
        class="p-3.5 sm:p-4 rounded-2xl border text-left transition-all">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-brand-600">Tahap 2</span>
          <span v-if="progress.stage2Passed" class="text-mint-600 font-bold text-sm">✓</span>
          <span v-else-if="progress.unlockedStage < 2" class="text-xs">🔒</span>
          <span v-else class="text-xs text-amber-600 font-bold">≥80%</span>
        </div>
        <p class="font-display text-xs sm:text-sm font-extrabold text-slate-900">Speaking Match</p>
      </button>

      <button @click="selectStageTab(3)"
        :class="[
          activeStage === 3 ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20' : 'border-slate-200 bg-white',
          progress.unlockedStage < 3 ? 'opacity-60 cursor-not-allowed' : ''
        ]"
        class="p-3.5 sm:p-4 rounded-2xl border text-left transition-all">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-brand-600">Tahap 3</span>
          <span v-if="progress.stage3Passed" class="text-mint-600 font-bold text-sm">✓</span>
          <span v-else-if="progress.unlockedStage < 3" class="text-xs">🔒</span>
          <span v-else class="text-xs text-brand-600 font-bold">Cerita</span>
        </div>
        <p class="font-display text-xs sm:text-sm font-extrabold text-slate-900">Reading & Quiz</p>
      </button>
    </div>

    <!-- ===================================================== -->
    <!-- KONTEN TAHAP 1: KUIS 10 SOAL + REMEDIAL               -->
    <!-- ===================================================== -->
    <div v-if="activeStage === 1" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <!-- Hasil Akhir Tahap 1 -->
      <div v-if="stage1Finished" class="text-center py-4 space-y-5">
        <div :class="stage1Outcome === 'passed' ? 'bg-mint-50 text-mint-600' : 'bg-amber-50 text-amber-600'"
          class="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto">
          {{ stage1Outcome === 'passed' ? '🎉' : stage1Outcome === 'remedial' ? '🩹' : '🔄' }}
        </div>

        <!-- Ringkasan Benar & Salah -->
        <div class="flex items-center justify-center gap-3">
          <span class="px-4 py-1.5 rounded-full bg-mint-50 border border-mint-200 text-mint-700 text-xs sm:text-sm font-bold">
            ✓ Benar: {{ correctCount1 }}
          </span>
          <span class="px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold">
            ✕ Salah: {{ wrongQuestions.length }}
          </span>
        </div>

        <div v-if="stage1Outcome === 'passed'" class="space-y-2">
          <h2 class="font-display text-2xl font-extrabold text-slate-900">
            Lulus Sempurna ({{ correctCount1 }}/{{ questionQueue.length }})!
          </h2>
          <p class="text-sm text-slate-600 max-w-md mx-auto">
            Kamu menjawab seluruh soal tanpa kesalahan. Tahap 2 (Speaking) sekarang sudah terbuka!
          </p>
          <div class="pt-3 flex flex-wrap justify-center gap-3">
            <button @click="resetStage1" class="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm">
              Latihan Ulang
            </button>
            <button @click="activeStage = 2" class="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
              Lanjut ke Tahap 2 (Speaking) →
            </button>
          </div>
        </div>

        <div v-else-if="stage1Outcome === 'remedial'" class="space-y-2">
          <h2 class="font-display text-2xl font-extrabold text-slate-900">Mode Remedial Aktif</h2>
          <p class="text-sm text-slate-600 max-w-md mx-auto">
            Kamu menjawab <span class="font-bold text-mint-600">{{ correctCount1 }} benar</span> dan
            <span class="font-bold text-rose-600">{{ wrongQuestions.length }} salah</span> (batas maksimal 3 salah).
            Cukup ulangi <span class="font-bold text-slate-800">{{ wrongQuestions.length }} soal yang salah saja</span> untuk lulus ke Tahap 2!
          </p>
          <div class="pt-3">
            <button @click="initStage1(wrongQuestions)" class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md">
              Mulai Remedial ({{ wrongQuestions.length }} Soal)
            </button>
          </div>
        </div>

        <div v-else class="space-y-2">
          <h2 class="font-display text-2xl font-extrabold text-slate-900">Belum Lolos ke Tahap 2</h2>
          <p class="text-sm text-slate-600 max-w-md mx-auto">
            {{ isRemedialMode
              ? 'Kamu masih melakukan kesalahan pada sesi remedial. Sesuai aturan, kamu wajib mengulang seluruh 10 soal dari awal.'
              : `Skor kamu ${correctCount1} benar dan ${wrongQuestions.length} salah (lebih dari 3 soal). Kamu wajib mengulang seluruh 10 soal dari awal.`
            }}
          </p>
          <div class="pt-3">
            <button @click="resetStage1" class="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
              Ulangi Semua 10 Soal
            </button>
          </div>
        </div>
      </div>

      <!-- Soal Aktif Tahap 1 -->
      <div v-else-if="currentQ" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span :class="isRemedialMode ? 'bg-amber-100 text-amber-800' : 'bg-brand-50 text-brand-700'"
            class="px-3 py-1 rounded-full text-xs font-bold">
            {{ isRemedialMode ? '🩹 Mode Remedial' : '📝 Kuis Utama' }} • Soal {{ currentQIndex + 1 }} / {{ questionQueue.length }}
          </span>

          <!-- Badge Benar & Salah Real-time -->
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="px-2.5 py-1 rounded-full bg-mint-50 border border-mint-200 text-mint-700">
              ✓ Benar: {{ correctCount1 }}
            </span>
            <span class="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
              ✕ Salah: {{ wrongQuestions.length }}
            </span>
          </div>
        </div>

        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-brand-600 transition-all duration-300"
            :style="{ width: (((currentQIndex + 1) / questionQueue.length) * 100) + '%' }"></div>
        </div>

        <h2 class="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {{ currentQ.question }}
        </h2>

        <div class="space-y-3">
          <button v-for="(opt, idx) in currentQ.options" :key="idx" @click="answerStage1(idx)"
            :disabled="isQAnswered"
            :class="[
              !isQAnswered ? 'border-slate-200 bg-slate-50/70 hover:bg-brand-50/50 hover:border-brand-300 text-slate-800' : '',
              isQAnswered && idx === currentQ.answer ? 'border-mint-500 bg-mint-50 text-mint-800 font-bold' : '',
              isQAnswered && selectedOpt === idx && idx !== currentQ.answer ? 'border-rose-400 bg-rose-50 text-rose-700' : '',
              isQAnswered && idx !== currentQ.answer && selectedOpt !== idx ? 'border-slate-200 bg-white text-slate-400 opacity-70' : ''
            ]"
            class="w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between gap-3">
            <span>{{ opt }}</span>
            <span v-if="isQAnswered && idx === currentQ.answer" class="text-mint-600 font-bold">✓</span>
            <span v-else-if="isQAnswered && selectedOpt === idx && idx !== currentQ.answer" class="text-rose-500 font-bold">✕</span>
          </button>
        </div>

        <div v-if="isQAnswered" class="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 space-y-1">
          <p class="text-xs font-bold text-brand-700">💡 Pembahasan</p>
          <p class="text-xs sm:text-sm text-slate-700">{{ currentQ.explanation }}</p>
        </div>

        <div v-if="isQAnswered">
          <button @click="nextStage1" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
            {{ currentQIndex < questionQueue.length - 1 ? 'Soal Berikutnya →' : 'Lihat Evaluasi Tahap 1' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- KONTEN TAHAP 2: SPEAKING (PENCOCOKAN SUARA >= 80%)    -->
    <!-- ===================================================== -->
    <div v-else-if="activeStage === 2" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span class="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
            🎙️ Tahap 2 • Pencocokan Pelafalan
          </span>
          <h2 class="font-display text-xl font-extrabold text-slate-900 mt-2">{{ track.speaking.title }}</h2>
          <p class="text-xs sm:text-sm text-slate-500">{{ track.speaking.instruction }}</p>
        </div>

        <button @click="store.speakEnglish(personalizedSpeakingText)"
          class="px-4 py-2.5 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors">
          <span>🔊 Dengar Contoh</span>
        </button>
      </div>

      <!-- Kotak Teks Target -->
      <div class="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
        <p v-if="!wordResults.length" class="font-display text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
          "{{ personalizedSpeakingText }}"
        </p>
        <p v-else class="font-display text-lg sm:text-xl font-bold leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
          <span v-for="(item, i) in wordResults" :key="i"
            :class="item.matched ? 'text-mint-700 bg-mint-100/80 px-1.5 rounded-lg' : 'text-rose-600 bg-rose-100/80 px-1.5 rounded-lg underline decoration-wavy'">
            {{ item.word }}
          </span>
        </p>
        <p class="text-xs text-slate-500 italic">Cara baca: {{ track.speaking.hint }}</p>
      </div>

      <!-- Tombol Rekam Suara -->
      <div class="flex flex-col items-center text-center space-y-3 py-2">
        <button @click="startSpeechRecognition" :disabled="isListening"
          :class="isListening ? 'bg-rose-500 animate-pulse' : 'bg-brand-600 hover:bg-brand-700'"
          class="w-20 h-20 rounded-full text-white shadow-lg flex items-center justify-center text-3xl transition-all">
          🎙️
        </button>
        <p class="text-xs sm:text-sm font-semibold text-slate-700">
          {{ isListening ? 'Mendengarkan... Silakan baca teks di atas dalam bahasa Inggris' : 'Klik mikrofon lalu baca teks di atas (Syarat lulus ≥ 80%)' }}
        </p>
      </div>

      <!-- Hasil Pencocokan Suara -->
      <div v-if="speakingAccuracy !== null" class="p-5 rounded-2xl border space-y-3"
        :class="speakingAccuracy >= 80 ? 'bg-mint-50/70 border-mint-200' : 'bg-amber-50/70 border-amber-200'">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider" :class="speakingAccuracy >= 80 ? 'text-mint-700' : 'text-amber-700'">
            Hasil Pencocokan Suara
          </span>
          <span class="font-display text-2xl font-extrabold" :class="speakingAccuracy >= 80 ? 'text-mint-600' : 'text-amber-600'">
            {{ speakingAccuracy }}%
          </span>
        </div>

        <p class="text-xs text-slate-600">
          Terdeteksi: <span class="font-semibold text-slate-800">"{{ spokenTranscript }}"</span>
        </p>

        <div v-if="speakingAccuracy >= 80" class="pt-1">
          <button @click="activeStage = 3" class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm shadow-md">
            Lulus Tahap 2! Lanjut ke Tahap 3 (Reading) →
          </button>
        </div>
      </div>

      <!-- Cadangan jika SpeechRecognition diblokir browser/Linux -->
      <div v-if="showManualFallback" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <p class="text-xs font-semibold text-slate-600">
          Mode Alternatif (jika pengenalan suara browser tidak aktif di perangkatmu): ketik ulang kalimat di atas untuk menguji pencocokan kata:
        </p>
        <div class="flex gap-2">
          <input v-model="manualInputFallback" type="text" placeholder="Ketik kalimat bahasa Inggris di atas..."
            class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-brand-500" />
          <button @click="evaluateSpeaking(manualInputFallback)" class="px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
            Cek Cocok
          </button>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- KONTEN TAHAP 3: READING & PEMAHAMAN BACAAN            -->
    <!-- ===================================================== -->
    <div v-else-if="activeStage === 3" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span class="px-3 py-1 rounded-full bg-mint-50 text-mint-700 text-xs font-bold">
            📖 Tahap 3 • Reading Comprehension
          </span>
          <h2 class="font-display text-xl font-extrabold text-slate-900 mt-2">{{ track.reading.title }}</h2>
        </div>

        <button @click="store.speakEnglish(track.reading.passage)"
          class="px-4 py-2.5 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs sm:text-sm flex items-center gap-2">
          <span>🔊 Dengar Bacaan</span>
        </button>
      </div>

      <!-- Teks Cerita -->
      <div class="p-5 sm:p-6 rounded-3xl bg-amber-50/40 border border-amber-200/70">
        <p class="text-sm sm:text-base text-slate-800 leading-relaxed">
          {{ track.reading.passage }}
        </p>
      </div>

      <!-- Hasil Akhir Tahap 3 -->
      <div v-if="rFinished" class="text-center py-4 space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-mint-50 text-mint-600 flex items-center justify-center text-3xl mx-auto">
          {{ rScore === readingQuestions.length ? '🏆' : '📖' }}
        </div>

        <!-- Ringkasan Benar & Salah Reading -->
        <div class="flex items-center justify-center gap-3">
          <span class="px-4 py-1.5 rounded-full bg-mint-50 border border-mint-200 text-mint-700 text-xs sm:text-sm font-bold">
            ✓ Benar: {{ rScore }}
          </span>
          <span class="px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold">
            ✕ Salah: {{ rWrongCount }}
          </span>
        </div>

        <h3 class="font-display text-xl font-extrabold text-slate-900">
          {{ rScore === readingQuestions.length ? 'Semua Tahap Selesai!' : 'Belum Tepat Semua' }}
        </h3>
        <p class="text-sm text-slate-600">
          Skor pemahaman bacaanmu: <span class="font-bold text-mint-600">{{ rScore }} benar</span> &
          <span class="font-bold text-rose-600">{{ rWrongCount }} salah</span> dari {{ readingQuestions.length }} pertanyaan.
        </p>

        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <button @click="resetStage3" class="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm">
            Ulangi Pertanyaan Bacaan
          </button>
          <button v-if="rScore === readingQuestions.length && store.getNormalizedLevel() !== 'Lanjut'" @click="upgradeToNextLevel"
            class="px-6 py-3 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm shadow-md">
            Naik ke Tingkatan Berikutnya 🚀
          </button>
          <button v-else-if="rScore === readingQuestions.length" @click="router.push('/home')"
            class="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <!-- Pertanyaan Pemahaman Bacaan -->
      <div v-else-if="currentReadingQ" class="space-y-4 pt-2 border-t border-slate-100">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pertanyaan Pemahaman {{ rIndex + 1 }} dari {{ readingQuestions.length }}
          </p>

          <!-- Badge Benar & Salah Reading Real-time -->
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="px-2.5 py-1 rounded-full bg-mint-50 border border-mint-200 text-mint-700">
              ✓ Benar: {{ rScore }}
            </span>
            <span class="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
              ✕ Salah: {{ rWrongCount }}
            </span>
          </div>
        </div>

        <h3 class="font-display text-base sm:text-lg font-bold text-slate-900">
          {{ currentReadingQ.question }}
        </h3>

        <div class="space-y-2.5">
          <button v-for="(opt, idx) in currentReadingQ.options" :key="idx" @click="answerReading(idx)"
            :disabled="rAnswered"
            :class="[
              !rAnswered ? 'border-slate-200 bg-slate-50/70 hover:bg-brand-50/50 text-slate-800' : '',
              rAnswered && idx === currentReadingQ.answer ? 'border-mint-500 bg-mint-50 text-mint-800 font-bold' : '',
              rAnswered && rSelected === idx && idx !== currentReadingQ.answer ? 'border-rose-400 bg-rose-50 text-rose-700' : '',
              rAnswered && idx !== currentReadingQ.answer && rSelected !== idx ? 'border-slate-200 bg-white text-slate-400 opacity-70' : ''
            ]"
            class="w-full p-3.5 rounded-2xl border text-left text-sm transition-all flex items-center justify-between">
            <span>{{ opt }}</span>
            <span v-if="rAnswered && idx === currentReadingQ.answer" class="text-mint-600 font-bold">✓</span>
            <span v-else-if="rAnswered && rSelected === idx && idx !== currentReadingQ.answer" class="text-rose-500 font-bold">✕</span>
          </button>
        </div>

        <div v-if="rAnswered" class="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-xs sm:text-sm text-slate-700">
          💡 {{ currentReadingQ.explanation }}
        </div>

        <button v-if="rAnswered" @click="nextReading" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
          {{ rIndex < readingQuestions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Selesaikan Tahap 3' }}
        </button>
      </div>
    </div>
  </section>
</template>