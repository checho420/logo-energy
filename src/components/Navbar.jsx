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
            { label: 'Visión General', path: '/admin', icon: faHome },
            { label: 'Logística', path: '/admin/orders', icon: faStore },
            { label: 'Inventario', path: '/admin/products', icon: faTag },
            { label: 'Audiencia', path: '/admin/customers', icon: faUser },
        ]
        : [
            { label: 'Inicio', path: '/', icon: faHome },
            { label: 'Quienes Somos', path: '/about', icon: faCrown },
            { label: 'Tienda', path: '/catalog', icon: faStore },
            { label: 'Ofertas Especiales', path: '/catalog', icon: faTag }
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
                {/* Left: Social Icons */}
                <div className="flex gap-4 opacity-90 items-center">
                    {[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((icon, idx) => (
                        <motion.button 
                            key={idx}
                            whileHover={{ scale: 1.3, color: '#FFFFFF', rotate: 10 }}
                            className="text-[12px] outline-none"
                        >
                            <FontAwesomeIcon icon={icon} />
                        </motion.button>
                    ))}
                </div>

                {/* Center: Contact Info */}
                <div className="hidden sm:flex items-center gap-2 font-bold tracking-widest uppercase bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm border border-white/5 mx-4">
                    <FontAwesomeIcon icon={faPhoneVolume} className="text-[10px] animate-pulse" />
                    <span>Llámanos ahora</span>
                    <a href="tel:+573217864103" className="hover:text-brand-charcoal transition-colors ml-1">+57 321 786 4103</a>
                </div>

                {/* Right: Shop Link */}
                <div className="flex items-center gap-2 font-bold tracking-widest uppercase">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-[10px]" />
                    <Link to="/catalog" className="underline hover:text-white/80 transition-colors">Comprar ahora</Link>
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
                {/* Desktop Menu */}
                <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
                    {navItems.map((item, idx) => (
                        <Link
                            key={`${item.path}-${idx}`}
                            to={item.path}
                            className={`text-[11px] font-bold uppercase tracking-widest text-brand-charcoal dark:text-brand-cream hover:text-brand-green transition-all duration-300 relative group flex items-center gap-2 ${
                                location.pathname === item.path ? 'text-brand-green' : ''
                            }`}
                        >
                            <motion.div 
                                className="flex items-center gap-2"
                                whileHover="hover"
                            >
                                <motion.span
                                    variants={{
                                        hover: { scale: 1.3, rotate: 10, color: '#D31A20' }
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                >
                                    <FontAwesomeIcon icon={item.icon} className="text-[14px]" />
                                </motion.span>
                                {item.label}
                            </motion.div>
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full ${
                                location.pathname === item.path ? 'w-full' : ''
                            }`}></span>
                        </Link>
                    ))}
                </nav>

                {/* Contact & Icons */}
                <div className="flex lg:flex-none justify-end items-center gap-6 lg:gap-10">
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
                                <span className="absolute -top-2 -right-2 bg-[#D31A20] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">
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
                            className="text-2xl ml-2 outline-none lg:hidden"
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
                                    className="px-6 py-4 border-b border-gray-50 dark:border-white/5 text-sm font-bold uppercase text-brand-charcoal dark:text-brand-cream hover:text-brand-green flex items-center group transition-all"
                                >
                                    <motion.div 
                                        className="flex items-center gap-4 w-full"
                                        whileHover="hover"
                                    >
                                        <motion.span
                                            variants={{
                                                hover: { scale: 1.2, rotate: 5, color: '#D31A20' }
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                            className="text-lg w-6 text-brand-green/70 flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={item.icon} />
                                        </motion.span>
                                        <motion.span 
                                            variants={{ hover: { x: 10 } }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="flex-1"
                                        >
                                            {item.label}
                                        </motion.span>
                                        <FontAwesomeIcon icon={faBars} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]" />
                                    </motion.div>
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
