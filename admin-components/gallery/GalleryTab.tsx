import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiImage, FiCheck, FiX } from 'react-icons/fi';
import { GalleryImage } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface GalleryTabProps {
  images: GalleryImage[];
  loading: boolean;
  onAddImage: () => void;
  onEditImage: (image: GalleryImage) => void;
  onDeleteImage: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export default function GalleryTab({
  images,
  loading,
  onAddImage,
  onEditImage,
  onDeleteImage,
  onToggleStatus,
}: GalleryTabProps) {
  const { language, t } = useLanguage();

  const activeImages = images.filter(img => img.is_active);
  const inactiveImages = images.filter(img => !img.is_active);

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Gallery', 'गैलरी प्रबंधित करें')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddImage}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">{t('Add Image', 'छवि जोड़ें')}</span>
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : images.length === 0 ? (
        <EmptyState
          icon={<FiImage className="w-16 h-16 text-gray-400" />}
          title={t('No Gallery Images', 'कोई गैलरी छवि नहीं')}
          description={t('No images have been added to the gallery yet.', 'अभी तक गैलरी में कोई छवि नहीं जोड़ी गई है।')}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Images */}
          {activeImages.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Active Images', 'सक्रिय छवियाँ')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={language === 'en' ? image.title_en : image.title_hi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {language === 'en' ? image.title_en : image.title_hi}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {language === 'en' ? image.description_en : image.description_hi}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                          {image.category}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                          {t('Active', 'सक्रिय')}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEditImage(image)}
                        className="p-2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 rounded-full shadow-md hover:shadow-lg"
                        title={t('Edit', 'संपादित करें')}
                      >
                        <FiEdit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleStatus(image.id, image.is_active)}
                        className="p-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-md hover:shadow-lg"
                        title={t('Deactivate', 'निष्क्रिय करें')}
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteImage(image.id)}
                        className="p-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-full shadow-md hover:shadow-lg"
                        title={t('Delete', 'मिटाएं')}
                      >
                        <FiTrash className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Images */}
          {inactiveImages.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Inactive Images', 'निष्क्रिय छवियाँ')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {inactiveImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-70"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={language === 'en' ? image.title_en : image.title_hi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {language === 'en' ? image.title_en : image.title_hi}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {language === 'en' ? image.description_en : image.description_hi}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                          {image.category}
                        </span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium rounded-full">
                          {t('Inactive', 'निष्क्रिय')}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggleStatus(image.id, image.is_active)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
                      >
                        <FiCheck className="w-4 h-4" />
                        <span>{t('Activate', 'सक्रिय करें')}</span>
                      </motion.button>
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEditImage(image)}
                        className="p-2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 rounded-full shadow-md hover:shadow-lg"
                        title={t('Edit', 'संपादित करें')}
                      >
                        <FiEdit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteImage(image.id)}
                        className="p-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-full shadow-md hover:shadow-lg"
                        title={t('Delete', 'मिटाएं')}
                      >
                        <FiTrash className="w-4 h-4" />
                      </motion.button>
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