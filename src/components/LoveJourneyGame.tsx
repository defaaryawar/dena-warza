import { useState, useEffect } from 'react';
import { Heart, Trophy, Star, Camera, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';
import { Button } from './ui/Button';
import { GameMode } from '../types/types';

// Import Game Components
import TruthOrDare from './sliceGames/TruthOrDare';
import DrawTogether from './sliceGames/DrawTogether';
import MusicQuiz from './sliceGames/MusicQuiz';
import MemeGenerator from './sliceGames/MemeGenerator';
import CoupleQuiz from './sliceGames/CoupleQuiz';
import Memories from './sliceGames/Memories';
import MenuCard from './sliceGames/MenuCard';

// Import Custom Alert Components
import CustomAlert, { AchievementAlert, RewardAlert, LoveAlert } from './ui/CustomAlert';

// Types
interface Alert {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'achievement' | 'reward' | 'love' | 'milestone';
    title: string;
    message: string;
}

interface RelationshipState {
    level: number;
    experience: number;
    nextLevel: number;
}

interface DailyChallenge {
    challenge: string;
    completed: boolean;
    reward: number;
}

const LoveJourneyGame = () => {
    // Game State
    const [gameMode, setGameMode] = useState<GameMode>('menu');
    const [totalScore, setTotalScore] = useState(0);
    const [streakCount, setStreakCount] = useState(0);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [gameHistory, setGameHistory] = useState<string[]>([]);
    const [achievements, setAchievements] = useState<Set<string>>(new Set());
    const [showConfetti, setShowConfetti] = useState(false);

    // Relationship & Challenge State
    const [relationship, setRelationship] = useState<RelationshipState>({
        level: 1,
        experience: 0,
        nextLevel: 100
    });

    const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>({
        challenge: '',
        completed: false,
        reward: 50
    });

    // Initialize daily challenge
    useEffect(() => {
        const challenges = [
            "Share 3 things you love about each other",
            "Plan a surprise date",
            "Write a love note to each other",
            "Take a couple selfie",
            "Cook a meal together",
            "Create a playlist together",
            "Share your favorite memory",
            "Plan your next adventure",
            "Exchange compliments",
            "Do something thoughtful"
        ];

        const lastChallenge = localStorage.getItem('lastChallenge');
        let newChallenge;
        do {
            newChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        } while (newChallenge === lastChallenge && challenges.length > 1);

        localStorage.setItem('lastChallenge', newChallenge);

        setDailyChallenge({
            challenge: newChallenge,
            completed: false,
            reward: 50
        });
    }, []);

    // Alert System
    const addAlert = (
        type: Alert['type'],
        title: string,
        message: string,
        duration = 5000
    ) => {
        const id = Math.random().toString(36).substr(2, 9);
        setAlerts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, duration);
    };

    // Achievement System
    const checkAndAwardAchievements = () => {
        const newAchievements = new Set(achievements);

        const achievementConditions = [
            {
                condition: totalScore >= 100,
                id: 'scoremaster',
                title: 'Score Master',
                message: 'Reached 100 total points!'
            },
            {
                condition: streakCount >= 5,
                id: 'streakmaster',
                title: 'Streak Master',
                message: 'Maintained a 5+ answer streak!'
            },
            {
                condition: gameHistory.length >= 10,
                id: 'adventurer',
                title: 'Adventurer',
                message: 'Played 10+ games!'
            },
            {
                condition: relationship.level >= 5,
                id: 'soulmate',
                title: 'Soulmate',
                message: 'Reached relationship level 5!'
            }
        ];

        achievementConditions.forEach(({ condition, id, title, message }) => {
            if (condition && !achievements.has(id)) {
                newAchievements.add(id);
                setShowConfetti(true);
                addAlert('achievement', title, message);
                setTimeout(() => setShowConfetti(false), 3000);
            }
        });

        setAchievements(newAchievements);
    };

    // Relationship System
    const addExperience = (amount: number) => {
        const newExperience = relationship.experience + amount;
        if (newExperience >= relationship.nextLevel) {
            const newLevel = relationship.level + 1;
            setRelationship({
                level: newLevel,
                experience: newExperience - relationship.nextLevel,
                nextLevel: Math.floor(relationship.nextLevel * 1.5)
            });
            setShowConfetti(true);
            addAlert('milestone', 'Level Up!', `Reached relationship level ${newLevel}!`);
            setTimeout(() => setShowConfetti(false), 3000);
        } else {
            setRelationship({
                ...relationship,
                experience: newExperience
            });
        }
        checkAndAwardAchievements();
    };

    // UI Components
    const renderAlerts = () => (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {alerts.map(alert => {
                switch (alert.type) {
                    case 'achievement':
                        return (
                            <AchievementAlert
                                key={alert.id}
                                title={alert.title}
                                message={alert.message}
                                onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                            />
                        );
                    case 'reward':
                        return (
                            <RewardAlert
                                key={alert.id}
                                title={alert.title}
                                message={alert.message}
                                onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                            />
                        );
                    case 'love':
                        return (
                            <LoveAlert
                                key={alert.id}
                                title={alert.title}
                                message={alert.message}
                                onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                            />
                        );
                    default:
                        return (
                            <CustomAlert
                                key={alert.id}
                                type={alert.type}
                                title={alert.title}
                                message={alert.message}
                                onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                            />
                        );
                }
            })}
        </div>
    );

    const renderDailyChallenge = () => (
        <Alert className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50">
            <AlertDescription>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Daily Challenge:</p>
                        <p>{dailyChallenge.challenge}</p>
                    </div>
                    <Button
                        onClick={() => {
                            if (!dailyChallenge.completed) {
                                setDailyChallenge({ ...dailyChallenge, completed: true });
                                addExperience(dailyChallenge.reward);
                                addAlert('reward', 'Challenge Completed!', `Earned ${dailyChallenge.reward} XP!`);
                            }
                        }}
                        disabled={dailyChallenge.completed}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                    >
                        Complete Challenge
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );

    const renderRelationshipLevel = () => (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                    <Heart className="text-pink-500" size={24} />
                    <span className="font-medium">Relationship Level {relationship.level}</span>
                </div>
                <span className="text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                    {relationship.experience}/{relationship.nextLevel} XP
                </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(relationship.experience / relationship.nextLevel) * 100}%` }}
                />
            </div>
        </div>
    );

    // Render Game Content
    const renderGameContent = () => {
        switch (gameMode) {
            case 'truthOrDare':
                return (
                    <TruthOrDare
                        onExperienceGain={addExperience}
                        onAddAlert={addAlert}
                        onGameModeChange={setGameMode}
                        gameHistory={gameHistory}
                    />
                );
            case 'drawTogether':
                return (
                    <DrawTogether
                        onExperienceGain={addExperience}
                        onAddAlert={addAlert}
                    />
                );
            case 'musicGuess':
                return (
                    <MusicQuiz
                        onExperienceGain={addExperience}
                        onAddAlert={addAlert}
                    />
                );
            case 'memeGenerator':
                return (
                    <MemeGenerator
                        onExperienceGain={addExperience}
                        onAddAlert={addAlert}
                    />
                );
            case 'coupleQuiz':
                return (
                    <CoupleQuiz
                        onExperienceGain={addExperience}
                        onAddAlert={addAlert}
                        onGameModeChange={setGameMode}
                        onScoreUpdate={setTotalScore}
                        onStreakUpdate={(increment) => setStreakCount(increment ? streakCount + 1 : 0)}
                    />
                );
            case 'memories':
                return <Memories />;
            default:
                return (
                    <MenuCard
                        onGameModeChange={setGameMode}
                        onAddAlert={addAlert}
                        relationshipLevel={relationship.level}
                        nextLevelExperience={relationship.nextLevel}
                        currentExperience={relationship.experience}
                    />
                );
        }
    };

    // Main Render
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
            {renderAlerts()}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div className="absolute inset-0 flex items-center justify-center animate-bounce">
                        <div className="grid grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <Sparkles
                                    key={i}
                                    className={`
                                        text-yellow-500 animate-spin
                                        ${i % 2 === 0 ? 'text-pink-500' : 'text-purple-500'}
                                    `}
                                    size={24}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm z-40 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Heart className="text-pink-500" size={24} />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                                Love Journey
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {gameMode !== 'menu' && (
                                <Button
                                    variant="outline"
                                    onClick={() => setGameMode('menu')}
                                    className="hover:bg-pink-50 transition-all duration-300"
                                >
                                    Back to Menu
                                </Button>
                            )}
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Trophy className="text-yellow-500" size={16} />
                                <span>{totalScore} Points</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16 p-6">
                <div className="max-w-4xl mx-auto">
                    <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                            {gameMode === 'menu' && (
                                <>
                                    {renderRelationshipLevel()}
                                    {renderDailyChallenge()}
                                </>
                            )}
                            {renderGameContent()}
                        </CardContent>
                    </Card>

                    <div className="text-center text-gray-500 text-sm pb-8">
                        <p>Made with 💖 for couples</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoveJourneyGame;