import type { LinksFunction } from "@remix-run/cloudflare";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { lazy } from "react";
import rdtStylesheet from "remix-development-tools/stylesheet.css";
import appleTouchIcon from "~/assets/apple-touch-icon.png";
import favicon16 from "~/assets/favicon-16x16.png";
import favicon32 from "~/assets/favicon-32x32.png";
import safariPinnedTab from "~/assets/safari-pinned-tab.svg";
import { useSWEffect } from "~/utils/client/sw-hook";
import tailwindStyles from "./styles/tailwind.css";

const RemixDevTools =
  process.env.NODE_ENV === "development"
    ? lazy(() => import("remix-development-tools"))
    : undefined;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "manifest", href: "/resources/manifest.webmanifest" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: favicon32 },
  { rel: "icon", type: "image/png", sizes: "16x16", href: favicon16 },
  { rel: "apple-touch-icon", sizes: "152x152", href: appleTouchIcon },
  { rel: "mask-icon", href: safariPinnedTab, color: "#5bbad5" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
  },
  { rel: "stylesheet", href: rdtStylesheet },
];

export default function App() {
  useSWEffect();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ backgroundColor: "rgb(20, 20, 31)" }} className="dark">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {RemixDevTools && <RemixDevTools />}
      </body>
    </html>
  );
}
