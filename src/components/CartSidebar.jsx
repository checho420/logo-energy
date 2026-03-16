import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const CartSidebar = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, total } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-[200]"
                    />

                    {/* Drawer */}
                    <motion.div
                        key="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-brand-cream dark:bg-brand-charcoal z-[201] flex flex-col shadow-2xl transition-colors duration-700"
                    >
                        <div className="p-10 flex justify-between items-center border-b border-brand-charcoal/5 dark:border-brand-cream/5">
                            <div>
                                <h2 className="text-3xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter">Tu Carrito</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-charcoal/30 dark:text-brand-cream/30 mt-1">Lujo Sostenible</p>
                            </div>
                            <button onClick={toggleCart} className="w-12 h-12 flex items-center justify-center bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full text-brand-charcoal dark:text-brand-cream hover:bg-brand-green hover:text-brand-cream transition-all active:scale-95 shadow-inner">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full flex items-center justify-center mb-6">
                                        <FontAwesomeIcon icon={faTrash} className="text-2xl text-brand-charcoal/10" />
                                    </div>
                                    <h3 className="text-xl font-black text-brand-charcoal/40 dark:text-brand-cream/40 italic">Aún no hay tesoros aquí.</h3>
                                    <button onClick={toggleCart} className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-brand-green hover:tracking-[0.5em] transition-all">Seguir Explorando</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-6 group"
                                    >
                                        <div className="relative w-28 h-28 flex-shrink-0">
                                            <img
                                                src={item.images?.[0] || item.imagenes?.[0] || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-[1.5rem] border border-brand-charcoal/10 dark:border-brand-cream/10 shadow-sm"
                                            />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-center">
                                            <h4 className="text-sm font-black text-brand-charcoal dark:text-brand-cream line-clamp-2 mb-2 tracking-tight italic">{item.name}</h4>
                                            <p className="text-xs font-black text-brand-green mb-4">{formatCurrency(item.price)}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-2xl px-4 py-2 border border-brand-charcoal/5 dark:border-brand-cream/5 shadow-inner">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green transition-colors font-black"><FontAwesomeIcon icon={faMinus} className="text-[10px]" /></button>
                                                    <span className="text-xs font-black dark:text-brand-cream px-2">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-green transition-colors font-black"><FontAwesomeIcon icon={faPlus} className="text-[10px]" /></button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-12 h-12 flex items-center justify-center text-brand-red/40 hover:text-brand-red hover:bg-brand-red/10 rounded-2xl transition-all duration-300 group/delete active:scale-90"
                                                    title="Quitar de la bolsa"
                                                >
                                                    <motion.div whileHover={{ x: [-1, 1, -1, 1, 0], rotate: [-5, 5, -5, 5, 0] }}>
                                                        <FontAwesomeIcon icon={faTrash} className="text-base" />
                                                    </motion.div>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-10 border-t border-brand-charcoal/5 dark:border-brand-cream/5 bg-brand-cream/50 dark:bg-brand-charcoal/50 backdrop-blur-xl">
                                <div className="flex justify-between items-end mb-10">
                                    <div>
                                        <span className="text-[10px] font-black text-brand-charcoal/30 dark:text-brand-cream/30 uppercase tracking-[0.4em]">Subtotal</span>
                                        <p className="text-xs text-brand-charcoal/20 dark:text-brand-cream/20 font-bold mt-1">Impuestos incluidos</p>
                                    </div>
                                    <span className="text-3xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter">{formatCurrency(total)}</span>
                                </div>
                                <Link
                                    to="/checkout"
                                    onClick={toggleCart}
                                    className="block w-full text-center bg-brand-red text-brand-cream py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-maroon hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-green/30"
                                >
                                    Finalizar Compra
                                </Link>
                                <p className="text-center text-[8px] font-black text-brand-charcoal/20 dark:text-brand-cream/20 uppercase tracking-widest mt-6">Envío gratuito a toda Colombia</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;

