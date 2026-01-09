export type Product = {
    id: string;
    name: string;
    category: 'men' | 'boys';
    subCategory: string;
    brand: string;
    price: number;
    originalPrice: number;
    discount: number;
    images: string[];
    description: string;
    sizes: string[];
    inStock: boolean;
    isFeatured: boolean;
    views: number;
};

export type Brand = {
    id: string;
    name: string;
    sizeGuide: {
        size: string;
        chest: string;
        length: string;
        shoulder: string;
        sleeve: string;
    }[];
    sizeGuideImage?: string;
};
