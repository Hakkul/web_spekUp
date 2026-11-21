<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const route = useRoute();
const router = useRouter();

const tab = computed(() => route.params.tab || 'record');
const currentTopic = computed(() => {
  const base = store.topics[store.selectedTopicIndex];
  if (base.id === 'intro') {
    return {
      ...base,
      prompt: `My name is ${store.user.name}, and I study at SMAN 1 Kejayan`
    };
  }
  return base;
});
const isRecording = ref(false);
const seconds = ref(0);
let timerInterval = null;
let recognition = null;
let liveSpeech = '';

const barHeights = [35, 60, 85, 50, 95, 75, 45, 90, 65, 40, 80, 55, 70, 88, 52, 68];

const formattedTimer = computed(() => {
  const m = String(Math.floor(seconds.value / 60)).padStart(2, '0');
  const s = String(seconds.value % 60).padStart(2, '0');
  return `${m} : ${s}`;
});

const formattedFeedback = computed(() => {
  return store.recording.feedback.replace(/\*([^*]+)\*/g, '<span class="text-rose-600 font-extrabold">*$1*</span>');
});

const toggleRecording = () => {
  if (isRecording.value) stopRecording(false);
  else startRecording();
};

const startRecording = () => {
  isRecording.value = true;
  seconds.value = 0;
  liveSpeech = '';

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onresult = (event) => {
        let finalStr = '';
        for (let i = 0; i < event.results.length; i++) {
          finalStr += event.results[i][0].transcript + ' ';
        }
        liveSpeech = finalStr.trim();
      };
      recognition.onerror = () => {};
      recognition.start();
    } catch (e) {}
  }

  timerInterval = setInterval(() => {
    seconds.value += 1;
  }, 1000);
};

const stopRecording = (cancelled = false) => {
  isRecording.value = false;
  clearInterval(timerInterval);
  if (recognition) {
    try { recognition.stop(); } catch (e) {}
    recognition = null;
  }
  if (cancelled) return;

  if (liveSpeech.trim().length > 2) {
    evaluateSpokenText(liveSpeech.trim());
  } else {
    runSimulatedResult();
  }
};

const evaluateSpokenText = (spoken) => {
  const targetWords = currentTopic.value.prompt.split(/\s+/);
  const spokenClean = spoken.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);

  let matchedCount = 0;
  let firstMistake = null;

  const analyzed = targetWords.map(w => {
    const cleanTarget = w.toLowerCase().replace(/[.,!?]/g, '');
    if (spokenClean.includes(cleanTarget)) {
      matchedCount++;
      return { text: w, error: false };
    } else {
      if (!firstMistake) firstMistake = cleanTarget;
      return { text: w, error: true, expected: cleanTarget };
    }
  });

  const ratio = matchedCount / targetWords.length;
  const pronun = Math.max(68, Math.min(98, Math.round(ratio * 100)));
  const gram = Math.max(80, Math.min(98, pronun + 10));

  store.recording.transcriptWords = analyzed;
  store.recording.totalScore = Math.round((pronun + gram) / 2);
  store.recording.grammarScore = gram;
  store.recording.pronunciationScore = pronun;
  store.recording.feedback = firstMistake
    ? `Hampir tepat! Perhatikan pelafalan kata '${firstMistake}' agar lebih jelas.`
    : 'Luar biasa! Pengucapan dan struktur kalimatmu sudah sangat tepat.';

  store.markSessionProgress();
  router.push('/practice/result');
};

const runSimulatedResult = () => {
  if (store.selectedTopicIndex === 0) {
    store.recording.transcriptWords = [
      { text: 'My', error: false },
      { text: 'name', error: false },
      { text: 'is', error: false },
      { text: 'Sania,', error: false },
      { text: 'and', error: false },
      { text: 'I', error: false },
      { text: 'studi', error: true, expected: 'study' },
      { text: 'at', error: false },
      { text: 'SMAN', error: false },
      { text: '1', error: false },
      { text: 'Kejayan', error: false }
    ];
    store.recording.totalScore = 82;
    store.recording.grammarScore = 90;
    store.recording.pronunciationScore = 75;
    store.recording.feedback = "Hampir tepat! Ucapkan study seperti *stadi*";
  } else {
    const words = currentTopic.value.prompt.split(' ').map((w, i) => ({
      text: w,
      error: i === 2
    }));
    store.recording.transcriptWords = words;
    store.recording.totalScore = 85;
    store.recording.grammarScore = 92;
    store.recording.pronunciationScore = 78;
    store.recording.feedback = `Bagus! Perjelas kata '${words[2].text}' saat diucapkan.`;
  }
  store.markSessionProgress();
  router.push('/practice/result');
};

const openTranslateFromResult = () => {
  const t = currentTopic.value;
  store.translation.inputText = t.samplePhrase;
  store.translation.meaning = t.sampleMeaning;
  store.translation.phonetic = t.samplePhonetic;
  store.translation.explanation = t.sampleExplanation;
  router.push('/translate');
};

onBeforeUnmount(() => {
  if (isRecording.value) stopRecording(true);
});
</script>

<template>
  <!-- TAB: HASIL LATIHAN -->
  <section v-if="tab === 'result'" class="screen-enter flex-1 flex flex-col justify-between p-5 sm:p-8">
    <div>
      <div class="flex items-center justify-between mb-4">
        <button @click="router.push('/practice/record')" class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-200/60">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="font-display text-lg sm:text-xl font-extrabold text-slate-900">Hasil latihan</h1>
        <div class="w-8"></div>
      </div>

      <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-xs font-semibold text-slate-400">Transkrip suaramu:</span>
          <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span> Perlu diperbaiki
          </span>
        </div>
        <p class="font-display text-lg sm:text-xl font-bold text-slate-800 leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
          <span v-for="(w, idx) in store.recording.transcriptWords" :key="idx"
            :class="w.error ? 'px-1.5 py-0.5 rounded-lg bg-rose-100 text-rose-600 underline decoration-rose-400 decoration-wavy' : ''">
            {{ w.text }}
          </span>
        </p>
      </div>

      <div class="my-7 flex flex-col items-center">
        <div class="w-32 h-32 rounded-full bg-gradient-to-br from-mint-50 to-brand-50 border-4 border-mint-500 shadow-lg shadow-mint-500/15 flex flex-col items-center justify-center">
          <span class="font-display text-4xl sm:text-5xl font-extrabold text-slate-900">{{ store.recording.totalScore }}</span>
          <span class="text-[11px] font-bold uppercase tracking-wider text-mint-600">Skor Total</span>
        </div>

        <div class="flex items-center gap-3 mt-4">
          <span class="px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs sm:text-sm font-bold">
            Grammar {{ store.recording.grammarScore }}
          </span>
          <span class="px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-bold">
            Pengucapan {{ store.recording.pronunciationScore }}
          </span>
        </div>
      </div>

      <div class="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 text-center">
        <p class="text-sm sm:text-base font-bold text-slate-800" v-html="formattedFeedback"></p>
      </div>
    </div>

    <div class="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button @click="openTranslateFromResult" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all">
        Lihat artinya
      </button>
      <button @click="router.push('/closing/summary')" class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm transition-all">
        Selesaikan Sesi
      </button>
    </div>
  </section>

  <!-- TAB: REKAM VOICE NOTE (DEFAULT) -->
  <section v-else class="screen-enter flex-1 flex flex-col justify-between p-5 sm:p-8">
    <div>
      <div class="flex items-center justify-between mb-4">
        <button @click="router.push('/home')" class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-200/60">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-xs font-bold text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full">Rekam Voice Note</span>
        <div class="w-8"></div>
      </div>

      <h1 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-5">
        {{ currentTopic.title }}
      </h1>

      <div class="bg-white rounded-3xl p-6 border-2 border-brand-100 shadow-sm relative">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-600">Ucapkan :</span>
          <button @click="store.speakEnglish(currentTopic.prompt)"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span>Dengar</span>
          </button>
        </div>
        <p class="font-display text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
          "{{ currentTopic.prompt }}"
        </p>
      </div>
    </div>

    <div class="my-8 flex flex-col items-center">
      <div class="h-24 flex items-center justify-center gap-2 px-6">
        <div v-for="(h, idx) in barHeights" :key="idx"
          :class="isRecording ? 'bg-brand-600 wave-bar-active' : 'bg-slate-300'"
          :style="{ height: (isRecording ? h : 28) + '%', animationDelay: (idx * 0.08) + 's' }"
          class="w-2 rounded-full transition-all duration-200"></div>
      </div>

      <div :class="isRecording ? 'text-rose-600' : 'text-slate-700'"
        class="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider mt-3">
        {{ formattedTimer }}
      </div>
      <p class="text-xs sm:text-sm text-slate-400 mt-1">
        {{ isRecording ? 'Mendengarkan suaramu...' : 'Tekan tombol di bawah untuk mulai bicara' }}
      </p>
    </div>

    <div class="flex flex-col items-center pb-4 space-y-3">
      <button @click="toggleRecording"
        :class="isRecording ? 'bg-rose-600 shadow-rose-600/30 ring-8 ring-rose-100' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/30 ring-8 ring-brand-100'"
        class="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 text-white">
        <div v-if="isRecording" class="w-7 h-7 rounded-md bg-white"></div>
        <svg v-else class="w-9 h-9" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
        </svg>
      </button>

      <span :class="isRecording ? 'text-rose-600' : 'text-slate-700'" class="text-xs sm:text-sm font-bold">
        {{ isRecording ? 'Ketuk untuk berhenti' : 'Rekam' }}
      </span>

      <button @click="runSimulatedResult" class="text-xs font-semibold text-slate-400 hover:text-brand-600 underline pt-1">
        Atau lihat demo hasil koreksi langsung
      </button>
    </div>
  </section>
</template>