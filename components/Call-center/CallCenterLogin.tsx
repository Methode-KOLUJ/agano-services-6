'use client';

import { useState } from 'react';
import axios from 'axios';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CallCenterLogin({ onLogin }: { onLogin: () => void }) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/call-center/auth', { password });
            if (response.data.success) {
                onLogin();
            } else {
                setError('Mot de passe incorrect');
            }
        } catch (err) {
            setError('Erreur lors de la connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[rgb(210,69,38)]/10 rounded-full text-[rgb(210,69,38)]">
                        <Lock size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Accès Administrateur</h2>
                <p className="text-gray-500 text-center mb-8">Veuillez entrer le mot de passe pour accéder au tableau de bord.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[rgb(210,69,38)] focus:ring-2 focus:ring-[rgb(210,69,38)]/20 transition-all text-gray-900 placeholder-gray-400"
                            placeholder="Mot de passe"
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-[rgb(210,69,38)] hover:bg-[rgb(190,59,28)] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Se connecter'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
