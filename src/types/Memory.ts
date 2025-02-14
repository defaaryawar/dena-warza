export type MediaType = 'photo' | 'video';

export interface MediaItem {
    type: MediaType;
    url: string;
    thumbnail?: string;
}

export interface Memory {
    updatedAt: any;
    id: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    media: {
        type: 'photo' | 'video';
        url: string;
        thumbnail?: string;
    }[];
}

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