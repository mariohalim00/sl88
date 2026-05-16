import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LandingHero() {
  return (
    <section className="landing-hero relative overflow-hidden rounded-3xl border border-border/70 bg-card/75 px-6 py-10 shadow-sm backdrop-blur-sm md:px-10 md:py-14">
      <div className="max-w-2xl space-y-5">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
          Handwoven carpets for modern, lived-in spaces.
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Discover artisan textures that balance warmth and clarity across
          living rooms, bedrooms, and hospitality-inspired corners.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className={cn(buttonVariants({ variant: 'default' }))}
            to="/shop/all"
          >
            Explore Collection
          </Link>
          <Link
            className={cn(buttonVariants({ variant: 'outline' }))}
            to="/products/c1"
          >
            View Signature Product
          </Link>
        </div>
      </div>
    </section>
  );
}
