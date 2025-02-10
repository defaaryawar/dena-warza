import React, { useState, useRef, useEffect } from 'react';
import { Smile, Type, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { BaseGameProps } from '../../types/types';

type MemeGeneratorProps = Omit<BaseGameProps, 'onGameModeChange'>;

const MemeGenerator: React.FC<MemeGeneratorProps> = ({ onExperienceGain, onAddAlert }) => {
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Placeholder meme templates
    const memeTemplates = [
        '/api/placeholder/400/400',
        '/api/placeholder/400/400',
        '/api/placeholder/400/400'
    ];

    const generateMeme = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create a new image element
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.src = memeTemplates[selectedTemplate];

        img.onload = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Configure text style
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';
            ctx.font = 'bold 36px Impact';

            // Draw top text
            ctx.fillText(topText.toUpperCase(), canvas.width / 2, 50);
            ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 50);

            // Draw bottom text
            ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
            ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        };
    };

    // Generate meme whenever text or template changes
    useEffect(() => {
        generateMeme();
    }, [topText, bottomText, selectedTemplate]);

    const downloadMeme = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'couple-meme.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        onExperienceGain(15);
        onAddAlert('success', 'Meme Downloaded!', 'Your creation has been saved! +15 XP');
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Couple Meme Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    {memeTemplates.map((template, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedTemplate(index)}
                            className={`
                                cursor-pointer rounded-lg overflow-hidden border-4
                                ${selectedTemplate === index ? 'border-pink-500' : 'border-transparent'}
                                transition-all duration-300 hover:scale-105
                            `}
                        >
                            <img
                                src={template}
                                alt={`Template ${index + 1}`}
                                className="w-full h-32 object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Type size={20} className="text-gray-500" />
                        <input
                            type="text"
                            value={topText}
                            onChange={(e) => setTopText(e.target.value)}
                            placeholder="Top Text"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Type size={20} className="text-gray-500" />
                        <input
                            type="text"
                            value={bottomText}
                            onChange={(e) => setBottomText(e.target.value)}
                            placeholder="Bottom Text"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Button
                        onClick={generateMeme}
                        className="bg-pink-500 hover:bg-pink-600"
                    >
                        <Smile className="mr-2" size={20} />
                        Generate Meme
                    </Button>
                    <Button
                        onClick={downloadMeme}
                        className="bg-purple-500 hover:bg-purple-600"
                    >
                        <Download className="mr-2" size={20} />
                        Download
                    </Button>
                </div>

                <div className="relative w-full h-96 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="w-full h-full object-contain"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default MemeGenerator;