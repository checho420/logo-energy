import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFilter,
    faChevronDown,
    faTimes,
    faStar as faStarSolid,
    faBorderAll,
    faPlug,
    faSun,
    faHammer,
    faBatteryFull
} from '@fortawesome/free-solid-svg-icons';

import { useLocation } from 'react-router-dom';

const Shop = () => {
    const { products, loading } = useProducts();
    const location = useLocation();

    // Map URL slug back to UI Label
    const getInitialCategory = () => {
        const params = new URLSearchParams(location.search);
        const catParam = params.get('category');
        if (!catParam) return 'Todos';
        
        const mapping = {
            'electrodomesticos': 'Electrodomésticos',
            'energia-solar': 'Energía Solar',
            'ferreteria': 'Ferretería',
            'estaciones': 'Estaciones Pro'
        };
        return mapping[catParam] || 'Todos';
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(getInitialCategory());
    const [selectedBrand, setSelectedBrand] = useState('Todas');
    const [priceRange, setPriceRange] = useState({ min: 0, max: '' });
    const [sortBy, setSortBy] = useState('Popularidad');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    // Sync when URL changes
    useEffect(() => {
        setSelectedCategory(getInitialCategory());
    }, [location.search]);

    // Categories and brands for filters
    const categoryOptions = [
        { label: 'Todos', icon: faBorderAll },
        { label: 'Electrodomésticos', icon: faPlug },
        { label: 'Energía Solar', icon: faSun },
        { label: 'Ferretería', icon: faHammer },
        { label: 'Estaciones Pro', icon: faBatteryFull }
    ];
    const brands = useMemo(() => ['Todas', ...new Set(products.map(p => p.brand))], [products]);

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => !p.disabled);

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            result = result.filter(p =>
                (p.name || '').toLowerCase().includes(query) ||
                (p.brand || '').toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== 'Todos') {
            result = result.filter(p => {
                const productCat = (p.category || '').toLowerCase();
                const selected = selectedCategory.toLowerCase();

                if (selected === 'electrodomésticos') return productCat.includes('ventilador');
                if (selected === 'energía solar') return productCat.includes('iluminacion') || productCat.includes('iluminación') || productCat.includes('luminaria');
                if (selected === 'estaciones pro') return productCat.includes('generador') || productCat.includes('bateria') || productCat.includes('batería');
                if (selected === 'ferretería') return productCat.includes('herramienta') || productCat.includes('ferre');
                
                return productCat === selected;
            });
        }

        if (selectedBrand !== 'Todas') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        const minP = parseFloat(priceRange.min) || 0;
        const maxP = priceRange.max === '' ? Infinity : (parseFloat(priceRange.max) || Infinity);
        result = result.filter(p => {
            const price = parseFloat(p.price) || 0;
            return price >= minP && price <= maxP;
        });

        const sortedResult = [...result];
        if (sortBy === 'Precio: Menor a Mayor') {
            sortedResult.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        } else if (sortBy === 'Precio: Mayor a Menor') {
            sortedResult.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        } else if (sortBy === 'Nombre') {
            sortedResult.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else {
            sortedResult.sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0));
        }

        return sortedResult;
    }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, sortBy]);

    // Group products by category for the sectioned layout
    const sectionedProducts = useMemo(() => {
        const groups = {};
        categoryOptions.forEach(cat => {
            if (cat.label === 'Todos') return;
            const filteredForCat = products.filter(p => {
                const productCat = (p.category || '').toLowerCase();
                const target = cat.label.toLowerCase();
                
                if (target === 'electrodomésticos') return productCat.includes('ventilador');
                if (target === 'energía solar') return productCat.includes('iluminacion') || productCat.includes('iluminación') || productCat.includes('luminaria');
                if (target === 'estaciones pro') return productCat.includes('generador') || productCat.includes('bateria') || productCat.includes('batería');
                if (target === 'ferretería') return productCat.includes('herramienta') || productCat.includes('ferre');
                
                return productCat === target;
            });
            if (filteredForCat.length > 0) {
                groups[cat.label] = filteredForCat;
            }
        });
        return groups;
    }, [products, categoryOptions]);

    return (
        <div className="min-h-screen bg-[#FBFBFB] dark:bg-[#0F1112] pb-24 transition-colors duration-700">
            {/* Header / Subheader */}
            <div className="bg-white dark:bg-[#1A1D1E] py-12 px-6 border-b border-gray-100 dark:border-white/5">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tight mb-2">Tienda Oficial</h1>
                    <p className="text-gray-400 text-sm font-medium">Soluciones energéticas de vanguardia para tu hogar e industria.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Mobile Category Scroller (Only visible on small screens) */}
                <div className="lg:hidden -mx-6 mb-8 px-6 overflow-x-auto no-scrollbar flex items-center gap-3 snap-x">
                    {categoryOptions.map(cat => (
                        <button
                            key={cat.label}
                            onClick={() => setSelectedCategory(cat.label)}
                            className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl transition-all snap-start ${selectedCategory === cat.label
                                ? 'bg-brand-green text-white shadow-lg'
                                : 'bg-white dark:bg-[#1A1D1E] text-brand-charcoal/60 dark:text-white/60 border border-gray-100 dark:border-white/5'
                                }`}
                        >
                            <FontAwesomeIcon icon={cat.icon} className="text-sm" />
                            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Sidebar Flotante (Desktop Only) */}
                    <aside className="hidden lg:block lg:w-80 flex-shrink-0">
                        <div className="sticky top-32 bg-white dark:bg-[#1A1D1E] p-6 rounded-[2rem] shadow-xl shadow-brand-charcoal/5 dark:shadow-none border border-gray-100 dark:border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-white/40 mb-8 px-4">Categorías</h3>
                            <div className="space-y-2">
                                {categoryOptions.map(cat => (
                                    <button
                                        key={cat.label}
                                        onClick={() => setSelectedCategory(cat.label)}
                                        className={`flex items-center justify-between w-full px-6 py-4 rounded-3xl transition-all duration-300 group ${selectedCategory === cat.label
                                            ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30'
                                            : 'text-brand-charcoal/60 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <FontAwesomeIcon 
                                                icon={cat.icon} 
                                                className={`text-lg ${selectedCategory === cat.label ? 'text-white' : 'text-brand-green'}`} 
                                            />
                                            <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${selectedCategory === cat.label ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                                            {cat.label === 'Todos' 
                                                ? products.length 
                                                : (Object.values(sectionedProducts).find((_, i) => Object.keys(sectionedProducts)[i] === cat.label)?.length || 0)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Contenido Principal por Secciones */}
                    <div className="flex-grow space-y-12">
                        {selectedCategory === 'Todos' ? (
                            Object.entries(sectionedProducts).map(([category, items]) => (
                                <section key={category} className="bg-white dark:bg-[#1A1D1E] p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-brand-green/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-brand-green">
                                                <FontAwesomeIcon icon={categoryOptions.find(c => c.label === category)?.icon || faBorderAll} className="text-sm lg:text-xl" />
                                            </div>
                                            <h2 className="text-lg lg:text-2xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tighter">{category}</h2>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:border-brand-green hover:text-brand-green transition-all">
                                                <FontAwesomeIcon icon={faChevronDown} className="rotate-90 text-[10px]" />
                                            </button>
                                            <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:border-brand-green hover:text-brand-green transition-all">
                                                <FontAwesomeIcon icon={faChevronDown} className="-rotate-90 text-[10px]" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Product Scroll (Horizontal on Mobile, Grid on Desktop) */}
                                    <div className="flex lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible no-scrollbar snap-x -mx-2 px-2 pb-4">
                                        {items.map(product => (
                                            <div key={product.id} className="min-w-[85vw] sm:min-w-[45vw] lg:min-w-0 snap-center">
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <section className="bg-white dark:bg-[#1A1D1E] p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                                        <FontAwesomeIcon icon={categoryOptions.find(c => c.label === selectedCategory)?.icon || faBorderAll} className="text-xl" />
                                    </div>
                                    <h2 className="text-xl lg:text-2xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tighter">{selectedCategory}</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterDrawerOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-[#151718] z-[101] lg:hidden overflow-y-auto p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tight">Filtros</h3>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="text-gray-400 hover:text-brand-charcoal transition-all">
                                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Marca</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {brands.map(brand => (
                                            <button
                                                key={brand}
                                                onClick={() => setSelectedBrand(brand)}
                                                className={`px-4 py-2 border text-[10px] font-bold tracking-widest uppercase transition-all ${selectedBrand === brand
                                                    ? 'border-brand-green bg-brand-green text-white'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-500'
                                                    }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categoría</h4>
                                    <div className="flex flex-col gap-2">
                                        {categoryOptions.map(cat => (
                                            <button
                                                key={cat.label}
                                                onClick={() => setSelectedCategory(cat.label)}
                                                className={`flex items-center gap-4 text-left px-4 py-4 border text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${selectedCategory === cat.label
                                                    ? 'border-brand-green text-brand-green bg-brand-green/5'
                                                    : 'border-gray-100 dark:border-gray-800 text-gray-400'
                                                    }`}
                                            >
                                                <FontAwesomeIcon icon={cat.icon} className="text-sm" />
                                                <span>{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Presupuesto</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            placeholder="Mín"
                                            className="w-full px-3 py-3 bg-[#f4f4f4] dark:bg-[#1f2122] border-none text-xs font-bold outline-none"
                                        />
                                        <span className="text-gray-300">-</span>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            placeholder="Máx"
                                            className="w-full px-3 py-3 bg-[#f4f4f4] dark:bg-[#1f2122] border-none text-xs font-bold outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="w-full bg-brand-charcoal dark:bg-brand-cream text-white dark:text-brand-charcoal py-4 font-black uppercase text-xs tracking-widest mt-8 border-none hover:bg-brand-green transition-colors"
                                >
                                    Ver Resultados
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
