import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAdmin } from '../context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShoppingBag, faArrowRight, faPrint, faEnvelope, faTimes, faCreditCard, faLock, faShieldAlt, faSpinner, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

const Checkout = () => {
    const { cart, total, clearCart, updateQuantity, removeFromCart } = useCart();
    const { updateProduct, getProductById } = useProducts();
    const { addOrder } = useAdmin();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processingState, setProcessingState] = useState('idle'); // idle, connecting, processing, approved
    const [showSuccess, setShowSuccess] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // stripe, mercadopago, wompi, pse
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: ''
    });

    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        nameOnCard: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        
        // Auto-format card number
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) return;
        }
        // Auto-format expiry
        if (name === 'expiry') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
            }
            if (formattedValue.length > 5) return;
        }
        // Limit CVV
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 4) return;
        }

        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setProcessingState('connecting');

        // Simulate Gateway Connection
        setTimeout(() => {
            setProcessingState('processing');
            
            // Simulate Payment Approval
            setTimeout(async () => {
                setProcessingState('approved');
                
                setTimeout(async () => {
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
                            paymentMethod: paymentMethod,
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
                        setProcessingState('idle');
                    }
                }, 1000); // Wait 1s after approval to show success modal
            }, 2000); // Wait 2s processing payment
        }, 1500); // Wait 1.5s connecting to gateway
    };

    if (cart.length === 0 && !showSuccess) {
        return (
            <div className="container mx-auto px-6 py-20 text-center animate-fade-in text-gray-800 dark:text-white">
                <div className="bg-[#f4f4f4] dark:bg-white/5 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-5xl text-[#333333]" />
                </div>
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Tu carrito está vacío</h1>
                <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">Parece que aún no has añadido productos. Explora nuestro catálogo y encuentra las mejores soluciones en energía solar.</p>
                <Link to="/catalog" className="inline-flex bg-[#333333] text-white px-10 py-4 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
                    Volver al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in relative min-h-screen">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-12 uppercase tracking-tighter">Finalizar <span className="text-[#333333] opacity-50">Compra</span></h1>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Form */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-[#f4f4f4] dark:bg-[#111217] p-8 md:p-12 shadow-sm">
                        <h2 className="text-sm font-black mb-10 text-[#333333] dark:text-white flex items-center gap-4 uppercase tracking-widest">
                            <span className="w-8 h-8 bg-white dark:bg-white/10 text-[#333333] dark:text-white flex items-center justify-center text-xs shadow-sm">01</span>
                            Información de Envío
                        </h2>
                        <form id="checkout-form" className="space-y-6" onSubmit={handleConfirmOrder}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombre</label>
                                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white focus:ring-0 focus:border-[#333333] transition-colors p-4 text-sm outline-none placeholder-gray-300" placeholder="Tu nombre" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Apellido</label>
                                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white focus:ring-0 focus:border-[#333333] transition-colors p-4 text-sm outline-none placeholder-gray-300" placeholder="Tu apellido" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Correo Electrónico</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white focus:ring-0 focus:border-[#333333] transition-colors p-4 text-sm outline-none placeholder-gray-300" placeholder="ejemplo@correo.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dirección de Entrega</label>
                                <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white focus:ring-0 focus:border-[#333333] transition-colors p-4 text-sm outline-none placeholder-gray-300" placeholder="Calle, Número, Ciudad" />
                            </div>
                        </form>

                        <h2 className="text-sm font-black mt-16 mb-8 text-[#333333] dark:text-white flex items-center gap-4 uppercase tracking-widest">
                            <span className="w-8 h-8 bg-white dark:bg-white/10 text-[#333333] dark:text-white flex items-center justify-center text-xs shadow-sm">02</span>
                            Método de Pago
                        </h2>
                        
                        {/* Gateway Selector */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <button onClick={() => setPaymentMethod('stripe')} className={`p-4 border ${paymentMethod === 'stripe' ? 'border-[#333333] bg-white text-[#333333] shadow-sm' : 'border-gray-200 bg-transparent text-gray-400'} flex items-center justify-center gap-2 transition-all font-bold tracking-widest uppercase text-xs hover:border-gray-400`}>
                                <FontAwesomeIcon icon={faCreditCard} /> Stripe
                            </button>
                            <button onClick={() => setPaymentMethod('mercadopago')} className={`p-4 border ${paymentMethod === 'mercadopago' ? 'border-[#009ee3] bg-white text-[#009ee3] shadow-sm' : 'border-gray-200 bg-transparent text-gray-400'} flex items-center justify-center gap-2 transition-all font-bold tracking-widest uppercase text-[10px] hover:border-gray-400`}>
                                Mercado Pago
                            </button>
                            <button onClick={() => setPaymentMethod('wompi')} className={`p-4 border ${paymentMethod === 'wompi' ? 'border-[#1b1b4b] bg-white text-[#1b1b4b] shadow-sm' : 'border-gray-200 bg-transparent text-gray-400'} flex items-center justify-center gap-2 transition-all font-bold tracking-widest uppercase text-xs hover:border-gray-400`}>
                                Wompi
                            </button>
                            <button onClick={() => setPaymentMethod('pse')} className={`p-4 border ${paymentMethod === 'pse' ? 'border-[#f2a83e] bg-white text-[#f2a83e] shadow-sm' : 'border-gray-200 bg-transparent text-gray-400'} flex items-center justify-center gap-2 transition-all font-bold tracking-widest uppercase text-xs hover:border-gray-400`}>
                                <FontAwesomeIcon icon={faBuildingColumns} /> PSE
                            </button>
                        </div>

                        {/* Payment Details Form */}
                        <div className="relative">
                            {/* Processing Overlay */}
                            <AnimatePresence>
                                {isSubmitting && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 bg-white/90 dark:bg-[#111217]/90 backdrop-blur-sm flex flex-col items-center justify-center border border-gray-100"
                                    >
                                        {processingState === 'connecting' && (
                                            <>
                                                <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-[#333333] mb-4 animate-pulse" />
                                                <p className="text-xs font-black uppercase tracking-widest text-[#333333]">Conectando pasarela...</p>
                                            </>
                                        )}
                                        {processingState === 'processing' && (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#333333] mb-4 animate-spin" />
                                                <p className="text-xs font-black uppercase tracking-widest text-[#333333]">Procesando pago en {paymentMethod === 'wompi' ? 'Wompi' : paymentMethod === 'stripe' ? 'Stripe' : paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'PSE'}...</p>
                                            </>
                                        )}
                                        {processingState === 'approved' && (
                                            <>
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-600 mb-4" />
                                                <p className="text-xs font-black uppercase tracking-widest text-green-600">¡Pago Aprobado!</p>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={`space-y-6 ${isSubmitting ? 'opacity-30 blur-sm' : ''} transition-all duration-500`}>
                                {paymentMethod !== 'pse' ? (
                                    <>
                                        {/* Tarjeta de Crédito UI */}
                                        <div className="bg-white dark:bg-[#1a1b23] p-6 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
                                            
                                            <div className="space-y-4 relative z-10">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex justify-between">
                                                        <span>Número de Tarjeta</span>
                                                        <FontAwesomeIcon icon={faLock} className="text-gray-300" />
                                                    </label>
                                                    <div className="relative">
                                                        <input type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} placeholder="0000 0000 0000 0000" className="w-full border-b-2 border-gray-200 dark:border-white/10 bg-transparent dark:text-white focus:border-[#333333] dark:focus:border-white transition-colors py-2 text-lg outline-none font-mono tracking-widest font-bold" />
                                                        <FontAwesomeIcon icon={faCreditCard} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 text-xl" />
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-8 pt-2">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vencimiento</label>
                                                        <input type="text" name="expiry" value={paymentData.expiry} onChange={handlePaymentChange} placeholder="MM/YY" className="w-full border-b-2 border-gray-200 dark:border-white/10 bg-transparent dark:text-white focus:border-[#333333] dark:focus:border-white transition-colors py-2 text-base outline-none font-mono tracking-widest font-bold" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CVC / CVV</label>
                                                        <input type="password" name="cvv" value={paymentData.cvv} onChange={handlePaymentChange} placeholder="123" className="w-full border-b-2 border-gray-200 dark:border-white/10 bg-transparent dark:text-white focus:border-[#333333] dark:focus:border-white transition-colors py-2 text-base outline-none font-mono tracking-widest font-bold" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nombre del Titular</label>
                                                    <input type="text" name="nameOnCard" value={paymentData.nameOnCard} onChange={handlePaymentChange} placeholder="COMO APARECE EN LA TARJETA" className="w-full border-b-2 border-gray-200 dark:border-white/10 bg-transparent dark:text-white focus:border-[#333333] dark:focus:border-white transition-colors py-2 text-sm outline-none uppercase font-bold tracking-widest" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-gray-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <FontAwesomeIcon icon={faShieldAlt} />
                                            (MODO SIMULACIÓN: Pago ficticio seguro vía {paymentMethod.toUpperCase()})
                                        </p>
                                    </>
                                ) : (
                                    <div className="bg-white dark:bg-[#1a1b23] p-10 border border-gray-200 dark:border-white/10 shadow-sm text-center">
                                        <FontAwesomeIcon icon={faBuildingColumns} className="text-4xl text-gray-300 mb-6" />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#333333] mb-2">Transferencia PSE</h3>
                                        <p className="text-xs text-gray-500 mb-6">Serás redirigido al portal seguro de tu banco para completar la transacción.</p>
                                        <select className="w-full border-b-2 border-gray-200 dark:border-white/10 bg-transparent dark:text-white focus:border-[#333333] dark:focus:border-white transition-colors py-3 text-sm outline-none font-bold">
                                            <option value="">Selecciona tu banco...</option>
                                            <option value="bancolombia">Bancolombia</option>
                                            <option value="davivienda">Davivienda</option>
                                            <option value="bogota">Banco de Bogotá</option>
                                            <option value="nubank">Nubank</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white dark:bg-[#111217] text-[#333333] dark:text-white p-10 shadow-sm border border-gray-100 dark:border-white/5 sticky top-32">
                        <h3 className="text-xl font-black mb-8 uppercase tracking-tighter border-b border-gray-100 dark:border-white/5 pb-6">Resumen del Pedido</h3>
                        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4 items-start group">
                                    <div className="relative">
                                        <img
                                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover bg-[#f4f4f4] border border-gray-200 dark:border-white/10"
                                        />
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            title="Eliminar producto"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                                        </button>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-xs font-bold uppercase tracking-widest mb-2 leading-tight line-clamp-2 text-gray-700 dark:text-gray-300">{item.name}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 bg-[#f4f4f4] dark:bg-white/5 px-2 py-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-[#333333] transition-colors font-black">－</button>
                                                <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-[#333333] transition-colors font-black">＋</button>
                                            </div>
                                            <span className="text-sm font-black tracking-tighter text-[#333333] dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-white/5 pt-6 space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500 text-xs font-bold uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-xs font-bold uppercase tracking-widest">
                                <span>Envío</span>
                                <span className="text-[#333333]">Gratis</span>
                            </div>
                            <div className="flex justify-between items-end pt-6 border-t border-gray-100 dark:border-white/5 mt-4">
                                <span className="font-bold text-xs uppercase tracking-widest text-gray-400">Total a Pagar</span>
                                <span className="font-black text-3xl text-[#333333] dark:text-white tracking-tighter">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isSubmitting || cart.length === 0 || (paymentMethod !== 'pse' && (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv))}
                            className={`w-full bg-[#333333] text-white py-5 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 group hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none`}
                        >
                            <span>{isSubmitting ? 'Procesando Pago...' : `Pagar ${formatCurrency(total)}`}</span>
                            {!isSubmitting && <FontAwesomeIcon icon={faLock} className="text-gray-400" />}
                        </button>

                        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-gray-400 opacity-60">
                            <div className="flex gap-4 mb-2">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-lg" />
                                <FontAwesomeIcon icon={faLock} className="text-lg" />
                            </div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-center">
                                Encriptación SSL 256-bit<br/>Pagos 100% Seguros
                            </p>
                        </div>
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#f4f4f4]/95 dark:bg-[#111217]/95"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#1a1b23] w-full max-w-xl shadow-2xl border border-gray-100 dark:border-white/5"
                        >
                            <div className="p-12 flex flex-col items-center relative text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                                    className="w-20 h-20 bg-[#333333] rounded-full flex items-center justify-center mb-8"
                                >
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
                                </motion.div>

                                <h2 className="text-3xl font-black text-[#333333] dark:text-white uppercase tracking-tighter mb-2">Pago Aprobado</h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Tu pedido ha sido confirmado con éxito</p>

                                <div className="w-full bg-[#f4f4f4] dark:bg-white/5 p-8 mb-10 text-left space-y-6">
                                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Pagado</span>
                                        <span className="text-xl font-black text-[#333333] dark:text-white tracking-tighter">{formatCurrency(confirmedOrder?.total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Método</span>
                                        <span className="text-xs font-black text-[#333333] dark:text-white uppercase tracking-widest">{confirmedOrder?.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ref. Transacción</span>
                                        <span className="text-xs font-mono font-bold text-[#333333] dark:text-white uppercase tracking-widest">#{confirmedOrder?.id?.substring(0,8)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 w-full">
                                    <button onClick={() => navigate('/')} className="w-full py-4 bg-[#333333] text-white font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
                                        Volver a la Tienda
                                    </button>
                                    <button onClick={() => window.print()} className="w-full py-4 bg-transparent text-[#333333] dark:text-white font-bold uppercase tracking-widest text-xs border border-gray-200 hover:border-[#333333] transition-colors flex items-center justify-center gap-3">
                                        <FontAwesomeIcon icon={faPrint} /> Imprimir Recibo
                                    </button>
                                </div>

                                <p className="mt-8 text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <FontAwesomeIcon icon={faEnvelope} /> Enviamos los detalles a {confirmedOrder?.email}
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
