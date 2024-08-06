import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './ui/Header';
import Footer from './ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex flex-col h-screen">
                    {/* app/ui/topNav.tsx */}
                    <Header />
                    <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
                </div>
                <Footer />
            </body>
        </html>
    );
}
