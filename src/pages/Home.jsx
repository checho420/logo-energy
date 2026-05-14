import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSolarPanel, faHardHat, faTools, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CategoryGrid from '../components/CategoryGrid';
import Hero from '../components/Hero';

const Home = () => {
    const { products, loading } = useProducts();
    const [featuredIds, setFeaturedIds] = useState([]);
    const [activeTab, setActiveTab] = useState('featured');

    useEffect(() => {
        if (products.length > 0) {
            const available = products.filter(p => !p.disabled);
            if (featuredIds.length === 0) {
                setFeaturedIds([...available].sort(() => 0.5 - Math.random()).slice(0, 4).map(p => p.id));
            }
        }
    }, [products]);

    const featuredProducts = products.filter(p => featuredIds.includes(p.id));
    const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);
    const displayProducts = activeTab === 'featured' ? featuredProducts : latestProducts;

    return (
        <div className="bg-white dark:bg-brand-charcoal overflow-x-hidden min-h-screen">
            <Hero />

            {/* Features Row - After Hero */}
            <div className="container mx-auto px-6 py-10 border-b border-gray-100 dark:border-white/5 text-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 lg:divide-x divide-gray-100 dark:divide-white/5">
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faSolarPanel} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Energía Solar</h4>
                        <p className="font-sans text-[9px] text-gray-400 dark:text-gray-400 mt-3 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">estaciones de energía, sistemas de respaldo, almacenamiento.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faHardHat} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Obras Civiles</h4>
                        <p className="font-sans text-[9px] text-gray-400 dark:text-gray-400 mt-3 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">apoyo y suministro para proyectos e infraestructura.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faTools} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Ferretería Tecnología</h4>
                        <p className="font-sans text-[9px] text-gray-400 dark:text-gray-400 mt-3 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">soluciones industriales y comerciales, equipos y soluciones operativas.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faTruckFast} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Servicios Logísticos</h4>
                        <p className="font-sans text-[9px] text-gray-400 dark:text-gray-400 mt-3 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">asesoría, acompañamiento y soporte técnico.</p>
                    </div>
                </div>
            </div>

            <CategoryGrid />

            {/* Products Selector Grid */}
            <div className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 text-center md:text-left">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tighter leading-[0.9] mb-6">
                            Nuestra <span className="text-brand-green italic leading-none">Selección</span> <br /> de productos
                        </h2>
                        <div className="flex justify-center md:justify-start gap-8">
                            <button 
                                onClick={() => setActiveTab('featured')}
                                className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'featured' ? 'text-brand-green' : 'text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream'}`}
                            >
                                DESTACADOS
                                {activeTab === 'featured' && <motion.div layoutId="tab-underline" className="absolute -bottom-2 left-0 w-full h-[2px] bg-brand-green" />}
                            </button>
                            <button 
                                onClick={() => setActiveTab('latest')}
                                className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'latest' ? 'text-brand-green' : 'text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream'}`}
                            >
                                NOVEDADES
                                {activeTab === 'latest' && <motion.div layoutId="tab-underline" className="absolute -bottom-2 left-0 w-full h-[2px] bg-brand-green" />}
                            </button>
                        </div>
                    </div>
                    <Link to="/shop" className="text-[10px] font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-[0.3em] border-b-2 border-brand-green pb-2 hover:translate-x-2 transition-transform inline-block">
                        VER TODA LA TIENDA
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <AnimatePresence mode="wait">
                        {displayProducts.map((product, idx) => (
                            <motion.div
                                key={`${activeTab}-${product.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative bg-white dark:bg-[#151718] border border-gray-100 dark:border-white/5 overflow-hidden"
                            >
                                <Link to={`/product/${product.id}`} className="block">
                                    <div className="relative aspect-[4/5] bg-gray-50 dark:bg-black/20 overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-[9px] font-bold text-brand-green uppercase tracking-[0.3em] mb-2 block">{product.category}</span>
                                        <h3 className="text-brand-charcoal dark:text-brand-cream font-black uppercase text-[10px] tracking-widest leading-tight line-clamp-2 mb-4 h-8">{product.name}</h3>
                                        <p className="text-base font-black text-brand-charcoal dark:text-brand-cream tracking-tighter">$ {product.price.toLocaleString('es-CO')}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Home;
