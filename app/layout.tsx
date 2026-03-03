import type { Metadata } from 'next';
import './globals.css';
import { VehicleProvider } from '@/lib/context/VehicleContext';
import { CartProvider } from '@/lib/context/CartContext';

export const metadata: Metadata = {
  title: 'AutoGenius — AI Auto Intelligence Platform',
  description: 'The all-in-one platform for every US car owner. Find parts, diagnose problems, book mechanics, and get repair guides.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VehicleProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </VehicleProvider>
      </body>
    </html>
  );
}
