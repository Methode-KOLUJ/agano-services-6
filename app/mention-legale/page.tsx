import MentionLegaleContent from '@/components/mention-legale/MentionLegaleContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mentions Légales',
    description: 'Mentions légales d\'AGANO SERVICES ET CONSULTANCES SARL. Informations sur l\'éditeur, propriété intellectuelle, données personnelles et responsabilité.',
};

export default function MentionLegalePage() {
    return <MentionLegaleContent />;
}
