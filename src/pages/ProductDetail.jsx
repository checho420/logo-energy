import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faHeart,
    faShareAlt,
    faExchangeAlt,
    faStar,
    faChevronRight,
    faShieldAlt,
    faTruck
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../utils/formatters';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, getProductsByCategory, loading, trackView, toggleLike } = useProducts();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        if (!loading && id) {
            trackView(parseInt(id));
        }
    }, [id, loading, trackView]);

    useEffect(() => {
        if (!loading) {
            const found = getProductById(id);
            if (found && !found.disabled) {
                setProduct(found);
                const related = getProductsByCategory(found.category)
                    .filter(p => p.id !== found.id && !p.disabled)
                    .slice(0, 4);
                setRelatedProducts(related);
            } else {
                setProduct(null);
            }
        }
    }, [id, loading, getProductById, getProductsByCategory]);

    const mockCharacteristics = useMemo(() => [
        { label: 'Categoría', value: product?.category || 'General' },
        { label: 'Referencia', value: `EN-${(product?.id || 0).toString().padStart(4, '0')}` },
        { label: 'Garantía', value: '1 Año de Garantía' }
    ], [product]);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-[#151718] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#151718] text-brand-charcoal dark:text-brand-cream">
            <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase">Producto no encontrado</h2>
            <button onClick={() => navigate('/catalog')} className="text-white hover:bg-brand-green transition-all px-10 py-4 bg-brand-charcoal rounded-none uppercase font-bold tracking-widest text-sm">Volver al catálogo</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-[#151718] pb-32 transition-colors duration-700">
            {/* Breadcrumbs */}
            <div className="bg-[#f4f4f4] dark:bg-[#1f2122] py-4">
                <div className="container mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        <span className="hover:text-brand-green cursor-pointer transition-all" onClick={() => navigate('/')}>Home</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[8px]" />
                        <span className="hover:text-brand-green cursor-pointer transition-all" onClick={() => navigate('/catalog')}>Tienda</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[8px]" />
                        <span className="text-brand-charcoal dark:text-brand-cream">{product.name}</span>
                    </div>

                    <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                        <button className="flex items-center gap-2 hover:text-brand-green transition-all">
                            <FontAwesomeIcon icon={faShareAlt} />
                            <span>Compartir</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 md:px-12 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Gallery */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
                            {(product.images || []).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-24 flex-shrink-0 bg-[#f4f4f4] dark:bg-[#1f2122] p-2 transition-all duration-300 ${activeImage === idx
                                        ? 'border-2 border-brand-green opacity-100'
                                        : 'border-2 border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image View */}
                        <div className="relative flex-grow aspect-square bg-[#f4f4f4] dark:bg-[#1f2122] flex items-center justify-center p-8 group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={product.images[activeImage]}
                                    alt={product.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                />
                            </AnimatePresence>

                            {/* Tags */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                {product.promotion && (
                                    <span className="bg-brand-red text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                                        OFERTA -{product.discountPercentage || 15}%
                                    </span>
                                )}
                                {product.new && (
                                    <span className="bg-brand-green text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                                        NUEVO
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Section */}
                    <div className="lg:col-span-5 flex flex-col">
                        <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            {product.brand}
                            {product.bestSeller && (
                                <span className="bg-brand-charcoal text-white text-[9px] px-2 py-0.5 rounded-full ml-2">MÁS VENDIDO</span>
                            )}
                        </span>
                        
                        <h1 className="text-4xl md:text-5xl font-black text-brand-charcoal dark:text-brand-cream mb-6 uppercase tracking-tighter leading-none">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex text-brand-green gap-1 text-sm">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className={i === 4 ? 'opacity-30' : ''} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">(24 reseñas)</span>
                        </div>

                        {/* Price Area */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter">
                                    {formatCurrency(product.price)}
                                </span>
                                {product.promotion && (
                                    <span className="text-xl text-brand-red line-through font-bold">
                                        {formatCurrency(product.price / (1 - (product.discountPercentage || 15) / 100))}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-brand-green font-bold uppercase tracking-widest mt-2">Envío gratis disponible</p>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            {product.description || 'Este producto combina eficiencia y diseño moderno. Perfecto para potenciar tu ecosistema energético con la mayor confiabilidad.'}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-auto mb-8">
                            <button
                                onClick={() => addToCart(product)}
                                className="flex-grow bg-brand-charcoal dark:bg-brand-cream text-white dark:text-brand-charcoal font-black uppercase tracking-widest text-sm py-5 px-8 hover:bg-brand-green dark:hover:bg-brand-green hover:text-white transition-colors flex items-center justify-center gap-3 shadow-lg"
                            >
                                <FontAwesomeIcon icon={faShoppingCart} />
                                Añadir al Carrito
                            </button>

                            <button
                                onClick={() => toggleLike(product.id)}
                                className={`w-16 h-16 border-2 flex items-center justify-center transition-all ${product.isLiked
                                    ? 'border-brand-red text-brand-red'
                                    : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-brand-red hover:text-brand-red'
                                    }`}
                            >
                                <FontAwesomeIcon icon={product.isLiked ? faHeart : faHeartRegular} className="text-xl" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3 text-gray-500">
                                <FontAwesomeIcon icon={faTruck} className="text-brand-green text-xl" />
                                <span className="text-xs font-bold uppercase tracking-widest">Despacho Inmediato</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-brand-green text-xl" />
                                <span className="text-xs font-bold uppercase tracking-widest">Compra Segura</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Tabs */}
                <div className="mt-32">
                    <div className="flex border-b border-gray-200 dark:border-gray-800 mb-12 gap-12 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'description', label: 'Descripción' },
                            { id: 'specifications', label: 'Especificaciones' },
                            { id: 'reviews', label: 'Reseñas' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-brand-green' : 'text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="productTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[200px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-gray-600 dark:text-gray-400"
                            >
                                {activeTab === 'description' && (
                                    <div className="max-w-4xl space-y-6 leading-relaxed">
                                        <p>{product.description || 'Diseño y funcionalidad se unen en este excelente producto.'}</p>
                                        <p>Todos nuestros productos cuentan con certificados de eficiencia energética y están construidos con materiales de primer nivel para asegurar una larga vida útil y el mejor rendimiento del mercado.</p>
                                    </div>
                                )}
                                {activeTab === 'specifications' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12 max-w-5xl">
                                        {(product.specifications && product.specifications.length > 0 ? product.specifications : mockCharacteristics).map((spec, i) => (
                                            <div key={i} className="flex justify-between py-4 border-b border-gray-100 dark:border-gray-800">
                                                <span className="text-sm font-bold uppercase tracking-widest text-gray-400">{spec.label}</span>
                                                <span className="text-sm font-bold text-brand-charcoal dark:text-brand-cream">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="max-w-4xl">
                                        {product.reviews && product.reviews.length > 0 ? (
                                            <div className="space-y-8">
                                                {product.reviews.map((review, i) => (
                                                    <div key={i} className="bg-[#f4f4f4] dark:bg-[#1f2122] p-8">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div className="flex gap-1 text-brand-green text-sm">
                                                                {[...Array(5)].map((_, starIdx) => (
                                                                    <FontAwesomeIcon key={starIdx} icon={faStar} className={starIdx < review.rating ? 'opacity-100' : 'opacity-20'} />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{review.date}</span>
                                                        </div>
                                                        <h4 className="font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-widest mb-2">{review.user}</h4>
                                                        <p className="text-gray-600 dark:text-gray-400 italic">"{review.comment}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 bg-[#f4f4f4] dark:bg-[#1f2122]">
                                                <p className="text-gray-500 font-bold uppercase tracking-widest mb-4">Aún no hay reseñas para este producto.</p>
                                                <button className="bg-brand-charcoal dark:bg-brand-cream text-white dark:text-brand-charcoal px-8 py-3 uppercase text-xs font-black tracking-widest hover:bg-brand-green transition-colors">Sé el primero en opinar</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-32 pt-20 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-3xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tight">Productos Relacionados</h3>
                            <button onClick={() => navigate('/catalog')} className="text-xs font-black text-brand-green uppercase tracking-widest hover:text-brand-charcoal transition-colors">Ver todos →</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default ProductDetail;

