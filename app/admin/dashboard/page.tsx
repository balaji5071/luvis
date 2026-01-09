import { getProducts, getBrands } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import { Package, ShoppingBag, Layers, AlertCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function AdminDashboard() {
    const products = await getProducts();
    const brands = await getBrands();

    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.inStock).length;
    const menProducts = products.filter(p => p.category === 'men').length;
    const boysProducts = products.filter(p => p.category === 'boys').length;
    const totalBrands = brands.length;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Package size={24} />
                        </div>
                        <span className="text-sm font-medium text-foreground">Total Products</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{totalProducts}</p>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-sm font-medium text-foreground">In Stock</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{inStockProducts}</p>
                    <span className="text-xs text-muted-foreground">{totalProducts - inStockProducts} Out of stock</span>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Tag size={24} />
                        </div>
                        <span className="text-sm font-medium text-foreground">Total Brands</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{totalBrands}</p>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                            <Layers size={24} />
                        </div>
                        <span className="text-sm font-medium text-foreground">Categories</span>
                    </div>
                    <div className="flex gap-4 text-sm mt-1">
                        <span className="font-semibold">{menProducts} Men</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="font-semibold">{boysProducts} Boys</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="flex flex-col gap-3">
                    <Link href="/admin/products/new">
                        <Button size="lg" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" /> Add New Product
                        </Button>
                    </Link>
                    <Link href="/admin/brands/new">
                        <Button variant="outline" size="lg" className="w-full justify-start">
                            <Tag className="mr-2 h-4 w-4" /> Add New Brand
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="outline" size="lg" className="w-full justify-start">
                            <ShoppingBag className="mr-2 h-4 w-4" /> Manage Inventory
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
