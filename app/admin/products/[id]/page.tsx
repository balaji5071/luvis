import { ProductForm } from '@/components/admin/ProductForm';
import { getProduct } from '@/lib/data';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return <ProductForm initialData={product} isEdit />;
}
