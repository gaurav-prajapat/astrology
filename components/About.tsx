'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { supabase, type Testimonial } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function About() {
  const { language, t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
    setTestimonials(data || []);
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-saffron-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.pexels.com/photos/8844892/pexels-photo-8844892.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Pandit Ji"
              className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-6">
              {t('About Our Astrologer', 'हमारे ज्योतिषी के बारे में')}
            </h2>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                {t(
                  'With over 15 years of experience in Vedic astrology and Hindu rituals, Pandit Shri Ramesh Sharma has guided thousands of devotees towards spiritual enlightenment and worldly success.',
                  'वैदिक ज्योतिष और हिंदू अनुष्ठानों में 15 से अधिक वर्षों के अनुभव के साथ, पंडित श्री रमेश शर्मा ने हजारों भक्तों को आध्यात्मिक ज्ञान और सांसारिक सफलता की ओर मार्गदर्शन किया है।'
                )}
              </p>

              <p className="text-lg leading-relaxed">
                {t(
                  'Trained in ancient Vedic scriptures and traditional rituals, our services combine authentic practices with modern convenience. Every ritual is performed with utmost devotion and adherence to sacred traditions.',
                  'प्राचीन वैदिक शास्त्रों और पारंपरिक अनुष्ठानों में प्रशिक्षित, हमारी सेवाएं प्रामाणिक प्रथाओं को आधुनिक सुविधा के साथ जोड़ती हैं। प्रत्येक अनुष्ठान परम भक्ति और पवित्र परंपराओं के पालन के साथ किया जाता है।'
                )}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-saffron-600 dark:text-saffron-400 mb-2">15+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('Years Experience', 'वर्षों का अनुभव')}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-saffron-600 dark:text-saffron-400 mb-2">1000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('Happy Clients', 'खुश ग्राहक')}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-saffron-600 dark:text-saffron-400 mb-2">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('Ritual Types', 'अनुष्ठान प्रकार')}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-saffron-600 dark:text-saffron-400 mb-2">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('Satisfaction', 'संतुष्टि')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-4">
            {t('What Our Clients Say', 'हमारे ग्राहक क्या कहते हैं')}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('Real experiences from real people', 'वास्तविक लोगों के वास्तविक अनुभव')}
          </p>
        </motion.div>

        {testimonials.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex]?.rating || 5)].map((_, i) => (
                  <FiStar key={i} className="w-6 h-6 text-gold-500 fill-current" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 text-center mb-8 italic leading-relaxed">
                &ldquo;{language === 'en' ? testimonials[currentIndex]?.review_en : testimonials[currentIndex]?.review_hi}&rdquo;
              </blockquote>

              <div className="text-center">
                <div className="font-semibold text-lg text-gray-900 dark:text-white">
                  {testimonials[currentIndex]?.customer_name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonials[currentIndex]?.ritual_name}
                </div>
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-saffron-600 dark:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-saffron-600 dark:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-saffron-600 w-8'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
