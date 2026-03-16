import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const LoginModal = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            setLoading(false);
            onClose();
            navigate('/admin'); // Redirect to admin dash on success
        } catch (err) {
            setError('Credenciales inválidas. Intenta admin / admin');
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-charcoal/90 backdrop-blur-xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="relative w-full max-w-md bg-brand-cream dark:bg-brand-charcoal rounded-[3rem] p-12 shadow-2xl border border-brand-charcoal/5 dark:border-brand-cream/10 mx-4 transition-colors duration-700"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full text-brand-charcoal/30 dark:text-brand-cream/30 hover:text-brand-green transition-all active:scale-90"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter leading-none mb-4">
                                Acceso <br /><span className="text-brand-green">Energy</span>
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-charcoal/30 dark:text-brand-cream/30">Centro de Control Administrativo</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-brand-cream/40 ml-2">Identidad</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faUser} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-brand-charcoal/20 dark:text-brand-cream/20 group-focus-within:text-brand-green transition-colors" />
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-brand-charcoal/50 border border-brand-charcoal/5 dark:border-brand-cream/10 focus:border-brand-green outline-none transition-all dark:text-brand-cream font-bold text-sm shadow-sm"
                                        placeholder="admin"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-charcoal/40 dark:text-brand-cream/40 ml-2">Código Secreto</label>
                                <div className="relative group">
                                    <FontAwesomeIcon icon={faLock} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-brand-charcoal/20 dark:text-brand-cream/20 group-focus-within:text-brand-green transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-brand-charcoal/50 border border-brand-charcoal/5 dark:border-brand-cream/10 focus:border-brand-green outline-none transition-all dark:text-brand-cream font-bold text-sm shadow-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-brand-green text-[10px] font-black text-center bg-brand-green/5 p-4 rounded-2xl border border-brand-green/10 uppercase tracking-widest"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal font-black uppercase text-[10px] tracking-[0.4em] rounded-[1.5rem] shadow-2xl transition-all disabled:opacity-50 hover:bg-brand-green dark:hover:bg-brand-green dark:hover:text-brand-cream"
                            >
                                {loading ? 'Validando...' : 'Iniciar Sesión'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;

