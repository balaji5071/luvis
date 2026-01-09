import Link from 'next/link';
import { LayoutDashboard, Package, LogOut, ShoppingBag, BarChart2 } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Hidden on mobile for simplicity in MVP, but let's make it responsive later */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">Luvis Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <Package size={20} />
                        Products
                    </Link>
                    <Link href="/admin/brands" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <ShoppingBag size={20} />
                        Brands
                    </Link>
                    <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <BarChart2 size={20} />
                        Reports
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                        <LogOut size={20} />
                        Exit to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {children}
            </div>
        </div>
    );
}
