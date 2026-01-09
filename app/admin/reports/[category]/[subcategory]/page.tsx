"use client";

import { useEffect, useState, use } from 'react';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SubCategoryReportPageProps {
    params: Promise<{ category: string; subcategory: string }>;
}

export default function SubCategoryReportPage({ params }: SubCategoryReportPageProps) {
    // Unwrap params using React.use() for future compatibility or await if in async component, 
    // but since we are client component, we receive the promise. 
    // Actually in Next.js 15 client components, params is a promise.
    // Let's use React.use() which is standard for uwrapping promises in render.
    // OR simpler: just use useEffect to unwrap if we want to be safe, or just `use(params)` if React 19/Next 15.
    // Given the environment, let's stick to standard effective handling.

    // NOTE: Next.js 13/14 client components receive params directly as object usually, but Next 15 changed this.
    // To be safe and consistent with the types provided (`Promise<{...}>`), we need to unwrap it.

    const [resolvedParams, setResolvedParams] = useState<{ category: string; subcategory: string } | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stockFilter, setStockFilter] = useState('all');

    useEffect(() => {
        // Unwrap params
        params.then(setResolvedParams);
    }, [params]);

    useEffect(() => {
        if (resolvedParams) {
            fetchProducts();
        }
    }, [resolvedParams]);

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

    if (!resolvedParams || loading) return <div className="p-8">Loading...</div>;

    const { category, subcategory } = resolvedParams;
    const decodedSub = decodeURIComponent(subcategory);

    // Filter by category and subcategory AND user filters
    const subCategoryProducts = products.filter(p => p.category === category && p.subCategory === decodedSub);

    const filteredProducts = subCategoryProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'in_stock' && product.inStock) ||
            (stockFilter === 'out_of_stock' && !product.inStock);

        return matchesSearch && matchesStock;
    });

    const totalStock = subCategoryProducts.length;

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/reports/${category}`} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold capitalize">{decodedSub} Performance</h1>
                    <p className="text-muted-foreground">{category} &gt; {decodedSub}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Package size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Products</span>
                    </div>
                    <p className="text-3xl font-bold">{totalStock}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
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
                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                    <option value="all">All Status</option>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                </select>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold">Product Performance List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Brand</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                                            <span className="line-clamp-1">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                                    <td className="px-6 py-4 text-gray-600">{formatPrice(product.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.inStock
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        {subCategoryProducts.length === 0 ? "No products found in this category." : "No products match your filters."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
