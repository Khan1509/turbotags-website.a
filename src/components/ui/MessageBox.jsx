import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5 mr-2" />,
  error: <XCircle className="h-5 w-5 mr-2" />,
  info: <Info className="h-5 w-5 mr-2" />,
  warning: <AlertTriangle className="h-5 w-5 mr-2" />,
};

const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
};

const MessageBox = ({ message, type = 'info', onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-5 left-1/2 -translate-x-1/2 flex items-center text-white px-4 py-3 rounded-lg shadow-lg z-50 ${bgColors[type]}`}
        role="alert"
      >
        {icons[type]}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessageBox;
