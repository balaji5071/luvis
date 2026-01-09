"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [brandFilter, setBrandFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products', { cache: 'no-store' });
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id));
                router.refresh();
            }
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    // Get unique brands
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort();

    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesStock = stockFilter === 'all' ||
                (stockFilter === 'in_stock' && product.inStock) ||
                (stockFilter === 'out_of_stock' && !product.inStock);
            const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;

            return matchesSearch && matchesCategory && matchesStock && matchesBrand;
        })
        .sort((a, b) => {
            if (sortOrder === 'price_low') return a.price - b.price;
            if (sortOrder === 'price_high') return b.price - a.price;
            // Default newest (assuming higher ID or insert order is newer, or just keep list order)
            // If explicit date field exists use that, otherwise reverse list for "newest" if default is oldest?
            // For now, let's assume default order is acceptable or just don't sort.
            return 0;
        });

    if (loading) return <div className="p-8">Loading products...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus size={20} /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="all">All Categories</option>
                        <option value="men">Men</option>
                        <option value="boys">Boys</option>
                    </select>

                    <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="all">All Brands</option>
                        {uniqueBrands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>

                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="all">All Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="newest">Sort: Newest</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Image</th>
                            <th className="p-4 font-semibold text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-gray-600">Brand</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Price</th>
                            <th className="p-4 font-semibold text-gray-600">Stock</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredAndSortedProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4 text-gray-600">{product.brand}</td>
                                <td className="p-4 capitalize">{product.category}</td>
                                <td className="p-4">
                                    {product.discount > 0 ? (
                                        <div>
                                            <span className="text-green-600 font-bold">{formatPrice(product.price)}</span>
                                            <span className="text-xs text-gray-400 block line-through">{formatPrice(product.originalPrice)}</span>
                                        </div>
                                    ) : (
                                        formatPrice(product.price)
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link href={`/admin/products/${product.id}`}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Edit size={16} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No products found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
