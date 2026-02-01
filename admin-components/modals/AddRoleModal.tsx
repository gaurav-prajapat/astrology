import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUsers } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface AddRoleModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function AddRoleModal({ onClose, onSuccess, onError }: AddRoleModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_en: '',
    name_hi: '',
    description_en: '',
    description_hi: '',
    permissions: [] as string[],
    is_active: true,
  });

  const availablePermissions = [
    'admin',
    'staff_management',
    'content_management',
    'testimonials',
    'gallery',
    'videos',
    'carousel',
    'settings',
    'bookings',
    'services'
  ];

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('staff_roles')
        .insert([{
          name_en: formData.name_en,
          name_hi: formData.name_hi,
          description_en: formData.description_en,
          description_hi: formData.description_hi,
          permissions: formData.permissions,
          is_active: formData.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error('Error adding role:', error);
      onError(error.message || 'Failed to add role');
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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {t('Add Staff Role', 'कर्मचारी भूमिका जोड़ें')}
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
              placeholder={t('Role Name (English)', 'भूमिका नाम (अंग्रेजी)')}
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="text"
              placeholder={t('Role Name (Hindi)', 'भूमिका नाम (हिंदी)')}
              value={formData.name_hi}
              onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
              value={formData.description_hi}
              onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('Permissions', 'अनुमतियाँ')}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              {availablePermissions.map(permission => (
                <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {permission.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-800">
            <input
              type="checkbox"
              id="add-role-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="add-role-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Active Role', 'सक्रिय भूमिका')}
            </label>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Adding...', 'जोड़ रहे हैं...') : t('Add Role', 'भूमिका जोड़ें')}
          </motion.button>
        </form>
        </div>
      </motion.div>
    </div>
  );
}