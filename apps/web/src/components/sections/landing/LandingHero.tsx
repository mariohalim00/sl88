import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { companyInfo } from '@/config/company';

const heroSlides = [
  {
    src: '/branding/Carousel/SAMPLE%20WEBSITE%20BANNER%20-%206.jpg',
    altKey: 'landing.hero.slideAlt1',
  },
  {
    src: '/branding/Carousel/SAMPLE%20WEBSITE%20BANNER%20-%207.jpg',
    altKey: 'landing.hero.slideAlt2',
  },
  {
    src: '/branding/Carousel/SAMPLE%20WEBSITE%20BANNER%20-%208.jpg',
    altKey: 'landing.hero.slideAlt3',
  },
  {
    src: '/branding/Carousel/SAMPLE%20WEBSITE%20BANNER%20-%209.jpg',
    altKey: 'landing.hero.slideAlt4',
  },
  {
    src: '/branding/Carousel/SAMPLE%20WEBSITE%20BANNER%20-%2010.jpg',
    altKey: 'landing.hero.slideAlt5',
  },
];

export function LandingHero() {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => setActiveSlide(api.selectedScrollSnap());

    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const intervalId = window.setInterval(() => {
      api.scrollNext();
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [api]);

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="space-y-8 md:space-y-10">
      <div className="max-w-2xl space-y-5 text-center md:text-left">
        <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-[#1c1c15] md:text-6xl">
          {companyInfo.name},
          <br />
          <span className="text-[#f4b400]">
            {t('landing.hero.title')}
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-[#504533] md:mx-0 md:text-lg">
          {t('landing.hero.description')}
        </p>
        <div className="flex flex-col justify-center gap-3 pt-3 sm:flex-row md:justify-start">
          <Link
            to="/shop/all"
            className="rounded-md bg-[#f4b400] px-8 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95"
          >
            {t('landing.hero.exploreCollections')}
          </Link>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="relative overflow-hidden rounded-xl border border-[#e5e2d8] shadow-lg"
      >
        <CarouselContent className="ml-0">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.src} className="pl-0">
              <img
                src={slide.src}
                alt={t(slide.altKey)}
                className="aspect-3/2 w-full object-cover sm:aspect-21/9"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-[#fcf9ee] to-transparent" />

        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between md:right-6 md:left-6">
          <div className="flex items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={t('landing.hero.goToSlide', { count: index + 1 })}
                onClick={() => goToSlide(index)}
                className={[
                  'h-2.5 w-2.5 rounded-full transition',
                  activeSlide === index
                    ? 'bg-[#f4b400]'
                    : 'bg-white/80 hover:bg-white',
                ].join(' ')}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <CarouselPrevious className="static h-auto w-auto rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-[#1c1c15] backdrop-blur transition hover:bg-white">
              {t('common.actions.prev')}
            </CarouselPrevious>
            <CarouselNext className="static h-auto w-auto rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-[#1c1c15] backdrop-blur transition hover:bg-white">
              {t('common.actions.next')}
            </CarouselNext>
          </div>
        </div>
      </Carousel>
    </section>
  );
}
