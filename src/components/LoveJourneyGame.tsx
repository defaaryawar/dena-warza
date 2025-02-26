import { useState, useEffect } from 'react';
import { Heart, Sparkles, Trophy, User } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';
import { Button } from './ui/Button';
import { GameMode } from '../types/types';
import { GameHistoryDetails } from '../types/types';

// Import Game Components
import TruthOrDare from './sliceGames/TruthOrDare';
import DrawTogether from './sliceGames/DrawTogether';
import MusicQuiz from './sliceGames/MusicQuiz';
import LoveQuiz from './sliceGames/LoveQuiz';
import CoupleQuiz from './sliceGames/CoupleQuiz';
import Memories from './sliceGames/Memories';
import MenuCard from './sliceGames/MenuCard';

// Import Custom Alert Components
import CustomAlert, { AchievementAlert, RewardAlert, LoveAlert } from './ui/CustomAlert';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Types
interface Alert {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'achievement' | 'reward' | 'love' | 'milestone';
    title: string;
    message: string;
}

interface DailyChallenge {
    challenge: string;
    completed: boolean;
    reward: number;
}

interface UserData {
    id: string; // Tambahkan ID untuk update
    name: string;
    level: number;
    experience: number;
    nextLevel: number;
    totalScore: number;
    streakCount: number;
    achievements: Set<string>;
}

const DAILY_CHALLENGES = [
    "Share 3 things you love about each other",
    "Plan a surprise date",
    "Write a love note to each other",
    "Take a couple selfie",
    "Cook a meal together",
    "Create a playlist together",
    "Share your favorite memory",
    "Plan your next adventure",
    "Exchange compliments",
    "Do something thoughtful for each other"
];

const LoveJourneyGame = () => {
    const [gameMode, setGameMode] = useState<GameMode>('menu');
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [selectedUser, setSelectedUser] = useState<'defano' | 'najmita' | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    // Relationship & Challenge State
    const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>({
        challenge: '',
        completed: false,
        reward: 50
    });

    // Initialize daily challenge
    useEffect(() => {
        const initializeChallenge = () => {
            const lastChallenge = localStorage.getItem('lastChallenge');
            const lastChallengeDate = localStorage.getItem('lastChallengeDate');
            const today = new Date().toDateString();

            // Reset challenge if it's a new day
            if (lastChallengeDate !== today) {
                let newChallenge;
                do {
                    newChallenge = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
                } while (newChallenge === lastChallenge && DAILY_CHALLENGES.length > 1);

                localStorage.setItem('lastChallenge', newChallenge);
                localStorage.setItem('lastChallengeDate', today);

                setDailyChallenge({
                    challenge: newChallenge,
                    completed: false,
                    reward: 50
                });
            }
        };

        initializeChallenge();
    }, []);

    // Fetch user data from the backend
    const fetchUserData = async (user: 'defano' | 'najmita') => {
        try {
            const response = await fetch(`${API_URL}/api/user-data?user=${user}`);
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            addAlert('error', 'Error', 'Failed to fetch user data. Please try again later.');
        }
    };

    // Handle user selection
    const handleUserSelection = (user: 'defano' | 'najmita') => {
        setSelectedUser(user);
        fetchUserData(user);
    };

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

    const updateUserData = async (updatedData: UserData) => {
        try {
            const response = await fetch(`${API_URL}/api/user-data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: updatedData.id,
                    name: updatedData.name,
                    level: updatedData.level,
                    experience: updatedData.experience,
                    nextLevel: updatedData.nextLevel,
                    totalScore: updatedData.totalScore,
                    streakCount: updatedData.streakCount,
                    achievements: Array.from(updatedData.achievements), // Konversi Set ke Array
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating user data:', error);
            addAlert('error', 'Error', 'Failed to update user data. Please try again later.');
        }
    };

    const addExperience = async (amount: number) => {
        if (!userData) return;

        const newExperience = userData.experience + amount;
        const newTotalScore = userData.totalScore + amount;
        const newStreakCount = userData.streakCount + 1;

        let updatedUserData: UserData;

        if (newExperience >= userData.nextLevel) {
            const newLevel = userData.level + 1;
            updatedUserData = {
                ...userData,
                level: newLevel,
                experience: newExperience - userData.nextLevel,
                nextLevel: Math.floor(userData.nextLevel * 1.5),
                totalScore: newTotalScore,
                streakCount: newStreakCount,
            };
            setShowConfetti(true);
            addAlert('milestone', 'Level Up!', `Relationship level ${newLevel} achieved!`);
            setTimeout(() => setShowConfetti(false), 3000);
        } else {
            updatedUserData = {
                ...userData,
                experience: newExperience,
                totalScore: newTotalScore,
                streakCount: newStreakCount,
            };
        }

        // Update user data in the backend
        await updateUserData(updatedUserData);

        // Update local state
        setUserData(updatedUserData);

        // Check for new achievements
        checkAndAwardAchievements();
    };

    // Check and award achievements
    const checkAndAwardAchievements = () => {
        if (!userData) return;

        const newAchievements = new Set(userData.achievements);

        const achievementConditions = [
            {
                condition: userData.totalScore >= 100,
                id: 'scoremaster',
                title: 'Score Master',
                message: 'Reached 100 total points!'
            },
            {
                condition: userData.streakCount >= 5,
                id: 'streakmaster',
                title: 'Streak Master',
                message: 'Maintained a 5+ answer streak!'
            },
            {
                condition: userData.level >= 5,
                id: 'soulmate',
                title: 'Soulmate Status',
                message: 'Reached relationship level 5!'
            }
        ];

        achievementConditions.forEach(({ condition, id, title, message }) => {
            if (condition && !userData.achievements.has(id)) {
                newAchievements.add(id);
                setShowConfetti(true);
                addAlert('achievement', title, message);
                setTimeout(() => setShowConfetti(false), 3000);

                // Send game history to the database
                sendGameHistory({
                    userId: selectedUser,
                    activity: 'achievement',
                    details: {
                        achievementId: id,
                        title: title,
                        message: message,
                    },
                    timestamp: new Date().toISOString(),
                });
            }
        });

        setUserData({
            ...userData,
            achievements: newAchievements,
        });
    };

    // Send game history to the backend
    const sendGameHistory = async (historyData: {
        userId: "defano" | "najmita" | null;
        activity: string;
        details: GameHistoryDetails;
        timestamp: string;
    }) => {
        try {
            const response = await fetch(`${API_URL}/api/game-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(historyData),
            });

            if (!response.ok) {
                throw new Error('Failed to send game history');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error sending game history:', error);
            addAlert('error', 'Error', 'Failed to send game history. Please try again later.');
        }
    };

    // UI Components
    const renderAlerts = () => (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-xs sm:max-w-md">
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
        <Alert className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-sm">
            <AlertDescription>
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div>
                        <p className="font-medium text-lg">Daily Challenge:</p>
                        <p className="text-gray-700">{dailyChallenge.challenge}</p>
                    </div>
                    <Button
                        onClick={() => {
                            if (!dailyChallenge.completed) {
                                setDailyChallenge({ ...dailyChallenge, completed: true });
                                addExperience(dailyChallenge.reward);
                                addAlert('reward', 'Challenge Completed!', `Earned ${dailyChallenge.reward} XP!`);

                                // Send game history to the database
                                sendGameHistory({
                                    userId: selectedUser,
                                    activity: 'dailyChallenge',
                                    details: {
                                        challenge: dailyChallenge.challenge,
                                        reward: dailyChallenge.reward,
                                    },
                                    timestamp: new Date().toISOString(),
                                });
                            }
                        }}
                        disabled={dailyChallenge.completed}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                    >
                        {dailyChallenge.completed ? 'Completed!' : 'Complete Challenge'}
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );

    const renderRelationshipLevel = () => {
        if (!userData) return null;

        return (
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                        <Heart className="text-pink-500" size={24} />
                        <span className="font-medium text-lg">Relationship Level {userData.level}</span>
                    </div>
                    <span className="text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                        {userData.experience}/{userData.nextLevel} XP
                    </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(userData.experience / userData.nextLevel) * 100}%` }}
                    />
                </div>
            </div>
        );
    };

    // Render Game Content
    const renderGameContent = () => {
        if (!selectedUser || !userData) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4 p-6">
                    <h2 className="text-2xl font-bold text-gray-800">Pilih Siapa Anda</h2>
                    <div className="flex space-x-4">
                        <Button
                            onClick={() => handleUserSelection('defano')}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                        >
                            <User className="mr-2" size={16} />
                            Defano
                        </Button>
                        <Button
                            onClick={() => handleUserSelection('najmita')}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                        >
                            <User className="mr-2" size={16} />
                            Najmita
                        </Button>
                    </div>
                </div>
            );
        }

        switch (gameMode) {
            case 'truthOrDare':
                return (
                    <TruthOrDare
                        onExperienceGain={addExperience}
                        onAddAlert={addAlert}
                        onGameModeChange={setGameMode}
                        onGameComplete={(activity, details) => {
                            sendGameHistory({
                                userId: selectedUser,
                                activity: activity,
                                details: details,
                                timestamp: new Date().toISOString(),
                            });
                        }}
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
            case 'loveQuiz':
                return (
                    <LoveQuiz
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
                        onScoreUpdate={(score) => setUserData({ ...userData, totalScore: score })}
                        onStreakUpdate={(increment) => setUserData({ ...userData, streakCount: increment ? userData.streakCount + 1 : 0 })}
                        onQuizComplete={(score) => {
                            // Send game history to the database
                            sendGameHistory({
                                userId: selectedUser,
                                activity: 'quizComplete',
                                details: {
                                    gameMode: 'coupleQuiz',
                                    score: score,
                                },
                                timestamp: new Date().toISOString(),
                            });
                        }}
                    />
                );
            case 'memories':
                return <Memories />;
            default:
                return (
                    <MenuCard
                        onGameModeChange={setGameMode}
                        onAddAlert={addAlert}
                        relationshipLevel={userData.level}
                        nextLevelExperience={userData.nextLevel}
                        currentExperience={userData.experience}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white rounded-3xl">
            {renderAlerts()}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div className="absolute inset-0 flex items-center justify-center">
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

            <div className="relative top-0 left-0 right-0 bg-pink-200 bg-opacity-90 backdrop-blur-sm z-40 border-b border-gray-100 mt-6 md:mt-4 p-2 rounded-3xl">
                <div className="max-w-4xl mx-auto px-4 py-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
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
                                    className="bg-white hover:bg-pink-50 transition-all duration-300"
                                >
                                    Back to Menu
                                </Button>
                            )}
                            {userData && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Trophy className="text-yellow-500" size={16} />
                                    <span>{userData.totalScore} Points</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:pt-16 pt-6 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-4 sm:p-6">
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