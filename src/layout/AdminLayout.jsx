import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine, faBox, faSignOutAlt, faHome,
    faClipboardList, faUsers, faBars, faTimes, faArrowLeft,
    faChevronRight, faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth >= 1024);

    const isActive = (path) => {
        return location.pathname === path
            ? "bg-[#0abab5] text-white shadow-lg shadow-[#0abab5]/20"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1b23] hover:text-[#0abab5]";
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Solo cierra el menú si estamos en móvil (ancho menor a 1024px)
    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            closeMenu();
        }
    };

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        window.dispatchEvent(new CustomEvent('admin-scroll', { detail: { scrollTop } }));
    };

    return (
        <div className="bg-[#f8fafc] dark:bg-[#0d0e12] font-sans transition-colors duration-500 min-h-screen">
            <div className="flex relative items-start">
                {/* Minimalist Floating Trigger */}
                <div className="fixed lg:sticky z-[130] pointer-events-none" style={{ top: '50%', transform: 'translateY(-50%)', height: '0' }}>
                    <button
                        onClick={toggleMenu}
                        className={`
                            pointer-events-auto w-10 h-20 flex items-center justify-center
                            bg-white/80 dark:bg-[#1a1b23]/80 backdrop-blur-2xl text-gray-400 shadow-[0_0_30px_rgba(0,0,0,0.1)] border-y border-r
                            border-white/20 dark:border-white/5 transition-all duration-500 ease-in-out
                            ${isMenuOpen
                                ? 'translate-x-[288px] rounded-l-2xl border-l'
                                : 'translate-x-0 rounded-r-2xl border-l-0'
                            }
                        `}
                        aria-label="Toggle CRM Menu"
                    >
                        <FontAwesomeIcon
                            icon={isMenuOpen ? faChevronLeft : faChevronRight}
                            className={`text-sm transition-transform duration-500 ${isMenuOpen ? 'text-[#0abab5] rotate-0' : 'text-[#0abab5]/60 hover:text-[#0abab5]'}`}
                        />
                    </button>
                </div>

                {/* Backdrop for Mobile */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Barra Lateral */}
                <div className={`
                fixed lg:sticky top-0 lg:top-[88px] left-0 bg-white/90 dark:bg-[#111217]/90 backdrop-blur-3xl border-r border-gray-200/20 dark:border-[#1e1f26]/20 flex flex-col z-[120] 
                transition-all duration-500 ease-in-out
                ${isMenuOpen
                        ? 'w-72 translate-x-0 opacity-100 shadow-[20px_0_50px_rgba(0,0,0,0.2)]'
                        : 'w-72 lg:w-0 -translate-x-full lg:translate-x-0 opacity-0 lg:pointer-events-none lg:border-none'
                    }
                h-screen lg:h-[calc(100vh-88px)]
            `}>


                    <div className="h-20 flex items-center justify-between px-8 bg-transparent transition-all duration-500">
                        <h1 className="text-xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">
                            Finance<span className="text-[#0abab5]">Flow</span>
                        </h1>
                        <button onClick={closeMenu} className="lg:hidden text-gray-400 hover:text-red-500 transition-colors">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
                        {[
                            { to: '/admin', icon: faChartLine, label: 'Panel de Control' },
                            { to: '/admin/orders', icon: faClipboardList, label: 'Pedidos' },
                            { to: '/admin/products', icon: faBox, label: 'Productos' },
                            { to: '/admin/customers', icon: faUsers, label: 'Clientes' }
                        ].map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={handleNavClick}
                                className={`flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 font-black uppercase tracking-widest text-[10px] ${isActive(link.to)}`}
                            >
                                <FontAwesomeIcon icon={link.icon} className="w-5 text-sm" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-[#1e1f26]">
                            <button className="flex items-center space-x-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 p-4 rounded-2xl w-full transition-all group">
                                <FontAwesomeIcon icon={faSignOutAlt} className="group-hover:translate-x-1 transition-transform duration-300" />
                                <span className="font-black uppercase tracking-widest text-[10px]">Cerrar Sesión</span>
                            </button>
                        </div>
                    </nav>
                </div>

                <div
                    className={`
                    flex-grow bg-[#f8fafc] dark:bg-[#0d0e12] 
                    pt-28 lg:pt-32 transition-all duration-500 min-h-screen
                `}
                >
                    <main className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto min-h-[calc(100vh-88px)]">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

