import React from 'react';
import { Heart, Brush, Music, Smile, MessageCircle, Camera, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { GameMode, AlertType } from '../../types/types';

interface MenuCardProps {
    onGameModeChange: (mode: GameMode) => void;
    onAddAlert: (type: AlertType, title: string, message: string) => void;
    relationshipLevel: number;
    nextLevelExperience: number;
    currentExperience: number;
}

const MenuCard: React.FC<MenuCardProps> = ({
    onGameModeChange,
    onAddAlert,
    relationshipLevel,
    nextLevelExperience,
    currentExperience
}) => {
    const gameOptions = [
        {
            mode: 'truthOrDare' as GameMode,
            icon: Heart,
            title: 'Truth or Dare',
            desc: 'Get to know each other better',
            color: 'from-pink-500 to-pink-600',
            xp: 10
        },
        {
            mode: 'drawTogether' as GameMode,
            icon: Brush,
            title: 'Draw Together',
            desc: 'Create art together',
            color: 'from-purple-500 to-purple-600',
            xp: 15
        },
        {
            mode: 'musicGuess' as GameMode,
            icon: Music,
            title: 'Music Quiz',
            desc: 'Guess your favorite songs',
            color: 'from-blue-500 to-blue-600',
            xp: 20
        },
        {
            mode: 'memeGenerator' as GameMode,
            icon: Smile,
            title: 'Couple Memes',
            desc: 'Create funny memories',
            color: 'from-green-500 to-green-600',
            xp: 15
        },
        {
            mode: 'coupleQuiz' as GameMode,
            icon: MessageCircle,
            title: 'Couple Quiz',
            desc: 'Test your knowledge',
            color: 'from-yellow-500 to-yellow-600',
            xp: 25
        },
        {
            mode: 'memories' as GameMode,
            icon: Camera,
            title: 'Memories',
            desc: 'Capture special moments',
            color: 'from-red-500 to-red-600',
            locked: relationshipLevel < 2,
            xp: 30
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gameOptions.map(({ mode, icon: Icon, title, desc, color, locked, xp }) => (
                <Button
                    key={mode}
                    onClick={() => {
                        if (!locked) {
                            onGameModeChange(mode);
                            onAddAlert('info', `Starting ${title}`, `Earn up to ${xp} XP per round!`);
                        }
                    }}
                    disabled={locked}
                    className={`
                        h-48 bg-gradient-to-r ${color} 
                        hover:opacity-90 transform hover:scale-105 
                        transition-all duration-500 relative 
                        ${locked ? 'opacity-50' : ''}
                    `}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <Icon className="text-white" size={32} />
                        <span className="font-bold text-lg text-white">{title}</span>
                        <p className="text-sm text-white opacity-90">{desc}</p>
                        <div className="text-xs text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">
                            +{xp} XP per round
                        </div>
                        {locked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded backdrop-blur-sm">
                                <div className="text-center p-4">
                                    <Lock className="mx-auto mb-2 text-white" size={24} />
                                    <p className="text-white text-sm font-medium">Unlock at Level 2</p>
                                    <p className="text-white text-xs opacity-75 mt-1">
                                        {relationshipLevel === 1
                                            ? `Need ${nextLevelExperience - currentExperience} more XP`
                                            : 'Coming soon!'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Button>
            ))}
        </div>
    );
};

export default MenuCard;