'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiCalendar, FiStar, FiSettings, FiUser, FiEdit, FiTrash, FiPlus, FiLogOut, FiX, FiCheck, FiAlertCircle, FiVideo, FiImage, FiSliders, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { supabase, type Service, type Booking, type Testimonial, type Astrologer, type Video, type CarouselItem } from '@/lib/supabase';
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddAstrologerModal, setShowAddAstrologerModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showAddCarouselModal, setShowAddCarouselModal] = useState(false);
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

  const [newVideo, setNewVideo] = useState({
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
    youtube_url: '',
    thumbnail_url: '',
    duration: '',
    category: 'General',
    is_featured: false,
    is_active: true,
  });

  const [newCarouselItem, setNewCarouselItem] = useState({
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
    image_url: '',
    link: '',
    is_active: true,
    sort_order: 0,
  });

  // Fetch all data based on active tab
  useEffect(() => {
    const tabFetchMap: { [key: string]: () => Promise<void> } = {
      services: fetchServices,
      bookings: fetchBookings,
      testimonials: fetchTestimonials,
      astrologers: fetchAstrologers,
      videos: fetchVideos,
      carousel: fetchCarouselItems,
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

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setErrorMessage('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCarouselItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCarouselItems(data || []);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      setErrorMessage('Failed to fetch carousel items');
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

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .insert([newVideo]);

      if (error) throw error;
      setSuccessMessage('Video added successfully!');
      setShowAddVideoModal(false);
      setNewVideo({
        title_en: '',
        title_hi: '',
        description_en: '',
        description_hi: '',
        youtube_url: '',
        thumbnail_url: '',
        duration: '',
        category: 'General',
        is_featured: false,
        is_active: true,
      });
      await fetchVideos();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding video:', error);
      setErrorMessage('Failed to add video');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Video deleted successfully!');
      await fetchVideos();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting video:', error);
      setErrorMessage('Failed to delete video');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVideoStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Video status updated!');
      await fetchVideos();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating video:', error);
      setErrorMessage('Failed to update video');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVideoFeatured = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Video featured status updated!');
      await fetchVideos();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating video:', error);
      setErrorMessage('Failed to update video');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCarouselItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('carousel_items')
        .insert([newCarouselItem]);

      if (error) throw error;
      setSuccessMessage('Carousel item added successfully!');
      setShowAddCarouselModal(false);
      setNewCarouselItem({
        title_en: '',
        title_hi: '',
        description_en: '',
        description_hi: '',
        image_url: '',
        link: '',
        is_active: true,
        sort_order: 0,
      });
      await fetchCarouselItems();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding carousel item:', error);
      setErrorMessage('Failed to add carousel item');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarouselItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this carousel item?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('carousel_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Carousel item deleted successfully!');
      await fetchCarouselItems();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      setErrorMessage('Failed to delete carousel item');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCarouselItemStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('carousel_items')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Carousel item status updated!');
      await fetchCarouselItems();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating carousel item:', error);
      setErrorMessage('Failed to update carousel item');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCarouselSortOrder = async (id: string, sortOrder: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('carousel_items')
        .update({ sort_order: sortOrder })
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Sort order updated!');
      await fetchCarouselItems();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating sort order:', error);
      setErrorMessage('Failed to update sort order');
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
    { id: 'overview', label: t('Overview', 'अवलोकन'), icon: FiBarChart2, color: 'from-purple-500 to-indigo-600' },
    { id: 'services', label: t('Services', 'सेवाएं'), icon: FiSettings, color: 'from-blue-500 to-cyan-600' },
    { id: 'bookings', label: t('Bookings', 'बुकिंग'), icon: FiCalendar, color: 'from-green-500 to-emerald-600' },
    { id: 'testimonials', label: t('Testimonials', 'प्रशंसापत्र'), icon: FiStar, color: 'from-yellow-500 to-orange-600' },
    { id: 'astrologers', label: t('Astrologers', 'ज्योतिषी'), icon: FiUser, color: 'from-pink-500 to-rose-600' },
    { id: 'videos', label: t('Videos', 'वीडियो'), icon: FiVideo, color: 'from-red-500 to-pink-600' },
    { id: 'carousel', label: t('Carousel', 'कैरोसेल'), icon: FiImage, color: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-saffron-600 via-orange-600 to-amber-600 dark:from-saffron-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-2">
                {t('Admin Dashboard', 'एडमिन डैशबोर्ड')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('Welcome back', 'स्वागत है')}, <span className="font-semibold text-saffron-600 dark:text-saffron-400">{adminName || 'Admin'}</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">{t('Logout', 'लॉगआउट')}</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 sticky top-6">
              <nav className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full group relative overflow-hidden flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                        activeTab === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-saffron-50 hover:to-orange-50 dark:hover:from-saffron-900/20 dark:hover:to-orange-900/20'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl p-8"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {t('Dashboard Overview', 'डैशबोर्ड अवलोकन')}
                      </h2>
                      <FiTrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                      {[
                        { icon: FiCalendar, count: bookings.length, label: t('Total Bookings', 'कुल बुकिंग'), gradient: 'from-blue-500 via-blue-600 to-indigo-600', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
                        { icon: FiSettings, count: services.filter(s => s.is_active).length, label: t('Active Services', 'सक्रिय सेवाएं'), gradient: 'from-green-500 via-emerald-600 to-teal-600', iconBg: 'bg-green-100 dark:bg-green-900/30' },
                        { icon: FiStar, count: testimonials.length, label: t('Testimonials', 'प्रशंसापत्र'), gradient: 'from-yellow-500 via-orange-500 to-red-500', iconBg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                        { icon: FiUser, count: astrologers.filter(a => a.is_active).length, label: t('Astrologers', 'ज्योतिषी'), gradient: 'from-purple-500 via-pink-600 to-rose-600', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
                      ].map((stat, index) => {
                        const StatIcon = stat.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer group`}
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative z-10">
                              <div className={`${stat.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                                <StatIcon className="w-7 h-7 text-current" />
                              </div>
                              <h3 className="text-4xl font-bold mb-2">{stat.count}</h3>
                              <p className="text-white/90 font-medium">{stat.label}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiVideo className="w-5 h-5 mr-2 text-indigo-600" />
                          {t('Video Content', 'वीडियो सामग्री')}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">{t('Total Videos', 'कुल वीडियो')}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{videos.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">{t('Featured', 'विशेष')}</span>
                            <span className="font-bold text-indigo-600">{videos.filter(v => v.is_featured).length}</span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiImage className="w-5 h-5 mr-2 text-teal-600" />
                          {t('Carousel Items', 'कैरोसेल आइटम')}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">{t('Total Items', 'कुल आइटम')}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{carouselItems.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">{t('Active', 'सक्रिय')}</span>
                            <span className="font-bold text-teal-600">{carouselItems.filter(c => c.is_active).length}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {t('Manage Services', 'सेवाएं प्रबंधित करें')}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddServiceModal(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-saffron-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <FiPlus className="w-5 h-5" />
                        <span className="font-medium">{t('Add Service', 'सेवा जोड़ें')}</span>
                      </motion.button>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-saffron-200 dark:border-saffron-800 rounded-full"></div>
                          <div className="w-16 h-16 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('Name', 'नाम')}</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('Category', 'श्रेणी')}</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('Price', 'मूल्य')}</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('Duration', 'अवधि')}</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('Status', 'स्थिति')}</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('Actions', 'क्रियाएं')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {services.map((service, index) => (
                              <motion.tr
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {language === 'en' ? service.name_en : service.name_hi}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                                    {service.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                  ₹{service.base_price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                  {service.duration_minutes} min
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    service.is_active
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  }`}>
                                    {service.is_active ? t('Active', 'सक्रिय') : t('Inactive', 'निष्क्रिय')}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex space-x-3">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleToggleServiceStatus(service.id, service.is_active)}
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                      title={t('Toggle Status', 'स्थिति टॉगल करें')}
                                    >
                                      <FiSliders className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteService(service.id)}
                                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                      title={t('Delete', 'मिटाएं')}
                                    >
                                      <FiTrash className="w-5 h-5" />
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'bookings' && (
                  <motion.div
                    key="bookings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                      {t('Manage Bookings', 'बुकिंग प्रबंधित करें')}
                    </h2>
                    <div className="text-center py-16">
                      <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {t('Booking management coming soon', 'बुकिंग प्रबंधन जल्द आ रहा है')}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'testimonials' && (
                  <motion.div
                    key="testimonials"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                      {t('Manage Testimonials', 'प्रशंसापत्र प्रबंधित करें')}
                    </h2>
                    <div className="text-center py-16">
                      <FiStar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {t('Testimonial management coming soon', 'प्रशंसापत्र प्रबंधन जल्द आ रहा है')}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'astrologers' && (
                  <motion.div
                    key="astrologers"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {t('Manage Astrologers', 'ज्योतिषी प्रबंधित करें')}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddAstrologerModal(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <FiPlus className="w-5 h-5" />
                        <span className="font-medium">{t('Add Astrologer', 'ज्योतिषी जोड़ें')}</span>
                      </motion.button>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-pink-200 dark:border-pink-800 rounded-full"></div>
                          <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                      </div>
                    ) : astrologers.length === 0 ? (
                      <div className="text-center py-16">
                        <FiUser className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {t('No astrologers found. Add one to get started!', 'कोई ज्योतिषी नहीं मिला। शुरू करने के लिए एक जोड़ें!')}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {astrologers.map((astrologer, index) => (
                          <motion.div
                            key={astrologer.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                {astrologer.photo_url ? (
                                  <img src={astrologer.photo_url} alt={astrologer.name_en} className="w-16 h-16 rounded-full object-cover border-4 border-pink-500" />
                                ) : (
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {(language === 'en' ? astrologer.name_en : astrologer.name_hi).charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {astrologer.experience_years} {t('years experience', 'वर्ष का अनुभव')}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                astrologer.is_active
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {astrologer.is_active ? t('Active', 'सक्रिय') : t('Inactive', 'निष्क्रिय')}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                              {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {astrologer.specializations.map((spec, idx) => (
                                <span key={idx} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-xs font-medium rounded-full">
                                  {spec}
                                </span>
                              ))}
                            </div>
                            <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              >
                                <FiEdit className="w-4 h-4" />
                                <span className="text-sm font-medium">{t('Edit', 'संपादित करें')}</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteAstrologer(astrologer.id)}
                                className="flex-1 flex items-center justify-center space-x-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                              >
                                <FiTrash className="w-4 h-4" />
                                <span className="text-sm font-medium">{t('Delete', 'मिटाएं')}</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'videos' && (
                  <motion.div
                    key="videos"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {t('Manage Videos', 'वीडियो प्रबंधित करें')}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddVideoModal(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <FiPlus className="w-5 h-5" />
                        <span className="font-medium">{t('Add Video', 'वीडियो जोड़ें')}</span>
                      </motion.button>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-red-200 dark:border-red-800 rounded-full"></div>
                          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                      </div>
                    ) : videos.length === 0 ? (
                      <div className="text-center py-16">
                        <FiVideo className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {t('No videos found. Add one to get started!', 'कोई वीडियो नहीं मिला। शुरू करने के लिए एक जोड़ें!')}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {videos.map((video, index) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-600"
                          >
                            <div className="relative h-48 bg-gradient-to-br from-red-500 to-pink-600">
                              {video.thumbnail_url ? (
                                <img src={video.thumbnail_url} alt={video.title_en} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiVideo className="w-16 h-16 text-white/50" />
                                </div>
                              )}
                              {video.is_featured && (
                                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                  <FiStar className="w-3 h-3" />
                                  <span>{t('Featured', 'विशेष')}</span>
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                                  {language === 'en' ? video.title_en : video.title_hi}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${
                                  video.is_active
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                  {video.is_active ? t('Active', 'सक्रिय') : t('Inactive', 'निष्क्रिय')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                                  {video.category}
                                </span>
                                {video.duration && (
                                  <span className="flex items-center">
                                    <FiVideo className="w-4 h-4 mr-1" />
                                    {video.duration}
                                  </span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleToggleVideoFeatured(video.id, video.is_featured)}
                                  className="flex-1 flex items-center justify-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 py-2 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-sm font-medium"
                                >
                                  <FiStar className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleToggleVideoStatus(video.id, video.is_active)}
                                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                                >
                                  <FiSliders className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteVideo(video.id)}
                                  className="flex-1 flex items-center justify-center space-x-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                                >
                                  <FiTrash className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'carousel' && (
                  <motion.div
                    key="carousel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {t('Manage Carousel', 'कैरोसेल प्रबंधित करें')}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddCarouselModal(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <FiPlus className="w-5 h-5" />
                        <span className="font-medium">{t('Add Carousel Item', 'कैरोसेल आइटम जोड़ें')}</span>
                      </motion.button>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-teal-200 dark:border-teal-800 rounded-full"></div>
                          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                      </div>
                    ) : carouselItems.length === 0 ? (
                      <div className="text-center py-16">
                        <FiImage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {t('No carousel items found. Add one to get started!', 'कोई कैरोसेल आइटम नहीं मिला। शुरू करने के लिए एक जोड़ें!')}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {carouselItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center space-x-6">
                              <div className="relative flex-shrink-0">
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.title_en} className="w-32 h-32 object-cover rounded-xl" />
                                ) : (
                                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                                    <FiImage className="w-12 h-12 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {language === 'en' ? item.title_en : item.title_hi}
                                  </h3>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${
                                    item.is_active
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  }`}>
                                    {item.is_active ? t('Active', 'सक्रिय') : t('Inactive', 'निष्क्रिय')}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                  {language === 'en' ? item.description_en : item.description_hi}
                                </p>
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {t('Sort Order', 'क्रम')}:
                                    </label>
                                    <input
                                      type="number"
                                      value={item.sort_order}
                                      onChange={(e) => handleUpdateCarouselSortOrder(item.id, parseInt(e.target.value) || 0)}
                                      className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                                      min="0"
                                    />
                                  </div>
                                  <div className="flex space-x-2 ml-auto">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                      <FiEdit className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleToggleCarouselItemStatus(item.id, item.is_active)}
                                      className="p-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                    >
                                      <FiSliders className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteCarouselItem(item.id)}
                                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                    >
                                      <FiTrash className="w-5 h-5" />
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Modals remain the same as original code... */}
        {/* Add Video Modal */}
        {showAddVideoModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {t('Add Video', 'वीडियो जोड़ें')}
                </h3>
                <button
                  onClick={() => setShowAddVideoModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  title={t('Close', 'बंद करें')}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddVideo} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('Title (English)', 'शीर्षक (अंग्रेजी)')}
                  value={newVideo.title_en}
                  onChange={(e) => setNewVideo({ ...newVideo, title_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Title (Hindi)', 'शीर्षक (हिंदी)')}
                  value={newVideo.title_hi}
                  onChange={(e) => setNewVideo({ ...newVideo, title_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
                  value={newVideo.description_en}
                  onChange={(e) => setNewVideo({ ...newVideo, description_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all h-20 resize-none"
                />
                <textarea
                  placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
                  value={newVideo.description_hi}
                  onChange={(e) => setNewVideo({ ...newVideo, description_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all h-20 resize-none"
                />
                <input
                  type="url"
                  placeholder={t('YouTube URL', 'YouTube URL')}
                  value={newVideo.youtube_url}
                  onChange={(e) => setNewVideo({ ...newVideo, youtube_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="url"
                  placeholder={t('Thumbnail URL (optional)', 'थंबनेल URL (वैकल्पिक)')}
                  value={newVideo.thumbnail_url}
                  onChange={(e) => setNewVideo({ ...newVideo, thumbnail_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  placeholder={t('Duration (e.g., 15:30)', 'अवधि (उदाहरण, 15:30)')}
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <select
                  value={newVideo.category}
                  onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="General">{t('General', 'सामान्य')}</option>
                  <option value="Astrology">{t('Astrology', 'ज्योतिष')}</option>
                  <option value="Rituals">{t('Rituals', 'अनुष्ठान')}</option>
                  <option value="Havan">{t('Havan', 'हवन')}</option>
                  <option value="Pooja">{t('Pooja', 'पूजा')}</option>
                </select>
                <div className="flex items-center space-x-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newVideo.is_featured}
                    onChange={(e) => setNewVideo({ ...newVideo, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded text-yellow-500 focus:ring-yellow-500"
                  />
                  <label htmlFor="featured" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                    {t('Featured Video', 'विशेष वीडियो')}
                  </label>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('Adding...', 'जोड़ रहे हैं...') : t('Add Video', 'वीडियो जोड़ें')}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Carousel Item Modal */}
        {showAddCarouselModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('Add Carousel Item', 'कैरोसेल आइटम जोड़ें')}
                </h3>
                <button
                  onClick={() => setShowAddCarouselModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  title={t('Close', 'बंद करें')}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddCarouselItem} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('Title (English)', 'शीर्षक (अंग्रेजी)')}
                  value={newCarouselItem.title_en}
                  onChange={(e) => setNewCarouselItem({ ...newCarouselItem, title_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Title (Hindi)', 'शीर्षक (हिंदी)')}
                  value={newCarouselItem.title_hi}
                  onChange={(e) => setNewCarouselItem({ ...newCarouselItem, title_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
                  value={newCarouselItem.description_en}
                  onChange={(e) => setNewCarouselItem({ ...newCarouselItem, description_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-20 resize-none"
                />
                <textarea
                  placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
                  value={newCarouselItem.description_hi}
                  onChange={(e) => setNewCarouselItem({ ...newCarouselItem, description_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-20 resize-none"
                />
                <input
                  type="url"
                  placeholder={t('Image URL', 'छवि URL')}
                  value={newCarouselItem.image_url}
                  onChange={(e) => setNewCarouselItem({ ...newCarouselItem, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="url"
                  placeholder={t('Link (optional)', 'लिंक (वैकल्पिक)')}
                  value={newCarouselItem.link}
                  onChange={(e) => setNewCarouselItem({ ...newCarouselItem, link: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  placeholder={t('Sort Order', 'क्रम')}
                  value={newCarouselItem.sort_order}
                  onChange={(e) => setNewCarouselItem({ ...newCarouselItem, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  min="0"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('Adding...', 'जोड़ रहे हैं...') : t('Add Carousel Item', 'कैरोसेल आइटम जोड़ें')}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Astrologer Modal */}
        {showAddAstrologerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {t('Add Astrologer', 'ज्योतिषी जोड़ें')}
                </h3>
                <button
                  onClick={() => setShowAddAstrologerModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Name (Hindi)', 'नाम (हिंदी)')}
                  value={newAstrologer.name_hi}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, name_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
                <textarea
                  placeholder={t('Bio (English)', 'जीवनी (अंग्रेजी)')}
                  value={newAstrologer.bio_en}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, bio_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all h-20 resize-none"
                  required
                />
                <textarea
                  placeholder={t('Bio (Hindi)', 'जीवनी (हिंदी)')}
                  value={newAstrologer.bio_hi}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, bio_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all h-20 resize-none"
                  required
                />
                <input
                  type="url"
                  placeholder={t('Photo URL', 'फोटो URL')}
                  value={newAstrologer.photo_url}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, photo_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  placeholder={t('Experience (years)', 'अनुभव (वर्ष)')}
                  value={newAstrologer.experience_years}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, experience_years: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Specializations (comma separated)', 'विशेषज्ञता (अल्पविराम से अलग)')}
                  value={newAstrologer.specializations.join(', ')}
                  onChange={(e) => setNewAstrologer({ ...newAstrologer, specializations: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('Adding...', 'जोड़ रहे हैं...') : t('Add Astrologer', 'ज्योतिषी जोड़ें')}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -50, x: 50 }}
              className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6" />
              </div>
              <span className="font-medium">{successMessage}</span>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -50, x: 50 }}
              className="fixed top-6 right-6 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <span className="font-medium">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}