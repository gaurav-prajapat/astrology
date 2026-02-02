import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiImage, FiEye } from 'react-icons/fi';
import { CarouselItem } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface CarouselTabProps {
  carouselItems: CarouselItem[];
  loading: boolean;
  onAddItem: () => void;
  onEditItem: (item: CarouselItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onReorder: (items: CarouselItem[]) => void;
}

export default function CarouselTab({
  carouselItems,
  loading,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
  onReorder,
}: CarouselTabProps) {
  const { language, t } = useLanguage();

  const activeItems = carouselItems?.filter(item => item.is_active) || [];
  const inactiveItems = carouselItems?.filter(item => !item.is_active) || [];

  return (
    <motion.div
      key="carousel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Carousel', 'कैरोसेल प्रबंधित करें')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddItem}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">{t('Add Item', 'आइटम जोड़ें')}</span>
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : carouselItems.length === 0 ? (
        <EmptyState
          icon={<FiImage className="w-16 h-16 text-gray-400" />}
          title={t('No Carousel Items', 'कोई कैरोसेल आइटम नहीं')}
          description={t('No carousel items have been added yet.', 'अभी तक कोई कैरोसेल आइटम नहीं जोड़ा गया है।')}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Items */}
          {activeItems.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Active Items', 'सक्रिय आइटम')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
                  >
                    <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={language === 'en' ? item.title_en : item.title_hi}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiImage className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                          {t('Active', 'सक्रिय')}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                          #{item.sort_order}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {language === 'en' ? item.title_en : item.title_hi}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {language === 'en' ? item.description_en : item.description_hi}
                      </p>
                      {item.link && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Link', 'लिंक')}: {item.link}
                          </p>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEditItem(item)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>{t('Edit', 'संपादित करें')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleStatus(item.id, item.is_active)}
                          className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={t('Deactivate', 'निष्क्रिय करें')}
                        >
                          <FiEye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteItem(item.id)}
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={t('Delete', 'मिटाएं')}
                        >
                          <FiTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Items */}
          {inactiveItems.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Inactive Items', 'निष्क्रिय आइटम')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-70 group"
                  >
                    <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={language === 'en' ? item.title_en : item.title_hi}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiImage className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleStatus(item.id, item.is_active)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                          <FiEye className="w-4 h-4" />
                          <span>{t('Activate', 'सक्रिय करें')}</span>
                        </motion.button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                          {t('Inactive', 'निष्क्रिय')}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                          #{item.sort_order}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {language === 'en' ? item.title_en : item.title_hi}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {language === 'en' ? item.description_en : item.description_hi}
                      </p>
                      {item.link && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Link', 'लिंक')}: {item.link}
                          </p>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEditItem(item)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>{t('Edit', 'संपादित करें')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteItem(item.id)}
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={t('Delete', 'मिटाएं')}
                        >
                          <FiTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}