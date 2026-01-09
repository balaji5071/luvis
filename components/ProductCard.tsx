import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`} className="group block h-full flex flex-col bg-card border border-transparent hover:border-border rounded-lg transition-all p-2">

            {/* Image Container - Maximized */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary mb-2">
                {/* Discount Badge - Amazon style (Red or Green, usually Red for deal, but Green for our theme) */}
                {product.discount > 0 && (
                    <span className="absolute top-0 left-0 bg-[#CC0C39] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-br-md z-10">
                        {product.discount}% off
                    </span>
                )}

                {/* Image */}
                <div className="h-full w-full">
                    {/* Placeholder or Image */}
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted">
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col gap-1">
                {/* Brand */}
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {product.brand}
                </span>

                {/* Title */}
                <h3 className="font-medium text-sm sm:text-base text-foreground line-clamp-2 leading-tight group-hover:text-[#C7511F] transition-colors">
                    {product.name}
                </h3>

                {/* Price Section */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-foreground">
                            {formatPrice(product.price)}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                                M.R.P: {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>


                    {/* Stock Status */}
                    {product.inStock ? (
                        <div className="text-[10px] sm:text-xs text-green-600 font-medium mt-0.5">
                            In Stock.
                        </div>
                    ) : (
                        <div className="text-[10px] sm:text-xs text-red-600 font-medium mt-0.5">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Mobile-First Add Button */}
                <button
                    disabled={!product.inStock}
                    className={`mt-2 w-full text-sm font-medium py-1.5 rounded-full shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-transform ${product.inStock
                        ? 'bg-[#FFD814] hover:bg-[#F7CA00] text-black'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                >
                    <ShoppingCart size={14} className={product.inStock ? "fill-black" : ""} />
                    {product.inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
            </div>
        </Link>
    );
}
