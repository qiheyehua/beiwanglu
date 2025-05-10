import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNavbar from "@/components/navbar";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "艾宾浩斯记忆助手",
  description: "基于艾宾浩斯遗忘曲线的知识复习工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <MainNavbar />
            
            <main className="flex-grow container mx-auto px-4 py-8 mt-16">
              {children}
            </main>
            
            <footer className="bg-gray-100 py-4 text-center text-gray-600">
              <p>七禾页话的知识复习工具 &copy; {new Date().getFullYear()}</p>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
