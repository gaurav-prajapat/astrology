import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { AdminAuthProvider } from '@/lib/contexts/AdminAuthContext';
import AdminSignupPanel from '@/components/AdminSignupPanel';

export const metadata = {
  title: 'Admin Signup | Vedic Astrology Services',
  description: 'Create a new admin account for the admin panel.',
};

export default function AdminSignupPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <AdminSignupPanel />
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}