import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Candidature from '@/models/Candidature';
import TempCandidature from '@/models/TempCandidature';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        console.log('Pawapay Callback received:', body);

        // Pawapay typically sends:
        // { depositId, status, failureReason, paymentProviderId, amount, currency, ... }
        const { depositId, status, failureReason, paymentProviderId } = body;

        if (!depositId || !status) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // 1. Idempotency Check: See if already processed and stored in main collection
        const existing = await Candidature.findOne({ depositId });
        if (existing) {
            console.log(`Callback: Candidature already exists for ${depositId}. Ignored.`);
            // Respond successfully to acknowledge receipt
            return NextResponse.json({ received: true, message: 'Already processed' });
        }

        // 2. Find the temporary record
        const temp = await TempCandidature.findOne({ depositId });

        if (!temp) {
            console.error('Callback: TempCandidature not found for depositId:', depositId);
            // Return 200 to stop Pawapay from retrying indefinitely if the record is truly gone
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 3. Update status in Temp (so we have the latest status even if we don't move it yet)
        temp.paymentInfo.status = status;
        if (paymentProviderId) {
            temp.paymentInfo.provider_transaction_id = paymentProviderId;
        }

        if (status === 'COMPLETED') {
            console.log(`Callback: Payment COMPLETED for ${depositId}. Moving to saved candidatures.`);

            // Create Permanent Record
            const newCandidature = {
                orderId: temp.orderId,
                depositId: temp.depositId,
                personalInfo: temp.personalInfo,
                projectInfo: temp.projectInfo,
                paymentInfo: {
                    ...temp.paymentInfo,
                    status: 'COMPLETED',
                    provider_transaction_id: paymentProviderId || temp.paymentInfo.provider_transaction_id
                },
                selectionStatus: temp.selectionStatus,
            };

            await Candidature.create(newCandidature);
            console.log(`Callback: Candidature ${depositId} saved successfully.`);

            // Delete Temp Record
            await TempCandidature.deleteOne({ _id: temp._id });
            console.log(`Callback: Temp record ${depositId} deleted.`);

        } else if (['FAILED', 'CANCELLED', 'REJECTED', 'EXPIRED'].includes(status)) {
            console.log(`Callback: Payment ${status} for ${depositId}. Reason: ${failureReason}`);
            await temp.save();
        } else {
            // Intermediate statuses: ACCEPTED, SUBMITTED
            await temp.save();
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
