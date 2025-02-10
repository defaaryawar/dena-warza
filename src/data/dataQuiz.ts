import { ReactNode, ButtonHTMLAttributes } from 'react';

// Alert Types
export interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
  className?: string;
}

export interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

// Progress Types
export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

// Button Types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

// Card Types
export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

// Game Types
export type GameMode = 'menu' | 'quiz' | 'memory' | 'message' | 'timeCapsule' | 'achievements';

export interface MemoryCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
  isLiked: boolean;
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'text' | 'photo';
}

export interface QuizStage {
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  image?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: string;
  icon: 'Trophy' | 'Crown' | 'Heart' | 'Clock';
}

// Constants
export const quizStages: QuizStage[] = [
  {
    title: "Kenangan Pertama",
    question: "Kapan pertama kali kita bertemu?",
    options: [
      "Di kampus",
      "Di cafe",
      "Di taman kota",
      "Di perpustakaan"
    ],
    correctAnswer: 0,
    hint: "Tempat dimana kita menuntut ilmu"
  }
  // Add more quiz stages as needed
];

export const memoryCardSets = {
  emotions: [
    { content: "❤️" },
    { content: "😊" },
    { content: "🥰" },
    { content: "😍" },
    { content: "💖" },
    { content: "💝" }
  ],
  places: [
    { content: "🏫" },
    { content: "🏖️" },
    { content: "🌳" },
    { content: "🎡" },
    { content: "🏰" },
    { content: "⛪" }
  ],
  activities: [
    { content: "🎮" },
    { content: "🎬" },
    { content: "🍽️" },
    { content: "🎨" },
    { content: "🎵" },
    { content: "📚" }
  ]
};

export const achievements: Achievement[] = [
  {
    id: "memory-king",
    title: "Memory King",
    description: "Menyelesaikan memory game dengan waktu tersisa",
    requirement: "Selesaikan memory game sebelum waktu habis",
    icon: "Crown"
  },
  {
    id: "love-writer",
    title: "Love Writer",
    description: "Menulis 50 pesan cinta",
    requirement: "Kirim 50 pesan di Love Messages",
    icon: "Heart"
  },
  {
    id: "time-keeper",
    title: "Time Keeper",
    description: "Menyimpan 10 kenangan indah",
    requirement: "Tambahkan 10 kenangan di Time Capsule",
    icon: "Clock"
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Menyelesaikan semua quiz cinta",
    requirement: "Jawab semua pertanyaan quiz dengan benar",
    icon: "Trophy"
  }
];