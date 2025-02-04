export type MediaType = 'photo' | 'video';

export interface MediaItem {
    type: MediaType;
    url: string;
    thumbnail?: string;
}

export interface Memory {
    id: string;
    title: string;
    description: string;
    date: string;
    media: MediaItem[];
    tags: string[];
}

export interface VideoWithMemoryInfo extends MediaItem {
    type: 'video';
    memoryTitle: string;
    memoryDate: string;
}