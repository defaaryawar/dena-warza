export type GameMode = 'menu' | 'truthOrDare' | 'coupleQuiz' | 'drawTogether' | 'musicGuess' | 'memeGenerator' | 'memories';

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

export interface MemeTemplate {
    id: string;
    name: string;
    url: string;
    boxCount: number;
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