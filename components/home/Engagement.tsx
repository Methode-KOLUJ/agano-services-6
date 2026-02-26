'use client';

import { Clock, BarChart3, FileSearch, Lock } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export default function Engagement() {
    const commitments = [
        {
            icon: Clock,
            title: "Délais Clairs",
            desc: "Engagement sur planning."
        },
        {
            icon: BarChart3,
            title: "Livrables Mesurables",
            desc: "Résultats concrets."
        },
        {
            icon: FileSearch,
            title: "Traçabilité",
            desc: "Suivi en temps réel."
        },
        {
            icon: Lock,
            title: "Confidentialité",
            desc: "Protection des données."
        }
    ];

  return (
    <section className="relative py-24 overflow-hidden border-t border-gray-200">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-white/90" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <FadeIn>
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="max-w-md">
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Notre Engagement Qualité</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        Votre satisfaction et la sécurité de vos opérations sont nos priorités absolues. Nous nous engageons sur des résultats concrets.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                    {commitments.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                            <div className="p-4 bg-primary text-white rounded-full shadow-lg">
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FadeIn>
      </div>
    </section>
  );
}
