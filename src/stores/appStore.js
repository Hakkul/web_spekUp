import { reactive, watch } from 'vue';
import { CURRICULUM } from '../data/curriculum';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'speakup_vue_store_v2';

export const store = reactive({
  toasts: [],
  currentAudio: null,
  isAuthLoading: false,
  accounts: [],

  user: {
    id: '',
    name: 'Pelajar',
    email: '',
    avatar: '',
    provider: 'google',
    isLoggedIn: false,
    googleLinked: false,
    googleEmail: '',
    onboardingCompleted: false,
    education: '',
    level: '',
    streak: 0,
    newWords: 0,
    weeklyProgress: 0,
    reminderTime: '19:00',
    micPermission: false,
    privacyAgreed: false,
    parentalAgreed: false
  },

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

  syncGoogleUser(sessionUser) {
    if (!sessionUser) return;
    const meta = sessionUser.user_metadata || {};

    this.user.id = sessionUser.id;
    this.user.email = sessionUser.email || this.user.email;
    this.user.googleEmail = sessionUser.email || this.user.googleEmail;
    this.user.name = meta.full_name || meta.name || sessionUser.email?.split('@')[0] || 'Pelajar';
    this.user.avatar = meta.avatar_url || meta.picture || '';
    this.user.provider = 'google';
    this.user.googleLinked = true;
    this.user.isLoggedIn = true;
  },

  async initAuth(router) {
    supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_IN' && currentSession?.user) {
        const wasLoggedIn = this.user.isLoggedIn;
        this.syncGoogleUser(currentSession.user);
        this.isAuthLoading = false;

        if (!wasLoggedIn) {
          this.showToast(`Selamat datang, ${this.user.name}!`, 'success');
        }

        if (router) {
          const currentPath = router.currentRoute?.value?.path || '';
          if (currentPath === '/' || currentPath.startsWith('/auth')) {
            router.push(this.user.onboardingCompleted ? '/home' : '/onboarding');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        this.user.id = '';
        this.user.name = 'Pelajar';
        this.user.email = '';
        this.user.googleEmail = '';
        this.user.isLoggedIn = false;
        this.user.googleLinked = false;
        this.user.avatar = '';
        if (router) router.push('/');
      }
    });
  },

  async loginWithGoogle() {
    this.isAuthLoading = true;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      this.isAuthLoading = false;
      this.showToast('Gagal membuka login Google: ' + error.message, 'warning');
    }
  },

  async logout(router) {
    await supabase.auth.signOut();
    this.user.id = '';
    this.user.name = 'Pelajar';
    this.user.email = '';
    this.user.googleEmail = '';
    this.user.isLoggedIn = false;
    this.user.googleLinked = false;
    this.user.avatar = '';
    this.showToast('Berhasil keluar dari akun.', 'info');
    if (router) router.push('/');
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
  }
} catch (e) {}

watch(
  () => ({
    user: store.user,
    stageProgressMap: store.stageProgressMap,
    accounts: store.accounts
  }),
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch (e) {}
  },
  { deep: true }
);