import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
            return NextResponse.json(
                { error: 'Veuillez entrer une adresse email valide.' },
                { status: 400 }
            );
        }

        await dbConnect();

        // 1. Vérifier si l'email existe déjà dans MongoDB
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return NextResponse.json(
                { message: 'Vous êtes déjà inscrit à notre newsletter.' },
                { status: 200 }
            );
        }

        // 2. Sauvegarder dans MongoDB
        await Subscriber.create({ email });

        // 3. Ajouter à Brevo (Sendinblue)
        const BREVO_API_KEY = process.env.BREVO_API_KEY;

        if (BREVO_API_KEY) {
            try {
                await axios.post(
                    'https://api.brevo.com/v3/contacts',
                    {
                        email,
                        updateEnabled: true,
                        // Vous pouvez spécifier des listes ici s'il y en a (ex: listIds: [2])
                    },
                    {
                        headers: {
                            'api-key': BREVO_API_KEY,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } catch (brevoError: any) {
                console.error('Erreur Brevo:', brevoError.response?.data || brevoError.message);
                // On ne bloque pas si Brevo échoue mais que MongoDB a fonctionné
            }
        } else {
            console.warn('BREVO_API_KEY non configurée dans le fichier .env');
        }

        return NextResponse.json(
            { message: 'Votre inscription a bien été enregistrée !' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Newsletter API Error:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de l\'inscription.' },
            { status: 500 }
        );
    }
}
