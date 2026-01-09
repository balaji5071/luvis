import connectToDatabase from './db';
import { Product, IProduct } from '@/models/Product';
import { Brand, IBrand } from '@/models/Brand';
import { Product as ProductType, Brand as BrandType } from './types';

// Helper to transform Mongoose doc to our app type
function transformProduct(doc: any): ProductType {
    if (!doc) return null as any;
    return {
        id: doc._id.toString(),
        name: doc.name,
        category: doc.category,
        subCategory: doc.subCategory || 'General',
        brand: doc.brand || 'Luvis',
        price: doc.price,
        originalPrice: doc.originalPrice,
        discount: doc.discount,
        images: doc.images,
        description: doc.description,
        sizes: doc.sizes,
        inStock: doc.inStock,
        isFeatured: doc.isFeatured,
        views: doc.views || 0,
    };
}

export async function getProducts(): Promise<ProductType[]> {
    try {
        await connectToDatabase();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return products.map(transformProduct).filter(Boolean);
    } catch (error) {
        console.error("Database connection failed:", error);
        return [];
    }
}

export async function getProduct(id: string): Promise<ProductType | undefined> {
    try {
        await connectToDatabase();
        const product = await Product.findById(id);
        return product ? transformProduct(product) : undefined;
    } catch (error) {
        console.error("Database connection failed:", error);
        return undefined;
    }
}

export async function getSimilarProducts(currentProductId: string): Promise<ProductType[]> {
    try {
        await connectToDatabase();
        const product = await Product.findById(currentProductId);
        if (!product) return [];

        const similar = await Product.find({
            _id: { $ne: currentProductId },
            $or: [
                { category: product.category },
                { subCategory: product.subCategory }
            ]
        }).limit(4);

        return similar.map(transformProduct).filter(Boolean);
    } catch (error) {
        console.error("Database connection failed:", error);
        return [];
    }
}

export async function getFeaturedProducts(limit: number = 4): Promise<ProductType[]> {
    try {
        await connectToDatabase();
        const products = await Product.find({ isFeatured: true }).limit(limit).sort({ createdAt: -1 });
        return products.map(transformProduct).filter(Boolean);
    } catch (error) {
        console.error("Database connection failed:", error);
        return [];
    }
}

export async function getProductsByCategory(category: string): Promise<ProductType[]> {
    try {
        await connectToDatabase();
        const products = await Product.find({ category }).sort({ createdAt: -1 });
        return products.map(transformProduct).filter(Boolean);
    } catch (error) {
        console.error("Database connection failed:", error);
        return [];
    }
}

export async function addProduct(product: Omit<ProductType, 'id'>) {
    await connectToDatabase();
    const newProduct = await Product.create(product);
    return transformProduct(newProduct);
}

export async function updateProduct(id: string, updates: Partial<ProductType>) {
    await connectToDatabase();
    try {
        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        return product ? transformProduct(product) : null;
    } catch (error) {
        return null;
    }
}

export async function deleteProduct(id: string) {
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
}
export async function getProductsBySearch(query: string): Promise<ProductType[]> {
    try {
        await connectToDatabase();
        if (!query) return [];

        // 1. Try Text Search (Best for relevance)
        const textResults = await Product.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });

        if (textResults.length > 0) {
            return textResults.map(transformProduct).filter(Boolean);
        }

        // 2. Fallback: Regex Search (Good for partial matches like "shi" -> "shirt")
        const regex = new RegExp(query, 'i');
        const regexResults = await Product.find({
            $or: [
                { name: regex },
                { brand: regex },
                { subCategory: regex },
                { category: regex }
            ]
        }).sort({ createdAt: -1 });

        return regexResults.map(transformProduct).filter(Boolean);

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}

// Brand Helpers
function transformBrand(doc: any): BrandType {
    if (!doc) return null as any;
    return {
        id: doc._id.toString(),
        name: doc.name,
        sizeGuide: doc.sizeGuide ? doc.sizeGuide.map((item: any) => ({
            size: item.size,
            chest: item.chest,
            length: item.length,
            shoulder: item.shoulder,
            sleeve: item.sleeve
        })) : [],
        sizeGuideImage: doc.sizeGuideImage
    };
}

export async function getBrands(): Promise<BrandType[]> {
    try {
        await connectToDatabase();
        // Initialize default brands if empty
        const count = await Brand.countDocuments();
        if (count === 0) {
            const defaultBrands = ['Luvis', 'Nike', 'Adidas', 'Puma', 'Raymond'];
            for (const b of defaultBrands) {
                await Brand.create({ name: b, sizeGuide: [] });
            }
        }

        const brands = await Brand.find({}).sort({ name: 1 });
        return brands.map(transformBrand);
    } catch (error) {
        console.error("Failed to fetch brands:", error);
        return [];
    }
}

export async function getBrandByName(name: string): Promise<BrandType | null> {
    try {
        await connectToDatabase();
        const brand = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        return brand ? transformBrand(brand) : null;
    } catch (error) {
        console.error("Failed to fetch brand:", error);
        return null;
    }
}

export async function getBrandById(id: string): Promise<BrandType | null> {
    try {
        await connectToDatabase();
        const brand = await Brand.findById(id);
        return brand ? transformBrand(brand) : null;
    } catch (error) {
        console.error("Failed to fetch brand:", error);
        return null;
    }
}

export async function updateBrandSizeGuide(id: string, sizeGuide: any[]) {
    try {
        await connectToDatabase();
        const brand = await Brand.findByIdAndUpdate(
            id,
            { sizeGuide },
            { new: true }
        );
        return brand ? transformBrand(brand) : null;
    } catch (error) {
        console.error("Failed to update brand:", error);
        return null;
    }
}
