import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiUsers } from 'react-icons/fi';
import { StaffRole } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface RolesTabProps {
  roles: StaffRole[];
  loading: boolean;
  onAddRole: () => void;
  onEditRole: (role: StaffRole) => void;
  onDeleteRole: (id: string) => void;
}

export default function RolesTab({
  roles,
  loading,
  onAddRole,
  onEditRole,
  onDeleteRole,
}: RolesTabProps) {
  const { language, t } = useLanguage();

  return (
    <motion.div
      key="roles"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Roles', 'भूमिकाएं प्रबंधित करें')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddRole}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">{t('Add Role', 'भूमिका जोड़ें')}</span>
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : roles.length === 0 ? (
        <EmptyState
          icon={<FiUsers className="w-16 h-16 text-gray-400" />}
          title={t('No Roles', 'कोई भूमिका नहीं')}
          description={t('No roles have been created yet.', 'अभी तक कोई भूमिका नहीं बनाई गई है।')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === 'en' ? role.name_en : role.name_hi}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    role.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}
                >
                  {role.is_active ? t('Active', 'सक्रिय') : t('Inactive', 'निष्क्रिय')}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {language === 'en' ? role.description_en : role.description_hi}
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t('Permissions', 'अनुमतियाँ')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(role.permissions) ? (
                    role.permissions.map((permission: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
                      >
                        {permission}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {t('No permissions set', 'कोई अनुमति नहीं सेट की गई')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEditRole(role)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <FiEdit className="w-4 h-4" />
                  <span>{t('Edit', 'संपादित करें')}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDeleteRole(role.id)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                >
                  <FiTrash className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}