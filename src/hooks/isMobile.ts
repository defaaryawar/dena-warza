import { useEffect, useState } from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // 768px adalah breakpoint untuk medium (md) di Tailwind
        };

        checkIsMobile(); // Cek saat komponen pertama kali di-render
        window.addEventListener('resize', checkIsMobile); // Cek saat ukuran layar berubah

        return () => {
            window.removeEventListener('resize', checkIsMobile); // Bersihkan event listener
        };
    }, []);

    return isMobile;
};
