"use client";

import Link from 'next/link';
import { Home, Shirt, User, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export function MobileBottomNav() {
    const pathname = usePathname();
    const cartCount = useCartStore((state) => state.getCartCount());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        {
            label: 'Home',
            href: '/',
            icon: Home
        },
        {
            label: 'Men',
            href: '/shop/men',
            icon: Shirt
        },
        {
            label: 'Boys',
            href: '/shop/boys',
            icon: User
        },
        {
            label: 'Cart',
            href: '/cart',
            icon: ShoppingCart,
            badge: true
        }
    ];

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden block">
            <div className="grid h-full grid-cols-4 mx-auto font-medium">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 group transition-colors",
                                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="relative">
                                <Icon
                                    className={cn("w-6 h-6 mb-1", isActive && "fill-current")}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {item.badge && mounted && cartCount > 0 && (
                                    <div className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-whatsapp rounded-full border-2 border-background">
                                        {cartCount}
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
