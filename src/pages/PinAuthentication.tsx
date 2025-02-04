import { useState, useEffect } from 'react';
import { Lock, Check, X, Delete } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PinAuthentication: React.FC = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    const CORRECT_PIN = import.meta.env.VITE_CORRECT_PIN;
    const SECRET_TOKEN = import.meta.env.VITE_SECRRET_TOKEN;

    const handleNumClick = (num: string) => {
        if (pin.length < 6) {
            setPin(prevPin => prevPin + num);
            setError(false);
        }
    };

    const handleBackspace = () => {
        setPin(prevPin => prevPin.slice(0, -1));
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

    const handlePinSubmit = () => {
        if (pin === CORRECT_PIN) {
            setSuccess(true);
            const token = SECRET_TOKEN;
            sessionStorage.setItem('authToken', token);
            setCountdown(2);
        } else {
            setError(true);
            setTimeout(() => {
                setError(false);
                setPin('');
            }, 600);
        }
    };

    const renderPinDots = () => {
        return Array(6).fill(0).map((_, index) => (
            <div
                key={index}
                className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full mx-1 transition-all duration-300 
                    ${index < pin.length
                        ? 'bg-blue-600 scale-110 shadow-md'
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
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl flex overflow-hidden ">
                {/* Personal Photo Section */}
                <div className="hidden md:block md:w-1/2 px-2">
                    <img 
                        src="/images/photo-pin.webp"
                        alt="Personal Photo" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* PIN Input Section */}
                <div className="w-full md:w-1/2 p-6 space-y-4">
                    {/* Header */}
                    <div className="text-center">
                        <Lock className="mx-auto mb-2 w-10 h-10 text-blue-600" />
                        <h2 className="text-xl font-bold">Secure Access</h2>
                        <p className="text-xs text-gray-600">Enter your 6-digit PIN</p>
                    </div>

                    {/* PIN Dots */}
                    <div className="flex justify-center mb-0">
                        {renderPinDots()}
                    </div>

                    {/* Success Indicator */}
                    <div className="h-6 text-center">
                        {success && (
                            <div className="text-green-600 flex items-center justify-center">
                                <Check className="mr-2 w-6 h-6 text-green-500" />
                                <span className="text-sm font-medium">
                                    Authentication Successful! Redirecting in {countdown}s
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    <div className="h-6 text-center">
                        {error && (
                            <div className="text-red-500 flex items-center justify-center animate-shake">
                                <X className="mr-2 w-4 h-4" />
                                <span className="text-sm">Incorrect PIN. Try again.</span>
                            </div>
                        )}
                    </div>

                    {/* Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {numPadButtons.map((btn, index) => {
                            if (btn === '') return <div key={index} />;

                            if (btn === 'del') {
                                return (
                                    <button
                                        key={index}
                                        onClick={handleBackspace}
                                        disabled={pin.length === 0}
                                        className="bg-gray-100 hover:bg-gray-200 
                                        rounded-lg p-2 flex items-center 
                                        justify-center disabled:opacity-50
                                        transition-all duration-200 cursor-pointer"
                                    >
                                        <Delete className="w-5 h-5 text-gray-600" />
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNumClick(btn)}
                                    className="bg-gray-100 hover:bg-blue-100 
                                    rounded-lg p-2 
                                    text-xl font-semibold 
                                    text-gray-800 
                                    transition-all duration-200 
                                    active:scale-95 cursor-pointer"
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
                        className={`w-full py-2 rounded-lg text-white font-semibold 
                                    transition-all duration-300 flex items-center justify-center cursor-pointer
                                    ${pin.length === 6 && !success
                                ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                                : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {success ? (
                            <>
                                <Check className="mr-2 w-4 h-4" /> Authenticated
                            </>
                        ) : (
                            'Verify PIN'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinAuthentication;