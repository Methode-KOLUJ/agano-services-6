'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, ChevronRight, DollarSign, X, Phone } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import Link from 'next/link';
import PartenaireLogos from './PartenaireLogos';

type ProjectStage = 'Idée' | 'Prototype' | 'Opérationnel';
type Sector = 'Technologie' | 'Environnement' | 'Agriculture' | 'Pisciculture' | 'Elevage' | 'Industrie';
type Budget = '1000 $' | '1500 $' | '2000 $' | '2500 $' | '3000 $' | '3500 $' | '4000 $' | '4500 $';

interface FormData {
    personalInfo: {
        fullName: string;
        city: string;
        email: string;
        phone: string;
        dateOfBirth: string
    };
    projectInfo: {
        sector: Sector;
        title: string;
        budget: Budget
        summary: string;
        stage: ProjectStage;
    };
}

const initialFormData: FormData = {
    personalInfo: {
        fullName: '',
        city: '',
        email: '',
        phone: '',
        dateOfBirth: '',
    },
    projectInfo: {
        sector: 'Agriculture',
        title: '',
        budget: '1000 $',
        summary: '',
        stage: 'Idée',
    },
};

export default function SoumissionForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentPhone, setPaymentPhone] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handlePersonalChange called:', e.target.name, '=', e.target.value);
        setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value },
        });
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            projectInfo: { ...formData.projectInfo, [e.target.name]: e.target.value },
        });
    };

    const wordCount = formData.projectInfo.summary.trim().split(/\s+/).filter(Boolean).length;

    const handleOpenPaymentModal = (e: React.FormEvent) => {
        console.log(formData)
        e.preventDefault();
        setPaymentPhone(''); // Open empty
        setShowPaymentModal(true);
    };

    const handleFinalSubmit = async () => {

        setIsSubmitting(true);
        setError(null);

        try {
            const age = calculateAge(formData.personalInfo.dateOfBirth);

            const payload = {
                ...formData,
                personalInfo: {
                    ...formData.personalInfo,
                    age: age
                },
                paymentPhone: paymentPhone
            };

            const response = await axios.post('/api/soumission-projet', payload);

            if (response.data.success) {
                // Instead of closing immediately, start verification
                setIsSubmitting(false); // Submission done, now verifying
                setIsVerifying(true);
                pollPaymentStatus(response.data.depositId);
            }
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.error || "Une erreur est survenue lors de la soumission.";
            setError(errorMessage);
            setIsSubmitting(false);
            // Don't close modal on error, let them try again
        }
    };

    const pollPaymentStatus = (depositId: string) => {
        const startTime = Date.now();
        const intervalMs = 3000; // Check every 3 seconds
        const timeoutMs = 300000; // 5 minutes timeout

        const check = async () => {
            // If user closed verify modal manually, stop polling? 
            // Ideally we should keep polling in background if we want to catch late notifications, 
            // but for UX let's respect the modal state or just keep it running silently?
            // Current logic requires modal open to show "Verifying" state, but logic runs anyway.
            if (!showPaymentModal) return;

            try {
                // console.log("Checking payment status for", depositId);
                const res = await axios.get(`/api/verify-payment?depositId=${depositId}`);
                const status = res.data.status;

                if (status === 'COMPLETED') {
                    setIsVerifying(false);
                    setShowPaymentModal(false);
                    setShowSuccessModal(true);
                    return;
                } else if (['FAILED', 'REJECTED', 'CANCELLED', 'EXPIRED'].includes(status)) {
                    setIsVerifying(false);
                    setShowPaymentModal(false);
                    setError(res.data.reason === 'CANCELLED' ? "Vous avez annulé la transaction." : "Le paiement a échoué. Veuillez vérifier votre solde.");
                    setShowFailureModal(true);
                    return;
                }
            } catch (e) {
                console.error("Erreur de vérification", e);
            }

            // Continue polling
            if (Date.now() - startTime < timeoutMs) {
                setTimeout(check, intervalMs);
            } else {
                setIsVerifying(false);
                setShowPaymentModal(false);
                setError("Le délai d'attente est dépassé. Veuillez réessayer.");
                setShowFailureModal(true);
            }
        };
        // Start polling
        check();
    };

    const handleManualCheck = async (e: React.MouseEvent) => {
        e.preventDefault();
        // Trigger a check immediately, polling loop will also continue but this gives instant feedback
        try {
            // Need depositId here, but it's local in handleFinalSubmit scope or we assume last one?
            // Since we can't easily access the verify loop scope, we rely on the state. Only works if we have the ID.
            // Actually, best to just let the loop run, but maybe show a 'Checking...' toast.
            // Or we can just restart the polling if stopped? 
            // Better: Just let the user know we are checking.
        } catch (e) { }
    };

    const calculateAge = (dateString: string) => {
        if (!dateString) return 0;

        // Handle simple Year input (e.g., "1990")
        if (!dateString.includes('-')) {
            const year = parseInt(dateString);
            if (!isNaN(year)) {
                return new Date().getFullYear() - year;
            }
        }

        const parts = dateString.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);

            const today = new Date();
            let age = today.getFullYear() - year;
            const m = today.getMonth() - month;
            if (m < 0 || (m === 0 && today.getDate() < day)) {
                age--;
            }
            return age;
        }

        // Fallback
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const validateStep1 = () => {
        const { fullName, city, email, phone, dateOfBirth } = formData.personalInfo;
        const isComplete = fullName.trim() !== '' && city.trim() !== '' && email.trim() !== '' && phone.trim() !== '' && dateOfBirth.trim() !== '';

        if (!isComplete) return false;

        const age = calculateAge(dateOfBirth);
        if (age < 18) {
            return false;
        }

        return true;
    };

    const validateStep2 = () => {
        const { title, summary, stage, budget } = formData.projectInfo;
        return title.trim() !== '' && summary.trim() !== '' && stage.trim() !== '' && budget.trim() !== '' && wordCount <= 200;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto text-center mb-12">
                <FadeIn delay={0.1}>
                    <h1 className=" text-3xl md:text-4xl lg:text-5xl font-extrabold py-6 md:py-8">
                        <span className="bg-gradient-to-r uppercase from-[rgb(210,69,38)] to-[rgb(230,89,58)] bg-clip-text text-transparent">
                            RDC Business Booster
                        </span>
                    </h1>
                    <p className="text-lg text-gray-700">
                        La première édition de RDC Business Booster vise uniquement les candidats dont les projets concernent l'agriculture. Candidature ouverte du <span className='text-blue-700 font-light'>15.Février.2026</span>  au <span className='text-blue-700 font-light'>30.Avril.2026</span>
                    </p>
                    <p className="text-md italic text-gray-500 py-6">
                        Pour toutes vos questions, appelez le service client en cliquant <Link href="tel:+243801776888" className="text-[rgb(210,69,38)] font-bold">ici</Link> ou écrivez sur whatsapp en appuyant <Link href="https://wa.me/243801776888" className="text-[rgb(210,69,38)] font-bold">ici</Link>.
                    </p>
                </FadeIn>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Progress Steps content... */}

                {/* Form content */}
                <FadeIn delay={0.3}>
                    <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-10 shadow-lg">
                        <form onSubmit={handleOpenPaymentModal}>
                            <AnimatePresence mode="wait">

                                {/* Step 1: Personal Info */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                            <ChevronRight className="text-[rgb(210,69,38)]" /> Informations Personnelles <span className="text-gray-500 text-xs">(18 ans ou plus)</span>
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Nom complet <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.personalInfo.fullName}
                                                    onChange={handlePersonalChange}
                                                    className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 placeholder-gray-400 ${!formData.personalInfo.fullName.trim() ? 'border-gray-200' : 'border-green-200'}`}
                                                    placeholder="Votre nom complet"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Ville <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <select
                                                        name="city"
                                                        value={formData.personalInfo.city}
                                                        onChange={(e) => {
                                                            console.log('City changed to:', e.target.value);
                                                            setFormData({
                                                                ...formData,
                                                                personalInfo: {
                                                                    ...formData.personalInfo,
                                                                    city: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 appearance-none cursor-pointer"
                                                        required
                                                    >
                                                        <option value="" disabled>Sélectionnez votre ville</option>
                                                        <option value="bandundu">Bandundu</option>
                                                        <option value="baraka">Baraka</option>
                                                        <option value="beni">Beni</option>
                                                        <option value="boende">Boende</option>
                                                        <option value="boma">Boma</option>
                                                        <option value="bukavu">Bukavu</option>
                                                        <option value="bunia">Bunia</option>
                                                        <option value="buta">Buta</option>
                                                        <option value="butembo">Butembo</option>
                                                        <option value="gbadolite">Gbadolite</option>
                                                        <option value="gemena">Gemena</option>
                                                        <option value="goma">Goma</option>
                                                        <option value="inongo">Inongo</option>
                                                        <option value="isiro">Isiro</option>
                                                        <option value="kabinda">Kabinda</option>
                                                        <option value="kalemie">Kalemie</option>
                                                        <option value="kamina">Kamina</option>
                                                        <option value="kananga">Kananga</option>
                                                        <option value="kenge">Kenge</option>
                                                        <option value="kikwit">Kikwit</option>
                                                        <option value="kindu">Kindu</option>
                                                        <option value="kisangani">Kisangani</option>
                                                        <option value="kinshasa">Kinshasa</option>
                                                        <option value="kolwezi">Kolwezi</option>
                                                        <option value="likasi">Likasi</option>
                                                        <option value="lisala">Lisala</option>
                                                        <option value="lubumbashi">Lubumbashi</option>
                                                        <option value="lusambo">Lusambo</option>
                                                        <option value="matadi">Matadi</option>
                                                        <option value="mbandaka">Mbandaka</option>
                                                        <option value="mbujimayi">Mbujimayi</option>
                                                        <option value="mwene-ditu">Mwene-Ditu</option>
                                                        <option value="tshikapa">Tshikapa</option>
                                                        <option value="uvira">Uvira</option>
                                                        <option value="zongo">Zongo</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                        <ChevronRight className="rotate-90" size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.personalInfo.email}
                                                    onChange={handlePersonalChange}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 placeholder-gray-400"
                                                    placeholder="nom@exemple.com"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Téléphone de contact <span className="text-red-500">*</span></label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.personalInfo.phone}
                                                    onChange={handlePersonalChange}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 placeholder-gray-400"
                                                    placeholder="+243..."
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm font-medium text-gray-700">Année de naissance <span className="text-red-500">*</span></label>
                                                    {formData.personalInfo.dateOfBirth && formData.personalInfo.dateOfBirth.length === 4 && (
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${calculateAge(formData.personalInfo.dateOfBirth) >= 18 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {calculateAge(formData.personalInfo.dateOfBirth) >= 18 ? 'OK' : 'Non'}
                                                        </span>
                                                    )}
                                                </div>
                                                <input
                                                    type="number"
                                                    name="dateOfBirth"
                                                    value={formData.personalInfo.dateOfBirth}
                                                    onChange={(e) => {
                                                        // Ensure only 4 digits max
                                                        if (e.target.value.length <= 4) {
                                                            handlePersonalChange(e);
                                                        }
                                                    }}
                                                    min="1900"
                                                    max={new Date().getFullYear()}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 placeholder-gray-400"
                                                    placeholder="Votre âge"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const { fullName, city, email, phone, dateOfBirth } = formData.personalInfo;
                                                    const isComplete = fullName.trim() !== '' && city.trim() !== '' && email.trim() !== '' && phone.trim() !== '' && dateOfBirth.trim() !== '';

                                                    if (!isComplete) {
                                                        alert("Veuillez remplir tous les champs obligatoires correctement.");
                                                        return;
                                                    }

                                                    const age = calculateAge(dateOfBirth);
                                                    if (age < 18) {
                                                        alert("Vous devez avoir au moins 18 ans pour avoir le financement.");
                                                        return;
                                                    }

                                                    setStep(2);
                                                }}
                                                className={`px-8 py-3 bg-[rgb(210,69,38)] text-white font-bold rounded-lg transition-colors flex items-center gap-2 ${!validateStep1() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[rgb(190,59,28)]'}`}
                                            >
                                                Suivant <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Project Info */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                            <ChevronRight className="text-[rgb(210,69,38)]" /> Infos du Projet
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Secteur d'activité</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value="Agriculture"
                                                            disabled
                                                            className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed font-medium"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Stade du projet <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            name="stage"
                                                            value={formData.projectInfo.stage}
                                                            onChange={handleProjectChange}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 appearance-none cursor-pointer"
                                                            required
                                                        >
                                                            <option value="Idée">Idée</option>
                                                            <option value="Prototype">Prototype</option>
                                                            <option value="Opérationnel">Opérationnel</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                            <ChevronRight className="rotate-90" size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Titre du projet <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={formData.projectInfo.title}
                                                        onChange={handleProjectChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 placeholder-gray-400"
                                                        placeholder="Titre de votre projet"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Budget nécessaire <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            name="budget"
                                                            value={formData.projectInfo.budget}
                                                            onChange={handleProjectChange}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 appearance-none cursor-pointer"
                                                            required
                                                        >
                                                            <option value="" disabled>Sélectionnez votre budget</option>
                                                            <option value="1000 $">1.000 $</option>
                                                            <option value="1500 $">1.500 $</option>
                                                            <option value="2000 $">2.000 $</option>
                                                            <option value="2500 $">2.500 $</option>
                                                            <option value="3000 $">3.000 $</option>
                                                            <option value="3500 $">3.500 $</option>
                                                            <option value="4000 $">4.000 $</option>
                                                            <option value="4500 $">4.500 $</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                            <ChevronRight className="rotate-90" size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Résumé du projet <span className="text-red-500">*</span>
                                                    <span className={`ml-2 text-xs ${wordCount > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                                                        ({wordCount}/200 mots)
                                                    </span>
                                                </label>
                                                <textarea
                                                    name="summary"
                                                    value={formData.projectInfo.summary}
                                                    onChange={handleProjectChange}
                                                    rows={5}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 placeholder-gray-400 resize-none"
                                                    placeholder="Décrivez votre projet en quelques mots..."
                                                    required
                                                />
                                                {wordCount > 200 && (
                                                    <p className="text-red-500 text-sm">Le résumé ne doit pas dépasser 200 mots.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Retour
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (validateStep2()) {
                                                        setStep(3);
                                                    } else {
                                                        alert("Veuillez remplir tous les champs obligatoires du projet.");
                                                    }
                                                }}
                                                className={`px-8 py-3 bg-[rgb(210,69,38)] text-white font-bold rounded-lg transition-colors flex items-center gap-2 ${!validateStep2() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[rgb(190,59,28)]'}`}
                                            >
                                                Suivant <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Confirmation */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[rgb(210,69,38)]">
                                            Contribution d'engagement
                                        </h2>

                                        <div className="bg-[rgb(210,69,38)]/5 border border-[rgb(210,69,38)]/20 rounded-xl p-6 mb-6">
                                            <h3 className="font-semibold text-lg mb-2">Frais de dossier unique de 10$</h3>
                                            <p className="text-gray-600 text-sm">
                                                Frais d'ouverture de dossier et de gestion.
                                            </p>
                                            <p className="text-gray-600 text-sm mt-2">
                                                <strong>Note :</strong> ces frais couvrent l'analyse administrative et garantissent le sérieux du candidat (non remboursables).
                                            </p>
                                        </div>

                                        <div className="space-y-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <p><strong className="text-gray-900">Nom :</strong> {formData.personalInfo.fullName}</p>
                                            <p><strong className="text-gray-900">Email :</strong> {formData.personalInfo.email}</p>
                                            <p><strong className="text-gray-900">Téléphone :</strong> {formData.personalInfo.phone}</p>
                                            <p><strong className="text-gray-900">Projet :</strong> {formData.projectInfo.title}</p>
                                            <p><strong className="text-gray-900">Budget du projet :</strong> {formData.projectInfo.budget}</p>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-600 text-sm">
                                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Retour
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-8 py-3 bg-gradient-to-r from-[rgb(210,69,38)] to-[rgb(230,89,58)] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                                            >
                                                Soumettre
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </FadeIn>
                <div>
                    <PartenaireLogos />
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowPaymentModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-2xl font-extrabold mb-2 text-gray-900 flex items-center gap-2">
                                Paiement de la candidature
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Rappel : le paiement se fait par Orange Money ou Airtel Money.
                            </p>

                            <div className="flex justify-center gap-6 mb-8">
                                <div className="h-16 w-16 relative">
                                    {/* Orange Money Placeholder */}
                                    <img
                                        src="https://res.cloudinary.com/dgv2vmgio/image/upload/v1768308692/orange-money_d3kew7.png"
                                        alt="Orange Money"
                                        className="object-contain w-full h-full rounded-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png'
                                        }}
                                    />
                                    <p className="text-[8px] text-center mt-1 font-bold text-orange-500">Orange Money</p>
                                </div>
                                <div className="h-16 w-16 relative">
                                    {/* Airtel Money Placeholder */}
                                    <img
                                        src="https://res.cloudinary.com/dgv2vmgio/image/upload/v1768308692/Airtel_money_uxbd8e.jpg"
                                        alt="Airtel Money"
                                        className="object-contain w-full h-full rounded-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Airtel_logo.svg'
                                        }}
                                    />
                                    <p className="text-[8px] text-center mt-1 font-bold text-red-500">Airtel Money</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {isVerifying ? (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-gray-200 border-t-[rgb(210,69,38)] rounded-full animate-spin"></div>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-lg font-bold text-gray-900">Validation en cours...</h4>
                                            <p className="text-sm text-gray-500 mt-2 px-4 mb-4">
                                                Veuillez confirmer la transaction sur votre téléphone maintenant.
                                            </p>
                                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 mx-8">
                                                Ne fermez pas cette fenêtre tant que la confirmation ne s'affiche pas.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Phone size={16} /> Numéro de paiement
                                            </label>
                                            <input
                                                type="tel"
                                                value={paymentPhone}
                                                onChange={(e) => setPaymentPhone(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[rgb(210,69,38)] transition-colors text-gray-900 text-lg tracking-wide placeholder-gray-400"
                                                placeholder="+243 XXX XXX XXX"
                                                autoFocus
                                            />
                                        </div>

                                        <button
                                            onClick={handleFinalSubmit}
                                            disabled={isSubmitting || !paymentPhone}
                                            className="w-full py-4 mt-4 bg-gradient-to-r from-[rgb(210,69,38)] to-[rgb(230,89,58)] text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" /> Traitement...
                                                </>
                                            ) : (
                                                <>
                                                    Confirmer le Paiement
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowSuccessModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white border border-gray-100 rounded-2xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 shadow-2xl text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                    <CheckCircle size={32} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Félicitations !</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Merci <strong>{formData.personalInfo.fullName}</strong> d'avoir soumis votre projet, une demande de paiement a été envoyée au
                                <span className="text-gray-900 font-bold"> {paymentPhone}</span>.
                                <br />
                                Veuillez valider la transaction.
                            </p>
                            <p className="text-gray-500 text-sm mb-8">
                                Nous vous recontacterons pour confirmer le financement de votre projet via
                                <span className="text-gray-900 font-medium"> {formData.personalInfo.email}</span> et/ou
                                <span className="text-gray-900 font-medium"> {formData.personalInfo.phone}</span>.
                            </p>
                            <p>
                                Nous vous invitons à prendre connaissance du déroulement du projet en téléchargeant <Link href={"https://drive.google.com/file/d/1yGTFKvAjktw4d40ubhe5n9TUdjjsLMLi/view?usp=drive_link"} className='text-blue-700 underline font-medium' download>ce fichier pdf</Link>.
                            </p>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setFormData(initialFormData);
                                    setPaymentPhone('');
                                    setStep(1);
                                }}
                                className="w-full mt-3 md:mt-6 py-3 bg-[rgb(210,69,38)] hover:bg-[rgb(230,89,58)] text-white font-bold rounded-xl transition-colors"
                            >
                                Compris
                            </button>
                        </motion.div>
                    </div>
                )}
                {/* ... Success Modal ... */}
            </AnimatePresence>

            {/* Failure Modal */}
            <AnimatePresence>
                {showFailureModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowFailureModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                                    <X size={32} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Échec du paiement</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {error || "La transaction a échoué ou a été annulée. Veuillez vérifier votre solde et réessayer."}
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setShowFailureModal(false);
                                        // Optional: Re-open payment modal to retry immediately
                                        // setShowPaymentModal(true); 
                                    }}
                                    className="w-full py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Fermer
                                </button>
                                <button
                                    onClick={() => {
                                        setShowFailureModal(false);
                                        setShowPaymentModal(true); // Retry action
                                    }}
                                    className="w-full py-3 bg-[rgb(210,69,38)] hover:bg-[rgb(230,89,58)] text-white font-bold rounded-xl transition-colors"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
