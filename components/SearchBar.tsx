"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Suggestion {
    text: string;
    type: 'brand' | 'product';
    id?: string;
}

export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch suggestions", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setQuery(suggestion.text);
        setShowSuggestions(false);
        router.push(`/search?q=${encodeURIComponent(suggestion.text)}`);
    };

    return (
        <div ref={containerRef} className="relative group w-full">
            <form onSubmit={handleSearch} className="w-full relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search branding, items..."
                    className="w-full h-10 px-4 pl-10 rounded-md bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-foreground pointer-events-none" />
                    )}
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <ul>
                        {suggestions.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleSuggestionClick(item)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between group/item"
                                >
                                    <span className="text-sm text-gray-700 group-hover/item:text-black">
                                        {item.text}
                                    </span>
                                    {item.type === 'brand' && (
                                        <span className="text-[10px] uppercase font-bold text-gray-400 border border-gray-200 px-1 rounded">
                                            Brand
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
