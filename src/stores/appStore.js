import { reactive, watch } from 'vue';

const STORAGE_KEY = 'speakup_vue_store_v1';

export const store = reactive({
  toasts: [],
  accounts: [],
  googleCandidates: [
    {
      name: 'Sania Putri',
      email: 'sania.putri@gmail.com',
      googleSub: 'google-oauth2|1001',
      avatarColor: 'from-brand-500 to-indigo-600'
    }
  ],
  googleModal: {
    isOpen: false,
    step: 'picker',
    selectedCandidate: null,
    pendingName: '',
    pendingEmail: '',
    pendingEducation: 'SMA'
  },
  user: {
    id: '',
    name: 'Pelajar',
    email: '',
    provider: 'email',
    googleLinked: false,
    googleEmail: '',
    education: 'SMA',
    level: 'Pemula',
    streak: 0,
    newWords: 0,
    weeklyProgress: 0,
    reminderTime: '19:00',
    micPermission: false,
    privacyAgreed: false,
    parentalAgreed: false
  },
  topics: [
    {
      id: 'intro',
      title: 'Perkenalkan dirimu',
      prompt: 'My name is Sania, and I study at SMAN 1 Kejayan',
      samplePhrase: 'I study at school',
      sampleMeaning: 'Aku belajar di sekolah',
      samplePhonetic: 'ai stadi at skul',
      sampleExplanation: "Study dipakai untuk kegiatan belajar. Pakai 'at' sebelum nama tempat."
    },
    {
      id: 'hobby',
      title: 'Ceritakan hobimu',
      prompt: 'I like reading books and listening to music in my free time',
      samplePhrase: 'in my free time',
      sampleMeaning: 'di waktu luangku',
      samplePhonetic: 'in mai fri taim',
      sampleExplanation: "Gunakan 'in my free time' untuk menjelaskan aktivitas saat tidak sibuk."
    },
    {
      id: 'daily',
      title: 'Aktivitas pagi hari',
      prompt: 'I wake up at five in the morning and go to school by bicycle',
      samplePhrase: 'go to school by bicycle',
      sampleMeaning: 'pergi ke sekolah naik sepeda',
      samplePhonetic: 'gou tu skul bai baisikel',
      sampleExplanation: "Pakai 'by' sebelum alat transportasi tanpa kata sandang (by bicycle, by bus)."
    }
  ],
  selectedTopicIndex: 0,
  recording: {
    transcriptWords: [
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
    ],
    totalScore: 82,
    grammarScore: 90,
    pronunciationScore: 75,
    feedback: "Hampir tepat! Ucapkan 'study' seperti *stadi*",
    sessionCompleted: false
  },
  translation: {
    inputText: 'I study at school',
    meaning: 'Aku belajar di sekolah',
    phonetic: 'ai stadi at skul',
    explanation: 'Study dipakai untuk kegiatan belajar. Pakai at sebelum nama tempat.'
  },

  showToast(message, type = 'info') {
    const id = Date.now() + Math.random();
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 2800);
  },

currentAudio: null,

  speakEnglish(text) {
    if (!text) return;

    // Hentikan audio yang sedang berjalan agar tidak bertumpuk
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
    this.currentAudio = audio;

    audio.play()
      .then(() => {
        this.showToast('Memutar pengucapan bahasa Inggris...', 'info');
      })
      .catch((err) => {
        // Abaikan jika terpotong karena tombol diklik dua kali
        if (err?.name === 'AbortError') return;

        // Cadangan offline pakai suara bawaan browser
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = 0.92;
          utterance.onstart = () => this.showToast('Memutar pengucapan bahasa Inggris...', 'info');
          utterance.onerror = () => this.showToast('Gagal memutar suara. Cek koneksi atau volume.', 'warning');
          window.speechSynthesis.speak(utterance);
        } else {
          this.showToast('Gagal memutar suara. Cek koneksi atau volume.', 'warning');
        }
      });
  },

  markSessionProgress() {
    if (!this.recording.sessionCompleted) {
      this.recording.sessionCompleted = true;
      this.user.streak += 1;
      this.user.newWords += 2;
      this.user.weeklyProgress = Math.min(100, this.user.weeklyProgress + 25);
    }
  },

  resetProgress() {
    this.user.streak = 0;
    this.user.newWords = 0;
    this.user.weeklyProgress = 0;
    this.recording.sessionCompleted = false;
    localStorage.removeItem(STORAGE_KEY);
    this.showToast('Progres berhasil direset ke 0!', 'info');
  }
});

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved) {
    if (saved.user) Object.assign(store.user, saved.user);
    if (Array.isArray(saved.accounts)) store.accounts = saved.accounts;
    if (Array.isArray(saved.googleCandidates) && saved.googleCandidates.length) {
      store.googleCandidates = saved.googleCandidates;
    }
  }
} catch (e) {}

watch(
  () => ({
    user: store.user,
    accounts: store.accounts,
    googleCandidates: store.googleCandidates
  }),
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch (e) {}
  },
  { deep: true }
);