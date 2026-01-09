import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Product } from '@/models/Product';
import { Brand } from '@/models/Brand';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        await connectToDatabase();

        const regex = new RegExp(query, 'i');

        // Search Brands
        const brands = await Brand.find({ name: regex }).limit(3).select('name');

        // Search Products (names)
        const products = await Product.find({
            $or: [
                { name: regex },
                { category: regex },
                { subCategory: regex }
            ]
        }).limit(5).select('name category brand');

        const suggestions = [
            ...brands.map(b => ({ text: b.name, type: 'brand' })),
            ...products.map(p => ({ text: p.name, type: 'product', id: p._id }))
        ].slice(0, 8); // Limit total suggestions

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error('Search suggestion error:', error);
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
