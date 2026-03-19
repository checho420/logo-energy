import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch, faUser, faShoppingCart, faBars, faTimes,
    faHome, faStore, faCrown, faTag, faPhoneVolume
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { toggleCart, itemCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const isAdmin = location.pathname.startsWith('/admin');

    const navItems = isAdmin
        ? [
            { label: 'Visión General', path: '/admin' },
            { label: 'Logística', path: '/admin/orders' },
            { label: 'Inventario', path: '/admin/products' },
            { label: 'Audiencia', path: '/admin/customers' },
        ]
        : [
            { label: 'Inicio', path: '/' },
            { label: 'Categorías', path: '/catalog' },
            { label: 'Productos', path: '/bestsellers' },
            { label: 'Características', path: '/features' },
            { label: 'Blog', path: '/blog' },
            { label: 'Elementos', path: '/elements' },
            { label: 'Ofertas Especiales', path: '/sale' },
            { label: 'Comprar Pro', path: '/buy' }
        ];

    return (
        <header className="w-full bg-white dark:bg-[#1A1D1E] relative z-50 shadow-sm">
            {/* Top Green Bar */}
            <div className="bg-brand-green text-white py-2 px-6 flex justify-between items-center text-[10px] md:text-xs">
                <div className="hidden md:flex gap-4 font-semibold opacity-90">
                    <span className="cursor-pointer">ESPAÑOL ▾</span>
                    <span className="cursor-pointer">COP ▾</span>
                </div>
                <div className="flex-1 text-center font-bold tracking-widest uppercase">
                    OBTÉN HASTA <span className="bg-white text-brand-green px-1 mx-1 rounded-sm">40% OFF</span> EN NUEVOS ESTILOS <Link to="/sale" className="underline ml-2 hover:text-brand-charcoal transition-colors">COMPRAR AHORA</Link>
                </div>
                <div className="hidden xl:flex gap-6 font-semibold opacity-90">
                    <Link to="#" className="hover:text-brand-charcoal transition-colors">Mi Cuenta</Link>
                    <Link to="#" className="hover:text-brand-charcoal transition-colors">Contáctanos</Link>
                    <Link to="#" className="hover:text-brand-charcoal transition-colors">Blog</Link>
                    <Link to="#" className="hover:text-brand-charcoal transition-colors">Mi Lista de Deseos</Link>
                    <button onClick={() => setIsLoginOpen(true)} className="hover:text-brand-charcoal transition-colors">Iniciar Sesión</button>
                    <div className="flex gap-3">
                        {/* Social Icons Placeholder */}
                        <span className="font-bold">f</span>
                        <span className="font-bold">t</span>
                        <span className="font-bold">in</span>
                    </div>
                </div>
            </div>

            {/* Middle White Bar */}
            <div className="container mx-auto px-6 py-6 flex justify-between items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex flex-1">
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full bg-gray-100 dark:bg-black/20 text-brand-charcoal dark:text-brand-cream rounded-full py-3 px-6 text-sm outline-none border border-transparent focus:border-brand-green transition-colors"
                        />
                        <button className="absolute right-0 top-0 h-full px-6 flex items-center justify-center text-brand-charcoal/40 hover:text-brand-green">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>

                {/* Logo */}
                <div className="flex-1 flex justify-start md:justify-center">
                    <Link to="/" className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-brand-charcoal dark:text-brand-cream flex items-center gap-2 group">
                        LOGO<span className="text-brand-green italic group-hover:scale-105 transition-transform">Energy</span>
                    </Link>
                </div>

                {/* Contact & Icons */}
                <div className="flex flex-1 justify-end items-center gap-6 lg:gap-10">
                    <div className="hidden lg:flex items-center gap-3">
                        <FontAwesomeIcon icon={faPhoneVolume} className="text-3xl text-brand-charcoal/20 dark:text-brand-cream/20" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-brand-charcoal/50 dark:text-brand-cream/50 font-bold uppercase tracking-widest leading-none mb-1">Llámanos Ahora</span>
                            <span className="font-black text-brand-charcoal dark:text-brand-cream text-lg leading-none">+123 5678 890</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-brand-charcoal dark:text-brand-cream">
                        <button onClick={() => setIsLoginOpen(true)} className="hover:text-brand-green transition-colors hidden md:block">
                            <FontAwesomeIcon icon={faUser} className="text-xl" />
                        </button>
                        <button className="hover:text-brand-green transition-colors hidden md:block relative">
                            <FontAwesomeIcon icon={faHeart} className="text-xl" />
                        </button>
                        <button onClick={toggleCart} className="hover:text-brand-green transition-colors relative flex items-center">
                            <div className="relative">
                                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                                <span className="absolute -top-2 -right-2 bg-brand-green text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">
                                    {itemCount}
                                </span>
                            </div>
                        </button>
                        <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-2xl hover:text-brand-green">
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Menu */}
            <div className="hidden lg:flex border-t border-brand-charcoal/5 dark:border-white/5 bg-white dark:bg-[#1A1D1E]">
                <nav className="container mx-auto px-6 flex justify-center space-x-10 py-4">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`text-[11px] font-bold uppercase tracking-widest text-brand-charcoal dark:text-brand-cream hover:text-brand-green transition-colors ${location.pathname === item.path ? 'text-brand-green' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[400] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white dark:bg-[#1A1D1E] z-[401] flex flex-col shadow-2xl lg:hidden overflow-y-auto"
                        >
                            <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-white/10">
                                <span className="text-2xl font-black italic text-brand-charcoal dark:text-white">Menú</span>
                                <button onClick={() => setIsMenuOpen(false)} className="text-2xl text-gray-400 hover:text-brand-green">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="flex flex-col py-4">
                                {navItems.map(item => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-6 py-4 border-b border-gray-50 dark:border-white/5 text-sm font-bold uppercase text-brand-charcoal dark:text-brand-cream hover:text-brand-green flex items-center justify-between"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </header>
    );
};

export default Navbar;
