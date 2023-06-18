import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

export let loader: LoaderFunction = async () => {
  return json(
    {
      short_name: "Easy Weather",
      name: "Easy Weather",
      start_url: "/",
      display: "standalone",
      background_color: "#14141f",
      theme_color: "#fff",
      shortcuts: [
        {
          name: "Homepage",
          url: "/",
          icons: [
            {
              src: "/android-chrome-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any monochrome",
            },
          ],
        },
      ],
      icons: [
        {
          src: "/android-chrome-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=600",
        "Content-Type": "application/manifest+json",
      },
    }
  );
};
