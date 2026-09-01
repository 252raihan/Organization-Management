import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { APP_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} | সমাজসেবামূলক প্রতিষ্ঠান`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: `${APP_CONFIG.name} — ${APP_CONFIG.address}। ${APP_CONFIG.description}`,
  keywords: [
    "গোপীনাথপুর সমাজ কল্যাণ সংগঠন",
    "ফুলবাড়িয়া সমাজ কল্যাণ",
    "ময়মনসিংহ সমাজসেবা",
    "রক্তদান ফুলবাড়িয়া",
    "Gopinathpur Social Welfare",
    "Community Welfare",
  ],
  authors: [{ name: APP_CONFIG.name }],
  creator: APP_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://gopinathpur-sw.org",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${inter.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
