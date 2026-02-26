
import axios from 'axios';
import Candidature from '@/models/Candidature';
import TempCandidature from '@/models/TempCandidature';

// Should be env vars in production
const PAWAPAY_BASE_URL = "https://api.pawapay.io";
const PAWAPAY_API_KEY = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIxMDQiLCJtYXYiOiIxIiwiZXhwIjoyMDgyNTUxMzY3LCJpYXQiOjE3NjcwMTg1NjcsInBtIjoiREFGLFBBRiIsImp0aSI6IjkzYmRkNGNkLWExYmQtNGU5ZS1hMDkwLWQxMGUwYmI0YTNjMCJ9.H3wX9zgKidXtKsADSSevGwXHjAlPFPbo7H0KzbwiyXITLcfrltzLdAGqiCdEehjeB4pkQ37d-EJ7pIDEeMBTxg";

export async function checkAndProcessPayment(depositId: string) {
    if (!depositId) throw new Error("depositId required");

    // 1. Check if already in Main
    const existing = await Candidature.findOne({ depositId });
    if (existing) {
        return { status: 'COMPLETED', message: 'Already processed', record: existing };
    }

    // 2. Check API
    let status = 'PENDING';
    let data: any = null;
    let apiError = false;

    try {
        const response = await axios.get(`${PAWAPAY_BASE_URL}/v2/deposits/${depositId}`, {
            headers: {
                'Authorization': `Bearer ${PAWAPAY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        const responseBody = response.data;

        if (responseBody.data?.status) {
            status = responseBody.data.status;
            data = responseBody.data;
        } else if (Array.isArray(responseBody) && responseBody.length > 0) {
            data = responseBody[0];
            status = data.status;
        } else {
            data = responseBody;
            status = data.status;
        }

    } catch (e: any) {
        console.error(`API Check failed for ${depositId}:`, e.message);
        apiError = true;
    }

    // 3. Check Temp Local
    const temp = await TempCandidature.findOne({ depositId });
    if (temp) {
        // If local says COMPLETED (via webhook), trust it
        if (temp.paymentInfo.status === 'COMPLETED' && status !== 'COMPLETED') {
            status = 'COMPLETED';
        }
    } else {
        // No temp record?
        if (status === 'COMPLETED') {
            return { status: 'COMPLETED', warning: 'Payment confirmed but no Temp record found.' };
        }
    }

    // 4. Process
    if (status === 'COMPLETED' && temp) {
        // Move to Main
        const newCandidature = {
            orderId: temp.orderId,
            depositId: temp.depositId,
            personalInfo: temp.personalInfo,
            projectInfo: temp.projectInfo,
            paymentInfo: {
                ...temp.paymentInfo,
                status: 'COMPLETED',
                provider_transaction_id: data?.paymentProviderId || temp.paymentInfo.provider_transaction_id,
                amount: data?.amount || temp.paymentInfo.amount
            },
            selectionStatus: temp.selectionStatus,
        };

        const saved = await Candidature.create(newCandidature);
        await TempCandidature.deleteOne({ _id: temp._id });

        return { status: 'COMPLETED', record: saved };
    } else if (temp) {
        // Update temp status if meaningful
        if (status && status !== temp.paymentInfo.status && status !== 'PENDING') {
            // Don't overwrite if API error
            temp.paymentInfo.status = status;
            await temp.save();
        }
    }

    return { status: status || 'PENDING', apiError };
}
