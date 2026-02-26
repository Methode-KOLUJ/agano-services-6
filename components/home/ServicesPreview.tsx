'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Building2, Landmark, Globe, Briefcase, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

const services = [
  {
    icon: Building2,
    title: "Création d'Entreprise",
    description: "Constitution, enregistrement GUCE, RCCM, ID National et domiciliation bancaire.",
    href: "/services/creation-entreprise",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Landmark,
    title: "Gestion Fiscale & Compta",
    description: "Conformité locale, déclarations TVA/IPR, états financiers et audit préventif.",
    href: "/services/gestion-fiscale",
    color: "from-amber-500/20 to-amber-600/5",
  },
  {
    icon: Globe,
    title: "Mobilité Internationale",
    description: "Visas, cartes de travail, titres de séjour et accompagnement expatriés.",
    href: "/services/mobilite",
    color: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Briefcase,
    title: "Services Complémentaires",
    description: "Licences ARSP, autorisations sectorielles, RH et assistance logistique.",
    href: "/services/complementaire",
    color: "from-purple-500/20 to-purple-600/5",
  },
];

export default function ServicesPreview() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set(prev).add(index));
            } else {
              setVisibleCards((prev) => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
              });
            }
          });
        },
        {
          threshold: 0.5, // Card doit être visible à 50%
          rootMargin: '-50px', // Marge pour déclencher l'effet
        }
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section id='services' className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <FadeIn direction="up">
            <h2 className="text-primary font-medium tracking-widest uppercase mb-4 text-sm">
              Nos Domaines d'Intervention
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Solutions Intégrées
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Une approche à 360° pour garantir la réussite de vos opérations en République Démocratique du Congo.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <Link href={service.href} className="group block h-full">
                <div 
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`
                    relative h-full p-8 rounded-2xl border border-gray-100 bg-white 
                    hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2
                    overflow-hidden
                  `}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-gray-100 group-hover:border-primary/20 shadow-sm">
                      <service.icon className="text-gray-600 group-hover:text-primary transition-colors" size={28} />
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                       {service.title === "Création d'Entreprise" ? "Création via GUCE" : 
                        service.title === "Gestion Fiscale & Compta" ? "Gestion Fiscale & Conformité" :
                        service.title === "Mobilité Internationale" ? "Mobilité & Immigration" : service.title}
                    </h4>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
                      {service.description}
                    </p>
                    
                    {/* Bouton "En savoir plus" - visible au hover sur desktop ET lors du scroll sur mobile */}
                    <div className={`
                      flex items-center text-primary text-sm font-semibold uppercase tracking-wider gap-2 
                      transition-all duration-500
                      ${visibleCards.has(index) 
                        ? 'md:opacity-0 md:translate-y-4 opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                      }
                      group-hover:opacity-100 group-hover:translate-y-0
                    `}>
                      En savoir plus <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
