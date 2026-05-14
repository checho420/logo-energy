import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch, faUser, faShoppingCart, faBars, faTimes,
    faHome, faStore, faCrown, faTag, faPhoneVolume, faSun, faMoon,
    faChartLine, faTruck, faBoxesStacked, faUsers, faCircleInfo
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
            { label: 'Tienda', path: '/shop', icon: faStore },
            { label: 'Ofertas Especiales', path: '/shop', icon: faTag }
        ];

    return (
        <>
            <header key={theme} className={`w-full fixed top-0 z-50 transition-all duration-700 ease-in-out ${scrolled
                    ? 'bg-white/70 dark:bg-[#1A1D1E]/70 backdrop-blur-2xl shadow-xl py-1'
                    : 'bg-transparent py-4'
                }`}>
                {/* Top Utility Bar */}
                <motion.div
                    initial={false}
                    animate={{
                        height: scrolled ? 0 : 'auto',
                        opacity: scrolled ? 0 : 1
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                >
                    <div className="bg-brand-green text-white py-1.5 px-8 flex justify-between items-center text-[10px] tracking-[0.1em] font-medium border-b border-white/5">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <FontAwesomeIcon icon={faPhoneVolume} className="text-[9px] text-white/70 group-hover:text-white transition-colors" />
                            <span className="opacity-80 group-hover:opacity-100 transition-opacity uppercase">Llámanos:</span>
                            <a href="tel:+573217864103" className="font-bold">+57 321 786 4103</a>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex gap-4 items-center pr-6 border-r border-white/10">
                                {[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((icon, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ y: -2, color: '#FFFFFF' }}
                                        className="text-[11px] opacity-70 hover:opacity-100 transition-all"
                                    >
                                        <FontAwesomeIcon icon={icon} />
                                    </motion.button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 group">
                                <FontAwesomeIcon icon={faShoppingCart} className="text-[9px] opacity-70 group-hover:text-white group-hover:scale-110 transition-all" />
                                <Link to="/shop" className="font-bold uppercase hover:underline decoration-1 underline-offset-4">Comprar ahora</Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Middle Navbar */}
                <div className={`container mx-auto px-10 transition-all duration-700 ${scrolled ? 'py-3' : 'py-6'} flex items-center justify-between gap-8`}>
                    {/* 1. Balanced Left Area: Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="group flex flex-col items-start leading-none gap-0">
                            <motion.div 
                                className="flex flex-col items-start"
                                initial="initial"
                                whileHover="hover"
                                animate={{ 
                                    scale: scrolled ? 0.75 : 1,
                                    y: scrolled ? -2 : 0
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                variants={{
                                    hover: { 
                                        scale: 1.1,
                                        y: 0,
                                        transition: { type: 'spring', stiffness: 400, damping: 15 }
                                    }
                                }}
                            >
                                <span className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-brand-charcoal dark:text-white mb-0.5">
                                    LOGO
                                </span>
                                <motion.span 
                                    variants={{
                                        initial: { letterSpacing: '0.55em', y: 0 },
                                        hover: { 
                                            letterSpacing: '0.85em', 
                                            y: -2,
                                            color: '#3E7136',
                                            transition: { duration: 0.4, ease: "easeOut" }
                                        }
                                    }}
                                    className="text-[8px] lg:text-[10px] font-bold uppercase text-brand-green -mt-1 pl-0.5"
                                >
                                    ENERGY
                                </motion.span>
                            </motion.div>
                        </Link>
                    </div>

                    {/* 2. Balanced Center Area: Menu */}
                    <nav className="hidden lg:flex flex-[2] justify-center items-center gap-10">
                        {navItems.map((item, idx) => (
                            <Link
                                key={`${item.path}-${idx}`}
                                to={item.path}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] ${scrolled ? 'text-brand-charcoal/40 dark:text-brand-cream/40' : 'text-brand-charcoal/70 dark:text-brand-cream/70'} hover:text-brand-green transition-all duration-700 relative group flex items-center gap-2.5 ${location.pathname === item.path ? 'text-brand-green !opacity-100' : ''
                                    }`}
                            >
                                <motion.div
                                    className="flex items-center gap-2"
                                    whileHover="hover"
                                >
                                    <motion.span
                                        variants={{
                                            hover: { scale: 1.2, rotate: 8, color: '#D31A20' }
                                        }}
                                        className="flex items-center"
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="text-[12px]" />
                                    </motion.span>
                                    <span className="group-hover:tracking-[0.25em] transition-all duration-500">{item.label}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </nav>

                    {/* 3. Balanced Right Area: Action Icons */}
                    <div className="flex-1 flex justify-end items-center text-brand-charcoal dark:text-white">
                        <div className="flex items-center gap-6 border-l border-gray-100 dark:border-white/5 pl-10">
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
                            {/* Mobile Hamburger Icon */}
                            <motion.button
                                onClick={() => setIsMenuOpen(true)}
                                animate={{ color: currentIconColor }}
                                whileHover={{ scale: 1.1, color: '#2DD4BF' }}
                                whileTap={{ scale: 0.9 }}
                                className="text-2xl ml-4 outline-none lg:hidden relative z-[60] p-2"
                            >
                                <FontAwesomeIcon icon={faBars} />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </header>

            {/* Mobile Menu Side Drawer */}
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
