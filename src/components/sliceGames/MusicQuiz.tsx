import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { BaseGameProps } from '../../types/types';

type MusicQuizProps = Omit<BaseGameProps, 'onGameModeChange'>;

const MusicQuiz: React.FC<MusicQuizProps> = ({ onExperienceGain, onAddAlert }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(0);
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const musicQuizData = [
        {
            songTitle: "Cars Outside",
            artist: "James Arthur",
            options: ["Someone You Loved", "Cars Outside", "Before You Go", "Train Wreck"],
            correctAnswer: 1,
            audioUrl: "/songs/cars-outside.mp3"
        },
        {
            songTitle: "Garam & Madu",
            artist: "Mahalini",
            options: ["Sisa Rasa", "Melawan Restu", "Garam & Madu", "Tak Lagi Cinta"],
            correctAnswer: 2,
            audioUrl: "/songs/garam-madu.mp3"
        },
        {
            songTitle: "All the Kids Are Depressed",
            artist: "Jeremy Zucker",
            options: ["Comethru", "All the Kids Are Depressed", "Talk Is Overrated", "You Were Good to Me"],
            correctAnswer: 1,
            audioUrl: "/songs/all-the-kids.mp3"
        },
        {
            songTitle: "Juicy Luicy",
            artist: "Juicy Luicy",
            options: ["Lantas", "Terlalu Tinggi", "Tanpa Tergesa", "Juicy Luicy"],
            correctAnswer: 3,
            audioUrl: "/songs/juicy-luicy.mp3"
        },
        {
            songTitle: "Lantas",
            artist: "Juicy Luicy",
            options: ["Terlalu Tinggi", "Lantas", "Tanpa Tergesa", "Tanpa Dirimu"],
            correctAnswer: 1,
            audioUrl: "/songs/lantas.mp3"
        },
        {
            songTitle: "Terlalu Tinggi",
            artist: "Juicy Luicy",
            options: ["Terlalu Tinggi", "Tanpa Tergesa", "Lantas", "Juicy Luicy"],
            correctAnswer: 0,
            audioUrl: "/songs/terlalu-tinggi.mp3"
        },
        {
            songTitle: "Tanpa Tergesa",
            artist: "Juicy Luicy",
            options: ["Lantas", "Juicy Luicy", "Tanpa Tergesa", "Terlalu Tinggi"],
            correctAnswer: 2,
            audioUrl: "/songs/tanpa-tergesa.mp3"
        },
        {
            songTitle: "Hati-hati di Jalan",
            artist: "Tulus",
            options: ["Monokrom", "Hati-hati di Jalan", "Sepatu", "Teman Hidup"],
            correctAnswer: 1,
            audioUrl: "/songs/hati-hati-di-jalan.mp3"
        },
        {
            songTitle: "Blue Jeans",
            artist: "Gangga",
            options: ["Forever", "Blue Jeans", "Waiting For You", "Journey On September"],
            correctAnswer: 1,
            audioUrl: "/songs/blue-jeans.mp3"
        },
        {
            songTitle: "C.H.R.I.S.Y.E",
            artist: "Diskoria, Laleilmanino, Eva Celia",
            options: ["C.H.R.I.S.Y.E", "Serenata Jiwa Lara", "Pelangi", "Dekat di Hati"],
            correctAnswer: 0,
            audioUrl: "/songs/chrisye.mp3"
        }
    ];
    

    useEffect(() => {
        // Initialize audio element
        audioRef.current = new Audio(musicQuizData[currentSong].audioUrl);
        audioRef.current.loop = true;

        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [currentSong]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => {
                onAddAlert('error', 'Playback Error', 'Could not play the audio file');
                console.error('Audio playback failed:', error);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleAnswer = (selectedIndex: number) => {
        setShowAnswer(true);
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        
        if (selectedIndex === musicQuizData[currentSong].correctAnswer) {
            setScore(score + 1);
            onExperienceGain(20);
            onAddAlert('success', 'Correct!', 'You know your music! +20 XP');
        } else {
            onAddAlert('error', 'Incorrect', 'Better luck next time!');
        }
    };

    const nextSong = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }

        if (currentSong < musicQuizData.length - 1) {
            setCurrentSong(currentSong + 1);
            setShowAnswer(false);
        } else {
            onAddAlert('achievement', 'Quiz Complete!', `Final Score: ${score}/${musicQuizData.length}`);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-gradient-to-r from-purple-800 to-indigo-900 shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-800 p-6">
                <CardTitle className="text-3xl text-white text-center font-bold">Music Quiz</CardTitle>
                <div className="text-center text-purple-200">
                    Score: {score}/{musicQuizData.length}
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <Music className="text-white" size={48} />
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Button
                        onClick={togglePlay}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        {isPlaying ? (
                            <Pause className="mr-2" size={20} />
                        ) : (
                            <Play className="mr-2" size={20} />
                        )}
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                        onClick={toggleMute}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        {isMuted ? (
                            <VolumeX className="mr-2" size={20} />
                        ) : (
                            <Volume2 className="mr-2" size={20} />
                        )}
                        {isMuted ? 'Unmute' : 'Mute'}
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {musicQuizData[currentSong].options.map((option, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={showAnswer}
                            className={`
                                p-4 transition-all duration-300 
                                ${showAnswer
                                    ? index === musicQuizData[currentSong].correctAnswer
                                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                                        : 'bg-gradient-to-r from-red-500 to-red-600'
                                    : 'bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-gray-200'
                                }
                                text-black font-bold rounded-lg shadow-md transform hover:scale-105
                            `}
                        >
                            <p className={showAnswer ? 'text-white' : 'text-black'}>{option}</p>
                        </Button>
                    ))}
                </div>

                {showAnswer && (
                    <div className="text-center">
                        <p className="mb-4 text-white">
                            {musicQuizData[currentSong].songTitle} by {musicQuizData[currentSong].artist}
                        </p>
                        <Button
                            onClick={nextSong}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            <SkipForward className="mr-2" size={20} />
                            Next Song
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MusicQuiz;