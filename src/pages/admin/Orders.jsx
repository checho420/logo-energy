import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faEye, faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

const Orders = () => {
    const { orders, loading, updateOrderStatus } = useAdmin();
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'Todos' || order.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
        // Update local state for the modal UI
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    };

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#0abab5] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Escaneando Registro de Ventas...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">


            {/* Filters Bar */}
            <div className="bg-white/50 dark:bg-[#111217]/50 backdrop-blur-md p-4 rounded-[28px] shadow-sm border border-gray-100 dark:border-[#1e1f26] flex flex-col lg:flex-row gap-6 justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                    {['Todos', 'Pendiente', 'Entregado', 'Cancelado'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${statusFilter === status
                                ? 'bg-[#0abab5] text-white shadow-lg shadow-[#0abab5]/20 border-[#0abab5]'
                                : 'bg-white dark:bg-[#171821] text-gray-400 border-gray-100 dark:border-[#1e1f26] hover:text-[#0abab5] hover:border-[#0abab5]/30'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-80">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar pedido o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-[#171821] border border-transparent focus:border-[#0abab5] outline-none dark:text-white transition-all font-black uppercase tracking-widest text-[10px] placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-transparent lg:bg-white lg:dark:bg-[#111217] lg:rounded-[32px] lg:shadow-sm lg:border lg:border-gray-100 lg:dark:border-[#1e1f26] overflow-hidden">
                {/* Mobile Order Cards */}
                <div className="lg:hidden space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-[#111217] p-5 rounded-[28px] border border-gray-100 dark:border-[#1e1f26] shadow-sm flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-black text-gray-900 dark:text-white uppercase italic tracking-tighter text-lg leading-tight">#{order.id}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{order.date}</p>
                                </div>
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${order.status === 'entregado' ? 'bg-[#0abab5]/10 text-[#0abab5] border-[#0abab5]/20' :
                                    order.status === 'pendiente' ? 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/20' :
                                        'bg-[#ff2d55]/10 text-[#ff2d55] border-[#ff2d55]/20'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Cliente</p>
                                    <p className="font-black text-gray-800 dark:text-white uppercase tracking-tighter italic text-sm truncate max-w-[150px]">{order.customerName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0abab5] mb-1 text-right">Monto</p>
                                    <p className="font-black text-gray-900 dark:text-white text-xl tracking-tighter italic leading-none">{formatCurrency(order.total)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="w-full bg-gray-50 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest py-3 rounded-xl border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 active:bg-[#0abab5] active:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faEye} /> Ver Detalles
                            </button>
                        </div>
                    ))}
                </div>

                {/* Desktop table */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-[#171821]/50 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-gray-100 dark:border-[#1e1f26]">
                            <tr>
                                <th className="p-8">ID Transacción</th>
                                <th className="p-8">Fecha Registro</th>
                                <th className="p-8">Cliente</th>
                                <th className="p-8">Estado</th>
                                <th className="p-8">Monto Total</th>
                                <th className="p-8 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#1e1f26]/50">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="group hover:bg-gray-50/80 dark:hover:bg-white/5 transition-all">
                                    <td className="p-6 font-black text-gray-900 dark:text-white uppercase tracking-tighter italic text-lg">#{order.id}</td>
                                    <td className="p-6 text-[10px] font-black uppercase tracking-widest text-[#6b7c93]">{order.date}</td>
                                    <td className="p-6 font-black text-gray-800 dark:text-white uppercase tracking-tighter italic underline decoration-[#0abab5]/30 underline-offset-4">{order.customerName}</td>
                                    <td className="p-6">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${order.status === 'entregado' ? 'bg-[#0abab5]/10 text-[#0abab5] border-[#0abab5]/20' :
                                            order.status === 'pendiente' ? 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/20' :
                                                'bg-[#ff2d55]/10 text-[#ff2d55] border-[#ff2d55]/20'
                                            }`}>
                                            {order.status === 'entregado' && <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />}
                                            {order.status === 'pendiente' && <FontAwesomeIcon icon={faClock} className="text-[10px]" />}
                                            {order.status === 'cancelado' && <FontAwesomeIcon icon={faTimesCircle} className="text-[10px]" />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-gray-900 dark:text-white text-2xl tracking-tighter italic">{formatCurrency(order.total)}</td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-gray-50 dark:bg-[#1a1b23] text-[9px] font-black uppercase tracking-widest px-5 py-3 rounded-[14px] border border-gray-100 dark:border-[#1e1f26] text-gray-600 dark:text-gray-400 hover:bg-[#4169e1] hover:text-white hover:border-[#4169e1] transition-all shadow-sm"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-2" /> Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#0d0e12] w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-[#1e1f26] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-gray-100 dark:border-[#1e1f26] flex justify-between items-center bg-gray-50/50 dark:bg-[#111217]">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Detalle Transacción <span className="text-[#0abab5]">#{selectedOrder.id}</span></h2>
                                <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#ff2d55] hover:bg-[#ff2d55]/5 rounded-2xl transition-all">
                                    <FontAwesomeIcon icon={faTimesCircle} className="text-2xl" />
                                </button>
                            </div>

                            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-grow">
                                {/* Header Info */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Cliente Solicitante</p>
                                            <p className="font-black dark:text-white italic tracking-tighter uppercase text-lg">{selectedOrder.customerName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold lowercase opacity-60 tracking-tight">{selectedOrder.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Fecha de Registro</p>
                                            <p className="font-black dark:text-white uppercase text-xs tracking-widest">{selectedOrder.date}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Cambiar Estado</p>
                                            <select
                                                value={selectedOrder.status}
                                                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                                className={`w-full p-4 rounded-2xl font-black italic uppercase tracking-tighter text-sm appearance-none outline-none border transition-all ${selectedOrder.status === 'entregado' ? 'bg-[#0abab5]/10 text-[#0abab5] border-[#0abab5]/30' :
                                                    selectedOrder.status === 'pendiente' ? 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/30' :
                                                        'bg-[#ff2d55]/10 text-[#ff2d55] border-[#ff2d55]/30'
                                                    }`}
                                            >
                                                <option value="pendiente" className="bg-white dark:bg-gray-900 text-[#ff9500]">Pendiente</option>
                                                <option value="entregado" className="bg-white dark:bg-gray-900 text-[#0abab5]">Entregado</option>
                                                <option value="cancelado" className="bg-white dark:bg-gray-900 text-[#ff2d55]">Cancelado</option>
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Monto de Inversión</p>
                                            <p className="font-black text-3xl text-[#0abab5] tracking-tighter italic leading-none mt-1">{formatCurrency(selectedOrder.total)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Detail */}
                                <div className="border-t border-gray-100 dark:border-[#1e1f26] pt-10">
                                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 border-l-4 border-[#0abab5] pl-4">Hardware Inventory Detail</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.orderDetails ? (
                                            selectedOrder.orderDetails.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1b23] text-[#0abab5] flex items-center justify-center font-black italic text-xs shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                                                            {item.quantity}x
                                                        </span>
                                                        <span className="font-black dark:text-white uppercase tracking-tighter text-sm italic">{item.name}</span>
                                                    </div>
                                                    <span className="text-[11px] font-black text-gray-400 italic">{formatCurrency(item.price)} C/U</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-gray-400 text-xs italic uppercase tracking-widest bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/5">
                                                No hay detalle de artículos disponible para este pedido histórico.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                <div className="border-t border-gray-100 dark:border-[#1e1f26] pt-10">
                                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8 border-l-4 border-[#0abab5] pl-4">Security Tracking History</h3>
                                    <div className="space-y-8 relative pl-6 border-l-2 border-dashed border-gray-100 dark:border-[#1e1f26] ml-3">
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-[#0abab5] shadow-[0_0_15px_#0abab5]"></div>
                                            <p className="text-xs font-black dark:text-white uppercase tracking-widest">Pedido Realizado</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Status: OK • {selectedOrder.date}</p>
                                        </div>
                                        <div className="relative">
                                            <div className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full shadow-[0_0_15px_currentcolor] ${selectedOrder.status !== 'pendiente' ? 'bg-[#0abab5] text-[#0abab5]' : 'bg-gray-200 dark:bg-[#1e1f26] text-transparent'}`}></div>
                                            <p className="text-xs font-black dark:text-white uppercase tracking-widest">Pago Confirmado</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Gateway: Secured • Verified</p>
                                        </div>
                                        <div className="relative">
                                            <div className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full shadow-[0_0_15px_currentcolor] ${selectedOrder.status === 'entregado' ? 'bg-[#4169e1] text-[#4169e1]' : 'bg-gray-200 dark:bg-[#1e1f26] text-transparent'}`}></div>
                                            <p className="text-xs font-black dark:text-white uppercase tracking-widest">Entrega Finalizada</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{selectedOrder.status === 'entregado' ? 'Success: Hardware Deployed' : 'Pending Deployment'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50 dark:bg-[#111217] text-center border-t border-gray-100 dark:border-[#1e1f26]">
                                <button onClick={() => setSelectedOrder(null)} className="text-[10px] font-black uppercase tracking-widest text-[#0abab5] hover:text-[#0abab5]/80 transition-all">
                                    Cerrar Registros de Auditoría
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;

