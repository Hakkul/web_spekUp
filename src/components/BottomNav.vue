<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const navItems = [
  { name: 'home', label: 'Beranda', path: '/home', match: ['home', 'translate'], icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'practice', label: 'Latihan', path: '/practice/record', match: ['practice'], icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { name: 'quiz', label: 'Kuis', path: '/quiz', match: ['quiz'], icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { name: 'profile', label: 'Profil', path: '/profile', match: ['profile'], icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
];

const isActive = (item) => item.match.includes(route.name);
</script>

<template>
  <nav class="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200/80 px-4 py-2.5 z-30">
    <div class="max-w-6xl mx-auto grid grid-cols-4 gap-3">
      <button v-for="item in navItems" :key="item.name" @click="router.push(item.path)"
        :class="isActive(item) ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-400 hover:text-slate-600'"
        class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
        </svg>
        <span>{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>