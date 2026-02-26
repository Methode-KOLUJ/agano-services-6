'use client';

import { useState } from 'react';
import { Scale, Building2, FileText, Shield, Link as LinkIcon, Globe, Mail, Phone, ChevronRight } from 'lucide-react';

export default function MentionLegaleContent() {
    const [activeSection, setActiveSection] = useState('identification');

    const sections = [
        { id: 'identification', label: 'Identification', icon: Building2 },
        { id: 'propriete', label: 'Propriété intellectuelle', icon: FileText },
        { id: 'donnees', label: 'Données & Cookies', icon: Shield },
        { id: 'responsabilite', label: 'Responsabilité', icon: Scale },
        { id: 'liens', label: 'Liens externes', icon: LinkIcon },
        { id: 'juridiction', label: 'Juridiction', icon: Globe },
        { id: 'contact', label: 'Contact', icon: Mail },
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-white py-12">
            {/* Hero Section - Compact & Modern */}
            <section className="relative py-16 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full mb-4">
                            <Scale className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Informations légales</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Mentions Légales
                        </h1>
                        <p className="text-lg text-gray-600">
                            Dernière mise à jour : 12 décembre 2025
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content with Sidebar Navigation */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Navigation - Sticky */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="lg:sticky lg:top-24">
                                <nav className="space-y-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                        Sur cette page
                                    </p>
                                    {sections.map((section) => {
                                        const Icon = section.icon;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(section.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                                                    ? 'bg-primary/5 text-primary'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="flex-1 text-left">{section.label}</span>
                                                {activeSection === section.id && (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 max-w-3xl">
                            <div className="prose prose-gray max-w-none">

                                {/* Identification */}
                                <div id="identification" className="scroll-mt-24 mb-16">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Building2 className="w-4 h-4 text-primary" />
                                        </div>
                                        Identification de l'éditeur
                                    </h2>

                                    <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Raison sociale</p>
                                                <p className="text-gray-900 font-semibold">AGANO SERVICES ET CONSULTANCES</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Forme juridique</p>
                                                <p className="text-gray-900 font-semibold">SARL</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-gray-600">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Siège social</p>
                                                <p className="text-gray-900">1035 Avenue de la révolution, Q/ Lumumba, C/ Lubumbashi, RD Congo</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4 pt-4">
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">RCCM</p>
                                                <p className="text-sm text-gray-900 font-mono">CD/LSH/RCCM/25-B-02156</p>
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Idnat</p>
                                                <p className="text-sm text-gray-900 font-mono">05-F4300-N86544K</p>
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">NIF</p>
                                                <p className="text-sm text-gray-900 font-mono">A2555658B</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 pt-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Téléphone</p>
                                                <a href="tel:+243999005148" className="text-primary hover:underline font-medium">
                                                    +243 999 005 148
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Propriété intellectuelle */}
                                <div id="propriete" className="scroll-mt-24 mb-16">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        Propriété intellectuelle
                                    </h2>

                                    <div className="space-y-4 text-gray-600 leading-relaxed">
                                        <p>
                                            L'ensemble des contenus présents sur ce site (textes, logos, images, vidéos, bases de données, structure)
                                            est la propriété exclusive d'<strong className="text-gray-900">AGANO SERVICES ET CONSULTANCES</strong> et
                                            est protégé par les lois relatives à la propriété intellectuelle.
                                        </p>

                                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">⚠️</span>
                                                <div>
                                                    <p className="font-semibold text-amber-900 mb-1">Usage strictement réglementé</p>
                                                    <p className="text-sm text-amber-800">
                                                        Toute reproduction, représentation, modification, publication, adaptation de tout ou partie
                                                        des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans
                                                        autorisation écrite préalable.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Données personnelles et cookies */}
                                <div id="donnees" className="scroll-mt-24 mb-16">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-primary" />
                                        </div>
                                        Données personnelles et cookies
                                    </h2>

                                    <div className="space-y-4 text-gray-600 leading-relaxed">
                                        <p>
                                            Nous accordons une grande importance à la protection de vos données personnelles et au respect
                                            de votre vie privée.
                                        </p>

                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                            <p className="text-sm text-blue-900">
                                                Pour en savoir plus sur la collecte, l'utilisation et la protection de vos données,
                                                consultez notre <a href="/politique-de-confidentialite" className="text-primary font-semibold hover:underline">Politique de confidentialité</a>.
                                            </p>
                                        </div>

                                        <p>
                                            Ce site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic.
                                            Pour plus d'informations, consultez notre <a href="/politique-de-confidentialite" className="text-primary font-semibold hover:underline">Politique de cookies</a>.
                                        </p>
                                    </div>
                                </div>

                                {/* Limitation de responsabilité */}
                                <div id="responsabilite" className="scroll-mt-24 mb-16">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Scale className="w-4 h-4 text-primary" />
                                        </div>
                                        Limitation de responsabilité
                                    </h2>

                                    <div className="space-y-4 text-gray-600 leading-relaxed">
                                        <p>
                                            Les informations diffusées sur ce site sont fournies à titre informatif et peuvent être modifiées
                                            sans préavis. Nous nous efforçons de maintenir ces informations aussi précises et à jour que possible.
                                        </p>

                                        <p>
                                            <strong className="text-gray-900">AGANO SERVICES ET CONSULTANCES</strong> ne saurait être tenu responsable :
                                        </p>

                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>De l'impossibilité d'accéder au site ou de l'utiliser</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Des erreurs ou omissions dans le contenu du site</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Liens hypertextes */}
                                <div id="liens" className="scroll-mt-24 mb-16">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <LinkIcon className="w-4 h-4 text-primary" />
                                        </div>
                                        Liens hypertextes
                                    </h2>

                                    <div className="space-y-4 text-gray-600 leading-relaxed">
                                        <p>
                                            Ce site peut contenir des liens vers des sites web tiers. Ces liens sont fournis uniquement
                                            pour votre commodité et ne signifient pas que nous approuvons le contenu de ces sites.
                                        </p>

                                        <p>
                                            <strong className="text-gray-900">AGANO SERVICES ET CONSULTANCES</strong> n'exerce aucun contrôle
                                            sur ces sites et décline toute responsabilité quant à leur contenu, leurs pratiques de confidentialité
                                            ou leur disponibilité.
                                        </p>
                                    </div>
                                </div>

                                {/* Droit applicable et juridiction */}
                                <div id="juridiction" className="scroll-mt-24 mb-16">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-primary" />
                                        </div>
                                        Droit applicable et juridiction
                                    </h2>

                                    <div className="space-y-4 text-gray-600 leading-relaxed">
                                        <p>
                                            Les présentes mentions légales sont régies par le droit applicable en République Démocratique du Congo,
                                            pays d'enregistrement de la société.
                                        </p>

                                        <p>
                                            Tout litige relatif à l'utilisation de ce site ou à l'interprétation des présentes mentions légales
                                            sera soumis à la juridiction compétente du ressort du siège social de la société, sauf disposition
                                            légale impérative contraire.
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div id="contact" className="scroll-mt-24">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Mail className="w-4 h-4 text-primary" />
                                        </div>
                                        Nous contacter
                                    </h2>

                                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
                                        <p className="text-gray-700 mb-6">
                                            Pour toute question concernant ces mentions légales ou l'utilisation de notre site,
                                            n'hésitez pas à nous contacter :
                                        </p>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <a
                                                href="mailto:info@aganoservicesconsultances.com"
                                                className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-primary hover:shadow-md transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Mail className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                                    <p className="text-sm font-semibold text-gray-900 truncate">info@aganoservicesconsultances.com</p>
                                                </div>
                                            </a>

                                            <a
                                                href="tel:+243999005148"
                                                className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-primary hover:shadow-md transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Phone className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-0.5">Téléphone</p>
                                                    <p className="text-sm font-semibold text-gray-900">+243 999 005 148</p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="border-t border-gray-100 py-12 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-sm text-gray-500">
                            Ces mentions légales ont été mises à jour pour la dernière fois le 12 décembre 2025.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
