<script setup>
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();

const handleGoogleLogin = async () => {
  await store.loginWithGoogle();
};
</script>

<template>
  <section class="screen-enter min-h-[85vh] flex items-center justify-center p-5">
    <div class="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-9 shadow-sm space-y-6 text-center">
      <!-- Logo & Judul -->
      <div class="space-y-2">
        <div class="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-3xl font-extrabold mx-auto shadow-md">
          S
        </div>
        <h1 class="font-display text-2xl font-extrabold text-slate-900 pt-2">
          Masuk ke SpeakUp
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Tautkan akun Google kamu untuk menyimpan progres latihan, streak harian, dan pencapaian belajar.
        </p>
      </div>

      <!-- Tombol Google OAuth Asli -->
      <div class="space-y-3 pt-2">
        <button
          @click="handleGoogleLogin"
          :disabled="store.isAuthLoading"
          class="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-brand-400 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <!-- Ikon Google SVG -->
          <svg v-if="!store.isAuthLoading" class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"/>
            <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"/>
          </svg>
          <span v-else class="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></span>

          <span>{{ store.isAuthLoading ? 'Menghubungkan ke Google...' : 'Lanjutkan dengan Google' }}</span>
        </button>

        <button
          @click="router.push('/')"
          class="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Kembali ke Halaman Awal
        </button>
      </div>

      <p class="text-[11px] text-slate-400 leading-normal">
        Autentikasi diamankan oleh Google & Supabase. Kami hanya membaca nama, email, dan foto profil akun Google kamu.
      </p>
    </div>
  </section>
</template>