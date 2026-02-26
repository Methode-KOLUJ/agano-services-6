'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    FileText,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Eye,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    MapPin,
    Trash2,
    RefreshCcw
} from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';

interface Candidature {
    _id: string;
    orderId: string;
    personalInfo: {
        fullName: string;
        city: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        age?: number;
    };
    projectInfo: {
        sector: string;
        title: string;
        summary: string;
        stage: string;
    };
    paymentInfo: {
        status: string;
        amount: string;
        currency: string;
    };
    selectionStatus?: string; // Added selectionStatus
    createdAt: string;
}

export default function AdminDashboardContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [candidatures, setCandidatures] = useState<Candidature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedCity, setSelectedCity] = useState('ALL');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    useEffect(() => {
        const savedAuth = localStorage.getItem('admin_authenticated');
        if (savedAuth === 'true') {
            setIsAuthenticated(true);
        } else {
            // Also check for cookie if possible, but JS can't read httpOnly. 
            // So we rely on the component state for now.
            // If the cookie exists, the next fetch will succeed, but we need to know if we are "logged in" contextually.
            // Let's assume on mount, if we don't have localStorage, we are not authenticated.
            setIsLoading(false); // Stop general loading, wait for explicit auth
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('admin_authenticated', 'true');
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/candidatures');
            if (response.data.success) {
                console.log('Candidatures received:', response.data.data);
                console.log('First candidature age:', response.data.data[0]?.personalInfo?.age);
                setCandidatures(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAge = (dateString: string) => {
        if (!dateString) return 0;

        // Handle YYYY-MM-DD explicitly (same as API)
        const parts = dateString.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // 0-indexed
            const day = parseInt(parts[2]);

            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();
            const currentDay = today.getDate();

            let age = currentYear - year;
            // Adjust if birthday hasn't occurred yet this year
            if (currentMonth < month || (currentMonth === month && currentDay < day)) {
                age--;
            }
            return age > 0 ? age : 0;
        }

        // Fallback for other formats
        const birthDate = new Date(dateString);
        if (isNaN(birthDate.getTime())) return 0;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 0 ? age : 0;
    };

    const handleSelectionUpdate = async (id: string, status: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row toggle
        setIsUpdating(id);
        try {
            const response = await axios.put('/api/admin/candidatures/update', { id, status });
            if (response.data.success) {
                // Update local state
                setCandidatures(prev => prev.map(c =>
                    c._id === id ? { ...c, selectionStatus: status } : c
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.')) return;

        setIsUpdating(id);
        try {
            const response = await axios.delete(`/api/admin/candidatures/delete?id=${id}`);
            if (response.data.success) {
                setCandidatures(prev => prev.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error('Error deleting candidature:', error);
            alert('Erreur lors de la suppression');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleExport = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(candidatures.map(c => ({
                'Nom Complet': c.personalInfo.fullName,
                'Email': c.personalInfo.email,
                'Téléphone': c.personalInfo.phone,
                'Ville': c.personalInfo.city,
                'Date de naissance': c.personalInfo.dateOfBirth,
                'Age': (c.personalInfo.age || calculateAge(c.personalInfo.dateOfBirth)) || 'N/A',
                'Titre Projet': c.projectInfo.title,
                'Secteur': c.projectInfo.sector,
                'Stade': c.projectInfo.stage,
                'Résumé': c.projectInfo.summary,
                'Statut Paiement': c.paymentInfo.status,
                'Montant': `${c.paymentInfo.amount} ${c.paymentInfo.currency}`,
                'Date Création': new Date(c.createdAt).toLocaleDateString(),
                'Statut Sélection': c.selectionStatus === 'SELECTED' ? 'RETENU' : (c.selectionStatus === 'REJECTED' ? 'NON RETENU' : 'EN EXAMEN')
            })));
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Candidatures");
            xlsx.writeFile(workbook, "candidatures_export.xlsx");
        });
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await axios.post('/api/admin/sync-payments');
            if (res.data.success) {
                alert(res.data.message);
                fetchData(); // Reload data
            }
        } catch (e) {
            console.error(e);
            alert('Erreur de synchronisation');
        } finally {
            setIsSyncing(false);
        }
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }
    const uniqueCities = Array.from(new Set(candidatures.map(c => c.personalInfo.city))).sort(); // Get unique cities

    const filteredCandidatures = candidatures.filter(c => {
        const matchesSearch =
            c.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.projectInfo.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'ALL' || c.paymentInfo.status === selectedStatus;
        const matchesCity = selectedCity === 'ALL' || c.personalInfo.city === selectedCity; // Added city filter

        return matchesSearch && matchesStatus && matchesCity;
    });

    const stats = {
        total: candidatures.length,
        accepted: candidatures.filter(c => c.paymentInfo.status === 'ACCEPTED' || c.paymentInfo.status === 'DUPLICATE_IGNORED' || c.paymentInfo.status === 'COMPLETED').length,
        citiesCount: uniqueCities.length, // Replaced pending with citiesCount
        revenue: candidatures.reduce((acc, curr) => {
            if (curr.paymentInfo.status === 'ACCEPTED' || curr.paymentInfo.status === 'DUPLICATE_IGNORED' || curr.paymentInfo.status === 'COMPLETED') {
                return acc + parseFloat(curr.paymentInfo.amount);
            }
            return acc;
        }, 0)
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
            case 'DUPLICATE_IGNORED':
            case 'COMPLETED':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Payé</span>;
            case 'REJECTED':
            case 'FAILED':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle size={12} /> Échoué</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock size={12} /> En attente</span>;
        }
    };

    const getSelectionBadge = (status?: string) => {
        if (status === 'SELECTED') return <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">RETENU</span>;
        if (status === 'REJECTED') return <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-200">NON RETENU</span>;
        return <span className="text-gray-400 font-medium text-xs">EN EXAMEN</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl mb-6 font-extrabold bg-gradient-to-r uppercase from-[rgb(210,69,38)] to-[rgb(230,89,58)] bg-clip-text text-transparent tracking-tight">RDC Agro Business Booster</h1>
                        <p className="text-gray-500 mt-1">Dashboard dédié à la gestion des candidats au financement des projets</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSync} disabled={isSyncing} className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-all shadow-sm disabled:opacity-50">
                            <RefreshCcw size={18} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? 'Sync...' : 'Synchroniser'}
                        </button>
                        <button onClick={handleExport} className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-all shadow-sm">
                            <Download size={18} /> Exporter le rapport
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-[rgb(210,69,38)]/10 rounded-lg text-[rgb(210,69,38)]">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp size={12} /> +12%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Candidats</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Candidatures Payées</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.accepted}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"> {/* Changed color and icon */}
                                <MapPin size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Villes Représentées</h3> {/* Changed text */}
                        <p className="text-3xl font-bold text-gray-900">{stats.citiesCount}</p> {/* Changed stat */}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <LayoutDashboard size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Revenu Total</h3>
                        <p className="text-2xl font-bold text-gray-900 break-words">{stats.revenue}$</p>
                    </motion.div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou projet..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(210,69,38)]/20 focus:border-[rgb(210,69,38)] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap"> {/* Added flex-wrap for better responsiveness */}

                        <select // Added city filter select
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgb(210,69,38)] text-gray-700 font-medium"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value="ALL">Toutes les villes</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidat</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projet</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut Paiement</th> {/* Updated column header */}
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sélection</th> {/* Added new column header */}
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Chargement des données...
                                        </td>
                                    </tr>
                                ) : filteredCandidatures.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Aucune candidature trouvée.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCandidatures.map((candidature) => (
                                        <>
                                            <tr key={candidature._id} onClick={() => toggleRow(candidature._id)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer border-b border-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-gray-400">
                                                            {expandedRows.has(candidature._id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[rgb(210,69,38)] to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                                                                {candidature.personalInfo.fullName.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-bold text-gray-900">{candidature.personalInfo.fullName}</div>
                                                                <div className="text-xs text-gray-500">{candidature.personalInfo.city}</div>
                                                                <div className="text-xs text-red-700">{candidature.personalInfo.age || calculateAge(candidature.personalInfo.dateOfBirth)} ans</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 font-medium truncate max-w-[200px] hover:whitespace-normal hover:overflow-visible">{candidature.projectInfo.title}</div>
                                                    <div className="text-xs text-gray-500">{candidature.projectInfo.sector} • {candidature.projectInfo.stage}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900"><Link href={`mailto:${candidature.personalInfo.email}`}>{candidature.personalInfo.email}</Link></div>
                                                    <div className="text-xs text-gray-500"><Link href={`tel:${candidature.personalInfo.phone}`}>{candidature.personalInfo.phone}</Link></div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(candidature.paymentInfo.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap"> {/* New column for selection status */}
                                                    {getSelectionBadge(candidature.selectionStatus)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}> {/* Added onClick to stop propagation */}
                                                        <button
                                                            onClick={(e) => handleSelectionUpdate(candidature._id, 'SELECTED', e)}
                                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${candidature.selectionStatus === 'SELECTED' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
                                                            disabled={isUpdating === candidature._id}
                                                        >
                                                            {isUpdating === candidature._id ? '...' : 'OUI'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleSelectionUpdate(candidature._id, 'REJECTED', e)}
                                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${candidature.selectionStatus === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                                                            disabled={isUpdating === candidature._id}
                                                        >
                                                            {isUpdating === candidature._id ? '...' : 'NON'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(candidature._id, e)}
                                                            className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-2"
                                                            title="Supprimer"
                                                            disabled={isUpdating === candidature._id}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRows.has(candidature._id) && (
                                                <tr className="bg-gray-50/30">
                                                    <td colSpan={6} className="px-8 py-4">
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                                            <h4 className="text-sm font-bold text-gray-900 mb-2">Résumé du projet :</h4>
                                                            <p className="text-md text-justify hyphens-auto text-gray-600 leading-relaxed bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                                                {candidature.projectInfo.summary}
                                                            </p>
                                                            <div className="mt-4 flex gap-4 text-xs text-gray-500">
                                                                <span>Status : {candidature.projectInfo.stage}</span>
                                                                <span>Crée le : {new Date(candidature.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination - Simplified for UI demo */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Affichage de <span className="font-medium">{filteredCandidatures.length}</span> sur <span className="font-medium">{candidatures.length}</span> résultats</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 disabled:opacity-50" disabled>Précédent</button>
                            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 disabled:opacity-50" disabled>Suivant</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
