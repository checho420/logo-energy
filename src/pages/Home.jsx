import React, { useState, useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    const { products, loading } = useProducts();

    // Stability of selection
    const [randomIds, setRandomIds] = useState([]);
    const [promoIds, setPromoIds] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            // Selected random products for main section
            const availableProducts = products.filter(p => !p.disabled);
            if (randomIds.length === 0) {
                const limit = Math.min(availableProducts.length, 8);
                const ids = [...availableProducts]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, limit)
                    .map(p => p.id);
                setRandomIds(ids);
            }

            // Products on promotion
            const promoProducts = products.filter(p => !p.disabled && p.promotion);
            if (promoIds.length < 4 && promoProducts.length > promoIds.length) {
                const limit = Math.min(promoProducts.length, 4);
                const pIds = [...promoProducts]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, limit)
                    .map(p => p.id);
                setPromoIds(pIds);
            }
        }
    }, [products, randomIds.length, promoIds.length]);

    const displayProducts = useMemo(() => {
        return randomIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);
    }, [randomIds, products]);

    const promoProductsList = useMemo(() => {
        return promoIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);
    }, [promoIds, products]);

    return (
        <div className="bg-brand-cream dark:bg-brand-charcoal overflow-x-hidden transition-colors duration-1000">
            <Hero />

            {/* Intro Stats Section */}
            <section className="py-24 border-b border-brand-charcoal/[0.03] dark:border-white/[0.03]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                        <div className="flex flex-col gap-4">
                            <span className="text-brand-green font-bold text-5xl">98%</span>
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Satisfacción Elite</h4>
                            <p className="text-sm leading-relaxed opacity-60">Nuestros clientes experimentan una transición energética impecable y sofisticada.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-brand-green font-bold text-5xl">25+</span>
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Proyectos Globales</h4>
                            <p className="text-sm leading-relaxed opacity-60">Liderando la industria con infraestructuras de alto rendimiento en toda la región.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-brand-green font-bold text-5xl">0.0</span>
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Huella de Carbono</h4>
                            <p className="text-sm leading-relaxed opacity-60">Compromiso absoluto con la neutralidad climática en cada eslabón de nuestra cadena.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promociones Section */}
            <section className="relative py-32 overflow-hidden bg-brand-charcoal/[0.02] dark:bg-white/[0.01]">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 relative z-10">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 mb-8"
                            >
                                <div className="h-[1px] w-12 bg-brand-red/30" />
                                <span className="text-brand-red font-black tracking-[0.5em] uppercase text-[10px]">
                                    Oportunidades Únicas
                                </span>
                            </motion.div>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.85] text-brand-charcoal dark:text-brand-cream">
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="block"
                                >
                                    en
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="block text-brand-red italic font-light mt-2"
                                >
                                    promoción
                                </motion.span>
                            </h2>
                        </div>
                        <Link to="/sale" className="group flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest border border-brand-charcoal/10 dark:border-white/10 px-10 py-6 rounded-full hover:bg-brand-red hover:border-brand-red hover:text-white transition-all duration-500">
                            Ver Todas las Ofertas
                            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-[2rem] animate-pulse"></div>)
                        ) : (
                            promoProductsList.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </section>

            <section className="relative py-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    {/* Decorative background element for the section */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 relative z-10">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 mb-8"
                            >
                                <div className="h-[1px] w-12 bg-brand-green/30" />
                                <span className="text-brand-green font-black tracking-[0.5em] uppercase text-[10px]">
                                    Catálogo Curado • Edición 2026
                                </span>
                            </motion.div>

                            <h2 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.85] text-brand-charcoal dark:text-brand-cream">
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="block"
                                >
                                    nuestra
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="block text-brand-green italic font-light mt-2"
                                >
                                    tienda
                                </motion.span>
                            </h2>
                        </div>
                        <Link to="/catalog" className="group flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest border border-brand-charcoal/10 dark:border-white/10 px-10 py-6 rounded-full hover:bg-brand-green hover:border-brand-green hover:text-white transition-all duration-500">
                            Ver Selección Completa
                            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-brand-charcoal/5 dark:bg-brand-cream/  5 rounded-[2rem] animate-pulse"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {displayProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-32 bg-brand-charcoal overflow-hidden">
                <div className="container mx-auto px-6 text-center h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto flex flex-col items-center gap-10"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-green">Membresía Energy Elite</span>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tightest text-brand-cream leading-[0.85] italic">
                            El futuro no se espera, <br /> se diseña.
                        </h2>
                        <button className="bg-brand-cream text-brand-charcoal px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-brand-green hover:text-white transition-all shadow-2xl mt-8">
                            Unirse al Programa
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Dynamic Promo Banner */}
            <section className="w-full bg-brand-charcoal overflow-hidden">
                <picture className="w-full">
                    <source media="(max-width: 768px)" srcSet="assets/banners/banner-mobile.jpg" />
                    <img
                        src="assets/banners/banner-desktop.jpg"
                        alt="Promo Luminaria"
                        className="w-full h-auto object-cover"
                    />
                </picture>
            </section>

            {/* WhatsApp Floating */}
            <motion.a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-10 right-10 bg-brand-green text-brand-cream h-16 w-16 rounded-full flex items-center justify-center shadow-2xl z-50 transition-colors"
            >
                <FontAwesomeIcon icon={faWhatsapp} className="text-3xl" />
            </motion.a>
        </div>
    );
};

export default Home;
