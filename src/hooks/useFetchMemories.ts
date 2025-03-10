import { useQuery } from 'react-query';
import { supabase } from '../services/supabaseClient';
import { Memory, MediaItem } from '../types/Memory';
import { toast } from 'react-hot-toast';

export const useFetchMemories = () => {
    const handleFetchError = (error: Error) => {
        if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
            toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
            return [];
        }

        toast.error(`Gagal memuat kenangan: ${error.message}`);
        return [];
    };

    return useQuery<(Memory & { media: MediaItem[] })[], Error>(
        ['latest_memories_with_media'],
        async () => {
            try {
                console.log('Fetching memories with media from Supabase');

                // Fetch memories with their associated media
                const { data, error } = await supabase
                    .from('Memory')
                    .select(`
                        *,
                        Media (*)
                    `)
                    .order('date', { ascending: false });

                if (error) {
                    throw new Error(error.message);
                }

                if (!data) {
                    return [];
                }

                // Map the data to match the Memory interface
                const combinedData = data.map(memory => ({
                    ...memory,
                    media: memory.Media || [] // Ensure media is always an array
                }));

                console.log('Combined memories with media:', combinedData);
                return combinedData;
            } catch (err) {
                console.error('Error fetching memories with media:', err);
                return handleFetchError(err as Error);
            }
        },
        {
            staleTime: 120 * 60 * 1000,
            cacheTime: 120 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            onError: (err: Error) => {
                handleFetchError(err);
            }
        }
    );
};