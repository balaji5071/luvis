import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Product } from '@/models/Product';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await connectToDatabase();
        // Use $inc which works even if field doesn't exist (treats as 0)
        // But also explicitly set default if missing to be safe? No, $inc is fine.
        const updated = await Product.findByIdAndUpdate(
            productId,
            { $inc: { views: 1 } },
            { new: true }
        );

        return NextResponse.json({ success: true, views: updated?.views });
    } catch (error) {
        console.error('Failed to track view:', error);
        return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }
}
