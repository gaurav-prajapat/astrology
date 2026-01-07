'use client';

import { motion } from 'framer-motion';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-saffron-50 via-gold-50 to-divine-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="absolute inset-0 bg-mandala opacity-30"></div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-saffron-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center animate-glow">
                <span className="text-white text-5xl">ॐ</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Diya />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-saffron-600 to-gold-600 dark:from-saffron-400 dark:to-gold-400 bg-clip-text text-transparent">
            {t('Book Authentic Hindu Rituals', 'प्रामाणिक हिंदू अनुष्ठान बुक करें')}
          </h1>

          <h2 className="text-2xl md:text-3xl font-hindi font-semibold text-divine-700 dark:text-divine-300 mb-6">
            {t('& Unlock Divine Blessings', '& दिव्य आशीर्वाद प्राप्त करें')}
          </h2>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t(
              'Experience authentic Vedic rituals performed by experienced astrologers. Bring prosperity, peace, and divine blessings to your life.',
              'अनुभवी ज्योतिषियों द्वारा किए गए प्रामाणिक वैदिक अनुष्ठानों का अनुभव करें। अपने जीवन में समृद्धि, शांति और दिव्य आशीर्वाद लाएं।'
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToBooking}
            className="group px-8 py-4 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <FiCalendar className="w-5 h-5" />
            <span>{t('Book Your Ritual', 'अपना अनुष्ठान बुक करें')}</span>
          </button>

          <button
            onClick={scrollToContact}
            className="px-8 py-4 bg-white dark:bg-gray-800 text-saffron-600 dark:text-saffron-400 border-2 border-saffron-500 rounded-full font-semibold text-lg hover:bg-saffron-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <FiPhone className="w-5 h-5" />
            <span>{t('Contact Us', 'हमसे संपर्क करें')}</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { number: '1000+', label: t('Rituals Performed', 'अनुष्ठान संपन्न'), labelHi: 'अनुष्ठान संपन्न' },
            { number: '500+', label: t('Happy Clients', 'खुश ग्राहक'), labelHi: 'खुश ग्राहक' },
            { number: '15+', label: t('Years Experience', 'वर्षों का अनुभव'), labelHi: 'वर्षों का अनुभव' },
            { number: '50+', label: t('Ritual Types', 'अनुष्ठान प्रकार'), labelHi: 'अनुष्ठान प्रकार' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-saffron-600 dark:text-saffron-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </section>
  );
}

function Diya() {
  return (
    <div className="relative w-16 h-20">
      <svg viewBox="0 0 100 120" className="w-full h-full">
        <ellipse cx="50" cy="80" rx="40" ry="15" fill="#c2410c" />
        <ellipse cx="50" cy="80" rx="30" ry="10" fill="#ea580c" />
        <ellipse cx="50" cy="80" rx="20" ry="6" fill="#facc15" />
      </svg>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
        <div className="relative w-6 h-12">
          <div className="absolute inset-0 bg-gradient-to-t from-saffron-500 via-gold-400 to-gold-200 rounded-full animate-flame"
               style={{ filter: 'blur(2px)' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-saffron-600 via-gold-500 to-yellow-300 rounded-full animate-flame"
               style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-0 left-1/2 w-2 h-4 bg-gradient-to-t from-transparent to-white rounded-full transform -translate-x-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
