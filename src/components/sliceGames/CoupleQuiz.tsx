import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BaseGameProps, GameMode } from '../../types/types';
import { coupleQuizQuestions } from '../learning/gameQuestion';

interface CoupleQuizProps extends Omit<BaseGameProps, 'onGameModeChange'> {
    onGameModeChange: (mode: GameMode) => void;
    onScoreUpdate: (score: number) => void;
    onStreakUpdate: (increment: boolean) => void;
}

const CoupleQuiz: React.FC<CoupleQuizProps> = ({
    onExperienceGain,
    onAddAlert,
    onGameModeChange,
    onScoreUpdate,
    onStreakUpdate
}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);

    const handleQuizAnswer = (selectedIndex: number) => {
        setSelectedAnswer(selectedIndex);
        setShowAnswer(true);

        if (selectedIndex === coupleQuizQuestions[currentQuestion].correctAnswer) {
            const newScore = score + 1;
            setScore(newScore);
            onScoreUpdate(newScore);
            onExperienceGain(20);
            onStreakUpdate(true);
            onAddAlert('success', 'Correct Answer!', '+20 XP earned!');
        } else {
            onStreakUpdate(false);
            onAddAlert('error', 'Incorrect Answer', 'Keep trying! You got this!');
        }
    };

    const handleNextOrFinish = () => {
        if (currentQuestion < coupleQuizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowAnswer(false);
        } else {
            onGameModeChange('menu');
            onAddAlert('achievement', 'Quiz Completed!', `Final Score: ${score}/${coupleQuizQuestions.length}`);
            resetGame();
        }
    };

    const resetGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowAnswer(false);
        setSelectedAnswer(null);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                    Couple Quiz
                </CardTitle>
                <div className="flex justify-center items-center space-x-4 mt-4">
                    <Trophy className="text-yellow-500" size={28} />
                    <span className="text-2xl font-semibold">
                        Score: {score}/{coupleQuizQuestions.length}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="text-center mb-6">
                    <div className="mb-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${((currentQuestion + 1) / coupleQuizQuestions.length) * 100}%` }}
                        />
                    </div>
                    <p className="text-2xl font-semibold mb-6">
                        {coupleQuizQuestions[currentQuestion].question}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {coupleQuizQuestions[currentQuestion].options.map((option, index) => (
                        <Button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            className={`
                                p-6 text-lg font-medium transition-all duration-300 
                                ${showAnswer
                                    ? index === coupleQuizQuestions[currentQuestion].correctAnswer
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : selectedAnswer === index
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    : ' hover:bg-gray-50 border-2 border-gray-300 text-gray-700 shadow-sm'
                                } 
                                transform hover:scale-105 active:scale-95
                            `}
                            disabled={showAnswer}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
                {showAnswer && (
                    <div className="text-center mt-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-xl font-medium mb-6">
                            {coupleQuizQuestions[currentQuestion].explanation}
                        </p>
                        <Button
                            onClick={handleNextOrFinish}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 font-semibold py-3 px-6 rounded-lg transition-all duration-500 transform hover:scale-105"
                        >
                            {currentQuestion < coupleQuizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CoupleQuiz;