'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiDownload, FiFile, FiTable, FiClock, FiCheck, FiX, FiAlertTriangle, FiRefreshCw, FiImage, FiVideo, FiSliders, FiUsers, FiUser, FiSettings, FiStar } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface TableInfo {
  name: string;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  rowCount: number;
  lastUpdated: string | null;
  canBackup: boolean;
}

export default function BackupTab() {
  const { language, t } = useLanguage();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Table definitions with their display names and icons
  const tableDefinitions = [
    { name: 'services', displayName: 'Services', icon: FiTable, canBackup: true },
    { name: 'bookings', displayName: 'Bookings', icon: FiFile, canBackup: true },
    { name: 'testimonials', displayName: 'Testimonials', icon: FiCheck, canBackup: true },
    { name: 'gallery_images', displayName: 'Gallery Images', icon: FiImage, canBackup: true },
    { name: 'videos', displayName: 'Videos', icon: FiVideo, canBackup: true },
    { name: 'carousel_items', displayName: 'Carousel Items', icon: FiSliders, canBackup: true },
    { name: 'staff_members', displayName: 'Staff Members', icon: FiUsers, canBackup: true },
    { name: 'staff_roles', displayName: 'Staff Roles', icon: FiUser, canBackup: true },
    { name: 'site_settings', displayName: 'Site Settings', icon: FiSettings, canBackup: true },
    { name: 'astrologers', displayName: 'Astrologers', icon: FiStar, canBackup: true },
  ];

  useEffect(() => {
    fetchTableInfo();
  }, []);

  const fetchTableInfo = async () => {
    setLoading(true);
    try {
      const tableInfo: TableInfo[] = [];
      
      for (const tableDef of tableDefinitions) {
        try {
          const { count, error: countError } = await supabase
            .from(tableDef.name)
            .select('*', { count: 'exact', head: true });
          
          const { data: latestData, error: latestError } = await supabase
            .from(tableDef.name)
            .select('updated_at, created_at')
            .order('updated_at', { ascending: false })
            .limit(1);
          
          let lastUpdated = null;
          if (latestData && latestData.length > 0) {
            lastUpdated = latestData[0].updated_at || latestData[0].created_at;
          }
          
          tableInfo.push({
            name: tableDef.name,
            displayName: tableDef.displayName,
            icon: tableDef.icon,
            rowCount: count || 0,
            lastUpdated: lastUpdated,
            canBackup: !countError && tableDef.canBackup
          });
        } catch (error) {
          console.warn(`Error fetching info for table ${tableDef.name}:`, error);
          tableInfo.push({
            name: tableDef.name,
            displayName: tableDef.displayName,
            icon: tableDef.icon,
            rowCount: 0,
            lastUpdated: null,
            canBackup: false
          });
        }
      }
      
      setTables(tableInfo);
    } catch (error) {
      console.error('Error fetching table info:', error);
      setErrorMessage('Failed to fetch database information');
    } finally {
      setLoading(false);
    }
  };

  const downloadTableData = async (tableName: string, displayName: string) => {
    setDownloading(tableName);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Create JSON data
      const jsonData = {
        tableName: displayName,
        exportDate: new Date().toISOString(),
        rowCount: data?.length || 0,
        data: data || []
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${displayName.toLowerCase().replace(/\s+/g, '_')}_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage(`Successfully downloaded ${displayName} data (${data?.length || 0} records)`);
    } catch (error: any) {
      console.error(`Error downloading ${tableName}:`, error);
      setErrorMessage(`Failed to download ${displayName} data: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAllData = async () => {
    setDownloading('all');
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const allData: any = {
        exportDate: new Date().toISOString(),
        tables: {}
      };
      
      for (const table of tables.filter(t => t.canBackup)) {
        try {
          const { data, error } = await supabase
            .from(table.name)
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!error) {
            allData.tables[table.name] = {
              displayName: table.displayName,
              rowCount: data?.length || 0,
              data: data || []
            };
          }
        } catch (error) {
          console.warn(`Failed to backup table ${table.name}:`, error);
        }
      }
      
      // Create and download file
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complete_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage(`Successfully downloaded complete backup with ${Object.keys(allData.tables).length} tables`);
    } catch (error: any) {
      console.error('Error downloading all data:', error);
      setErrorMessage(`Failed to download complete backup: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiDatabase className="text-blue-600" />
            {t('Database Backup', 'डेटाबेस बैकअप')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('Backup and download your database tables and data', 'अपने डेटाबेस टेबल और डेटा का बैकअप लें और डाउनलोड करें')}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadAllData}
          disabled={downloading === 'all'}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading === 'all' ? (
            <>
              <FiRefreshCw className="animate-spin" />
              {t('Downloading...', 'डाउनलोड हो रहा है...')}
            </>
          ) : (
            <>
              <FiDownload />
              {t('Download All Data', 'सभी डेटा डाउनलोड करें')}
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Status Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3"
        >
          <FiCheck className="text-green-600 dark:text-green-400 text-xl" />
          <span className="text-green-800 dark:text-green-200">{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
        >
          <FiAlertTriangle className="text-red-600 dark:text-red-400 text-xl" />
          <span className="text-red-800 dark:text-red-200">{errorMessage}</span>
        </motion.div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          const IconComponent = table.icon;
          return (
            <motion.div
              key={table.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border ${
                table.canBackup 
                  ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600' 
                  : 'border-red-200 dark:border-red-800 opacity-70'
              } transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    table.canBackup 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {table.displayName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {table.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('Records', 'रिकॉर्ड्स')}
                  </span>
                  <span className={`font-semibold ${
                    table.rowCount > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {table.rowCount}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('Last Updated', 'अंतिम अपडेट')}
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {formatDate(table.lastUpdated)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => downloadTableData(table.name, table.displayName)}
                disabled={!table.canBackup || downloading === table.name}
                className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  table.canBackup
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {downloading === table.name ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    {t('Downloading...', 'डाउनलोड हो रहा है...')}
                  </>
                ) : (
                  <>
                    <FiDownload />
                    {table.canBackup 
                      ? t('Download Data', 'डेटा डाउनलोड करें')
                      : t('Table Not Available', 'टेबल उपलब्ध नहीं है')
                    }
                  </>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Backup Information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <FiDatabase className="text-blue-600" />
          {t('Backup Information', 'बैकअप जानकारी')}
        </h3>
        <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
            {t('All data is exported in JSON format for easy restoration', 'सभी डेटा JSON प्रारूप में निर्यात किया जाता है आसान पुनर्स्थापना के लिए')}
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
            {t('Backup files include timestamps and record counts', 'बैकअप फ़ाइलों में टाइमस्टैम्प और रिकॉर्ड काउंट शामिल हैं')}
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
            {t('Individual table backups or complete database export available', 'व्यक्तिगत टेबल बैकअप या पूर्ण डेटाबेस निर्यात उपलब्ध है')}
          </li>
          <li className="flex items-start gap-2">
            <FiAlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
            {t('Store backup files in a secure location', 'बैकअप फ़ाइलों को सुरक्षित स्थान पर संग्रहीत करें')}
          </li>
        </ul>
      </motion.div>
    </div>
  );
}