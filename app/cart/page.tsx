"use client";

import { useCartStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                    {items.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-xl">
                            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                            <Link href="/">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="md:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.size}`} className="flex gap-4 p-4 border rounded-xl bg-white hover:shadow-sm transition-shadow">
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium text-lg">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.productId, item.size)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                                <p className="font-semibold">{formatPrice(item.price)}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border rounded-lg">
                                                    <button
                                                        className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                        onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        className="p-1 hover:bg-gray-100"
                                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>  

                            {/* Order Summary */}
                            <div className="md:col-span-1">
                                <div className="bg-gray-50 p-6 rounded-xl sticky top-24">
                                    <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">{formatPrice(getCartTotal())}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery</span>
                                            <span className="text-green-600 font-medium">Free</span>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Total</span>
                                            <span className="text-xl font-bold">{formatPrice(getCartTotal())}</span>
                                        </div>
                                    </div>

                                    <Link href="/checkout" className="block">
                                        <Button fullWidth size="lg">Proceed to Checkout</Button>
                                    </Link>
                                    <div className="mt-4 text-center">
                                        <Link href="/" className="text-sm text-gray-500 hover:underline inline-flex items-center gap-1">
                                            <ArrowLeft size={16} /> Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
