<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../stores/appStore';
import AppLogo from '../components/AppLogo.vue';

const route = useRoute();
const router = useRouter();

const stage = computed(() => route.params.stage || 'summary');
</script>

<template>
  <!-- STAGE: GOODBYE -->
  <section v-if="stage === 'goodbye'" class="screen-enter fixed inset-0 z-40 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-brand-600 to-brand-800 text-white text-center">
    <div class="pt-6">
      <span class="px-4 py-1.5 rounded-full bg-white/15 text-xs sm:text-sm font-semibold">
        Pengingat aktif pukul {{ store.user.reminderTime }}
      </span>
    </div>

    <div class="flex flex-col items-center my-auto max-w-md">
      <AppLogo size="w-24 h-24 mb-6" />
      <h1 class="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Speak up..</h1>
      <p class="text-sm sm:text-base text-brand-100 mt-3 leading-relaxed">
        Terima kasih sudah berani bicara hari ini, {{ store.user.name }}. Sampai jumpa besok!
      </p>
    </div>

    <div class="w-full max-w-md pb-4">
      <button @click="router.push('/')" class="w-full py-4 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold text-sm border border-white/20 transition-all">
        Buka Aplikasi Lagi
      </button>
    </div>
  </section>

  <!-- STAGE: SUMMARY (DEFAULT) -->
  <section v-else class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-b from-mint-50/70 via-white to-brand-50/50">
    <div class="max-w-md mx-auto w-full text-center">
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-mint-100 text-mint-700 text-xs font-bold mb-3">
        <span>🎉</span> Hebat, {{ store.user.name }}!
      </div>
      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">Sesi Selesai!</h1>

      <div class="my-6 flex flex-col items-center">
        <div class="w-32 h-32 rounded-full bg-white border-4 border-brand-600 shadow-xl shadow-brand-600/15 flex flex-col items-center justify-center">
          <span class="font-display text-5xl font-extrabold text-brand-600">{{ store.recording.totalScore || 82 }}</span>
          <span class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Poin</span>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 text-left">
        <div class="flex items-center justify-between py-2 border-b border-slate-100">
          <span class="text-xs sm:text-sm font-semibold text-slate-500">Skor sesi</span>
          <span class="font-display text-base font-extrabold text-slate-900">{{ store.recording.totalScore || 82 }}</span>
        </div>
        <div class="flex items-center justify-between py-2 border-b border-slate-100">
          <span class="text-xs sm:text-sm font-semibold text-slate-500">Streak</span>
          <span class="font-display text-base font-extrabold text-amber-600">🔥 {{ store.user.streak }} hari</span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-xs sm:text-sm font-semibold text-slate-500">Kata baru</span>
          <span class="font-display text-base font-extrabold text-mint-600">+{{ store.user.newWords }} kata</span>
        </div>
      </div>

      <div class="mt-4 bg-brand-50/80 border border-brand-100 rounded-2xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-3 text-left">
          <span class="text-xl">⏰</span>
          <div>
            <p class="text-xs sm:text-sm font-bold text-slate-800">Pengingat besok {{ store.user.reminderTime }}</p>
            <p class="text-[11px] text-slate-500">Jaga streak belajarmu tetap menyala</p>
          </div>
        </div>
        <input type="time" v-model="store.user.reminderTime" @change="store.showToast('Pengingat diatur ke pukul ' + store.user.reminderTime, 'success')"
          class="px-3 py-1.5 rounded-xl bg-white border border-brand-200 text-xs font-bold text-brand-700" />
      </div>

      <div class="pt-6 pb-2 space-y-2.5">
        <button @click="router.push('/closing/goodbye')" class="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition-all">
          Selesai
        </button>
        <button @click="router.push('/home')" class="w-full py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-600">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  </section>
</template>