import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Candidature from '@/models/Candidature';

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const { id, status } = await req.json();

        // Update selectionStatus directly
        const updatedCandidature = await Candidature.findByIdAndUpdate(
            id,
            { selectionStatus: status },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updatedCandidature });
    } catch (error) {
        console.error('Error updating candidature:', error);
        return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
}
