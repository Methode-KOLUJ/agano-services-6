
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TempCandidature from '@/models/TempCandidature';
import { checkAndProcessPayment } from '../../../../lib/paymentService';

export async function POST() {
    await dbConnect();

    try {
        // Find all Temp Candidatures
        const temps = await TempCandidature.find({}).sort({ createdAt: -1 });
        const results = [];

        console.log(`Syncing ${temps.length} temp records...`);

        for (const temp of temps) {
            try {
                const res = await checkAndProcessPayment(temp.depositId);
                results.push({ depositId: temp.depositId, result: res });
            } catch (e: any) {
                console.error(`Error syncing ${temp.depositId}:`, e.message);
                results.push({ depositId: temp.depositId, error: e.message });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Candidats synchronisés : ${temps.length}`,
            details: results
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
