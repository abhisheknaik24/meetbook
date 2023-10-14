import AuthProvider from '@/components/providers/auth-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import QueryProvider from '@/components/providers/query-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';

const font = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meetbook',
  description: 'Meetbook is a meeting room scheduling application',
  keywords: ['Meetbook', 'Abhishek Naik'],
  authors: [{ name: 'Abhishek Naik' }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'relative h-full w-full max-w-screen-2xl mx-auto overflow-x-hidden overflow-y-auto scrollbar-hide',
          font.className
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <ModalProvider />
              <ToasterProvider />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
