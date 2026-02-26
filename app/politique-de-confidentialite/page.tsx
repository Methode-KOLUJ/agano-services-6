import PolitiqueContent from '@/components/politique-de-confidentialite/Politique';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politique de Confidentialité',
    description: 'Politique de confidentialité et protection des données personnelles d\'AGANO SERVICES ET CONSULTANCES. Découvrez comment nous collectons, utilisons et protégeons vos informations.',
};

export default function PolitiqueDeConfidentialitePage() {
    return <PolitiqueContent />;
}