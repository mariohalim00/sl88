import { useEffect, useState } from 'react';
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
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCScIoPvzwHKo5Pep6Pokunvngg3MdR3j0rfRkuCOPBvoUAu-A0CQrXuv4jOvOFGXSKaNRVGHjJ-VbU9uFJUEQXJ9qJMgFaV6UQEgsHmDrGdV9qbRw0XoJDpKfEuG4ZHeA0IBstiJ73JwY94OOWxPivQfv-He4ggaA4PzYc_PM1V4-DbKLx-dQtxFH8YiPhR9I0BrRwI1WF64ugNImQiERZJjK-vsLBU9Lf4milvRVV6kqxBka5ydxHeJfL_gpx8dziFFn5441if80',
    alt: 'Luxury living room with handcrafted carpet',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt5c2NFj1J8sZIt3l0sv7r9YAVgsCbYyodiZWT0MZnweWBZDosBUmaoLOWefJ44iWPEfg5tDRjYr5dDy1vIIZcBd1fnPMuh_70Mc9Y5LfCDDguq-2BP8kBK_HmyiLcY0KaPUBeDW46kxaprpYvii-0UwMzbSPAXR4GagM4c5-mgrEbEfG5yXBGMCT62O7OORLgem6vMscBZi4Qb5hjCgTsgwYDy1-W-5ERsWItYNU_w-EJqEjvuqsaEiho7QbHTMHTIM6uWpuJ5MI',
    alt: 'Bespoke carpet collection in a curated interior',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCldSvOeUbOhfYmk3NN4oRhUYagbhpKIvjxcwFcT6kBqedI3u2C5CTXBHSEdVxsvmV7i25CPfpWoNXL3crB7zWC3zfo8gV1QyqiXmFrK8y00vaAH0Obs_epPTbmDxAg4w4PuekJ3WlYJaY-yBPGh1TW2AO8XRStDz1fh6LBD9mgkLP3ZEtykwlk195jSkBTP3stwcXNzjmIjuzjeQ5ApF0Dx0KVOu0tJGLuEbGkN2DAk4OVGlF4S431rx3SePNIpuASFdkCw3DtuAI',
    alt: 'Artisan weaving process with traditional techniques',
  },
];

export function LandingHero() {
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
          <span className="text-[#f4b400]">Woven for You.</span>
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-[#504533] md:mx-0 md:text-lg">
          Experience handcrafted carpets that blend timeless tradition with
          contemporary calm. Each piece is designed to transform daily spaces
          into warm, tactile galleries.
        </p>
        <div className="flex flex-col justify-center gap-3 pt-3 sm:flex-row md:justify-start">
          <Link
            to="/shop/all"
            className="rounded-md bg-[#f4b400] px-8 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95"
          >
            Explore Collections
          </Link>
          <Link
            to="/products/c1"
            className="rounded-md border border-[#1c1c15] px-8 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:bg-[#f7f4e9]"
          >
            View Signature
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
                alt={slide.alt}
                className="h-85 w-full object-cover md:h-150"
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
                aria-label={`Go to slide ${index + 1}`}
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
            <CarouselPrevious
              className="static h-auto w-auto rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-[#1c1c15] backdrop-blur transition hover:bg-white"
            >
              Prev
            </CarouselPrevious>
            <CarouselNext
              className="static h-auto w-auto rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-[#1c1c15] backdrop-blur transition hover:bg-white"
            >
              Next
            </CarouselNext>
          </div>
        </div>
      </Carousel>
    </section>
  );
}
