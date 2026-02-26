import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Candidature from '@/models/Candidature';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const candidatures = await Candidature.find({})
            .sort({ createdAt: -1 })
            .lean();

        console.log('Fetched candidatures count:', candidatures.length);

        // Calculate age for records that don't have it
        const candidaturesWithAge = candidatures.map(c => {
            if (!c.personalInfo.age && c.personalInfo.dateOfBirth) {
                const dobString = c.personalInfo.dateOfBirth;
                const parts = dobString.split('-');
                if (parts.length === 3 && parts[0].length === 4) {
                    const year = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1;
                    const day = parseInt(parts[2]);

                    const today = new Date();
                    let age = today.getFullYear() - year;
                    const m = today.getMonth() - month;
                    if (m < 0 || (m === 0 && today.getDate() < day)) {
                        age--;
                    }
                    c.personalInfo.age = age > 0 ? age : 0;
                }
            }
            return c;
        });

        if (candidaturesWithAge.length > 0) {
            console.log('First candidature personalInfo:', candidaturesWithAge[0].personalInfo);
            console.log('First candidature age:', candidaturesWithAge[0].personalInfo?.age);
        }

        return NextResponse.json({ success: true, data: candidaturesWithAge });
    } catch (error) {
        console.error('Error fetching candidatures:', error);
        return NextResponse.json({ success: false, error: 'Erreur lors de la récupération des données' }, { status: 500 });
    }
}
