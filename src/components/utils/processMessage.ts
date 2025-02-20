import { getPersonResponse } from '../learning/dena';

export const processMessage = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Handle different names/nicknames
    const isDefano = lowerInput.includes('defano') || lowerInput.includes('defa');
    const isNajmita = lowerInput.includes('najmita') || lowerInput.includes('najmi') || lowerInput.includes('nami');

    // Handle general "who is" questions
    if (lowerInput.includes('siapa')) {
        if (isDefano) {
            return getPersonResponse('defano', 'aboutPersonality');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'aboutPersonality');
        }
    }

    // Handle food-related questions
    if (lowerInput.includes('makan') || lowerInput.includes('suka makan')) {
        if (isDefano) {
            return getPersonResponse('defano', 'favoriteFoods');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'favoriteFoods');
        }
    }

    // Handle allergy-related questions
    if (lowerInput.includes('alergi')) {
        if (isDefano) {
            return getPersonResponse('defano', 'allergies');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'allergies');
        }
    }

    // Handle hobby-related questions
    if (lowerInput.includes('hobi') || lowerInput.includes('kesukaan')) {
        if (isDefano) {
            return getPersonResponse('defano', 'hobbies');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'hobbies');
        }
    }

    // Handle relationship-related questions
    if (lowerInput.includes('hubungan') || lowerInput.includes('pasangan') ||
        lowerInput.includes('suka') || lowerInput.includes('cinta') ||
        lowerInput.includes('pacar') || lowerInput.includes('jadian')) {
        if (isDefano) {
            return getPersonResponse('defano', 'aboutRelationship');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'aboutRelationship');
        }
    }

    // Handle daily life-related questions
    if (lowerInput.includes('keseharian') || lowerInput.includes('aktivitas') ||
        lowerInput.includes('kegiatan') || lowerInput.includes('ngapain aja')) {
        if (isDefano) {
            return getPersonResponse('defano', 'dailyLife');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'dailyLife');
        }
    }

    // Handle challenge-related questions
    if (lowerInput.includes('tantangan') || lowerInput.includes('kesulitan') ||
        lowerInput.includes('masalah') || lowerInput.includes('kendala')) {
        if (isDefano) {
            return getPersonResponse('defano', 'challenges');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'challenges');
        }
    }

    // Handle social media questions
    if (lowerInput.includes('instagram') || lowerInput.includes('ig') ||
        lowerInput.includes('sosmed') || lowerInput.includes('social media')) {
        if (isDefano) {
            return getPersonResponse('defano', 'socialMedia');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'socialMedia');
        }
    }

    // Handle contact information questions
    if (lowerInput.includes('nomor') || lowerInput.includes('no hp') ||
        lowerInput.includes('kontak') || lowerInput.includes('hubungi')) {
        if (isDefano) {
            return getPersonResponse('defano', 'contactInfo');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'contactInfo');
        }
    }

    // Handle nationality/origin questions
    if (lowerInput.includes('kebangsaan') || lowerInput.includes('asal') ||
        lowerInput.includes('dari mana') || lowerInput.includes('tinggal')) {
        if (isDefano) {
            return getPersonResponse('defano', 'origin');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'origin');
        }
    }

    // Handle appearance-related questions
    if (lowerInput.includes('cantik') || lowerInput.includes('ganteng') ||
        lowerInput.includes('tampan') || lowerInput.includes('penampilan')) {
        if (isDefano) {
            return getPersonResponse('defano', 'appearance');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'appearance');
        }
    }

    // Handle personal feelings questions
    if (lowerInput.includes('suka sama') || lowerInput.includes('suka pada') ||
        lowerInput.includes('cinta sama') || lowerInput.includes('perasaan')) {
        if (isDefano) {
            return getPersonResponse('defano', 'personalFeelings');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'personalFeelings');
        }
    }

    // Handle personality questions
    if (lowerInput.includes('sifat') || lowerInput.includes('karakter') ||
        lowerInput.includes('kepribadian') || lowerInput.includes('orangnya')) {
        if (isDefano) {
            return getPersonResponse('defano', 'personality');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'personality');
        }
    }

    // Handle full description requests
    if (lowerInput.includes('deskripsi lengkap') || lowerInput.includes('ceritakan tentang') ||
        lowerInput.includes('jelaskan tentang') || lowerInput.includes('info lengkap')) {
        if (isDefano) {
            return getPersonResponse('defano', 'fullDescription');
        }
        if (isNajmita) {
            return getPersonResponse('najmita', 'fullDescription');
        }
    }

    return input;
};