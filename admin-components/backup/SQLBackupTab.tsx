'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiDownload, FiCode, FiTable, FiFileText, FiRefreshCw, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface TableSchema {
  tableName: string;
  displayName: string;
  schema: string;
  data: any[];
  rowCount: number;
}

export default function SQLBackupTab() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Table definitions with their display names
  const tableDefinitions = [
    { name: 'services', displayName: 'Services' },
    { name: 'bookings', displayName: 'Bookings' },
    { name: 'testimonials', displayName: 'Testimonials' },
    { name: 'gallery_images', displayName: 'Gallery Images' },
    { name: 'videos', displayName: 'Videos' },
    { name: 'carousel_items', displayName: 'Carousel Items' },
    { name: 'staff_members', displayName: 'Staff Members' },
    { name: 'staff_roles', displayName: 'Staff Roles' },
    { name: 'site_settings', displayName: 'Site Settings' },
    { name: 'astrologers', displayName: 'Astrologers' },
  ];

  const generateSQLSchema = async (tableName: string): Promise<string> => {
    try {
      // Query PostgreSQL information_schema to get actual table structure
      const { data, error } = await supabase.rpc('get_table_schema', { table_name: tableName });
      
      if (error) {
        // Fallback to manual schema definitions based on known table structures
        return generateManualSchema(tableName);
      }
      
      if (!data || data.length === 0) {
        return generateManualSchema(tableName);
      }
      
      let sql = `-- Table: ${tableName}\n`;
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      const columns = data.map((col: any) => {
        let columnDef = `  ${col.column_name} ${col.data_type}`;
        
        // Add precision for numeric types
        if (col.numeric_precision && col.numeric_scale) {
          columnDef += `(${col.numeric_precision},${col.numeric_scale})`;
        } else if (col.character_maximum_length) {
          columnDef += `(${col.character_maximum_length})`;
        }
        
        // Add NOT NULL constraint
        if (col.is_nullable === 'NO') {
          columnDef += ' NOT NULL';
        }
        
        // Add default value
        if (col.column_default) {
          columnDef += ` DEFAULT ${col.column_default}`;
        }
        
        return columnDef;
      });
      
      sql += columns.join(',\n');
      sql += '\n);\n\n';
      
      return sql;
    } catch (error) {
      console.warn(`Could not fetch schema for ${tableName}:`, error);
      return generateManualSchema(tableName);
    }
  };

  const generateManualSchema = (tableName: string): string => {
    const schemas: { [key: string]: string } = {
      'services': `-- Table: services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_hi text NOT NULL,
  description_en text NOT NULL,
  description_hi text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  base_price decimal(10,2) NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

`,
      'bookings': `-- Table: bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time time NOT NULL,
  location text NOT NULL,
  special_notes text DEFAULT '',
  status text DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

`,
      'testimonials': `-- Table: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_photo text DEFAULT '',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_en text NOT NULL,
  review_hi text NOT NULL,
  ritual_name text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  email text,
  phone text,
  service_used text,
  status text DEFAULT 'pending',
  verified boolean DEFAULT false,
  response text
);

`,
      'gallery_images': `-- Table: gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en text NOT NULL,
  title_hi text NOT NULL,
  image_url text NOT NULL,
  description_en text,
  description_hi text,
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

`,
      'videos': `-- Table: videos
CREATE TABLE IF NOT EXISTS videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en text NOT NULL,
  title_hi text NOT NULL,
  description_en text,
  description_hi text,
  youtube_url text NOT NULL,
  thumbnail_url text,
  duration text,
  category text NOT NULL DEFAULT 'General',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

`,
      'carousel_items': `-- Table: carousel_items
CREATE TABLE IF NOT EXISTS carousel_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en text NOT NULL,
  title_hi text NOT NULL,
  description_en text,
  description_hi text,
  image_url text NOT NULL,
  link text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

`,
      'staff_members': `-- Table: staff_members
CREATE TABLE IF NOT EXISTS staff_members (
  id uuid PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role_id uuid REFERENCES staff_roles(id),
  password_hash text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

`,
      'staff_roles': `-- Table: staff_roles
CREATE TABLE IF NOT EXISTS staff_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_hi text NOT NULL,
  description_en text,
  description_hi text,
  permissions jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

`,
      'site_settings': `-- Table: site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb,
  setting_type text DEFAULT 'string',
  description_en text,
  description_hi text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

`,
      'astrologers': `-- Table: astrologers
CREATE TABLE IF NOT EXISTS astrologers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_hi text NOT NULL,
  bio_en text,
  bio_hi text,
  photo_url text,
  experience_years integer,
  specializations jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

`
    };
    
    return schemas[tableName] || `-- Table: ${tableName}
-- Schema not defined

`;
  };

  const generateSQLInserts = async (tableName: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return `-- No data found in table: ${tableName}\n\n`;
      }
      
      let sql = `-- Insert data for table: ${tableName}\n`;
      
      data.forEach((row, index) => {
        const columns = Object.keys(row).filter(key => key !== 'id'); // Exclude auto-generated IDs
        const values = columns.map(col => {
          const value = row[col];
          if (value === null) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          if (typeof value === 'boolean') return value ? 'true' : 'false';
          if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          return value.toString();
        });
        
        sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
      });
      
      sql += '\n';
      return sql;
    } catch (error) {
      console.warn(`Could not fetch data for ${tableName}:`, error);
      return `-- Error fetching data for table: ${tableName}\n\n`;
    }
  };

  const downloadSchemaSQL = async () => {
    setDownloading('schema');
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let sqlContent = `-- Database Schema Backup
-- Generated on: ${new Date().toISOString()}
-- Application: Astrology Website
\n`;
      
      for (const table of tableDefinitions) {
        const schema = await generateSQLSchema(table.name);
        sqlContent += schema;
      }
      
      // Create and download file
      const blob = new Blob([sqlContent], { type: 'application/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_schema_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage('Successfully downloaded database schema SQL');
    } catch (error: any) {
      console.error('Error downloading schema:', error);
      setErrorMessage(`Failed to download schema: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadDataSQL = async () => {
    setDownloading('data');
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let sqlContent = `-- Database Data Backup
-- Generated on: ${new Date().toISOString()}
-- Application: Astrology Website
\n`;
      
      for (const table of tableDefinitions) {
        const inserts = await generateSQLInserts(table.name);
        sqlContent += inserts;
      }
      
      // Create and download file
      const blob = new Blob([sqlContent], { type: 'application/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_data_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage('Successfully downloaded database data SQL');
    } catch (error: any) {
      console.error('Error downloading data:', error);
      setErrorMessage(`Failed to download data: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadCompleteSQL = async () => {
    setDownloading('complete');
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let sqlContent = `-- Complete Database Backup
-- Generated on: ${new Date().toISOString()}
-- Application: Astrology Website
\n`;
      
      // Add schema
      sqlContent += '-- SCHEMA SECTION --\n';
      for (const table of tableDefinitions) {
        const schema = await generateSQLSchema(table.name);
        sqlContent += schema;
      }
      
      sqlContent += '\n-- DATA SECTION --\n';
      
      // Add data
      for (const table of tableDefinitions) {
        const inserts = await generateSQLInserts(table.name);
        sqlContent += inserts;
      }
      
      // Create and download file
      const blob = new Blob([sqlContent], { type: 'application/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complete_database_backup_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage('Successfully downloaded complete database SQL backup');
    } catch (error: any) {
      console.error('Error downloading complete backup:', error);
      setErrorMessage(`Failed to download complete backup: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

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
            <FiCode className="text-blue-600" />
            {t('SQL Backup', 'SQL बैकअप')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('Download database schema and data as SQL code for production', 'उत्पादन के लिए डेटाबेस स्कीमा और डेटा को SQL कोड के रूप में डाउनलोड करें')}
          </p>
        </div>
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

      {/* Backup Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Schema Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiDatabase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('Schema Only', 'केवल स्कीमा')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('Table structures', 'टेबल संरचनाएं')}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            {t('Download CREATE TABLE statements for all database tables', 'सभी डेटाबेस टेबल के लिए CREATE TABLE स्टेटमेंट्स डाउनलोड करें')}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadSchemaSQL}
            disabled={downloading === 'schema'}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading === 'schema' ? (
              <>
                <FiRefreshCw className="animate-spin" />
                {t('Generating...', 'जनरेट हो रहा है...')}
              </>
            ) : (
              <>
                <FiDownload />
                {t('Download Schema', 'स्कीमा डाउनलोड करें')}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Data Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiTable className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('Data Only', 'केवल डेटा')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('Table records', 'टेबल रिकॉर्ड्स')}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            {t('Download INSERT statements for all existing data', 'सभी मौजूदा डेटा के लिए INSERT स्टेटमेंट्स डाउनलोड करें')}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadDataSQL}
            disabled={downloading === 'data'}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading === 'data' ? (
              <>
                <FiRefreshCw className="animate-spin" />
                {t('Generating...', 'जनरेट हो रहा है...')}
              </>
            ) : (
              <>
                <FiDownload />
                {t('Download Data', 'डेटा डाउनलोड करें')}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Complete Backup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FiFileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('Complete Backup', 'पूर्ण बैकअप')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('Schema + Data', 'स्कीमा + डेटा')}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            {t('Download complete database backup with schema and data', 'स्कीमा और डेटा के साथ पूर्ण डेटाबेस बैकअप डाउनलोड करें')}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadCompleteSQL}
            disabled={downloading === 'complete'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading === 'complete' ? (
              <>
                <FiRefreshCw className="animate-spin" />
                {t('Generating...', 'जनरेट हो रहा है...')}
              </>
            ) : (
              <>
                <FiDownload />
                {t('Download Complete', 'पूर्ण डाउनलोड करें')}
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <FiCode className="text-blue-600" />
          {t('SQL Backup Information', 'SQL बैकअप जानकारी')}
        </h3>
        <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
            {t('Schema backup includes CREATE TABLE statements', 'स्कीमा बैकअप में CREATE TABLE स्टेटमेंट्स शामिल हैं')}
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
            {t('Data backup includes INSERT statements for all records', 'डेटा बैकअप में सभी रिकॉर्ड्स के लिए INSERT स्टेटमेंट्स शामिल हैं')}
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
            {t('Complete backup contains both schema and data', 'पूर्ण बैकअप में स्कीमा और डेटा दोनों शामिल हैं')}
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
            {t('Files are formatted for direct import into PostgreSQL', 'फ़ाइलें सीधे PostgreSQL में आयात के लिए स्वरूपित हैं')}
          </li>
          <li className="flex items-start gap-2">
            <FiAlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
            {t('Review generated SQL before executing in production', 'उत्पादन में निष्पादित करने से पहले जेनरेट किए गए SQL की समीक्षा करें')}
          </li>
        </ul>
      </motion.div>
    </div>
  );
}