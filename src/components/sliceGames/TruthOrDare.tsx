import React from 'react';
import { Heart, Dice1, PartyPopper, ArrowRight, AlertTriangle, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BaseGameProps, Question } from '../../types/types';
import { truthQuestions, dareQuestions } from '../learning/gameQuestion';

interface TruthOrDareProps extends BaseGameProps {
    onGameComplete: (activity: string, details: { question: string, type: 'truth' | 'dare' }) => void;
}

const TruthOrDare: React.FC<TruthOrDareProps> = ({
    onExperienceGain,
    onAddAlert,
    onGameModeChange,
    onGameComplete,
}) => {
    const [currentQuestionType, setCurrentQuestionType] = React.useState<'truth' | 'dare' | null>(null);
    const [currentTruthDare, setCurrentTruthDare] = React.useState<Question | null>(null);
    const [completedQuestions, setCompletedQuestions] = React.useState<number>(0);
    const [usedQuestionIds, setUsedQuestionIds] = React.useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showExitConfirm, setShowExitConfirm] = React.useState<boolean>(false);
    const [showGameCompleteMessage, setShowGameCompleteMessage] = React.useState<boolean>(false);

    // Animasi variasi untuk kartu
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Animasi variasi untuk tombol
    const buttonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
        tap: { scale: 0.95 },
    };

    // Animasi untuk progress bar
    const progressVariants = {
        initial: { width: 0 },
        animate: (i: number) => ({
            width: `${(i / 10) * 100}%`,
            transition: { duration: 0.5, ease: "easeInOut" }
        })
    };

    // Animasi untuk overlay dialog
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
    };

    // Animasi untuk dialog
    const dialogVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    // Fungsi untuk mendapatkan pertanyaan acak yang belum digunakan
    const getRandomQuestion = (type: 'truth' | 'dare') => {
        const questions = type === 'truth' ? truthQuestions : dareQuestions;
        const availableQuestions = questions.filter(q => !usedQuestionIds.has(q.id));

        if (availableQuestions.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];

        setUsedQuestionIds(prev => new Set([...prev, selectedQuestion.id]));
        return selectedQuestion;
    };

    // Fungsi untuk memilih pertanyaan Truth atau Dare dengan animasi loading
    const handleTruthDareSelect = async (type: 'truth' | 'dare') => {
        setIsLoading(true);
        
        // Tambahkan delay singkat untuk efek dramatis
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const question = getRandomQuestion(type);
        if (!question) {
            onAddAlert('warning', 'Pertanyaan Habis', 'Semua pertanyaan sudah digunakan. Reset dulu ya...');
            setUsedQuestionIds(new Set());
            setIsLoading(false);
            return;
        }

        setCurrentQuestionType(type);
        setCurrentTruthDare(question);
        
        // Cek apakah ini adalah pertanyaan ke-10
        if (completedQuestions === 9) {
            setShowGameCompleteMessage(true);
        }
        
        onAddAlert('love', `Pertanyaan ${type === 'truth' ? 'Jujur' : 'Tantangan'} Baru`, 'Waktunya lebih dekat!');

        onGameComplete('truthOrDare', {
            question: question.question,
            type: type,
        });
        
        setIsLoading(false);
    };

    // Fungsi untuk menyelesaikan pertanyaan dengan efek konfeti
    const handleCompleteQuestion = () => {
        setCurrentQuestionType(null);
        setCurrentTruthDare(null);
        setCompletedQuestions(prev => prev + 1);
        onAddAlert('love', 'Pertanyaan Selesai!', 'Yuk lanjut ke pertanyaan berikutnya!');
    };

    const handleShowExitConfirm = () => {
        setShowExitConfirm(true);
    };

    const handleCancelExit = () => {
        setShowExitConfirm(false);
    };

    const handleConfirmExit = () => {
        setShowExitConfirm(false);
        onAddAlert('warning', 'Sayang Banget!', 'Gak dapet apa-apa nih. Yuk lanjut lagi kapan-kapan!');
        onGameModeChange('menu');
    };

    const handleFinishGame = () => {
        if (completedQuestions >= 10) {
            const totalXP = completedQuestions * 10;
            onExperienceGain(totalXP);
            onAddAlert('success', 'Game Selesai!', `Kamu mendapatkan ${totalXP} XP!`);
        }
        onGameModeChange('menu');
    };

    const handleContinueFromComplete = () => {
        setShowGameCompleteMessage(false);
    };

    // Fungsi untuk mendapatkan tema warna berdasarkan tipe pertanyaan
    const getThemeColor = (type: 'truth' | 'dare' | null) => {
        if (type === 'truth') return { bg: 'from-pink-400 to-rose-600', text: 'text-rose-600' };
        if (type === 'dare') return { bg: 'from-purple-400 to-indigo-600', text: 'text-indigo-600' };
        return { bg: 'from-pink-400 to-indigo-600', text: 'text-gray-700' };
    };

    const theme = getThemeColor(currentQuestionType);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="w-full max-w-xl mx-auto relative"
        >
            <Card className="w-full overflow-hidden border-0 shadow-xl">
                <div className={`bg-gradient-to-r ${theme.bg} p-6 text-white`}>
                    <CardHeader className="p-0">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <CardTitle className="text-3xl font-bold text-center">
                                {currentQuestionType 
                                    ? `${currentQuestionType === 'truth' ? 'Kejujuran' : 'Tantangan'}` 
                                    : "Truth or Dare"}
                            </CardTitle>
                            <p className="text-center text-white/80 mt-2">
                                {currentQuestionType 
                                    ? "Jawab jujur atau hadapi konsekuensinya!" 
                                    : "Pilih yang berani! 💕"}
                            </p>
                        </motion.div>
                    </CardHeader>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-gray-100">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-pink-400 to-indigo-600"
                        initial="initial"
                        animate="animate"
                        custom={completedQuestions}
                        variants={progressVariants}
                    />
                </div>

                <div className="px-4 py-2 bg-gray-50 text-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 font-medium"
                    >
                        <PartyPopper size={18} className="text-yellow-500" />
                        <span>Progress: <span className="text-indigo-600 font-bold">{completedQuestions}</span>/10 pertanyaan</span>
                    </motion.div>
                </div>

                <CardContent className="p-6 pb-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : !currentQuestionType ? (
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.button
                                    variants={buttonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => handleTruthDareSelect('truth')}
                                    className="w-full h-40 rounded-xl bg-gradient-to-r from-pink-400 to-rose-600 shadow-lg shadow-pink-200 text-white flex flex-col items-center justify-center"
                                >
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <Heart size={42} className="mb-3" />
                                    </motion.div>
                                    <span className="text-xl font-bold">Kejujuran</span>
                                    <span className="text-sm opacity-80 mt-1">Buka hatimu</span>
                                </motion.button>
                            </motion.div>

                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.button
                                    variants={buttonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => handleTruthDareSelect('dare')}
                                    className="w-full h-40 rounded-xl bg-gradient-to-r from-purple-400 to-indigo-600 shadow-lg shadow-indigo-200 text-white flex flex-col items-center justify-center"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <Dice1 size={42} className="mb-3" />
                                    </motion.div>
                                    <span className="text-xl font-bold">Tantangan</span>
                                    <span className="text-sm opacity-80 mt-1">Buktikan keberanianmu!</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <motion.div 
                                className="p-8 rounded-2xl shadow-lg border-2 border-opacity-50"
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                style={{ 
                                    borderColor: currentQuestionType === 'truth' ? '#ec4899' : '#818cf8',
                                    background: 'white'
                                }}
                            >
                                <motion.h3 
                                    className={`text-2xl mb-6 font-bold ${currentQuestionType === 'truth' ? 'text-rose-600' : 'text-indigo-600'}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {currentTruthDare?.question}
                                </motion.h3>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <motion.div
                                        variants={buttonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Button
                                            onClick={handleCompleteQuestion}
                                            className={`w-full sm:w-auto bg-gradient-to-r ${currentQuestionType === 'truth' ? 'from-pink-500 to-rose-600' : 'from-purple-500 to-indigo-600'} hover:shadow-lg flex items-center gap-2 px-6`}
                                        >
                                            <span>Selesai & Lanjut</span>
                                            <ArrowRight size={16} />
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        variants={buttonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        {completedQuestions >= 9 ? (
                                            <Button
                                                variant="outline"
                                                onClick={handleFinishGame}
                                                className="w-full sm:w-auto border-2 flex items-center gap-2 px-6"
                                            >
                                                <PartyPopper size={16} />
                                                <span>Selesaikan Game</span>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={handleShowExitConfirm}
                                                className="w-full sm:w-auto border-2 flex items-center gap-2 px-6 text-gray-500"
                                            >
                                                <AlertTriangle size={16} />
                                                <span>Sudah Ah, Capek</span>
                                            </Button>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog konfirmasi keluar */}
            <AnimatePresence>
                {showExitConfirm && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            variants={dialogVariants}
                            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    Yakin Mau Keluar?
                                </h3>
                                <button 
                                    onClick={handleCancelExit}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-700 mb-4">
                                    Kalo kamu keluar sekarang, kamu <span className="font-bold text-rose-600">gak dapet apa-apa loh!</span> Gak dapet XP yang bisa buat kamu mendapatkan hadiah keren.
                                </p>
                                <p className="text-gray-700 mb-2">
                                    Masa nyerah gitu aja? Dikit lagi juga selesai, lho!
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleCancelExit}
                                    className="w-full sm:flex-1 bg-gradient-to-r from-pink-500 to-indigo-600 hover:shadow-lg"
                                >
                                    Lanjut Main Dong!
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleConfirmExit}
                                    className="w-full sm:flex-1 border-2 text-gray-500"
                                >
                                    Tetap Keluar
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialog pertanyaan ke-10 */}
            <AnimatePresence>
                {showGameCompleteMessage && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            variants={dialogVariants}
                            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
                                    <PartyPopper size={20} className="text-yellow-500" />
                                    Ini Pertanyaan Terakhir!
                                </h3>
                                <button 
                                    onClick={handleContinueFromComplete}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-700 mb-4">
                                    Selamat! Ini adalah pertanyaan ke-10 dari game Truth or Dare. 
                                </p>
                                <p className="text-gray-700 mb-4">
                                    Setelah menjawab pertanyaan ini, kamu akan dapat menyelesaikan game dan mendapatkan total <span className="font-bold text-indigo-600">100 XP</span>!
                                </p>
                                <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-3">
                                    <Award size={24} className="text-yellow-500" />
                                    <p className="text-indigo-700 font-medium">
                                        XP yang kamu kumpulkan bisa ditukar dengan hadiah menarik lho!
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleContinueFromComplete}
                                    className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:shadow-lg px-6"
                                >
                                    Lanjut Jawab!
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TruthOrDare;