import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlug, faSun, faTools, faBatteryFull } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const categories = [
    {
        id: 'electro',
        title: 'Electrodomésticos',
        description: 'Innovación y eficiencia para tu hogar con energía limpia.',
        link: '/shop?category=electrodomesticos',
        icon: faPlug,
        color: 'bg-blue-600',
        borderColor: 'hover:border-blue-600/20'
    },
    {
        id: 'solar',
        title: 'Energía Solar',
        description: 'Potencia ilimitada con tecnología solar de última generación.',
        link: '/shop?category=energia-solar',
        icon: faSun,
        color: 'bg-brand-green',
        borderColor: 'hover:border-brand-green/20'
    },
    {
        id: 'ferre',
        title: 'Ferretería',
        description: 'Herramientas y kits profesionales para instalaciones seguras.',
        link: '/shop?category=ferreteria',
        icon: faTools,
        color: 'bg-orange-500',
        borderColor: 'hover:border-orange-500/20'
    },
    {
        id: 'estaciones',
        title: 'Estaciones Pro',
        description: 'Respaldo energético constante para tus aventuras and trabajo.',
        link: '/shop?category=estaciones',
        icon: faBatteryFull,
        color: 'bg-brand-charcoal',
        borderColor: 'hover:border-brand-charcoal/20'
    }
];

const CategoryGrid = () => {
    return (
        <section className="container mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className={`group relative h-[280px] bg-white border border-gray-100 dark:bg-transparent dark:border-white/5 rounded-none p-10 overflow-hidden transition-all duration-700 ${cat.borderColor} hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]`}
                    >
                        {/* Elegant Design Lines */}
                        <div className={`absolute top-0 left-0 w-full h-[5px] ${cat.color} transform origin-left transition-transform duration-700 scale-x-0 group-hover:scale-x-100`} />
                        <div className={`absolute top-0 left-0 w-[5px] h-full ${cat.color} transform origin-top transition-transform duration-700 delay-100 scale-y-0 group-hover:scale-y-100`} />
                        
                        {/* Subtle Background Icon - Right Side */}
                        <div className="absolute -bottom-8 -right-8 text-[140px] opacity-[0.03] text-brand-charcoal dark:text-white group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-1000 transform rotate-12">
                            <FontAwesomeIcon icon={cat.icon} />
                        </div>

                        <div className="relative z-10 h-full flex flex-col max-w-[80%]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                            >
                                <h3 className="text-2xl md:text-3xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter uppercase italic leading-none mb-4">
                                    {cat.title}
                                </h3>
                                <p className="text-gray-400 dark:text-gray-500 text-[13px] font-medium leading-relaxed mb-6 border-l-2 border-gray-100 dark:border-white/10 pl-6">
                                    {cat.description}
                                </p>
                            </motion.div>
                            
                            <Link 
                                to={cat.link}
                                className="mt-auto group/link flex items-center gap-6"
                            >
                                <div className={`w-10 h-[2px] ${cat.color} group-hover/link:w-16 transition-all duration-700`} />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-charcoal dark:text-brand-cream">
                                    Explorar
                                </span>
                                <FontAwesomeIcon 
                                    icon={faArrowRight} 
                                    className={`text-[11px] transform -rotate-45 group-hover/link:rotate-0 group-hover/link:translate-x-2 transition-all duration-500`}
                                    style={{ color: 'var(--brand-green)' }}
                                />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
