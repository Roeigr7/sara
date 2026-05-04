import type { MetadataRoute } from "next";

/** PWA manifest; icon is also used by browsers for bookmarks / install. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "עורכת דין שרה מיכל אדרי",
    short_name: "שרה אדרי",
    description:
      "שירות משפטי מקצועי — משפט אזרחי, מעמד אישי, צוואות, ייפוי כוח מתמשך ונדל״ן",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/moz.png",
        type: "image/png",
        sizes: "48x48",
        purpose: "any",
      },
      {
        src: "/moz.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/moz.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
    ],
  };
}
