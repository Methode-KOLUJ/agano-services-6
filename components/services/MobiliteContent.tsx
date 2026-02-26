'use client';

import Image from 'next/image';
import { CheckCircle, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import Link from 'next/link';

export default function MobiliteContent() {

    const Message = "Bonjour, je suis intéressé(e) par le service de mobilité et migration de mon entreprise afin de m'installer en RDC."

    return (
        <div className="pt-32 md:pt-40 pb-24 min-h-screen bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="w-full lg:w-1/2">
                        <FadeIn>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Mobilité Internationale & <span className="text-primary">Immigration</span>
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Facilitez l'installation de vos talents internationaux en RDC. Nous prenons en charge l'intégralité des démarches administratives pour une mobilité sans friction.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    "Obtention de Visas & Titres de séjour",
                                    "Cartes de travail pour expatriés",
                                    "Préparation complète des dossiers (DGM/ONEM)",
                                    "Traductions, légalisations et suivi administratif",
                                    "Accompagnement à l'installation des expatriés"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="text-primary flex-shrink-0" size={24} />
                                        <span className="text-gray-700">{step}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={`https://wa.me/243999005148/?text=${Message}`} className="bg-primary w-full md:w-[50%] text-black font-bold py-4 px-8 rounded hover:bg-black hover:text-white transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                                Contacter un expert <ArrowRight size={20} />
                            </Link>
                        </FadeIn>
                    </div>

                    <div className="w-full lg:w-1/2 relative">
                        <FadeIn direction="left" delay={0.2}>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://res.cloudinary.com/dgv2vmgio/image/upload/v1767713298/top-view-hands-holding-travel-documents_1_p32dgp.jpg"
                                    alt="Mobilité Internationale"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </FadeIn>
                    </div>

                </div>
            </div>
        </div>
    );
}
