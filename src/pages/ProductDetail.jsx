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
    faStarHalfAlt,
    faChevronRight,
    faShieldAlt,
    faTruck
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, getProductsByCategory, loading, trackView, toggleLike } = useProducts();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    // Track view once when ID changes
    useEffect(() => {
        if (!loading && id) {
            trackView(parseInt(id));
        }
    }, [id, loading, trackView]);

    // Load product data
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
        { label: 'Categoría', value: product?.category || 'Elite Tech' },
        { label: 'Referencia', value: `EN-${(product?.id || 0).toString().padStart(4, '0')}` },
        { label: 'Eficiencia', value: product?.new ? 'Grado A+' : 'Premium Standard' },
        { label: 'Garantía', value: '3 Años de Excelencia' },
        { label: 'Herencia', value: 'Artesanía Sostenible' }
    ], [product]);

    if (loading) return (
        <div className="min-h-screen bg-brand-cream/10 dark:bg-brand-charcoal">
            {/* Header Skeleton */}
            <div className="h-24 border-b border-brand-charcoal/5 dark:border-brand-cream/5" />

            <main className="max-w-7xl mx-auto px-10 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <div className="w-full aspect-square rounded-[3rem] bg-brand-charcoal/5 dark:bg-brand-cream/5 animate-pulse" />
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square rounded-[1.5rem] bg-brand-charcoal/5 dark:bg-brand-cream/5 animate-pulse" />)}
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-6">
                            <div className="h-4 w-32 bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full animate-pulse" />
                            <div className="h-16 w-full bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-2xl animate-pulse" />
                            <div className="h-4 w-3/4 bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full animate-pulse" />
                        </div>
                        <div className="p-10 rounded-[3rem] bg-brand-charcoal/5 dark:bg-brand-cream/5 space-y-8 animate-pulse">
                            <div className="h-12 w-1/2 bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full" />
                            <div className="h-16 w-full bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream/20 dark:bg-brand-charcoal text-brand-charcoal dark:text-brand-cream">
            <h2 className="text-4xl font-black mb-8 italic tracking-tighter">Exploración No Encontrada</h2>
            <button onClick={() => navigate('/catalog')} className="text-brand-green font-black uppercase tracking-[0.4em] text-[10px] hover:tracking-[0.5em] transition-all px-10 py-4 bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-2xl">Reiniciar Búsqueda</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-brand-charcoal pb-32 transition-colors duration-700">
            {/* Top Navigation & Breadcrumbs */}
            <nav className="container mx-auto px-10 py-12">
                <div className="flex flex-wrap items-center justify-between gap-8">
                    <div className="flex items-center space-x-4 text-[9px] font-black uppercase tracking-[0.3em] text-brand-charcoal/30 dark:text-brand-cream/30">
                        <span className="hover:text-brand-green cursor-pointer transition-all" onClick={() => navigate('/')}>Atmósfera</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[7px]" />
                        <span className="hover:text-brand-green cursor-pointer transition-all" onClick={() => navigate('/catalog')}>Colecciones</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[7px]" />
                        <span className="text-brand-charcoal dark:text-brand-cream font-black">{product.name}</span>
                    </div>

                    <div className="flex items-center space-x-8 text-[9px] font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-brand-cream/40 px-6 py-3 rounded-2xl bg-brand-charcoal/5 dark:bg-brand-cream/5">
                        <button className="flex items-center gap-3 hover:text-brand-green transition-all group">
                            <FontAwesomeIcon icon={faExchangeAlt} className="group-hover:rotate-180 transition-transform duration-700" />
                            <span className="hidden sm:inline">Analizar</span>
                        </button>
                        <div className="w-[1px] h-3 bg-brand-charcoal/10 dark:bg-brand-cream/10" />
                        <button className="flex items-center gap-3 hover:text-brand-forest transition-all">
                            <FontAwesomeIcon icon={faShareAlt} />
                            <span className="hidden sm:inline">Difundir</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Left: Gallery Section */}
                    <div className="lg:col-span-12 xl:col-span-7 flex flex-col-reverse md:flex-row gap-10">
                        {/* Vertical Thumbnails */}
                        <div className="flex md:flex-col gap-6 overflow-x-auto md:overflow-visible no-scrollbar pb-4 md:pb-0">
                            {(product.images || []).map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border-2 transition-all duration-500 flex-shrink-0 ${activeImage === idx
                                        ? 'border-brand-green bg-brand-cream dark:bg-brand-charcoal shadow-2xl shadow-brand-green/20'
                                        : 'border-brand-charcoal/5 dark:border-brand-cream/5 opacity-30 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>

                        {/* Main Image View */}
                        <div className="relative flex-grow aspect-square rounded-[4rem] overflow-hidden bg-brand-cream/20 dark:bg-brand-charcoal/50 group border border-brand-charcoal/5 dark:border-brand-cream/5">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={product.images[activeImage]}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Status Badges Overlay */}
                            <div className="absolute top-10 left-10 flex flex-col gap-4 z-10">
                                {product.promotion && (
                                    <span className="backdrop-blur-xl bg-brand-green/90 text-brand-cream text-[9px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                                        Exclusivo -{product.discountPercentage || 15}%
                                    </span>
                                )}
                                {product.bestSeller && (
                                    <span className="backdrop-blur-xl bg-brand-forest/90 text-brand-cream text-[9px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                                        Más Codiciado
                                    </span>
                                )}
                                {product.new && (
                                    <span className="backdrop-blur-xl bg-brand-green/90 text-brand-cream text-[9px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                                        Novedad Elite
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Info Section */}
                    <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.5em] italic">{product.brand}</span>
                            <div className="h-[1px] flex-grow bg-brand-charcoal/5 dark:bg-brand-cream/5" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-brand-charcoal dark:text-brand-cream mb-10 leading-[0.9] tracking-tighter italic lg:pr-10">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-8 mb-12">
                            <div className="flex items-center text-brand-green dark:text-brand-green gap-2">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className={`text-[10px] ${i === 4 ? 'opacity-20' : ''}`} />
                                ))}
                                <span className="ml-4 text-brand-charcoal dark:text-brand-cream text-[10px] font-black px-4 py-1.5 rounded-xl bg-brand-charcoal/5 dark:bg-brand-cream/5 border border-brand-charcoal/5 dark:border-brand-cream/5">4.9 / 5.0</span>
                            </div>
                            <span className="text-[9px] text-brand-charcoal/40 dark:text-brand-cream/40 font-black uppercase tracking-[0.3em] hover:text-brand-green cursor-pointer transition-all border-b border-transparent hover:border-brand-green">24 Informes Técnicos</span>
                        </div>

                        {/* Price Container - Desktop Integrated */}
                        <div className="mb-12 p-10 rounded-[3rem] bg-brand-charcoal/5 dark:bg-brand-cream/5 border border-brand-charcoal/5 dark:border-brand-cream/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-green/5 rounded-full -mr-20 -mt-20 blur-3xl" />

                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-xs font-black text-brand-charcoal/40 dark:text-brand-cream/40 uppercase tracking-widest">Inversión Ética</span>
                                <span className="text-5xl font-black text-brand-green tracking-tighter italic">
                                    {formatCurrency(product.price)}
                                </span>
                            </div>
                            {product.promotion && (
                                <span className="text-sm text-brand-charcoal/30 dark:text-brand-cream/30 line-through font-black italic ml-28">
                                    {formatCurrency(product.price / (1 - (product.discountPercentage || 15) / 100))}
                                </span>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addToCart(product)}
                                    className="col-span-1 bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal font-black py-6 rounded-[1.5rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-brand-green dark:hover:bg-brand-green dark:hover:text-brand-cream group"
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} className="group-hover:rotate-12 transition-transform" />
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Adquirir</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleLike(product.id)}
                                    className={`col-span-1 rounded-[1.5rem] border-2 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all ${product.isLiked
                                        ? 'bg-brand-green/10 border-brand-green text-brand-green shadow-2xl shadow-brand-green/20'
                                        : 'border-brand-charcoal/10 dark:border-brand-cream/10 text-brand-charcoal/30 dark:text-brand-cream/30 hover:border-brand-green hover:text-brand-green'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={product.isLiked ? faHeart : faHeartRegular} className="text-sm" />
                                    <span>Lista Elite</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Technical Attributes */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-black text-brand-charcoal/30 dark:text-brand-cream/30 uppercase tracking-[0.4em] mb-4">Arquitectura del Objeto</p>
                            {mockCharacteristics.map((char, i) => (
                                <div key={i} className="flex items-center justify-between group py-1">
                                    <span className="text-[10px] text-brand-charcoal/50 dark:text-brand-cream/50 font-black uppercase tracking-widest">{char.label}</span>
                                    <div className="mx-6 h-[1px] flex-grow border-b border-dashed border-brand-charcoal/10 dark:border-brand-cream/20 group-hover:border-brand-green transition-colors duration-500" />
                                    <span className="text-sm text-brand-charcoal dark:text-brand-cream font-black italic tracking-tight">{char.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex gap-10 items-center">
                            <div className="flex items-center gap-3 text-brand-charcoal/30 dark:text-brand-cream/30">
                                <FontAwesomeIcon icon={faTruck} className="text-brand-green" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Logística Zero-E <br /><span className="text-brand-green">Garantizada</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-brand-charcoal/30 dark:text-brand-cream/30">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-brand-forest" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Protección <br /><span className="text-brand-forest">Cifrada</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Tabs Section */}
                <div className="mt-40">
                    <div className="flex border-b border-brand-charcoal/5 dark:border-brand-cream/5 mb-20 overflow-x-auto no-scrollbar gap-16 justify-center">
                        {[
                            { id: 'description', label: 'Evolución' },
                            { id: 'specifications', label: 'Ingeniería' },
                            { id: 'reviews', label: 'Auditoría' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-8 text-[10px] font-black uppercase tracking-[0.5em] relative transition-all duration-500 ${activeTab === tab.id ? 'text-brand-green opacity-100' : 'text-brand-charcoal/30 dark:text-brand-cream/30 hover:opacity-100'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-green rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="text-brand-charcoal/60 dark:text-brand-cream/60 leading-relaxed"
                            >
                                {activeTab === 'description' && (
                                    <div className="space-y-12 text-center md:px-20">
                                        <p className="text-3xl md:text-5xl text-brand-charcoal dark:text-brand-cream font-black italic tracking-tighter leading-none">
                                            Una convergencia entre <br /> <span className="text-brand-green">conciencia y distinción.</span>
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-16 text-left">
                                            <p className="text-lg font-black tracking-tight leading-relaxed italic border-l-4 border-brand-green pl-10">
                                                {product.description || 'Sin descripción detallada disponible.'}. Esta pieza ha sido concebida para redefinir los estándares de lujo contemporáneo, fusionando tecnología de precisión con una ética de fabricación implacable.
                                            </p>
                                            <p className="text-base font-medium opacity-80 py-4">
                                                Cada material empleado ha sido seleccionado bajo criterios de biocompabilidad y ciclo de vida circular. El compromiso de LOGO Energy es trascender el consumo masivo, ofreciendo piezas que no solo satisfacen necesidades, sino que cuentan una historia de impacto positivo y elegancia audaz.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'specifications' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {(product.specifications && product.specifications.length > 0 ? product.specifications : [...mockCharacteristics, ...mockCharacteristics]).map((spec, i) => (
                                            <div key={i} className="p-10 rounded-[2.5rem] bg-brand-charcoal/5 dark:bg-brand-cream/5 border border-brand-charcoal/5 dark:border-brand-cream/5 space-y-4 hover:border-brand-green transition-colors duration-700">
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-green italic">{spec.label}</p>
                                                <p className="text-2xl font-black italic text-brand-charcoal dark:text-brand-cream tracking-tight">{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-12">
                                        {product.reviews && product.reviews.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                {product.reviews.map((review, i) => (
                                                    <div key={i} className="bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-[3rem] p-10 border border-brand-charcoal/5 dark:border-brand-cream/5 transition-all hover:shadow-2xl hover:shadow-brand-charcoal/5">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div>
                                                                <p className="font-black italic text-brand-charcoal dark:text-brand-cream uppercase tracking-tight text-xl leading-none">{review.user}</p>
                                                                <p className="text-[9px] text-brand-charcoal/30 dark:text-brand-cream/30 font-black uppercase tracking-widest mt-2">{review.date}</p>
                                                            </div>
                                                            <div className="flex gap-1.5 text-brand-green text-[10px]">
                                                                {[...Array(5)].map((_, starIdx) => (
                                                                    <FontAwesomeIcon
                                                                        key={starIdx}
                                                                        icon={faStar}
                                                                        className={starIdx < review.rating ? 'opacity-100' : 'opacity-10'}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-base italic leading-relaxed text-brand-charcoal/80 dark:text-brand-cream/80 font-medium">"{review.comment}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-brand-charcoal/2 dark:bg-brand-cream/5 rounded-[4rem] p-20 border-2 border-dashed border-brand-charcoal/10 dark:border-brand-cream/10 text-center flex flex-col items-center">
                                                <div className="flex gap-4 text-brand-charcoal/5 dark:text-brand-cream/10 text-5xl mb-10">
                                                    <FontAwesomeIcon icon={faStar} />
                                                    <FontAwesomeIcon icon={faStar} />
                                                    <FontAwesomeIcon icon={faStar} />
                                                </div>
                                                <h4 className="text-2xl font-black italic text-brand-charcoal dark:text-brand-cream mb-4 uppercase tracking-tighter">Expediente de Feedback Vacío</h4>
                                                <p className="text-sm font-black uppercase tracking-widest opacity-40 mb-12">Sé el primero en auditar esta experiencia.</p>
                                                <button className="bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal text-[10px] font-black uppercase tracking-[0.4em] px-16 py-6 rounded-[2rem] hover:bg-brand-green dark:hover:bg-brand-green dark:hover:text-brand-cream transition-all shadow-xl">Registrar Opinión</button>
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
                    <section className="mt-48 pt-40 border-t border-brand-charcoal/5 dark:border-brand-cream/5">
                        <div className="flex items-end justify-between mb-24">
                            <div>
                                <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.5em] mb-6 italic">Sinergias Sugeridas</p>
                                <h3 className="text-5xl md:text-7xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter leading-none">Ecosistema <br /><span className="text-brand-green">Relacionado</span></h3>
                            </div>
                            <button onClick={() => navigate('/catalog')} className="hidden md:block text-[10px] font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-[0.4em] px-12 py-5 rounded-[1.5rem] border-2 border-brand-charcoal/10 dark:border-brand-cream/10 hover:bg-brand-green hover:border-brand-green hover:text-brand-cream transition-all">Explorar Todo</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
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

