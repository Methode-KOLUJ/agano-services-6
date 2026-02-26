import ComplementaireContent from '@/components/services/ComplementaireContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services Complémentaires',
  description: 'Assistance administrative, gestion de la paie, conformité sociale, sous-traitance et licences. Votre partenaire opérationnel au quotidien en RDC.',
};

export default function ComplementairePage() {
  return <ComplementaireContent />;
}
