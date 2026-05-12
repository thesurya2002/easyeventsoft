import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'EasyEventSoft Demo — Event ERP & CRM',
  description: 'Static demo of EasyEventSoft, a multi-tenant SaaS ERP/CRM for event management companies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#0f172a',
                fontSize: '14px',
                padding: '12px 16px',
                boxShadow: '0 4px 24px -4px rgba(15,23,42,0.12)',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
