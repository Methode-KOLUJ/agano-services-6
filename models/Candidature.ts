
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidature extends Document {
    orderId: string;
    depositId: string;
    personalInfo: {
        fullName: string;
        city: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        age: number;
    };
    projectInfo: {
        sector: string;
        title: string;
        summary: string;
        stage: string;
    };
    paymentInfo: {
        phone: string;
        network: string; // VODACOM, AIRTEL, ORANGE, AFRICELL
        amount: string;
        currency: string;
        status: string; // PENDING, ACCEPTED, FAILED
        provider_transaction_id?: string;
    };
    selectionStatus?: string; // SELECTED, REJECTED, PENDING
    createdAt: Date;
    updatedAt: Date;
}

const CandidatureSchema: Schema = new Schema(
    {
        orderId: { type: String, required: true, unique: true },
        depositId: { type: String, required: true },
        personalInfo: { type: Schema.Types.Mixed, required: true },
        projectInfo: { type: Schema.Types.Mixed, required: true },
        paymentInfo: {
            phone: { type: String, required: true },
            network: { type: String, required: true },
            amount: { type: String, required: true },
            currency: { type: String, required: true },
            status: { type: String, default: 'PENDING' },
            provider_transaction_id: { type: String },
        },
        selectionStatus: { type: String, default: 'PENDING' },
    },
    { timestamps: true }
);

// Prevent overwriting model during hot reload
const Candidature: Model<ICandidature> =
    mongoose.models.Candidature || mongoose.model<ICandidature>('Candidature', CandidatureSchema);

export default Candidature;
