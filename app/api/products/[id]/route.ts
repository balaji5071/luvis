import { NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+
) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updatedProduct = await updateProduct(id, body);

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ message: 'Product deleted' });
}
