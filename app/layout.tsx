import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Familjen_Grotesk } from 'next/font/google';
import { Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import BootstrapScript from '@/components/BootstrapScript';

// Import Bootstrap CSS first
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Then import custom styles
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const familjenGrotesk = Familjen_Grotesk({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-familjen-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Viện Công nghệ - Institute of Technology',
  description: 'Viện công nghệ  là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt và bề mặt.',
  keywords: 'viện công nghệ, nghiên cứu, cơ khí, luyện kim, vật liệu, khuôn mẫu, xử lý nhiệt',
  authors: [{ name: 'Viện Công nghệ Team' }],
  creator: 'Viện Công nghệ Team',
  publisher: 'Viện Công nghệ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://viencongnghe.ritm.vn'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Viện Công nghệ (RITM)',
    description: 'Viện công nghệ (RITM) là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt.',
    url: 'https://viencongnghe.ritm.vn',
    siteName: 'Viện Công nghệ (RITM)',
    images: [
      {
        url: '/images/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Viện Công nghệ (RITM)',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viện Công nghệ (RITM)',
    description: 'Viện công nghệ (RITM) là một tổ chức nghiên cứu và phát triển công nghệ.',
    images: ['/images/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1253BE" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#1253BE" />
        <meta name="msapplication-TileImage" content="/logo192.png" />
      </head>
      <body className={`${plusJakartaSans.variable} ${familjenGrotesk.variable}`}>
        <LanguageProvider>
          <div className="page-wrapper">
            <Suspense fallback={null}>
              <GoogleAnalytics />
              <BootstrapScript />
            </Suspense>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
