import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    sizeGuide: {
        size: string;
        chest: string;
        length: string;
        shoulder: string;
        sleeve: string;
    }[];
    sizeGuideImage?: string;
}

const BrandSchema = new Schema<IBrand>(
    {
        name: { type: String, required: true, unique: true },
        sizeGuideImage: { type: String },
        sizeGuide: [{
            size: { type: String, required: true },
            chest: { type: String, default: '' },
            length: { type: String, default: '' },
            shoulder: { type: String, default: '' },
            sleeve: { type: String, default: '' }
        }]
    },
    { timestamps: true }
);

export const Brand = mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
