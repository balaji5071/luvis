"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';
import { SUBCATEGORIES, BRANDS } from '@/lib/constants';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ProductFiltersProps {
    initialProducts: Product[];
}

export function ProductFilters({ initialProducts }: ProductFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const initialFilters = useMemo(() => {
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
        const subCategories = searchParams.get('subCategories')?.split(',').filter(Boolean) || [];

        return {
            priceRange: [minPrice ? Number(minPrice) : 0, maxPrice ? Number(maxPrice) : 5000],
            brands,
            subCategories
        };
    }, [searchParams]);

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    // Sync state with URL when filters change (Debounced or direct)
    // using a function to update both state and URL
    const updateFilters = useCallback((newFilters: typeof filters) => {
        setFilters(newFilters);

        const params = new URLSearchParams(searchParams.toString());

        // Price
        if (newFilters.priceRange[0] > 0) params.set('minPrice', newFilters.priceRange[0].toString());
        else params.delete('minPrice');

        if (newFilters.priceRange[1] < 5000) params.set('maxPrice', newFilters.priceRange[1].toString());
        else params.delete('maxPrice');

        // Brands
        if (newFilters.brands.length > 0) params.set('brands', newFilters.brands.join(','));
        else params.delete('brands');

        // SubCategories
        if (newFilters.subCategories.length > 0) params.set('subCategories', newFilters.subCategories.join(','));
        else params.delete('subCategories');

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const products = useMemo(() => {
        return initialProducts.filter(p => {
            const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
            const matchesBrand = filters.brands.length === 0 || (p.brand && filters.brands.includes(p.brand));
            const matchesSub = filters.subCategories.length === 0 || (p.subCategory && filters.subCategories.includes(p.subCategory));

            return matchesPrice && matchesBrand && matchesSub;
        });
    }, [initialProducts, filters]);

    const toggleFilter = (type: 'brands' | 'subCategories', value: string) => {
        const current = filters[type];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        updateFilters({ ...filters, [type]: updated });
    };

    const handlePriceChange = (index: 0 | 1, value: string) => {
        const newRange = [...filters.priceRange];
        newRange[index] = Number(value);
        updateFilters({ ...filters, priceRange: newRange });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar - Mobile Toggle */}
            <button
                className="lg:hidden flex items-center gap-2 border bg-background text-foreground px-4 py-2 rounded-lg self-start"
                onClick={() => setShowFilters(!showFilters)}
            >
                <SlidersHorizontal size={20} /> Filters
            </button>

            {/* Filter Sidebar */}
            <aside className={`
                fixed inset-0 bg-background z-50 p-6 overflow-y-auto transition-transform duration-300 transform
                lg:relative lg:inset-auto lg:translate-x-0 lg:w-64 lg:block lg:border-r lg:border-border lg:pr-6 lg:z-0
                ${showFilters ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setShowFilters(false)}><X size={24} /></button>
                </div>

                <div className="space-y-8">
                    {/* Price Filter */}
                    <div>
                        <h3 className="font-semibold mb-3">Price Range</h3>
                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handlePriceChange(0, e.target.value)}
                                    className="w-20 border rounded px-2 py-1 bg-background text-foreground"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceChange(1, e.target.value)}
                                    className="w-20 border rounded px-2 py-1 bg-background text-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subcategories */}
                    <div>
                        <h3 className="font-semibold mb-3">Categories</h3>
                        <div className="space-y-2">
                            {SUBCATEGORIES.map(sub => (
                                <label key={sub} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.subCategories.includes(sub)}
                                        onChange={() => toggleFilter('subCategories', sub)}
                                        className="rounded border-input bg-background text-primary focus:ring-ring"
                                    />
                                    <span className="text-sm text-foreground">{sub}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Brands */}
                    <div>
                        <h3 className="font-semibold mb-3">Brands</h3>
                        <div className="space-y-2">
                            {BRANDS.map(brand => (
                                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.brands.includes(brand)}
                                        onChange={() => toggleFilter('brands', brand)}
                                        className="rounded border-input bg-background text-primary focus:ring-ring"
                                    />
                                    <span className="text-sm text-foreground">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                <p className="mb-6 text-muted-foreground">Showing {products.length} items</p>
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        No products match your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
