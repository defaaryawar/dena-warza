export type MediaType = 'photo' | 'video';

// export interface MediaItem {
//     [x: string]: string;
//     id: string;
//     type: MediaType;
//     url: string;
//     thumbnail?: any;
// }

// export interface Memory {
//     [x: string]: any;
//     updatedAt: any;
//     id: string;
//     title: string;
//     description: string;
//     date: string;
//     tags: string[];
//     media: {
//         id: any;
//         type: 'photo' | 'video';
//         url: string;
//         thumbnail?: string;
//     }[];
// }

export interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    url: string;
    thumbnail?: string;
}

export interface Memory {
    id: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    media: MediaItem[];
    createdAt: string;
    updatedAt: string;
}

export type MemoryFormData = {
    title?: string;
    description?: string;
    date?: string;
    tags?: string[];
    media?: Array<{
        id?: string;
        type: 'photo' | 'video';
        url: string;
    }>;
};

export interface VideoWithMemoryInfo extends MediaItem {
    type: 'video';
    memoryTitle: string;
    memoryDate: string;
    description: string;
}

export type GameMode = 'menu' | 'quiz' | 'memory' | 'message' | 'timeCapsule' | 'achievements';

export interface MemoryCard {
    id: number;
    content: string;
    isFlipped: boolean;
    isMatched: boolean;
    category: string;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'partner';
    timestamp: string;
    isLiked: boolean;
}

export interface QuizStage {
    id: number;
    title: string;
    question: string;
    options: string[];
    correctAnswer: number;
    hint: string;
    image?: string;
}