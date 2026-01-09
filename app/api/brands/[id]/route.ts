import { NextResponse } from 'next/server';
import { Brand } from '@/models/Brand';
import connectToDatabase from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        // Check if exists
        const brand = await Brand.findById(id);
        if (!brand) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        // Update fields
        // Usually we only update sizeGuide, but maybe name too if needed (though name changes might break products linked by string name)
        // Ideally products would link by ID, but currently they link by string. So name change needs propagation or restriction.
        // For now, restrict name change or warn user. Let's allow updating sizeGuide primarily.

        if (body.sizeGuide) {
            brand.sizeGuide = body.sizeGuide;
        }

        if (body.sizeGuideImage !== undefined) {
            brand.sizeGuideImage = body.sizeGuideImage;
        }

        // If name changes, we theoretically should update all products, but that's complex. 
        // Let's assume name is immutable for this MVP or handled carefully.

        await brand.save();

        return NextResponse.json({
            id: brand._id.toString(),
            name: brand.name,
            sizeGuide: brand.sizeGuide,
            sizeGuideImage: brand.sizeGuideImage
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        await Brand.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
    }
}
