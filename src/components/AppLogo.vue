<script setup>
defineProps({
  size: {
    type: String,
    default: 'w-20 h-20'
  }
});
</script>

<template>
  <div :class="size" class="rounded-3xl bg-gradient-to-br from-brand-500 to-mint-500 p-3.5 shadow-lg shadow-brand-500/25 flex items-center justify-center relative shrink-0">
    <svg viewBox="0 0 64 64" class="w-full h-full text-white" fill="none">
      <path d="M12 16C12 11.5817 15.5817 8 20 8H44C48.4183 8 52 11.5817 52 16V38C52 42.4183 48.4183 46 44 46H26L14 55V46H20C15.5817 46 12 42.4183 12 38V16Z" fill="white" fill-opacity="0.18" stroke="white" stroke-width="3.2" stroke-linejoin="round"/>
      <circle cx="21" cy="31" r="2.8" fill="white"/>
      <rect x="27" y="24" width="4.5" height="10" rx="2.25" fill="white"/>
      <rect x="34.5" y="19" width="4.5" height="15" rx="2.25" fill="white"/>
      <path d="M44.5 14L49.5 19.5H46.5V34H42.5V19.5H39.5L44.5 14Z" fill="#A7F3D0"/>
    </svg>
  </div>
</template>