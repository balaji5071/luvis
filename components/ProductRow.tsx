import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import Link from 'next/link';

interface ProductRowProps {
    title: string;
    products: Product[];
    categoryLink?: string;
}

export const ProductRow: React.FC<ProductRowProps> = ({ title, products, categoryLink }) => {
    return (
        <div className="py-4 bg-white mb-2 p-4">
            <div className="flex items-center justify-between mb-3 px-4 md:px-0 container mx-auto">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">{title}</h2>
                {categoryLink && (
                    <Link href={categoryLink} className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
                        See more
                    </Link>
                )}
            </div>

            <div className="relative container mx-auto">
                <div className="flex overflow-x-auto pb-4 gap-4 px-4 md:px-0 scrollbar-hide snap-x">
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[160px] md:min-w-[200px] snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
