"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
    const [newSize, setNewSize] = useState('');

    const [formData, setFormData] = useState<Partial<Product>>(initialData || {
        name: '',
        category: 'men',
        subCategory: '',
        brand: 'Luvis',
        price: 0,
        originalPrice: 0,
        discount: 0,
        description: '',
        images: [], // Start empty
        inStock: true,
        isFeatured: false,
    });

    const handleSizeAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSize && !sizes.includes(newSize)) {
            setSizes([...sizes, newSize]);
            setNewSize('');
        }
    };

    const removeSize = (sizeToRemove: string) => {
        setSizes(sizes.filter(s => s !== sizeToRemove));
    };

    const calculatePrice = (original: number, discount: number) => {
        if (!original) return 0;
        return Math.round(original - (original * discount / 100));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === 'originalPrice' || name === 'discount') {
            const originalPrice = name === 'originalPrice' ? Number(value) : Number(formData.originalPrice || 0);
            const discount = name === 'discount' ? Number(value) : Number(formData.discount || 0);
            const price = calculatePrice(originalPrice, discount);

            setFormData(prev => ({
                ...prev,
                [name]: Number(value),
                price: price
            }));
        } else if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out empty strings from images (though upload handles this mostly)
            const cleanedImages = formData.images?.filter(url => url.trim() !== '') || [];

            // If no images, use placeholder to avoid breaking UI that expects [0]
            const finalImages = cleanedImages.length > 0 ? cleanedImages : ['/placeholder.jpg'];

            const payload = { ...formData, sizes, images: finalImages };
            const url = isEdit ? `/api/products/${initialData?.id}` : '/api/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save product');
            }

            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h2 className="font-semibold text-lg border-b pb-2">Basic Info</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Category</label>
                            <select
                                name="category"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black"
                                value={formData.category} // @ts-ignore
                                onChange={handleChange}
                            >
                                <option value="men">Men</option>
                                <option value="boys">Boys</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Sub Category</label>
                            <select
                                name="subCategory"
                                required
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black"
                                value={formData.subCategory}
                                onChange={handleChange}
                            >
                                <option value="">Select Subcategory</option>
                                {['Pants', 'Shirts', 'T-Shirts', 'Daily Wear', 'Formals', 'Shorts', 'Tracks', 'Accessories'].map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                placeholder="e.g. Luvis, Nike"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black"
                                value={formData.brand}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none resize-none text-black"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h2 className="font-semibold text-lg border-b pb-2">Pricing & Inventory</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Original Price</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    min="0"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black"
                                    value={formData.discount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-black">Final Price (Auto-calculated)</label>
                            <input
                                type="number"
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-black font-bold"
                                value={formData.price}
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={formData.inStock}
                                    // @ts-ignore
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-whatsapp"
                                />
                                <span className="text-sm font-medium text-black">In Stock</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    // @ts-ignore
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-whatsapp"
                                />
                                <span className="text-sm font-medium text-black">Featured Product</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h2 className="font-semibold text-lg border-b pb-2 text-black">Sizes</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add size (e.g. XL, 32)"
                                className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleSizeAdd}
                                className="bg-black text-white px-4 rounded-lg hover:bg-gray-800"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <span key={size} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium flex items-center gap-2">
                                    {size}
                                    <button type="button" onClick={() => removeSize(size)} className="text-gray-400 hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            {sizes.length === 0 && <p className="text-sm text-black">No sizes added yet.</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h2 className="font-semibold text-lg border-b pb-2 text-black">Product Images</h2>
                        <p className="text-xs text-black mb-2">Upload up to 4 images (PNG, JPG).</p>

                        <div className="grid grid-cols-2 gap-4">
                            {(formData.images || []).map((url, index) => (
                                <div key={index} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = formData.images?.filter((_, i) => i !== index);
                                            setFormData({ ...formData, images: newImages });
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}

                            {(formData.images?.length || 0) < 4 && (
                                <label className="flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-whatsapp hover:bg-green-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            // Ensure it's an image
                                            if (!file.type.startsWith('image/')) {
                                                alert('Please upload an image file');
                                                return;
                                            }

                                            // Show loading state (could be improved)
                                            // const originalText = e.target.parentElement?.innerText;

                                            try {
                                                const formDataUpload = new FormData();
                                                formDataUpload.append('file', file);

                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formDataUpload,
                                                });

                                                if (!res.ok) {
                                                    const errorData = await res.json();
                                                    throw new Error(errorData.error || 'Upload failed');
                                                }
                                                const data = await res.json();

                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: [...(prev.images || []), data.url]
                                                }));
                                            } catch (error: any) {
                                                alert(error.message || 'Failed to upload image');
                                            }
                                        }}
                                    />
                                    <Plus className="text-gray-400 mb-2" size={32} />
                                    <span className="text-sm text-black">Upload Image</span>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <Link href="/admin/products">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
