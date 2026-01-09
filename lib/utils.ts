import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "./store";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
}

export function generateWhatsAppLink(
    customerName: string,
    phoneNumber: string,
    address: string,
    items: CartItem[],
    total: number
) {
    const adminNumber = "91812585107";

    let message = `*New Order from Luvis*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${phoneNumber}\n`;
    message += `Address: ${address}\n\n`;

    message += `*Order Items:*\n`;
    items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.size}) x ${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });

    message += `\n*Total Order Value: ${formatPrice(total)}*`;
    message += `\n\nI would like to confirm this order.`;

    return `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
}
