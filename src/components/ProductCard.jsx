import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const originalPrice = (product.promotion && product.discountPercentage > 0)
        ? product.price / (1 - (product.discountPercentage / 100))
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/product/${product.id}`)}
            className="group relative flex flex-col bg-white dark:bg-[#1A1D1E] transition-all duration-700 cursor-pointer h-full border border-gray-100 dark:border-white/5"
        >
            {/* 1. Image Canvas */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#FBFBFB] dark:bg-[#151718] flex items-center justify-center p-10">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-brand-cream/10 animate-pulse" />
                )}

                {/* Status Badges */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    {product.new && (
                        <span className="text-[9px] font-black tracking-[0.3em] text-brand-green bg-white/90 dark:bg-brand-charcoal/90 px-3 py-1.5 shadow-sm uppercase">
                            New Arrival
                        </span>
                    )}
                    {product.promotion && (
                        <span className="text-[9px] font-black tracking-[0.3em] text-white bg-brand-red px-3 py-1.5 shadow-sm uppercase">
                            -{product.discountPercentage}%
                        </span>
                    )}
                </div>

                {/* Wishlist Icon */}
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute top-6 right-6 z-20 text-brand-charcoal/20 dark:text-white/20 hover:text-brand-red dark:hover:text-brand-red transition-colors duration-300"
                >
                    <FontAwesomeIcon icon={faHeart} className="text-lg" />
                </button>

                {/* Product Image with Kinetic Zoom */}
                <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    animate={{
                        scale: isHovered ? 1.05 : 1,
                        y: isHovered ? -10 : 0,
                        filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
                    }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal z-10 drop-shadow-2xl"
                />

                {/* Hover Reveal Button */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.button
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            className="absolute bottom-0 left-0 w-full bg-brand-charcoal dark:bg-brand-cream text-white dark:text-brand-charcoal py-5 flex items-center justify-center gap-3 z-30 font-black text-[10px] tracking-[0.4em] uppercase"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Añadir al Carrito
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. Info Detail Section */}
            <div className="p-8 flex flex-col flex-grow bg-white dark:bg-[#1A1D1E]">
                {/* Brand Header */}
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-brand-green/70">
                        {product.brand}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600">
                        SKU: {String(product.id).padStart(5, '0')}
                    </span>
                </div>

                {/* Product Title */}
                <h3 className="text-xl font-medium tracking-tight text-brand-charcoal dark:text-brand-cream leading-[1.2] mb-6 line-clamp-2 min-h-[3rem] transition-colors duration-500 group-hover:text-brand-green">
                    {product.name}
                </h3>

                {/* Pricing & CTA */}
                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        {originalPrice && (
                            <span className="text-[10px] font-bold text-brand-red line-through mb-1 opacity-60">
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                        <span className="text-2xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter leading-none">
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 group/btn cursor-pointer">
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-charcoal/40 dark:text-white/40 group-hover/btn:text-brand-green transition-colors">
                            Ver Detalles
                        </span>
                        <div className="w-6 h-[1px] bg-brand-charcoal/20 dark:bg-white/20 group-hover/btn:w-10 group-hover/btn:bg-brand-green transition-all" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(ProductCard);
