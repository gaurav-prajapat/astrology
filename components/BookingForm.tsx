'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

type BookingData = {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  specialNotes: string;
};

export default function BookingForm() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    specialNotes: '',
  });

  useEffect(() => {
    fetchServices();
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService) {
      setBookingData(prev => ({ ...prev, serviceId: selectedService }));
      localStorage.removeItem('selectedService');
    }
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').eq('is_active', true);
    setServices(data || []);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!bookingData.serviceId) newErrors.serviceId = t('Please select a service', 'कृपया एक सेवा चुनें');
    }

    if (currentStep === 2) {
      if (!bookingData.customerName) newErrors.customerName = t('Name is required', 'नाम आवश्यक है');
      if (!bookingData.customerEmail) {
        newErrors.customerEmail = t('Email is required', 'ईमेल आवश्यक है');
      } else if (!/\S+@\S+\.\S+/.test(bookingData.customerEmail)) {
        newErrors.customerEmail = t('Invalid email format', 'अमान्य ईमेल प्रारूप');
      }
      if (!bookingData.customerPhone) {
        newErrors.customerPhone = t('Phone is required', 'फ़ोन आवश्यक है');
      } else if (!/^\d{10}$/.test(bookingData.customerPhone.replace(/\D/g, ''))) {
        newErrors.customerPhone = t('Invalid phone number', 'अमान्य फ़ोन नंबर');
      }
    }

    if (currentStep === 3) {
      if (!bookingData.preferredDate) newErrors.preferredDate = t('Date is required', 'तिथि आवश्यक है');
      if (!bookingData.preferredTime) newErrors.preferredTime = t('Time is required', 'समय आवश्यक है');
      if (!bookingData.location) newErrors.location = t('Location is required', 'स्थान आवश्यक है');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const selectedService = services.find(s => s.id === bookingData.serviceId);
      const { error } = await supabase.from('bookings').insert({
        service_id: bookingData.serviceId,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        preferred_date: bookingData.preferredDate,
        preferred_time: bookingData.preferredTime,
        location: bookingData.location,
        special_notes: bookingData.specialNotes,
        total_amount: selectedService?.base_price || 0,
        status: 'pending',
        payment_status: 'pending',
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(t('Failed to submit booking. Please try again.', 'बुकिंग सबमिट करने में विफल। कृपया पुनः प्रयास करें।'));
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === bookingData.serviceId);

  if (submitted) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheck className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('Booking Confirmed!', 'बुकिंग पुष्टि हो गई!')}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {t(
            'Thank you for your booking. We will contact you shortly to confirm the details.',
            'आपकी बुकिंग के लिए धन्यवाद। विवरण की पुष्टि करने के लिए हम शीघ्र ही आपसे संपर्क करेंगे।'
          )}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setBookingData({
              serviceId: '',
              customerName: '',
              customerEmail: '',
              customerPhone: '',
              preferredDate: '',
              preferredTime: '',
              location: '',
              specialNotes: '',
            });
          }}
          className="px-8 py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-lg font-semibold hover:from-saffron-600 hover:to-gold-600 transition-all"
        >
          {t('Book Another Ritual', 'एक और अनुष्ठान बुक करें')}
        </button>
      </div>
    );
  }

  return (
    <section id="booking" className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-3 sm:mb-4">
            {t('Book Your Ritual', 'अपना अनुष्ठान बुक करें')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            {t('Complete the form below to book your sacred ritual', 'अपने पवित्र अनुष्ठान को बुक करने के लिए नीचे दिया गया फॉर्म भरें')}
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    step >= num
                      ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-12 sm:w-14 md:w-16 h-1 ${
                      step > num ? 'bg-saffron-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {t('Select Service', 'सेवा चुनें')}
                </h3>
                <div className="space-y-3">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`block p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        bookingData.serviceId === service.id
                          ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-saffron-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={bookingData.serviceId === service.id}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, serviceId: e.target.value });
                          setErrors({ ...errors, serviceId: '' });
                        }}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                            {language === 'en' ? service.name_en : service.name_hi}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {service.duration_minutes} {t('minutes', 'मिनट')}
                          </div>
                        </div>
                        <div className="text-base sm:text-lg font-bold text-saffron-600 dark:text-saffron-400">
                          ₹{service.base_price.toLocaleString()}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.serviceId && <p className="text-red-500 text-sm mt-2">{errors.serviceId}</p>}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {t('Your Information', 'आपकी जानकारी')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {t('Full Name', 'पूरा नाम')} *
                    </label>
                    <input
                      type="text"
                      value={bookingData.customerName}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, customerName: e.target.value });
                        setErrors({ ...errors, customerName: '' });
                      }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder={t('Enter your full name', 'अपना पूरा नाम दर्ज करें')}
                    />
                    {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {t('Email', 'ईमेल')} *
                    </label>
                    <input
                      type="email"
                      value={bookingData.customerEmail}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, customerEmail: e.target.value });
                        setErrors({ ...errors, customerEmail: '' });
                      }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                    />
                    {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {t('Phone Number', 'फ़ोन नंबर')} *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.customerPhone}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, customerPhone: e.target.value });
                        setErrors({ ...errors, customerPhone: '' });
                      }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder={t('Enter your phone number', 'अपना फ़ोन नंबर दर्ज करें')}
                    />
                    {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {t('Ritual Details', 'अनुष्ठान विवरण')}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                        {t('Preferred Date', 'पसंदीदा तिथि')} *
                      </label>
                      <input
                        type="date"
                        value={bookingData.preferredDate}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, preferredDate: e.target.value });
                          setErrors({ ...errors, preferredDate: '' });
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                        {t('Preferred Time', 'पसंदीदा समय')} *
                      </label>
                      <input
                        type="time"
                        value={bookingData.preferredTime}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, preferredTime: e.target.value });
                          setErrors({ ...errors, preferredTime: '' });
                        }}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                      {t('Location/Address', 'स्थान/पता')} *
                    </label>
                    <textarea
                      value={bookingData.location}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, location: e.target.value });
                        setErrors({ ...errors, location: '' });
                      }}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder={t('Enter the location where ritual will be performed', 'वह स्थान दर्ज करें जहां अनुष्ठान किया जाएगा')}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                      {t('Special Notes (Optional)', 'विशेष नोट (वैकल्पिक)')}
                    </label>
                    <textarea
                      value={bookingData.specialNotes}
                      onChange={(e) => setBookingData({ ...bookingData, specialNotes: e.target.value })}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder={t('Any special requirements or notes', 'कोई विशेष आवश्यकताएं या नोट्स')}
                    />
                  </div>

                  {selectedService && (
                    <div className="bg-saffron-50 dark:bg-saffron-900/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {t('Total Amount:', 'कुल राशि:')}
                        </span>
                        <span className="text-2xl font-bold text-saffron-600 dark:text-saffron-400">
                          ₹{selectedService.base_price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 border-2 border-saffron-500 text-saffron-600 dark:text-saffron-400 rounded-lg font-semibold hover:bg-saffron-50 dark:hover:bg-saffron-900/20 transition-all flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base"
              >
                <FiArrowLeft />
                <span>{t('Previous', 'पिछला')}</span>
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="ml-auto sm:ml-0 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-lg font-semibold hover:from-saffron-600 hover:to-gold-600 transition-all flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base"
              >
                <span>{t('Next', 'अगला')}</span>
                <FiArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto sm:ml-0 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-lg font-semibold hover:from-saffron-600 hover:to-gold-600 transition-all flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    <span>{t('Submitting...', 'सबमिट हो रहा है...')}</span>
                  </>
                ) : (
                  <>
                    <FiCheck />
                    <span>{t('Confirm Booking', 'बुकिंग की पुष्टि करें')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
