import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSettings } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface AddSettingsModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function AddSettingsModal({ onClose, onSuccess, onError }: AddSettingsModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    value_en: '',
    value_hi: '',
    description_en: '',
    description_hi: '',
    category: 'general',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key) {
      onError('Please enter a key');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .insert([{
          key: formData.key,
          value_en: formData.value_en,
          value_hi: formData.value_hi,
          description_en: formData.description_en,
          description_hi: formData.description_hi,
          category: formData.category,
          is_active: formData.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error('Error adding site setting:', error);
      onError(error.message || 'Failed to add site setting');
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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
            {t('Add Site Setting', 'साइट सेटिंग जोड़ें')}
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
          <input
            type="text"
            placeholder={t('Setting Key', 'सेटिंग कुंजी')}
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('Value (English)', 'मूल्य (अंग्रेजी)')}
              value={formData.value_en}
              onChange={(e) => setFormData({ ...formData, value_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder={t('Value (Hindi)', 'मूल्य (हिंदी)')}
              value={formData.value_hi}
              onChange={(e) => setFormData({ ...formData, value_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
              value={formData.description_hi}
              onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
          >
            <option value="general">{t('General', 'सामान्य')}</option>
            <option value="contact">{t('Contact', 'संपर्क')}</option>
            <option value="social">{t('Social', 'सामाजिक')}</option>
            <option value="seo">{t('SEO', 'एसईओ')}</option>
            <option value="appearance">{t('Appearance', 'उपस्थिति')}</option>
            <option value="booking">{t('Booking', 'बुकिंग')}</option>
          </select>
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              id="add-setting-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-gray-500 focus:ring-gray-500"
            />
            <label htmlFor="add-setting-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Active Setting', 'सक्रिय सेटिंग')}
            </label>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Adding...', 'जोड़ रहे हैं...') : t('Add Setting', 'सेटिंग जोड़ें')}
          </motion.button>
        </form>
        </div>
      </motion.div>
    </div>
  );
}