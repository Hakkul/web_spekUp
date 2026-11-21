import { reactive, watch } from 'vue';
import { CURRICULUM } from '../data/curriculum';

const STORAGE_KEY = 'speakup_vue_store_v2';

export const store = reactive({
  toasts: [],
  currentAudio: null,
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

  // Menyimpan progres 3 tahap untuk setiap kombinasi Jenjang-Tingkatan
  stageProgressMap: {},

  selectedTopicIndex: 0,
  recording: {
    transcriptWords: [],
    totalScore: 85,
    grammarScore: 90,
    pronunciationScore: 80,
    feedback: 'Bagus! Intonasi dan kejelasan pengucapanmu sudah terdengar alami.',
    sessionCompleted: false
  },
  translation: {
    inputText: 'I study at school',
    meaning: 'Aku belajar di sekolah',
    phonetic: 'ai stadi at skul',
    explanation: 'Study dipakai untuk kegiatan belajar. Pakai at sebelum nama tempat.'
  },

  getNormalizedLevel() {
    return this.user.level === 'Tinggi' ? 'Lanjut' : (this.user.level || 'Pemula');
  },

  getTrackKey() {
    const edu = this.user.education || 'SMA';
    const lvl = this.getNormalizedLevel();
    return `${edu}-${lvl}`;
  },

  getCurrentTrack() {
    const edu = CURRICULUM[this.user.education] ? this.user.education : 'SMA';
    const lvl = this.getNormalizedLevel();
    return CURRICULUM[edu][lvl] || CURRICULUM.SMA.Pemula;
  },

  getTrackProgress() {
    const key = this.getTrackKey();
    if (!this.stageProgressMap[key]) {
      this.stageProgressMap[key] = {
        unlockedStage: 1,
        stage1Passed: false,
        stage2Passed: false,
        stage3Passed: false
      };
    }
    return this.stageProgressMap[key];
  },

  completeStage(stageNumber) {
    const prog = this.getTrackProgress();
    if (stageNumber === 1) {
      prog.stage1Passed = true;
      prog.unlockedStage = Math.max(prog.unlockedStage, 2);
      this.user.newWords += 5;
      this.user.weeklyProgress = Math.min(100, this.user.weeklyProgress + 20);
    } else if (stageNumber === 2) {
      prog.stage2Passed = true;
      prog.unlockedStage = Math.max(prog.unlockedStage, 3);
      this.user.streak += 1;
      this.user.newWords += 4;
      this.user.weeklyProgress = Math.min(100, this.user.weeklyProgress + 25);
    } else if (stageNumber === 3) {
      prog.stage3Passed = true;
      this.user.newWords += 6;
      this.user.weeklyProgress = Math.min(100, this.user.weeklyProgress + 30);
    }
  },

  getActiveTopics() {
    const track = this.getCurrentTrack();
    const userName = this.user.name || 'Pelajar';
    const personalizedPrompt = track.speaking.targetText.replace(/\b(Dimas|Sania|Reza)\b/g, userName);

    return [
      {
        id: 'stage2-speaking',
        title: track.speaking.title,
        prompt: personalizedPrompt,
        samplePhrase: track.speaking.title,
        sampleMeaning: track.speaking.instruction,
        samplePhonetic: track.speaking.hint,
        sampleExplanation: 'Bacalah dengan artikulasi jelas dan tempo stabil.'
      },
      {
        id: 'stage3-reading',
        title: track.reading.title,
        prompt: track.reading.passage,
        samplePhrase: track.reading.title,
        sampleMeaning: 'Bacaan Pemahaman',
        samplePhonetic: 'Klik Dengar untuk menyimak pelafalan bacaan',
        sampleExplanation: 'Perhatikan tanda baca titik dan koma saat membaca paragraf.'
      }
    ];
  },

  getActiveQuizzes() {
    return this.getCurrentTrack().quiz;
  },

  showToast(message, type = 'info') {
    const id = Date.now() + Math.random();
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 2800);
  },

  speakEnglish(text) {
    if (!text) return;

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
        if (err?.name === 'AbortError') return;

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
    this.stageProgressMap = {};
    localStorage.removeItem(STORAGE_KEY);
    this.showToast('Semua progres tahap & skor berhasil direset ke 0!', 'info');
  }
});

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved) {
    if (saved.user) Object.assign(store.user, saved.user);
    if (saved.stageProgressMap) store.stageProgressMap = saved.stageProgressMap;
    if (Array.isArray(saved.accounts)) store.accounts = saved.accounts;
    if (Array.isArray(saved.googleCandidates) && saved.googleCandidates.length) {
      store.googleCandidates = saved.googleCandidates;
    }
  }
} catch (e) {}

watch(
  () => ({
    user: store.user,
    stageProgressMap: store.stageProgressMap,
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