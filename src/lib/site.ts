export const site = {
  name: "Kiln & Co.",
  tagline: "Made slowly, used daily.",
  description:
    "Handmade stoneware mugs, bowls, plates, vases and planters, thrown and glazed in small batches in our studio.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@kilnandco.test",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Gift sets", href: "/shop?category=gift-sets" },
  { label: "Our story", href: "/about" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Shop all", href: "/shop" },
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "On sale", href: "/shop?sale=1" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & returns", href: "/shipping-returns" },
      { label: "Contact us", href: "/contact" },
      { label: "Your account", href: "/account" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Photo credits", href: "/credits" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
