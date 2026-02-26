import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/dbConnect';
import Candidature from '@/models/Candidature';
import TempCandidature from '@/models/TempCandidature';

import { checkAndProcessPayment } from '../../../lib/paymentService';

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const depositId = searchParams.get('depositId');

    if (!depositId) {
        return NextResponse.json({ error: 'depositId requis' }, { status: 400 });
    }

    try {
        const result = await checkAndProcessPayment(depositId);

        if (result.status === 'COMPLETED') {
            if (result.warning) {
                return NextResponse.json({ status: 'COMPLETED', warning: result.warning });
            }
            return NextResponse.json({ status: 'COMPLETED' });
        } else if (['FAILED', 'REJECTED', 'EXPIRED', 'CANCELLED'].includes(result.status)) {
            return NextResponse.json({ status: 'FAILED', reason: result.status });
        } else {
            return NextResponse.json({ status: 'PENDING', pawapayStatus: result.status });
        }

    } catch (error: any) {
        console.error('Check Status Internal Error:', error.message);
        return NextResponse.json({ error: 'Erreur interne de vérification' }, { status: 500 });
    }
}
