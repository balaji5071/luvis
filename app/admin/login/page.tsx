"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';



export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for MVP
        if (password === 'admin123') {
            // Set cookie
            document.cookie = "luvis_admin_auth=true; path=/; max-age=86400"; // 1 day
            router.push('/admin/dashboard');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gray-100 p-3 rounded-full mb-4">
                        <Lock className="text-luvis-black" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Login</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-black outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button fullWidth type="submit">Login</Button>
                </form>
            </div>
        </div>
    );
}
