import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

const typeConfig = {
  success: {
    icon: <FiCheckCircle className="w-5 h-5" />,
    bgColor: 'bg-green-500',
    textColor: 'text-green-500',
  },
  error: {
    icon: <FiXCircle className="w-5 h-5" />,
    bgColor: 'bg-red-500',
    textColor: 'text-red-500',
  },
  warning: {
    icon: <FiAlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-500',
  },
  info: {
    icon: <FiInfo className="w-5 h-5" />,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-500',
  },
};

export default function ToastNotification({
  message,
  type,
  onClose,
  duration = 5000,
}: ToastNotificationProps) {
  const config = typeConfig[type];

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-sm w-full"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-start space-x-3">
        <div className={`${config.bgColor} p-2 rounded-lg text-white`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-900 dark:text-white font-medium">{message}</p>
          <button
            onClick={onClose}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
}