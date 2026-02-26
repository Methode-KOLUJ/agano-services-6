import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Candidature from '@/models/Candidature';
import TempCandidature from '@/models/TempCandidature';

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { personalInfo, projectInfo, paymentPhone } = body;

        console.log('=== API RECEIVED ===');
        console.log('personalInfo received:', personalInfo);
        console.log('dateOfBirth received:', personalInfo?.dateOfBirth);
        console.log('age received from client:', personalInfo?.age);

        // Basic validation
        if (!personalInfo?.phone || !personalInfo?.email || !projectInfo?.title) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        // Robust Age Calculation
        let age = 0;
        const dobString = personalInfo.dateOfBirth; // Expecting YYYY-MM-DD from input type="date"

        if (dobString) {
            // Handle YYYY-MM-DD explicitly to avoid timezone issues with new Date(string)
            const parts = dobString.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // 0-indexed
                const day = parseInt(parts[2]);

                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();
                const currentDay = today.getDate();

                age = currentYear - year;
                // Adjust if birthday hasn't occurred yet this year
                if (currentMonth < month || (currentMonth === month && currentDay < day)) {
                    age--;
                }
                // Safety check: if age is negative (future date), set to 0.
                if (age < 0) age = 0;
            } else {
                // Fallback for non-standard formats (though input type="date" restricts this)
                const birthDate = new Date(dobString);
                if (!isNaN(birthDate.getTime())) {
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }
            }
        }

        if (age < 18) {
            return NextResponse.json({ error: `Vous devez avoir au moins 18 ans. (Âge calculé: ${age} ans)` }, { status: 400 });
        }

        // Ensure age is set in personalInfo for storage
        personalInfo.age = age;
        console.log('Le calcul de l\'âge donne :', { dateOfBirth: dobString, calculatedAge: age, personalInfo });

        // Generate ID
        const orderId = crypto.randomUUID();
        const depositId = crypto.randomUUID();

        // Pawapay Configuration
        const pawapayBaseUrl = "https://api.pawapay.io";
        const pawapayApiKey = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIxMDQiLCJtYXYiOiIxIiwiZXhwIjoyMDgyNTUxMzY3LCJpYXQiOjE3NjcwMTg1NjcsInBtIjoiREFGLFBBRiIsImp0aSI6IjkzYmRkNGNkLWExYmQtNGU5ZS1hMDkwLWQxMGUwYmI0YTNjMCJ9.H3wX9zgKidXtKsADSSevGwXHjAlPFPbo7H0KzbwiyXITLcfrltzLdAGqiCdEehjeB4pkQ37d-EJ7pIDEeMBTxg";
        // const pawapayBaseUrl = "https://api.sandbox.pawapay.io";
        // const pawapayApiKey = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjE0NDgyIiwibWF2IjoiMSIsImV4cCI6MjA4MjI4ODE3NywiaWF0IjoxNzY2NzU1Mzc3LCJwbSI6IkRBRixQQUYiLCJqdGkiOiI1OWI5MWI4Ny0zNDRlLTRjMTktYTFhZi03MzAwM2FkMmI2YTgifQ.9CrxeGhTWZSLSOjjAtZoOIeiQ0zmAbpBZxJhIgPBG5PR5o17-n27evR3mEy4tFxEhE6e31yIM9jT4hsK-GUzvQ"
        if (!pawapayApiKey) {
            console.error('Pawapay API Key missing');
            return NextResponse.json({ error: 'Configuration de paiement manquante' }, { status: 500 });
        }

        // Use paymentPhone if provided, otherwise fallback to contact phone
        let phoneNumber = (paymentPhone || personalInfo.phone).replace(/\s+/g, '').replace(/\+/g, '');
        // Ensure format 243...
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '243' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('243')) {
            // Assume local if 9 digits? Or just prepend? safer to prepend if starts with 8/9
            if (phoneNumber.length === 9) {
                phoneNumber = '243' + phoneNumber;
            }
        }

        const cleanPhone = phoneNumber;

        // Determine provider based on phone number (Simple logic for DRC)
        let provider = 'VODACOM_COD';

        // Extract prefix after 243
        // 243 81 ... -> prefix 81
        if (cleanPhone.startsWith('243') && cleanPhone.length >= 5) {
            const prefix = cleanPhone.substring(3, 5);
            if (['81', '82', '83'].includes(prefix)) provider = 'VODACOM_COD';
            else if (['99', '98', '97'].includes(prefix)) provider = 'AIRTEL_COD';
            else if (['84', '85', '89', '80'].includes(prefix)) provider = 'ORANGE_COD';
            else if (['90'].includes(prefix)) provider = 'AFRICELL_COD';
        }

        // Prepare Pawapay payload
        const payload = {
            depositId: depositId,
            payer: {
                type: "MMO",
                accountDetails: {
                    phoneNumber: cleanPhone,
                    provider: provider
                }
            },
            amount: "10",
            currency: "USD",
            customerMessage: `Sub ${orderId.replace(/[^a-zA-Z0-9 ]/g, '')}`.substring(0, 20),
            metadata: [
                { orderId: orderId }
            ]
        };

        // --- SAVE TO MONGODB (TEMP) FIRST ---
        const candidatureData = {
            orderId,
            depositId,
            personalInfo,
            projectInfo,
            paymentInfo: {
                phone: cleanPhone,
                network: provider,
                amount: "10",
                currency: "USD",
                status: 'PENDING_INITIATION', // Status before calling provider
            }
        };

        try {
            console.log('Enregistrement temporaire avant paiement...');
            await TempCandidature.create(candidatureData);
        } catch (dbError) {
            console.error('Erreur de sauvegarde temporaire:', dbError);
            return NextResponse.json({ error: 'Erreur technique lors de la sauvegarde. Veuillez réessayer.' }, { status: 500 });
        }
        // -----------------------

        console.log('Initiating Pawapay deposit:', { url: `${pawapayBaseUrl}/v2/deposits`, payload });

        try {
            const response = await axios.post(`${pawapayBaseUrl}/v2/deposits`, payload, {
                headers: {
                    'Authorization': `Bearer ${pawapayApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const { status } = response.data;
            console.log('Pawapay response:', response.data);

            if (status === 'ACCEPTED' || status === 'DUPLICATE_IGNORED') {
                // Update status to ACCEPTED
                await TempCandidature.updateOne({ depositId }, { $set: { 'paymentInfo.status': status } });

                return NextResponse.json({
                    success: true,
                    orderId: orderId,
                    depositId: depositId,
                    message: "Paiement initié. Veuillez valider sur votre téléphone."
                });
            } else {
                // Payment request failed/rejected immediately
                return NextResponse.json({ error: `Erreur Pawapay: ${status}` }, { status: 400 });
            }

        } catch (pawapayError: any) {
            console.error('Pawapay Error:', pawapayError.response?.data || pawapayError.message);
            // Optional: Mark as FAILED in DB
            await TempCandidature.updateOne({ depositId }, { $set: { 'paymentInfo.status': 'INITIATION_FAILED' } });

            return NextResponse.json({
                error: 'Erreur lors de l\'initiation du paiement',
                details: pawapayError.response?.data
            }, { status: 500 });
        }



    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
