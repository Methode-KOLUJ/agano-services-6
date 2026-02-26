'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà cliqué sur "J'ai compris"
    const hasUnderstood = localStorage.getItem('agano-welcome-understood');
    
    if (!hasUnderstood) {
      // Petit délai pour une meilleure UX
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleUnderstood = () => {
    // Enregistrer dans localStorage pour ne plus afficher
    localStorage.setItem('agano-welcome-understood', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-auto pointer-events-auto transform transition-all duration-300 scale-100 animate-fadeIn max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header avec bouton X - Fixed */}
          <div className="relative p-6 pb-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group z-10"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>

          {/* Contenu Scrollable */}
          <div className="px-6 sm:px-8 pb-8 text-center overflow-y-auto flex-1">
            {/* Drapeau RDC */}
            <div className="mb-6 flex justify-center">
              <Image 
                src='https://res.cloudinary.com/dgv2vmgio/image/upload/v1767766668/flag-democratic-republic-congo_gvjlou.jpg' 
                alt='Drapeau RDC' 
                width={120} 
                height={120} 
                className="rounded-md"
              />
            </div>

            {/* Question introductive */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-4 px-2">
              Souhaitez-vous créer votre entreprise en RDC ?
            </h2>

            {/* Explication */}
            <div className="text-gray-700 leading-relaxed mb-8 space-y-4 text-sm sm:text-base">
              <p className="text-base sm:text-lg">
                <span className="font-bold text-[rgb(210,69,38)]">Soyez le bienvenu !</span>
              </p>
              <p>
                Nous c'est <span className="font-semibold">Agano Services & Consultances</span>, 
                le Cabinet par excellence qui vous accompagne dans la création de votre entreprise 
                en République Démocratique du Congo et l'obtention des documents nécessaires.
              </p>
              <p>
                Vous trouverez chez nous un <span className="font-semibold">suivi de A à Z</span> pour 
                une implantation en toute quiétude !
              </p>
            </div>

            {/* Bouton J'ai compris */}
            <button
              onClick={handleUnderstood}
              className="w-full sm:w-auto px-8 py-3 bg-[rgb(210,69,38)] text-white font-semibold rounded-lg hover:bg-[rgb(190,59,28)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              J'ai compris
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default WelcomeModal;
