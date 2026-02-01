import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface EditServiceModalProps {
  service: Service;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EditServiceModal({ service, onClose, onSuccess, onError }: EditServiceModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_en: service.name_en,
    name_hi: service.name_hi,
    description_en: service.description_en || '',
    description_hi: service.description_hi || '',
    category: service.category,
    base_price: service.base_price,
    duration_minutes: service.duration_minutes,
    is_active: service.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .update(formData)
        .eq('id', service.id);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error updating service:', error);
      onError('Failed to update service');
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
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl"
      >
        <div className="p-6 flex justify-between items-center mb-0">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t('Edit Service', 'सेवा संपादित करें')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title={t('Close', 'बंद करें')}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow px-6 pb-2">
          <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t('Service Name (English)', 'सेवा का नाम (अंग्रेजी)')}
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
          
          <input
            type="text"
            placeholder={t('Service Name (Hindi)', 'सेवा का नाम (हिंदी)')}
            value={formData.name_hi}
            onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
          
          <textarea
            placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-20 resize-none"
          />
          
          <textarea
            placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
            value={formData.description_hi}
            onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-20 resize-none"
          />
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="Rituals">{t('Rituals', 'अनुष्ठान')}</option>
            <option value="Havan">{t('Havan', 'हवन')}</option>
            <option value="Pooja">{t('Pooja', 'पूजा')}</option>
            <option value="Consultation">{t('Consultation', 'परामर्श')}</option>
            <option value="Astrology">{t('Astrology', 'ज्योतिष')}</option>
          </select>
          
          <input
            type="number"
            placeholder={t('Base Price (₹)', 'मूल मूल्य (₹)')}
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            min="0"
            required
          />
          
          <input
            type="number"
            placeholder={t('Duration (minutes)', 'अवधि (मिनट)')}
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            min="15"
            required
          />
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
            <input
              type="checkbox"
              id="edit-service-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-green-500 focus:ring-green-500"
            />
            <label htmlFor="edit-service-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Active Service', 'सक्रिय सेवा')}
            </label>
          </div>
          </form>
        </div>
        
        <div className="p-6 pt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Updating...', 'अपडेट कर रहे हैं...') : t('Update Service', 'सेवा अपडेट करें')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}