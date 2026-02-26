'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export default function Mission() {
  const points = [
    "Sécurisation juridique des investissements",
    "Optimisation des délais administratifs",
    "Conformité fiscale et sociale garantie",
    "Accompagnement terrain personnalisé"
  ];

  return (
    <section id='mission' className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <FadeIn direction="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="https://res.cloudinary.com/dgv2vmgio/image/upload/v1767714011/20819_ap20um.jpg"
                  alt="Mission Agano"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply" />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-100 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-200/30 rounded-full blur-3xl -z-10" />
            </FadeIn>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2">
            <FadeIn direction="left" delay={0.2}>
              <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-xs">
                Notre Mission
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Accélérer vos projets en toute <span className="text-primary">sécurité juridique</span>
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Nous permettons aux entrepreneurs, investisseurs et entreprises étrangères 
                d’accélérer leurs projets en RDC en toute sécurité.
                <br /><br />
                Notre objectif est la <strong>réduction des risques</strong> et l'<strong>optimisation des délais</strong> pour une implantation sereine.
              </p>

              <div className="grid grid-cols-1 gap-1">
                {points.map((point, index) => (
                  <div key={index} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        <CheckCircle2 size={20} />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{point}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
