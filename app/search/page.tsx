import { getProductsBySearch } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const revalidate = 0;

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';

    const filteredProducts = await getProductsBySearch(query);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Search Results for "{q}"</h1>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            No products found matching your search.
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
