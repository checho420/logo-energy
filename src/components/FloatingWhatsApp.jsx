import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const FloatingWhatsApp = () => {
    return (
        <div className="fixed bottom-10 right-10 z-[9999] flex items-center justify-center">
            {/* Elegant Wave/Pulse Effect - Subtle and sophisticated */}
            {[1, 2].map((i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ 
                        scale: [1, 1.6], 
                        opacity: 0 
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 1.5,
                        ease: "easeOut" 
                    }}
                    className="absolute w-14 h-14 bg-[#25D366] rounded-full"
                />
            ))}

            <motion.a
                href="https://wa.me/3245452771"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                }}
                whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0px 15px 35px rgba(37, 211, 102, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-[#25D366] text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg outline-none"
                title="Escríbenos"
            >
                <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
            </motion.a>
        </div>
    );
};

export default FloatingWhatsApp;
