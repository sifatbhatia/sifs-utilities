"use client";
import { motion } from 'framer-motion';

export default function PremiumBackground() {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[#D9D9D9]" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 2 }}
                className="absolute w-[1000px] h-[1000px] -top-[500px] -left-[300px] bg-indigo-500/10 rounded-full blur-[160px]"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 2.5, delay: 0.5 }}
                className="absolute w-[800px] h-[800px] top-[10%] right-[-200px] bg-purple-500/10 rounded-full blur-[140px]"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                transition={{ duration: 3, delay: 1 }}
                className="absolute w-[600px] h-[600px] -bottom-[200px] left-[30%] bg-blue-400/5 rounded-full blur-[120px]"
            />
        </div>
    );
}
