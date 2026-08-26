
import "./globals.css";
import ClientProviders from "./ClientProviders";

export const metadata = {
  title: "ClickeiBazer",
  description: " Clickei Bazer is your trusted online marketplace for groceries, fresh foods, electronics, and more. We ensure quality products and fast delivery at your doorstep.",
  icons: {
    icon: "/clickeiBazer-png.png",
    shortcut: "/clickeiBazer-png.png",
    apple: "/clickeiBazer-png.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main-content" className="sr-only z-[100] rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Skip to main content
        </a>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
