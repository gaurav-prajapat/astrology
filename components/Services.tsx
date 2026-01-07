'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTag } from 'react-icons/fi';
import { GiLotusFlower, GiFire, GiRingBox, GiTempleGate, GiSun, GiDoor, GiPlanetCore } from 'react-icons/gi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const iconMap: Record<string, any> = {
  lotus: GiLotusFlower,
  fire: GiFire,
  rings: GiRingBox,
  home: GiTempleGate,
  sun: GiSun,
  door: GiDoor,
  planet: GiPlanetCore,
  shiva: GiLotusFlower,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBooking = (serviceId: string) => {
    localStorage.setItem('selectedService', serviceId);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-mandala opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-4">
            {t('Our Sacred Services', 'हमारी पवित्र सेवाएं')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t(
              'Choose from our range of authentic Vedic rituals performed with devotion and precision',
              'भक्ति और सटीकता के साथ किए गए हमारे प्रामाणिक वैदिक अनुष्ठानों की श्रृंखला में से चुनें'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || GiLotusFlower;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-saffron-100 dark:border-saffron-900/30"
              >
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                    {language === 'en' ? service.name_en : service.name_hi}
                  </h3>

                  <span className="inline-block px-3 py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-400 text-xs font-medium rounded-full mb-3">
                    {service.category.toUpperCase()}
                  </span>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {language === 'en' ? service.description_en : service.description_hi}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{service.duration_minutes} {t('mins', 'मिनट')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiTag className="w-4 h-4" />
                      <span className="font-semibold text-saffron-600 dark:text-saffron-400">
                        ₹{service.base_price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToBooking(service.id)}
                    className="w-full py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-lg font-semibold hover:from-saffron-600 hover:to-gold-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    {t('Book Now', 'अभी बुक करें')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
