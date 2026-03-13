
import "./globals.css";
import ClientProviders from "./ClientProviders";

export const metadata = {
   metadataBase: new URL('https://clickeibazar.com'),
  title: "ClickeiBazer",
  description: "Your trusted online marketplace...",
  openGraph: {
    title: "ClickeiBazer",
    description: "Buy groceries, electronics, and more online.",
    url: "https://clickeibazer.com",
    siteName: "ClickeiBazer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClickeiBazer Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickeiBazer",
    description: "Online marketplace for groceries, electronics, and more.",
    images: ["/og-image.png"],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* ClientProviders must wrap children */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
