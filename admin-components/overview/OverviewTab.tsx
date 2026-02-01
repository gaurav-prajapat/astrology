import { motion } from 'framer-motion';
import { FiCalendar, FiSettings, FiStar, FiUser, FiVideo, FiImage, FiTrendingUp } from 'react-icons/fi';
import { ReactNode } from 'react';
import StatsCard from '../shared/StatsCard';
import { Service, Booking, Testimonial, Astrologer, Video, CarouselItem } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface OverviewTabProps {
  services: Service[];
  bookings: Booking[];
  testimonials: Testimonial[];
  astrologers: Astrologer[];
  videos: Video[];
  carouselItems: CarouselItem[];
}

interface StatItem {
  icon: ReactNode;
  value: string | number;
  title: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function OverviewTab({
  services,
  bookings,
  testimonials,
  astrologers,
  videos,
  carouselItems,
}: OverviewTabProps) {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <FiCalendar />,
      value: bookings.length,
      title: t('Total Bookings', 'कुल बुकिंग'),
      color: 'blue' as const,
    },
    {
      icon: <FiSettings />,
      value: services.filter((s) => s.is_active).length,
      title: t('Active Services', 'सक्रिय सेवाएं'),
      color: 'green' as const,
    },
    {
      icon: <FiStar />,
      value: testimonials.length,
      title: t('Testimonials', 'प्रशंसापत्र'),
      color: 'yellow' as const,
    },
    {
      icon: <FiUser />,
      value: astrologers.filter((a) => a.is_active).length,
      title: t('Astrologers', 'ज्योतिषी'),
      color: 'purple' as const,
    },
  ];

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Dashboard Overview', 'डैशबोर्ड अवलोकन')}
        </h2>
        <FiTrendingUp className="w-8 h-8 text-geen-500" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiVideo className="w-5 h-5 mr-2 text-indigo-600" />
            {t('Video Content', 'वीडियो सामग्री')}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{t('Total Videos', 'कुल वीडियो')}</span>
              <span className="font-bold text-gray-900 dark:text-white">{videos.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{t('Featured', 'विशेष')}</span>
              <span className="font-bold text-indigo-600">{videos.filter((v) => v.is_featured).length}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiImage className="w-5 h-5 mr-2 text-teal-600" />
            {t('Carousel Items', 'कैरोसेल आइटम')}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{t('Total Items', 'कुल आइटम')}</span>
              <span className="font-bold text-gray-900 dark:text-white">{carouselItems.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{t('Active', 'सक्रिय')}</span>
              <span className="font-bold text-teal-600">{carouselItems.filter((c) => c.is_active).length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

