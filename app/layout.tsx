import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: {
    template: '%s | Tickets',
    default: 'Metro Parques Dashboard',
  },
  description: 'Sistema de Tickets',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="es">
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
