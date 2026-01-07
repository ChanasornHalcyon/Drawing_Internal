import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SuccessPopup = ({ message, showPopup, onClose }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!showPopup) return;

        setProgress(100);

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = Math.max(prev - 1, 0);
                if (next === 0) {
                    onClose();
                }
                return next;
            });
        }, 20);

        return () => clearInterval(interval);
    }, [showPopup, onClose]);

    return (
        <AnimatePresence>
            {showPopup && (
                <motion.div
                    className="fixed inset-x-0 top-6 flex justify-center z-50"
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80">

                        <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-500 text-2xl" />
                            <span className="text-gray-700 font-medium flex-1">
                                {message}
                            </span>
                            <button onClick={onClose}>
                                <FaTimes className="text-gray-400 hover:text-gray-600 transition cursor-pointer" />
                            </button>
                        </div>

                        <div className="w-full mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: "100%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0.02 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessPopup;
