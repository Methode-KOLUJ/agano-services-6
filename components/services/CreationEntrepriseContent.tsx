'use client';

import Image from 'next/image';
import { CheckCircle, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import Link from 'next/link';

export default function CreationEntrepriseContent() {

    const Message = "Bonjour, je suis intéressé(e) par le service de creation d'entreprise via le GUCE."

    return (
        <div className="pt-32 md:pt-40 pb-24 min-h-screen bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="w-full lg:w-1/2">
                        <FadeIn>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Création et Enregistrement <span className="text-primary">via le GUCE</span>
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Lancer une activité en RDC nécessite une maîtrise parfaite du Guichet Unique de Création d'Entreprise (GUCE).
                                Nous simplifions chaque étape pour transformer votre vision en entité légale opérationnelle.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    "Étude de faisabilité",
                                    "Constitution et dépôt du dossier",
                                    "RCCM, ID fiscal, TVA",
                                    "Statuts, domiciliation, ouverture de comptes bancaires",
                                    "Accompagnement post-création et conformité continue"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="text-primary flex-shrink-0" size={24} />
                                        <span className="text-gray-700">{step}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={`https://wa.me/243999005148/?text=${Message}`} className="bg-primary text-black font-bold py-4 w-full md:w-[50%] px-8 rounded hover:bg-black hover:text-white transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                                Démarrer mon projet <ArrowRight size={20} />
                            </Link>
                        </FadeIn>
                    </div>

                    <div className="w-full lg:w-1/2 relative">
                        <FadeIn direction="left" delay={0.2}>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://res.cloudinary.com/dgv2vmgio/image/upload/v1767711865/man-holding-contract-his-new-office-job-after-interview_vh3cpi.jpg"
                                    alt="Création d'entreprise"
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
