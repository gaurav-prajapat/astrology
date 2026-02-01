import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiVideo } from 'react-icons/fi';
import { supabase, type Video } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface EditVideoModalProps {
  video: Video;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EditVideoModal({ video, onClose, onSuccess, onError }: EditVideoModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_en: video.title_en,
    title_hi: video.title_hi,
    description_en: video.description_en || '',
    description_hi: video.description_hi || '',
    video_url: video.youtube_url,
    thumbnail_url: video.thumbnail_url || '',
    category: video.category,
    duration: parseInt(video.duration) || 0,
    is_active: video.is_active,
    is_featured: video.is_featured,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title_en: formData.title_en,
          title_hi: formData.title_hi,
          description_en: formData.description_en,
          description_hi: formData.description_hi,
          youtube_url: formData.video_url,
          thumbnail_url: formData.thumbnail_url,
          category: formData.category,
          duration: formData.duration,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', video.id);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error('Error updating video:', error);
      onError(error.message || 'Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            {t('Edit Video', 'वीडियो संपादित करें')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title={t('Close', 'बंद करें')}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('Title (English)', 'शीर्षक (अंग्रेजी)')}
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="text"
              placeholder={t('Title (Hindi)', 'शीर्षक (हिंदी)')}
              value={formData.title_hi}
              onChange={(e) => setFormData({ ...formData, title_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <textarea
              placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all h-20 resize-none"
            />
            <textarea
              placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
              value={formData.description_hi}
              onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all h-20 resize-none"
            />
          </div>
          
          <input
            type="url"
            placeholder={t('Video URL', 'वीडियो URL')}
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            required
          />
          
          <input
            type="url"
            placeholder={t('Thumbnail URL (Optional)', 'थंबनेल URL (वैकल्पिक)')}
            value={formData.thumbnail_url}
            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <option value="general">{t('General', 'सामान्य')}</option>
            <option value="rituals">{t('Rituals', 'अनुष्ठान')}</option>
            <option value="astrology">{t('Astrology', 'ज्योतिष')}</option>
            <option value="testimonials">{t('Testimonials', 'प्रशंसापत्र')}</option>
            <option value="educational">{t('Educational', 'शैक्षिक')}</option>
          </select>
          
          <input
            type="number"
            placeholder={t('Duration (seconds)', 'अवधि (सेकंड)')}
            value={formData.duration || ''}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            min="0"
          />
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
            <input
              type="checkbox"
              id="edit-video-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-red-500 focus:ring-red-500"
            />
            <label htmlFor="edit-video-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Active Video', 'सक्रिय वीडियो')}
            </label>
          </div>
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
            <input
              type="checkbox"
              id="edit-video-featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded text-yellow-500 focus:ring-yellow-500"
            />
            <label htmlFor="edit-video-featured" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Featured Video', 'विशेष रुप से प्रदर्शित वीडियो')}
            </label>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Updating...', 'अपडेट कर रहे हैं...') : t('Update Video', 'वीडियो अपडेट करें')}
          </motion.button>
        </form>
        </div>
      </motion.div>
    </div>
  );
}