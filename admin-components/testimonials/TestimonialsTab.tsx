import { motion } from 'framer-motion';
import { FiStar, FiCheck, FiX, FiEdit, FiTrash } from 'react-icons/fi';
import { Testimonial } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onFeature: (id: string) => void;
}

export default function TestimonialsTab({
  testimonials,
  loading,
  onApprove,
  onReject,
  onDelete,
  onFeature,
}: TestimonialsTabProps) {
  const { language, t } = useLanguage();

  const pendingTestimonials = testimonials?.filter(t => t.status === 'pending') || [];
  const approvedTestimonials = testimonials?.filter(t => t.status === 'approved') || [];
  const rejectedTestimonials = testimonials?.filter(t => t.status === 'rejected') || [];

  return (
    <motion.div
      key="testimonials"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Testimonials', 'प्रशंसापत्र प्रबंधित करें')}
        </h2>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : testimonials.length === 0 ? (
        <EmptyState
          icon={<FiStar className="w-16 h-16 text-gray-400" />}
          title={t('No Testimonials', 'कोई प्रशंसापत्र नहीं')}
          description={t('No testimonials have been submitted yet.', 'अभी तक कोई प्रशंसापत्र प्रस्तुत नहीं किया गया है।')}
        />
      ) : (
        <div className="space-y-8">
          {/* Pending Testimonials */}
          {pendingTestimonials.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Pending Approval', 'अनुमोदन लंबित')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < (testimonial.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full">
                        {t('Pending', 'लंबित')}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {language === 'en' ? testimonial.review_en : testimonial.review_hi}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {testimonial.customer_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.ritual_name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onApprove(testimonial.id)}
                          className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                          title={t('Approve', 'अनुमोदन')}
                        >
                          <FiCheck className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onReject(testimonial.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                          title={t('Reject', 'अस्वीकार')}
                        >
                          <FiX className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Testimonials */}
          {approvedTestimonials.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Approved', 'अनुमोदित')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < (testimonial.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        {testimonial.is_featured && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                            {t('Featured', 'विशेष')}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                          {t('Approved', 'अनुमोदित')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {language === 'en' ? testimonial.review_en : testimonial.review_hi}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {testimonial.customer_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.ritual_name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onFeature(testimonial.id)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          title={testimonial.is_featured ? t('Unfeature', 'विशेष हटाएं') : t('Feature', 'विशेष बनाएं')}
                        >
                          <FiStar className={`w-4 h-4 ${testimonial.is_featured ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(testimonial.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
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