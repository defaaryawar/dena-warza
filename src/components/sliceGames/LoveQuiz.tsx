import React, { useState } from 'react';
import { Heart, } from 'lucide-react';

interface LoveQuizProps {
    onExperienceGain: (amount: number) => void;
    onAddAlert: (
        type: "error" | "success" | "info" | "warning" | "achievement" | "reward" | "love" | "milestone",
        title: string,
        message: string,
        duration?: number
    ) => void;
}

const LoveQuiz: React.FC<LoveQuizProps> = ({ onExperienceGain, onAddAlert }) => {
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [score, setScore] = useState({ player1: 0, player2: 0 });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [playerAnswers, setPlayerAnswers] = useState<string[]>([]);
    const [gamePhase, setGamePhase] = useState<'answering' | 'guessing' | 'results'>('answering');

    const questions = [
        "Apa makanan favorit pasanganmu?",
        "Dimana tempat kencan pertama kalian?",
        "Apa mimpi terbesar pasanganmu?",
        "Apa yang membuat pasanganmu tertawa paling keras?",
        "Apa kebiasaan unik pasanganmu?",
    ];

    const handleAnswerSubmit = (answer: string) => {
        if (answer.trim() === "") {
            onAddAlert('error', 'Error', 'Jawaban tidak boleh kosong!');
            return;
        }

        if (gamePhase === 'answering') {
            setPlayerAnswers([...playerAnswers, answer]);
            if (playerAnswers.length < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setGamePhase('guessing');
                setCurrentQuestionIndex(0);
            }
        } else if (gamePhase === 'guessing') {
            const isCorrect = answer.toLowerCase() === playerAnswers[currentQuestionIndex].toLowerCase();
            if (isCorrect) {
                if (currentPlayer === 1) {
                    setScore({ ...score, player1: score.player1 + 1 });
                } else {
                    setScore({ ...score, player2: score.player2 + 1 });
                }
                onAddAlert('success', 'Benar!', '+1 poin untuk jawaban yang tepat!');
            } else {
                onAddAlert('error', 'Salah!', 'Jawaban tidak tepat!');
            }

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
            } else {
                setGamePhase('results');
                const totalScore = score.player1 + score.player2;
                onExperienceGain(totalScore * 10);
                onAddAlert('achievement', 'Quiz Selesai!', `Total skor: ${totalScore * 10} XP`);
            }
        }
    };

    const resetGame = () => {
        setCurrentPlayer(1);
        setScore({ player1: 0, player2: 0 });
        setCurrentQuestionIndex(0);
        setPlayerAnswers([]);
        setGamePhase('answering');
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-pink-600 mb-2">Love Quiz</h2>
                <div className="flex justify-center items-center space-x-2">
                    <Heart className="text-pink-500" size={24} />
                    <span className="text-gray-600">Uji Seberapa Dekat Kalian</span>
                </div>
            </div>

            {gamePhase === 'results' ? (
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Hasil Akhir</h3>
                    <div className="space-y-2">
                        <p>Player 1: {score.player1} poin</p>
                        <p>Player 2: {score.player2} poin</p>
                        <p className="text-lg font-medium mt-4">
                            Total Skor: {(score.player1 + score.player2) * 10} XP
                        </p>
                    </div>
                    <button
                        onClick={resetGame}
                        className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    >
                        Main Lagi
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">
                            {gamePhase === 'answering' ? 'Jawab Pertanyaan' : 'Tebak Jawaban Pasangan'}
                        </p>
                        <p className="text-lg font-medium">
                            Player {currentPlayer}
                        </p>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-lg">
                        <p className="text-center text-lg">
                            {questions[currentQuestionIndex]}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Ketik jawabanmu..."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAnswerSubmit(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                        <p className="text-sm text-gray-500 text-center">
                            Tekan Enter untuk menjawab
                        </p>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Pertanyaan: {currentQuestionIndex + 1}/{questions.length}</span>
                        <span>Skor: P1: {score.player1} | P2: {score.player2}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoveQuiz;