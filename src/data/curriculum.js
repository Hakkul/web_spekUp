const q = (question, options, answer, explanation) => ({
  question,
  options,
  answer,
  explanation
});

export const CURRICULUM = {
  SMP: {
    Pemula: {
      quiz: [
        q("Bagaimana pelafalan kata 'student' yang tepat?", ['stu-dent', 'styu-dent', 'sta-dent'], 1, "Huruf 'u' pada 'student' dibaca 'yu' (styu-dent)."),
        q("Lengkapi kalimat: 'I ___ a junior high school student.'", ['is', 'am', 'are'], 1, "Subjek 'I' selalu berpasangan dengan 'am'."),
        q("Apa arti dari 'school uniform'?", ['Seragam sekolah', 'Jadwal pelajaran', 'Tas sekolah'], 0, "'Uniform' berarti seragam."),
        q("Pilih sapaan yang tepat saat bertemu guru di pagi hari:", ['Good night, Sir.', 'Good morning, Sir.', 'Good bye, Sir.'], 1, "'Good morning' digunakan untuk menyapa di pagi hari."),
        q("Bagaimana cara membaca kata 'book'?", ['buk', 'bok', 'bauk'], 0, "Huruf 'oo' pada 'book' dibaca pendek seperti 'u' (buk)."),
        q("Lengkapi kalimat: 'She ___ to school by bicycle.'", ['go', 'goes', 'going'], 1, "Untuk subjek tunggal 'She' di Simple Present, kata kerja 'go' ditambah '-es' menjadi 'goes'."),
        q("Apa bahasa Inggris dari 'perpustakaan'?", ['Laboratory', 'Library', 'Canteen'], 1, "'Library' adalah perpustakaan."),
        q("Manakah pelafalan yang benar untuk kata 'write'?", ['wrait', 'rait', 'writ'], 1, "Huruf 'w' di awal 'write' tidak dibaca (silent w)."),
        q("Pilih kalimat perkenalan diri yang benar:", ['My name is Andi.', 'I name is Andi.', 'Me name Andi.'], 0, "Gunakan 'My name is...' untuk memperkenalkan nama."),
        q("Apa arti kalimat 'Raise your hand'?", ['Angkat tanganmu', 'Buka bukumu', 'Duduk yang rapi'], 0, "'Raise' berarti mengangkat dan 'hand' berarti tangan.")
      ],
      speaking: {
        title: 'Perkenalan Siswa SMP',
        instruction: 'Bacalah kalimat perkenalan berikut dengan lantang dan jelas:',
        targetText: 'Hello, my name is Dimas and I am a junior high school student. I love learning English at school.',
        hint: 'Helou, mai neim iz Dimas end ai em e junier hai skul styudent. Ai lav lerning Inglish et skul.'
      },
      reading: {
        title: 'A Day at SMP Nusantara',
        passage: 'Rina is a seventh-grade student at SMP Nusantara. Every morning, she wakes up at five o’clock and prepares her books. Her favorite subject is English because she enjoys singing English songs with her classmates. During break time, Rina usually goes to the library to read storybooks.',
        questions: [
          q('What grade is Rina in?', ['Seventh grade', 'Eighth grade', 'Ninth grade'], 0, "Di kalimat pertama disebutkan 'Rina is a seventh-grade student'."),
          q('Why does Rina like English?', ['Because the teacher is strict', 'Because she enjoys singing English songs', 'Because there is no homework'], 1, "Ia menyukai bahasa Inggris karena suka menyanyikan lagu berbahasa Inggris bersama teman."),
          q('Where does Rina usually go during break time?', ['To the canteen', 'To the library', 'To the field'], 1, "Saat jam istirahat, Rina pergi ke perpustakaan ('goes to the library').")
        ]
      }
    },
    Menengah: {
      quiz: [
        q("Manakah bentuk lampau (Verb 2) dari kata 'study'?", ['studyed', 'studied', 'studying'], 1, "Kata kerja berakhiran konsonan + 'y' berubah menjadi '-ied' di bentuk lampau."),
        q("Bagaimana pelafalan kata 'island' yang tepat?", ['is-land', 'ai-lend', 'iz-land'], 1, "Huruf 's' pada 'island' tidak dibaca (silent s), dibaca 'ai-lend'."),
        q("Lengkapi: 'We ___ football in the school yard yesterday.'", ['play', 'played', 'playing'], 1, "Keterangan waktu 'yesterday' menandakan kejadian lampau (Verb 2: played)."),
        q("Apa arti dari ungkapan 'Don't give up!'?", ['Jangan terlambat!', 'Jangan menyerah!', 'Jangan berisik!'], 1, "'Give up' berarti menyerah."),
        q("Pilih perbandingan yang tepat: 'My bag is ___ than yours.'", ['heavy', 'heavier', 'heaviest'], 1, "Perbandingan dua benda (comparative) menggunakan akhiran '-ier' + 'than'."),
        q("Bagaimana pelafalan 'Wednesday'?", ['wed-nes-dei', 'wenz-dei', 'wed-nez-dei'], 1, "Huruf 'd' pertama tidak dibaca, sehingga diucapkan 'wenz-dei'."),
        q("Lengkapi: 'Can you ___ me how to pronounce this word?'", ['tell', 'told', 'telling'], 0, "Setelah modal 'Can', kata kerja kembali ke bentuk dasar (Verb 1)."),
        q("Apa sinonim dari kata 'smart'?", ['Lazy', 'Clever', 'Slow'], 1, "'Clever' memiliki arti yang sama dengan 'smart' (pintar/cerdas)."),
        q("Pilih kalimat ajakan yang sopan:", ['Let’s practice together!', 'You must practice now!', 'Practice alone!'], 0, "'Let's...' digunakan untuk mengajak teman secara ramah."),
        q("Apa arti dari 'extra-curricular activity'?", ['Tugas rumah', 'Kegiatan ekstrakurikuler', 'Ujian akhir'], 1, "Kegiatan di luar jam pelajaran utama di sekolah.")
      ],
      speaking: {
        title: 'Aktivitas Ekstrakurikuler',
        instruction: 'Ucapkan kalimat berikut dengan tempo stabil:',
        targetText: 'Yesterday I joined the English club at my school and practiced speaking with my friends.',
        hint: 'Yesterdei ai joind de Inglish klab et mai skul end prektist spiking wit mai frendz.'
      },
      reading: {
        title: 'The School Clean-Up Day',
        passage: 'Last Friday, all students at SMP Harapan joined a clean-up event. Each class cleaned their own classroom and planted small flowers in front of the corridor. Although everyone felt tired, they were proud because their school looked much greener and cleaner.',
        questions: [
          q('When did the clean-up event happen?', ['Last Monday', 'Last Friday', 'Last Sunday'], 1, "Acara bersih-bersih berlangsung pada hari Jumat lalu ('Last Friday')."),
          q('What did the students plant in front of the corridor?', ['Big trees', 'Small flowers', 'Vegetables'], 1, "Mereka menanam bunga-bunga kecil ('planted small flowers')."),
          q('How did the students feel after the event?', ['Angry and bored', 'Tired but proud', 'Sad and sleepy'], 1, "Meskipun lelah ('tired'), mereka merasa bangga ('proud').")
        ]
      }
    },
    Lanjut: {
      quiz: [
        q("Pilih kata hubung yang tepat: '___ it was raining, we still attended the English debate.'", ['Because', 'Although', 'Therefore'], 1, "'Although' (meskipun) menghubungkan dua kondisi yang bertolak belakang."),
        q("Bagaimana pelafalan kata 'courage'?", ['kou-reij', 'ka-rij', 'ku-rej'], 1, "Kata 'courage' (keberanian) dibaca 'ka-rij'."),
        q("Ubah ke kalimat pasif: 'Students speak English in this club.'", ['English is spoken by students in this club.', 'English was speak by students.', 'English speaking by students.'], 0, "Kalimat pasif Simple Present menggunakan pola 'is/am/are + Verb 3 (spoken)'."),
        q("Apa arti idiom 'piece of cake'?", ['Sepotong kue mahal', 'Sesuatu yang sangat mudah', 'Masalah yang rumit'], 1, "'Piece of cake' adalah ungkapan untuk hal yang sangat mudah dilakukan."),
        q("Lengkapi: 'If I ___ more time, I would join the storytelling competition.'", ['have', 'had', 'has'], 1, "Conditional Type 2 menggunakan 'If + Past Simple (had), would + Verb 1'."),
        q("Bagaimana pelafalan 'comfortable' yang alami?", ['kom-for-ta-bel', 'kamf-ter-bel', 'kom-for-te-bel'], 1, "Dalam pelafalan alami bahasa Inggris, kata ini diucapkan 3 suku kata: 'kamf-ter-bel'."),
        q("Apa arti kata 'confident'?", ['Pemalu', 'Percaya diri', 'Ragu-ragu'], 1, "'Confident' berarti percaya diri."),
        q("Pilih kalimat tanya tidak langsung yang benar:", ['Do you know where is the hall?', 'Do you know where the hall is?', 'Do you know where the hall?'], 1, "Dalam kalimat tanya tidak langsung, posisi subjek mendahului to-be ('where the hall is')."),
        q("Apa makna 'fluency' dalam berbicara?", ['Kecepatan menulis', 'Kelancaran berbicara', 'Volume suara'], 1, "'Fluency' mengacu pada kelancaran dan alur bicara yang alami."),
        q("Lengkapi: 'She has been practicing her speech ___ two hours.'", ['since', 'for', 'during'], 1, "'For' digunakan untuk menyatakan durasi waktu ('two hours').")
      ],
      speaking: {
        title: 'Pidato Singkat Pelajar',
        instruction: 'Bacalah pernyataan berikut dengan intonasi meyakinkan:',
        targetText: 'Although speaking a foreign language feels challenging at first, regular practice builds real confidence.',
        hint: 'Oldou spiking e foren lenggwij filz celenjing et ferst, regyuler prektis bildz riel konfidens.'
      },
      reading: {
        title: 'Young Storyteller Competition',
        passage: 'Nadia represented her junior high school in a regional English storytelling competition. At first, her hands were trembling when she stood on the stage. However, once she started telling the folk tale with expressive gestures, the audience listened attentively and gave her a warm applause.',
        questions: [
          q('What competition did Nadia join?', ['English debate', 'Storytelling competition', 'Spelling bee'], 1, "Nadia mengikuti lomba bercerita bahasa Inggris ('storytelling competition')."),
          q('How did Nadia feel when she first stood on the stage?', ['Very relaxed', 'Nervous (her hands were trembling)', 'Disappointed'], 1, "Tangannya gemetar ('trembling') saat pertama kali berdiri di atas panggung."),
          q('How did the audience react to her performance?', ['They left the room', 'They listened attentively and applauded', 'They fell asleep'], 1, "Penonton menyimak dengan saksama dan memberi tepuk tangan hangat.")
        ]
      }
    }
  },

  SMA: {
    Pemula: {
      quiz: [
        q("Bagaimana pelafalan kata 'study' yang tepat?", ['studi', 'stadi', 'stedi'], 1, "Huruf 'u' pada 'study' dibaca pendek seperti 'a' (stadi)."),
        q("Lengkapi: 'I study ___ SMAN 1 Kejayan.'", ['on', 'at', 'to'], 1, "Gunakan 'at' sebelum nama institusi atau sekolah tertentu."),
        q("Apa arti dari 'high school'?", ['Sekolah dasar', 'Sekolah menengah atas', 'Perguruan tinggi'], 1, "'High school' merujuk pada jenjang SMA."),
        q("Bagaimana pelafalan kata 'know'?", ['ke-nou', 'nou', 'nau'], 1, "Huruf 'k' di awal 'know' tidak dibaca (silent k)."),
        q("Lengkapi: 'My classmates ___ very supportive.'", ['is', 'am', 'are'], 2, "'Classmates' berbentuk jamak, sehingga menggunakan 'are'."),
        q("Apa bahasa Inggris dari 'mata pelajaran favorit'?", ['Favorite subject', 'Favorite object', 'Favorite project'], 0, "'Subject' dalam konteks sekolah berarti mata pelajaran."),
        q("Pilih cara membaca 'listen' yang benar:", ['lis-ten', 'li-sen', 'lai-sen'], 1, "Huruf 't' pada 'listen' tidak dibaca (silent t)."),
        q("Lengkapi: 'We ___ an English presentation tomorrow.'", ['have', 'has', 'having'], 0, "Subjek 'We' menggunakan 'have'."),
        q("Apa arti frasa 'in my free time'?", ['Di waktu sibukku', 'Di waktu luangku', 'Di masa depanku'], 1, "'Free time' berarti waktu luang."),
        q("Pilih kalimat yang paling tepat untuk menyatakan hobi:", ['I like read books.', 'I like reading books.', 'I liking read books.'], 1, "Setelah 'like', gunakan bentuk Verb-ing ('reading') atau 'to + Verb 1'.")
      ],
      speaking: {
        title: 'Perkenalan Siswa SMA',
        instruction: 'Bacalah kalimat berikut dengan pelafalan yang jelas:',
        targetText: 'My name is Sania, and I study at SMAN 1 Kejayan. In my free time, I enjoy reading English articles.',
        hint: 'Mai neim iz Sania, end ai stadi et SMAN Wan Kejayan. In mai fri taim, ai enjoi riding Inglish artikelz.'
      },
      reading: {
        title: 'Preparing for University',
        passage: 'Bima is a senior high school student who dreams of studying computer science at a top university. Realizing that many technology resources are written in English, he dedicates twenty minutes every evening to practicing his vocabulary and speaking skills.',
        questions: [
          q('What major does Bima want to study at university?', ['Literature', 'Computer science', 'Medicine'], 1, "Bima bercita-cita kuliah jurusan ilmu komputer ('computer science')."),
          q('Why does Bima practice English every evening?', ['Because technology resources are mostly in English', 'Because he wants to move abroad tomorrow', 'Because his friend forces him'], 0, "Karena banyak sumber belajar teknologi ditulis dalam bahasa Inggris."),
          q('How long does Bima practice English each evening?', ['Ten minutes', 'Twenty minutes', 'Two hours'], 1, "Ia meluangkan waktu dua puluh menit setiap malam ('twenty minutes').")
        ]
      }
    },
    Menengah: {
      quiz: [
        q("Manakah pelafalan yang benar untuk kata 'opinion'?", ['o-pi-ni-on', 'e-pin-yen', 'o-pai-nyen'], 1, "Tekanan berada di suku kata kedua: e-PIN-yen."),
        q("Lengkapi: 'She has been ___ English for two years.'", ['learn', 'learned', 'learning'], 2, "Present Perfect Continuous menggunakan 'has been + Verb-ing'."),
        q("Apa arti kata 'achievement'?", ['Kegagalan', 'Pencapaian / Prestasi', 'Persyaratan'], 1, "'Achievement' berarti prestasi atau pencapaian."),
        q("Pilih kata kerja yang tepat: 'Joining debate club helps me ___ my critical thinking.'", ['improve', 'improving', 'improved'], 0, "Pola 'help + objek + Verb 1' menggunakan kata kerja dasar 'improve'."),
        q("Bagaimana pelafalan kata 'schedule' (US English)?", ['ske-jul', 'se-du-le', 'ske-dul'], 0, "Dalam pelafalan Amerika, 'schedule' dibaca 'ske-jul'."),
        q("Lengkapi kalimat opini: '___ my point of view, technology makes learning faster.'", ['On', 'From', 'At'], 1, "Frasa baku adalah 'From my point of view'."),
        q("Apa arti dari 'scholarship'?", ['Beasiswa', 'Kepala sekolah', 'Karya ilmiah'], 0, "'Scholarship' berarti beasiswa pendidikan."),
        q("Pilih kalimat yang benar secara tata bahasa:", ['Neither Rudi nor Maya was late.', 'Neither Rudi nor Maya were late.', 'Neither Rudi or Maya was late.'], 0, "Pasangan 'Neither... nor' mengikuti subjek terdekat ('Maya' tunggal -> 'was')."),
        q("Bagaimana cara membaca 'colleague'?", ['ko-li-gu', 'ko-lig', 'kol-eg'], 1, "'Colleague' (rekan kerja/sejawat) dibaca 'ko-lig'."),
        q("Apa makna 'brainstorming' saat diskusi kelompok?", ['Berdebat tanpa solusi', 'Bertukar ide secara bebas', 'Membagi nilai ujian'], 1, "'Brainstorming' adalah proses mengumpulkan gagasan bersama.")
      ],
      speaking: {
        title: 'Menyampaikan Opini Akademik',
        instruction: 'Ucapkan kalimat opini berikut dengan percaya diri:',
        targetText: 'In my opinion, mastering English opens access to scholarships and international student exchange programs.',
        hint: 'In mai epinyen, mastering Inglish openz akses tu skolarships end internesyonal styudent ekscenj programz.'
      },
      reading: {
        title: 'The Student Exchange Dream',
        passage: 'During her second year of high school, Tari applied for a youth exchange program. The selection process required an essay and a ten-minute English interview. Instead of memorizing scripted answers, Tari practiced expressing her genuine thoughts clearly, which impressed the selection committee.',
        questions: [
          q('What program did Tari apply for?', ['A summer camp', 'A youth exchange program', 'A cooking contest'], 1, "Tari mendaftar program pertukaran pelajar ('youth exchange program')."),
          q('What were the two requirements in the selection process?', ['A math test and a song', 'An essay and an English interview', 'A video and a poster'], 1, "Proses seleksi membutuhkan esai dan wawancara bahasa Inggris."),
          q('What impressed the selection committee?', ['Her memorized script', 'Her genuine and clear thoughts', 'Her expensive uniform'], 1, "Panitia terkesan karena Tari menyampaikan pemikirannya secara tulus dan jelas.")
        ]
      }
    },
    Lanjut: {
      quiz: [
        q("Pilih struktur Conditional Type 3 yang tepat:", ['If I knew earlier, I would have joined.', 'If I had known earlier, I would have joined.', 'If I have known earlier, I will join.'], 1, "Conditional Type 3 menggunakan pola 'If + Past Perfect (had + V3), would have + V3'."),
        q("Apa arti frasa 'overcome hesitation'?", ['Menghindari diskusi', 'Mengatasi keraguan', 'Mempercepat bacaan'], 1, "'Overcome' = mengatasi, 'hesitation' = keraguan."),
        q("Bagaimana pelafalan kata 'entrepreneur'?", ['en-ter-pre-ner', 'on-tre-pre-ner', 'in-tre-pre-nur'], 1, "Kata serapan Prancis ini dibaca 'on-tre-pre-ner'."),
        q("Lengkapi: 'Not only ___ fluent in English, but she also speaks Mandarin.'", ['she is', 'is she', 'she was'], 1, "Inversi setelah 'Not only' di awal kalimat meletakkan auxiliary 'is' sebelum subjek 'she'."),
        q("Apa makna kata 'articulate' saat mendeskripsikan pembicara?", ['Berbicara terlalu cepat', 'Mampu menyampaikan ide dengan jelas dan terstruktur', 'Sering mengulang kata'], 1, "'Articulate' berarti fasih, jelas, dan runtut dalam bertutur."),
        q("Pilih sinonim yang paling tepat untuk 'crucial':", ['Trivial', 'Vital', 'Optional'], 1, "'Crucial' dan 'vital' sama-sama berarti sangat penting."),
        q("Bagaimana pelafalan 'phenomenon'?", ['fe-no-me-non', 'fe-no-mi-nen', 'pi-no-me-non'], 1, "Tekanan pada suku kata kedua: fe-NO-mi-nen."),
        q("Lengkapi: 'By the time we graduate next year, we ___ English for six years.'", ['will study', 'will have studied', 'have studied'], 1, "Future Perfect ('will have + V3') menyatakan durasi yang selesai di titik masa depan."),
        q("Apa arti ungkapan 'food for thought'?", ['Makanan bergizi', 'Bahan renungan / pemikiran', 'Menu makan siang'], 1, "'Food for thought' berarti ide atau gagasan yang layak dipikirkan lebih dalam."),
        q("Pilih kalimat yang menggunakan 'despite' dengan benar:", ['Despite she was tired, she finished her speech.', 'Despite feeling tired, she finished her speech.', 'Despite of tired, she finished her speech.'], 1, "'Despite' diikuti kata benda atau Verb-ing ('feeling tired'), bukan klausa lengkap.")
      ],
      speaking: {
        title: 'Argumen Debat SMA',
        instruction: 'Bacalah argumen berikut dengan artikulasi dan penekanan yang tepat:',
        targetText: 'Had students been encouraged to speak without fear of making mistakes, their communication skills would have developed much faster.',
        hint: 'Hed styudents bin enkarijd tu spik witaut fir ov meiking misteiks, deir komyunikeisyen skilz wud hev divelopt mac faster.'
      },
      reading: {
        title: 'Critical Thinking in Modern Education',
        passage: 'Modern high school education increasingly emphasizes critical thinking alongside academic knowledge. Rather than merely memorizing facts for examinations, students are encouraged to question assumptions, evaluate evidence, and articulate persuasive arguments in English discussions.',
        questions: [
          q('What skill is emphasized alongside academic knowledge?', ['Memorization speed', 'Critical thinking', 'Handwriting neatness'], 1, "Teks menyebutkan 'emphasizes critical thinking alongside academic knowledge'."),
          q('What are students encouraged to do instead of merely memorizing?', ['Skip examinations', 'Question assumptions and evaluate evidence', 'Copy notes from peers'], 1, "Siswa didorong mempertanyakan asumsi dan mengevaluasi bukti."),
          q('In what setting do students articulate persuasive arguments?', ['In silent reading', 'In English discussions', 'In sports matches'], 1, "Mereka menyampaikan argumen persuasif dalam diskusi berbahasa Inggris.")
        ]
      }
    }
  },

  SMK: {
    Pemula: {
      quiz: [
        q("Apa bahasa Inggris dari 'praktik kerja lapangan / magang'?", ['Internship', 'Scholarship', 'Leadership'], 0, "'Internship' berarti magang atau praktik kerja."),
        q("Bagaimana pelafalan kata 'work' yang tepat?", ['wok', 'werk', 'work'], 1, "Kata 'work' dibaca 'werk' (bukan 'wok' yang berarti wajan)."),
        q("Lengkapi: 'I am a vocational school student majoring ___ Accounting.'", ['on', 'in', 'at'], 1, "Gunakan preposisi 'in' setelah kata 'majoring' (mengambil jurusan)."),
        q("Apa arti dari 'safety first' di bengkel atau lab SMK?", ['Utamakan kecepatan', 'Utamakan keselamatan', 'Utamakan istirahat'], 1, "'Safety first' adalah slogan keselamatan kerja."),
        q("Bagaimana cara membaca kata 'tool'?", ['tol', 'tul', 'taul'], 1, "Huruf 'oo' pada 'tool' (alat) dibaca panjang seperti 'u' (tul)."),
        q("Lengkapi: 'We ___ practical lessons in the workshop every Tuesday.'", ['have', 'has', 'having'], 0, "Subjek 'We' menggunakan 'have'."),
        q("Apa arti dari 'customer service'?", ['Layanan pelanggan', 'Kepala gudang', 'Laporan keuangan'], 0, "'Customer' = pelanggan, 'service' = layanan."),
        q("Pilih sapaan profesional saat melayani tamu:", ['What do you want?', 'How may I help you?', 'Wait over there.'], 1, "'How may I help you?' adalah ungkapan standar pelayanan yang ramah."),
        q("Bagaimana pelafalan kata 'receipt' (struk pembayaran)?", ['re-seipt', 'ri-sit', 're-sipt'], 1, "Huruf 'p' pada 'receipt' tidak dibaca (silent p), dibaca 'ri-sit'."),
        q("Apa arti kata 'skill'?", ['Keterampilan / Keahlian', 'Jadwal', 'Seragam'], 0, "'Skill' berarti keterampilan atau keahlian teknis.")
      ],
      speaking: {
        title: 'Perkenalan Jurusan SMK',
        instruction: 'Bacalah perkenalan vokasi berikut dengan jelas:',
        targetText: 'Hello, my name is Reza. I am a vocational high school student majoring in Computer Network Engineering.',
        hint: 'Helou, mai neim iz Reza. Ai em e vokeisyonal hai skul styudent mejering in Kompyuter Network Enjiniring.'
      },
      reading: {
        title: 'Workshop Practice Day',
        passage: 'Every Wednesday morning, students of SMK Karya Mandiri wear their safety uniforms and enter the technical workshop. Before operating any machines, their instructor checks all safety equipment and explains the standard operating procedures in English.',
        questions: [
          q('What do the students wear before entering the workshop?', ['Casual clothes', 'Safety uniforms', 'Sports jerseys'], 1, "Siswa mengenakan seragam keselamatan kerja ('safety uniforms')."),
          q('Who checks the safety equipment?', ['The security guard', 'Their instructor', 'The visitors'], 1, "Instruktur mereka memeriksa peralatan keselamatan ('their instructor checks')."),
          q('In what language are the procedures explained?', ['Japanese', 'English', 'French'], 1, "Prosedur standar dijelaskan dalam bahasa Inggris ('in English').")
        ]
      }
    },
    Menengah: {
      quiz: [
        q("Apa arti dari 'deadline' dalam dunia kerja?", ['Garis mati', 'Batas waktu penyelesaian', 'Jam istirahat'], 1, "'Deadline' adalah tenggat atau batas waktu pengumpulan tugas/proyek."),
        q("Bagaimana pelafalan kata 'colleague'?", ['ko-li-gu', 'ko-lig', 'kol-eg'], 1, "'Colleague' (rekan kerja) dibaca 'ko-lig'."),
        q("Lengkapi kalimat wawancara: 'I am able to work well both independently and ___ a team.'", ['on', 'in', 'at'], 1, "Ungkapan baku untuk kerja tim adalah 'in a team'."),
        q("Apa maksud dari 'troubleshooting'?", ['Membuat masalah baru', 'Mendiagnosis dan memperbaiki gangguan teknis', 'Menjual perangkat'], 1, "'Troubleshooting' adalah proses melacak dan menyelesaikan masalah teknis."),
        q("Pilih kalimat yang sopan untuk meminta pelanggan menunggu:", ['Hold on a minute!', 'Please wait a moment while I check your data.', 'Just sit and wait.'], 1, "Kalimat kedua terdengar profesional dan sopan untuk dunia kerja."),
        q("Bagaimana pelafalan 'maintenance'?", ['main-te-nans', 'mein-te-nens', 'men-ten-ens'], 1, "Tekanan di awal kata: 'MEIN-te-nens'."),
        q("Lengkapi: 'During my internship, I ___ responsible for managing daily inventory.'", ['am', 'was', 'were'], 1, "Pengalaman magang yang sudah berlalu menggunakan bentuk lampau 'was'."),
        q("Apa arti kata 'punctual'?", ['Tepat waktu', 'Sering terlambat', 'Bekerja lembur'], 0, "'Punctual' berarti disiplin dan selalu tepat waktu."),
        q("Pilih kata yang tepat: 'Please attach your ___ and portfolio to the email.'", ['resume', 'consume', 'assume'], 0, "'Resume' (dibaca re-zyu-mei) berarti daftar riwayat hidup (CV)."),
        q("Apa arti 'teamwork'?", ['Kerja sama tim', 'Kerja lembur', 'Pekerjaan rumah'], 0, "'Teamwork' adalah kolaborasi dalam sebuah tim.")
      ],
      speaking: {
        title: 'Simulasi Wawancara Magang',
        instruction: 'Ucapkan jawaban wawancara berikut dengan percaya diri:',
        targetText: 'During my internship, I learned how to handle customer inquiries politely and solve technical issues on time.',
        hint: 'Dyuring mai internsip, ai lernd hau tu hendel kastemer inkwairiz polaitli end solv teknikel isyuz on taim.'
      },
      reading: {
        title: 'An Unforgettable Internship',
        passage: 'Last semester, Dita completed a three-month internship at a local hotel front desk. At first, she felt nervous speaking English with international guests. However, by practicing common hospitality phrases every day, she became confident and even received praise from the hotel manager.',
        questions: [
          q('Where did Dita do her internship?', ['At a bank', 'At a hotel front desk', 'At a factory'], 1, "Dita magang di bagian resepsionis hotel ('hotel front desk')."),
          q('How long was her internship?', ['One month', 'Three months', 'Six months'], 1, "Ia menjalani magang selama tiga bulan ('three-month internship')."),
          q('How did Dita overcome her nervousness?', ['By avoiding foreign guests', 'By practicing hospitality phrases daily', 'By changing departments'], 1, "Ia berlatih frasa perhotelan setiap hari hingga percaya diri.")
        ]
      }
    },
    Lanjut: {
      quiz: [
        q("Apa arti istilah 'quality assurance' dalam industri?", ['Jaminan mutu produk/layanan', 'Pemasaran digital', 'Pengiriman barang'], 0, "'Quality assurance' (QA) memastikan produk memenuhi standar kualitas."),
        q("Bagaimana pelafalan kata 'negotiation'?", ['ne-go-si-a-tion', 'ni-gou-shi-ei-syen', 'ne-go-ti-ei-syen'], 1, "Huruf 'ti' dibaca 'sy', sehingga menjadi 'ni-gou-shi-ei-syen'."),
        q("Lengkapi: 'We guarantee that the project ___ before the client’s deadline.'", ['will complete', 'will be completed', 'completed'], 1, "Kalimat pasif masa depan menggunakan 'will be + Verb 3 (completed)'."),
        q("Apa arti ungkapan 'go the extra mile' di dunia profesional?", ['Berjalan kaki jauh', 'Memberikan usaha lebih dari yang diharapkan', 'Pindah kantor'], 1, "'Go the extra mile' berarti bekerja ekstra demi hasil terbaik."),
        q("Pilih kalimat negosiasi yang profesional:", ['Your price is too expensive, lower it.', 'Could we discuss a more flexible pricing package for long-term cooperation?', 'We will not pay that amount.'], 1, "Kalimat kedua menggunakan bahasa diplomatis dan berorientasi solusi."),
        q("Bagaimana pelafalan 'hierarchy'?", ['hi-e-rar-ki', 'hai-e-rar-ki', 'hir-ar-ki'], 1, "Huruf 'hi' di awal dibaca 'hai': 'hai-e-rar-ki'."),
        q("Apa makna 'compliance' dalam standar industri?", ['Kepatuhan terhadap aturan/standar', 'Keluhan pelanggan', 'Keuntungan bersih'], 0, "'Compliance' berarti kepatuhan terhadap regulasi dan SOP."),
        q("Lengkapi: 'Had the technician inspected the server earlier, the system crash ___.'", ['would not happen', 'would not have happened', 'will not happen'], 1, "Conditional Type 3 untuk mengevaluasi insiden teknis di masa lalu."),
        q("Apa arti dari 'stakeholder'?", ['Pemangku kepentingan', 'Pemegang saham saja', 'Karyawan baru'], 0, "'Stakeholder' mencakup semua pihak yang berkepentingan terhadap proyek/perusahaan."),
        q("Pilih kata sambung yang tepat: 'Production costs decreased ___ the new automated workflow.'", ['because', 'due to', 'although'], 1, "'Due to' diikuti frasa kata benda ('the new automated workflow').")
      ],
      speaking: {
        title: 'Pitching Produk & Layanan',
        instruction: 'Bacalah presentasi bisnis singkat berikut dengan intonasi profesional:',
        targetText: 'Our team prioritizes quality assurance and timely delivery to ensure maximum satisfaction for every client.',
        hint: 'Auer tim praioritaiziz kwoliti esyurens end taimli diliveri tu ensyur meksimem setisfeksyen for evri klaient.'
      },
      reading: {
        title: 'Adapting to Industry 4.0',
        passage: 'Vocational graduates today enter a rapidly evolving workplace shaped by automation and global collaboration. Technical expertise remains essential, yet employers increasingly value candidates who can troubleshoot complex problems and communicate project updates clearly in English.',
        questions: [
          q('What shapes the modern workplace according to the text?', ['Manual paperwork', 'Automation and global collaboration', 'Shorter working hours'], 1, "Dunia kerja modern dibentuk oleh otomatisasi dan kolaborasi global."),
          q('Besides technical expertise, what do employers value?', ['Ability to troubleshoot and communicate in English', 'Ability to work without computers', 'Memorizing company history'], 0, "Perusahaan mencari kandidat yang mampu memecahkan masalah dan berkomunikasi dalam bahasa Inggris."),
          q('Who is the main subject of this passage?', ['Elementary teachers', 'Vocational graduates', 'Retired workers'], 1, "Paragraf ini membahas kesiapan lulusan sekolah vokasi ('Vocational graduates').")
        ]
      }
    }
  },

  Umum: {
    Pemula: {
      quiz: [
        q("Bagaimana cara menanyakan arah dengan sopan?", ['Where is the station?', 'Excuse me, could you tell me the way to the station?', 'Tell me the station now.'], 1, "Mengawali dengan 'Excuse me, could you...' membuat pertanyaan jauh lebih sopan."),
        q("Bagaimana pelafalan kata 'often' yang umum digunakan?", ['of-ten', 'o-fen', 'au-fen'], 1, "Huruf 't' pada 'often' umumnya tidak dibaca (o-fen)."),
        q("Apa arti dari 'round-trip ticket'?", ['Tiket sekali jalan', 'Tiket pulang-pergi', 'Tiket anak-anak'], 1, "'Round-trip' berarti perjalanan pergi dan pulang."),
        q("Lengkapi: 'I would like ___ a cup of coffee, please.'", ['order', 'to order', 'ordering'], 1, "Pola sopan memesan sesuatu adalah 'I would like to + Verb 1'."),
        q("Apa arti ungkapan 'Keep the change'?", ['Kembalikan uangnya', 'Ambil saja kembaliannya', 'Tukar uang receh'], 1, "'Change' di sini berarti uang kembalian."),
        q("Bagaimana pelafalan kata 'comfortable'?", ['kom-for-ta-bel', 'kamf-ter-bel', 'kom-for-te-bel'], 1, "Dibaca ringkas menjadi 'kamf-ter-bel'."),
        q("Pilih jawaban yang tepat untuk 'Thank you for your help':", ['Never mind.', 'You are welcome.', 'I don’t care.'], 1, "'You are welcome' adalah balasan standar untuk ucapan terima kasih."),
        q("Apa bahasa Inggris dari 'bandara'?", ['Harbor', 'Airport', 'Station'], 1, "'Airport' berarti bandar udara."),
        q("Lengkapi: 'How ___ does this jacket cost?'", ['many', 'much', 'long'], 1, "Untuk menanyakan harga (uncountable), gunakan 'How much'."),
        q("Apa arti kalimat 'I am looking forward to meeting you'?", ['Saya lupa bertemu Anda', 'Saya menantikan pertemuan dengan Anda', 'Saya sedang mencari Anda'], 1, "Ungkapan ramah untuk menutup percakapan atau email sebelum bertemu.")
      ],
      speaking: {
        title: 'Percakapan Sehari-hari & Perjalanan',
        instruction: 'Ucapkan kalimat berikut dengan ramah dan jelas:',
        targetText: 'Excuse me, I am looking for the nearest train station. Could you show me the right direction?',
        hint: 'Ekskyuz mi, ai em luking for de nirest trein steisyen. Kud yu syou mi de rait daireksyen?'
      },
      reading: {
        title: 'Ordering at a Local Cafe',
        passage: 'On Saturday afternoon, Hendra visited an international cafe downtown. He greeted the barista warmly and ordered an iced latte with less sugar. Because he spoke clearly and politely, the barista easily understood his request and served his drink within five minutes.',
        questions: [
          q('When did Hendra visit the cafe?', ['Sunday morning', 'Saturday afternoon', 'Friday night'], 1, "Ia mengunjungi kafe pada Sabtu sore ('Saturday afternoon')."),
          q('What did Hendra order?', ['Hot tea', 'An iced latte with less sugar', 'Orange juice'], 1, "Ia memesan es kopi latte dengan sedikit gula."),
          q('How long did it take to serve his drink?', ['Five minutes', 'Fifteen minutes', 'Thirty minutes'], 0, "Minumannya disajikan dalam waktu lima menit ('within five minutes').")
        ]
      }
    },
    Menengah: {
      quiz: [
        q("Apa arti ungkapan 'call it a day'?", ['Menyebut nama hari', 'Mengakhiri pekerjaan hari ini', 'Menelepon teman'], 1, "'Call it a day' berarti menyudahi aktivitas/pekerjaan untuk hari itu."),
        q("Bagaimana pelafalan kata 'through'?", ['trou', 'thru', 'traf'], 1, "'Through' dibaca 'thru' (huruf 'gh' tidak dibaca)."),
        q("Lengkapi: 'If you have any questions, feel free to ___ out to me.'", ['reach', 'take', 'put'], 0, "'Reach out' berarti menghubungi seseorang."),
        q("Apa arti kata 'itinerary'?", ['Rencana perjalanan', 'Asuransi kesehatan', 'Bagasi tambahan'], 0, "'Itinerary' adalah jadwal rinci perjalanan."),
        q("Pilih kalimat yang tepat untuk menjadwal ulang rapat:", ['Cancel the meeting.', 'Could we reschedule our meeting to Thursday afternoon?', 'I cannot come, bye.'], 1, "'Reschedule' berarti menjadwalkan ulang."),
        q("Bagaimana pelafalan 'genre'?", ['gen-re', 'zyon-re', 'jen-er'], 1, "Kata serapan Prancis ini dibaca 'zyon-re'."),
        q("Lengkapi: 'I used to ___ nervous when speaking English on the phone.'", ['feeling', 'feel', 'felt'], 1, "Pola 'used to + Verb 1' menyatakan kebiasaan di masa lalu."),
        q("Apa arti 'jet lag'?", ['Kelelahan akibat perbedaan zona waktu setelah terbang', 'Pesawat terlambat', 'Kehilangan koper'], 0, "'Jet lag' terjadi setelah penerbangan jarak jauh lintas zona waktu."),
        q("Pilih kata yang tepat: 'This neighborhood is very ___ and safe for jogging.'", ['peaceful', 'peace', 'peacefully'], 0, "Dibutuhkan kata sifat ('peaceful') setelah 'is very'."),
        q("Apa makna 'small talk' dalam budaya berbahasa Inggris?", ['Berbisik pelan', 'Obrolan ringan pembuka suasana', 'Pidato singkat'], 1, "'Small talk' adalah percakapan ringan seperti membahas cuaca atau akhir pekan.")
      ],
      speaking: {
        title: 'Komunikasi Sosial & Rencana',
        instruction: 'Bacalah kalimat berikut dengan intonasi santai namun jelas:',
        targetText: 'I used to feel hesitant when talking with foreigners, but practicing everyday conversations has made me much more comfortable.',
        hint: 'Ai yuzd tu fil hezitent wen toking wit forenerz, bat prektising evridei konverseisyenz hez meid mi mac mor kamfterbel.'
      },
      reading: {
        title: 'The Power of Small Talk',
        passage: 'In many English-speaking cultures, starting a conversation with brief small talk is considered friendly and polite. Simple topics like the weather, weekend plans, or local food help build rapport before discussing serious matters at work or community events.',
        questions: [
          q('How is small talk viewed in many English-speaking cultures?', ['As a waste of time', 'As friendly and polite', 'As rude behavior'], 1, "Obrolan ringan dianggap ramah dan sopan ('friendly and polite')."),
          q('Which topic is mentioned as good for small talk?', ['Personal bank accounts', 'The weather and weekend plans', 'Political arguments'], 1, "Cuaca, rencana akhir pekan, dan makanan lokal adalah topik yang aman."),
          q('What is the main purpose of small talk before serious discussions?', ['To build rapport', 'To end the meeting early', 'To test grammar'], 0, "Tujuannya membangun keakraban ('build rapport') sebelum masuk topik utama.")
        ]
      }
    },
    Lanjut: {
      quiz: [
        q("Apa arti idiom 'on the same page'?", ['Membaca buku yang sama', 'Memiliki pemahaman atau kesepakatan yang sama', 'Berada di ruangan yang sama'], 1, "'On the same page' berarti sepaham atau sependapat."),
        q("Bagaimana pelafalan kata 'subtle'?", ['sab-tel', 'sa-tel', 'sub-tel'], 1, "Huruf 'b' pada 'subtle' tidak dibaca (silent b), dibaca 'sa-tel'."),
        q("Lengkapi: 'Seldom ___ such an insightful discussion on cross-cultural communication.'", ['we hear', 'do we hear', 'we heard'], 1, "Kata keterangan negatif 'Seldom' di awal kalimat memicu inversi ('do we hear')."),
        q("Apa arti kata 'nuance'?", ['Perbedaan makna/nada yang halus', 'Kebisingan', 'Kesalahan fatal'], 0, "'Nuance' adalah nuansa atau perbedaan halus dalam ekspresi/makna."),
        q("Pilih ungkapan diplomatis untuk menyatakan ketidaksetujuan:", ['You are completely wrong.', 'I see your point, though I look at it from a slightly different perspective.', 'That makes zero sense.'], 1, "Mengakui sudut pandang lawan bicara terlebih dahulu adalah ciri komunikasi tingkat lanjut."),
        q("Bagaimana pelafalan 'conscientious'?", ['kon-si-en-tius', 'kon-syi-en-syes', 'kon-sai-en-syes'], 1, "Dibaca 'kon-syi-en-syes' (teliti / bersungguh-sungguh)."),
        q("Apa makna 'eloquent'?", ['Fasih, indah, dan meyakinkan dalam bertutur', 'Pendiam', 'Terbata-bata'], 0, "'Eloquent' menggambarkan kemampuan berbicara yang sangat memukau dan jelas."),
        q("Lengkapi: 'It is high time we ___ prioritizing active listening in conversations.'", ['start', 'started', 'starting'], 1, "Ungkapan 'It is high time + subjek' selalu diikuti kata kerja bentuk lampau ('started')."),
        q("Apa arti idiom 'read between the lines'?", ['Membaca dengan cepat', 'Memahami makna tersirat', 'Melewatkan paragraf'], 1, "'Read between the lines' berarti menangkap maksud tersembunyi di balik ucapan."),
        q("Pilih kata yang tepat: 'Her explanation was so ___ that everyone grasped the concept immediately.'", ['lucid', 'ambiguous', 'vague'], 0, "'Lucid' berarti sangat jernih dan mudah dipahami.")
      ],
      speaking: {
        title: 'Komunikasi Lintas Budaya',
        instruction: 'Ucapkan pernyataan berikut dengan artikulasi yang matang:',
        targetText: 'Effective communication goes beyond vocabulary; it requires active listening, empathy, and sensitivity to cultural nuances.',
        hint: 'Efektif komyunikeisyen gouz biyon vokebyuleri; it rikwaierz ektiv lisening, empeti, end sensitiviti tu kalcerel nyuansiz.'
      },
      reading: {
        title: 'Nuance in Cross-Cultural Dialogue',
        passage: 'Achieving true fluency in English involves more than mastering grammar rules; it requires understanding cultural nuances and tone. Native and international speakers often rely on indirect phrasing to maintain harmony, making active listening just as vital as speaking eloquently.',
        questions: [
          q('What else is required for true fluency besides grammar rules?', ['Understanding cultural nuances and tone', 'Speaking as fast as possible', 'Avoiding idioms'], 0, "Kefasihan sejati membutuhkan pemahaman nuansa budaya dan nada bicara."),
          q('Why do speakers often use indirect phrasing?', ['To confuse listeners', 'To maintain harmony', 'To hide lack of vocabulary'], 1, "Ungkapan tidak langsung dipakai untuk menjaga keharmonisan komunikasi."),
          q('According to the text, what is just as vital as speaking eloquently?', ['Memorizing dictionaries', 'Active listening', 'Writing long emails'], 1, "Mendengarkan secara aktif ('active listening') sama pentingnya dengan berbicara fasih.")
        ]
      }
    }
  }
};