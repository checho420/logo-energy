import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import Skeleton from './Skeleton';

const BestsellerCarousel = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageStates, setImageStates] = useState({});
    const { addToCart } = useCart();

    const handleImageLoad = (productId) => {
        setImageStates(prev => ({ ...prev, [productId]: true }));
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, [products.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
    }, [products.length]);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    if (!products || products.length === 0) return null;

    // We want to show 3 cards: prev, current, next
    const getCardIndex = (offset) => {
        return (currentIndex + offset + products.length) % products.length;
    };

    const visibleIndices = [-1, 0, 1];

    return (
        <div className="relative w-full overflow-hidden py-24 px-4 bg-brand-cream/10 dark:bg-brand-charcoal/20">
            <div className="relative h-[600px] flex items-center justify-center">
                <AnimatePresence initial={false}>
                    {visibleIndices.map((offset) => {
                        const index = getCardIndex(offset);
                        const product = products[index];
                        const isActive = offset === 0;

                        return (
                            <motion.div
                                key={`${product.id}-${offset}`}
                                initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                    x: offset * 300,
                                    zIndex: 0
                                }}
                                animate={{
                                    opacity: isActive ? 1 : 0.4,
                                    scale: isActive ? 1 : 0.75,
                                    x: offset * (window.innerWidth < 1024 ? 0 : 450),
                                    zIndex: isActive ? 30 : 10,
                                    filter: isActive ? 'blur(0px)' : 'blur(4px)',
                                    rotateY: offset * 15,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.8,
                                    x: offset * 300
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 25
                                }}
                                className="absolute w-[340px] md:w-[450px]"
                                style={{ perspective: '1000px' }}
                            >
                                <div className={`
                                    relative bg-white dark:bg-brand-charcoal/80 rounded-[3rem] overflow-hidden 
                                    shadow-2xl border border-brand-charcoal/5 dark:border-brand-cream/5
                                    transition-all duration-700 group
                                    ${isActive ? 'shadow-brand-charcoal/20 dark:shadow-black/60' : ''}
                                `}>
                                    {/* Image Section */}
                                    <div className="relative h-80 overflow-hidden bg-brand-cream/20 dark:bg-brand-charcoal/50">
                                        {!imageStates[product.id] && (
                                            <div className="absolute inset-0 bg-brand-cream/10 animate-pulse" />
                                        )}
                                        <motion.img
                                            src={product.images[0]}
                                            alt={product.name}
                                            onLoad={() => handleImageLoad(product.id)}
                                            animate={{ opacity: imageStates[product.id] ? 1 : 0 }}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                                            <p className="text-brand-cream text-xs font-black uppercase tracking-[0.2em] leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                                                {product.description || 'Calidad premium para un estilo de vida sostenible.'}
                                            </p>
                                        </div>
                                        <AnimatePresence>
                                            {product.new && (
                                                <motion.span
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    className="absolute top-6 left-6 backdrop-blur-xl bg-brand-green/90 text-brand-cream text-[9px] font-black px-5 py-2 rounded-xl uppercase tracking-[0.3em] shadow-lg"
                                                >
                                                    Elite
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.4em] mb-2 block italic">
                                                    {product.brand}
                                                </span>
                                                <h3 className="text-2xl font-black text-brand-charcoal dark:text-brand-cream line-clamp-1 italic tracking-tighter">
                                                    {product.name}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 bg-brand-green/5 dark:bg-brand-green/10 px-3 py-1.5 rounded-xl border border-brand-green/10">
                                                <FontAwesomeIcon icon={faStar} className="text-brand-green text-[10px]" />
                                                <span className="text-[10px] font-black text-brand-green">Top Tier</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-10">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-brand-charcoal/30 dark:text-brand-cream/30 uppercase tracking-[0.3em] mb-1">Inversión Solicitada</span>
                                                <span className="text-3xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter">
                                                    {formatCurrency(product.price)}
                                                </span>
                                            </div>
                                            <div className="flex gap-4">
                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green transition-all duration-300 hover:bg-brand-charcoal/5 active:scale-90"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest">+ Info</span>
                                                </Link>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 hover:bg-brand-green dark:hover:bg-brand-green dark:hover:text-brand-cream shadow-xl active:scale-90"
                                                >
                                                    <FontAwesomeIcon icon={faShoppingCart} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-12 mt-12">
                <button
                    onClick={prevSlide}
                    className="w-14 h-14 rounded-full border border-brand-charcoal/10 dark:border-brand-cream/10 flex items-center justify-center text-brand-charcoal/30 dark:text-brand-cream/30 hover:text-brand-green hover:border-brand-green transition-all duration-500 group active:scale-90"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-4 items-center">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1 rounded-full transition-all duration-700 ${i === currentIndex ? 'w-12 bg-brand-green shadow-[0_0_15px_rgba(62,113,54,0.4)]' : 'w-2 bg-brand-charcoal/10 dark:bg-brand-cream/10 hover:bg-brand-charcoal/30 dark:hover:bg-brand-cream/30'}`}
                        />
                    ))}
                </div>
                <button
                    onClick={nextSlide}
                    className="w-14 h-14 rounded-full border border-brand-charcoal/10 dark:border-brand-cream/10 flex items-center justify-center text-brand-charcoal/30 dark:text-brand-cream/30 hover:text-brand-green hover:border-brand-green transition-all duration-500 group active:scale-90"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default BestsellerCarousel;

