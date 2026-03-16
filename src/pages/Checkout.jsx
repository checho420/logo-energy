import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAdmin } from '../context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShoppingBag, faArrowRight, faPrint, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';

const Checkout = () => {
    const { cart, total, clearCart, updateQuantity, removeFromCart } = useCart();
    const { updateProduct, getProductById } = useProducts();
    const { addOrder } = useAdmin();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Process each item to update stock and sold count
            for (const item of cart) {
                const product = getProductById(item.id);
                if (product) {
                    const newStock = Math.max(0, (product.stock || 0) - item.quantity);
                    const newSold = (product.sold || 0) + item.quantity;
                    await updateProduct(item.id, { stock: newStock, sold: newSold });
                }
            }

            // 2. Save order to Admin Context (CRM)
            const orderData = {
                customerName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                address: formData.address,
                items: cart.length,
                total: total,
                orderDetails: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const savedOrder = addOrder(orderData);
            setConfirmedOrder(savedOrder);

            // 3. Show Success Modal
            setShowSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Error processing order:", error);
            alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0 && !showSuccess) {
        return (
            <div className="container mx-auto px-6 py-20 text-center animate-fade-in text-gray-800 dark:text-white">
                <div className="bg-green-50 dark:bg-green-900/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-5xl text-brand-green" />
                </div>
                <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Tu carrito está vacío</h1>
                <p className="text-gray-500 mb-10 max-w-md mx-auto font-bold">Parece que aún no has añadido productos. Explora nuestro catálogo y encuentra las mejores soluciones en energía solar.</p>
                <Link to="/catalog" className="inline-flex bg-brand-green text-white px-10 py-4 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-brand-forest shadow-xl shadow-brand-green/20 transition-all transform hover:-translate-y-1">
                    Volver al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in relative">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-12 italic uppercase tracking-tighter">Finalizar <span className="text-brand-green">Compra</span></h1>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Form */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white dark:bg-[#111217] p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                        <h2 className="text-sm font-black mb-10 dark:text-white flex items-center gap-4 uppercase tracking-[0.3em]">
                            <span className="w-10 h-10 rounded-2xl bg-brand-green text-white flex items-center justify-center text-xs italic shadow-lg shadow-brand-green/20">01</span>
                            Información de Envío
                        </h2>
                        <form id="checkout-form" className="space-y-8" onSubmit={handleConfirmOrder}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full rounded-2xl border-transparent bg-gray-50 dark:bg-white/5 dark:text-white focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all p-4 font-bold text-sm" placeholder="Tu nombre" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Apellido</label>
                                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full rounded-2xl border-transparent bg-gray-50 dark:bg-white/5 dark:text-white focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all p-4 font-bold text-sm" placeholder="Tu apellido" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full rounded-2xl border-transparent bg-gray-50 dark:bg-white/5 dark:text-white focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all p-4 font-bold text-sm" placeholder="ejemplo@correo.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección de Entrega</label>
                                <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full rounded-2xl border-transparent bg-gray-50 dark:bg-white/5 dark:text-white focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all p-4 font-bold text-sm" placeholder="Calle, Número, Ciudad" />
                            </div>
                        </form>

                        <h2 className="text-sm font-black mt-16 mb-10 dark:text-white flex items-center gap-4 uppercase tracking-[0.3em]">
                            <span className="w-10 h-10 rounded-2xl bg-brand-green text-white flex items-center justify-center text-xs italic shadow-lg shadow-brand-green/20">02</span>
                            Método de Pago
                        </h2>
                        <div className="p-10 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[32px] text-center bg-gray-50 dark:bg-white/5 group hover:border-brand-green/30 transition-all">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Selecciona una pasarela de pago segura</p>
                            <div className="flex flex-wrap justify-center gap-10 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                                <span className="font-black text-blue-600 text-2xl tracking-tighter italic">VISA</span>
                                <span className="font-black text-amber-500 text-2xl tracking-tighter italic">Mastercard</span>
                                <span className="font-black text-blue-400 text-2xl tracking-tighter italic">PayPal</span>
                            </div>
                            <p className="text-[9px] text-gray-400 mt-8 font-black uppercase tracking-widest">(Simulación: El pago se procesará como exitoso)</p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-[#111217] text-white p-10 rounded-[40px] shadow-2xl shadow-black/20 sticky top-32 border border-white/5">
                        <h3 className="text-xl font-black mb-10 uppercase italic tracking-tighter border-b border-white/5 pb-6">Resumen del Pedido</h3>
                        <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-6 items-start group">
                                    <div className="relative">
                                        <img
                                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-2xl object-cover bg-white/5 border border-white/10 group-hover:scale-105 transition-transform"
                                        />
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute -top-3 -right-3 w-10 h-10 bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-maroon hover:scale-110 active:scale-90 transition-all z-10 group/remove"
                                            title="Eliminar producto"
                                        >
                                            <motion.div whileHover={{ rotate: 90 }}>
                                                <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                            </motion.div>
                                        </button>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-xs font-black uppercase tracking-tighter mb-4 leading-tight line-clamp-2">{item.name}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1 px-3">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-brand-green transition-colors font-black">－</button>
                                                <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-brand-green transition-colors font-black">＋</button>
                                            </div>
                                            <span className="text-lg font-black italic tracking-tighter text-brand-green">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/5 pt-8 space-y-4 mb-10">
                            <div className="flex justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                <span>Envío</span>
                                <span className="text-brand-green">Gratis</span>
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-4">
                                <span className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Total a Pagar</span>
                                <span className="font-black text-3xl text-brand-green italic tracking-tighter">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-brand-green text-white py-6 rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-4 group shadow-xl shadow-brand-green/20 active:scale-95 ${isSubmitting ? 'opacity-50 cursor-wait' : 'hover:bg-brand-forest'}`}
                        >
                            <span>{isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}</span>
                            {!isSubmitting && <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />}
                        </button>

                        <p className="text-[8px] text-center text-gray-500 mt-8 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Certificado de Seguridad SSL / LOGO Energy
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#111217] w-full max-w-2xl rounded-[50px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5"
                        >
                            <div className="p-12 text-center flex flex-col items-center relative">
                                <button
                                    onClick={() => navigate('/')}
                                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-brand-green hover:bg-brand-green/5 dark:hover:bg-brand-green/10 rounded-2xl transition-all"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                </button>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                                    className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-brand-green/30"
                                >
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
                                </motion.div>

                                <h2 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-2">¡Pedido <span className="text-brand-green">Exitoso</span>!</h2>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Código de seguimiento: {confirmedOrder?.id}</p>

                                <div className="w-full bg-gray-50 dark:bg-white/5 rounded-[32px] p-8 mb-12 text-left space-y-6">
                                    <div className="flex justify-between items-baseline border-b border-gray-200 dark:border-white/5 pb-4">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumen Financiero</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter">{formatCurrency(confirmedOrder?.total)}</span>
                                    </div>

                                    {/* Detalle de Artículos */}
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Artículos Comprados</p>
                                        <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                            {confirmedOrder?.orderDetails?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center font-black text-[10px] italic">{item.quantity}x</span>
                                                        <span className="font-bold dark:text-white uppercase tracking-tighter truncate max-w-[180px]">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-gray-400 italic">{formatCurrency(item.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Cliente</span>
                                            <span className="font-black dark:text-white uppercase tracking-tighter italic">{confirmedOrder?.customerName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Email de Notificación</span>
                                            <span className="font-black dark:text-white italic lowercase opacity-60 tracking-tight">{confirmedOrder?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <button onClick={() => window.print()} className="py-5 px-8 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest text-[9px] hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                        <FontAwesomeIcon icon={faPrint} /> Imprimir
                                    </button>
                                    <button onClick={() => navigate('/')} className="py-5 px-8 rounded-2xl bg-[#111217] dark:bg-brand-green text-white font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl">
                                        Continuar <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </div>

                                <p className="mt-10 text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-brand-green" /> Hemos enviado una copia a tu correo
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;

