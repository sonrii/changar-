import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('54')) {
    return cleaned;
  }
  if (cleaned.startsWith('9')) {
    return `54${cleaned}`;
  }
  return `549${cleaned}`;
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const formatted = formatWhatsAppNumber(phone);
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${formatted}${encodedMessage}`;
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 1 ? 'Hace un momento' : `Hace ${minutes} minutos`;
    }
    return hours === 1 ? 'Hace 1 hora' : `Hace ${hours} horas`;
  }
  
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  
  return date.toLocaleDateString('es-AR', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
