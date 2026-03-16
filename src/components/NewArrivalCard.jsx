import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faCartPlus, faEye, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { formatCurrency } from '../utils/formatters';

const NewArrivalCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleLike } = useProducts();
    const [isHovered, setIsHovered] = useState(false);

    const discount = product.promotion ? (product.discountPercentage || 15) : 0;
    const originalPrice = discount > 0 ? (product.price / (1 - discount / 100)) : null;

    const handleWhatsApp = (e) => {
        e.stopPropagation();
        const message = encodeURIComponent(`Saludos. Requiero información técnica sobre el activo: ${product.name}.`);
        window.open(`https://wa.me/573123456789?text=${message}`, '_blank');
    };

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/product/${product.id}`)}
            className="group relative flex flex-col w-full h-full cursor-pointer bg-white dark:bg-[#151718] rounded-[3.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] border border-brand-charcoal/[0.05] dark:border-white/[0.05] hover:-translate-y-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Media Canvas */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-cream/5 dark:bg-black/20 flex items-center justify-center p-12 transition-colors duration-1000 group-hover:bg-brand-green/5">

                {/* Status Badges */}
                <div className="absolute top-10 left-10 z-10 flex flex-col gap-3">
                    {discount > 0 && (
                        <motion.span
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-brand-green text-brand-cream text-[9px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.3em] shadow-2xl backdrop-blur-md"
                        >
                            -{discount}%
                        </motion.span>
                    )}
                    {product.new && (
                        <motion.span
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-brand-green text-brand-cream text-[9px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.3em] shadow-2xl backdrop-blur-md"
                        >
                            Inédito
                        </motion.span>
                    )}
                </div>

                {/* Intelligence Controls */}
                <div className="absolute top-10 right-10 z-20 flex flex-col gap-5 translate-x-20 group-hover:translate-x-0 transition-transform duration-700 delay-100">
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--brand-green)', color: 'white' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(product.id);
                        }}
                        className={`w-14 h-14 rounded-3xl flex items-center justify-center backdrop-blur-3xl border transition-all duration-700 ${product.isLiked
                            ? 'bg-brand-green border-brand-green text-white shadow-2xl shadow-brand-green/40'
                            : 'bg-white/10 dark:bg-brand-charcoal/30 border-white/20 text-brand-charcoal/40 dark:text-brand-cream/40 hover:border-brand-green'
                            }`}
                    >
                        <FontAwesomeIcon icon={product.isLiked ? faHeart : faHeartRegular} className="text-xl" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--brand-green)', color: 'white' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleWhatsApp}
                        className="w-14 h-14 rounded-3xl bg-white/10 dark:bg-brand-charcoal/30 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-brand-charcoal/40 dark:text-brand-cream/40 transition-all duration-700 hover:border-brand-green"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                    </motion.button>
                </div>

                {/* Object Projection */}
                <motion.div
                    animate={{
                        scale: isHovered ? 1.15 : 1,
                        y: isHovered ? -20 : 0,
                    }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-center p-4"
                >
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                    />
                </motion.div>

                {/* Deployment CTA */}
                <div className="absolute bottom-10 left-0 w-full px-10 z-30 opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-700 delay-200">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="w-full py-6 rounded-3xl bg-brand-green text-brand-cream font-black text-[10px] uppercase tracking-[0.4em] shadow-3xl flex items-center justify-center gap-4 transition-all hover:bg-brand-forest shadow-brand-green/30"
                    >
                        <FontAwesomeIcon icon={faShoppingBag} />
                        <span>¡Lo Quiero Ya!</span>
                    </motion.button>
                </div>
            </div>

            {/* Information Matrix */}
            <div className="flex flex-col p-12 space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.5em] italic">
                            {product.brand || 'Elite Series'}
                        </span>
                        <div className="h-[1px] flex-grow bg-brand-charcoal/[0.05] dark:bg-white/[0.05]" />
                    </div>
                    <h3 className="text-4xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter italic leading-[1] transition-colors group-hover:text-brand-green duration-500">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/20 dark:text-brand-cream/20 block">Inversión</span>
                            <span className="text-5xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter italic leading-none">
                                {formatCurrency(product.price)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`text-[9px] ${i < 4 ? 'text-brand-green' : 'opacity-10'}`}
                                />
                            ))}
                            <span className="text-[9px] text-brand-charcoal/30 dark:text-brand-cream/30 font-black uppercase tracking-widest ml-3 italic">Informe 2026</span>
                        </div>
                    </div>

                    <div className="h-4 w-4 rounded-full border-4 border-brand-green/20 group-hover:bg-brand-green transition-all duration-1000 group-hover:scale-[3]" />
                </div>
            </div>
        </motion.div>
    );
};

export default NewArrivalCard;
