'use client';

import Image from 'next/image';
import { CheckCircle, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import Link from "next/link"

export default function ComplementaireContent() {

    const Message = "Bonjour, je suis intéressé(e) par vos services, comment puis-je commencer ?"

    return (
        <div className="pt-32 md:pt-40 pb-24 min-h-screen bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="w-full lg:w-1/2">
                        <FadeIn>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Services <span className="text-primary">Complémentaires</span>
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Au-delà de la création et de la fiscalité, nous sommes votre partenaire opérationnel au quotidien pour toutes les exigences administratives et logistiques.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    "Assistance administrative & logistique",
                                    "Gestion de la Paie & Contrats de travail",
                                    "Conformité sociale (CNSS, ITPR)",
                                    "Sous-traitance & ARSP (Conformité)",
                                    "Licences, Permis & Autorisations spécifiques"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="text-primary flex-shrink-0" size={24} />
                                        <span className="text-gray-700">{step}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={`https://wa.me/243999005148/?text=${Message}`} className="bg-primary w-full md:w-[50%] text-black font-bold py-4 px-8 rounded hover:bg-black hover:text-white transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                                Demander un devis <ArrowRight size={20} />
                            </Link>
                        </FadeIn>
                    </div>

                    <div className="w-full lg:w-1/2 relative">
                        <FadeIn direction="left" delay={0.2}>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://res.cloudinary.com/dgv2vmgio/image/upload/v1767714815/colleagues-having-meeting-office_cljls7.jpg"
                                    alt="Services Complémentaires"
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
