import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Brush, Eraser, RotateCcw, Download } from 'lucide-react';
import { BaseGameProps } from '../../types/types';

type DrawTogetherProps = Omit<BaseGameProps, 'onGameModeChange'>;

const DrawTogether: React.FC<DrawTogetherProps> = ({ onExperienceGain, onAddAlert }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isEraser, setIsEraser] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Set initial canvas background to white
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        context.beginPath();
        context.moveTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const rect = canvas.getBoundingClientRect();
        context.lineTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
        context.strokeStyle = isEraser ? '#FFFFFF' : color;
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            onExperienceGain(5);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        onAddAlert('info', 'Canvas Cleared', 'Start fresh!');
    };

    const downloadDrawing = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'our-drawing.png';
        link.href = dataURL;
        link.click();

        onExperienceGain(15);
        onAddAlert('success', 'Drawing Saved!', 'Your masterpiece has been downloaded.');
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Draw Together</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center space-x-4 mb-4">
                    <Button
                        onClick={() => setIsEraser(false)}
                        className={`${!isEraser ? 'bg-pink-500' : 'bg-gray-200'}`}
                    >
                        <Brush className="mr-2" size={16} />
                        Brush
                    </Button>
                    <Button
                        onClick={() => setIsEraser(true)}
                        className={`${isEraser ? 'bg-pink-500' : 'bg-gray-200'}`}
                    >
                        <Eraser className="mr-2" size={16} />
                        Eraser
                    </Button>
                    <Button onClick={clearCanvas} className="bg-gray-200">
                        <RotateCcw className="mr-2" size={16} />
                        Clear
                    </Button>
                    <Button onClick={downloadDrawing} className="bg-green-500">
                        <Download className="mr-2" size={16} />
                        Save
                    </Button>
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-10 cursor-pointer"
                    />
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-32"
                    />
                </div>
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full h-96 cursor-crosshair"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default DrawTogether;