"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { generateWhatsAppLink, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCartStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construct full address
        const fullAddress = `${formData.address}, ${formData.city} - ${formData.pincode}`;

        // Generate Link
        const link = generateWhatsAppLink(
            formData.name,
            formData.phone,
            fullAddress,
            items,
            getCartTotal()
        );

        // Clear cart (optional: maybe clear after they come back? sticking to request: finalize on WA)
        // Actually, keeping the cart might be better in case they don't send message.
        // But usually for "Order Placed" flow, we might want to clear.
        // Given the requirement "User is redirected to WhatsApp", let's clear it just before or after redirect?
        // Let's NOT clear it automatically so they can retry if WA fails, but maybe show a "Did you order?" modal?
        // For simplicity, let's just redirect.

        window.open(link, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Checkout Details</h1>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold border-b pb-2">Contact Information</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-whatsapp focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    pattern="[0-9]{10}"
                                    className="w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-whatsapp focus:border-transparent outline-none transition-all"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold border-b pb-2">Delivery Address</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <textarea
                                    required
                                    className="w-full p-4 rounded-lg border focus:ring-2 focus:ring-whatsapp focus:border-transparent outline-none transition-all resize-none h-24"
                                    placeholder="Flat No, Building, Street"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-whatsapp focus:border-transparent outline-none transition-all"
                                        placeholder="Mumbai"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        required
                                        pattern="[0-9]{6}"
                                        className="w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-whatsapp focus:border-transparent outline-none transition-all"
                                        placeholder="400001"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mt-6">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total to Pay</span>
                                <span>{formatPrice(getCartTotal())}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                * Payment will be discussed and finalized on WhatsApp after order confirmation.
                            </p>
                        </div>

                        <Button type="submit" size="lg" fullWidth className="gap-2 text-lg">
                            <MessageCircle /> Place Order on WhatsApp
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
