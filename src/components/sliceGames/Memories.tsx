import React from 'react';
import { Camera } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const Memories: React.FC = () => {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="text-center p-8">
                    <Camera className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-xl font-medium mb-2">Coming Soon!</h3>
                    <p className="text-gray-600">
                        The Memories feature is under development.
                        Stay tuned for updates!
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default Memories;