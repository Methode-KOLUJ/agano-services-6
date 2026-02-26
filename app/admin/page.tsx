import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard | DRC Business Booster',
    description: 'Dashboard administratif pour la gestion des candidatures au financement de projets DRC Business Booster.',
    robots: 'noindex, nofollow', // Empêche l'indexation de la page admin
};

export default function AdminPage() {
    return <AdminDashboardContent />;
}
