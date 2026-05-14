import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faEye } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/product/${product.id}`)}
            className="group relative flex flex-col bg-white dark:bg-[#1A1D1E] rounded-[2.5rem] transition-all duration-500 cursor-pointer h-full border border-gray-100 dark:border-white/5 hover:shadow-2xl hover:shadow-brand-charcoal/10"
        >
            {/* Image Canvas */}
            <div className="relative aspect-square overflow-hidden bg-[#FBFBFB] dark:bg-[#151718] m-4 rounded-[2rem] flex items-center justify-center p-8">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-brand-cream/10 animate-pulse" />
                )}

                {/* Availability Badge */}
                <div className="absolute top-4 right-4 z-20">
                    <span className="text-[8px] font-black tracking-widest text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                        Disponible
                    </span>
                </div>

                {/* Product Image */}
                <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    animate={{
                        scale: isHovered ? 1.05 : 1,
                        rotate: isHovered ? -2 : 0
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal z-10"
                />
            </div>

            {/* Info Section */}
            <div className="px-8 pb-8 flex flex-col flex-grow">
                <div className="mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.34em] text-brand-green/70">
                        {product.brand}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-brand-charcoal dark:text-brand-cream leading-snug line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Modelo: {String(product.id).padStart(5, '0')}</p>
                </div>

                {/* Price Area */}
                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter">
                            {formatCurrency(product.price)}
                        </span>
                        {originalPrice && (
                            <span className="text-xs font-bold text-brand-red line-through opacity-40">
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                    </div>
                    <p className="text-[9px] font-bold text-brand-green uppercase tracking-widest mt-1">
                        O llévalo en 12 cuotas de {formatCurrency(product.price / 12)}
                    </p>
                </div>

                {/* Action Bar (Updated: Ver detalle + Cart Icon) */}
                <div className="mt-auto flex items-center gap-3">
                    {/* View Details Button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                        className="flex-grow bg-[#F4F4F4] dark:bg-[#252829] text-brand-charcoal dark:text-white h-12 rounded-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-white transition-all shadow-sm"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-sm opacity-60" />
                        Ver detalle
                    </button>

                    {/* Quick Add Icon Button (Fixed Green + Premium Animation) */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="group/btn w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center text-sm transition-all duration-500 hover:scale-115 hover:shadow-[0_0_25px_rgba(59,130,48,0.6)] active:scale-95 relative overflow-hidden"
                        title="Agregar al carrito"
                    >
                        {/* Shimmer Effect on Hover */}
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        
                        <FontAwesomeIcon 
                            icon={faShoppingCart} 
                            className="group-hover/btn:rotate-[-12deg] transition-transform duration-300" 
                        />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(ProductCard);
