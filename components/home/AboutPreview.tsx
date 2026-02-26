'use client';

import FadeIn from '@/components/ui/FadeIn';

export default function AboutPreview() {
    return (
        <section id="about" className="relative py-32 overflow-hidden flex items-center justify-center">
            {/* Background Image with Parallax Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed" />
                <div className="absolute inset-0 bg-white/60" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-3xl p-10 md:p-16 shadow-2xl border border-white/50">
                    <FadeIn delay={0.1}>
                        <h2 className="text-center text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                            Votre Partenaire Stratégique <br />
                            en <span className="text-primary">RDC</span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed font-normal">
                            Basés à <strong className="text-gray-900 font-bold">Lubumbashi</strong>, présents à <strong className="text-gray-900 font-bold">Kinshasa</strong> et <strong className="text-gray-900 font-bold">à Kolwezi</strong>,
                            nous incarnons l'excellence opérationnelle. Nous sommes le pont sécurisé entre vos ambitions internationales et la réalité du marché congolais.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-gray-200">
                            <div className="p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                <h4 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide text-primary">Conformité</h4>
                                <p className="text-sm text-gray-500">Respect strict des normes légales et fiscales locales.</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                <h4 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide text-primary">Transparence</h4>
                                <p className="text-sm text-gray-500">Clarté totale sur les coûts et les processus.</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                <h4 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide text-primary">Efficacité</h4>
                                <p className="text-sm text-gray-500">Réduction des risques et optimisation des délais.</p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
