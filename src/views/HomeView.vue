<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();
const activeTopics = computed(() => store.getActiveTopics());
const currentTopic = computed(() => activeTopics.value[store.selectedTopicIndex % activeTopics.value.length]);

const cycleTopic = () => {
  store.selectedTopicIndex = (store.selectedTopicIndex + 1) % activeTopics.value.length;
};

const openTranslateSample = () => {
  const t = currentTopic.value;
  store.translation.inputText = t.samplePhrase;
  store.translation.meaning = t.sampleMeaning;
  store.translation.phonetic = t.samplePhonetic;
  store.translation.explanation = t.sampleExplanation;
  router.push('/translate');
};
</script>

<template>
  <section class="screen-enter p-5 sm:p-8 lg:py-10 space-y-6">
    <!-- Header -->
    <header class="flex items-center justify-between pt-1">
      <div>
        <p class="text-xs sm:text-sm font-medium text-slate-500">Selamat datang kembali 👋</p>
        <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">Halo, {{ store.user.name }}</h1>
      </div>
      <div class="flex items-center gap-2.5">
        <div class="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-1.5 shadow-sm">
          <span class="text-base">🔥</span>
          <span class="text-xs sm:text-sm font-extrabold text-amber-700">Streak {{ store.user.streak }} hr</span>
        </div>
        <button @click="router.push('/closing/summary')" title="Selesai / Keluar Sesi" class="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Grid Utama: 1 Kolom di HP, 2 Kolom Proporsional di Laptop -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <!-- Kartu Sesi Hari Ini (7 Kolom) -->
      <div class="lg:col-span-7 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 p-6 sm:p-8 text-white shadow-lg shadow-brand-600/20 relative overflow-hidden flex flex-col justify-between">
        <div class="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/10"></div>
        <div class="absolute right-10 -top-8 w-24 h-24 rounded-full bg-mint-400/20"></div>

        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              Sesi hari ini • {{ store.user.level }}
            </span>
            <span class="text-xs text-brand-100 font-medium">~2 menit</span>
          </div>

          <h2 class="font-display text-xl sm:text-2xl font-extrabold mt-4 mb-1.5">
            {{ currentTopic.title }}
          </h2>
          <p class="text-xs sm:text-sm text-brand-100 mb-6">
            "{{ currentTopic.prompt }}"
          </p>
        </div>

        <div class="relative z-10 flex items-center gap-3">
          <button @click="router.push('/practice/record')" class="px-6 py-3 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 active:scale-95 font-bold text-sm shadow-sm transition-all flex items-center gap-2">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>Mulai</span>
          </button>
          <button @click="cycleTopic" class="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold transition-all">
            Ganti Topik
          </button>
        </div>
      </div>

      <!-- Kartu Tantangan Mingguan (5 Kolom) -->
      <div class="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-mint-100 text-mint-600 flex items-center justify-center text-lg">🎯</span>
              <h3 class="text-sm sm:text-base font-bold text-slate-800">Tantangan mingguan</h3>
            </div>
            <span class="text-sm sm:text-base font-extrabold text-mint-600">{{ store.user.weeklyProgress }}%</span>
          </div>
          <div class="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div class="h-full bg-gradient-to-r from-brand-500 to-mint-500 rounded-full transition-all duration-500" :style="{ width: store.user.weeklyProgress + '%' }"></div>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-500 mt-4 leading-relaxed">
          Selesaikan sesi voice note harianmu untuk mengumpulkan poin dan membuka lencana percaya diri minggu ini!
        </p>
      </div>
    </div>

    <!-- Menu Cepat -->
    <div class="space-y-3 pt-1">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Menu Cepat</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button @click="router.push('/quiz')" class="w-full bg-white hover:bg-slate-50 active:scale-[0.99] p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between transition-all text-left">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shrink-0">⚡</div>
            <div>
              <h4 class="font-display text-sm sm:text-base font-bold text-slate-900">Kuis cepat</h4>
              <p class="text-xs text-slate-500 mt-0.5">Uji pelafalan & kosakata dalam 1 menit</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button @click="openTranslateSample" class="w-full bg-white hover:bg-slate-50 active:scale-[0.99] p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between transition-all text-left">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-xl shrink-0">🔤</div>
            <div>
              <h4 class="font-display text-sm sm:text-base font-bold text-slate-900">Terjemahan & Cara baca</h4>
              <p class="text-xs text-slate-500 mt-0.5">Cek arti, pelafalan fonetik, dan penjelasan</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>