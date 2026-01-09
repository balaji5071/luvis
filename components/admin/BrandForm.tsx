"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brand } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface BrandFormProps {
    initialData?: Brand;
    isEdit?: boolean;
}

export function BrandForm({ initialData, isEdit = false }: BrandFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Default size guide template if empty
    const defaultGuide = [
        { size: 'S', chest: '', length: '', shoulder: '', sleeve: '' },
        { size: 'M', chest: '', length: '', shoulder: '', sleeve: '' },
        { size: 'L', chest: '', length: '', shoulder: '', sleeve: '' },
        { size: 'XL', chest: '', length: '', shoulder: '', sleeve: '' },
        { size: 'XXL', chest: '', length: '', shoulder: '', sleeve: '' },
    ];

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        sizeGuideImage: initialData?.sizeGuideImage,
        sizeGuide: initialData?.sizeGuide && initialData.sizeGuide.length > 0
            ? initialData.sizeGuide
            : defaultGuide
    });

    const handleGuideChange = (index: number, field: string, value: string) => {
        const newGuide = [...formData.sizeGuide];
        // @ts-ignore
        newGuide[index][field] = value;
        setFormData({ ...formData, sizeGuide: newGuide });
    };

    const addRow = () => {
        setFormData({
            ...formData,
            sizeGuide: [...formData.sizeGuide, { size: '', chest: '', length: '', shoulder: '', sleeve: '' }]
        });
    };

    const removeRow = (index: number) => {
        const newGuide = formData.sizeGuide.filter((_, i) => i !== index);
        setFormData({ ...formData, sizeGuide: newGuide });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit && initialData ? `/api/brands/${initialData.id}` : '/api/brands';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save brand');
            }

            router.push('/admin/brands');
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Error saving brand');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/brands" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">{isEdit ? 'Edit Brand' : 'Add New Brand'}</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Brand Name</label>
                    <input
                        type="text"
                        required
                        disabled={isEdit} // Prevent name change on edit to keep things simple for now
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none text-black ${isEdit ? 'bg-gray-100' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Nike"
                    />
                    {isEdit && <p className="text-xs text-gray-500 mt-1">Brand name cannot be changed once created.</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Size Guide Image (Optional)</label>
                    <p className="text-xs text-gray-500 mb-2">Upload an image of the size guide instead of using the table below.</p>

                    {formData.sizeGuideImage ? (
                        <div className="relative w-full max-w-sm aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formData.sizeGuideImage} alt="Size Guide" className="w-full h-full object-contain" />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, sizeGuideImage: undefined })}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black hover:bg-gray-50 transition-colors relative">
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    if (!file.type.startsWith('image/')) {
                                        alert('Please upload an image file');
                                        return;
                                    }

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
                                            sizeGuideImage: data.url
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

            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <h2 className="font-semibold text-lg border-b pb-2 text-black">Size Guide Table</h2>
                <p className="text-sm text-gray-500">Define measurement values (in inches/cm) for each size.</p>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-4 py-3">Size</th>
                                <th className="px-4 py-3">Chest</th>
                                <th className="px-4 py-3">Length</th>
                                <th className="px-4 py-3">Shoulder</th>
                                <th className="px-4 py-3">Sleeve</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {formData.sizeGuide.map((row, index) => (
                                <tr key={index}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={row.size}
                                            onChange={(e) => handleGuideChange(index, 'size', e.target.value)}
                                            className="w-full border rounded px-2 py-1 text-black"
                                            placeholder="Label"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={row.chest}
                                            onChange={(e) => handleGuideChange(index, 'chest', e.target.value)}
                                            className="w-full border rounded px-2 py-1 text-black"
                                            placeholder="Value"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={row.length}
                                            onChange={(e) => handleGuideChange(index, 'length', e.target.value)}
                                            className="w-full border rounded px-2 py-1 text-black"
                                            placeholder="Value"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={row.shoulder}
                                            onChange={(e) => handleGuideChange(index, 'shoulder', e.target.value)}
                                            className="w-full border rounded px-2 py-1 text-black"
                                            placeholder="Value"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={row.sleeve}
                                            onChange={(e) => handleGuideChange(index, 'sleeve', e.target.value)}
                                            className="w-full border rounded px-2 py-1 text-black"
                                            placeholder="Value"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Remove Row"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Button type="button" variant="outline" onClick={addRow} className="w-full border-dashed">
                    <Plus size={16} className="mr-2" /> Add Size Row
                </Button>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <Link href="/admin/brands">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : isEdit ? 'Update Brand' : 'Create Brand'}
                </Button>
            </div>
        </form>
    );
}
