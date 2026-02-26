import GestionFiscaleContent from '@/components/services/GestionFiscaleContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestion Fiscale et Conformité',
  description: 'Gestion fiscale complète en RDC. IS, TVA, ITPR, états financiers, bilans et conformité totale avec optimisation fiscale.',
};

export default function GestionFiscalePage() {
  return <GestionFiscaleContent />;
}
