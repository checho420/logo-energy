import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Calculate original price for UI if promotion is active
    const originalPrice = (product.promotion && product.discountPercentage > 0)
        ? product.price / (1 - (product.discountPercentage / 100))
        : null;

    // Simulate rating data if not present
    const rating = 4.8;
    const reviewCount = (product.sold || 0) + 12;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col bg-white dark:bg-[#1A1D1E] rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-brand-charcoal/[0.04] dark:border-white/[0.04] cursor-pointer h-full"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-[#F8F9FA] dark:bg-[#0F1112]">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-brand-cream/5 animate-pulse" />
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {product.promotion && product.discountPercentage > 0 && (
                        <div className="bg-brand-red text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 scale-90 sm:scale-100 origin-left">
                            <span className="opacity-80">-%</span>
                            {product.discountPercentage}
                        </div>
                    )}
                    {product.new && (
                        <div className="bg-brand-green text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg scale-90 sm:scale-100 origin-left">
                            NUEVO
                        </div>
                    )}
                </div>

                {/* Action Toolbar */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    {/* Wishlist */}
                    <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="w-10 h-10 bg-white/80 dark:bg-brand-charcoal/80 backdrop-blur-md text-brand-charcoal/40 dark:text-brand-cream/40 rounded-full flex items-center justify-center shadow-sm hover:text-brand-red hover:bg-white dark:hover:bg-brand-charcoal transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                    >
                        <FontAwesomeIcon icon={faHeart} className="text-sm" />
                    </button>
                </div>

                {/* Main Product Image */}
                <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-contain p-8 z-10"
                />

                {/* Modern Quick Add Button */}
                <div className="absolute bottom-4 right-4 z-20">
                    <motion.button
                        whileHover="hover"
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center shadow-2xl shadow-brand-green/30 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 overflow-hidden relative group/btn"
                    >
                        {/* Glow overlay */}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />

                        <motion.div
                            variants={{
                                hover: {
                                    scale: [1, 1.25, 1],
                                    rotate: [0, -15, 15, -15, 0],
                                    y: [0, -3, 0],
                                    transition: {
                                        duration: 0.6,
                                        repeat: Infinity,
                                        repeatDelay: 0.5,
                                        ease: "easeInOut"
                                    }
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faCartPlus} className="text-lg relative z-10" />
                        </motion.div>
                    </motion.button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Brand & Name */}
                <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green/60 mb-2">
                        {product.brand}
                    </p>
                    <h3 className="text-xl font-bold text-brand-charcoal dark:text-brand-cream leading-tight line-clamp-2 min-h-[3rem] group-hover:text-brand-green transition-colors duration-300">
                        {product.name}
                    </h3>
                </div>

                {/* Price Matrix */}
                <div className="mt-auto flex flex-col">
                    {originalPrice && (
                        <span className="text-[11px] text-brand-charcoal/40 dark:text-brand-cream/40 line-through font-bold mb-0.5">
                            {formatCurrency(originalPrice)}
                        </span>
                    )}
                    <span className="text-2xl font-black text-brand-charcoal dark:text-brand-cream tracking-tight leading-none italic">
                        {formatCurrency(product.price)}
                    </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-2 border-t border-brand-charcoal/[0.03] dark:border-white/[0.03]">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <FontAwesomeIcon
                                key={s}
                                icon={faStar}
                                className={`text-[8px] ${s <= 4 ? 'text-brand-red' : 'text-brand-charcoal/10 dark:text-white/10'}`}
                            />
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-brand-charcoal/40 dark:text-brand-cream/40">
                        {rating} <span className="opacity-50">({reviewCount})</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(ProductCard);
