import { getPersonResponse } from '../learning/dena';

let currentUser: string | null = null; // Variabel untuk menyimpan identitas pengguna

export const processMessage = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Jika pengguna belum mengonfirmasi identitasnya
    if (!currentUser) {
        // Handle love-related questions (e.g., "kamu sayang aku ga?", "kamu cinta aku ga?")
        if (lowerInput.includes('kamu sayang aku') || lowerInput.includes('kamu cinta aku') ||
            lowerInput.includes('sayang ga') || lowerInput.includes('cinta ga')) {
            return "Sebelum menjawab, boleh tahu kamu Defano atau Najmita? 😊";
        }

        // Jika pengguna mengonfirmasi identitasnya
        if (lowerInput.includes('defano') || lowerInput.includes('najmita')) {
            currentUser = lowerInput.includes('defano') ? 'defano' : 'najmita';
            return `Terima kasih sudah mengonfirmasi, ${currentUser === 'defano' ? 'Defano' : 'Najmita'}! 😊 Sekarang, apa yang bisa saya bantu?`;
        }
    }

    // Jika pengguna sudah mengonfirmasi identitasnya
    if (currentUser) {
        // Handle love-related questions (e.g., "kamu sayang aku ga?", "kamu cinta aku ga?")
        if (lowerInput.includes('kamu sayang aku') || lowerInput.includes('kamu cinta aku') ||
            lowerInput.includes('sayang ga') || lowerInput.includes('cinta ga')) {
            return getPersonResponse(currentUser, 'loveResponse');
        }

        // Handle other questions based on the confirmed identity
        if (lowerInput.includes('siapa')) {
            return getPersonResponse(currentUser, 'aboutPersonality');
        }

        if (lowerInput.includes('makan') || lowerInput.includes('suka makan')) {
            return getPersonResponse(currentUser, 'favoriteFoods');
        }

        if (lowerInput.includes('alergi')) {
            return getPersonResponse(currentUser, 'allergies');
        }

        if (lowerInput.includes('hobi') || lowerInput.includes('kesukaan')) {
            return getPersonResponse(currentUser, 'hobbies');
        }

        if (lowerInput.includes('hubungan') || lowerInput.includes('pasangan') ||
            lowerInput.includes('suka') || lowerInput.includes('cinta') ||
            lowerInput.includes('pacar') || lowerInput.includes('jadian')) {
            return getPersonResponse(currentUser, 'aboutRelationship');
        }

        if (lowerInput.includes('keseharian') || lowerInput.includes('aktivitas') ||
            lowerInput.includes('kegiatan') || lowerInput.includes('ngapain aja')) {
            return getPersonResponse(currentUser, 'dailyLife');
        }

        if (lowerInput.includes('tantangan') || lowerInput.includes('kesulitan') ||
            lowerInput.includes('masalah') || lowerInput.includes('kendala')) {
            return getPersonResponse(currentUser, 'challenges');
        }

        if (lowerInput.includes('instagram') || lowerInput.includes('ig') ||
            lowerInput.includes('sosmed') || lowerInput.includes('social media')) {
            return getPersonResponse(currentUser, 'socialMedia');
        }

        if (lowerInput.includes('nomor') || lowerInput.includes('no hp') ||
            lowerInput.includes('kontak') || lowerInput.includes('hubungi')) {
            return getPersonResponse(currentUser, 'contactInfo');
        }

        if (lowerInput.includes('kebangsaan') || lowerInput.includes('asal') ||
            lowerInput.includes('dari mana') || lowerInput.includes('tinggal')) {
            return getPersonResponse(currentUser, 'origin');
        }

        if (lowerInput.includes('cantik') || lowerInput.includes('ganteng') ||
            lowerInput.includes('tampan') || lowerInput.includes('penampilan')) {
            return getPersonResponse(currentUser, 'appearance');
        }

        if (lowerInput.includes('suka sama') || lowerInput.includes('suka pada') ||
            lowerInput.includes('cinta sama') || lowerInput.includes('perasaan')) {
            return getPersonResponse(currentUser, 'personalFeelings');
        }

        if (lowerInput.includes('sifat') || lowerInput.includes('karakter') ||
            lowerInput.includes('kepribadian') || lowerInput.includes('orangnya')) {
            return getPersonResponse(currentUser, 'personality');
        }

        if (lowerInput.includes('deskripsi lengkap') || lowerInput.includes('ceritakan tentang') ||
            lowerInput.includes('jelaskan tentang') || lowerInput.includes('info lengkap')) {
            return getPersonResponse(currentUser, 'fullDescription');
        }
    }

    return "Maaf, saya tidak mengerti pertanyaan Anda. 😅 Ada yang bisa saya bantu? 🤗";
};