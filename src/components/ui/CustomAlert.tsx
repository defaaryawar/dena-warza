import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, Heart, Star, Trophy, Gift } from 'lucide-react';

export interface CustomAlertProps {
    type?: 'success' | 'error' | 'info' | 'warning' | 'achievement' | 'reward' | 'love' | 'milestone';
    title?: string;
    message: string;
    icon?: React.ReactNode;
    onClose?: () => void;
    showCloseButton?: boolean;
    className?: string;
}

const CustomAlert = ({
    type = 'info',
    title,
    message,
    icon,
    onClose,
    showCloseButton = true,
    className = ''
}: CustomAlertProps) => {
    const getAlertStyles = () => {
        const baseStyles = 'relative transition-all duration-300 transform hover:scale-[1.02] p-4 rounded-lg border';
        switch (type) {
            case 'success':
                return `${baseStyles} bg-gradient-to-r from-green-50 to-emerald-50 border-green-200`;
            case 'error':
                return `${baseStyles} bg-gradient-to-r from-red-50 to-rose-50 border-red-200`;
            case 'warning':
                return `${baseStyles} bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200`;
            case 'achievement':
                return `${baseStyles} bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200`;
            case 'reward':
                return `${baseStyles} bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200`;
            case 'love':
                return `${baseStyles} bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200`;
            case 'milestone':
                return `${baseStyles} bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200`;
            default:
                return `${baseStyles} bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200`;
        }
    };

    const getIcon = () => {
        if (icon) return icon;
        switch (type) {
            case 'success':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'achievement':
                return <Trophy className="h-5 w-5 text-purple-500" />;
            case 'reward':
                return <Gift className="h-5 w-5 text-yellow-500" />;
            case 'love':
                return <Heart className="h-5 w-5 text-pink-500" />;
            case 'milestone':
                return <Star className="h-5 w-5 text-blue-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getTitleColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'achievement':
                return 'text-purple-800';
            case 'reward':
                return 'text-yellow-800';
            case 'love':
                return 'text-pink-800';
            case 'milestone':
                return 'text-blue-800';
            default:
                return 'text-blue-800';
        }
    };

    return (
        <div className={`${getAlertStyles()} ${className} shadow-lg`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">{getIcon()}</div>
                <div className="ml-3 flex-1">
                    {title && (
                        <div className={`text-lg font-semibold ${getTitleColor()}`}>
                            {title}
                        </div>
                    )}
                    <div className="mt-1 text-sm text-gray-700">
                        {message}
                    </div>
                </div>
                {showCloseButton && onClose && (
                    <button
                        onClick={onClose}
                        className="ml-auto flex-shrink-0 -mr-1 -mt-1 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                        <span className="sr-only">Close</span>
                        <XCircle className="h-5 w-5 text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Achievement Alert Variant
export const AchievementAlert = ({ title, message, onClose }: Omit<CustomAlertProps, 'type'>) => (
    <div className="relative animate-slideIn">
        <CustomAlert
            type="achievement"
            title={title}
            message={message}
            onClose={onClose}
            className="border-2 border-purple-200"
        />
        <div className="absolute -z-10 top-1 left-1 right-1 bottom-1 bg-purple-100 rounded-lg blur-sm" />
    </div>
);

// Reward Alert Variant
export const RewardAlert = ({ title, message, onClose }: Omit<CustomAlertProps, 'type'>) => (
    <div className="relative animate-slideIn">
        <CustomAlert
            type="reward"
            title={title}
            message={message}
            onClose={onClose}
            className="border-2 border-yellow-200"
        />
        <div className="absolute -z-10 top-1 left-1 right-1 bottom-1 bg-yellow-100 rounded-lg blur-sm" />
    </div>
);

// Love Alert Variant
export const LoveAlert = ({ title, message, onClose }: Omit<CustomAlertProps, 'type'>) => (
    <div className="relative animate-slideIn">
        <CustomAlert
            type="love"
            title={title}
            message={message}
            onClose={onClose}
            className="border-2 border-pink-200"
        />
        <div className="absolute -z-10 top-1 left-1 right-1 bottom-1 bg-pink-100 rounded-lg blur-sm" />
    </div>
);

// Usage Examples Component
const AlertExamples = () => {
    return (
        <div className="space-y-4 p-4">
            <CustomAlert
                type="success"
                title="Success!"
                message="You've completed the daily challenge!"
            />

            <CustomAlert
                type="error"
                title="Error"
                message="Unable to save your progress. Please try again."
            />

            <CustomAlert
                type="warning"
                title="Warning"
                message="You're about to reset your progress."
            />

            <AchievementAlert
                title="New Achievement Unlocked!"
                message="You've reached Level 10 in your relationship journey!"
            />

            <RewardAlert
                title="Daily Reward!"
                message="You've earned 50 love points for completing today's challenge!"
            />

            <LoveAlert
                title="Love Note"
                message="Your partner has sent you a special message!"
            />

            <CustomAlert
                type="milestone"
                title="Milestone Reached!"
                message="You've been playing together for 30 days!"
            />
        </div>
    );
};

export default CustomAlert;
export { AlertExamples };