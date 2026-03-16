import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-white/40 dark:bg-brand-charcoal/80 backdrop-blur-2xl border-t border-brand-charcoal/5 dark:border-brand-cream/5 transition-all duration-700">
            <div className="container mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-black tracking-tighter mb-2">
                            <span className="text-brand-charcoal dark:text-brand-cream opacity-90">LOGO</span>
                            <span className="text-brand-green italic ml-1">Energy</span>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-charcoal/30 dark:text-brand-cream/30">Lujo sostenible para todos</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                        <a href="/" className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green transition-colors">Inicio</a>
                        <a href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green transition-colors">Tienda</a>
                        <a href="/bestsellers" className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green transition-colors">Elite</a>
                        <a href="/sale" className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green transition-colors">Gangazos</a>
                    </div>

                    <div className="flex space-x-10">
                        <a href="#" className="text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green dark:hover:text-brand-green transition-all duration-500 hover:scale-125">
                            <FontAwesomeIcon icon={faFacebook} className="text-xl" />
                        </a>
                        <a href="#" className="text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green dark:hover:text-brand-green transition-all duration-500 hover:scale-125">
                            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
                        </a>
                        <a href="#" className="text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green dark:hover:text-brand-green transition-all duration-500 hover:scale-125">
                            <FontAwesomeIcon icon={faTwitter} className="text-xl" />
                        </a>
                    </div>

                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-charcoal/20 dark:text-brand-cream/20 text-center md:text-right leading-loose">
                        &copy; 2026 <span className="text-brand-green">LOGO Energy</span><br />
                        <span className="opacity-50">Todos los derechos reservados</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;

