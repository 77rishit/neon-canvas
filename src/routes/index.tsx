import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEO//GRID — Cyberpunk React 3D Starter" },
      {
        name: "description",
        content:
          "Production-ready React 19 + Vite starter with Tailwind, React Three Fiber, Framer Motion, GSAP ScrollTrigger and Lenis smooth scroll.",
      },
      { property: "og:title", content: "NEO//GRID — Cyberpunk React 3D Starter" },
      {
        property: "og:description",
        content:
          "Dark cyberpunk React starter: R3F, Drei, Framer Motion, GSAP ScrollTrigger and Lenis, configured out of the box.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "NEO//GRID",
          description:
            "Realtime graphics and motion design studio building 3D web interfaces.",
          url: "/",
          areaServed: "Worldwide",
        }),
      },
    ],
  }),
  component: Home,
});
