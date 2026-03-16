import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faFilter, faEyeSlash, faCheck, faTimes, faSave, faList, faThLarge, faStar } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('product_view_mode') || 'list';
    });

    useEffect(() => {
        localStorage.setItem('product_view_mode', viewMode);
    }, [viewMode]);

    // Get unique categories
    const categories = ['Todos', ...new Set(products.map(p => p.category))];

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'Todos' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas deshabilitar este producto?')) {
            await deleteProduct(id);
        }
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setShowModal(true);
    };

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#0abab5] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Sincronizando Inventario...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Elegant Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">


                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    {/* View Toggle */}
                    <div className="bg-white dark:bg-[#171821] p-1.5 rounded-2xl flex gap-1 shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'list' ? 'bg-[#0abab5] text-white shadow-lg shadow-[#0abab5]/20' : 'text-gray-400 hover:text-[#0abab5]'}`}
                        >
                            <FontAwesomeIcon icon={faList} /> Lista
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-[#0abab5] text-white shadow-lg shadow-[#0abab5]/20' : 'text-gray-400 hover:text-[#0abab5]'}`}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Grid
                        </button>
                    </div>

                    <button
                        onClick={handleAddNew}
                        className="flex-grow lg:flex-grow-0 bg-[#0abab5] text-white px-8 py-4 rounded-2xl hover:bg-[#008b8b] flex items-center justify-center gap-3 shadow-xl shadow-[#0abab5]/20 transition-all transform active:scale-95 font-black uppercase tracking-widest text-[10px]"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white/50 dark:bg-[#111217]/50 backdrop-blur-md p-4 rounded-[28px] shadow-sm border border-gray-100 dark:border-[#1e1f26] flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-xl">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, marca o modelo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-[#171821] border border-transparent focus:border-[#0abab5] outline-none dark:text-white transition-all font-black uppercase tracking-widest text-[10px] placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-6 py-4 bg-white dark:bg-[#171821] rounded-2xl border border-transparent dark:border-transparent focus-within:border-[#0abab5] flex items-center gap-4 transition-all group">
                        <FontAwesomeIcon icon={faFilter} className="text-gray-400 group-focus-within:text-[#0abab5]" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent text-gray-700 dark:text-gray-200 outline-none cursor-pointer font-black text-[10px] uppercase tracking-widest min-w-[160px]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-white dark:bg-[#171821]">{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main View Container */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-transparent lg:bg-white lg:dark:bg-[#111217] lg:rounded-[32px] lg:shadow-sm lg:border lg:border-gray-100 lg:dark:border-[#1e1f26] overflow-hidden"
                    >
                        {/* Mobile List View (Cards) */}
                        <div className="lg:hidden space-y-4">
                            {filteredProducts.map(product => (
                                <div key={product.id} className={`bg-white dark:bg-[#111217] p-5 rounded-[28px] border border-gray-100 dark:border-[#1e1f26] shadow-sm flex items-center gap-5 transition-all active:scale-[0.98] ${product.disabled ? 'opacity-60 grayscale' : ''}`}>
                                    <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-[#0d0e12] p-2 flex-shrink-0 border border-gray-100 dark:border-white/5">
                                        <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase italic tracking-tighter truncate leading-tight mb-1">{product.name}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[9px] font-black uppercase text-[#0abab5] tracking-widest">{product.brand}</span>
                                            <span className="text-[8px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 font-black uppercase tracking-widest">{product.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter">{formatCurrency(product.price)}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(product)} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#0abab5] border border-gray-100 dark:border-white/5">
                                                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                                </button>
                                                {!product.disabled && (
                                                    <button onClick={() => handleDelete(product.id)} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 border border-gray-100 dark:border-white/5">
                                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 dark:bg-[#171821]/50 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-gray-100 dark:border-[#1e1f26]">
                                    <tr>
                                        <th className="p-8">Información Técnica</th>
                                        <th className="p-8">Categoría</th>
                                        <th className="p-8">Finanzas</th>
                                        <th className="p-8">Inventario</th>
                                        <th className="p-8 text-center">Estado</th>
                                        <th className="p-8 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#1e1f26]/50">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className={`group transition-all ${product.disabled ? 'bg-gray-50/50 dark:bg-gray-900/20 opacity-60' : 'hover:bg-gray-50/80 dark:hover:bg-white/5'}`}>
                                            <td className="p-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-20 w-20 rounded-[20px] bg-white dark:bg-[#0d0e12] p-2 border border-gray-100 dark:border-[#1e1f26] relative overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-contain rounded-xl" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 dark:text-white text-lg tracking-tighter italic uppercase leading-none">{product.name}</div>
                                                        <div className="text-[10px] text-[#0abab5] font-black uppercase tracking-[0.2em] mt-2 italic">{product.brand}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-transparent">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter">
                                                        {formatCurrency(product.price)}
                                                    </span>
                                                    {product.promotion && (
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-gray-400 line-through font-bold">
                                                                {formatCurrency(product.price / (1 - (product.discountPercentage || 15) / 100))}
                                                            </span>
                                                            <span className="text-[9px] text-[#ff2d55] font-black uppercase tracking-tighter mt-0.5">-{product.discountPercentage || 15}% OFF</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-1.5 w-20 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${product.stock < 10 ? 'bg-[#ff2d55]' : 'bg-[#0abab5]'}`}
                                                            style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-[10px] font-black ${product.stock < 10 ? 'text-[#ff2d55] animate-pulse' : 'text-gray-400'}`}>{product.stock}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                {product.disabled ? (
                                                    <span className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 text-gray-500 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-200 dark:border-transparent">
                                                        Inactivo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 bg-[#0abab5]/10 text-[#0abab5] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#0abab5]/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0abab5] animate-pulse"></div> Online
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-3 lg:opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                                    <button onClick={() => handleEdit(product)} className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 hover:bg-[#4169e1] hover:text-white rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    {!product.disabled && (
                                                        <button onClick={() => handleDelete(product.id)} className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 hover:bg-[#ff2d55] hover:text-white rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {filteredProducts.map(product => (
                            <div key={product.id} className={`group relative bg-white dark:bg-[#111217] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-[#1e1f26] transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#0abab5]/10 ${product.disabled ? 'opacity-60 grayscale' : ''}`}>
                                {/* Card Image */}
                                <div className="relative h-64 rounded-[24px] bg-gray-50 dark:bg-[#0d0e12] overflow-hidden mb-6 border border-gray-100 dark:border-[#1e1f26]">
                                    <img src={product.images[0]} alt="" className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" />

                                    {/* Quick Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.new && <span className="bg-[#0abab5] text-white text-[8px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">Nuevo</span>}
                                        {product.promotion && <span className="bg-[#ff2d55] text-white text-[8px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">-{product.discountPercentage || 15}%</span>}
                                    </div>

                                    {/* Action Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                                        <button onClick={() => handleEdit(product)} className="w-14 h-14 bg-white text-gray-900 rounded-2xl flex items-center justify-center shadow-xl hover:bg-[#4169e1] hover:text-white transition-all transform hover:scale-110">
                                            <FontAwesomeIcon icon={faEdit} className="text-xl" />
                                        </button>
                                        {!product.disabled && (
                                            <button onClick={() => handleDelete(product.id)} className="w-14 h-14 bg-white text-[#ff2d55] rounded-2xl flex items-center justify-center shadow-xl hover:bg-[#ff2d55] hover:text-white transition-all transform hover:scale-110">
                                                <FontAwesomeIcon icon={faTrash} className="text-xl" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-5 px-1">
                                    <div>
                                        <h3 className="font-black text-gray-900 dark:text-white text-xl tracking-tighter italic uppercase group-hover:text-[#0abab5] transition-colors leading-tight line-clamp-2">{product.name}</h3>
                                        <div className="flex justify-between items-center mt-3">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{product.brand}</p>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#0abab5] px-2 py-1 bg-[#0abab5]/10 rounded-lg">{product.category}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-5 border-t border-gray-100 dark:border-[#1e1f26]">
                                        <div className="flex flex-col">
                                            <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
                                                {formatCurrency(product.price)}
                                            </div>
                                            {product.promotion && (
                                                <span className="text-[10px] text-gray-400 line-through font-bold mt-1">
                                                    {formatCurrency(product.price / (1 - (product.discountPercentage || 15) / 100))}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[9px] font-black tracking-widest uppercase ${product.stock < 10 ? 'text-[#ff2d55] animate-pulse' : 'text-gray-400 opacity-60'}`}>Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {showModal && (
                    <ProductModal
                        product={currentProduct}
                        onClose={() => setShowModal(false)}
                        onSave={async (data) => {
                            if (currentProduct) {
                                await updateProduct(currentProduct.id, data);
                            } else {
                                await addProduct(data);
                            }
                            setShowModal(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const ProductModal = ({ product, onClose, onSave }) => {
    const isEdit = !!product;
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        name: product?.name || '',
        brand: product?.brand || '',
        category: product?.category || '',
        price: product?.price || '',
        stock: product?.stock || '',
        description: product?.description || '',
        images: product?.images || [],
        newImageInput: '',
        disabled: product?.disabled || false,
        promotion: product?.promotion || false,
        discountPercentage: product?.discountPercentage || 0,
        new: product?.new || false,
        bestSeller: product?.bestSeller || false,
        specifications: product?.specifications || [],
        reviews: product?.reviews || [],
    });

    const [imagePreview, setImagePreview] = useState('');
    const [newSpec, setNewSpec] = useState({ label: '', value: '' });
    const [newReview, setNewReview] = useState({ user: '', comment: '', rating: 5, date: new Date().toLocaleDateString() });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'newImageInput') {
            setImagePreview(value);
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddImage = (e) => {
        e.preventDefault();
        if (formData.newImageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, prev.newImageInput.trim()],
                newImageInput: ''
            }));
            setImagePreview('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleAddSpec = (e) => {
        e.preventDefault();
        if (newSpec.label.trim() && newSpec.value.trim()) {
            setFormData(prev => ({
                ...prev,
                specifications: [...prev.specifications, { ...newSpec }]
            }));
            setNewSpec({ label: '', value: '' });
        }
    };

    const handleRemoveSpec = (index) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (newReview.user.trim() && newReview.comment.trim()) {
            setFormData(prev => ({
                ...prev,
                reviews: [
                    { ...newReview, date: new Date().toLocaleDateString() },
                    ...prev.reviews
                ]
            }));
            setNewReview({ user: '', comment: '', rating: 5, date: new Date().toLocaleDateString() });
        }
    };

    const handleRemoveReview = (index) => {
        setFormData(prev => ({
            ...prev,
            reviews: prev.reviews.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Auto-add pending image if user forgot to click the plus button
        let finalImages = [...formData.images];
        if (formData.newImageInput.trim() && !finalImages.includes(formData.newImageInput.trim())) {
            finalImages.push(formData.newImageInput.trim());
        }

        const dataToSave = {
            ...formData,
            images: finalImages,
            price: parseFloat(formData.price) || 0,
            stock: parseInt(formData.stock) || 0,
            discountPercentage: parseInt(formData.discountPercentage) || 0
        };

        delete dataToSave.newImageInput;
        onSave(dataToSave);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: faEdit },
        { id: 'multimedia', label: 'Multimedia', icon: faThLarge },
        { id: 'description', label: 'Descripción', icon: faList },
        { id: 'specifications', label: 'Especificaciones', icon: faPlus }, // Reusing faPlus for variety or use specific icons
        { id: 'reviews', label: 'Reseñas', icon: faCheck }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800">
                {/* Modal Header */}
                <div className="p-6 md:p-10 border-b border-gray-100 dark:border-[#1e1f26] flex justify-between items-center bg-gray-50/50 dark:bg-[#111217]">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">
                            {isEdit ? 'Editar' : 'Añadir'} <span className="text-[#0abab5]">Producto</span>
                        </h2>
                        <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 md:mt-2">ID: {product?.id || 'Nuevo Sistema'}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-gray-400 hover:text-[#ff2d55] hover:bg-[#ff2d55]/5 rounded-xl md:rounded-[20px] transition-all border border-transparent hover:border-[#ff2d55]/20">
                        <FontAwesomeIcon icon={faTimes} className="text-lg md:text-xl" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex px-4 md:px-10 bg-white dark:bg-[#111217] border-b border-gray-100 dark:border-[#1e1f26] overflow-x-auto custom-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 md:py-6 px-4 md:px-8 text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 md:gap-3 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'border-[#0abab5] text-[#0abab5] bg-[#0abab5]/5'
                                : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <FontAwesomeIcon icon={tab.icon} className="text-xs md:text-sm" />
                            <span className="hidden xs:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'general' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                                            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" placeholder="P. ej. Panel Solar Pro X" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Marca</label>
                                                <input name="brand" value={formData.brand} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" placeholder="LOGO" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                                                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner appearance-none" required>
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Paneles Solares">Paneles Solares</option>
                                                    <option value="Inversores">Inversores</option>
                                                    <option value="Baterías">Baterías</option>
                                                    <option value="Generadores">Generadores</option>
                                                    <option value="Iluminación">Iluminación</option>
                                                    <option value="Accesorios">Accesorios</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio Unitario ($)</label>
                                                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Disponible</label>
                                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" required />
                                            </div>
                                        </div>
                                        {formData.promotion && (
                                            <div className="space-y-2 animate-fade-in">
                                                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Porcentaje de Descuento (%)</label>
                                                <input
                                                    type="number"
                                                    name="discountPercentage"
                                                    value={formData.discountPercentage}
                                                    onChange={handleChange}
                                                    min="0"
                                                    max="100"
                                                    className="w-full p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/10 dark:text-white border border-red-100 dark:border-red-900/30 focus:border-red-500 outline-none font-black text-sm transition-all"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Flags de Visibilidad</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { name: 'promotion', label: 'En Promoción', color: '#ff2d55', bg: 'bg-[#ff2d55]/10', border: 'border-[#ff2d55]', text: 'text-[#ff2d55]' },
                                                { name: 'new', label: 'Nuevo Producto', color: '#0abab5', bg: 'bg-[#0abab5]/10', border: 'border-[#0abab5]', text: 'text-[#0abab5]' },
                                                { name: 'bestSeller', label: 'Más Vendido', color: '#ff9500', bg: 'bg-[#ff9500]/10', border: 'border-[#ff9500]', text: 'text-[#ff9500]' },
                                                { name: 'disabled', label: 'Deshabilitado', color: '#6b7280', bg: 'bg-[#6b7280]/10', border: 'border-[#6b7280]', text: 'text-[#6b7c93]' }
                                            ].map(flag => (
                                                <label key={flag.name} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData[flag.name] ? `${flag.border} ${flag.bg}` : 'border-gray-50 dark:border-gray-800 hover:border-gray-100'}`}>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData[flag.name] ? flag.text : 'text-gray-500'}`}>{flag.label}</span>
                                                    <input type="checkbox" name={flag.name} checked={formData[flag.name]} onChange={handleChange} className="w-5 h-5 rounded-lg border-gray-300 text-[#0abab5] focus:ring-[#0abab5]" />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'multimedia' && (
                                <div className="space-y-8">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border-2 border-dashed border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Añadir Nueva Imagen (URL)</label>
                                        <div className="flex gap-4">
                                            <input name="newImageInput" value={formData.newImageInput} onChange={handleChange} className="flex-grow p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-mono text-xs transition-all shadow-sm" placeholder="https://images.unsplash.com/..." />
                                            <button onClick={handleAddImage} className="w-14 h-14 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg flex items-center justify-center">
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                        {imagePreview && (
                                            <div className="mt-6 aspect-video max-h-48 rounded-2xl overflow-hidden bg-white dark:bg-black p-4 border border-gray-100 dark:border-gray-800 relative group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-black/50 text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg backdrop-blur-sm">Presiona (+) para Confirmar</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Galería Actual ({formData.images.length} items)</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800">
                                                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <button onClick={() => handleRemoveImage(idx)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xl">
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">#{idx + 1}</div>
                                                </div>
                                            ))}
                                            {formData.images.length === 0 && (
                                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                                    <FontAwesomeIcon icon={faThLarge} className="text-4xl mb-3 opacity-20" />
                                                    <p className="text-xs uppercase font-black tracking-widest">Sin imágenes</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'description' && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cuerpo de la Descripción (Markdown soportado)</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="12"
                                            className="w-full p-6 rounded-[32px] bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-medium text-sm leading-relaxed transition-all shadow-inner resize-none"
                                            placeholder="Introduce los detalles premium del producto..."
                                        />
                                    </div>
                                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">Tip del Sistema</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Este texto se verá en la pestaña principal de la página de detalle del producto.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="space-y-8">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Añadir Especificación Técnica</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input value={newSpec.label} onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })} className="p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-xs uppercase" placeholder="Etiqueta (P. ej. Potencia)" />
                                            <div className="flex gap-4">
                                                <input value={newSpec.value} onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })} className="flex-grow p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-xs" placeholder="Valor (P. ej. 400W)" />
                                                <button onClick={handleAddSpec} className="w-14 h-14 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg flex items-center justify-center shrink-0">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.specifications.map((spec, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 group hover:border-green-500/50 transition-all">
                                                <div>
                                                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">{spec.label}</p>
                                                    <p className="text-sm font-black italic dark:text-white">{spec.value}</p>
                                                </div>
                                                <button onClick={() => handleRemoveSpec(idx)} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors">
                                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.specifications.length === 0 && (
                                            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dotted border-gray-200 dark:border-gray-800">
                                                <p className="text-xs uppercase font-black tracking-widest opacity-50 italic">Utilizando especificaciones por defecto del sistema</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-8">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Simular Nueva Reseña de Usuario</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <input value={newReview.user} onChange={(e) => setNewReview({ ...newReview, user: e.target.value })} className="p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-xs" placeholder="Nombre de Usuario" />
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-transparent">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Calificación</span>
                                                <div className="flex gap-1 text-orange-400">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <FontAwesomeIcon
                                                            key={star}
                                                            icon={faStar}
                                                            className={`cursor-pointer transition-all ${star <= newReview.rating ? 'text-orange-400 scale-110' : 'text-gray-200 dark:text-gray-800'}`}
                                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleAddReview} className="flex-grow bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all font-black uppercase tracking-widest text-xs py-4 px-6 shadow-lg">
                                                    Publicar Reseña
                                                </button>
                                            </div>
                                        </div>
                                        <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="w-full p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-medium text-xs leading-relaxed transition-all shadow-inner resize-none mb-2" rows="2" placeholder="Comentario del cliente..." />
                                    </div>

                                    <div className="space-y-4">
                                        {formData.reviews.map((rev, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm font-black italic dark:text-white uppercase">{rev.user}</span>
                                                        <div className="flex gap-0.5 text-orange-400 text-[10px]">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} className={i < rev.rating ? 'text-orange-400' : 'text-gray-100 dark:text-gray-900'} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{rev.date}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{rev.comment}"</p>
                                                </div>
                                                <button onClick={() => handleRemoveReview(idx)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.reviews.length === 0 && (
                                            <div className="py-12 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dotted border-gray-200 dark:border-gray-800">
                                                <p className="text-xs uppercase font-black tracking-widest opacity-50 italic">No hay reseñas registradas para este producto</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </form>

                {/* Modal Footer */}
                <div className="p-6 md:p-10 border-t border-gray-100 dark:border-[#1e1f26] bg-gray-50/50 dark:bg-[#111217] flex justify-between items-center text-[10px]">
                    <div className="hidden sm:flex gap-3">
                        {tabs.map((tab, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${activeTab === tab.id ? 'w-8 bg-[#0abab5]' : 'bg-gray-200 dark:bg-[#1e1f26]'}`} />
                        ))}
                    </div>
                    <div className="flex gap-3 md:gap-5 w-full sm:w-auto">
                        <button onClick={onClose} className="flex-1 sm:flex-none px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-[9px] md:text-[10px]">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="flex-1 sm:flex-none px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-[22px] bg-[#0abab5] text-white font-black uppercase tracking-widest shadow-2xl shadow-[#0abab5]/30 hover:bg-[#008b8b] transition-all transform active:scale-95 flex items-center justify-center gap-2 md:gap-4 text-[9px] md:text-[10px]">
                            <FontAwesomeIcon icon={faSave} />
                            <span>Aplicar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;

