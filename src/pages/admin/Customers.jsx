import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faEnvelope, faPhone, faHistory, faHeart, faEye } from '@fortawesome/free-solid-svg-icons';

const Customers = () => {
    const { customers, loading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center animate-pulse">Cargando Clientes...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">


            {/* Filters Bar */}
            <div className="bg-white/50 dark:bg-[#111217]/50 backdrop-blur-md p-4 rounded-[28px] shadow-sm border border-gray-100 dark:border-[#1e1f26] flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-xl">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o dirección de email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-[#171821] border border-transparent focus:border-[#0abab5] outline-none dark:text-white transition-all font-black uppercase tracking-widest text-[10px] placeholder:text-gray-400"
                    />
                </div>
                <div className="flex items-center gap-6 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#0abab5] shadow-[0_0_10px_#0abab5]"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Regular</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff9500] shadow-[0_0_10px_#ff9500]"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#ff9500]">VIP System</span>
                    </div>
                </div>
            </div>

            {/* Customers Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="bg-white dark:bg-[#111217] p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-[#1e1f26] hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
                        {/* Status Badge */}
                        <div className={`absolute top-6 right-6 text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${customer.status === 'vip' ? 'bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/20' :
                            customer.status === 'active' || customer.status === 'pro' ? 'bg-[#0abab5]/10 text-[#0abab5] border border-[#0abab5]/20' :
                                'bg-gray-100 dark:bg-white/5 text-gray-400'
                            }`}>
                            {customer.status}
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-br flex items-center justify-center text-white text-3xl font-black shadow-2xl transition-transform group-hover:rotate-6 ${customer.status === 'vip' ? 'from-[#ff9500] to-[#ffcc00] shadow-[#ff9500]/30' : 'from-[#0abab5] to-[#4169e1] shadow-[#0abab5]/30'}`}>
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tighter italic uppercase leading-tight">{customer.name}</h3>
                                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-2">
                                    <FontAwesomeIcon icon={faUser} className="text-[#0abab5]" /> UID-{customer.id}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
                                <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#1a1b23] flex items-center justify-center text-gray-400 border border-transparent dark:border-[#1e1f26]">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
                                <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#1a1b23] flex items-center justify-center text-gray-400 border border-transparent dark:border-[#1e1f26]">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <span>{customer.phone}</span>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-[#1e1f26] pt-8 text-center">
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest opacity-60">Compras</p>
                                <p className="font-black text-gray-900 dark:text-white text-xl tracking-tighter italic">{customer.purchaseCount}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest opacity-60">Inversión</p>
                                <p className="font-black text-[#0abab5] text-xl tracking-tighter italic">${customer.totalSpent}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest opacity-60">Última</p>
                                <p className="font-black text-gray-900 dark:text-white text-[10px] tracking-widest mt-2">{customer.lastPurchaseDate}</p>
                            </div>
                        </div>

                        {/* Engagement Metrics (Mock) */}
                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50 dark:border-[#1e1f26]/50">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6b7c93]" title="Productos visitados (Mock)">
                                <FontAwesomeIcon icon={faEye} className="text-[#0abab5]" /> 124
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6b7c93]" title="Likes (Mock)">
                                <FontAwesomeIcon icon={faHeart} className="text-[#ff2d55]" /> 12
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6b7c93]" title="Frecuencia (Mock)">
                                <FontAwesomeIcon icon={faHistory} className="text-[#4169e1]" /> Alta
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;

