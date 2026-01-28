'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiStar, FiSettings, FiUser, FiEdit, FiTrash, FiPlus, FiLogOut, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { supabase, type Service, type Booking, type Testimonial, type Astrologer } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const { logout, adminName } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddAstrologerModal, setShowAddAstrologerModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newService, setNewService] = useState({
    name_en: '',
    name_hi: '',
    description_en: '',
    description_hi: '',
    category: 'Rituals',
    base_price: 0,
    duration_minutes: 60,
    is_active: true,
  });

  const [newAstrologer, setNewAstrologer] = useState({
    name_en: '',
    name_hi: '',
    bio_en: '',
    bio_hi: '',
    photo_url: '',
    experience_years: 1,
    specializations: [] as string[],
    is_active: true,
  });

  // Fetch all data based on active tab
  useEffect(() => {
    const tabFetchMap: { [key: string]: () => Promise<void> } = {
      services: fetchServices,
      bookings: fetchBookings,
      testimonials: fetchTestimonials,
      astrologers: fetchAstrologers,
      overview: fetchAllData,
    };

    const fetchFunction = tabFetchMap[activeTab];
    if (fetchFunction) {
      fetchFunction();
    }
  }, [activeTab]);


  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setErrorMessage('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrorMessage('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setErrorMessage('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchAstrologers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('astrologers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAstrologers(data || []);
    } catch (error) {
      console.error('Error fetching astrologers:', error);
      setErrorMessage('Failed to fetch astrologers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .insert([
          {
            ...newService,
            icon: '⚡',
          },
        ]);

      if (error) throw error;
      setSuccessMessage('Service added successfully!');
      setShowAddServiceModal(false);
      setNewService({
        name_en: '',
        name_hi: '',
        description_en: '',
        description_hi: '',
        category: 'Rituals',
        base_price: 0,
        duration_minutes: 60,
        is_active: true,
      });
      await fetchServices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding service:', error);
      setErrorMessage('Failed to add service');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Service deleted successfully!');
      await fetchServices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting service:', error);
      setErrorMessage('Failed to delete service');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleServiceStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Service status updated!');
      await fetchServices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating service:', error);
      setErrorMessage('Failed to update service');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAstrologer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('astrologers')
        .insert([newAstrologer]);

      if (error) throw error;
      setSuccessMessage('Astrologer added successfully!');
      setShowAddAstrologerModal(false);
      setNewAstrologer({
        name_en: '',
        name_hi: '',
        bio_en: '',
        bio_hi: '',
        photo_url: '',
        experience_years: 1,
        specializations: [],
        is_active: true,
      });
      await fetchAstrologers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding astrologer:', error);
      setErrorMessage('Failed to add astrologer');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAstrologer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this astrologer?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('astrologers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Astrologer deleted successfully!');
      await fetchAstrologers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting astrologer:', error);
      setErrorMessage('Failed to delete astrologer');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data for overview
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchServices(), fetchBookings(), fetchTestimonials(), fetchAstrologers()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: t('Overview', 'अवलोकन'), icon: FiSettings },
    { id: 'services', label: t('Services', 'सेवाएं'), icon: FiSettings },
    { id: 'bookings', label: t('Bookings', 'बुकिंग'), icon: FiCalendar },
    { id: 'testimonials', label: t('Testimonials', 'प्रशंसापत्र'), icon: FiStar },
    { id: 'astrologers', label: t('Astrologers', 'ज्योतिषी'), icon: FiUser },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-4">
            {t('Admin Panel', 'एडमिन पैनल')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('Manage your astrology services platform', 'अपनी ज्योतिष सेवाओं के प्लेटफॉर्म को प्रबंधित करें')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-saffron-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-saffron-50 dark:hover:bg-saffron-900/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('Dashboard Overview', 'डैशबोर्ड अवलोकन')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <FiCalendar className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">24</h3>
                      <p className="text-blue-100">{t('Total Bookings', 'कुल बुकिंग')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <FiSettings className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">8</h3>
                      <p className="text-green-100">{t('Active Services', 'सक्रिय सेवाएं')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <FiStar className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">4</h3>
                      <p className="text-purple-100">{t('Testimonials', 'प्रशंसापत्र')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                      <FiUser className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">4</h3>
                      <p className="text-orange-100">{t('Astrologers', 'ज्योतिषी')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t('Manage Services', 'सेवाएं प्रबंधित करें')}
                    </h2>
                    <button className="flex items-center space-x-2 bg-saffron-500 text-white px-4 py-2 rounded-lg hover:bg-saffron-600 transition-colors">
                      <FiPlus className="w-4 h-4" />
                      <span>{t('Add Service', 'सेवा जोड़ें')}</span>
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="px-6 py-3">{t('Name', 'नाम')}</th>
                            <th className="px-6 py-3">{t('Category', 'श्रेणी')}</th>
                            <th className="px-6 py-3">{t('Price', 'मूल्य')}</th>
                            <th className="px-6 py-3">{t('Duration', 'अवधि')}</th>
                            <th className="px-6 py-3">{t('Active', 'सक्रिय')}</th>
                            <th className="px-6 py-3">{t('Actions', 'क्रियाएं')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {language === 'en' ? service.name_en : service.name_hi}
                              </td>
                              <td className="px-6 py-4">{service.category}</td>
                              <td className="px-6 py-4">₹{service.base_price.toLocaleString()}</td>
                              <td className="px-6 py-4">{service.duration_minutes} min</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  service.is_active
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                  {service.is_active ? t('Yes', 'हाँ') : t('No', 'नहीं')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={() => handleToggleServiceStatus(service.id, service.is_active)}  
                                    title={t('Toggle Active Status', 'सक्रिय स्थिति टॉगल करें')} >
                                      
                                    <FiEdit className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => handleDeleteService(service.id)}
                                    title={t('Delete', 'मिटा')} >
                                    <FiTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('Manage Bookings', 'बुकिंग प्रबंधित करें')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('View and manage customer bookings.', 'ग्राहक बुकिंग देखें और प्रबंधित करें।')}
                  </p>
                  {/* TODO: Add booking management UI */}
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('Manage Testimonials', 'प्रशंसापत्र प्रबंधित करें')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('Add and manage customer testimonials.', 'ग्राहक प्रशंसापत्र जोड़ें और प्रबंधित करें।')}
                  </p>
                  {/* TODO: Add testimonial management UI */}
                </div>
              )}

              {activeTab === 'astrologers' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t('Manage Astrologers', 'ज्योतिषी प्रबंधित करें')}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddAstrologerModal(true)}
                      className="flex items-center space-x-2 bg-saffron-500 text-white px-4 py-2 rounded-lg hover:bg-saffron-600 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>{t('Add Astrologer', 'ज्योतिषी जोड़ें')}</span>
                    </motion.button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500 mx-auto"></div>
                    </div>
                  ) : astrologers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>{t('No astrologers found. Add one to get started!', 'कोई ज्योतिषी नहीं मिला। शुरू करने के लिए एक जोड़ें!')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {astrologers.map((astrologer) => (
                        <div key={astrologer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {astrologer.experience_years} {t('years experience', 'वर्षों का अनुभव')}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteAstrologer(astrologer.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title={t('Delete', 'मिटा')}
                            >
                              <FiTrash className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {astrologer.specializations.map((spec, idx) => (
                              <span key={idx} className="text-xs bg-saffron-100 dark:bg-saffron-900/30 text-saffron-800 dark:text-saffron-300 px-2 py-1 rounded">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Astrologer Modal */}
        {showAddAstrologerModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Add Astrologer', 'ज्योतिषी जोड़ें')}</h3>
                <button
                  onClick={() => setShowAddAstrologerModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  title={t('Close', 'बंद करें')}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddAstrologer} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('Name (English)', 'नाम (अंग्रेजी)')}
                  value={newAstrologer.name_en}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, name_en: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Name (Hindi)', 'नाम (हिंदी)')}
                  value={newAstrologer.name_hi}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, name_hi: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  required
                />
                <textarea
                  placeholder={t('Bio (English)', 'जीवनी (अंग्रेजी)')}
                  value={newAstrologer.bio_en}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, bio_en: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 h-20"
                  required
                />
                <textarea
                  placeholder={t('Bio (Hindi)', 'जीवनी (हिंदी)')}
                  value={newAstrologer.bio_hi}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, bio_hi: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 h-20"
                  required
                />
                <input
                  type="url"
                  placeholder={t('Photo URL', 'फोटो URL')}
                  value={newAstrologer.photo_url}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, photo_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                <input
                  type="number"
                  placeholder={t('Experience (years)', 'अनुभव (वर्ष)')}
                  value={newAstrologer.experience_years}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, experience_years: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Specializations (comma separated)', 'विशेषज्ञता (अल्पविराम से अलग)')}
                  value={newAstrologer.specializations.join(', ')}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, specializations: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-saffron-500 text-white py-2 rounded-lg font-semibold hover:bg-saffron-600 transition-colors disabled:opacity-50"
                >
                  {loading ? t('Adding...', 'जोड़ रहे हैं...') : t('Add Astrologer', 'ज्योतिषी जोड़ें')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}