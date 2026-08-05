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
  }),
  component: Home,
});
