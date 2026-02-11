import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "먹이",
};

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { Footer, FooterProvider } from "@/components/modules/Footer";
import { Header, HeaderProvider } from "@/components/modules/Header";
import { FooterController } from "@/components/modules/Footer/FooterController";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col max-w-[430px] mx-auto shadow-2xl border-x`}
            >
                <AuthProvider>
                    <QueryProvider>
                        <Toaster position="top-center" richColors />
                        <HeaderProvider>
                            <FooterProvider>
                                <div className="h-screen flex flex-col overflow-hidden bg-white">
                                    <FooterController />
                                    <Header />
                                    <main className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
                                        {children}
                                    </main>
                                    <Footer />
                                </div>
                            </FooterProvider>
                        </HeaderProvider>
                    </QueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

