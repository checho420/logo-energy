import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <UIContext.Provider value={value}>
            {children}

            {/* Toast Container - Disabled by user request
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`px-6 py-4 rounded-[24px] shadow-2xl backdrop-blur-md border flex items-center gap-4 min-w-[280px] ${toast.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' :
                                    toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
                                        ' bg-white/90 dark:bg-gray-800/90 border-gray-100 dark:border-white/10 dark:text-white'
                                }`}>
                                <FontAwesomeIcon
                                    icon={toast.type === 'success' ? faCheckCircle : toast.type === 'error' ? faExclamationCircle : faInfoCircle}
                                    className="text-xl"
                                />
                                <p className="text-xs font-black uppercase tracking-widest flex-grow">{toast.message}</p>
                                <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            */}
        </UIContext.Provider>
    );
};
