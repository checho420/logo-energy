import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSolarPanel, 
    faTools, 
    faHardHat, 
    faMicrochip, 
    faTruckFast,
    faCheckCircle,
    faGear,
    faShieldHalved,
    faQuoteLeft
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const businessLines = [
        { label: 'Energía Solar', icon: faSolarPanel },
        { label: 'Obras Civiles', icon: faHardHat },
        { label: 'Ferretería', icon: faTools },
        { label: 'Tecnología', icon: faMicrochip },
        { label: 'Servicios Logísticos', icon: faTruckFast },
    ];

    const pillars = [
        { label: 'Técnico', icon: faGear, desc: 'Excelencia en cada especificación.' },
        { label: 'Eficiente', icon: faCheckCircle, desc: 'Optimización de recursos y tiempos.' },
        { label: 'Confiable', icon: faShieldHalved, desc: 'Respaldo absoluto en cada proyecto.' }
    ];

    return (
        <div className="bg-white dark:bg-[#1A1D1E] overflow-x-hidden min-h-screen">
            {/* Minimal Hero Section */}
            <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-green to-transparent opacity-50"
                />
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-8xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter uppercase leading-none mb-12"
                >
                    Quiénes <span className="text-brand-green italic">Somos</span>
                </motion.h1>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl"
                >
                    <p className="text-lg md:text-xl text-brand-charcoal dark:text-brand-cream font-medium leading-relaxed">
                        Somos una <span className="font-black text-brand-green">EMPRESA DISTRIBUIDORA MULTIMARCA</span> especializada en productos y soluciones integrales.
                    </p>
                </motion.div>
            </section>

            {/* Business Lines Grid */}
            <section className="container mx-auto px-6 py-20 border-t border-gray-100 dark:border-white/5">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {businessLines.map((line, i) => (
                        <motion.div
                            key={line.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 px-6 py-4 rounded-full border border-transparent hover:border-brand-green/30 transition-all group"
                        >
                            <FontAwesomeIcon icon={line.icon} className="text-[#AC192C] group-hover:scale-120 transition-transform" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-charcoal dark:text-brand-cream">
                                {line.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Focus Section */}
            <section className="bg-brand-charcoal dark:bg-[#151718] py-32 px-6">
                <div className="container mx-auto text-center max-w-4xl">
                    <motion.div {...fadeIn}>
                        <h2 className="text-white text-2xl md:text-3xl font-light mb-16 leading-relaxed">
                            Atendemos <span className="font-black italic text-brand-green">necesidades comerciales y de proyectos</span> con un enfoque:
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {pillars.map((pillar, i) => (
                                <motion.div 
                                    key={pillar.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-6 border border-brand-green/20">
                                        <FontAwesomeIcon icon={pillar.icon} className="text-2xl text-[#AC192C]" />
                                    </div>
                                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-4">{pillar.label}</h3>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">{pillar.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Strategic Partners Section */}
            <section className="container mx-auto px-6 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div {...fadeIn}>
                        <h2 className="text-4xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tighter mb-8">
                            Alianzas que <br />
                            <span className="text-brand-green">Garantizan Éxito</span>
                        </h2>
                        <div className="h-1 w-20 bg-brand-green mb-8" />
                        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8">
                            Trabajamos con <span className="font-bold text-brand-charcoal dark:text-brand-cream">marcas reconocidas y aliados estratégicos</span> para garantizar soluciones funcionales, escalables y alineadas a las necesidades reales de cada cliente.
                        </p>
                        <div className="p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border-l-8 border-brand-green">
                            <p className="text-brand-charcoal dark:text-brand-cream font-bold italic">
                                "Nuestra misión es conectar la mejor tecnología del mercado con el proyecto que la requiere."
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {/* Interactive decorative tiles representing the "multibrand" concept */}
                        <div className="aspect-square bg-brand-green/5 dark:bg-brand-green/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center border border-brand-green/10">
                            <span className="text-3xl font-black text-brand-green mb-2">+50</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 dark:text-brand-cream/50">Marcas Líderes</span>
                        </div>
                        <div className="aspect-square bg-brand-charcoal dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-white">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-4 text-[#AC192C]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Soluciones Reales</span>
                        </div>
                        <div className="col-span-2 aspect-[2/1] bg-gray-50 dark:bg-black/20 rounded-3xl flex items-center justify-center border border-gray-100 dark:border-white/5">
                            <span className="text-xs font-black uppercase tracking-[0.5em] text-brand-charcoal/20 dark:text-brand-cream/20">Logo Energy Multimarca</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="bg-gray-50 dark:bg-[#151718] py-20 px-6 text-center">
                <motion.div {...fadeIn}>
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl text-brand-green/10 mb-8" />
                    <h2 className="text-xl md:text-2xl font-black text-brand-charcoal dark:text-brand-cream uppercase tracking-tight max-w-2xl mx-auto italic">
                        Soluciones funcionales, escalables y alineadas a cada cliente.
                    </h2>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
