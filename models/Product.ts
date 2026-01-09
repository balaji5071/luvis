import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    category: 'men' | 'boys';
    subCategory: string;
    brand: string;
    price: number;
    originalPrice: number;
    discount: number;
    images: string[];
    description: string;
    sizes: string[];
    inStock: boolean;
    isFeatured: boolean;
    views: number;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        category: { type: String, enum: ['men', 'boys'], required: true },
        subCategory: { type: String, required: true },
        brand: { type: String, default: 'Luvis' },
        price: { type: Number, required: true },
        originalPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        images: { type: [String], default: [] },
        description: { type: String, required: true },
        sizes: { type: [String], default: [] },
        inStock: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Add text index for search
ProductSchema.index(
    {
        name: 'text',
        brand: 'text',
        subCategory: 'text',
        category: 'text',
        description: 'text'
    },
    {
        weights: {
            name: 10,
            brand: 5,
            subCategory: 3,
            category: 3,
            description: 1
        },
        name: 'TextIndex'
    }
);

// Delete model if it exists to prevent overwrite error in hot reload
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
