import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./_components/navigation";
import { QueryProvider } from "../../providers/queryProvider";
import { ProductProvider } from "../../providers/productContext";
import { CategoryProvider } from "../../providers/CategoriesContext";
import { Cart } from "./_components/cart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ProductProvider>
            <CategoryProvider>
              <Navigation />
              {children}
            </CategoryProvider>{" "}
            {/* ✅ Wrap the application with ProductProvider */}
          </ProductProvider>
        </QueryProvider>
        <Cart />
      </body>
    </html>
  );
}
