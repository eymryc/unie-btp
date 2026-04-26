import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "UNIE-BTP | Union Solidaire des Entrepreneurs de BTP en Côte d'Ivoire",
  description:
    "UNIE-BTP rassemble les professionnels du secteur du bâtiment et des travaux publics en Côte d'Ivoire pour innover, collaborer et croître ensemble. Rejoignez une communauté de plus de 67 entrepreneurs engagés.",
  keywords:
    "UNIE-BTP, entrepreneurs BTP, bâtiment travaux publics, Côte d'Ivoire, association professionnelle, marchés publics, formation BTP, Abidjan",
  authors: [{ name: "UNIE-BTP" }],
  openGraph: {
    title: "UNIE-BTP | Union Solidaire des Entrepreneurs de BTP",
    description:
      "L'association de référence des entrepreneurs du BTP en Côte d'Ivoire. Protection, accompagnement et développement des entreprises du secteur.",
    type: "website",
    locale: "fr_CI",
    siteName: "UNIE-BTP",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNIE-BTP | Union Solidaire des Entrepreneurs de BTP",
    description:
      "L'association de référence des entrepreneurs du BTP en Côte d'Ivoire.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "UNIE-BTP",
              alternateName: "Union Solidaire des Entrepreneurs de BTP",
              description:
                "Association professionnelle dédiée à la protection, l'accompagnement et la défense des entreprises du secteur du bâtiment et des travaux publics en Côte d'Ivoire.",
              url: "https://unie-btp.com",
              foundingDate: "2023",
              address: {
                "@type": "PostalAddress",
                addressCountry: "CI",
                addressLocality: "Abidjan",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+225-07-09-60-62-86",
                email: "contact@unie-btp.com",
                contactType: "customer service",
              },
              sameAs: [
                "https://facebook.com/uniebtp",
                "https://twitter.com/uniebtp",
                "https://linkedin.com/company/uniebtp",
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
