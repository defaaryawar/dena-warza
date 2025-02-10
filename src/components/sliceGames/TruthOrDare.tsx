import React from 'react';
import { Heart, Dice1 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BaseGameProps, Question } from '../../types/types';
import { truthQuestions, dareQuestions } from '../learning/gameQuestion';

interface TruthOrDareProps extends BaseGameProps {
    gameHistory: string[];
}

const TruthOrDare: React.FC<TruthOrDareProps> = ({
    onExperienceGain,
    onAddAlert,
    onGameModeChange,
    gameHistory
}) => {
    const [currentQuestionType, setCurrentQuestionType] = React.useState<'truth' | 'dare' | null>(null);
    const [currentTruthDare, setCurrentTruthDare] = React.useState<Question | null>(null);

    const getRandomQuestion = (type: 'truth' | 'dare') => {
        const questions = type === 'truth' ? truthQuestions : dareQuestions;
        const recentQuestions = JSON.parse(localStorage.getItem('recentQuestions') || '[]');

        let availableQuestions = questions.filter(q => !recentQuestions.includes(q.id));
        if (availableQuestions.length === 0) {
            availableQuestions = questions;
            localStorage.setItem('recentQuestions', '[]');
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];

        const updatedRecent = [...recentQuestions, selectedQuestion.id].slice(-5);
        localStorage.setItem('recentQuestions', JSON.stringify(updatedRecent));

        return selectedQuestion;
    };

    const handleTruthDareSelect = (type: 'truth' | 'dare') => {
        setCurrentQuestionType(type);
        const question = getRandomQuestion(type);
        setCurrentTruthDare(question);
        onExperienceGain(10);
        onAddAlert('love', `New ${type} Question`, 'Time to get closer!');
    };

    const resetGame = () => {
        setCurrentQuestionType(null);
        setCurrentTruthDare(null);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Truth or Dare</CardTitle>
                <p className="text-center text-gray-600">Choose wisely! 💕</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {!currentQuestionType ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={() => handleTruthDareSelect('truth')}
                            className="h-32 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-500"
                        >
                            <div className="text-center">
                                <Heart size={32} className="mx-auto mb-2" />
                                <span className="text-lg font-bold">Truth</span>
                            </div>
                        </Button>
                        <Button
                            onClick={() => handleTruthDareSelect('dare')}
                            className="h-32 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-500"
                        >
                            <div className="text-center">
                                <Dice1 size={32} className="mx-auto mb-2" />
                                <span className="text-lg font-bold">Dare</span>
                            </div>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-8 bg-white rounded-lg shadow-lg text-center border-2 border-pink-100">
                            <h3 className="text-2xl mb-6 font-medium text-gray-800">
                                {currentTruthDare?.question}
                            </h3>
                            <div className="space-x-4">
                                <Button
                                    onClick={() => {
                                        setCurrentQuestionType(null);
                                        setCurrentTruthDare(null);
                                        onExperienceGain(10);
                                        onAddAlert('love', 'Question Completed!', '+10 XP earned');
                                    }}
                                    className="bg-pink-500 hover:bg-pink-600 transition-all duration-500"
                                >
                                    Complete & Next
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        onGameModeChange('menu');
                                        resetGame();
                                    }}
                                >
                                    Finish Game
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-lg font-medium mb-2">Game History:</h4>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {gameHistory.map((history, index) => (
                                    <div
                                        key={index}
                                        className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        {history}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TruthOrDare;