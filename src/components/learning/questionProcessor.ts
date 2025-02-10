import { knowledge } from './knowledge';

export const processQuestion = (question: string) => {
    question = question.toLowerCase();
    const { defano, najmita, relationship } = knowledge;

    const getRandomElement = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];
    const combineTraits = (traits: string[]): string => traits.sort(() => Math.random() - 0.5).slice(0, 3).join(', ');

    // Validasi Kata Kunci Utama
    const mainKeywords = ['defano', 'najmita', 'hubungan', 'sifat', 'penampilan', 'butuh', 'unik', 'spesial', 'kasih sayang', 'komunikasi', 'call', 'telepon', 'cocok', 'melengkapi', 'perbedaan', 'mengatasi', 'cerita', 'tentang', 'hobi', 'suka', 'kegiatan', 'marah', 'emosi', 'mood'];
    const hasMainKeyword = mainKeywords.some(keyword => question.includes(keyword));

    if (!hasMainKeyword) {
        return `Coba tanya lebih spesifik tentang ${getRandomElement([
            'keseharian mereka',
            'hubungan mereka',
            'bagaimana mereka berkomunikasi',
            'apa yang membuat mereka spesial'
        ])}?`;
    }

    // Daily Life & Time Spent
    if (question.includes('sehari-hari') || question.includes('menghabiskan waktu') || question.includes('kegiatan')) {
        if (question.includes('defano')) {
            return `Defano ${combineTraits(defano.daily)}. Dia suka ${combineTraits(defano.hobbies)}, dan biasanya ${getRandomElement(defano.daily)}. ${getRandomElement(['Meski sibuk', 'Walaupun punya kesibukannya sendiri'])} dia tetap ${getRandomElement(defano.relationship)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita biasanya ${combineTraits(najmita.daily)}. Dia suka ${combineTraits(najmita.hobbies)}, dan ${getRandomElement(najmita.daily)}. ${getRandomElement(['Meski sering ngambek', 'Walaupun mood swing'])} dia tetap ${getRandomElement(najmita.personality)}.`;
        }
        return `Sehari-hari mereka ${getRandomElement(relationship.challenges)}, tapi ${getRandomElement(relationship.strengths)}. Defano ${getRandomElement(defano.daily)} sementara Najmita ${getRandomElement(najmita.daily)}.`;
    }

    // Sifat Defano
    if (question.includes('sifat') && question.includes('defano')) {
        const traits = [
            `Defano adalah seorang yang ${combineTraits(defano.personality)}. Meski terkesan pendiam, dia selalu berusaha baik pada semua orang meski terkadang merasa tidak enak hati.`,
            `Di balik sifatnya yang ${combineTraits(defano.personality)}, Defano menyimpan kebaikan hati yang tulus. Dia selalu ingin berbuat baik meski kadang merasa canggung.`,
            `Defano merupakan pribadi yang ${combineTraits(defano.personality)}, tapi siapapun yang mengenalnya akan tahu betapa baik hatinya. Dia selalu berusaha untuk tidak menyakiti perasaan orang lain.`
        ];
        return getRandomElement(traits);
    }

    // Sifat Najmita
    if (question.includes('sifat') && question.includes('najmita')) {
        const traits = [
            `Najmita adalah sosok yang ${combineTraits(najmita.personality)}. Yang membuatnya istimewa adalah caranya memberikan perhatian dan kasih sayang pada orang-orang terdekatnya.`,
            `Dengan sifatnya yang ${combineTraits(najmita.personality)}, Najmita selalu bisa mencairkan suasana. Dia sangat care dan perhatian, terutama pada orang-orang yang dia sayangi.`,
            `Keceriaan Najmita selalu bisa membuat orang di sekitarnya ikut bahagia. Dia memiliki hati yang baik dan sangat care pada orang terdekatnya.`
        ];
        return getRandomElement(traits);
    }

    // Penampilan Najmita
    if ((question.includes('penampilan') || question.includes('cantik')) && question.includes('najmita')) {
        const looks = [
            `Najmita selalu terlihat mempesona dalam setiap kesempatan. ${combineTraits(najmita.appearance)} membuatnya selalu tampil menawan, membuatnya menjadi pusat perhatian ke manapun dia pergi.`,
            `Dengan ${combineTraits(najmita.appearance)}, Najmita selalu tampil memukau. Penampilannya selalu menjadi yang terbaik dalam situasi apapun.`
        ];
        return getRandomElement(looks);
    }

    // Kebutuhan Najmita
    if (question.includes('butuh') && question.includes('najmita')) {
        const needs = [
            `Yang Najmita butuhkan adalah ${combineTraits(najmita.needs)}. Dia sangat mendambakan kehadiran Defano dalam hidupnya dan impian akan keluarga yang hangat bersama.`,
            `Najmita sangat membutuhkan ${combineTraits(najmita.needs)}. Dia butuh kepastian dan validasi cinta dari Defano, serta berharap bisa membangun keluarga yang hangat bersamanya.`,
            `Bagi Najmita, kebutuhan terbesarnya adalah ${combineTraits(najmita.needs)}. Dia ingin selalu merasakan kehadiran Defano dan membangun masa depan yang hangat bersama.`
        ];
        return getRandomElement(needs);
    }

    // Hubungan Mereka
    if (question.includes('hubungan') && !question.includes('sehari')) {
        const relationship = [
            `Hubungan Defano dan Najmita adalah perpaduan dua kepribadian yang saling melengkapi. Defano yang ${combineTraits(defano.personality)} menemukan keceriaan dalam diri Najmita, sementara Najmita menemukan kedamaian dalam diri Defano.`,
            `Meski berbeda karakter, cinta Defano dan Najmita saling menguatkan. Defano yang ${combineTraits(defano.personality)}, dan Najmita yang ${combineTraits(najmita.personality)}, membuat hubungan mereka menjadi istimewa.`,
            `Defano dan Najmita membuktikan bahwa perbedaan bisa menjadi kekuatan dalam hubungan. Ketenangan Defano dan keceriaan Najmita menciptakan harmoni yang sempurna.`
        ];
        return getRandomElement(relationship);
    }

    // Unique/Special Qualities
    if (question.includes('unik') || question.includes('spesial')) {
        if (question.includes('defano')) {
            return `Yang unik dari Defano adalah dia ${combineTraits(defano.personality)}, tapi sangat ${combineTraits(defano.relationship)}. ${getRandomElement(['Meski pendiam', 'Walaupun kurang peka'])}, dia selalu ${getRandomElement(defano.relationship)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita spesial karena dia ${combineTraits(najmita.personality)} dan ${combineTraits(najmita.appearance)}. ${getRandomElement(['Meski mood swing', 'Walaupun keras kepala'])}, dia sangat ${getRandomElement(najmita.personality)}.`;
        }
        if (question.includes('hubungan')) {
            return `Yang spesial dari hubungan mereka adalah ${combineTraits(relationship.strengths)}. Meski ${combineTraits(relationship.challenges)}, mereka tetap ${combineTraits(relationship.strengths)}.`;
        }
    }

    // Show Love/Affection
    if (question.includes('kasih sayang') || question.includes('sayang')) {
        return `Defano menunjukkan sayangnya dengan cara ${combineTraits(defano.relationship)}, meski kadang ${combineTraits(defano.daily)}. Sementara Najmita mengekspresikan sayangnya dengan ${combineTraits(najmita.daily)}, walaupun sering ${combineTraits(najmita.daily)}. ${getRandomElement(['Mereka punya cara unik', 'Cara mereka berbeda'])} dalam menunjukkan kasih sayang.`;
    }

    // Communication & Video Call
    if (question.includes('komunikasi') || question.includes('call') || question.includes('telepon')) {
        const issues = [
            'Najmita butuh video call setiap hari',
            'Defano kadang sibuk dan lupa menghubungi',
            'Komunikasi mereka tidak selalu lancar',
            'Najmita sering ngambek kalau tidak di-call'
        ];
        return `${getRandomElement(issues)}. ${combineTraits(relationship.challenges)}, namun ${combineTraits(relationship.strengths)}. Defano ${combineTraits(defano.daily)} sementara Najmita ${combineTraits(najmita.daily)}.`;
    }

    // Compatibility
    if (question.includes('cocok') || question.includes('melengkapi')) {
        return `Mereka cocok karena ${combineTraits(relationship.strengths)}. Defano yang ${combineTraits(defano.personality)} melengkapi Najmita yang ${combineTraits(najmita.personality)}. ${getRandomElement(['Perbedaan mereka justru membuat mereka kuat', 'Mereka saling mengisi kekurangan'])}. Meski ${combineTraits(relationship.challenges)}, tapi ${combineTraits(relationship.strengths)}.`;
    }

    // Handle Differences
    if (question.includes('perbedaan') || question.includes('mengatasi')) {
        return `Dalam mengatasi perbedaan, ${combineTraits(relationship.strengths)}. Defano yang ${combineTraits(defano.personality)} berusaha memahami Najmita yang ${combineTraits(najmita.personality)}. ${combineTraits(relationship.challenges)}, tapi mereka ${combineTraits(relationship.strengths)}.`;
    }

    // General info
    if (question.includes('cerita') || question.includes('tentang')) {
        if (question.includes('defano')) {
            return `Defano adalah sosok yang ${combineTraits(defano.personality)}. Dalam kesehariannya, dia ${combineTraits(defano.daily)}. ${getRandomElement(['Meski sibuk', 'Walaupun pendiam'])}, dia sangat ${combineTraits(defano.relationship)} ke Najmita. Soal makanan, dia ${combineTraits(defano.food)}. Dia suka ${combineTraits(defano.hobbies)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita adalah pribadi yang ${combineTraits(najmita.personality)}. Penampilannya ${combineTraits(najmita.appearance)}. Sehari-hari dia ${combineTraits(najmita.daily)}. Dia sangat ${combineTraits(najmita.personality)} dan suka ${combineTraits(najmita.hobbies)}. Yang dia butuhkan adalah ${combineTraits(najmita.needs)}.`;
        }
    }

    // Hobbies & Activities
    if (question.includes('hobi') || question.includes('suka') || question.includes('kegiatan')) {
        if (question.includes('defano')) {
            const motorHobbies = defano.hobbies.filter(h => h.includes('motor') || h.includes('touring'));
            if (question.includes('motor') || question.includes('touring')) {
                return `Defano sangat ${motorHobbies.join(' dan ')}. ${getRandomElement(['Ini caranya menikmati waktu sendiri', 'Dengan motor dia bisa menenangkan diri', 'Touring adalah hobi favoritnya'])}. Sekalian ${combineTraits(defano.hobbies)}.`;
            }
            return `Defano suka ${combineTraits(defano.hobbies)}. Dia juga ${combineTraits(defano.daily)}. ${getRandomElement(['Selain itu', 'Di waktu lain'])} dia suka ${combineTraits(defano.hobbies)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita suka ${combineTraits(najmita.hobbies)}. Dia senang ${combineTraits(najmita.daily)} dan ${combineTraits(najmita.hobbies)}. ${getRandomElement(['Yang paling dia suka', 'Favoritnya adalah'])} ${combineTraits(najmita.hobbies)}.`;
        }
        return `Bersama-sama, mereka suka ${getRandomElement(['jalan-jalan', 'menghabiskan waktu', 'berbagi cerita'])}. Defano ${combineTraits(defano.relationship)} sementara Najmita ${combineTraits(najmita.needs)}.`;
    }

    // Emotions & Reactions
    if (question.includes('marah') || question.includes('emosi') || question.includes('mood')) {
        if (question.includes('defano')) {
            return `Saat marah, Defano lebih memilih ${getRandomElement(['diam', 'menyendiri', 'tidak banyak bicara'])}. Dia ${combineTraits(defano.personality)} dan ${combineTraits(defano.personality)}. ${getRandomElement(['Tapi tetap', 'Meski begitu'])} dia ${combineTraits(defano.relationship)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita ${getRandomElement(['mood-nya sering berubah', 'gampang ngambek', 'sensitif'])}. Dia butuh ${combineTraits(najmita.needs)} dan ${combineTraits(najmita.needs)}. ${getRandomElement(['Tapi sebenarnya', 'Di balik itu'])} dia sangat ${combineTraits(najmita.personality)}.`;
        }
    }

    return `Coba tanya lebih spesifik tentang ${getRandomElement([
        'keseharian mereka',
        'hubungan mereka',
        'bagaimana mereka berkomunikasi',
        'apa yang membuat mereka spesial'
    ])}?`;
};