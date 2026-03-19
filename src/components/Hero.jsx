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
        preTitle: "Tecnología de Vanguardia",
        title: "Poder Ético",
        subtitle: "Redefiniendo el futuro energético con diseño extraordinario.",
        tag: "Innova",
        price: "$1.999.000"
    },
    {
        src: banner2,
        preTitle: "Energía Inagotable",
        title: "Visión Solar",
        subtitle: "Capturamos la luz para potenciar tu vida cotidiana.",
        tag: "30% OFF",
        price: "$850.000"
    },
    {
        src: banner3,
        preTitle: "Desempeño Extremo",
        title: "Flujo Vital",
        subtitle: "Movilidad inteligente diseñada para integrarse perfectamente.",
        tag: "Nuevo",
        price: "$3.450.000"
    },
    {
        src: banner4,
        preTitle: "Impacto Zero",
        title: "Legado Verde",
        subtitle: "Las bases de una civilización conectada con el planeta.",
        tag: "Eco",
        price: "$450.000"
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
        <section className="relative h-[650px] w-full bg-[#f4f4f4] dark:bg-[#151718] overflow-hidden group/hero flex items-center">
            
            {/* Split Background (Left: solid, Right: image overlay) */}
            <div className="absolute inset-0 flex">
                <div className="w-full lg:w-1/2 h-full bg-transparent z-10" />
                <div className="w-full lg:w-1/2 h-full relative z-0">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            {/* Linear gradient mask to blend image to the left */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#f4f4f4] via-[#f4f4f4]/60 to-transparent dark:from-[#151718] dark:via-[#151718]/60 dark:to-transparent z-10" />
                            <img
                                src={images[currentIndex].src}
                                alt={images[currentIndex].title}
                                className="w-full h-full object-cover md:object-contain object-right"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 lg:px-20 relative z-20 w-full h-full flex flex-col justify-center">
                <div className="max-w-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col gap-4"
                        >
                            <span className="text-gray-500 font-black uppercase tracking-widest text-sm md:text-base">
                                {images[currentIndex].preTitle}
                            </span>
                            
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-brand-charcoal dark:text-brand-cream uppercase leading-[0.9] tracking-tighter">
                                {images[currentIndex].title}
                            </h1>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-charcoal dark:text-brand-cream mt-2 tracking-tighter">
                                {images[currentIndex].tag} <span className="font-light italic text-gray-500 text-2xl md:text-3xl">DESDE <span className="text-brand-green font-bold not-italic">{images[currentIndex].price}</span></span>
                            </h2>
                            
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md font-medium mt-4 leading-relaxed">
                                {images[currentIndex].subtitle}
                            </p>

                            <div className="mt-8 flex items-center gap-6">
                                <Link to="/catalog" className="bg-brand-charcoal dark:bg-brand-cream text-white dark:text-brand-charcoal px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-brand-green dark:hover:bg-brand-green hover:text-white transition-all shadow-xl hover:shadow-brand-green/30 hover:-translate-y-1">
                                    COMPRAR AHORA
                                </Link>
                                <div className="flex gap-2">
                                    <button onClick={prevSlide} className="w-12 h-12 rounded-full border-2 border-brand-charcoal/10 dark:border-brand-cream/10 flex items-center justify-center text-brand-charcoal dark:text-brand-cream hover:border-brand-green hover:text-brand-green transition-colors">
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <button onClick={nextSlide} className="w-12 h-12 rounded-full border-2 border-brand-charcoal/10 dark:border-brand-cream/10 flex items-center justify-center text-brand-charcoal dark:text-brand-cream hover:border-brand-green hover:text-brand-green transition-colors">
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 z-0 opacity-[0.03] dark:opacity-[0.02]">
                <h1 className="text-[15rem] font-black uppercase tracking-tighter leading-none whitespace-nowrap text-brand-charcoal dark:text-brand-cream transform -rotate-90">
                    ENERGY
                </h1>
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-10 h-2 bg-brand-green' : 'w-2 h-2 bg-brand-charcoal/20 dark:bg-brand-cream/20'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
