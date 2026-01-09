import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Product } from '@/models/Product';
import { Brand } from '@/models/Brand';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        const secret = process.env.CRON_SECRET || 'luvis_cron_secret';

        // Simple security check
        if (key !== secret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log("Starting Optimization Cron Job...");
        await connectToDatabase();

        // 1. Database Indexing Optimization
        // Ensure queries for search, filtering, and sorting are fast
        const productIndexes = [
            { key: { name: 'text', description: 'text', brand: 'text', category: 'text' }, name: 'TextSearchIndex' },
            { key: { category: 1 }, name: 'CategoryIndex' },
            { key: { brand: 1 }, name: 'BrandIndex' },
            { key: { views: -1 }, name: 'ViewsIndex' },
            { key: { price: 1 }, name: 'PriceIndex' },
            { key: { createdAt: -1 }, name: 'CreatedAtIndex' },
            { key: { inStock: 1 }, name: 'StockIndex' }
        ];

        for (const idx of productIndexes) {
            try {
                // @ts-ignore
                await Product.collection.createIndex(idx.key, { background: true });
            } catch (e: any) {
                // Ignore "Index already exists" errors
                if (e.code !== 85) { // 85 is IndexOptionsConflict in Mongo, but just logging is safest
                    console.log(`Index ${idx.name} skipped/exists:`, e.message);
                }
            }
        }

        try {
            await Brand.collection.createIndex({ name: 1 }, { background: true });
        } catch (e: any) {
            console.log("Brand index skipped:", e.message);
        }

        console.log("Database Indexes Optimized.");

        // 2. Cache Warming / Keep-Alive
        // Fetch key pages to keep serverless functions warm
        // We use the origin from the request to know where to ping
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;

        const pathsToWarm = ['/', '/shop/men', '/shop/boys', '/admin/products'];

        // Fire and forget warm-up requests (don't await them all to keep cron fast)
        pathsToWarm.forEach(path => {
            fetch(`${baseUrl}${path}`).catch(err => console.error(`Warmup failed for ${path}`, err));
        });

        console.log(`Cache warming triggered for ${pathsToWarm.length} paths.`);

        return NextResponse.json({
            success: true,
            message: 'Optimization complete',
            indexesCreated: productIndexes.length + 1,
            warmupTriggered: true
        });

    } catch (error: any) {
        console.error("Cron Job Failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
