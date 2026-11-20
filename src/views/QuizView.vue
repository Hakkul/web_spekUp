<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();

const currentIndex = ref(0);
const score = ref(0);
const answered = ref(null);

const questions = [
  {
    q: "Bagaimana cara baca yang tepat untuk kata 'study'?",
    options: ["stadi", "studi", "stedi", "stodai"],
    answer: 0,
    info: "'Study' dilafalkan /ˈstʌdi/ atau seperti 'stadi'."
  },
  {
    q: "Preposisi yang tepat sebelum nama sekolah spesifik: 'I study ___ SMAN 1 Kejayan'",
    options: ["in", "on", "at", "to"],
    answer: 2,
    info: "Gunakan 'at' sebelum nama institusi atau tempat spesifik."
  },
  {
    q: "Arti dari kalimat 'I speak with confidence' adalah...",
    options: ["Saya berbicara dengan cepat", "Saya berbicara dengan percaya diri", "Saya takut berbicara", "Saya belajar membaca"],
    answer: 1,
    info: "'Confidence' berarti rasa percaya diri."
  }
];

const currentQuestion = computed(() => questions[currentIndex.value]);

const optionClass = (idx) => {
  if (answered.value === null) {
    return 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-800';
  }
  if (idx === currentQuestion.value.answer) {
    return 'border-mint-500 bg-mint-50 text-mint-800 font-bold';
  }
  if (idx === answered.value) {
    return 'border-rose-500 bg-rose-50 text-rose-700';
  }
  return 'border-slate-200 bg-slate-50/50 text-slate-400';
};

const answerQuiz = (idx) => {
  if (answered.value !== null) return;
  answered.value = idx;
  if (idx === currentQuestion.value.answer) {
    score.value += 1;
    store.user.newWords += 1;
  }
};

const nextQuestion = () => {
  currentIndex.value += 1;
  answered.value = null;
};

const resetQuiz = () => {
  currentIndex.value = 0;
  score.value = 0;
  answered.value = null;
};
</script>

<template>
  <section class="screen-enter p-5 sm:p-8 flex-1 flex flex-col">
    <div v-if="currentIndex >= questions.length" class="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
      <div class="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-4xl mb-4">🏆</div>
      <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">Kuis Selesai!</h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-1 mb-6">Kamu menjawab benar {{ score }} dari {{ questions.length }} soal</p>
      <div class="flex gap-3 w-full">
        <button @click="resetQuiz" class="flex-1 py-3.5 rounded-2xl border border-slate-200 bg-white font-bold text-sm text-slate-700">
          Ulangi Kuis
        </button>
        <button @click="router.push('/home')" class="flex-1 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm">
          Ke Beranda
        </button>
      </div>
    </div>

    <div v-else class="space-y-5">
      <div class="flex items-center justify-between">
        <h1 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900">Kuis Cepat</h1>
        <span class="px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-xs font-bold">
          Soal {{ currentIndex + 1 }}/{{ questions.length }}
        </span>
      </div>

      <div class="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm">
        <p class="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
          {{ currentQuestion.q }}
        </p>

        <div class="space-y-3">
          <button v-for="(opt, idx) in currentQuestion.options" :key="idx"
            @click="answerQuiz(idx)" :disabled="answered !== null"
            :class="optionClass(idx)"
            class="w-full p-4 rounded-2xl border text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between">
            <span>{{ opt }}</span>
            <span v-if="answered !== null && idx === currentQuestion.answer">✓</span>
          </button>
        </div>

        <div v-if="answered !== null" class="mt-5 space-y-4">
          <div class="p-4 rounded-2xl bg-brand-50 text-xs sm:text-sm text-brand-800 leading-relaxed">
            <strong>Catatan Coach:</strong> {{ currentQuestion.info }}
          </div>
          <button @click="nextQuestion" class="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm">
            Lanjut
          </button>
        </div>
      </div>
    </div>
  </section>
</template>