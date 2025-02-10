import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types/Memory';

const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = videoUrl;
        video.currentTime = 1; // Set to 1 second
        
        video.addEventListener('loadeddata', () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Could not get canvas context');
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnailUrl = canvas.toDataURL('image/jpeg');
                video.remove();
                resolve(thumbnailUrl);
            } catch (error) {
                reject(error);
            }
        });

        video.addEventListener('error', (error) => {
            reject(error);
        });

        video.load();
    });
};

interface MediaDisplayProps {
    media: MediaItem;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({ media }) => {
    const [videoThumbnail, setVideoThumbnail] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        if (media.type === 'video') {
            generateVideoThumbnail(media.url)
                .then(setVideoThumbnail)
                .catch(err => {
                    console.error('Error generating thumbnail:', err);
                    setVideoThumbnail(undefined);
                });
        }
    }, [media.url, media.type]);

    if (media.type === 'video') {
        return (
            <div className="relative w-full h-[80vh]">
                <video
                    controls
                    poster={videoThumbnail}
                    className="absolute inset-0 w-full h-full object-contain bg-black/95"
                >
                    <source src={media.url} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                </video>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[80vh]">
            <img
                src={media.url}
                alt="media"
                className="absolute inset-0 w-full h-full object-contain bg-black/95"
            />
        </div>
    );
};

export default MediaDisplay;