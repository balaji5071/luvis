"use client";

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Check, ShoppingBag, Truck } from 'lucide-react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ProductDetailProps {
    product: Product;
    sizeGuide?: {
        size: string;
        chest: string;
        length: string;
        shoulder: string;
        sleeve: string;
    }[];
    sizeGuideImage?: string;
}

export function ProductDetail({ product, sizeGuide, sizeGuideImage }: ProductDetailProps) {
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const addToCart = useCartStore((state) => state.addToCart);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!selectedSize) return;

        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: 1,
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Image Gallery (Simplified for now) */}
            <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] relative">
                {/* Using img for local placeholder consistency */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-whatsapp text-white px-3 py-1 rounded-full font-bold">
                        Save {product.discount}%
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                <div className="mb-2 text-sm text-gray-500 uppercase tracking-widest">
                    <span className="font-semibold text-black">{product.brand}</span> • {product.category}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

                <div className="flex items-end gap-4 mb-8">
                    <span className="text-3xl font-bold text-whatsapp">{formatPrice(product.price)}</span>
                    {product.discount > 0 && (
                        <span className="text-xl text-gray-400 line-through mb-1">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Select Size</h3>
                        {(sizeGuide && sizeGuide.length > 0) || sizeGuideImage ? (
                            <button
                                onClick={() => setShowSizeGuide(true)}
                                className="text-xs text-gray-500 underline hover:text-black"
                            >
                                Size Guide
                            </button>
                        ) : null}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-medium transition-all
                  ${selectedSize === size
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 hover:border-black text-black'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {!selectedSize && (
                        <p className="text-red-500 text-sm mt-2">Please select a size</p>
                    )}
                </div>

                <div className="space-y-4 mb-8">
                    <Button
                        size="lg"
                        fullWidth
                        onClick={handleAddToCart}
                        disabled={!selectedSize || isAdded}
                        className={isAdded ? "bg-green-700" : ""}
                    >
                        {isAdded ? (
                            <span className="flex items-center gap-2"><Check size={20} /> Added to Cart</span>
                        ) : (
                            <span className="flex items-center gap-2"><ShoppingBag size={20} /> Add to Cart</span>
                        )}
                    </Button>
                    <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                        <Truck className="text-whatsapp mt-1" size={20} />
                        <div className="text-sm text-gray-600">
                            <p className="font-semibold text-black">Fast Delivery</p>
                            <p>Order via WhatsApp for quick processing and dispatch.</p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-sm text-gray-600">
                    <h3 className="text-black font-semibold mb-2">Description</h3>
                    <p>{product.description}</p>
                </div>
            </div>

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowSizeGuide(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black z-10"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Size Guide ({product.brand})</h2>
                        <p className="text-sm text-gray-500 mb-6">Following measurements are brand standard.</p>

                        {sizeGuideImage ? (
                            <div className="w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={sizeGuideImage} alt="Size Guide" className="w-full h-auto rounded-lg" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium">Size</th>
                                            <th className="px-4 py-2 text-left font-medium">Chest</th>
                                            <th className="px-4 py-2 text-left font-medium">Length</th>
                                            <th className="px-4 py-2 text-left font-medium">Shoulder</th>
                                            <th className="px-4 py-2 text-left font-medium">Sleeve</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {sizeGuide?.map((row, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-medium">{row.size}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.chest || '-'}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.length || '-'}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.shoulder || '-'}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.sleeve || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
