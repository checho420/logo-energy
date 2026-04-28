import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, faUser, faShoppingCart, faBars, faTimes, 
    faHome, faStore, faCrown, faTag, faPhoneVolume, faSun, faMoon 
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { toggleCart, itemCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentIconColor = theme === 'dark' ? '#FFFFFF' : '#0B0D0E';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            { label: 'Catálogo', path: '/catalog' },
            { label: 'Ofertas Especiales', path: '/catalog' }
        ];

    return (
        <>
        <header key={theme} className={`w-full sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/70 dark:bg-[#1A1D1E]/70 backdrop-blur-md shadow-md py-0' 
                : 'bg-white dark:bg-[#1A1D1E] shadow-sm py-2'
        }`}>
            {/* Top Green Bar */}
            <div className="bg-brand-green text-white py-2 px-6 flex justify-between items-center text-[10px] md:text-xs">
                <div className="hidden md:flex gap-4 font-semibold opacity-90">
                    <span className="cursor-pointer">ESPAÑOL ▾</span>
                    <span className="cursor-pointer">COP ▾</span>
                </div>
                <div className="flex-1 text-center font-bold tracking-widest uppercase">
                    OBTÉN HASTA <span className="bg-white text-brand-green px-1 mx-1 rounded-sm">40% OFF</span> EN NUEVOS ESTILOS <Link to="/sale" className="underline ml-2 hover:text-brand-charcoal transition-colors">COMPRAR AHORA</Link>
                </div>
                <div className="hidden xl:flex gap-6 font-semibold opacity-90 items-center">
                    {['Mi Cuenta', 'Contáctanos', 'Blog', 'Mi Lista de Deseos'].map((text) => (
                        <Link key={text} to="#" className="hover:text-brand-charcoal transition-colors hover:scale-105 transform inline-block">{text}</Link>
                    ))}
                    <button onClick={() => setIsLoginOpen(true)} className="hover:text-brand-charcoal transition-colors hover:scale-105 transform">Iniciar Sesión</button>
                    <div className="flex gap-4 ml-4 border-l border-white/20 pl-4">
                        {[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((icon, idx) => (
                            <motion.button 
                                key={idx}
                                whileHover={{ scale: 1.3, color: '#3E7136', rotate: 10 }}
                                className="text-sm outline-none"
                            >
                                <FontAwesomeIcon icon={icon} />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle White Bar */}
            <div className="container mx-auto px-6 py-6 flex justify-between items-center gap-4">
                {/* Logo */}
                <div className="flex justify-start">
                    <Link to="/" className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-brand-charcoal dark:text-brand-cream flex items-center gap-2 group">
                        LOGO<span className="text-brand-green italic group-hover:scale-105 transition-transform">Energy</span>
                    </Link>
                </div>

                {/* Contact & Icons */}
                <div className="flex flex-1 justify-end items-center gap-6 lg:gap-10">
                    <div className="hidden lg:flex items-center gap-3">
                        <FontAwesomeIcon icon={faPhoneVolume} className="text-3xl text-brand-charcoal dark:text-white" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-brand-charcoal/50 dark:text-white/50 font-bold uppercase tracking-widest leading-none mb-1">Llámanos Ahora</span>
                            <span className="font-black text-brand-charcoal dark:text-white text-lg leading-none">+123 5678 890</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-brand-charcoal dark:text-white">
                        {/* Theme Toggle */}
                        <motion.button 
                            onClick={toggleTheme} 
                            animate={{ color: currentIconColor }}
                            whileHover={{ scale: 1.2, rotate: 180, color: '#3E7136' }}
                            whileTap={{ scale: 0.9 }}
                            className="transition-colors hidden md:block outline-none"
                        >
                            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-xl" />
                        </motion.button>

                        {/* User Icon */}
                        <motion.button 
                            onClick={() => setIsLoginOpen(true)} 
                            animate={{ color: currentIconColor }}
                            whileHover={{ scale: 1.2, color: '#3E7136' }}
                            whileTap={{ scale: 0.9 }}
                            className="transition-colors hidden md:block outline-none"
                        >
                            <FontAwesomeIcon icon={faUser} className="text-xl" />
                        </motion.button>

                        {/* Wishlist Icon */}
                        <motion.button 
                            animate={{ color: currentIconColor === '#FFFFFF' ? '#FFFFFF' : currentIconColor }}
                            whileHover={{ scale: 1.2, color: '#D31A20' }}
                            whileTap={{ scale: 0.9 }}
                            className="transition-colors hidden md:block relative outline-none"
                        >
                            <FontAwesomeIcon icon={faHeart} className="text-xl" />
                        </motion.button>

                        {/* Cart Icon */}
                        <motion.button 
                            onClick={toggleCart} 
                            animate={{ color: currentIconColor }}
                            whileHover={{ scale: 1.1, rotate: -10, color: '#3E7136' }}
                            whileTap={{ scale: 0.9 }}
                            className="transition-colors relative flex items-center outline-none"
                        >
                            <div className="relative">
                                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                                <span className="absolute -top-2 -right-2 bg-brand-green text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">
                                    {itemCount}
                                </span>
                            </div>
                        </motion.button>

                        {/* Hamburger Icon */}
                        <motion.button 
                            onClick={() => setIsMenuOpen(true)} 
                            animate={{ color: currentIconColor }}
                            whileHover={{ scale: 1.1, x: 5, color: '#3E7136' }}
                            whileTap={{ scale: 0.9 }}
                            className="text-2xl ml-2 outline-none"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Menu - Hidden as per request for unified hamburger experience */}
            <div className="hidden border-t border-brand-charcoal/5 dark:border-white/5 bg-transparent">
                <nav className="container mx-auto px-6 flex justify-center space-x-10 py-4">
                    {navItems.map((item, idx) => (
                        <Link
                            key={`${item.path}-${idx}`}
                            to={item.path}
                            className={`text-[11px] font-bold uppercase tracking-widest text-brand-charcoal dark:text-brand-cream hover:text-brand-green transition-colors ${location.pathname === item.path ? 'text-brand-green' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </header>

        {/* Mobile Menu - Moved outside header to avoid stacking context issues */}
        <AnimatePresence>
            {isMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[400]"
                    />
                    <motion.div
                        key={theme}
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white/70 dark:bg-[#1A1D1E]/70 backdrop-blur-xl z-[401] flex flex-col shadow-2xl overflow-y-auto"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-white/10">
                            <span className="text-2xl font-black italic text-brand-charcoal dark:text-white">Menú</span>
                            <div className="flex items-center gap-6">
                                <motion.button 
                                    onClick={toggleTheme} 
                                    animate={{ color: currentIconColor }}
                                    whileHover={{ scale: 1.2, rotate: 180, color: '#3E7136' }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-2xl outline-none"
                                >
                                    <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                                </motion.button>
                                <button 
                                    onClick={() => setIsMenuOpen(false)} 
                                    className="group p-2 transition-all outline-none"
                                >
                                    <FontAwesomeIcon 
                                        icon={faTimes} 
                                        className="text-2xl text-gray-400 dark:text-gray-500 transition-all duration-300 transform group-hover:text-[#D31A20] group-hover:scale-125 group-hover:rotate-90"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col py-4">
                            {navItems.map((item, idx) => (
                                <Link
                                    key={`${item.path}-${idx}`}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-6 py-4 border-b border-gray-50 dark:border-white/5 text-sm font-bold uppercase text-brand-charcoal dark:text-brand-cream hover:text-brand-green flex items-center justify-between group transition-all"
                                >
                                    <motion.span 
                                        whileHover={{ x: 10 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                    <FontAwesomeIcon icon={faBars} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
        </>
    );
};

export default Navbar;
