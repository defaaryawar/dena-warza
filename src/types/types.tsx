export type GameMode = 'menu' | 'truthOrDare' | 'coupleQuiz' | 'drawTogether' | 'musicGuess' | 'loveQuiz' | 'memories';

export type AlertType = 'success' | 'error' | 'info' | 'warning' | 'achievement' | 'reward' | 'love' | 'milestone';

export interface Question {
    id: string;
    question: string;
    category: 'fun' | 'deep' | 'romantic';
    type: 'truth' | 'dare';
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    year: number;
    hint: string;
}

export interface DrawingData {
    path: string;
    color: string;
    width: number;
}

export interface ProfileStats {
    birthday: string;
    zodiac: string;
    email: string;
    bio: string;
    image: string;
    location?: string;
}

export interface ProfileData {
    [key: string]: ProfileStats;
}

export interface BaseGameProps {
    onExperienceGain: (amount: number) => void;
    onAddAlert: (type: AlertType, title: string, message: string) => void;
    onGameModeChange: (mode: GameMode) => void;
}

export interface Alert {
    id: string;
    type: AlertType;
    title: string;
    message: string;
}

export interface MemoryFormErrors {
    title?: string;
    description?: string;
    date?: string;
    media?: string;
    server?: string;
}

export interface FormFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    clearError: () => void;
}