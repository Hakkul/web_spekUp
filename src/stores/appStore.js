import { reactive, watch } from 'vue';

const STORAGE_KEY = 'speakup_vue_store_v1';

const getEducationContext = (edu) => {
  switch (edu) {
    case 'SMP':
      return { place: 'SMP Negeri 1', role: 'junior high school student', goal: 'improve my English speaking' };
    case 'SMK':
      return { place: 'SMK Negeri 1', role: 'vocational school student', goal: 'prepare for my future career' };
    case 'Umum':
      return { place: 'my workplace', role: 'lifelong learner', goal: 'communicate fluently at work' };
    default: // SMA
      return { place: 'SMAN 1 Kejayan', role: 'high school student', goal: 'prepare for university' };
  }
};

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

 // Materi dibedakan berdasarkan Level (Pemula, Menengah, Lanjut)
  topicsByLevel: {
    Pemula: [
      {
        id: 'intro-basic',
        title: 'Perkenalan Singkat',
        getPrompt: (name, edu) => `My name is ${name}, and I am a ${getEducationContext(edu).role}`,
        samplePhrase: 'I am a student',
        sampleMeaning: 'Aku adalah seorang pelajar',
        samplePhonetic: 'ai em e styudent',
        sampleExplanation: "Gunakan 'am' setelah subjek 'I' untuk menyatakan identitas."
      },
      {
        id: 'hobby-basic',
        title: 'Hobi Sederhana',
        getPrompt: () => 'I like reading books and listening to music',
        samplePhrase: 'listening to music',
        sampleMeaning: 'mendengarkan musik',
        samplePhonetic: 'lisening tu myuzik',
        sampleExplanation: "Huruf 't' pada 'listening' tidak dibaca (silent t)."
      },
      {
        id: 'daily-basic',
        title: 'Rutinitas Pagi',
        getPrompt: () => 'I wake up at five in the morning every day',
        samplePhrase: 'in the morning',
        sampleMeaning: 'di pagi hari',
        samplePhonetic: 'in de morning',
        sampleExplanation: "Pakai preposisi 'in' untuk keterangan waktu pagi, siang, dan sore."
      }
    ],
    Menengah: [
      {
        id: 'goal-mid',
        title: 'Target & Rencana',
        getPrompt: (name, edu) => `Hi, I am ${name} from ${getEducationContext(edu).place}, and I want to ${getEducationContext(edu).goal}`,
        samplePhrase: 'want to improve',
        sampleMeaning: 'ingin meningkatkan',
        samplePhonetic: 'wont tu impruv',
        sampleExplanation: "Setelah 'want to', gunakan kata kerja bentuk pertama (verb 1)."
      },
      {
        id: 'opinion-mid',
        title: 'Menyampaikan Pendapat',
        getPrompt: () => 'In my opinion, practicing speaking every day builds confidence',
        samplePhrase: 'In my opinion',
        sampleMeaning: 'Menurut pendapatku',
        samplePhonetic: 'in mai epinyen',
        sampleExplanation: "Frasa pembuka sopan saat memberikan opini dalam diskusi."
      },
      {
        id: 'experience-mid',
        title: 'Pengalaman Kemarin',
        getPrompt: () => 'Yesterday I practiced English conversation with my classmates',
        samplePhrase: 'practiced conversation',
        sampleMeaning: 'berlatih percakapan',
        samplePhonetic: 'prektist konverseisyen',
        sampleExplanation: "Akhiran '-ed' pada 'practiced' dibaca seperti huruf 't'."
      }
    ],
    Lanjut: [
      {
        id: 'pitch-pro',
        title: 'Presentasi & Argumen',
        getPrompt: (name, edu) => `As a ${getEducationContext(edu).role}, I believe consistent communication unlocks global opportunities`,
        samplePhrase: 'global opportunities',
        sampleMeaning: 'peluang global / mendunia',
        samplePhonetic: 'gloubel oportyunitiz',
        sampleExplanation: "Tekankan suku kata ketiga pada kata 'oppor-TU-nities'."
      },
      {
        id: 'problem-pro',
        title: 'Pemecahan Masalah',
        getPrompt: () => 'Although speaking foreign languages feels intimidating, persistence overcomes hesitation',
        samplePhrase: 'overcomes hesitation',
        sampleMeaning: 'mengatasi keraguan',
        samplePhonetic: 'ouverkamz heziteisyen',
        sampleExplanation: "'Although' dipakai untuk menghubungkan dua klausa yang bertentangan."
      },
      {
        id: 'future-pro',
        title: 'Visi Masa Depan',
        getPrompt: () => 'Had I started practicing earlier, I would have felt much more articulate today',
        samplePhrase: 'much more articulate',
        sampleMeaning: 'jauh lebih fasih & terstruktur',
        samplePhonetic: 'mac mor artikyelet',
        sampleExplanation: "Bentuk inversi Conditional Type 3 untuk pengandaian masa lampau."
      }
    ]
  },

  // Soal Kuis dibedakan berdasarkan Level (Pemula, Menengah, Lanjut)
  quizzesByLevel: {
    Pemula: [
      {
        question: "Bagaimana pelafalan yang tepat untuk kata 'study'?",
        options: ['stadi', 'studi', 'stedi'],
        answer: 0,
        explanation: "Huruf 'u' pada 'study' dibaca pendek seperti 'a' (stadi)."
      },
      {
        question: "Pilih kalimat yang benar untuk menyatakan tempat belajar:",
        options: ['I study on school', 'I study at school', 'I study to school'],
        answer: 1,
        explanation: "Gunakan preposisi 'at' untuk lokasi spesifik seperti sekolah."
      }
    ],
    Menengah: [
      {
        question: "Manakah pelafalan yang benar untuk kata 'opinion'?",
        options: ['o-pi-ni-on', 'e-pin-yen', 'o-pai-nyen'],
        answer: 1,
        explanation: "Tekanan berada di suku kata kedua: e-PIN-yen."
      },
      {
        question: "Lengkapi kalimat: 'She has been ___ English for two years.'",
        options: ['learn', 'learned', 'learning'],
        answer: 2,
        explanation: "Present Perfect Continuous menggunakan 'has been + Verb-ing'."
      }
    ],
    Lanjut: [
      {
        question: "Apa arti frasa 'overcome hesitation' dalam konteks berbicara?",
        options: ['Menghindari percakapan', 'Mengatasi rasa ragu', 'Mempercepat tempo bicara'],
        answer: 1,
        explanation: "'Overcome' berarti mengatasi, dan 'hesitation' berarti keraguan."
      },
      {
        question: "Pilih struktur kalimat pengandaian (Conditional Type 3) yang tepat:",
        options: [
          'If I knew earlier, I would have joined.',
          'If I had known earlier, I would have joined.',
          'If I have known earlier, I will join.'
        ],
        answer: 1,
        explanation: "Conditional Type 3 menggunakan pola 'If + Past Perfect (had + V3), would have + V3'."
      }
    ]
  },

  // Soal Kuis dibedakan berdasarkan Level
  quizzesByLevel: {
    Pemula: [
      {
        question: "Bagaimana pelafalan yang tepat untuk kata 'study'?",
        options: ['stadi', 'studi', 'stedi'],
        answer: 0,
        explanation: "Huruf 'u' pada 'study' dibaca pendek seperti 'a' (stadi)."
      },
      {
        question: "Pilih kalimat yang benar untuk menyatakan tempat belajar:",
        options: ['I study on school', 'I study at school', 'I study to school'],
        answer: 1,
        explanation: "Gunakan preposisi 'at' untuk lokasi spesifik seperti sekolah."
      }
    ],
    Menengah: [
      {
        question: "Manakah pelafalan yang benar untuk kata 'opinion'?",
        options: ['o-pi-ni-on', 'e-pin-yen', 'o-pai-nyen'],
        answer: 1,
        explanation: "Tekanan berada di suku kata kedua: e-PIN-yen."
      },
      {
        question: "Lengkapi kalimat: 'She has been ___ English for two years.'",
        options: ['learn', 'learned', 'learning'],
        answer: 2,
        explanation: "Present Perfect Continuous menggunakan 'has been + Verb-ing'."
      }
    ],
    Tinggi: [
      {
        question: "Apa arti frasa 'overcome hesitation' dalam konteks berbicara?",
        options: ['Menghindari percakapan', 'Mengatasi rasa ragu', 'Mempercepat tempo bicara'],
        answer: 1,
        explanation: "'Overcome' berarti mengatasi, dan 'hesitation' berarti keraguan."
      },
      {
        question: "Pilih struktur kalimat pengandaian (Conditional Type 3) yang tepat:",
        options: [
          'If I knew earlier, I would have joined.',
          'If I had known earlier, I would have joined.',
          'If I have known earlier, I will join.'
        ],
        answer: 1,
        explanation: "Conditional Type 3 menggunakan pola 'If + Past Perfect (had + V3), would have + V3'."
      }
    ]
  },

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

getActiveTopics() {
    const key = this.user.level === 'Tinggi' ? 'Lanjut' : this.user.level;
    const levelList = this.topicsByLevel[key] || this.topicsByLevel.Pemula;
    return levelList.map(item => ({
      ...item,
      prompt: item.getPrompt(this.user.name || 'Pelajar', this.user.education || 'SMA')
    }));
  },

  getActiveQuizzes() {
    const key = this.user.level === 'Tinggi' ? 'Lanjut' : this.user.level;
    return this.quizzesByLevel[key] || this.quizzesByLevel.Pemula;
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