'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dgv2vmgio/image/upload/v1767699528/Home_dwkn7p.jpg')] bg-cover bg-center" />
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
      </div>

      {/* Content - Centered without box */}
      <div className="container relative z-20 px-6 mx-auto">
        <div className="max-w-5xl mx-auto text-center mt-12">
          <FadeIn delay={0.3}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-[rgb(210,69,38)] via-[rgb(230,89,58)] to-[rgb(210,69,38)] bg-clip-text text-transparent">
                AGANO SERVICES
              </span> <br />
              <span className="text-3xl md:text-5xl lg:text-6xl align-top text-white/95">& CONSULTANCES</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 leading-relaxed font-medium max-w-4xl mx-auto">
              Simplifier l'entrepreneuriat et l'intégration internationale, avec une
              <span className="text-white font-bold"> conformité</span>
              <span className="text-white font-bold"> opérationnelle</span>
            </p>
          </FadeIn>

          <FadeIn delay={0.5} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="https://wa.me/243999005148"
              className="hidden md:flex group relative px-10 py-5 bg-gradient-to-r from-[rgb(210,69,38)] to-[rgb(230,89,58)] text-white font-bold text-lg rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Nous contacter
              </span>
            </Link>

            <Link
              href="/soumission-projet"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all hover:border-white/50"
            >
              Soumettre un projet
            </Link>

            <Link
              href="#services"
              className="group relative px-10 py-5 bg-gradient-to-r from-[rgb(210,69,38)] to-[rgb(230,89,58)] text-white font-bold text-lg rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Nos services
              </span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
