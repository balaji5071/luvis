import { NextResponse } from 'next/server';
import { getBrands } from '@/lib/data';
import { Brand } from '@/models/Brand';
import connectToDatabase from '@/lib/db';

export async function GET() {
    try {
        const brands = await getBrands();
        return NextResponse.json(brands);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Validation
        if (!body.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const existingBrand = await Brand.findOne({ name: body.name });
        if (existingBrand) {
            return NextResponse.json({ error: 'Brand already exists' }, { status: 400 });
        }

        const newBrand = await Brand.create({
            name: body.name,
            sizeGuide: body.sizeGuide || [],
            sizeGuideImage: body.sizeGuideImage
        });

        return NextResponse.json({
            id: newBrand._id.toString(),
            name: newBrand.name,
            sizeGuide: newBrand.sizeGuide,
            sizeGuideImage: newBrand.sizeGuideImage
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
    }
}
