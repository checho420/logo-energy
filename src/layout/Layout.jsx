import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col bg-brand-cream dark:bg-brand-charcoal transition-colors duration-1000 font-sans">
            <Navbar />
            <CartSidebar />
            <main className={`flex-grow transition-all duration-700 ${isHome ? 'pt-0' : 'pt-20'}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;

