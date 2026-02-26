'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Download, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Actualités', href: '#' },
  { name: 'Soumettre un projet', href: '/soumission-projet' },
  { name: 'Company profile', href: 'https://drive.google.com/file/d/1PScQg5awnRqDipkXAEGzR-qUGu3WULSq/view?usp=sharing', isDownload: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const displayedNavLinks = navLinks.map(link => {
    if (link.name === 'Company profile' && pathname === '/soumission-projet') {
      return {
        ...link,
        name: 'Manuel du projet',
        href: 'https://drive.google.com/file/d/1yGTFKvAjktw4d40ubhe5n9TUdjjsLMLi/view?usp=drive_link'
      };
    }
    return link;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sécurité : Nettoyer les styles du body au montage et démontage pour éviter le blocage du scroll
  useEffect(() => {
    // Nettoyage au montage (au cas où des styles seraient restés bloqués)
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    return () => {
      // Nettoyage au démontage
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Fonction pour ouvrir le menu mobile
  const handleOpenMenu = () => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    setIsOpen(true);
  };

  // Fonction pour fermer le menu mobile
  const handleCloseMenu = () => {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    setIsOpen(false);
  };

  if (pathname.startsWith('/admin') || pathname.startsWith('/call-center')) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* <Link href="/" className={`text-2xl font-bold tracking-wider transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
          <Image src='/images/Agano-logo.png' alt='logo' width={120} height={120}></Image>
        </Link> */}
        {pathname === "/soumission-projet" ? (<Link href="/" className={`text-2xl font-bold tracking-wider transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
          <Image src='https://res.cloudinary.com/dgv2vmgio/image/upload/v1770029502/RDC-AGRO-BR_2026-03_qpjkxs.png' alt='Agano Services Consultances' width={80} height={80}></Image>
        </Link>) : (<Link href="/" className={`text-2xl font-bold tracking-wider transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
          <Image src='/images/Agano-logo.png' alt='RDC Agro Business' width={120} height={120}></Image>
        </Link>)}

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8 items-center">
          {displayedNavLinks.map((link) => {
            // Extraire le chemin sans l'ancre pour la comparaison
            const linkPath = link.href.split('#')[0].split('?')[0];
            const isActive = pathname === linkPath;

            return link.isDownload ? (
              <a
                key={link.name}
                href={link.href}
                download
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${scrolled
                  ? 'border-primary text-primary hover:bg-primary hover:text-white'
                  : 'border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900'
                  } text-sm font-extrabold uppercase tracking-wide`}
              >
                <Download size={16} />
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm uppercase tracking-widest transition-colors font-bold relative ${isActive
                  ? 'text-primary'
                  : scrolled ? 'text-gray-900 hover:text-primary' : 'text-gray-500 hover:text-primary'
                  } ${isActive ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary' : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden hover:text-primary transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-600'}`}
          onClick={() => isOpen ? handleCloseMenu() : handleOpenMenu()}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-[150]"
              onClick={handleCloseMenu}
            />

            {/* Mobile menu panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white lg:hidden shadow-2xl z-[200] overflow-hidden flex flex-col"
            >
              {/* Header du menu mobile */}
              <div className="z-[9999] flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Image src='/images/Agano-logo.png' alt='logo' width={80} height={80} />
                </div>
                <button
                  onClick={handleCloseMenu}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={24} className="text-gray-700" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="flex flex-col py-6 px-4 space-y-2 flex-1 overflow-y-auto">
                {displayedNavLinks.map((link, index) => {
                  const linkPath = link.href.split('#')[0].split('?')[0];
                  const isActive = pathname === linkPath;

                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.isDownload ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[rgb(210,69,38)] to-[rgb(230,89,58)] text-white font-semibold transition-all hover:shadow-lg active:scale-95"
                          onClick={handleCloseMenu}
                        >
                          <Download size={20} />
                          <span className="text-sm uppercase tracking-wide">{link.name}</span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className={`flex items-center px-4 py-4 rounded-xl transition-all ${isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                            }`}
                          onClick={handleCloseMenu}
                        >
                          <span className="text-base font-medium">{link.name}</span>
                          {isActive && (
                            <motion.div
                              layoutId="mobile-active-indicator"
                              className="ml-auto w-2 h-2 rounded-full bg-primary"
                            />
                          )}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer du menu mobile */}
              <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600 text-center leading-relaxed mb-4">
                  Agano Services & Consultances SARL
                </p>

                {/* Réseaux sociaux */}
                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className="p-2 rounded-full bg-white text-gray-600 hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-white text-gray-600 hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-white text-gray-600 hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-white text-gray-600 hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
