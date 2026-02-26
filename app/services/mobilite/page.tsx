import MobiliteContent from '@/components/services/MobiliteContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobilité Internationale & Immigration',
  description: 'Facilitez l\'installation de vos talents internationaux en RDC. Obtention de visas, titres de séjour, cartes de travail et accompagnement complet.',
};

export default function MobilitePage() {
  return <MobiliteContent />;
}
