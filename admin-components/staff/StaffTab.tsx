import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { StaffMember, StaffRole } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface StaffTabProps {
  staff: StaffMember[];
  roles: StaffRole[];
  loading: boolean;
  onAddStaff: () => void;
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
}

export default function StaffTab({
  staff,
  roles,
  loading,
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
}: StaffTabProps) {
  const { language, t } = useLanguage();

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? (language === 'en' ? role.name_en : role.name_hi) : 'Unknown Role';
  };

  return (
    <motion.div
      key="staff"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Staff', 'कर्मचारी प्रबंधित करें')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddStaff}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">{t('Add Staff', 'कर्मचारी जोड़ें')}</span>
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : staff.length === 0 ? (
        <EmptyState
          icon={<FiUser className="w-16 h-16 text-gray-400" />}
          title={t('No Staff Members', 'कोई कर्मचारी नहीं')}
          description={t('No staff members have been added yet.', 'अभी तक कोई कर्मचारी नहीं जोड़ा गया है।')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4 mb-4">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.first_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {member.first_name} {member.last_name}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      member.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    {member.is_active ? t('Active', 'सक्रिय') : t('Inactive', 'निष्क्रिय')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FiMail className="w-4 h-4" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FiPhone className="w-4 h-4" />
                  <span className="text-sm">{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('Role', 'भूमिका')}:
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                    {getRoleName(member.role_id)}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEditStaff(member)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <FiEdit className="w-4 h-4" />
                  <span>{t('Edit', 'संपादित करें')}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDeleteStaff(member.id)}
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