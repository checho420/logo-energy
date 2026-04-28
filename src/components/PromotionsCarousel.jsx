import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const promos = [
    {
        id: 1,
        title: "Luminarias Solares",
        amount: "$100.000",
        image: "assets/products/luminary-front-300.jpg",
        color: "brand-green"
    },
    {
        id: 2,
        title: "Estaciones de Energía",
        amount: "$300.000",
        image: "assets/products/estacion-frente.jpg",
        color: "brand-green"
    },
    {
        id: 3,
        title: "Power Banks Elite",
        amount: "$50.000",
        image: "assets/products/battery-front.jpg",
        color: "brand-green"
    },
    {
        id: 4,
        title: "Ventiladores Solares",
        amount: "$80.000",
        image: "assets/products/fan-front.png",
        color: "brand-green"
    },
    {
        id: 5,
        title: "Iluminación Premium",
        amount: "$40.000",
        image: "assets/products/lamp-front-2.jpg",
        color: "brand-green"
    }
];

const PromotionsCarousel = ({ title, subLabel, promos = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, promos.length - itemsPerPage);

    const next = () => {
        setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : 0));
    };

    const prev = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
    };

    if (!promos || promos.length === 0) return null;

    return (
        <section className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="text-brand-green font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">{subLabel || 'Selección Exclusiva'}</span>
                    <h2 className="text-4xl md:text-5xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tighter italic">{title}</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prev}
                        className="w-14 h-14 rounded-full border border-brand-charcoal/10 dark:border-brand-cream/10 flex items-center justify-center text-brand-charcoal dark:text-brand-cream hover:bg-brand-charcoal hover:text-white dark:hover:bg-brand-cream dark:hover:text-brand-charcoal transition-all duration-500"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                        onClick={next}
                        className="w-14 h-14 rounded-full border border-brand-charcoal/10 dark:border-brand-cream/10 flex items-center justify-center text-brand-charcoal dark:text-brand-cream hover:bg-brand-charcoal hover:text-white dark:hover:bg-brand-cream dark:hover:text-brand-charcoal transition-all duration-500"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <motion.div
                    className="flex gap-8"
                    animate={{ x: `calc(-${currentIndex * (100 / itemsPerPage)}% - ${currentIndex * (32 / itemsPerPage)}px)` }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                >
                    {promos.map((promo, idx) => (
                        <div
                            key={promo.id || idx}
                            style={{ minWidth: `calc(${(100 / itemsPerPage)}% - ${(32 * (itemsPerPage - 1)) / itemsPerPage}px)` }}
                            className="bg-[#f8f9fa] dark:bg-white/5 rounded-3xl overflow-hidden group flex flex-col items-center p-12 relative h-[500px] border border-transparent hover:border-brand-green/20 transition-all duration-700"
                        >
                            <img
                                src={promo.image}
                                alt={promo.title}
                                className="h-64 object-contain mb-12 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-1000 ease-out"
                            />

                            <div className="bg-brand-charcoal dark:bg-[#050505] text-white w-full absolute bottom-0 left-0 p-8 text-center transition-transform duration-700 group-hover:bg-brand-green">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-20 h-1 bg-brand-green group-hover:bg-white transition-colors" />
                                <p className="text-[10px] uppercase tracking-[0.4em] text-brand-green group-hover:text-white font-black mb-2 transition-colors">Ahorra hasta</p>
                                <h3 className="text-4xl font-black italic tracking-tighter mb-1">{promo.amount}</h3>
                                <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">en {promo.title}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {maxIndex > 0 && (
                <div className="flex justify-center gap-3 mt-12">
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-12 h-1.5 bg-brand-green' : 'w-1.5 h-1.5 bg-brand-charcoal/20 dark:bg-brand-cream/20'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PromotionsCarousel;
