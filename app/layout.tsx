import type { Metadata } from "next";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://gabbyignacio7.github.io"),
  title: "Product Delivery Dashboard",
  description:
    "One executive view of sprint health, roadmap, engineering capacity, blockers and sales pipeline. Synthetic data.",
  icons: { icon: `${base}/favicon.png` },
  openGraph: {
    title: "Product Delivery Dashboard",
    description: "Weekly status, without the weekly scramble. Synthetic data.",
    images: [`${base}/opengraph.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
