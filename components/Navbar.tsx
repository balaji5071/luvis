"use client";

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const cartCount = useCartStore((state) => state.getCartCount());
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // If we are on checkout, we might want a simpler navbar, but for now keep it consistent.

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background border-border">
            <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">

                {/* Logo - Text based, strong */}
                <Link href="/" className="text-xl md:text-2xl font-black tracking-tight text-foreground shrink-0">
                    LUVIS
                </Link>

                {/* Search Bar - Amazon style (flex-grow) */}
                <div className="flex-1 max-w-xl mx-4">
                    <SearchBar />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    {/* Desktop Links */}
                    <nav className="hidden md:flex items-center gap-6 mr-4">
                        <Link href="/shop/men" className="text-sm font-medium hover:underline underline-offset-4">
                            Men
                        </Link>
                        <Link href="/shop/boys" className="text-sm font-medium hover:underline underline-offset-4">
                            Boys
                        </Link>
                    </nav>

                    <ThemeToggle />

                    <Link href="/cart" className="relative p-2 text-foreground hover:bg-secondary rounded-full transition-colors">
                        <ShoppingBag size={22} />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-whatsapp text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
