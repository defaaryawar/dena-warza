import { useState, useEffect, useCallback } from 'react';
import { Lock, Check, Delete } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../components/ui/CustomAlert';
import { toast } from 'react-hot-toast';
import CircularGallery from '../components/CircularGallery/CircularGallery';

const PinAuthentication: React.FC = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Sound effects initialization
    const buttonSound = new Audio('/sounds/pop.mp3');
    const deleteSound = new Audio('/sounds/delete.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    const errorSound = new Audio('/sounds/error.mp3');

    // Preload sounds
    useEffect(() => {
        [buttonSound, deleteSound, successSound, errorSound].forEach(sound => {
            sound.load();
        });
    }, []);

    // Play sound with volume adjustment
    const playSound = useCallback((sound: HTMLAudioElement) => {
        if (!sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
        sound.volume = 0.3;
        sound.play().catch(error => console.log('Audio playback prevented:', error));
    }, []);

    const handleNumClick = (num: string) => {
        if (pin.length < 6) {
            setPin(prevPin => prevPin + num);
            setError(null);
            playSound(buttonSound);
        }
    };

    const handleBackspace = () => {
        if (pin.length > 0) {
            setPin(prevPin => prevPin.slice(0, -1));
            playSound(deleteSound);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (success) {
            interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        navigate('/', { replace: true });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [success, navigate]);

    const handlePinSubmit = async () => {
        if (pin.length === 6) {
            try {
                const response = await fetch(`${BASE_URL}/api/users/authenticate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pin }),
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccess(true);
                    sessionStorage.setItem('authToken', data.token);
                    setCountdown(2);
                    playSound(successSound);

                    // Confetti effect
                    if (typeof window !== 'undefined') {
                        import('canvas-confetti').then(confetti => {
                            confetti.default({
                                particleCount: 100,
                                spread: 70,
                                origin: { y: 0.6 }
                            });
                        });
                    }

                    toast.success('Autentikasi Berhasil!', {
                        duration: 2000,
                        position: 'top-center',
                        style: {
                            background: '#4CAF50',
                            color: 'white',
                        },
                    });
                } else {
                    setError(data.message || 'PIN salah. Silakan coba lagi.');
                    playSound(errorSound);

                    toast.error(data.message || 'Autentikasi Gagal', {
                        duration: 2000,
                        position: 'top-center',
                        style: {
                            background: '#F44336',
                            color: 'white',
                        },
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Terjadi kesalahan. Silakan coba lagi.');

                toast.error('Terjadi kesalahan. Silakan coba lagi.', {
                    duration: 2000,
                    position: 'top-center',
                    style: {
                        background: '#F44336',
                        color: 'white',
                    },
                });
            }
        }
    };

    const renderPinDots = () => {
        return Array(6).fill(0).map((_, index) => (
            <div
                key={index}
                className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full mx-1 transition-all duration-300 
                    ${index < pin.length
                        ? 'bg-blue-600 scale-110 shadow-md animate-pulse'
                        : 'bg-gray-300'}`}
            />
        ));
    };

    const numPadButtons = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        '', '0', 'del'
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-fade-in">
                {/* Personal Photo Section */}
                <div className="hidden md:block md:w-1/2 relative">
                    <div style={{ height: '600px', position: 'relative' }}>
                        <CircularGallery bend={1} textColor="#10a0e3" borderRadius={0.05} />
                    </div>
                </div>

                {/* PIN Input Section */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col justify-center">
                    {/* Header */}
                    <div className="text-center">
                        <Lock
                            className={`mx-auto mb-4 w-12 h-12 text-blue-600 
                                ${success ? 'animate-bounce' : 'animate-pulse'}`}
                        />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Access</h2>
                        <p className="text-sm text-gray-600">Masukkan PIN 6 digit Anda</p>
                    </div>

                    {/* PIN Dots */}
                    <div className="flex justify-center mb-4">
                        {renderPinDots()}
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <CustomAlert
                            type="error"
                            message={error}
                            onClose={() => setError(null)}
                            className="mb-4"
                        />
                    )}

                    {/* Success Alert */}
                    {success && (
                        <CustomAlert
                            type="success"
                            message={`Autentikasi Berhasil! Mengalihkan dalam ${countdown} detik`}
                            className="mb-4"
                        />
                    )}

                    {/* Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
                        {numPadButtons.map((btn, index) => {
                            if (btn === '') return <div key={index} />;

                            if (btn === 'del') {
                                return (
                                    <button
                                        key={index}
                                        onClick={handleBackspace}
                                        disabled={pin.length === 0}
                                        className="bg-gray-100 hover:bg-gray-200 
                                        rounded-lg p-3 flex items-center 
                                        justify-center disabled:opacity-50
                                        transition-all duration-200 cursor-pointer
                                        active:scale-90 group"
                                    >
                                        <Delete className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNumClick(btn)}
                                    className="bg-white border border-gray-200 hover:bg-blue-50 
                                    rounded-lg p-3 
                                    text-xl font-semibold 
                                    text-gray-800 
                                    transition-all duration-200 
                                    active:scale-90 cursor-pointer
                                    hover:shadow-md hover:border-blue-300 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {btn}
                                </button>
                            );
                        })}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handlePinSubmit}
                        disabled={pin.length !== 6 || success}
                        className={`w-full max-w-xs mx-auto py-3 rounded-lg text-white font-semibold 
                                    transition-all duration-300 flex items-center justify-center cursor-pointer
                                    ${pin.length === 6 && !success
                                ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 hover:shadow-lg'
                                : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {success ? (
                            <Check className="w-6 h-6 animate-pulse" />
                        ) : (
                            'Verifikasi PIN'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinAuthentication;