import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlus, faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { formatCurrency } from '../utils/formatters';

/**
 * ModernNoveltyCard
 * A "Sleek Industrial" design proposal. 
 * Focuses on negative space, sharp typography, and high-end animations.
 */
const ModernNoveltyCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleLike } = useProducts();
    const [isHovered, setIsHovered] = useState(false);

    const discount = product.promotion ? (product.discountPercentage || 15) : 0;
    const originalPrice = discount > 0 ? (product.price / (1 - discount / 100)) : null;

    return (
        <motion.div
            layout
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/product/${product.id}`)}
            className="relative flex flex-col w-full group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* The Canvas - Clean & Borderless Look */}
            <div className="relative aspect-[4/5] w-full bg-[#f8f8f8] dark:bg-[#0f0f0f] rounded-[3rem] overflow-hidden transition-all duration-700 group-hover:bg-white dark:group-hover:bg-[#151515] group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)]">

                {/* Floating Meta */}
                <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        {discount > 0 && (
                            <span className="bg-black dark:bg-[#E5FF00] text-white dark:text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                                Sale
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
                            <FontAwesomeIcon icon={faStar} className="text-[#E5FF00] text-[8px]" />
                            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">{product.rating || '5.0'}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(product.id);
                        }}
                        className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all duration-300 ${product.isLiked
                                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-400'
                            }`}
                    >
                        <FontAwesomeIcon icon={product.isLiked ? faHeart : faHeartRegular} className="text-lg" />
                    </motion.button>
                </div>

                {/* Main Product Showcase */}
                <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-16">
                    <motion.div
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            y: isHovered ? -20 : 0,
                            rotate: isHovered ? -2 : 0
                        }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                    >
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_45px_70px_rgba(0,0,0,0.4)]"
                        />
                    </motion.div>
                </div>

                {/* Bottom Action Bar - Appears on Hover */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/60 to-transparent"
                            />
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between overflow-hidden">
                        <motion.div
                            animate={{ y: isHovered ? 0 : 100 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="pointer-events-auto"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                }}
                                className="h-14 w-14 bg-white dark:bg-[#E5FF00] text-black rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-xl" />
                            </button>
                        </motion.div>

                        <motion.button
                            animate={{ x: isHovered ? 0 : 150 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="pointer-events-auto flex items-center gap-3 px-6 h-14 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl"
                        >
                            Detalle <FontAwesomeIcon icon={faArrowRight} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Typography Section */}
            <div className="mt-8 flex flex-col gap-1 px-4">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-gray-100 dark:bg-white/10" />
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
                        {product.brand || 'Original'}
                    </span>
                </div>

                <div className="flex flex-col mt-4">
                    <h3 className="text-xl lg:text-2xl font-medium text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-500 leading-tight">
                        {product.name}
                    </h3>
                    <div className="flex items-baseline gap-4 mt-3">
                        <span className="text-3xl font-light text-gray-950 dark:text-white tracking-widest">
                            {formatCurrency(product.price)}
                        </span>
                        {originalPrice && (
                            <span className="text-base text-gray-400 line-through decoration-[#E5FF00] decoration-2">
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ModernNoveltyCard;
