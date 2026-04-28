import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlug, faSun, faHammer, faBatteryFull } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const categories = [
    {
        id: 'electro',
        title: 'Electrodomésticos',
        description: 'Innovación y eficiencia para tu hogar con energía limpia.',
        link: '/catalog?category=electrodomesticos',
        image: 'assets/products/fan-front.png',
        icon: faPlug,
        color: 'bg-blue-600',
        borderColor: 'hover:border-blue-600/20',
        imgClass: 'w-56 -bottom-4 -right-4'
    },
    {
        id: 'solar',
        title: 'Energía Solar',
        description: 'Potencia ilimitada con tecnología solar de última generación.',
        link: '/catalog?category=energia-solar',
        image: 'assets/products/luminary-front-300.jpg',
        icon: faSun,
        color: 'bg-brand-green',
        borderColor: 'hover:border-brand-green/20',
        imgClass: 'w-56 -bottom-8 -right-8'
    },
    {
        id: 'ferre',
        title: 'Ferretería',
        description: 'Herramientas y kits profesionales para instalaciones seguras.',
        link: '/catalog?category=ferreteria',
        image: 'assets/products/luminary-tools-300.jpg',
        icon: faHammer,
        color: 'bg-orange-500',
        borderColor: 'hover:border-orange-500/20',
        imgClass: 'w-52 -bottom-2 -right-2'
    },
    {
        id: 'estaciones',
        title: 'Estaciones Pro',
        description: 'Respaldo energético constante para tus aventuras and trabajo.',
        link: '/catalog?category=estaciones',
        image: 'assets/products/estacion-frente.jpg',
        icon: faBatteryFull,
        color: 'bg-brand-charcoal',
        borderColor: 'hover:border-brand-charcoal/20',
        imgClass: 'w-60 -bottom-6 -right-10'
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
                        className={`group relative h-[320px] bg-white border border-gray-100 dark:bg-transparent dark:border-white/5 rounded-none p-10 overflow-hidden transition-all duration-700 ${cat.borderColor} hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]`}
                    >
                        {/* Elegant Design Lines */}
                        <div className={`absolute top-0 left-0 w-full h-[5px] ${cat.color} transform origin-left transition-transform duration-700 scale-x-0 group-hover:scale-x-100`} />
                        <div className={`absolute top-0 left-0 w-[5px] h-full ${cat.color} transform origin-top transition-transform duration-700 delay-100 scale-y-0 group-hover:scale-y-100`} />
                        
                        {/* Subtle Background Icon (Replacing numbers) */}
                        <div className="absolute -bottom-8 -left-8 text-[140px] opacity-[0.03] text-brand-charcoal dark:text-white group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-1000 transform -rotate-12">
                            <FontAwesomeIcon icon={cat.icon} />
                        </div>

                        <div className="relative z-10 h-full flex flex-col max-w-[62%]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                            >
                                <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal dark:text-brand-cream tracking-tighter uppercase italic leading-none mb-4">
                                    {cat.title}
                                </h3>
                                <p className="text-gray-400 dark:text-gray-500 text-[14px] font-medium leading-relaxed mb-6 border-l-2 border-gray-100 dark:border-white/10 pl-6">
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
                        
                        {/* High-end Image interaction */}
                        <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-52 h-52 pointer-events-none">
                            <div className="absolute inset-0 bg-gray-50 dark:bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000 ease-out" />
                            <motion.img 
                                src={cat.image} 
                                alt={cat.title} 
                                className={`absolute inset-0 w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-1000 z-10 p-4 transform group-hover:scale-110 group-hover:-translate-x-4`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
