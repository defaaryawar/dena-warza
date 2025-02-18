import { getPersonResponse } from '../learning/dena';

export const processMessage = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Handle general "who is" questions
    if (lowerInput.includes('siapa')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'aboutPersonality'); // Return general info about Defano
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'aboutPersonality'); // Return general info about Najmita
        }
    }

    // Handle food-related questions
    if (lowerInput.includes('makan') || lowerInput.includes('suka makan')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'favoriteFoods'); // Return Defano's favorite foods
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'favoriteFoods'); // Return Najmita's favorite foods
        }
    }

    // Handle allergy-related questions
    if (lowerInput.includes('alergi')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'allergies'); // Return Defano's allergies
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'allergies'); // Return Najmita's allergies
        }
    }

    // Handle hobby-related questions
    if (lowerInput.includes('hobi') || lowerInput.includes('kesukaan')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'hobbies'); // Return Defano's hobbies
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'hobbies'); // Return Najmita's hobbies
        }
    }

    // Handle relationship-related questions
    if (lowerInput.includes('hubungan') || lowerInput.includes('pasangan')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'aboutRelationship'); // Return Defano's relationship info
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'aboutRelationship'); // Return Najmita's relationship info
        }
    }

    // Handle daily life-related questions
    if (lowerInput.includes('keseharian') || lowerInput.includes('aktivitas')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'dailyLife'); // Return Defano's daily life info
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'dailyLife'); // Return Najmita's daily life info
        }
    }

    // Handle challenge-related questions
    if (lowerInput.includes('tantangan') || lowerInput.includes('kesulitan')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'challenges'); // Return Defano's challenges
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'challenges'); // Return Najmita's challenges
        }
    }

    // Handle Instagram-related questions
    if (lowerInput.includes('instagram') || lowerInput.includes('ig')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'instagram'); // Return Defano's Instagram
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'instagram'); // Return Najmita's Instagram
        }
    }

    // Handle phone number-related questions
    if (lowerInput.includes('nomor telepon') || lowerInput.includes('no hp')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'phoneNumber'); // Return Defano's phone number
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'phoneNumber'); // Return Najmita's phone number
        }
    }

    // Handle nationality-related questions
    if (lowerInput.includes('kebangsaan') || lowerInput.includes('asal')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'nationality'); // Return Defano's nationality
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'nationality'); // Return Najmita's nationality
        }
    }

    // Handle full description-related questions
    if (lowerInput.includes('deskripsi lengkap') || lowerInput.includes('ceritakan tentang')) {
        if (lowerInput.includes('defano')) {
            return getPersonResponse('defano', 'fullDescription'); // Return Defano's full description
        }
        if (lowerInput.includes('najmita') || lowerInput.includes('najmi')) {
            return getPersonResponse('najmita', 'fullDescription'); // Return Najmita's full description
        }
    }

    return input;
};