import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail } from "lucide-react";
import { footerNav, site } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, InstagramIcon, PinterestIcon } from "@/components/brand/social-icons";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: InstagramIcon },
  { label: "Pinterest", href: "https://www.pinterest.com/", icon: PinterestIcon },
  { label: "Facebook", href: "https://www.facebook.com/", icon: FacebookIcon },
];

const paymentMethods = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"];

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface-muted">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-8 lg:py-16">
        <div className="col-span-2 grid content-start gap-4 md:col-span-1">
          <Logo />
          <p className="max-w-xs text-sm text-fg-muted">
            {site.tagline} Small-batch stoneware, thrown and glazed by hand in our studio.
          </p>
          <ul className="flex gap-1" aria-label="Social media">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Icon className="size-5" />
                  <span className="sr-only">{label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="grid size-10 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Mail aria-hidden="true" className="size-5" />
                <span className="sr-only">Contact us</span>
              </Link>
            </li>
          </ul>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="font-sans text-sm font-semibold text-fg">{group.title}</h2>
            <ul className="mt-4 grid gap-1">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block rounded-xs py-1.5 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg-muted">
            © <CopyrightYear /> {site.name} A fictional studio, built as a portfolio demo.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="rounded-xs border border-line-strong bg-surface px-2 py-1 text-xs font-medium text-fg-muted"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
