import { getProducts } from '@/lib/data';
import Link from 'next/link';
import { ArrowRight, Layers, Eye, Package } from 'lucide-react';

export const revalidate = 0;

export default async function ReportsPage() {
    const products = await getProducts();

    // Aggregate data by category
    const categoryStats = products.reduce((acc, product) => {
        const cat = product.category;
        if (!acc[cat]) {
            acc[cat] = { count: 0, views: 0 };
        }
        acc[cat].count += 1;
        acc[cat].views += (product.views || 0);
        return acc;
    }, {} as Record<string, { count: number; views: number }>);

    const categories = Object.keys(categoryStats);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-8">Reports & Analytics</h1>
            <p className="text-muted-foreground mb-8">Select a category to view detailed performance reports.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                    <Link key={cat} href={`/admin/reports/${cat}`}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                                    <Layers size={24} />
                                </div>
                                <ArrowRight className="text-gray-400 group-hover:text-black transition-colors" />
                            </div>

                            <h2 className="text-xl font-bold capitalize mb-4">{cat}</h2>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Package size={16} />
                                        <span className="text-xs font-medium uppercase">Products</span>
                                    </div>
                                    <p className="text-lg font-bold">{categoryStats[cat].count}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
