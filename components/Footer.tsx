'use client';

import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiHeart } from 'react-icons/fi';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">ॐ</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white">
                  {t('Divine Rituals', 'दिव्य रिचुअल्स')}
                </h3>
              </div>
            </div>
            <p className="text-sm">
              {t(
                'Authentic Vedic rituals and astrology services for your spiritual well-being.',
                'आपकी आध्यात्मिक भलाई के लिए प्रामाणिक वैदिक अनुष्ठान और ज्योतिष सेवाएं।'
              )}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('Quick Links', 'त्वरित लिंक')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="hover:text-saffron-400 transition-colors">
                  {t('Home', 'होम')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-saffron-400 transition-colors">
                  {t('Services', 'सेवाएं')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="hover:text-saffron-400 transition-colors">
                  {t('About', 'हमारे बारे में')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="hover:text-saffron-400 transition-colors">
                  {t('Contact', 'संपर्क करें')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('Services', 'सेवाएं')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>{t('Graha Shanti Puja', 'ग्रह शांति पूजा')}</li>
              <li>{t('Marriage Muhurat', 'विवाह मुहूर्त')}</li>
              <li>{t('Vastu Consultation', 'वास्तु परामर्श')}</li>
              <li>{t('Havan Ceremony', 'हवन समारोह')}</li>
              <li>{t('Astrology Services', 'ज्योतिष सेवाएं')}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('Connect With Us', 'हमसे जुड़ें')}
            </h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-saffron-500 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-saffron-500 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-saffron-500 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-saffron-500 transition-colors"
                aria-label="YouTube"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm">
              {t('Email:', 'ईमेल:')} info@divinerituals.com
              <br />
              {t('Phone:', 'फ़ोन:')} +91 98765 43210
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} {t('Divine Rituals. All rights reserved.', 'दिव्य रिचुअल्स। सर्वाधिकार सुरक्षित।')}
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <span>{t('Made with', 'के साथ बनाया')}</span>
              <FiHeart className="w-4 h-4 text-red-500 fill-current" />
              <span>{t('for spiritual seekers', 'आध्यात्मिक साधकों के लिए')}</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <button className="hover:text-saffron-400 transition-colors">
                {t('Privacy Policy', 'गोपनीयता नीति')}
              </button>
              <button className="hover:text-saffron-400 transition-colors">
                {t('Terms of Service', 'सेवा की शर्तें')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
