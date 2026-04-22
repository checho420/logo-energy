import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSun } from '@fortawesome/free-solid-svg-icons';

import robotLight from '../assets/ui/robot-404-light.png';
import robotDark from '../assets/ui/robot-404-dark.png';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-brand-cream dark:bg-brand-charcoal flex flex-col items-center justify-center p-6 text-center">
            <div className="container max-w-4xl mx-auto flex flex-col items-center">
                {/* Animated Image Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-lg aspect-square mb-8 group"
                >
                    {/* Minimalist aura */}


                    <img
                        src={robotLight}
                        alt="Robot 404 Light"
                        className="absolute inset-0 z-10 w-full h-full object-contain mix-blend-multiply dark:opacity-0 transition-opacity duration-500 p-4 transform group-hover:scale-105"
                    />

                    <img
                        src={robotDark}
                        alt="Robot 404 Dark"
                        className="absolute inset-0 z-10 w-full h-full object-contain mix-blend-screen opacity-0 dark:opacity-100 transition-opacity duration-500 p-4 transform group-hover:scale-105"
                    />
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-6"
                >
                    <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter text-brand-charcoal dark:text-brand-cream opacity-10 leading-none">
                        404
                    </h1>

                    <div className="relative -mt-10 md:-mt-16">
                        <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-brand-charcoal dark:text-brand-cream mb-4">
                            Energía Agotada
                        </h2>
                        <p className="max-w-md mx-auto text-brand-charcoal/60 dark:text-brand-cream/60 font-medium leading-relaxed">
                            Nuestro robot de exploración se quedó sin sol. La página que buscas no existe o se ha movido a una dimensión con mejor clima.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            to="/"
                            className="group flex items-center gap-3 bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal px-8 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-brand-green dark:hover:bg-brand-green hover:text-white transition-all shadow-2xl active:scale-95"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-2 transition-transform" />
                            Volver al Inicio
                        </Link>

                        <Link
                            to="/catalog"
                            className="group flex items-center gap-3 bg-white dark:bg-brand-charcoal/50 border border-brand-charcoal/10 dark:border-brand-cream/10 text-brand-charcoal dark:text-brand-cream px-8 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:border-brand-green transition-all active:scale-95"
                        >
                            <FontAwesomeIcon icon={faSun} className="group-hover:rotate-12 transition-transform text-brand-green" />
                            Buscar Energía
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
