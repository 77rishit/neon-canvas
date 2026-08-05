import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/pages/Home";

const TITLE = "NEO//GRID Techfest 2026 — Hackathon, Robotics & Esports";
const DESCRIPTION =
  "NEO//GRID Techfest 2026: five days of hackathons, combat robotics, esports and hands-on labs in Bengaluru, 24-28 December. Register free.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "NEO//GRID Techfest 2026",
          description: DESCRIPTION,
          startDate: "2026-12-24",
          endDate: "2026-12-28",
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: "Institute of Advanced Technology",
            address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
          },
        }),
      },
    ],
  }),
  component: Home,
});
