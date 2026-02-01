import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiVideo, FiPlay, FiEye, FiStar } from 'react-icons/fi';
import { Video } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface VideosTabProps {
  videos: Video[];
  loading: boolean;
  onAddVideo: () => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onToggleFeature: (id: string) => void;
}

export default function VideosTab({
  videos,
  loading,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onToggleStatus,
  onToggleFeature,
}: VideosTabProps) {
  const { language, t } = useLanguage();

  const activeVideos = videos.filter(v => v.is_active);
  const inactiveVideos = videos.filter(v => !v.is_active);

  return (
    <motion.div
      key="videos"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Videos', 'वीडियो प्रबंधित करें')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddVideo}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">{t('Add Video', 'वीडियो जोड़ें')}</span>
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={<FiVideo className="w-16 h-16 text-gray-400" />}
          title={t('No Videos', 'कोई वीडियो नहीं')}
          description={t('No videos have been added yet.', 'अभी तक कोई वीडियो नहीं जोड़ा गया है।')}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Videos */}
          {activeVideos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Active Videos', 'सक्रिय वीडियो')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
                  >
                    <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={language === 'en' ? video.title_en : video.title_hi}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiVideo className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white/20 backdrop-blur-sm p-4 rounded-full text-white"
                        >
                          <FiPlay className="w-6 h-6" />
                        </motion.button>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-2">
                        {video.is_featured && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                            {t('Featured', 'विशेष')}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                          {t('Active', 'सक्रिय')}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {language === 'en' ? video.title_en : video.title_hi}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {language === 'en' ? video.description_en : video.description_hi}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span>{video.duration}</span>
                        <span>{video.category}</span>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEditVideo(video)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>{t('Edit', 'संपादित करें')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleFeature(video.id)}
                          className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={video.is_featured ? t('Unfeature', 'विशेष हटाएं') : t('Feature', 'विशेष बनाएं')}
                        >
                          <FiStar className={`w-4 h-4 ${video.is_featured ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleStatus(video.id, video.is_active)}
                          className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={t('Deactivate', 'निष्क्रिय करें')}
                        >
                          <FiEye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteVideo(video.id)}
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

          {/* Inactive Videos */}
          {inactiveVideos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Inactive Videos', 'निष्क्रिय वीडियो')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-70 group"
                  >
                    <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={language === 'en' ? video.title_en : video.title_hi}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiVideo className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleStatus(video.id, video.is_active)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                          <FiEye className="w-4 h-4" />
                          <span>{t('Activate', 'सक्रिय करें')}</span>
                        </motion.button>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                          {t('Inactive', 'निष्क्रिय')}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {language === 'en' ? video.title_en : video.title_hi}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {language === 'en' ? video.description_en : video.description_hi}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span>{video.duration}</span>
                        <span>{video.category}</span>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEditVideo(video)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>{t('Edit', 'संपादित करें')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteVideo(video.id)}
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