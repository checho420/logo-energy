import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import banner1 from '../assets/banner/banner1.jpg';
import banner2 from '../assets/banner/banner2.png';
import banner3 from '../assets/banner/banner3.png';
import banner4 from '../assets/banner/banner4.jpg';

const images = [
    {
        src: banner1,
        title: "Poder Ético",
        description: "Redefiniendo el futuro energético con tecnología de vanguardia y diseño extraordinario.",
        tag: "Innovación 2026"
    },
    {
        src: banner2,
        title: "Visión Solar",
        description: "Capturamos la esencia de la luz para potenciar tu vida cotidiana con elegancia.",
        tag: "Energía Infinita"
    },
    {
        src: banner3,
        title: "Flujo Vital",
        description: "Movilidad inteligente diseñada para integrarse perfectamente en tu ecosistema.",
        tag: "Movilidad Pura"
    },
    {
        src: banner4,
        title: "Legado Verde",
        description: "Construyendo las bases de una civilización conectada con el pulso planetario.",
        tag: "Impacto Zero"
    }
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="relative h-screen min-h-[700px] w-full bg-brand-charcoal overflow-hidden group/hero">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        <img
                            src={images[currentIndex].src}
                            alt=""
                            className="w-full h-full object-cover grayscale-[0.2] brightness-[0.7]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/20 to-transparent" />
                        <div className="absolute inset-0 bg-black/30" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center">
                <div className="max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="flex flex-col gap-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-4"
                            >
                                <div className="h-[2px] w-12 bg-brand-green" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-green">
                                    {images[currentIndex].tag}
                                </span>
                            </motion.div>

                            <h1 className="text-6xl md:text-9xl font-bold tracking-tight text-brand-cream overflow-visible">
                                {images[currentIndex].title.split(' ').map((word, wordIdx) => (
                                    <span key={wordIdx} className="inline-block whitespace-nowrap">
                                        {word.split('').map((char, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ y: "100%", opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{
                                                    delay: 0.4 + (wordIdx * 0.1) + (i * 0.03),
                                                    duration: 0.8,
                                                    ease: "circOut"
                                                }}
                                                className="inline-block"
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                        {wordIdx < images[currentIndex].title.split(' ').length - 1 && '\u00A0'}
                                    </span>
                                ))}
                            </h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="text-lg md:text-xl text-brand-cream/60 max-w-xl font-light leading-relaxed"
                            >
                                {images[currentIndex].description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1, duration: 0.6 }}
                                className="flex items-center gap-8 mt-4"
                            >
                                <Link to="/catalog" className="btn-premium flex items-center gap-4">
                                    <span>Explorar Colecciones</span>
                                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                                </Link>
                                <button className="text-brand-cream/40 hover:text-brand-cream transition-colors font-bold uppercase text-[10px] tracking-widest border-b border-brand-cream/10 hover:border-brand-cream pb-1">
                                    Nuestra Historia
                                </button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Central Navigation Controls */}
            <div className="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 md:gap-8 w-full max-w-xl px-4 md:px-6">
                <div className="flex items-center justify-between w-full mb-2">
                    <button 
                        onClick={prevSlide} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-cream/40 hover:bg-brand-green hover:text-brand-cream hover:border-brand-green transition-all"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                    </button>

                    <div className="flex items-center gap-2 md:gap-4 flex-1 px-4 md:px-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > currentIndex ? 1 : -1);
                                    setCurrentIndex(idx);
                                }}
                                className="flex-1 group py-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <span className={`text-[9px] md:text-[10px] font-black transition-colors duration-500 ${idx === currentIndex ? 'text-brand-green' : 'text-brand-cream/20'}`}>
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="relative h-[2px] w-full bg-brand-cream/10 overflow-hidden">
                                        {idx === currentIndex && (
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 8, ease: "linear" }}
                                                className="absolute inset-0 bg-brand-green origin-left"
                                            />
                                        )}
                                        {idx < currentIndex && (
                                            <div className="absolute inset-0 bg-brand-green/40" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={nextSlide} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-cream/40 hover:bg-brand-green hover:text-brand-cream hover:border-brand-green transition-all"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                    </button>
                </div>
            </div>



            {/* Background Typography Overlay */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 rotate-90 z-0 pointer-events-none opacity-[0.02] select-none text-[20vw] font-black text-brand-cream whitespace-nowrap">
                LOGO ENERGY SYSTEMS
            </div>
        </section>
    );
};

export default Hero;
