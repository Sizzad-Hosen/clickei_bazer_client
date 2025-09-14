
import "./globals.css";
import ClientProviders from "./ClientProviders";

export const metadata = {
  title: "ClickeiBazer",
  description: " Clickei Bazer is your trusted online marketplace for groceries, fresh foods, electronics, and more. We ensure quality products and fast delivery at your doorstep.",
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
