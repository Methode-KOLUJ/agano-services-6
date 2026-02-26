import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/ui/SmoothScroll';
import WelcomeModal from '@/components/ui/WelcomeModal';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// TODO: Replace with your actual domain
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : 'https://www.aganoservicesconsultances.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'AGANO Services et Consultances SARL',
    template: '%s | AGANO Services et Consultances SARL'
  },
  description: 'Partenaire stratégique en RDC pour l’accompagnement entrepreneurial, fiscal et la mobilité professionnelle. Services de création d\'entreprise, gestion fiscale, et facilitation de visa.',
  keywords: ['RDC', 'Congo', 'Entreprise', 'Fiscalité', 'Visa', 'Création entreprise', 'Comptabilité', 'Consultance', 'Kinshasa', 'AGANO'],
  authors: [{ name: 'AGANO Services et Consultances SARL' }],
  creator: 'AGANO Services et Consultances SARL',
  publisher: 'AGANO Services et Consultances SARL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'AGANO Services et Consultances SARL',
    description: 'Votre partenaire de confiance en RDC pour l’entrepreneuriat et la mobilité.',
    url: baseUrl,
    siteName: 'AGANO Services',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/Agano-logo.jpg',
        width: 1000,
        height: 1000,
        alt: 'AGANO Services & Consultances SARL',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGANO Services et Consultances SARL',
    description: 'Partenaire stratégique en RDC pour l’accompagnement entrepreneurial.',
    images: ['/images/Agano-logo.png'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${inter.variable}`}>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-primary selection:text-black font-sans">
        <WelcomeModal />
        <ToastContainer position="top-center" theme="colored" />
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
      <GoogleAnalytics gaId="G-HWYW1NH2NV" />
    </html>
  );
}
