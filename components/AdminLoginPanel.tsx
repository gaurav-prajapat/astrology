'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLogIn, FiAlertCircle, FiEye, FiEyeOff, FiLock, FiUser, FiShield, FiLogOut } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';

export default function AdminLoginPanel() {
  const { language, t } = useLanguage();
  const { login: authLogin, isDevelopmentMode } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  // Check for lockout on component mount
  useEffect(() => {
    const lockoutData = localStorage.getItem('adminLoginLockout');
    if (lockoutData) {
      const { attempts, lockoutTime } = JSON.parse(lockoutData);
      const now = Date.now();
      if (now < lockoutTime) {
        setLoginAttempts(attempts);
        setIsLocked(true);
        setLockoutEndTime(lockoutTime);
      } else {
        localStorage.removeItem('adminLoginLockout');
      }
    }
  }, []);

  // Update lockout timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockoutEndTime) {
      timer = setInterval(() => {
        const remaining = Math.ceil((lockoutEndTime - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsLocked(false);
          setLoginAttempts(0);
          setLockoutEndTime(null);
          localStorage.removeItem('adminLoginLockout');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutEndTime]);

  const handleGoogleLogin = async () => {
    if (isLocked) {
      setError('Too many failed attempts. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Attempt Google OAuth login with Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      // The OAuth flow will redirect the user
      // After successful login, the callback will handle the session
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to initiate Google login');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLocked) {
      setError('Too many failed attempts. Please try again later.');
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const success = await authLogin(email, password);
      
      if (success) {
        // Reset login attempts
        setLoginAttempts(0);
        localStorage.removeItem('adminLoginLockout');
        
        // Redirect to admin dashboard
        window.location.href = '/admin';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        const lockoutTime = Date.now() + 300000; // 5 minutes
        setIsLocked(true);
        setLockoutEndTime(lockoutTime);
        localStorage.setItem('adminLoginLockout', JSON.stringify({
          attempts: newAttempts,
          lockoutTime
        }));
        setError(`Too many failed attempts. Locked for 5 minutes.`);
      } else {
        setError(err.message || 'Invalid credentials');
      }
      
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingTime = () => {
    if (!lockoutEndTime) return 0;
    return Math.ceil((lockoutEndTime - Date.now()) / 1000);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-saffron-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-saffron-500 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <FiShield className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-saffron-600 to-orange-600 dark:from-saffron-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
              {t('Staff Portal', 'कर्मचारी पोर्टल')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('Secure Administration Panel', 'सुरक्षित प्रशासन पैनल')}
            </p>
          </div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <FiLock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  {t('Security Notice', 'सुरक्षा सूचना')}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  {t('Unauthorized access is prohibited. All activities are monitored.', 'अनधिकृत पहुंच निषिद्ध है। सभी गतिविधियों की निगरानी की जाती है।')}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Google/Gmail Login Option */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  {t('Gmail Login Available', 'जीमेल लॉगिन उपलब्ध')}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {t('Use your Gmail account for admin access', 'एडमिन पहुंच के लिए अपना जीमेल खाता उपयोग करें')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Alternative Login Options */}
          <div className="mb-6 space-y-3">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isLocked}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-300 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{t('Sign in with Gmail', 'जीमेल के साथ साइन इन करें')}</span>
            </button>
            
            {/* Direct Email Login Info */}
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mb-1">
                {t('Development Login Available', 'विकास लॉगिन उपलब्ध')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('Use: admin@gmail.com / admin123', 'उपयोग करें: admin@gmail.com / admin123')}
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
              >
                <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  {isLocked && (
                    <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                      {t('Try again in', 'फिर से प्रयास करें')} {getRemainingTime()}s
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Email Address', 'ईमेल पता')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                  disabled={isLocked}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all disabled:opacity-50"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Password', 'पासवर्ड')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={t('Enter your password', 'अपना पासवर्ड दर्ज करें')}
                  disabled={isLocked}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all disabled:opacity-50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Attempt Counter */}
            {loginAttempts > 0 && (
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('Failed attempts:', 'असफल प्रयास:')} {loginAttempts}/3
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(loginAttempts / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t('Authenticating...', 'प्रमाणित कर रहे हैं...')}</span>
                </>
              ) : isLocked ? (
                <>
                  <FiLock className="w-5 h-5" />
                  <span>{t('Locked', 'लॉक है')}</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>{t('Sign In', 'साइन इन करें')}</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('© 2024 Divine Rituals. All rights reserved.', '© 2024 दिवाइन रिटुअल्स। सर्वाधिकार सुरक्षित।')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              {t('Secure Staff Portal v2.0', 'सुरक्षित कर्मचारी पोर्टल v2.0')}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
