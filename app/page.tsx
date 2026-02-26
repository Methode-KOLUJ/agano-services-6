import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesPreview from '@/components/home/ServicesPreview';
import Mission from '@/components/home/Mission';
import Approach from '@/components/home/Approach';
import Team from '@/components/home/Team';
import Engagement from '@/components/home/Engagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Agano Services et Consultances | Création d\'Entreprise & Fiscalité en RDC'
  },
  description: 'Expert en création d\'entreprise, gestion fiscale, mobilité internationale et services complémentaires en République Démocratique du Congo. Accompagnement complet via le GUCE.',
  keywords: 'création entreprise RDC, GUCE, fiscalité Congo, mobilité internationale, AGANO Services, Lubumbashi',
  openGraph: {
    title: 'AGANO Services et Consultances',
    description: 'Votre partenaire de confiance pour la création d\'entreprise et la gestion fiscale en RDC',
    type: 'website',
  },
};


export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ServicesPreview />
      <Mission />
      <Approach />
      <Team />
      <Engagement />
    </>
  );
}
