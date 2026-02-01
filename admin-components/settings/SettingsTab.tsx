import { motion } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';
import { SiteSetting } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface SettingsTabProps {
  settings: SiteSetting[];
  loading: boolean;
  onSaveSettings: (updatedSettings: SiteSetting[]) => void;
}

export default function SettingsTab({
  settings,
  loading,
  onSaveSettings,
}: SettingsTabProps) {
  const { language, t } = useLanguage();

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Site Settings', 'साइट सेटिंग्स')}
        </h2>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : settings.length === 0 ? (
        <EmptyState
          icon={<FiSettings className="w-16 h-16 text-gray-400" />}
          title={t('No Settings', 'कोई सेटिंग नहीं')}
          description={t('No site settings have been configured yet.', 'अभी तक कोई साइट सेटिंग कॉन्फ़िगर नहीं की गई है।')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.map((setting) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {language === 'en' ? setting.description_en : setting.description_hi}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 capitalize">
                {setting.category}
              </p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {typeof setting.setting_value === 'boolean' 
                  ? (setting.setting_value ? 'Enabled' : 'Disabled')
                  : typeof setting.setting_value === 'object' && setting.setting_value !== null
                    ? (language === 'en' ? setting.setting_value.en : setting.setting_value.hi)
                    : String(setting.setting_value)
                }
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}