import { BrandForm } from '@/components/admin/BrandForm';
import { getBrandById } from '@/lib/data';
import { notFound } from 'next/navigation';

interface EditBrandPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
    const { id } = await params;
    const brand = await getBrandById(id);

    if (!brand) {
        notFound();
    }

    return <BrandForm initialData={brand} isEdit={true} />;
}
