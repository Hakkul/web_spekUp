<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();

const quizzes = computed(() => store.getActiveQuizzes());
const currentIndex = ref(0);
const selectedOption = ref(null);
const isAnswered = ref(false);
const score = ref(0);
const isFinished = ref(false);

const currentQuestion = computed(() => quizzes.value[currentIndex.value] || null);

// Reset kuis otomatis jika pengguna mengganti level
watch(() => store.user.level, () => {
  restartQuiz();
});

const selectAnswer = (idx) => {
  if (isAnswered.value || !currentQuestion.value) return;
  selectedOption.value = idx;
  isAnswered.value = true;

  if (idx === currentQuestion.value.answer) {
    score.value += 1;
    store.showToast('Jawaban tepat! 🎉', 'success');
  } else {
    store.showToast('Kurang tepat, cek penjelasannya ya!', 'warning');
  }
};

const nextQuestion = () => {
  if (currentIndex.value < quizzes.value.length - 1) {
    currentIndex.value += 1;
    selectedOption.value = null;
    isAnswered.value = false;
  } else {
    isFinished.value = true;
    store.user.newWords += score.value;
    store.user.weeklyProgress = Math.min(100, store.user.weeklyProgress + 15);
  }
};

const restartQuiz = () => {
  currentIndex.value = 0;
  selectedOption.value = null;
  isAnswered.value = false;
  score.value = 0;
  isFinished.value = false;
};
</script>

<template>
  <section class="screen-enter p-5 sm:p-8 lg:py-10 max-w-3xl mx-auto w-full space-y-6">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="router.push('/home')" class="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900">Kuis Cepat</h1>
          <p class="text-xs text-slate-500">Tingkatan: <span class="font-bold text-brand-600">{{ store.user.level }}</span> • {{ store.user.education }}</p>
        </div>
      </div>

      <span v-if="!isFinished && quizzes.length" class="px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700">
        Soal {{ currentIndex + 1 }} / {{ quizzes.length }}
      </span>
    </header>

    <!-- Tampilan Selesai Kuis -->
    <div v-if="isFinished" class="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-10 text-center shadow-sm space-y-5">
      <div class="w-20 h-20 rounded-3xl bg-mint-50 text-mint-600 flex items-center justify-center text-4xl mx-auto">
        🏆
      </div>
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-900">Kuis Selesai!</h2>
        <p class="text-sm text-slate-500 mt-1">Kamu menjawab benar <span class="font-bold text-mint-600">{{ score }} dari {{ quizzes.length }}</span> soal.</p>
      </div>

      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 max-w-xs mx-auto">
        <p class="text-xs text-slate-500">Skor Akhir</p>
        <p class="font-display text-3xl font-extrabold text-brand-600 mt-0.5">
          {{ Math.round((score / quizzes.length) * 100) }}%
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
        <button @click="restartQuiz" class="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all">
          Ulangi Kuis
        </button>
        <button @click="router.push('/home')" class="flex-1 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all">
          Kembali ke Beranda
        </button>
      </div>
    </div>

    <!-- Kartu Soal Aktif -->
    <div v-else-if="currentQuestion" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <!-- Progress Bar -->
      <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-brand-600 transition-all duration-300"
          :style="{ width: (((currentIndex + 1) / quizzes.length) * 100) + '%' }"></div>
      </div>

      <div class="space-y-2">
        <span class="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
          Pertanyaan {{ currentIndex + 1 }}
        </span>
        <h2 class="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {{ currentQuestion.question }}
        </h2>
      </div>

      <!-- Pilihan Jawaban -->
      <div class="space-y-3">
        <button v-for="(opt, idx) in currentQuestion.options" :key="idx" @click="selectAnswer(idx)"
          :disabled="isAnswered"
          :class="[
            !isAnswered ? 'border-slate-200 bg-slate-50/70 hover:bg-brand-50/50 hover:border-brand-300 text-slate-800' : '',
            isAnswered && idx === currentQuestion.answer ? 'border-mint-500 bg-mint-50 text-mint-800 font-bold' : '',
            isAnswered && selectedOption === idx && idx !== currentQuestion.answer ? 'border-rose-400 bg-rose-50 text-rose-700' : '',
            isAnswered && idx !== currentQuestion.answer && selectedOption !== idx ? 'border-slate-200 bg-white text-slate-400 opacity-70' : ''
          ]"
          class="w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between gap-3">
          <span>{{ opt }}</span>
          <span v-if="isAnswered && idx === currentQuestion.answer" class="text-mint-600 font-bold">✓</span>
          <span v-else-if="isAnswered && selectedOption === idx && idx !== currentQuestion.answer" class="text-rose-500 font-bold">✕</span>
        </button>
      </div>

      <!-- Penjelasan setelah menjawab -->
      <div v-if="isAnswered" class="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 space-y-1">
        <p class="text-xs font-bold text-brand-700">💡 Penjelasan</p>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">{{ currentQuestion.explanation }}</p>
      </div>

      <div v-if="isAnswered" class="pt-1">
        <button @click="nextQuestion" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all">
          {{ currentIndex < quizzes.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil Kuis' }}
        </button>
      </div>
    </div>
  </section>
</template>