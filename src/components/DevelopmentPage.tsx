import { Heart, Wrench, Stars, Sparkles } from 'lucide-react';

const DevelopmentPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full blur-2xl opacity-60 animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-2xl opacity-60 animate-pulse" />

                <div className="relative z-10">
                    {/* Tool icon with animation */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Wrench className="w-16 h-16 text-purple-500 animate-bounce" />
                            <Stars className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                            Sedang Dalam Pengembangan
                        </h1>

                        <p className="text-gray-600">
                            Sabar ya sayang, lagi dibuat dengan sepenuh
                            <Heart className="inline-block w-5 h-5 text-pink-500 mx-1 animate-pulse" />
                            untuk kamu
                        </p>

                        {/* Loading animation */}
                        <div className="flex justify-center gap-2 mt-6">
                            <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" />
                            <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce delay-100" />
                            <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce delay-200" />
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-4 right-4">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                    <div className="absolute top-4 left-4">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentPage;