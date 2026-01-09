import { getProducts, getProduct, getSimilarProducts, getBrandByName } from '@/lib/data';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductCard } from '@/components/ProductCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import { ViewTracker } from '@/components/ViewTracker';

export const revalidate = 0;

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

// generateStaticParams removed to avoid build-time DB connection
// export async function generateStaticParams() {
//     const categories = ['men', 'boys'];
//     return categories.map((category) => ({
//         category,
//     }));
// }

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const brand = await getBrandByName(product.brand);
    const similarProducts = await getSimilarProducts(id);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-12">
                <ViewTracker productId={product.id} />
                <div className="container mx-auto px-4 max-w-5xl">
                    <ProductDetail product={product} sizeGuide={brand?.sizeGuide} sizeGuideImage={brand?.sizeGuideImage} />

                    {/* Similar Products Section */}
                    {similarProducts.length > 0 && (
                        <div className="mt-16 pt-16 border-t border-border">
                            <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {similarProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
