import { Manrope } from "next/font/google";
import { MotionConfig } from "framer-motion";
import SmoothScroll from "@/lib/SmoothScroll";
import "./globals.css";

const display = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Ain e Muhammad, Senior Software Engineer, 3D & AI Systems",
  description:
    "Portfolio of Ain e Muhammad: generative 3D pipelines, real-time environments, and full-stack systems at scale.",
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${display.variable} ${body.variable} antialiased`}
      >
        {/* Exactly viewport-sized and overflow:hidden, so the oversized
            blurred blobs inside it (see .bg-blob in globals.css) can never
            inflate the page's own scroll height, no matter how far they
            bleed past their own edges. */}
        <div id="bg-wrap" aria-hidden="true">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
        </div>
        <MotionConfig reducedMotion="user">
          <SmoothScroll>{children}</SmoothScroll>
        </MotionConfig>
      </body>
    </html>
  );
}
