import React, { useState, useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faTruck, faUndo, faHeadset, faCreditCard, faSyncAlt, faSolarPanel, faHardHat, faTools, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import CategoryGrid from '../components/CategoryGrid';

const Home = () => {
    const { products, loading } = useProducts();
    const [activeTab, setActiveTab] = useState('featured');

    // Random subsets for generic product blocks
    const [featuredIds, setFeaturedIds] = useState([]);
    const [latestIds, setLatestIds] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const available = products.filter(p => !p.disabled);
            
            if (featuredIds.length === 0) {
                setFeaturedIds([...available].sort(() => 0.5 - Math.random()).slice(0, 4).map(p => p.id));
            }
            if (latestIds.length === 0) {
                setLatestIds([...available].reverse().slice(0, 4).map(p => p.id));
            }
        }
    }, [products, featuredIds.length, latestIds.length]);

    const featuredProducts = featuredIds.map(id => products.find(p => p.id === id)).filter(Boolean);
    const latestProducts = latestIds.map(id => products.find(p => p.id === id)).filter(Boolean);

    const currentTabProducts = activeTab === 'featured' ? featuredProducts : latestProducts;

    return (
        <div className="bg-white dark:bg-[#1A1D1E] overflow-x-hidden min-h-screen">
            <Hero />

            {/* Features Row - After Hero */}
            <div className="container mx-auto px-6 py-10 border-b border-gray-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 lg:divide-x divide-gray-100 dark:divide-white/5">
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faSolarPanel} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Energía Solar</h4>
                        <p className="font-sans text-[9px] text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-widest leading-relaxed max-w-[200px]">estaciones de energía, sistemas de respaldo, almacenamiento.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faHardHat} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Obras Civiles</h4>
                        <p className="font-sans text-[9px] text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-widest leading-relaxed max-w-[200px]">apoyo y suministro para proyectos e infraestructura.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faTools} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Ferretería Tecnología</h4>
                        <p className="font-sans text-[9px] text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-widest leading-relaxed max-w-[200px]">soluciones industriales y comerciales, equipos y soluciones operativas.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 group">
                        <FontAwesomeIcon icon={faTruckFast} className="text-3xl text-[#AC192C] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-brand-charcoal dark:text-brand-cream uppercase text-xs tracking-[0.2em]">Servicios Logísticos</h4>
                        <p className="font-sans text-[9px] text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-widest leading-relaxed max-w-[200px]">asesoría, acompañamiento y soporte técnico.</p>
                    </div>
                </div>
            </div>

            {/* Categories Grid (Reference: Image Design) */}
            <CategoryGrid />

            {/* Products Tabs Section */}
            <div className="container mx-auto px-6 py-10">
                <div className="flex justify-center md:justify-start gap-8 border-b-2 border-gray-100 dark:border-white/10 mb-10 pb-2">
                    <button 
                        onClick={() => setActiveTab('featured')}
                        className={`text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === 'featured' ? 'text-brand-green' : 'text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream'}`}
                    >
                        Productos Destacados
                        {activeTab === 'featured' && <div className="absolute -bottom-[10px] left-0 w-full h-[2px] bg-brand-green" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('latest')}
                        className={`text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === 'latest' ? 'text-brand-green' : 'text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream'}`}
                    >
                        Nuevos Lanzamientos
                        {activeTab === 'latest' && <div className="absolute -bottom-[10px] left-0 w-full h-[2px] bg-brand-green" />}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>)
                    ) : (
                        currentTabProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>

            {/* Info Circles Section */}
            <div className="container mx-auto px-6 py-20 my-10 border-t border-b border-gray-100 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-2 border-brand-green flex items-center justify-center mb-6 text-brand-green">
                            <FontAwesomeIcon icon={faHeadset} className="text-2xl" />
                        </div>
                        <h4 className="font-black text-brand-charcoal dark:text-brand-cream uppercase text-sm tracking-widest mb-4">Atención al Cliente</h4>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                            Resolvemos tus dudas al instante. Soporte técnico dedicado para la instalación y mantenimiento de tus equipos.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-2 border-brand-green flex items-center justify-center mb-6 text-brand-green">
                            <FontAwesomeIcon icon={faCreditCard} className="text-2xl" />
                        </div>
                        <h4 className="font-black text-brand-charcoal dark:text-brand-cream uppercase text-sm tracking-widest mb-4">Pago Seguro</h4>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                            Tus transacciones están protegidas con encriptación de grado militar. Aceptamos múltiples métodos de pago.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-2 border-brand-green flex items-center justify-center mb-6 text-brand-green">
                            <FontAwesomeIcon icon={faSyncAlt} className="text-2xl" />
                        </div>
                        <h4 className="font-black text-brand-charcoal dark:text-brand-cream uppercase text-sm tracking-widest mb-4">Devoluciones Fáciles</h4>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                            Si no estás satisfecho con tu ecosistema energético, tienes un plan de retorno garantizado y sin complicaciones.
                        </p>
                    </div>
                </div>
            </div>

            {/* Big Promo Banner Section (Top Electronic Deals) */}
            <div className="w-full bg-gray-50 dark:bg-[#151718] py-20 px-6">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
                    <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <h2 className="text-3xl md:text-5xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter uppercase mb-4">
                            Súper Ofertas<br />Energéticas
                        </h2>
                    </div>
                    <div className="bg-brand-green text-white px-8 py-3 rounded-none font-black text-2xl uppercase tracking-widest">
                        Mega Sale
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <span className="bg-brand-charcoal text-white px-2 py-1 text-[10px] font-black uppercase">Exclusivo</span>
                            <span className="text-brand-charcoal dark:text-white font-black text-lg">CUPÓN OFF</span>
                        </div>
                        <span className="text-5xl font-black text-brand-red tracking-tighter italic mt-2">-$150k</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-1 bg-brand-charcoal/5 dark:bg-white/5" />

            {/* Bottom 3 Columns (Small Product Lists) */}
            <div className="container mx-auto px-6 py-24 border-t border-gray-100 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
                    {/* Col 1 */}
                    <div>
                        <h5 className="font-black text-brand-charcoal dark:text-white text-sm uppercase tracking-widest border-b border-gray-100 dark:border-white/10 pb-4 mb-8">Puntuación Élite</h5>
                        <div className="flex flex-col gap-6">
                            {featuredProducts.slice(0, 3).map(p => (
                                <Link to={`/product/${p.id}`} key={p.id} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-black/20 rounded-xl overflow-hidden p-2 flex-shrink-0">
                                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[10px] font-bold text-gray-400 group-hover:text-brand-green transition-colors uppercase line-clamp-2">{p.name}</p>
                                        <div className="flex items-center gap-1 mt-1 text-[9px] text-brand-green">
                                            ★★★★<span className="text-gray-300">★</span>
                                        </div>
                                        <span className="text-sm font-black text-brand-charcoal dark:text-white mt-2">${(p.price).toLocaleString('es-CO')}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 */}
                    <div>
                        <h5 className="font-black text-brand-charcoal dark:text-white text-sm uppercase tracking-widest border-b border-gray-100 dark:border-white/10 pb-4 mb-8">Los Más Pro</h5>
                        <div className="flex flex-col gap-6">
                            {latestProducts.slice(0, 3).map(p => (
                                <Link to={`/product/${p.id}`} key={p.id} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-black/20 rounded-xl overflow-hidden p-2 flex-shrink-0">
                                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[10px] font-bold text-gray-400 group-hover:text-brand-green transition-colors uppercase line-clamp-2">{p.name}</p>
                                        <div className="flex items-center gap-1 mt-1 text-[9px] text-brand-green">
                                            ★★★★★
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            {p.promotion && <span className="text-[10px] text-gray-400 line-through">${(p.price * 1.15).toLocaleString('es-CO')}</span>}
                                            <span className="text-sm font-black text-brand-charcoal dark:text-white">${(p.price).toLocaleString('es-CO')}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 */}
                    <div>
                        <h5 className="font-black text-brand-charcoal dark:text-white text-sm uppercase tracking-widest border-b border-gray-100 dark:border-white/10 pb-4 mb-8">Novedades</h5>
                        <div className="flex flex-col gap-6">
                            {featuredProducts.slice(0, 3).reverse().map(p => (
                                <Link to={`/product/${p.id}`} key={p.id} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-black/20 rounded-xl overflow-hidden p-2 flex-shrink-0">
                                        <img src={p.images?.[p.images.length > 1 ? 1 : 0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[10px] font-bold text-gray-400 group-hover:text-brand-green transition-colors uppercase line-clamp-2">{p.name}</p>
                                        <div className="flex items-center gap-1 mt-1 text-[9px] text-brand-green">
                                            ★★★★★
                                        </div>
                                        <span className="text-sm font-black text-brand-charcoal dark:text-white mt-2">${(p.price).toLocaleString('es-CO')}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
