<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from './stores/appStore';
import BottomNav from './components/BottomNav.vue';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  store.initAuth(router);
});

const toastColor = (type) => {
  const map = {
    info: 'bg-slate-900 text-white',
    success: 'bg-mint-600 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-rose-600 text-white'
  };
  return map[type] || map.info;
};
</script>

<template>
  <div class="w-full min-h-screen flex flex-col relative">
    <!-- Toast Notifications -->
    <div class="pointer-events-none fixed top-5 inset-x-4 z-50 flex flex-col items-center gap-2">
      <div v-for="t in store.toasts" :key="t.id" :class="toastColor(t.type)"
        class="pointer-events-auto px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium shadow-lg flex items-center gap-2 screen-enter">
        <span>{{ t.message }}</span>
      </div>
    </div>

    <!-- Halaman Aktif (Lebar otomatis mengikuti layar hingga max-w-6xl) -->
    <main class="flex-1 w-full max-w-6xl mx-auto flex flex-col">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <BottomNav v-if="route.meta.showNav" />
  </div>
</template>