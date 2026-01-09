import { getProducts } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Layers, Eye, Package } from 'lucide-react';

export const revalidate = 0;

interface CategoryReportPageProps {
    params: Promise<{ category: string }>;
}

export default async function CategoryReportPage({ params }: CategoryReportPageProps) {
    const { category } = await params;
    const products = await getProducts();

    // Filter by category
    const categoryProducts = products.filter(p => p.category === category);

    if (categoryProducts.length === 0) {
        notFound(); // Or handle empty state
    }

    // Aggregate data by subCategory
    const subCategoryStats = categoryProducts.reduce((acc, product) => {
        const sub = product.subCategory || 'Uncategorized';
        if (!acc[sub]) {
            acc[sub] = { count: 0, views: 0 };
        }
        acc[sub].count += 1;
        acc[sub].views += (product.views || 0);
        return acc;
    }, {} as Record<string, { count: number; views: number }>);

    const subCategories = Object.keys(subCategoryStats).sort();

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/reports" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold capitalize">{category} Reports</h1>
                    <p className="text-muted-foreground">Select a subcategory to view product performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subCategories.map((sub) => (
                    <Link key={sub} href={`/admin/reports/${category}/${sub}`}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Layers size={24} />
                                </div>
                                <ArrowRight className="text-gray-400 group-hover:text-black transition-colors" />
                            </div>

                            <h2 className="text-xl font-bold capitalize mb-4">{sub}</h2>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Package size={16} />
                                        <span className="text-xs font-medium uppercase">Products</span>
                                    </div>
                                    <p className="text-lg font-bold">{subCategoryStats[sub].count}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
