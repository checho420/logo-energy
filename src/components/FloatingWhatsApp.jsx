import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const FloatingWhatsApp = () => {
    return (
        <div className="fixed bottom-8 right-8 z-[1000]">
            <motion.a
                href="https://wa.me/3245452771"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                    scale: 1.1,
                    shadow: "0 0 30px rgba(59, 130, 48, 0.4)" 
                }}
                whileTap={{ scale: 0.9 }}
                className="group relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/80 dark:bg-[#1A1D1E]/80 backdrop-blur-2xl rounded-full border border-gray-100 dark:border-white/10 shadow-2xl transition-all duration-500 overflow-hidden"
            >
                {/* Subtle Breathing Glow Effect */}
                <motion.div 
                    animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1] 
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-brand-green/20 rounded-full"
                />

                {/* Rotating Border on Hover */}
                <div className="absolute inset-[-2px] bg-gradient-to-tr from-brand-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                <FontAwesomeIcon 
                    icon={faWhatsapp} 
                    className="text-2xl md:text-3xl text-brand-green z-10 group-hover:scale-110 transition-transform duration-500"
                />

                {/* Satellite Live Dot */}
                <div className="absolute top-2 right-2 z-20">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
                    </span>
                </div>
            </motion.a>
        </div>
    );
};

export default FloatingWhatsApp;
