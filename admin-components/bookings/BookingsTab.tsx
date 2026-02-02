import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiPhone, FiMail, FiCheck, FiX, FiEdit, FiTrash } from 'react-icons/fi';
import { Booking } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface BookingsTabProps {
  bookings: Booking[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
}

export default function BookingsTab({
  bookings,
  loading,
  onApprove,
  onReject,
  onDelete,
  onViewDetails,
}: BookingsTabProps) {
  const { language, t } = useLanguage();

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed') || [];
  const completedBookings = bookings?.filter(b => b.status === 'completed') || [];
  const cancelledBookings = bookings?.filter(b => b.status === 'cancelled') || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      key="bookings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Bookings', 'बुकिंग प्रबंधित करें')}
        </h2>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<FiCalendar className="w-16 h-16 text-gray-400" />}
          title={t('No Bookings', 'कोई बुकिंग नहीं')}
          description={t('No bookings have been made yet.', 'अभी तक कोई बुकिंग नहीं की गई है।')}
        />
      ) : (
        <div className="space-y-8">
          {/* Pending Bookings */}
          {pendingBookings.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Pending Bookings', 'लंबित बुकिंग')}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {booking.customer_name}
                      </h4>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {t('Pending', 'लंबित')}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FiMail className="w-4 h-4" />
                        <span className="text-sm">{booking.customer_email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FiPhone className="w-4 h-4" />
                        <span className="text-sm">{booking.customer_phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(booking.preferred_date).toLocaleDateString()} at {booking.preferred_time}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {t('Service', 'सेवा')}:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service_id}</p>
                      </div>
                      {booking.special_notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {t('Special Notes', 'विशेष नोट्स')}:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{booking.special_notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onApprove(booking.id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                      >
                        <FiCheck className="w-4 h-4" />
                        <span>{t('Confirm', 'पुष्टि करें')}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onReject(booking.id)}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Other Bookings */}
          {(confirmedBookings.length > 0 || completedBookings.length > 0 || cancelledBookings.length > 0) && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('All Bookings', 'सभी बुकिंग')}
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('Customer', 'ग्राहक')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('Service', 'सेवा')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('Date & Time', 'तारीख और समय')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('Status', 'स्थिति')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('Actions', 'क्रियाएं')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...confirmedBookings, ...completedBookings, ...cancelledBookings].map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {booking.customer_name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.customer_phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {booking.service_id}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {new Date(booking.preferred_date).toLocaleDateString()}<br />
                          {booking.preferred_time}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {t(booking.status.charAt(0).toUpperCase() + booking.status.slice(1), booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onViewDetails(booking)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                              title={t('View Details', 'विवरण देखें')}
                            >
                              <FiEdit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onDelete(booking.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                              title={t('Delete', 'मिटाएं')}
                            >
                              <FiTrash className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}