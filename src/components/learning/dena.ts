interface PersonalInfo {
    name: string;
    bio: string;
    details: Record<string, string>;
    commonResponses: Record<string, string>;
}

export const personalData: Record<string, PersonalInfo> = {
    najmita: {
        name: "Najmita Zahira Dirgantoro ✨",
        bio: "Najmita adalah sosok yang ceria 😄, penuh energi 🔋, dan sangat ekspresif 🤩. Dia adalah pribadi yang mudah dikenali karena keceriaannya dan cara dia menghidupkan suasana di sekitarnya 🌟.",
        details: {
            fullName: "Najmita Zahira Dirgantoro 👑",
            nickname: "Najmi 💝",
            personality: "Ceria 😊, ekspresif 😜, emosional 😢😡😍, perhatian 🥰, romantis 💕",
            dailyLife: "Najmita adalah pribadi yang aktif dan penuh semangat 🏃‍♀️💨. Dia suka menghabiskan waktunya dengan berbagai kegiatan, baik itu bersama teman-temannya 👯‍♀️ atau melakukan hobinya 🎨.",
            relationshipWithDefano: "Najmita adalah pasangan yang sangat romantis 💘 dan penuh kasih sayang 🫂. Dia selalu berusaha untuk membuat Defano merasa dicintai 💞 dan dihargai 🌹.",
            challenges: "Salah satu tantangan terbesar Najmita adalah kecenderungannya untuk terlalu emosional 😭😤. Dia sering kali merasa kesulitan untuk mengontrol emosinya 🌋, terutama saat dia merasa tidak diperhatikan 😔 atau diabaikan oleh Defano 💔.",
            phoneNumber: "+62 858-9321-1201 📱", // Nomor telepon Najmita
            instagram: "namiiirra_ 📸", // Instagram Najmita
            nationality: "Indonesia 🇮🇩", // Kebangsaan Najmita
            favoriteFoods: "Mochi 🍡, es krim 🍦, Mixue 🥤, sate padang 🍢", // Makanan kesukaan Najmita
            allergies: "Kami belum tahu apa alergi Najmita 🤔❓", // Alergi Najmita
            fullDescription: `
                Najmita adalah sosok yang ceria 😄, penuh energi 🔋, dan sangat ekspresif 🤩. Dia adalah pribadi yang mudah dikenali karena keceriaannya dan cara dia menghidupkan suasana di sekitarnya ✨🌈. Najmita adalah tipe orang yang sangat emosional dan mudah menunjukkan perasaannya, baik itu kebahagiaan 😁, kesedihan 😢, atau kemarahan 😡. Dia adalah pasangan yang penuh kasih sayang 💖 dan selalu berusaha memberikan yang terbaik untuk orang-orang terdekatnya, terutama Defano 💑.

                Kepribadian Najmita:
                Najmita memiliki kepribadian yang hangat 🔆 dan ramah 👋. Dia adalah orang yang mudah bergaul 🤝 dan selalu bisa mencairkan suasana dengan keceriaannya 🎭. Najmita juga dikenal sebagai pribadi yang sangat perhatian 👀 dan care terhadap orang lain ❤️. Dia selalu berusaha untuk membuat orang di sekitarnya merasa nyaman 🛋️ dan bahagia 🥳, meskipun terkadang hal ini membuatnya lupa untuk merawat dirinya sendiri 🙈.

                Kehidupan Sehari-hari Najmita:
                Najmita adalah pribadi yang aktif 🏃‍♀️ dan penuh semangat 🔥. Dia suka menghabiskan waktunya dengan berbagai kegiatan, baik itu bersama teman-temannya 👯‍♀️ atau melakukan hobinya 🎨. Najmita juga sangat menyukai hal-hal yang berhubungan dengan kecantikan 💄 dan fashion 👗. Dia selalu berusaha tampil menawan dalam setiap kesempatan ✨, dan ini menjadi salah satu kebanggaannya 💅.

                Hubungan Najmita dengan Defano:
                Najmita adalah pasangan yang sangat romantis 💏 dan penuh kasih sayang 💝. Dia selalu berusaha untuk membuat Defano merasa dicintai 💕 dan dihargai 🏆. Najmita adalah tipe orang yang tidak ragu untuk menunjukkan perasaannya, baik itu melalui kata-kata 💬 atau tindakan kecil yang penuh makna 🎁. Dia sering kali memberikan kejutan 🎉 atau perhatian kecil untuk Defano, yang membuat hubungan mereka terasa lebih hidup 💓.

                Tantangan Najmita:
                Salah satu tantangan terbesar Najmita adalah kecenderungannya untuk terlalu emosional 😭😤. Dia sering kali merasa kesulitan untuk mengontrol emosinya 🌋, terutama saat dia merasa tidak diperhatikan 😔 atau diabaikan oleh Defano 💔. Najmita juga memiliki ekspektasi yang tinggi dalam hubungan ⬆️, yang terkadang sulit untuk dipenuhi oleh Defano yang lebih pendiam 🤐 dan kurang ekspresif 😐.
            `
        },
        commonResponses: {
            greeting: "Halo! 👋 Najmita adalah sosok yang ceria 😄 dan penuh energi ⚡. Dia selalu menghidupkan suasana di sekitarnya 🎉🌟.",
            aboutPersonality: "Najmita dikenal sebagai pribadi yang ceria 😊, ekspresif 🤗, dan romantis 💖. Dia sangat perhatian terhadap orang-orang terdekatnya 👨‍👩‍👧‍👦.",
            aboutRelationship: "Najmita adalah pasangan yang penuh kasih sayang 💘. Dia selalu berusaha membuat Defano merasa dicintai 💕 dan dihargai 🏆.",
            dailyLife: "Najmita adalah pribadi yang aktif 🏃‍♀️ dan penuh semangat 🔥. Dia suka menghabiskan waktunya dengan berbagai kegiatan, baik itu bersama teman-temannya 👯‍♀️ atau melakukan hobinya 🎨🎭.",
            challenges: "Salah satu tantangan terbesar Najmita adalah kecenderungannya untuk terlalu emosional 😭😡. Dia sering kali merasa kesulitan untuk mengontrol emosinya 🌋, terutama saat dia merasa tidak diperhatikan 😞 atau diabaikan oleh Defano 💔.",
            favoriteFoods: "Najmita suka makan mochi 🍡, es krim 🍦, Mixue 🥤, dan sate padang 🍢. Yummy! 😋👅",
            allergies: "Kami belum tahu apa alergi Najmita 🤔❓ Masih misteri! 🕵️‍♀️",
            default: "Najmita adalah pribadi yang ceria 😄 dan penuh perhatian 🥰. Ada yang ingin Anda tanyakan tentang dia? 🤗"
        }
    },
    defano: {
        name: "Defano Arya Wardhana 🧔",
        bio: "Defano adalah sosok yang penuh dengan kompleksitas 🧩 dan kedalaman 🌊. Dia adalah individu yang memiliki kepribadian unik, menggabungkan ketenangan 😌, keseriusan 🧐, dan kehangatan 🔥 dalam satu paket.",
        details: {
            fullName: "Defano Arya Wardhana 👨",
            nickname: "Defano 🦁",
            personality: "Tenang 😌, bijaksana 🧙‍♂️, mandiri 💪, protektif 🛡️, kurang ekspresif 😐",
            dailyLife: "Defano adalah orang yang sibuk dengan berbagai aktivitas 📊. Dia memiliki jadwal yang padat, baik itu bekerja 💼 atau mengejar hobinya, seperti touring dengan motor 🏍️ atau menikmati alam 🏞️.",
            relationshipWithNajmita: "Defano adalah sosok yang memberikan kestabilan 🏔️ dan ketenangan 🧘‍♂️ dalam hubungannya dengan Najmita. Dia selalu berusaha memahami Najmita 🤝, meskipun terkadang dia kesulitan mengekspresikan perasaannya 😶.",
            challenges: "Salah satu tantangan terbesar Defano adalah kemampuannya dalam berkomunikasi secara emosional 🗣️❤️. Dia cenderung lebih suka menyimpan perasaannya sendiri 🔒 daripada mengungkapkannya 🔓.",
            phoneNumber: "081219147116 📞", // Nomor telepon Defano
            instagram: "defaaryawar_13 📱", // Instagram Defano
            nationality: "Indonesia 🇮🇩", // Kebangsaan Defano
            favoriteFoods: "Pecel lele 🐟, ayam 🍗", // Makanan kesukaan Defano
            allergies: "Defano alergi udang 🦐⚠️", // Alergi Defano
            fullDescription: `
                Defano adalah sosok yang penuh dengan kompleksitas 🧩 dan kedalaman 🌊. Dia adalah individu yang memiliki kepribadian unik, menggabungkan ketenangan 😌, keseriusan 🧐, dan kehangatan 🔥 dalam satu paket. Meskipun terlihat pendiam 🤐 dan tertutup 🚪, Defano sebenarnya adalah pribadi yang penuh perhatian 👀 dan memiliki hati yang tulus ❤️. Dia adalah tipe orang yang lebih suka menunjukkan kasih sayang melalui tindakan 🎬 daripada kata-kata 💬, meskipun terkadang hal ini membuatnya terkesan kurang ekspresif 😐.

                Kepribadian Defano:
                Defano memiliki sifat yang tenang 🧘‍♂️ dan bijaksana 🦉. Dia adalah seseorang yang lebih suka merenung 🤔 sebelum bertindak, membuatnya terlihat seperti orang yang serius 🧐 dan fokus 🎯. Namun, di balik ketenangannya, Defano memiliki rasa humor yang kering 😏 dan cerdas 🧠, yang hanya bisa dinikmati oleh orang-orang terdekatnya. Dia juga dikenal sebagai pribadi yang mandiri 🏋️‍♂️ dan tidak suka merepotkan orang lain, meskipun terkadang hal ini membuatnya terlihat dingin ❄️ atau kurang terbuka 🚫.

                Kehidupan Sehari-hari Defano:
                Dalam kesehariannya, Defano adalah orang yang sibuk dengan berbagai aktivitas 📆. Dia memiliki jadwal yang padat, baik itu bekerja 💼 atau mengejar hobinya. Meskipun sibuk, dia selalu berusaha meluangkan waktu untuk Najmita ⏰❤️, meskipun terkadang hal ini menjadi tantangan karena sifatnya yang lebih suka menyendiri 🧍‍♂️. Defano adalah tipe orang yang lebih suka menghabiskan waktu dengan kegiatan yang produktif 🛠️, seperti memperbaiki motor 🔧🏍️ atau menjelajahi tempat-tempat baru 🧭🗺️.

                Hubungan Defano dengan Najmita:
                Dalam hubungannya dengan Najmita, Defano adalah sosok yang memberikan kestabilan 🏔️ dan ketenangan 🧘‍♂️. Dia adalah pasangan yang selalu berusaha memahami Najmita 🤝, meskipun terkadang dia kesulitan mengekspresikan perasaannya 😶. Defano sering kali menjadi penyeimbang ⚖️ bagi Najmita yang lebih emosional 😢😡😄 dan ekspresif 🤪. Meskipun mereka memiliki perbedaan yang cukup mencolok ↔️, Defano selalu berusaha untuk menciptakan harmoni 🎵 dalam hubungan mereka.

                Tantangan Defano:
                Salah satu tantangan terbesar Defano adalah kemampuannya dalam berkomunikasi secara emosional 🗣️❤️. Dia cenderung lebih suka menyimpan perasaannya sendiri 🔒 daripada mengungkapkannya 🔓, yang terkadang membuat Najmita merasa kurang diperhatikan 😔. Defano juga sering kali terlalu fokus pada pekerjaan 💻 atau hobinya 🏍️, sehingga terkadang lupa untuk meluangkan waktu berkualitas bersama Najmita ⌛💑. Namun, dia selalu berusaha untuk memperbaiki diri 📈 dan belajar menjadi pasangan yang lebih baik 💯.
            `
        },
        commonResponses: {
            greeting: "Halo! 👋 Defano adalah sosok yang tenang 😌 dan bijaksana 🧙‍♂️. Dia dikenal sebagai pribadi yang mandiri 💪 dan penuh perhatian 👀❤️.",
            aboutPersonality: "Defano memiliki kepribadian yang tenang 🧘‍♂️ dan bijaksana 🦉. Dia adalah tipe orang yang lebih suka merenung 🤔 sebelum bertindak.",
            aboutRelationship: "Defano adalah pasangan yang stabil 🏔️ dan protektif 🛡️. Dia selalu berusaha memahami dan mendukung Najmita 🤝, meskipun terkadang dia kesulitan mengekspresikan perasaannya 😶.",
            dailyLife: "Defano adalah orang yang sibuk dengan berbagai aktivitas 📊. Dia memiliki jadwal yang padat, baik itu bekerja 💼 atau mengejar hobinya, seperti touring dengan motor 🏍️💨 atau menikmati alam 🏞️🌄.",
            challenges: "Salah satu tantangan terbesar Defano adalah kemampuannya dalam berkomunikasi secara emosional 🗣️❤️. Dia cenderung lebih suka menyimpan perasaannya sendiri 🔒 daripada mengungkapkannya 🔓.",
            favoriteFoods: "Defano suka makan pecel lele 🐟 dan ayam 🍗. Tapi hati-hati, dia alergi udang! 🚫🦐 Bahaya! ⚠️",
            allergies: "Defano alergi udang 🦐⚠️. Jangan sampai dia makan ini ya! 🙅‍♂️",
            default: "Defano adalah pribadi yang tenang 😌 dan mandiri 💪. Ada yang ingin Anda tanyakan tentang dia? 🤔"
        }
    }
};

export const getPersonResponse = (person: string, topic: string): string => {
    const personData = personalData[person.toLowerCase()];
    if (!personData) return "Saya tidak memiliki informasi tentang orang tersebut. 🤷‍♂️";

    if (topic in personData.commonResponses) {
        return personData.commonResponses[topic];
    }

    if (topic in personData.details) {
        return personData.details[topic];
    }

    return personData.commonResponses.default || "Saya tidak memiliki informasi tentang topik tersebut. 🤔❓";
};