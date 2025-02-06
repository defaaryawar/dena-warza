import { knowledge } from './knowledge';

export const processQuestion = (question: string) => {
    question = question.toLowerCase();
    const { defano, najmita, relationship } = knowledge;

    const getRandomElement = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];
    const combineTraits = (traits: string[]): string => traits.sort(() => Math.random() - 0.5).slice(0, 3).join(', ');

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
            'Defano adalah seorang introvert dengan pembawaan yang cool namun memiliki hati yang lembut. Meski terkesan pendiam, dia selalu berusaha baik pada semua orang meski terkadang merasa tidak enak hati.',
            'Di balik sifatnya yang cool dan introvert, Defano menyimpan kebaikan hati yang tulus. Dia selalu ingin berbuat baik meski kadang merasa canggung.',
            'Defano merupakan pribadi yang introvert dan terkesan cool, tapi siapapun yang mengenalnya akan tahu betapa baik hatinya. Dia selalu berusaha untuk tidak menyakiti perasaan orang lain.'
        ];
        return getRandomElement(traits);
    }

    // Sifat Najmita
    if (question.includes('sifat') && question.includes('najmita')) {
        const traits = [
            'Najmita adalah sosok yang periang dan selalu membawa keceriaan. Yang membuatnya istimewa adalah caranya memberikan perhatian dan kasih sayang pada orang-orang terdekatnya.',
            'Dengan sifatnya yang periang, Najmita selalu bisa mencairkan suasana. Dia sangat care dan perhatian, terutama pada orang-orang yang dia sayangi.',
            'Keceriaan Najmita selalu bisa membuat orang di sekitarnya ikut bahagia. Dia memiliki hati yang baik dan sangat care pada orang terdekatnya.'
        ];
        return getRandomElement(traits);
    }

    // Penampilan Najmita
    if ((question.includes('penampilan') || question.includes('cantik')) && question.includes('najmita')) {
        const looks = [
            'Najmita selalu terlihat mempesona dalam setiap kesempatan. Bentuk tubuhnya yang sempurna membuatnya selalu tampil menawan, membuatnya menjadi pusat perhatian ke manapun dia pergi, Dengan postur tubuh yang ideal, Najmita selalu tampil memukau. Penampilannya selalu menjadi yang terbaik dalam situasi apapun.',
        ];
        return getRandomElement(looks);
    }

    // Kebutuhan Najmita
    if (question.includes('butuh') && question.includes('najmita')) {
        const needs = [
            'Yang Najmita butuhkan adalah perhatian penuh dari Defano dan validasi atas cinta mereka. Dia sangat mendambakan kehadiran Defano dalam hidupnya dan impian akan keluarga yang hangat bersama.',
            'Najmita sangat membutuhkan Defano dalam hidupnya. Dia butuh kepastian dan validasi cinta dari Defano, serta berharap bisa membangun keluarga yang hangat bersamanya.',
            'Bagi Najmita, kebutuhan terbesarnya adalah perhatian dan cinta Defano. Dia ingin selalu merasakan kehadiran Defano dan membangun masa depan yang hangat bersama.'
        ];
        return getRandomElement(needs);
    }

    // Hubungan Mereka
    if (question.includes('hubungan') && !question.includes('sehari')) {
        const relationship = [
            'Hubungan Defano dan Najmita adalah perpaduan dua kepribadian yang saling melengkapi. Defano yang introvert menemukan keceriaan dalam diri Najmita, sementara Najmita menemukan kedamaian dalam diri Defano.',
            'Meski berbeda karakter, cinta Defano dan Najmita saling menguatkan. Defano yang cool tapi perhatian, dan Najmita yang ceria tapi butuh kasih sayang, membuat hubungan mereka menjadi istimewa.',
            'Defano dan Najmita membuktikan bahwa perbedaan bisa menjadi kekuatan dalam hubungan. Ketenangan Defano dan keceriaan Najmita menciptakan harmoni yang sempurna.'
        ];
        return getRandomElement(relationship);
    }

    // Unique/Special Qualities
    if (question.includes('unik') || question.includes('spesial')) {
        if (question.includes('defano')) {
            return `Yang unik dari Defano adalah dia ${getRandomElement(defano.personality)}, tapi sangat ${getRandomElement(defano.relationship)}. Dia ${combineTraits(defano.personality)} namun tetap ${getRandomElement(defano.relationship)}. ${getRandomElement(['Meski pendiam', 'Walaupun kurang peka'])}, dia selalu ${getRandomElement(defano.relationship)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita spesial karena dia ${getRandomElement(najmita.personality)} dan ${getRandomElement(najmita.appearance)}. Dia ${combineTraits(najmita.personality)} namun tetap ${getRandomElement(najmita.personality)}. ${getRandomElement(['Meski mood swing', 'Walaupun keras kepala'])}, dia sangat ${getRandomElement(najmita.personality)}.`;
        }
        if (question.includes('hubungan')) {
            return `Yang spesial dari hubungan mereka adalah ${getRandomElement(relationship.strengths)}. Meski ${getRandomElement(relationship.challenges)}, mereka tetap ${getRandomElement(relationship.strengths)}. Defano ${getRandomElement(defano.relationship)} dan Najmita ${getRandomElement(najmita.needs)}.`;
        }
    }

    // Show Love/Affection
    if (question.includes('kasih sayang') || question.includes('sayang')) {
        return `Defano menunjukkan sayangnya dengan cara ${getRandomElement(defano.relationship)}, meski kadang ${getRandomElement(defano.daily)}. Sementara Najmita mengekspresikan sayangnya dengan ${getRandomElement(najmita.daily)}, walaupun sering ${getRandomElement(najmita.daily)}. ${getRandomElement(['Mereka punya cara unik', 'Cara mereka berbeda'])} dalam menunjukkan kasih sayang.`;
    }

    // Communication & Video Call
    if (question.includes('komunikasi') || question.includes('call') || question.includes('telepon')) {
        const issues = [
            'Najmita butuh video call setiap hari',
            'Defano kadang sibuk dan lupa menghubungi',
            'Komunikasi mereka tidak selalu lancar',
            'Najmita sering ngambek kalau tidak di-call'
        ];
        return `${getRandomElement(issues)}. ${getRandomElement(relationship.challenges)}, namun ${getRandomElement(relationship.strengths)}. Defano ${getRandomElement(defano.daily)} sementara Najmita ${getRandomElement(najmita.daily)}.`;
    }

    // Compatibility
    if (question.includes('cocok') || question.includes('melengkapi')) {
        return `Mereka cocok karena ${getRandomElement(relationship.strengths)}. Defano yang ${combineTraits(defano.personality)} melengkapi Najmita yang ${combineTraits(najmita.personality)}. ${getRandomElement(['Perbedaan mereka justru membuat mereka kuat', 'Mereka saling mengisi kekurangan'])}. Meski ${getRandomElement(relationship.challenges)}, tapi ${getRandomElement(relationship.strengths)}.`;
    }

    // Handle Differences
    if (question.includes('perbedaan') || question.includes('mengatasi')) {
        return `Dalam mengatasi perbedaan, ${getRandomElement(relationship.strengths)}. Defano yang ${getRandomElement(defano.personality)} berusaha memahami Najmita yang ${getRandomElement(najmita.personality)}. ${getRandomElement(relationship.challenges)}, tapi mereka ${getRandomElement(relationship.strengths)}.`;
    }

    // General info
    if (question.includes('cerita') || question.includes('tentang')) {
        if (question.includes('defano')) {
            return `Defano adalah sosok yang ${combineTraits(defano.personality)}. Dalam kesehariannya, dia ${combineTraits(defano.daily)}. ${getRandomElement(['Meski sibuk', 'Walaupun pendiam'])}, dia sangat ${getRandomElement(defano.relationship)} ke Najmita. Soal makanan, dia ${getRandomElement(defano.food)}. Dia suka ${combineTraits(defano.hobbies)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita adalah pribadi yang ${combineTraits(najmita.personality)}. Penampilannya ${combineTraits(najmita.appearance)}. Sehari-hari dia ${combineTraits(najmita.daily)}. Dia sangat ${getRandomElement(najmita.personality)} dan suka ${combineTraits(najmita.hobbies)}. Yang dia butuhkan adalah ${getRandomElement(najmita.needs)}.`;
        }
    }

    // Hobbies & Activities
    if (question.includes('hobi') || question.includes('suka') || question.includes('kegiatan')) {
        if (question.includes('defano')) {
            const motorHobbies = defano.hobbies.filter(h => h.includes('motor') || h.includes('touring'));
            if (question.includes('motor') || question.includes('touring')) {
                return `Defano sangat ${motorHobbies.join(' dan ')}. ${getRandomElement(['Ini caranya menikmati waktu sendiri', 'Dengan motor dia bisa menenangkan diri', 'Touring adalah hobi favoritnya'])}. Sekalian ${getRandomElement(defano.hobbies)}.`;
            }
            return `Defano suka ${combineTraits(defano.hobbies)}. Dia juga ${getRandomElement(defano.daily)}. ${getRandomElement(['Selain itu', 'Di waktu lain'])} dia suka ${getRandomElement(defano.hobbies)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita suka ${combineTraits(najmita.hobbies)}. Dia senang ${getRandomElement(najmita.daily)} dan ${getRandomElement(najmita.hobbies)}. ${getRandomElement(['Yang paling dia suka', 'Favoritnya adalah'])} ${getRandomElement(najmita.hobbies)}.`;
        }
        return `Bersama-sama, mereka suka ${getRandomElement(['jalan-jalan', 'menghabiskan waktu', 'berbagi cerita'])}. Defano ${getRandomElement(defano.relationship)} sementara Najmita ${getRandomElement(najmita.needs)}.`;
    }

    // Emotions & Reactions
    if (question.includes('marah') || question.includes('emosi') || question.includes('mood')) {
        if (question.includes('defano')) {
            return `Saat marah, Defano lebih memilih ${getRandomElement(['diam', 'menyendiri', 'tidak banyak bicara'])}. Dia ${getRandomElement(defano.personality)} dan ${getRandomElement(defano.personality)}. ${getRandomElement(['Tapi tetap', 'Meski begitu'])} dia ${getRandomElement(defano.relationship)}.`;
        }
        if (question.includes('najmita')) {
            return `Najmita ${getRandomElement(['mood-nya sering berubah', 'gampang ngambek', 'sensitif'])}. Dia butuh ${getRandomElement(najmita.needs)} dan ${getRandomElement(najmita.needs)}. ${getRandomElement(['Tapi sebenarnya', 'Di balik itu'])} dia sangat ${getRandomElement(najmita.personality)}.`;
        }
    }


    return `Coba tanya lebih spesifik tentang ${getRandomElement([
        'keseharian mereka',
        'hubungan mereka',
        'bagaimana mereka berkomunikasi',
        'apa yang membuat mereka spesial'
    ])}?`;
};