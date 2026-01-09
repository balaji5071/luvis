"use client";

import { useEffect, useState } from 'react';
import { Brand } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands', { cache: 'no-store' });
            const data = await res.json();
            setBrands(data);
        } catch (error) {
            console.error('Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading brands...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Brands</h1>
                <Link href="/admin/brands/new">
                    <Button className="flex items-center gap-2">
                        <Plus size={20} /> Add Brand
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 font-medium text-gray-500">Name</th>
                            <th className="text-left px-6 py-4 font-medium text-gray-500">Size Guide Configured</th>
                            <th className="text-right px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredBrands.map((brand) => (
                            <tr key={brand.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-black font-medium">{brand.name}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {brand.sizeGuide && brand.sizeGuide.length > 0 ? (
                                        <span className="text-green-600 font-medium">Yes ({brand.sizeGuide.length} sizes)</span>
                                    ) : (
                                        <span className="text-gray-400">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/brands/${brand.id}`}>
                                        <Button variant="ghost" size="sm">
                                            <Edit size={16} />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {filteredBrands.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                    {brands.length === 0 ? "No brands found." : "No brands match your search."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
