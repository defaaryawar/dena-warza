// src/hooks/useFetchMemories.ts
import { useQuery } from 'react-query';
import { Memory, MediaItem } from '../types/Memory';
import { toast } from 'react-hot-toast';
import { memories as localMemories } from '../data/dataImage'; // Import local data

export const useFetchMemories = () => {
    const handleFetchError = (error: Error) => {
        toast.error(`Gagal memuat kenangan: ${error.message}`);
        return [];
    };

    return useQuery<Memory[], Error>(
        ['local_memories'],
        async () => {
            try {
                console.log('Using local memories data');

                // Transform and sort the local data
                const processedMemories = localMemories.map(memory => ({
                    ...memory,
                    // Ensure media items have IDs
                    media: memory.media.map((item, index) => ({
                        ...item,
                        id: item.id || `media-${memory.id}-${index}` // Generate ID if missing
                    })),
                    // Set createdAt/updatedAt using the memory date if not provided
                    createdAt: memory.createdAt || `${memory.date}T00:00:00.000Z`,
                    updatedAt: memory.updatedAt || `${memory.date}T00:00:00.000Z`
                })).sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                return processedMemories;
            } catch (err) {
                console.error('Error processing local memories:', err);
                throw new Error('Failed to process local memories data');
            }
        },
        {
            staleTime: Infinity, // Local data never becomes stale
            cacheTime: Infinity, // Cache forever
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            onError: (err: Error) => {
                handleFetchError(err);
            }
        }
    );
};