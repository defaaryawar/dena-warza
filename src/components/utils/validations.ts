export const validations = {
    validateTitle: (title: string): string | null => {
        if (title.trim().length < 3) return 'Judul minimal 3 karakter';
        if (title.trim().length > 100) return 'Judul maksimal 100 karakter';
        return null;
    },

    validateDescription: (description: string): string | null => {
        if (description.trim().length < 10) return 'Deskripsi minimal 10 karakter';
        if (description.trim().length > 500) return 'Deskripsi maksimal 500 karakter';
        return null;
    },

    validateDate: (date: string): string | null => {
        if (!date) return 'Tanggal harus diisi';
        const selectedDate = new Date(date);
        const currentDate = new Date();
        if (selectedDate > currentDate) return 'Tanggal tidak boleh di masa depan';
        return null;
    }
};