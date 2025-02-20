import { useEffect, useState } from 'react';

const useInView = (threshold = 0.6) => {
    const [ref, setRef] = useState<HTMLElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(ref);
                }
            },
            { threshold }
        );

        observer.observe(ref);

        return () => {
            if (ref) observer.unobserve(ref);
        };
    }, [ref, threshold]);

    return { setRef, inView };
};

export default useInView;