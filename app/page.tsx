import { getProductsByCategory, getFeaturedProducts } from '@/lib/data';
import { ProductRow } from '@/components/ProductRow';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { ArrowRight } from 'lucide-react';  

export const revalidate = 60; // Cache for 60 seconds

export default async function Home() {
  const menProducts = await getProductsByCategory('men');
  const boysProducts = await getProductsByCategory('boys');
  const bestSellers = await getFeaturedProducts(6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1">
        {/* Simple Hero Banner - Amazon Style */}
        <div className="relative bg-gray-900 text-white">
          {/* Background Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10 pointer-events-none" />
          <div
            className="h-[250px] md:h-[400px] w-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop')" }}
          />

          <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-20 max-w-lg">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Big Savings on Men's Fashion</h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200">Shop the latest trends in clothing, footwear, and accessories.</p>
            <Link href="/shop/men">
              <Button size="lg" className="bg-[#FFD814] text-black hover:bg-[#F7CA00] border-none font-bold">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Rows */}
        <div className="container mx-auto mt-6 relative z-30 px-4 md:px-0">
          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 drop-shadow-sm rounded-sm flex flex-col">
              <h3 className="text-xl font-bold mb-2">Men's Casual Wear</h3>
              <div className="flex-1 relative min-h-[150px] mb-2">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300" alt="Men" className="object-cover w-full h-full" />
              </div>
              <Link href="/shop/men" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">See more</Link>
            </div>
            <div className="bg-white p-4 drop-shadow-sm rounded-sm flex flex-col">
              <h3 className="text-xl font-bold mb-2">Boys' Favorites</h3>
              <div className="flex-1 relative min-h-[150px] mb-2">
                <img src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=300" alt="Boys" className="object-cover w-full h-full" />
              </div>
              <Link href="/shop/boys" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">See more</Link>
            </div>
            <div className="bg-white p-4 drop-shadow-sm rounded-sm flex flex-col">
              <h3 className="text-xl font-bold mb-2">New Arrivals</h3>
              <div className="flex-1 relative min-h-[150px] mb-2">
                <img src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300" alt="New" className="object-cover w-full h-full" />
              </div>
              <Link href="/shop" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">See more</Link>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Rows */}
        <div className="container mx-auto space-y-2 md:space-y-6 pb-10">
          <ProductRow title="Best Sellers in Clothing" products={bestSellers} categoryLink="/shop" />
          <ProductRow title="Recommended for Men" products={menProducts} categoryLink="/shop/men" />
          <ProductRow title="Top Picks for Boys" products={boysProducts} categoryLink="/shop/boys" />
        </div>

      </main>

      <Footer />
    </div>
  );
}
