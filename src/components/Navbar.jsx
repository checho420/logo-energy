import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSun, faMoon, faShoppingCart, faUser, faSearch,
    faBars, faTimes, faHome, faStore, faCrown, faTag
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { toggleCart, itemCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [pastBanner, setPastBanner] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            setPastBanner(window.scrollY > window.innerHeight - 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const isAdmin = location.pathname.startsWith('/admin');

    const navClasses = scrolled
        ? "fixed top-0 w-full z-[100] bg-white/80 dark:bg-brand-charcoal/80 backdrop-blur-2xl border-b border-brand-charcoal/[0.03] dark:border-white/[0.03] transition-all duration-700"
        : "fixed top-0 w-full z-[100] bg-transparent border-b border-transparent transition-all duration-700";

    const isBannerArea = isHome && !pastBanner;
    const textClasses = isBannerArea
        ? "text-brand-cream"
        : "text-brand-charcoal dark:text-brand-cream";

    const navItems = isAdmin
        ? [
            { label: 'Visión General', path: '/admin', icon: faHome },
            { label: 'Logística', path: '/admin/orders', icon: faTag },
            { label: 'Inventario', path: '/admin/products', icon: faStore },
            { label: 'Audiencia', path: '/admin/customers', icon: faUser },
        ]
        : [
            { label: 'Inicio', path: '/', icon: faHome },
            { label: 'La Tienda', path: '/catalog', icon: faStore },
            { label: 'Lo Más Pro', path: '/bestsellers', icon: faCrown },
            { label: 'Gangazos', path: '/sale', icon: faTag }
        ];

    const menuVariants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: { type: 'spring', damping: 30, stiffness: 200, staggerChildren: 0.1 }
        },
        exit: { x: '100%' }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
    };

    const ThemeToggle = ({ className = "" }) => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-green/20' : 'bg-brand-charcoal/10'
                } ${className}`}
        >
            <motion.div
                animate={{ x: theme === 'dark' ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center text-white text-xs shadow-lg"
            >
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            </motion.div>
        </motion.button>
    );

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={navClasses}
            >
                <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                    {/* Brand */}
                    <Link to="/" className="z-[300]">
                        <motion.div
                            className="flex items-center gap-2 group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <span className={`text-2xl font-black uppercase tracking-tighter ${textClasses}`}>
                                LOGO
                            </span>
                            <span className="text-brand-green text-2xl font-black italic">
                                Energy
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Menu */}
                    {!isAdmin && (
                        <nav className="hidden xl:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
                            {navItems.map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`${textClasses} text-[11px] font-bold uppercase tracking-[0.25em] transition-all relative group flex items-center gap-3`}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="text-lg opacity-40 group-hover:opacity-100 group-hover:text-brand-green transition-all duration-300"
                                    />
                                    <span className="group-hover:text-brand-charcoal dark:group-hover:text-brand-cream transition-colors">
                                        {item.label}
                                    </span>
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-green transition-all duration-500 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Toolbar Icons */}
                    <div className="flex items-center space-x-4 md:space-x-8">
                        <motion.button whileHover={{ scale: 1.1 }} className={`${textClasses} opacity-60 hover:opacity-100 hover:text-brand-green hidden md:block transition-colors`}>
                            <FontAwesomeIcon icon={faSearch} className="text-lg" />
                        </motion.button>

                        <ThemeToggle className="hidden md:flex" />

                        <motion.button
                            onClick={toggleCart}
                            whileHover={{ scale: 1.1 }}
                            className={`${textClasses} relative group p-2 flex items-center justify-center`}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} className="text-lg opacity-60 group-hover:opacity-100 group-hover:text-brand-green transition-all" />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 w-4 h-4 bg-brand-green text-brand-cream text-[8px] font-black flex items-center justify-center rounded-full shadow-lg"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <motion.button
                            onClick={() => setIsLoginOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            className={`${textClasses} opacity-60 hover:opacity-100 hover:text-brand-green hidden md:block transition-colors`}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-lg" />
                        </motion.button>

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className={`${textClasses} xl:hidden p-2 hover:text-brand-green transition-colors`}
                        >
                            <FontAwesomeIcon icon={faBars} className="text-2xl" />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-xl z-[400]"
                        />
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed right-0 top-0 h-full w-full max-w-sm bg-brand-cream dark:bg-brand-charcoal z-[401] p-12 flex flex-col justify-between shadow-2xl border-l border-white/10"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-16">
                                    <ThemeToggle />
                                    <button onClick={() => setIsMenuOpen(false)} className="text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green text-2xl transition-all p-2">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>

                                <nav className="flex flex-col gap-6">
                                    {navItems.map((item, idx) => (
                                        <motion.div key={item.path} variants={itemVariants}>
                                            <Link
                                                to={item.path}
                                                className="flex items-center gap-6 group"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-brand-green/5 dark:bg-brand-green/10 flex items-center justify-center text-brand-green text-xl transition-all group-hover:bg-brand-green group-hover:text-white">
                                                    <FontAwesomeIcon icon={item.icon} />
                                                </div>
                                                <span className="text-3xl font-black italic tracking-tighter text-brand-charcoal dark:text-brand-cream group-hover:translate-x-2 transition-transform">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </div>

                            <div className="pt-8 border-t border-brand-charcoal/10 dark:border-white/10 flex flex-col gap-6">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}
                                    className="flex items-center gap-4 text-brand-charcoal/60 dark:text-brand-cream/60 font-black uppercase tracking-[0.2em] text-[10px]"
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    Panel de Control
                                </motion.button>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/20 dark:text-white/20">LOGO ENERGY • 2026</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
};

export default Navbar;
