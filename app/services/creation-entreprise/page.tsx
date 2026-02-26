import CreationEntrepriseContent from '@/components/services/CreationEntrepriseContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Création d\'Entreprise via GUCE',
  description: 'Création et enregistrement d\'entreprise en RDC via le GUCE. RCCM, ID fiscal, TVA, domiciliation et accompagnement post-création.',
};

export default function CreationEntreprisePage() {
  return <CreationEntrepriseContent />;
}
