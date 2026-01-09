import Link from 'next/link';
import { BadgeCheck, MessageCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground pt-12 pb-24 md:pb-12 border-t border-border mt-auto">
            <div className="container mx-auto px-4">

                {/* Trust Signals */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-b border-border/40 pb-12">
                    <div className="flex flex-col items-center text-center gap-2">
                        <MessageCircle className="w-8 h-8 text-whatsapp" />
                        <h4 className="font-bold text-sm">WhatsApp Orders</h4>
                        <p className="text-xs text-muted-foreground">Direct & Personal</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-whatsapp" />
                        <h4 className="font-bold text-sm">Trusted Quality</h4>
                        <p className="text-xs text-muted-foreground">Quality Checked</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <RefreshCw className="w-8 h-8 text-whatsapp" />
                        <h4 className="font-bold text-sm">Easy Exchange</h4>
                        <p className="text-xs text-muted-foreground">Hassle-free support</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <BadgeCheck className="w-8 h-8 text-whatsapp" />
                        <h4 className="font-bold text-sm">Verified</h4>
                        <p className="text-xs text-muted-foreground">100% Authentic</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">LUVIS</h3>
                        <p className="text-muted-foreground text-sm">
                            Premium clothing for Men and Boys. Simple. Fast. Trusted.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/shop/men" className="hover:text-whatsapp">Men's Collection</Link></li>
                            <li><Link href="/shop/boys" className="hover:text-whatsapp">Boys' Collection</Link></li>
                            <li><Link href="/cart" className="hover:text-whatsapp">My Cart</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contact</h4>
                        <a href="https://wa.me/91812585107" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-2 hover:text-whatsapp">
                            <MessageCircle size={16} />
                            +91 812585107
                        </a>
                        <p className="text-sm text-muted-foreground">Email: support@luvis.com</p>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
                    <p className="mb-4">
                        &copy; Luvis. All rights reserved.
                    </p>
                    <div className="bg-background border border-border p-4 rounded-lg inline-block text-muted-foreground max-w-lg mx-auto shadow-sm">
                        <p>
                            <strong>Important:</strong> Luvis processes orders via WhatsApp only.
                            No payment gateway is used on this site. Final confirmation happens in chat.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
