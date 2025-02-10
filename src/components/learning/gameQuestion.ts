import { Question } from '../../types/types';

export const truthQuestions: Question[] = [
    {
        id: '1',
        question: "Kapan pertama kali kamu beneran jatuh cinta sama aku?",
        category: 'romantic',
        type: 'truth'
    },
    {
        id: '2',
        question: "Sebenernya apa sih yang bikin kamu suka sama aku?",
        category: 'romantic',
        type: 'truth'
    },
    {
        id: '3',
        question: "Momen apa yang paling gokil pas kita pacaran?",
        category: 'romantic',
        type: 'truth'
    },
    {
        id: '4',
        question: "Kalau ada yang harus kita perbaiki dalam hubungan ini, apa tuh?",
        category: 'deep',
        type: 'truth'
    },
    {
        id: '5',
        question: "Gimana sih cara kamu nunjukin rasa sayang ke aku?",
        category: 'romantic',
        type: 'truth'
    },
    {
        id: '6',
        question: "Apa ketakutan terbesar kamu soal hubungan kita?",
        category: 'deep',
        type: 'truth'
    },
    {
        id: '7',
        question: "Hal tergila apa yang pernah kamu lakuin buat cinta?",
        category: 'fun',
        type: 'truth'
    },
    {
        id: '8',
        question: "Jujur, siapa yang lebih romantis, aku atau kamu?",
        category: 'fun',
        type: 'truth'
    },
    {
        id: '9',
        question: "Kalau bisa ngulang satu momen bareng, momen apa yang bakal kamu pilih?",
        category: 'romantic',
        type: 'truth'
    },
    {
        id: '10',
        question: "Apa hal paling kocak yang pernah kamu lakuin gara-gara cinta?",
        category: 'fun',
        type: 'truth'
    },
    {
        id: '11',
        question: "Apa sih yang selalu bikin kamu senyum tiap inget aku?",
        category: 'deep',
        type: 'truth'
    },
    {
        id: '12',
        question: "Kamu pernah pura-pura suka sesuatu cuma buat bikin aku seneng gak?",
        category: 'fun',
        type: 'truth'
    },
    {
        id: '13',
        question: "Kalau hubungan kita harus digambarin pakai satu kata, apa tuh?",
        category: 'deep',
        type: 'truth'
    },
    {
        id: '14',
        question: "Kalau kita bisa liburan ke mana aja, kamu pengen kita ke mana?",
        category: 'romantic',
        type: 'truth'
    },
    {
        id: '15',
        question: "Waktu pertama kali liat aku, apa yang bikin kamu tertarik?",
        category: 'romantic',
        type: 'truth'
    }
];

export const dareQuestions: Question[] = [
    {
        id: '1',
        question: "Nyanyiin lagu favorit aku dong!",
        category: 'fun',
        type: 'dare'
    },
    {
        id: '2',
        question: "Coba tiruin gaya aku pas lagi ngambek!",
        category: 'fun',
        type: 'dare'
    },
    {
        id: '3',
        question: "Bikin video TikTok romantis bareng aku, yuk!",
        category: 'fun',
        type: 'dare'
    },
    {
        id: '4',
        question: "Ceritain satu hal memalukan tentang aku!",
        category: 'fun',
        type: 'dare'
    },
    {
        id: '5',
        question: "Kirim chat super cheesy ke aku sekarang juga!",
        category: 'romantic',
        type: 'dare'
    },
    {
        id: '6',
        question: "Telepon aku dan bilang 'Aku cinta kamu' dengan suara paling manis!",
        category: 'romantic',
        type: 'dare'
    },
    {
        id: '7',
        question: "Gendong aku selama 10 detik, bisa gak?",
        category: 'fun',
        type: 'dare'
    },
    {
        id: '8',
        question: "Upload foto kita berdua dengan caption paling romantis!",
        category: 'romantic',
        type: 'dare'
    },
    {
        id: '9',
        question: "Bikin puisi dadakan tentang aku dan bacain langsung!",
        category: 'romantic',
        type: 'dare'
    },
    {
        id: '10',
        question: "Peluk aku selama 30 detik tanpa ngomong apa-apa!",
        category: 'romantic',
        type: 'dare'
    }
];

export const coupleQuizQuestions = [
    {
        id: '1',
        question: "Apa hobi favorit Defano?",
        options: ["Touring motor", "Main game", "Nonton film", "Tidur"],
        correctAnswer: 0,
        explanation: "Defano suka touring motor buat menikmati waktu sendiri."
    },
    {
        id: '2',
        question: "Gimana sifat Najmita?",
        options: ["Pendiam", "Periang", "Pemarah", "Pemalu"],
        correctAnswer: 1,
        explanation: "Najmita itu periang dan selalu bawa vibes positif."
    },
    {
        id: '3',
        question: "Apa yang paling dibutuhin Najmita dari Defano?",
        options: ["Uang", "Waktu", "Perhatian penuh", "Kebebasan"],
        correctAnswer: 2,
        explanation: "Najmita paling butuh perhatian penuh dari Defano."
    },
    {
        id: '4',
        question: "Gimana cara Defano ngadepin konflik?",
        options: ["Marah-marah", "Diam dan menyendiri", "Menghindar", "Langsung minta maaf"],
        correctAnswer: 1,
        explanation: "Kalau ada masalah, Defano lebih milih diam dan menyendiri dulu."
    },
    {
        id: '5',
        question: "Apa yang bikin hubungan mereka spesial?",
        options: ["Sama-sama kaya", "Saling melengkapi", "Teman dari kecil", "Dijodohkan"],
        correctAnswer: 1,
        explanation: "Defano yang pendiam dan Najmita yang periang saling melengkapi."
    },
    {
        id: '6',
        question: "Makanan favorit Najmita apa, nih?",
        options: ["Sushi", "Ayam geprek", "Pizza", "Mochi"],
        correctAnswer: 3,
        explanation: "Najmita paling suka makan mochi, apalagi yang warna warni kaya ayam2an sd."
    },
    {
        id: '7',
        question: "Defano lebih suka liburan ke mana?",
        options: ["Pantai", "Gunung", "Kota besar", "Luar negeri"],
        correctAnswer: 1,
        explanation: "Defano lebih suka suasana tenang di gunung daripada keramaian kota."
    },
    {
        id: '8',
        question: "Siapa yang lebih sering ngambek di hubungan mereka?",
        options: ["Defano", "Najmita", "Dua-duanya", "Gak pernah ada yang ngambek"],
        correctAnswer: 1,
        explanation: "Najmita lebih ekspresif dan sering ngambek kalau Defano kurang perhatian."
    },
    {
        id: '9',
        question: "Siapa yang duluan ngajak jadian?",
        options: ["Defano", "Najmita", "Sama-sama", "Gak ada yang ngajak, tiba-tiba jadian aja"],
        correctAnswer: 0,
        explanation: "Defano yang duluan berani nembak Najmita!"
    },
    {
        id: '10',
        question: "Apa panggilan sayang favorit mereka?",
        options: ["Sayang", "seng", "Cintaku", "Bucin"],
        correctAnswer: 0,
        explanation: "Mereka paling sering panggil satu sama lain 'seng'."
    }
];

export const musicQuizQuestions = [
    {
        id: '1',
        title: "Lagu Pertama Kita",
        artist: "Romantis",
        year: 2023,
        hint: "Lagu yang sering kita dengar saat pertama pacaran"
    },
    {
        id: '2',
        title: "Lagu Favorit Berdua",
        artist: "Happy",
        year: 2023,
        hint: "Lagu yang selalu bikin kita semangat"
    },
    {
        id: '3',
        title: "Lagu Saat Galau",
        artist: "Sedih",
        year: 2023,
        hint: "Lagu yang didengar saat kita marahan"
    },
    {
        id: '4',
        title: "Lagu Spesial",
        artist: "Sweet",
        year: 2023,
        hint: "Lagu yang punya kenangan manis"
    },
    {
        id: '5',
        title: "Lagu Masa Depan",
        artist: "Future",
        year: 2023,
        hint: "Lagu yang menggambarkan harapan kita"
    }
];

export const coupleDrawingPrompts = [
    "Gambar wajah pasanganmu",
    "Gambar tempat first date kita",
    "Gambar moment paling romantis",
    "Gambar rencana masa depan kita",
    "Gambar hal yang paling disukai pasangan"
];

export const memeTemplates = [
    {
        id: '1',
        name: "Couple Goals",
        url: "/memes/couple-goals.jpg",
        boxCount: 2
    },
    {
        id: '2',
        name: "Sweet Moments",
        url: "/memes/sweet-moments.jpg",
        boxCount: 2
    },
    {
        id: '3',
        name: "Love Story",
        url: "/memes/love-story.jpg",
        boxCount: 3
    },
    {
        id: '4',
        name: "Relationship Goals",
        url: "/memes/relationship-goals.jpg",
        boxCount: 2
    },
    {
        id: '5',
        name: "Perfect Match",
        url: "/memes/perfect-match.jpg",
        boxCount: 2
    }
];