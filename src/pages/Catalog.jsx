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
    faStar as faStarSolid
} from '@fortawesome/free-solid-svg-icons';

const Catalog = () => {
    const { products, loading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedBrand, setSelectedBrand] = useState('Todas');
    const [priceRange, setPriceRange] = useState({ min: 0, max: '' });
    const [sortBy, setSortBy] = useState('Popularidad');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    // Categories and brands for filters
    const categories = useMemo(() => ['Todos', ...new Set(products.map(p => p.category))], [products]);
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
            result = result.filter(p => p.category === selectedCategory);
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

    const handleClearFilters = () => {
        setSelectedCategory('Todos');
        setSelectedBrand('Todas');
        setPriceRange({ min: 0, max: '' });
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#151718] pb-24 transition-colors duration-700">
            {/* Header Banner */}
            <div className="bg-[#f4f4f4] dark:bg-[#1f2122] py-20 px-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tighter mb-4">Nuestro Catálogo</h1>
                    <p className="text-gray-500 max-w-xl text-sm font-medium leading-relaxed">Explora nuestra colección de productos diseñados para potenciar tu vida con tecnología de vanguardia y energía sostenible.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-32 space-y-8">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-widest">Filtros</h3>
                                <button onClick={handleClearFilters} className="text-[10px] font-bold uppercase tracking-widest text-brand-green hover:text-brand-charcoal transition-colors">Limpiar</button>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categoría</h4>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`block w-full text-left px-4 py-2 text-sm font-bold transition-all ${selectedCategory === cat
                                                ? 'text-brand-green bg-brand-green/10'
                                                : 'text-gray-500 hover:text-brand-charcoal dark:hover:text-brand-cream hover:bg-gray-50 dark:hover:bg-brand-charcoal'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Marca</h4>
                                <div className="space-y-2">
                                    {brands.map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => setSelectedBrand(brand)}
                                            className={`block w-full text-left px-4 py-2 text-sm font-bold transition-all ${selectedBrand === brand
                                                ? 'text-brand-green bg-brand-green/10'
                                                : 'text-gray-500 hover:text-brand-charcoal dark:hover:text-brand-cream hover:bg-gray-50 dark:hover:bg-brand-charcoal'
                                                }`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Presupuesto</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            placeholder="Mín"
                                            className="w-full px-4 py-3 bg-[#f4f4f4] dark:bg-[#1f2122] border-none outline-none text-xs font-bold dark:text-brand-cream focus:ring-1 focus:ring-brand-green transition-all"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            placeholder="Máx"
                                            className="w-full px-4 py-3 bg-[#f4f4f4] dark:bg-[#1f2122] border-none outline-none text-xs font-bold dark:text-brand-cream focus:ring-1 focus:ring-brand-green transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-grow">
                        {/* Search and Sort Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                    className="lg:hidden p-3 bg-[#f4f4f4] dark:bg-[#1f2122] text-brand-charcoal dark:text-brand-cream active:scale-95 transition-all"
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                </button>
                                <span className="text-sm font-bold text-gray-500">
                                    {filteredProducts.length} Productos
                                </span>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="relative group w-full sm:w-64">
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#f4f4f4] dark:bg-[#1f2122] border-none outline-none text-xs font-bold dark:text-brand-cream focus:ring-1 focus:ring-brand-green transition-all"
                                    />
                                </div>
                                <div className="relative w-full sm:w-auto">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none w-full bg-[#f4f4f4] dark:bg-[#1f2122] border-none px-6 py-3 pr-10 text-xs font-bold text-brand-charcoal dark:text-brand-cream outline-none cursor-pointer focus:ring-1 focus:ring-brand-green transition-all"
                                    >
                                        <option>Popularidad</option>
                                        <option>Precio: Menor a Mayor</option>
                                        <option>Precio: Mayor a Menor</option>
                                        <option>Nombre</option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i} className="h-96 bg-[#f4f4f4] dark:bg-[#1f2122] animate-pulse flex flex-col p-4 gap-4">
                                            <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full mb-4" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/3" />
                                            <div className="h-6 bg-gray-200 dark:bg-gray-800 w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6"
                                >
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center">
                                    <FontAwesomeIcon icon={faTimes} className="text-4xl text-gray-300 mb-6" />
                                    <h3 className="text-2xl font-black text-brand-charcoal dark:text-brand-cream mb-2 uppercase tracking-tight">Cero Resultados</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm text-sm">No encontramos productos que coincidan con tu búsqueda. ¿Intentamos con otros filtros?</p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="bg-brand-charcoal dark:bg-brand-cream text-white dark:text-brand-charcoal px-8 py-3 uppercase text-xs font-black tracking-widest hover:bg-brand-green transition-colors"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
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
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`text-left px-4 py-3 border text-xs font-bold uppercase tracking-widest transition-all ${selectedCategory === cat
                                                    ? 'border-brand-green text-brand-green bg-brand-green/5'
                                                    : 'border-gray-100 dark:border-gray-800 text-gray-500'
                                                    }`}
                                            >
                                                {cat}
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

export default Catalog;

