import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'saffron' | 'blue' | 'green' | 'red' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

const colorClasses = {
  saffron: 'border-saffron-500 border-t-saffron-300',
  blue: 'border-blue-500 border-t-blue-300',
  green: 'border-green-500 border-t-green-300',
  red: 'border-red-500 border-t-red-300',
  gray: 'border-gray-500 border-t-gray-300',
};

export default function LoadingSpinner({
  size = 'md',
  color = 'gray',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className={`rounded-full border-4 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.p
        className="mt-4 text-gray-600 dark:text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
}