import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFilter,
    faChevronDown,
    faTimes,
    faChartBar,
    faStar as faStarSolid
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../utils/formatters';

const Catalog = () => {
    const { products, loading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedBrand, setSelectedBrand] = useState('Todas');
    const [selectedRating, setSelectedRating] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: '' });
    const [sortBy, setSortBy] = useState('Popularidad');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({
        brand: false,
        category: false,
        rating: false,
        price: false
    });

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Categories and brands for filters
    const categories = useMemo(() => ['Todos', ...new Set(products.map(p => p.category))], [products]);
    const brands = useMemo(() => ['Todas', ...new Set(products.map(p => p.brand))], [products]);

    const filteredProducts = useMemo(() => {
        // Start with only active products
        let result = products.filter(p => !p.disabled);

        // Defensive Search
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            result = result.filter(p =>
                (p.name || '').toLowerCase().includes(query) ||
                (p.brand || '').toLowerCase().includes(query)
            );
        }

        // Defensive Category
        if (selectedCategory !== 'Todos') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Defensive Brand
        if (selectedBrand !== 'Todas') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        // Defensive Price (ensure numbers)
        const minP = parseFloat(priceRange.min) || 0;
        const maxP = priceRange.max === '' ? Infinity : (parseFloat(priceRange.max) || Infinity);
        result = result.filter(p => {
            const price = parseFloat(p.price) || 0;
            return price >= minP && price <= maxP;
        });

        // Defensive Rating
        if (selectedRating) {
            result = result.filter(p => (p.rating || 0) >= selectedRating);
        }

        // Robust Sorting
        const sortedResult = [...result];
        if (sortBy === 'Precio: Menor a Mayor') {
            sortedResult.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        } else if (sortBy === 'Precio: Mayor a Menor') {
            sortedResult.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        } else if (sortBy === 'Nombre') {
            sortedResult.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else {
            // Default: Newest first (highest ID first)
            sortedResult.sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0));
        }

        return sortedResult;
    }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, sortBy, selectedRating]);

    const handleClearFilters = () => {
        setSelectedCategory('Todos');
        setSelectedBrand('Todas');
        setPriceRange({ min: 0, max: '' });
        setSelectedRating(null);
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-brand-cream/20 dark:bg-brand-charcoal pb-24 transition-colors duration-700">
            <div className="container mx-auto px-6 pt-12 py-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="flex-grow order-2 lg:order-1">
                        {/* Search and Sort Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
                            <div className="flex items-center gap-6 w-full sm:w-auto">
                                <h2 className="text-2xl font-black text-brand-charcoal dark:text-brand-cream whitespace-nowrap tracking-tighter">
                                    {filteredProducts.length} <span className="text-brand-charcoal/30 dark:text-brand-cream/30 font-black uppercase text-[10px] ml-2 tracking-[0.3em]">Productos</span>
                                </h2>
                                <button
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                    className="lg:hidden p-4 bg-brand-green text-brand-cream rounded-2xl shadow-xl shadow-brand-red/20 active:scale-95 transition-all"
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="relative group w-full sm:w-72">
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-charcoal/20 dark:text-brand-cream/20 group-focus-within:text-brand-red transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Busca lo que necesites..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-white dark:bg-brand-charcoal/50 border border-brand-charcoal/5 dark:border-brand-cream/10 outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all dark:text-brand-cream text-sm font-bold placeholder:text-brand-charcoal/20 dark:placeholder:text-brand-cream/20 shadow-sm"
                                    />
                                </div>
                                <div className="relative w-full sm:w-auto">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none w-full bg-white dark:bg-brand-charcoal/50 border border-brand-charcoal/5 dark:border-brand-cream/10 rounded-[1.5rem] px-8 py-4 pr-14 text-sm font-black text-brand-charcoal/60 dark:text-brand-cream/60 outline-none cursor-pointer focus:ring-2 focus:ring-brand-green/20 shadow-sm transition-all"
                                    >
                                        <option>Popularidad</option>
                                        <option>Precio: Menor a Mayor</option>
                                        <option>Precio: Mayor a Menor</option>
                                        <option>Nombre</option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-charcoal/20 pointer-events-none text-[10px]" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full text-brand-charcoal">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-[520px] bg-white dark:bg-brand-charcoal/40 rounded-[2.5rem] p-6 flex flex-col gap-6 border border-brand-charcoal/5 dark:border-brand-cream/5 animate-pulse">
                                            <div className="h-64 bg-brand-cream/50 dark:bg-brand-cream/5 rounded-[2rem]" />
                                            <div className="h-4 w-1/4 bg-brand-cream/50 dark:bg-brand-cream/5 rounded-full" />
                                            <div className="h-8 w-3/4 bg-brand-cream/50 dark:bg-brand-cream/5 rounded-full" />
                                            <div className="mt-auto flex justify-between items-end">
                                                <div className="space-y-3">
                                                    <div className="h-10 w-32 bg-brand-cream/50 dark:bg-brand-cream/5 rounded-full" />
                                                </div>
                                                <div className="w-14 h-14 bg-brand-cream/50 dark:bg-brand-cream/5 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center">
                                    <div className="w-24 h-24 bg-brand-cream dark:bg-brand-charcoal/50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                                        <FontAwesomeIcon icon={faTimes} className="text-4xl text-brand-charcoal/10" />
                                    </div>
                                    <h3 className="text-3xl font-black text-brand-charcoal dark:text-brand-cream mb-3 tracking-tighter italic">Sin hallazgos</h3>
                                    <p className="text-brand-charcoal/40 dark:text-brand-cream/40 mb-10 max-w-sm font-medium">Refina tus filtros para encontrar lo que estás buscando.</p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="bg-brand-green text-brand-cream px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-brand-forest transition-all shadow-xl shadow-brand-green/20 active:scale-95"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block w-[400px] flex-shrink-0 order-1 lg:order-2">
                        <div className="bg-white dark:bg-brand-charcoal/40 p-12 rounded-[3rem] border border-brand-charcoal/5 dark:border-brand-cream/5 sticky top-40 shadow-2xl shadow-brand-charcoal/5 dark:shadow-none backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter">Filtros Avanzados</h3>
                                <button onClick={handleClearFilters} className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green hover:text-brand-forest transition-colors">Resetear</button>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-8 p-6 bg-brand-cream/30 dark:bg-brand-charcoal/20 rounded-[2rem]">
                                <button
                                    onClick={() => toggleSection('brand')}
                                    className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-brand-cream/40 mb-4 flex items-center justify-between hover:text-brand-green transition-colors"
                                >
                                    Marca
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[8px] transition-transform duration-500 ${collapsedSections.brand ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.brand && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-2 gap-3 pb-2">
                                                {brands.map(brand => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => setSelectedBrand(brand)}
                                                        className={`px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${selectedBrand === brand
                                                            ? 'bg-brand-green border-brand-green text-brand-cream shadow-xl shadow-brand-green/20'
                                                            : 'bg-white dark:bg-brand-charcoal/50 border-brand-charcoal/5 dark:border-brand-cream/10 text-brand-charcoal/50 dark:text-brand-cream/50 hover:border-brand-green/30'
                                                            }`}
                                                    >
                                                        {brand}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-8 p-6 bg-brand-cream/30 dark:bg-brand-charcoal/20 rounded-[2rem]">
                                <button
                                    onClick={() => toggleSection('category')}
                                    className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-brand-cream/40 mb-4 flex items-center justify-between hover:text-brand-green transition-colors"
                                >
                                    Categoría
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[8px] transition-transform duration-500 ${collapsedSections.category ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.category && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-2 gap-3 pb-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setSelectedCategory(cat)}
                                                        className={`px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${selectedCategory === cat
                                                            ? 'bg-brand-green border-brand-green text-brand-cream shadow-xl shadow-brand-green/20'
                                                            : 'bg-white dark:bg-brand-charcoal/50 border-brand-charcoal/5 dark:border-brand-cream/10 text-brand-charcoal/50 dark:text-brand-cream/50 hover:border-brand-green/30'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Rating Selector */}
                            <div className="mb-8 p-6 bg-brand-cream/30 dark:bg-brand-charcoal/20 rounded-[2rem]">
                                <button
                                    onClick={() => toggleSection('rating')}
                                    className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-brand-cream/40 mb-4 flex items-center justify-between hover:text-brand-green transition-colors"
                                >
                                    Calificación
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[8px] transition-transform duration-500 ${collapsedSections.rating ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.rating && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex justify-between pb-2">
                                                {[1, 2, 3, 4, 5].map(rating => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => setSelectedRating(rating === selectedRating ? null : rating)}
                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${selectedRating === rating
                                                            ? 'bg-brand-green border-brand-green text-brand-cream shadow-xl shadow-brand-green/30'
                                                            : 'bg-white dark:bg-brand-charcoal/50 border-brand-charcoal/5 dark:border-brand-cream/10 text-brand-charcoal/60 dark:text-brand-cream/60 hover:border-brand-green/30 focus:ring-2 focus:ring-brand-green/20'
                                                            }`}
                                                    >
                                                        <span className="text-sm font-black">{rating}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-10 p-6 bg-brand-cream/30 dark:bg-brand-charcoal/20 rounded-[2rem]">
                                <button
                                    onClick={() => toggleSection('price')}
                                    className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-brand-cream/40 mb-4 flex items-center justify-between hover:text-brand-green transition-colors"
                                >
                                    Presupuesto (COP)
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[8px] transition-transform duration-500 ${collapsedSections.price ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.price && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-2">
                                                <div className="flex items-end gap-1.5 h-16 mb-8 px-2">
                                                    {[4, 8, 15, 25, 40, 60, 80, 100, 85, 60, 40, 20, 10, 5].map((h, i) => (
                                                        <div key={i} className={`flex-grow rounded-t-lg transition-all duration-1000 ${i > 2 && i < 11 ? 'bg-brand-green' : 'bg-brand-charcoal/5 dark:bg-brand-cream/5'}`} style={{ height: `${h}%` }}></div>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex-grow">
                                                        <p className="text-[8px] font-black text-brand-charcoal/30 dark:text-brand-cream/30 uppercase tracking-[0.2em] mb-2 ml-1">Mínimo</p>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40 dark:text-brand-cream/40 text-xs">$</span>
                                                            <input
                                                                type="number"
                                                                value={priceRange.min}
                                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                                placeholder="0"
                                                                className="w-full pl-8 pr-4 py-4 bg-white dark:bg-brand-charcoal border border-brand-charcoal/5 dark:border-brand-cream/10 rounded-2xl outline-none text-xs font-black dark:text-brand-cream focus:ring-2 focus:ring-brand-green/20 shadow-sm transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-[8px] font-black text-brand-charcoal/30 dark:text-brand-cream/30 uppercase tracking-[0.2em] mb-2 ml-1">Máximo</p>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40 dark:text-brand-cream/40 text-xs">$</span>
                                                            <input
                                                                type="number"
                                                                value={priceRange.max}
                                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                                placeholder="Max"
                                                                className="w-full pl-8 pr-4 py-4 bg-white dark:bg-brand-charcoal border border-brand-charcoal/5 dark:border-brand-cream/10 rounded-2xl outline-none text-xs font-black dark:text-brand-cream focus:ring-2 focus:ring-brand-green/20 shadow-sm transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Promo Content Section */}
                            <div className="bg-gradient-to-br from-brand-forest to-brand-green p-8 rounded-[2.5rem] text-brand-cream overflow-hidden relative group cursor-pointer shadow-2xl shadow-brand-green/20 hover:scale-[1.02] transition-all duration-700">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-70">Sostenibilidad</p>
                                    <h4 className="text-3xl font-black italic tracking-tighter leading-[0.9] mb-6">Membresía <br /><span className="text-brand-cream/80"> Energy PRO </span></h4>
                                    <button className="bg-brand-cream text-brand-green px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:shadow-xl transition-all active:scale-95">Mejorar Ahora</button>
                                </div>
                                <FontAwesomeIcon icon={faChartBar} className="absolute -right-6 -bottom-6 text-9xl opacity-20 rotate-12 group-hover:rotate-0 transition-all duration-1000" />
                            </div>
                        </div>
                    </aside>
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
                            className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-xl z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-[400px] bg-brand-cream dark:bg-brand-charcoal z-[101] lg:hidden overflow-y-auto p-12 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-3xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter">Filtros</h3>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="w-12 h-12 bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full text-brand-charcoal dark:text-brand-cream flex items-center justify-center transition-all hover:bg-brand-green hover:text-brand-cream">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <div className="space-y-14">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/30 dark:text-brand-cream/30 mb-8">Marca</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {brands.map(brand => (
                                            <button
                                                key={brand}
                                                onClick={() => setSelectedBrand(brand)}
                                                className={`px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300 ${selectedBrand === brand
                                                    ? 'bg-brand-green text-brand-cream shadow-xl shadow-brand-red/20'
                                                    : 'bg-brand-charcoal/5 dark:bg-brand-cream/5 text-brand-charcoal/50 dark:text-brand-cream/50'
                                                    }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/30 dark:text-brand-cream/30 mb-8">Categoría</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${selectedCategory === cat
                                                    ? 'bg-brand-green border-brand-green text-brand-cream shadow-xl shadow-brand-green/20'
                                                    : 'bg-white dark:bg-brand-charcoal/50 border-brand-charcoal/5 dark:border-brand-cream/10 text-brand-charcoal/50 dark:text-brand-cream/50'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/30 dark:text-brand-cream/30 mb-8">Presupuesto</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-grow">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40 dark:text-brand-cream/40 text-xs">$</span>
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                placeholder="Mín"
                                                className="w-full pl-8 pr-4 py-4 bg-white dark:bg-brand-charcoal border border-brand-charcoal/5 dark:border-brand-cream/10 rounded-2xl outline-none text-[10px] font-black dark:text-brand-cream focus:ring-2 focus:ring-brand-green/20 shadow-sm"
                                            />
                                        </div>
                                        <span className="text-brand-charcoal/20 dark:text-brand-cream/20 font-black">/</span>
                                        <div className="relative flex-grow">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40 dark:text-brand-cream/40 text-xs">$</span>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                placeholder="Máx"
                                                className="w-full pl-8 pr-4 py-4 bg-white dark:bg-brand-charcoal border border-brand-charcoal/5 dark:border-brand-cream/10 rounded-2xl outline-none text-[10px] font-black dark:text-brand-cream focus:ring-2 focus:ring-brand-green/20 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="w-full bg-brand-green text-brand-cream py-6 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-green/30 active:scale-[0.98] transition-all"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Catalog;

