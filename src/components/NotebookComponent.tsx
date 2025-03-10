import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

const NotebookComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const notebookRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [phoneStand, setPhoneStand] = useState(false);

    // Refs for scroll animations
    const [pageOneRef, pageOneInView] = useInView({ threshold: 0.5, triggerOnce: true });
    const [pageTwoRef, pageTwoInView] = useInView({ threshold: 0.5, triggerOnce: true });
    const [pageThreeRef, pageThreeInView] = useInView({ threshold: 0.5, triggerOnce: true });

    // Color palette (blue theme)
    const colors = {
        primary: '#1E3A8A', // Dark Blue
        secondary: '#3B82F6', // Blue
        accent1: '#60A5FA', // Light Blue
        accent2: '#93C5FD', // Lighter Blue
        dark: '#111827', // Very Dark Blue
        light: '#FFFFFF' // White
    };

    // Spring animations
    const notebookAnimation = useSpring({
        transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)',
        config: { mass: 5, tension: 350, friction: 40 }
    });

    const phoneAnimation = useSpring({
        transform: phoneStand ? 'rotateX(10deg) translateY(-50px)' : 'rotateX(90deg) translateY(0px)',
        opacity: phoneStand ? 1 : 0,
        config: { mass: 1, tension: 280, friction: 60 }
    });

    // Page animations
    const pageOneAnimation = useSpring({
        opacity: pageOneInView ? 1 : 0,
        transform: pageOneInView ? 'translateY(0)' : 'translateY(50px)',
        config: { duration: 1000 }
    });

    const pageTwoAnimation = useSpring({
        opacity: pageTwoInView ? 1 : 0,
        transform: pageTwoInView ? 'translateY(0)' : 'translateY(50px)',
        config: { duration: 1000 }
    });

    const pageThreeAnimation = useSpring({
        opacity: pageThreeInView ? 1 : 0,
        transform: pageThreeInView ? 'translateY(0)' : 'translateY(50px)',
        config: { duration: 1000 }
    });

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrollY(scrollPosition);

            // Open notebook after scrolling a bit - adjust threshold based on viewport height
            const openThreshold = window.innerHeight * 0.1;
            if (scrollPosition > openThreshold) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }

            // Phone stands up after scrolling further - responsive threshold
            const phoneThreshold = window.innerHeight * 0.8; // Adjusted threshold for phone to appear after notebook
            if (scrollPosition > phoneThreshold) {
                setPhoneStand(true);
            } else {
                setPhoneStand(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Three.js heart particles effect
    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement);
        }

        // Heart shape geometry
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;

        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        const heartGeometry = new THREE.ShapeGeometry(heartShape);

        // Create particles - adjust count based on device performance
        const isMobile = window.innerWidth < 768;
        const particlesCount = isMobile ? 30 : 50;
        const particles = new THREE.Group();

        for (let i = 0; i < particlesCount; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(
                    Math.random() < 0.5 ? colors.primary : 
                    Math.random() < 0.7 ? colors.secondary : colors.accent1
                ),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: Math.random() * 0.5 + 0.2
            });

            const particle = new THREE.Mesh(heartGeometry, material);

            // Random position - scale based on screen size
            const positionScale = isMobile ? 10 : 20;
            particle.position.x = (Math.random() - 0.5) * positionScale;
            particle.position.y = (Math.random() - 0.5) * positionScale;
            particle.position.z = (Math.random() - 0.5) * positionScale;

            // Random scale - smaller on mobile
            const scale = Math.random() * (isMobile ? 0.03 : 0.04) + 0.01;
            particle.scale.set(scale, scale, scale);

            // Random rotation
            particle.rotation.x = Math.random() * Math.PI;
            particle.rotation.y = Math.random() * Math.PI;

            // Store original position for animation
            particle.userData = {
                originalX: particle.position.x,
                originalY: particle.position.y,
                originalZ: particle.position.z,
                speedX: (Math.random() - 0.5) * 0.01,
                speedY: (Math.random() - 0.5) * 0.01,
                speedZ: (Math.random() - 0.5) * 0.01
            };

            particles.add(particle);
        }

        scene.add(particles);
        camera.position.z = 15;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Animate heart particles
            particles.children.forEach(particle => {
                particle.position.x += particle.userData.speedX;
                particle.position.y += particle.userData.speedY;
                particle.position.z += particle.userData.speedZ;

                particle.rotation.x += 0.005;
                particle.rotation.y += 0.005;

                // Reset position if too far
                if (Math.abs(particle.position.x - particle.userData.originalX) > 5) {
                    particle.userData.speedX *= -1;
                }
                if (Math.abs(particle.position.y - particle.userData.originalY) > 5) {
                    particle.userData.speedY *= -1;
                }
                if (Math.abs(particle.position.z - particle.userData.originalZ) > 5) {
                    particle.userData.speedZ *= -1;
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize - important for responsiveness
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            
            // Adjust camera and particles for different screen sizes
            const isMobileView = width < 768;
            camera.position.z = isMobileView ? 20 : 15;
            
            // Adjust particle speeds based on screen size
            const speedFactor = isMobileView ? 0.5 : 1;
            particles.children.forEach(particle => {
                particle.userData.speedX *= speedFactor;
                particle.userData.speedY *= speedFactor;
                particle.userData.speedZ *= speedFactor;
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Three.js background container */}
            <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10" />

            {/* Gradient Background with improved colors */}
            <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 opacity-20 -z-20" />

            {/* Header with responsive sizing */}
            <header className="w-full py-8 md:py-12 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                    Cerita Cinta Zahira
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-700">Scroll untuk membuka cerita kita</p>
                <div className="mt-6 animate-bounce">
                    <svg className="w-6 h-6 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </header>

            {/* Notebook - responsive sizing */}
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto my-12 md:my-24 perspective px-4">
                <animated.div
                    ref={notebookRef}
                    style={notebookAnimation}
                    className="relative w-full h-64 sm:h-80 md:h-96 preserve-3d my-12"
                >
                    {/* Notebook Cover - improved shadow and border */}
                    <div
                        className="absolute inset-0 backface-hidden rounded-lg shadow-2xl"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent1})`,
                            border: `4px solid ${colors.accent2}`,
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8">
                            <div className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 animate-pulse">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Kisah Cinta Kita</h2>
                            <p className="text-white opacity-75 text-center text-sm md:text-base">Dibuka dengan kenangan dan harapan</p>
                        </div>
                    </div>

                    {/* Notebook Inside Pages - improved styling and scrollbar */}
                    <div
                        className="absolute inset-0 backface-hidden rounded-lg shadow-2xl bg-white rotateY-180"
                        style={{ 
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <div 
                            className="absolute inset-0 overflow-y-auto p-4 md:p-8 notebook-paper"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: `${colors.primary} #f0f0f0`
                            }}
                        >
                            {/* Page One - improved layout */}
                            <animated.div
                                ref={pageOneRef}
                                style={pageOneAnimation}
                                className="mb-12 md:mb-16"
                            >
                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center" style={{ color: colors.primary }}>
                                    Awal Pertemuan Kita
                                </h3>
                                <p className="mb-4 text-gray-700 leading-relaxed text-sm md:text-base">
                                    Hari itu, langit berwarna biru cerah ketika kita pertama kali bertemu.
                                    Senyummu membuat jantungku berdebar lebih cepat, dan tawamu mencairkan
                                    semua keraguan yang pernah kumiliki.
                                </p>
                                <p className="mb-4 text-gray-700 leading-relaxed text-sm md:text-base">
                                    Pada saat itu, aku tahu hidupku tidak akan pernah sama lagi.
                                    Setiap kata yang kau ucapkan terukir dalam memoriku seperti puisi.
                                </p>
                                <div className="w-full h-32 md:h-48 rounded-lg mb-4 overflow-hidden shadow-md transition-transform hover:scale-105 duration-300">
                                    <div className="w-full h-full bg-gradient-to-r from-blue-200 to-blue-300 flex items-center justify-center">
                                        <p className="text-center text-gray-600 italic px-4 text-sm md:text-base">
                                            [Foto pertama kita bersama]
                                        </p>
                                    </div>
                                </div>
                            </animated.div>

                            {/* Page Two - improved layout and quotation */}
                            <animated.div
                                ref={pageTwoRef}
                                style={pageTwoAnimation}
                                className="mb-12 md:mb-16"
                            >
                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center" style={{ color: colors.accent1 }}>
                                    Perjalanan Indah
                                </h3>
                                <p className="mb-4 text-gray-700 leading-relaxed text-sm md:text-base">
                                    Waktu berlalu dengan cepat, namun setiap momen bersamamu terasa abadi.
                                    Kita melalui suka dan duka bersama, saling menguatkan ketika salah satu dari
                                    kita merasa lemah.
                                </p>
                                <p className="mb-4 text-gray-700 leading-relaxed text-sm md:text-base">
                                    Kau mengajarkanku bahwa cinta bukan hanya tentang perasaan, namun juga tentang
                                    komitmen dan pengertian. Setiap hari bersamamu adalah petualangan baru yang
                                    menegaskan pilihan hatiku.
                                </p>
                                <div className="w-full p-4 rounded-lg mb-4 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm transition-all hover:shadow-md duration-300">
                                    <blockquote className="italic text-gray-700 text-center text-sm md:text-base">
                                        "Cinta tidak membutuhkan alasan, karena dirinyalah alasan itu sendiri."
                                    </blockquote>
                                </div>
                            </animated.div>

                            {/* Page Three - improved layout */}
                            <animated.div
                                ref={pageThreeRef}
                                style={pageThreeAnimation}
                            >
                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center" style={{ color: colors.accent2 }}>
                                    Masa Depan Kita
                                </h3>
                                <p className="mb-4 text-gray-700 leading-relaxed text-sm md:text-base">
                                    Saat kita menatap horizon yang sama, aku melihat harapan dan impian kita terbentang
                                    seperti bintang-bintang di langit malam. Setiap rencana yang kita buat bersama
                                    adalah janji untuk masa depan yang lebih indah.
                                </p>
                                <p className="mb-4 text-gray-700 leading-relaxed text-sm md:text-base">
                                    Aku tak sabar untuk menulis lebih banyak lembaran cerita bersamamu, menjelajahi
                                    dunia bergandengan tangan, dan membangun istana cinta yang tak lekang oleh waktu.
                                </p>
                                <div className="w-full h-32 md:h-48 rounded-lg mb-4 overflow-hidden shadow-md transition-transform hover:scale-105 duration-300">
                                    <div className="w-full h-full bg-gradient-to-r from-blue-200 to-cyan-200 flex items-center justify-center">
                                        <p className="text-center text-gray-600 italic px-4 text-sm md:text-base">
                                            [Tempat impian kita bersama]
                                        </p>
                                    </div>
                                </div>
                            </animated.div>
                        </div>
                    </div>
                </animated.div>

                {/* Phone displaying our picture - improved design */}
                <animated.div
                    ref={phoneRef}
                    style={phoneAnimation}
                    className="w-32 sm:w-40 md:w-48 h-56 sm:h-64 md:h-80 rounded-3xl mx-auto mt-12 md:mt-16 mb-20 md:mb-32 shadow-xl overflow-hidden"
                >
                    <div className="w-full h-full bg-black relative">
                        <div className="absolute top-0 w-full h-6 md:h-8 flex justify-center items-center">
                            <div className="w-16 md:w-20 h-4 md:h-5 bg-black rounded-b-xl"></div>
                        </div>
                        <div className="w-full h-full p-2">
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col justify-center items-center text-white p-3 md:p-4">
                                <div className="w-16 md:w-24 h-16 md:h-24 rounded-full mb-3 md:mb-4 bg-white flex items-center justify-center overflow-hidden transition-transform hover:scale-110 duration-300">
                                    <svg viewBox="0 0 24 24" width="36" height="36" fill="#1E3A8A">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-center">Zahira & Cintanya</h3>
                                <p className="text-center text-xs md:text-sm opacity-80">Selamanya bahagia bersama dalam ikatan cinta yang tulus</p>
                            </div>
                        </div>
                    </div>
                </animated.div>
            </div>

            {/* Interactive elements section */}
            <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-wrap justify-center gap-4">
                    <button 
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Kembali ke Awal
                    </button>
                    <button 
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => {
                            const notebook = document.querySelector('.notebook-paper');
                            if (notebook) notebook.scrollTop = 0;
                            setIsOpen(true);
                        }}
                    >
                        Buka Buku
                    </button>
                </div>
            </div>

            {/* Footer message */}
            <footer className="text-center py-8 md:py-12 text-gray-600 px-4">
                <p className="text-sm md:text-base">Scroll untuk mengungkap lebih banyak cerita kita...</p>
                <p className="mt-2 text-xs md:text-sm">Dibuat dengan 
                    <span className="inline-block mx-1 text-blue-500 animate-pulse">♥</span> 
                    untuk Zahira
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center transition-colors hover:bg-blue-200">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center transition-colors hover:bg-blue-200">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center transition-colors hover:bg-cyan-200">
                        <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NotebookComponent;