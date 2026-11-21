<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();
const avatarError = ref(false);

const educations = ['SD', 'SMP', 'SMA', 'Kuliah', 'Umum'];
const levels = ['Pemula', 'Menengah', 'Lanjut'];

const updateTrack = (edu, lvl) => {
  store.user.education = edu;
  store.user.level = lvl;
  store.user.onboardingCompleted = true;
  store.showToast(`Kurikulum diubah ke ${edu} - Level ${lvl}`, 'success');
};

const connectOrSwitchGoogle = async () => {
  await store.loginWithGoogle();
};

const handleLogout = async () => {
  await store.logout(router);
};
</script>

<template>
  <section class="screen-enter p-5 sm:p-8 space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900">Profil Pelajar</h1>
      <button @click="router.push('/closing/summary')" class="text-xs font-bold text-rose-600 bg-rose-50 px-3.5 py-2 rounded-xl">
        Tutup Sesi
      </button>
    </div>

    <!-- Kartu Info Profil -->
    <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
      <img
        v-if="store.user.avatar && !avatarError"
        :src="store.user.avatar"
        :alt="store.user.name"
        @error="avatarError = true"
        class="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
      />
      <div
        v-else
        class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 text-white font-display text-2xl font-extrabold flex items-center justify-center shrink-0"
      >
        {{ (store.user.name || 'P').charAt(0).toUpperCase() }}
      </div>

      <div class="min-w-0 flex-1">
        <h2 class="font-display text-lg sm:text-xl font-extrabold text-slate-900 truncate">{{ store.user.name }}</h2>
        <p class="text-xs sm:text-sm text-slate-500 truncate">{{ store.user.email || 'Belum ada email' }}</p>
        <div class="flex flex-wrap items-center gap-1.5 mt-2">
          <span v-if="store.user.education" class="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
            {{ store.user.education }}
          </span>
          <span v-if="store.user.level" class="px-2.5 py-0.5 rounded-full bg-mint-50 text-mint-700 text-xs font-bold">
            Level {{ store.user.level }}
          </span>
          <span :class="store.user.googleLinked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
            class="px-2.5 py-0.5 rounded-full text-xs font-bold">
            {{ store.user.googleLinked ? 'Google Verified' : 'Belum Tertaut' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Kartu Status Tautan Akun -->
    <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Status Tautan Akun</span>
        <span :class="store.user.googleLinked ? 'text-mint-600' : 'text-amber-600'" class="text-xs font-bold">
          {{ store.user.googleLinked ? '● Akun Google terhubung' : '○ Belum terhubung Google' }}
        </span>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
        <template v-if="store.user.googleLinked">
          Terhubung dengan identitas Google <strong>{{ store.user.googleEmail || store.user.email }}</strong>.
        </template>
        <template v-else>
          Hubungkan akun Google agar progres belajarmu tertaut dengan identitas Google asli.
        </template>
      </p>

      <div class="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          @click="connectOrSwitchGoogle"
          :disabled="store.isAuthLoading"
          class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all disabled:opacity-60"
        >
          {{ store.isAuthLoading ? 'Menghubungkan...' : (store.user.googleLinked ? 'Ganti Akun Google' : 'Hubungkan Akun Google') }}
        </button>
      </div>
    </div>

    <!-- Kartu Pengaturan Jenjang & Tingkatan -->
    <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Target Kurikulum</span>
        <p class="text-xs text-slate-500 mt-0.5">Pilih jenjang dan tingkat kesulitan materi latihanmu</p>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-slate-700">Jenjang Pendidikan</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="edu in educations"
            :key="edu"
            type="button"
            @click="updateTrack(edu, store.user.level || 'Pemula')"
            :class="(store.user.education || 'Umum') === edu
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
            class="px-3.5 py-2 rounded-xl border text-xs font-bold transition-all"
          >
            {{ edu }}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-slate-700">Tingkatan Level</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="lvl in levels"
            :key="lvl"
            type="button"
            @click="updateTrack(store.user.education || 'Umum', lvl)"
            :class="(store.user.level || 'Pemula') === lvl
              ? 'bg-mint-600 text-white border-mint-600'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
            class="py-2 rounded-xl border text-xs font-bold transition-all"
          >
            {{ lvl }}
          </button>
        </div>
      </div>
    </div>

    <!-- Statistik -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-5 rounded-3xl border border-slate-200/80 text-center">
        <span class="text-2xl">🔥</span>
        <p class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{{ store.user.streak }} Hari</p>
        <p class="text-xs text-slate-500">Streak Aktif</p>
      </div>
      <div class="bg-white p-5 rounded-3xl border border-slate-200/80 text-center">
        <span class="text-2xl">📚</span>
        <p class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{{ store.user.newWords }} Kata</p>
        <p class="text-xs text-slate-500">Kosakata Baru</p>
      </div>
    </div>

    <!-- Pengingat -->
    <div class="bg-white rounded-3xl p-5 border border-slate-200/80">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm sm:text-base font-bold text-slate-800">Pengingat Latihan Harian</p>
          <p class="text-xs text-slate-500">Notifikasi rutin agar tidak lupa latihan</p>
        </div>
        <input type="time" v-model="store.user.reminderTime" @change="store.showToast('Pengingat harian diatur ke pukul ' + store.user.reminderTime, 'success')"
          class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-brand-700 bg-brand-50" />
      </div>
    </div>

    <button @click="handleLogout" class="w-full py-3.5 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-all">
      Keluar Akun
    </button>
  </section>
</template>