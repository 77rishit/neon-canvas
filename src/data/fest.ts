/**
 * Single source of truth for all NEO//GRID Techfest content.
 * Keeping copy here means sections stay presentational and reusable.
 */
import hackathonImg from "@/assets/fest-hackathon.jpg";
import roboticsImg from "@/assets/fest-robotics.jpg";
import esportsImg from "@/assets/fest-esports.jpg";
import keynoteImg from "@/assets/fest-keynote.jpg";

export const FEST = {
  name: "NEO//GRID TECHFEST",
  edition: "2026",
  dates: "24 — 28 December 2026",
  venue: "Institute of Advanced Technology, Bengaluru",
  email: "hello@neogridfest.dev",
  phone: "+91 80 4000 1200",
} as const;

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface FestEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  difficulty: Difficulty;
  prize: string;
  teamSize: string;
  rules: string[];
}

export const EVENTS: FestEvent[] = [
  {
    id: "hyperhack",
    title: "HyperHack 36",
    tagline: "36-hour flagship hackathon",
    description:
      "Thirty-six hours, one problem statement, unlimited caffeine. Ship a working product and defend it on stage.",
    longDescription:
      "HyperHack is the flagship build sprint of the fest. Teams receive sealed problem statements at midnight and have 36 hours to design, build and deploy a working prototype. Mentors from partner companies rotate every six hours, and the top eight teams pitch on the main stage to a panel of founders and investors.",
    image: hackathonImg,
    date: "24 — 25 December",
    time: "22:00 IST",
    venue: "Innovation Hall A",
    difficulty: "Advanced",
    prize: "₹5,00,000",
    teamSize: "2 — 4 members",
    rules: [
      "All code must be written during the event window.",
      "Open-source libraries are allowed with attribution.",
      "Final submission includes a repo link and a 3-minute demo.",
    ],
  },
  {
    id: "botwars",
    title: "BotWars Arena",
    tagline: "Autonomous & combat robotics",
    description:
      "Build a bot, survive the pit. Two tracks: autonomous line combat and 8kg remote-controlled destruction.",
    longDescription:
      "BotWars runs two parallel brackets inside a reinforced 6x6 metre arena. The autonomous track scores on navigation accuracy and objective capture, while the combat track is a straight single-elimination bracket. Safety inspection is mandatory before every match.",
    image: roboticsImg,
    date: "26 December",
    time: "10:00 IST",
    venue: "Robotics Arena",
    difficulty: "Advanced",
    prize: "₹2,50,000",
    teamSize: "3 — 5 members",
    rules: [
      "Weight cap of 8kg including batteries.",
      "No liquid, fire or projectile weapons.",
      "Every bot must pass the safety check one hour before its match.",
    ],
  },
  {
    id: "gridclash",
    title: "GridClash Esports",
    tagline: "Multi-title LAN championship",
    description:
      "Valorant, Rocket League and a retro arcade gauntlet played out on a full LED main stage with live casters.",
    longDescription:
      "GridClash is a fully casted LAN tournament across three titles. Group stages run on day four, playoffs move to the main stage on the closing day. All peripherals are provided; players may bring their own keyboards and mice after inspection.",
    image: esportsImg,
    date: "27 — 28 December",
    time: "12:00 IST",
    venue: "Main Stage Arena",
    difficulty: "Intermediate",
    prize: "₹1,80,000",
    teamSize: "1 — 5 members",
    rules: [
      "Registered roster is locked after the group stage.",
      "One 10-minute technical pause per team per match.",
      "Any form of cheating results in a permanent fest ban.",
    ],
  },
  {
    id: "deepstack",
    title: "DeepStack Summit",
    tagline: "Keynotes & hands-on labs",
    description:
      "A full track of talks and workshops on applied AI, realtime graphics, edge systems and developer tooling.",
    longDescription:
      "The DeepStack Summit runs across all five days with keynote sessions in the morning and hands-on labs in the afternoon. Labs are capped at 60 seats each and allocated on a first-come basis to registered attendees. Bring a laptop.",
    image: keynoteImg,
    date: "24 — 28 December",
    time: "09:30 IST",
    venue: "Auditorium 1",
    difficulty: "Beginner",
    prize: "Certification + swag",
    teamSize: "Individual",
    rules: [
      "Registration badge required for lab entry.",
      "Seats are released 10 minutes before each session.",
      "Recordings are published one week after the fest.",
    ],
  },
];

export type CompetitionCategory = "Code" | "Design" | "Hardware" | "Gaming";

export interface Competition {
  id: string;
  title: string;
  category: CompetitionCategory;
  summary: string;
  prize: string;
  slots: string;
}

export const COMPETITION_CATEGORIES: CompetitionCategory[] = [
  "Code",
  "Design",
  "Hardware",
  "Gaming",
];

export const COMPETITIONS: Competition[] = [
  {
    id: "algo-rush",
    title: "Algo Rush",
    category: "Code",
    summary: "Three rounds of competitive programming with a live scoreboard and elimination cuts.",
    prize: "₹60,000",
    slots: "256 seats",
  },
  {
    id: "ctf",
    title: "Breach // CTF",
    category: "Code",
    summary: "Jeopardy-style capture the flag across web, reversing, crypto and forensics.",
    prize: "₹75,000",
    slots: "80 teams",
  },
  {
    id: "uiwars",
    title: "UI Wars",
    category: "Design",
    summary: "Six-hour product design sprint judged on craft, motion and accessibility.",
    prize: "₹45,000",
    slots: "60 teams",
  },
  {
    id: "motion",
    title: "Motion Lab",
    category: "Design",
    summary: "Build a 20-second kinetic brand film using any realtime or offline pipeline.",
    prize: "₹35,000",
    slots: "40 entries",
  },
  {
    id: "linefollow",
    title: "Line Sprint",
    category: "Hardware",
    summary: "Autonomous line follower time trial on a shifting reconfigurable track.",
    prize: "₹40,000",
    slots: "50 bots",
  },
  {
    id: "iot",
    title: "Edge Forge",
    category: "Hardware",
    summary: "Prototype an IoT solution on provided edge kits within twelve hours.",
    prize: "₹65,000",
    slots: "45 teams",
  },
  {
    id: "valorant",
    title: "Valorant Open",
    category: "Gaming",
    summary: "Five-versus-five double elimination bracket with live casting on the main stage.",
    prize: "₹90,000",
    slots: "64 teams",
  },
  {
    id: "arcade",
    title: "Retro Gauntlet",
    category: "Gaming",
    summary: "Speedrun a rotating cabinet of arcade classics against the clock.",
    prize: "₹20,000",
    slots: "Open entry",
  },
];

export const SPONSORS = [
  { name: "Vertexa", tier: "Title Partner", url: "https://vertexa.example.com" },
  { name: "NovaCloud", tier: "Platinum", url: "https://novacloud.example.com" },
  { name: "Quantel", tier: "Platinum", url: "https://quantel.example.com" },
  { name: "Hexaform", tier: "Gold", url: "https://hexaform.example.com" },
  { name: "Lumendrive", tier: "Gold", url: "https://lumendrive.example.com" },
  { name: "Orbital AI", tier: "Gold", url: "https://orbital-ai.example.com" },
  { name: "Strux Labs", tier: "Silver", url: "https://struxlabs.example.com" },
  { name: "Pulsewave", tier: "Silver", url: "https://pulsewave.example.com" },
  { name: "Corebyte", tier: "Silver", url: "https://corebyte.example.com" },
] as const;

export const GALLERY = [
  { src: hackathonImg, alt: "Participants coding through the night at the HyperHack arena" },
  { src: roboticsImg, alt: "Combat robots facing off inside the BotWars arena" },
  { src: esportsImg, alt: "GridClash esports main stage with LED screens and a full crowd" },
  { src: keynoteImg, alt: "Keynote speaker on stage in front of holographic visuals" },
  { src: esportsImg, alt: "Wide shot of the esports crowd during the grand finals" },
  { src: hackathonImg, alt: "Mentors reviewing team prototypes during the hackathon" },
];

export const STATS = [
  { label: "Participants", value: 12000, suffix: "+" },
  { label: "Colleges", value: 240, suffix: "" },
  { label: "Events & labs", value: 48, suffix: "" },
  { label: "Prize pool (₹L)", value: 32, suffix: "L" },
];

export const SCHEDULE = [
  {
    id: "day0",
    day: "Pre-fest",
    date: "20 December",
    title: "Registrations close",
    detail:
      "Final rosters are locked, team IDs are mailed out and problem statement teasers drop across our socials.",
  },
  {
    id: "day1",
    day: "Day 01",
    date: "24 December",
    title: "Opening ceremony & DeepStack keynotes",
    detail:
      "Doors at 08:00. Opening keynote at 09:30, followed by the first lab block and the HyperHack midnight kickoff.",
  },
  {
    id: "day2",
    day: "Day 02",
    date: "25 December",
    title: "HyperHack finals & maker labs",
    detail:
      "Thirty-six hours of building wrap at 10:00, the top eight teams pitch from 18:00 and the maker labs run all afternoon.",
  },
  {
    id: "day3",
    day: "Day 03",
    date: "26 December",
    title: "BotWars Arena brackets",
    detail:
      "The reinforced arena opens at 10:00 for autonomous runs, with combat single-elimination matches through the evening.",
  },
  {
    id: "day4",
    day: "Day 04",
    date: "27 December",
    title: "GridClash group stages",
    detail:
      "Valorant, Rocket League and the retro gauntlet run in parallel on the LED stage with full live casting.",
  },
  {
    id: "day5",
    day: "Day 05",
    date: "28 December",
    title: "Grand finals, awards & closing set",
    detail:
      "Esports playoffs on the main stage, prize distribution at 19:00 and an audio-reactive closing performance to shut it down.",
  },
];

export const TEAM = [
  { name: "Aarav Menon", role: "Fest Convenor", initials: "AM" },
  { name: "Ishita Rao", role: "Technical Lead", initials: "IR" },
  { name: "Kabir Sheikh", role: "Events Head", initials: "KS" },
  { name: "Meera Nair", role: "Design Director", initials: "MN" },
  { name: "Rohan Iyer", role: "Sponsorship Head", initials: "RI" },
  { name: "Sara Fernandes", role: "Operations Head", initials: "SF" },
];

export const TESTIMONIALS = [
  {
    quote:
      "The 36-hour hack was the most intense build weekend of my life — and the mentorship rotation was genuinely world class.",
    name: "Priya Sundar",
    role: "HyperHack 2025 winner",
  },
  {
    quote:
      "We came for the robotics bracket and left with three internship offers. The recruiter lounge alone is worth the trip.",
    name: "Dev Malhotra",
    role: "BotWars finalist, NIT Trichy",
  },
  {
    quote:
      "Production quality on the esports stage rivalled events I have casted professionally. Zero technical downtime.",
    name: "Nikhil Verma",
    role: "Guest caster, GridClash",
  },
  {
    quote:
      "The DeepStack labs were hands-on from minute one. I shipped my first realtime shader before lunch.",
    name: "Ananya Bose",
    role: "Attendee, DeepStack Summit",
  },
];

export const FAQS = [
  {
    q: "Who can participate in the fest?",
    a: "Any student with a valid college ID from an accredited institution can register. A few open-entry events also welcome working professionals and independent builders.",
  },
  {
    q: "Is there a registration fee?",
    a: "General fest access is free. Competitive tracks with prize pools carry a nominal per-team fee that is fully refunded if your team checks in on time.",
  },
  {
    q: "Can I take part in more than one event?",
    a: "Yes, as long as the schedules do not overlap. The registration form lets you pick your primary event, and you can submit it again for each additional one.",
  },
  {
    q: "Is accommodation provided?",
    a: "Subsidised hostel accommodation is available for outstation participants on all three nights, allocated on a first-come basis after registration closes.",
  },
  {
    q: "What should I bring?",
    a: "Your college ID, the confirmation email, a laptop with charger, and hardware specific to your event. Everything else, including power and network, is provided.",
  },
  {
    q: "How do I reach the venue?",
    a: "The campus is 40 minutes from the international airport and 15 minutes from the nearest metro station. Shuttles run every 30 minutes on all fest days.",
  },
];

export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "Design",
  "Other",
];

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"];
