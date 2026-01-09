import { getProductsByCategory } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;

    if (category !== 'men' && category !== 'boys') {
        notFound();
    }

    const categoryProducts = await getProductsByCategory(category);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8 capitalize">{category}'s Collection</h1>
                    <ProductFilters initialProducts={categoryProducts} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
