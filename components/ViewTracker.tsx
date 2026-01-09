"use client";

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
    productId: string;
}

export function ViewTracker({ productId }: ViewTrackerProps) {
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;
        tracked.current = true;

        const trackView = async () => {
            try {
                await fetch('/api/view-product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId }),
                });
            } catch (error) {
                console.error("View tracking failed", error);
            }
        };

        trackView();
    }, [productId]);

    return null;
}
