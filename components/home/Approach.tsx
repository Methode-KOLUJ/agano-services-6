'use client';

import { Check, ShieldCheck, Zap, Users } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export default function Approach() {
  const approaches = [
    {
      icon: ShieldCheck,
      title: "Expertise Locale RDC",
      description: "Une connaissance approfondie du terrain et des interlocuteurs clés."
    },
    {
      icon: Zap,
      title: "Guichet Unique",
      description: "Un seul interlocuteur pour toutes vos démarches, de la création à la conformité."
    },
    {
      icon: Check,
      title: "Transparence Totale",
      description: "Des coûts clairs et détaillés, sans frais cachés ni surprises."
    },
    {
      icon: Users,
      title: "Accompagnement Sur-Mesure",
      description: "Des solutions adaptées à la taille et au secteur de votre entreprise."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden flex items-center justify-center">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-white/80" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
           <FadeIn>
             <h2 className="text-primary-600 font-bold tracking-widest uppercase mb-4 text-xs">
                Notre Méthodologie
             </h2>
             <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
               Une Approche Centrée sur <span className="text-primary">l'Excellence</span>
             </h3>
             <p className="text-gray-700 text-lg font-medium">
               Nous ne nous contentons pas de traiter des dossiers. Nous sécurisons votre avenir en RDC.
             </p>
           </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {approaches.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all h-full shadow-lg">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <item.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
