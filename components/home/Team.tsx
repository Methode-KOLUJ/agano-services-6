'use client';

import { Users, Gavel, FileSpreadsheet, Globe2, Briefcase } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export default function Team() {
  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
            
            {/* Team Section */}
            <div className="w-full md:w-1/2">
                <FadeIn direction="right">
                    <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-xs">
                        Notre Force
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                        Une Équipe <span className="text-primary">Pluridisciplinaire</span>
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        La complexité du marché congolais exige des compétences variées. 
                        AGANO réunit des experts dédiés à chaque facette de votre implantation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <Gavel className="text-primary mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-gray-900">Droit des Affaires</h4>
                                <p className="text-sm text-gray-500">Sécurisation contractuelle</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <FileSpreadsheet className="text-primary mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-gray-900">Fiscalité</h4>
                                <p className="text-sm text-gray-500">Optimisation & Compliance</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <Briefcase className="text-primary mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-gray-900">Droit du Travail</h4>
                                <p className="text-sm text-gray-500">Gestion RH & Sociale</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <Globe2 className="text-primary mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-gray-900">Immigration</h4>
                                <p className="text-sm text-gray-500">Mobilité Internationale</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Partners Section */}
            <div className="w-full md:w-1/2 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                <FadeIn direction="left" delay={0.2}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Réseau & Partenariats
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Pour garantir l'efficacité de vos démarches, nous collaborons étroitement avec les acteurs clés de l'écosystème.
                    </p>
                    
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-gray-800 font-medium">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            Cabinets d'avocats locaux
                        </li>
                        <li className="flex items-center gap-3 text-gray-800 font-medium">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            Autorités administratives (GUCE, DGM, ONEM)
                        </li>
                        <li className="flex items-center gap-3 text-gray-800 font-medium">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            Organisations professionnelles (FEC)
                        </li>
                        <li className="flex items-center gap-3 text-gray-800 font-medium">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            Institutions financières partenaires
                        </li>
                    </ul>
                </FadeIn>
            </div>

        </div>
      </div>
    </section>
  );
}
