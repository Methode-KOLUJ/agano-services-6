import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Candidature from '@/models/Candidature';

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID is required' },
                { status: 400 }
            );
        }

        const deletedCandidature = await Candidature.findByIdAndDelete(id);

        if (!deletedCandidature) {
            return NextResponse.json(
                { success: false, error: 'Candidature not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: deletedCandidature });
    } catch (error) {
        console.error('Error deleting candidature:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}
