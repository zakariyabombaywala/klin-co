import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VesselsIllustration } from "@/components/brand/vessels-illustration";

export default function HomePage() {
  return (
    <section aria-labelledby="hero-heading" className="container-page py-12 sm:py-16 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="grid gap-6">
          <p className="text-sm font-medium tracking-wide text-link uppercase">Small-batch stoneware</p>
          <h1 id="hero-heading" className="text-5xl text-fg sm:text-6xl">
            Made slowly,
            <br />
            used daily.
          </h1>
          <p className="max-w-lg text-lg text-fg-muted">
            Mugs, bowls, plates and vases thrown on the wheel and glazed by hand in our studio. Each piece is a little
            different, and all of them are made for the dishwasher.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop the collection
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/about">How we make it</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg bg-clay-100 p-6 sm:p-10 dark:bg-charcoal-800">
          <VesselsIllustration />
        </div>
      </div>
    </section>
  );
}
