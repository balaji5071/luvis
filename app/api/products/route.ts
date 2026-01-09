import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/data';

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // MongoDB generates ID automatically
        const { id, ...productData } = body;
        const newProduct = await addProduct(productData);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
    }
}
