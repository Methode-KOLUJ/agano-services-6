import { Metadata } from 'next';
import SoumissionForm from '@/components/soumission/SoumissionForm';

export const metadata: Metadata = {
    title: 'Soumission de Projet',
    description: 'Soumettez votre projet pour analyse et accompagnement par Agano Services.',
    openGraph: {
        title: 'Soumission de Projet',
        description: 'Transformez votre idée en réalité. Soumettez votre projet dès maintenant.',
    },
};

export default function SoumissionProjetPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-[#d24526] selection:text-white pt-28 pb-12 px-4 sm:px-6 flex flex-col justify-center items-center">
            <div className="w-full max-w-4xl">
                <SoumissionForm />
            </div>
        </div>
    );
}