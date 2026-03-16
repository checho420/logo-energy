import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className, variant = 'rect' }) => {
    const variants = {
        rect: 'rounded-2xl',
        circle: 'rounded-full',
        text: 'rounded-md h-4'
    };

    return (
        <div className={`relative overflow-hidden bg-gray-200 dark:bg-white/5 ${variants[variant]} ${className}`}>
            <motion.div
                animate={{
                    x: ['-100%', '100%']
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent skew-x-12"
            />
        </div>
    );
};

export default Skeleton;
