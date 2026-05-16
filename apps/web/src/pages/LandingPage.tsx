import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { companyInfo } from '@/config/company';

const categoryHighlights = [
  {
    title: 'Kitchen Carpets',
    description: 'Durable elegance for culinary spaces.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2yCQFSVkJrujFwwzmkO9diuP0QodGZXJ2_-5NDnRtDxTnY5YHmwh5aQqPPYLeJ0fItj618nbj0r0oqDHAa_nrtTahQI2BsPrwWw3UQ10NUzwsMROMo_Mr-z00sGeFidlhIAV8atK9tGOoLmliVAEVQY8GByW4wnLOxaSwxKbWVmQSaJl2YM2IBWyujmsFcEwXnVAYByzzCwwXGqRhoWqL0drmcmXYjoYKvhgTfogU24ObuHI4HiW1qCZLV9Q1cyQ9hq1pD-3kgQA',
  },
  {
    title: 'Welcome Mats',
    description: 'The first impression.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhRkrxOYKq3bup1QF0fnR8crOQ4utEmJlkGin-byrbn4imyBTv7r2ri3tgA2J_9PxJmH3N9XzjIkHqfCEqHfHH_zocw64M9pJ9aY7uDcqgOXCFMlZXp59OTZZ4k9hG2bGjQZflnF0pzpjl-trbEMMgd_zwzPMc0MUiVUGpVHBV42G7EOGm3SbkmU2KGPSInlRslaUULgrLSZVvzijExUQElXSQaUYRmzWPjLAJ4y-7qgp7-YhFDXnqBVMXazP7DgMxTPFTnGQSbzc',
  },
  {
    title: 'Car Carpets',
    description: 'Luxury in motion.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA24MSxRx5eE-JPbt_ur5puVCu4IaQb-SJl-8pJobxafPvfkUQPO_LSwWwJLyBlLDJVfE7wedrq5g_zi_T9875vk56uCXDfR5hvKx-5i8iDqK1VArO5UQ9rwZXgt-bYzYD-usqqKzK16VbtyXHw0abpqbvsEC-nnXGaxPEEmGxz6FjLW4JdpXMvcn--4FJOp4yLxe5XD3conScZs0kI8iJuq7LOaIOq9wpGpsSO-1zexJsE9-lH1WG2QuqsKGPBkhO2kOdgewid3Xc',
  },
  {
    title: 'Bespoke Collection',
    description: 'Commission a masterpiece tailored to your vision and space.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBt5c2NFj1J8sZIt3l0sv7r9YAVgsCbYyodiZWT0MZnweWBZDosBUmaoLOWefJ44iWPEfg5tDRjYr5dDy1vIIZcBd1fnPMuh_70Mc9Y5LfCDDguq-2BP8kBK_HmyiLcY0KaPUBeDW46kxaprpYvii-0UwMzbSPAXR4GagM4c5-mgrEbEfG5yXBGMCT62O7OORLgem6vMscBZi4Qb5hjCgTsgwYDy1-W-5ERsWItYNU_w-EJqEjvuqsaEiho7QbHTMHTIM6uWpuJ5MI',
  },
];

export function LandingPage() {
  return (
    <div className="space-y-12 md:space-y-20">
      <section className="grid items-center gap-8 md:min-h-170grid-cols-2 md:gap-12">
        <div className="space-y-5 text-center md:text-left">
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

        <div className="relative h-85 overflow-hidden rounded-xl shadow-lg md:h-150">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCScIoPvzwHKo5Pep6Pokunvngg3MdR3j0rfRkuCOPBvoUAu-A0CQrXuv4jOvOFGXSKaNRVGHjJ-VbU9uFJUEQXJ9qJMgFaV6UQEgsHmDrGdV9qbRw0XoJDpKfEuG4ZHeA0IBstiJ73JwY94OOWxPivQfv-He4ggaA4PzYc_PM1V4-DbKLx-dQtxFH8YiPhR9I0BrRwI1WF64ugNImQiERZJjK-vsLBU9Lf4milvRVV6kqxBka5ydxHeJfL_gpx8dziFFn5441if80"
            alt="Luxury living room with handcrafted carpet"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-[#fcf9ee] to-transparent" />
        </div>
      </section>

      <section id="collection" className="space-y-8 md:space-y-10">
        <div className="space-y-2 text-center">
          <h2 className="font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
            Curated Collections
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-[#504533] md:text-base">
            Explore categories designed for modern homes, refined entrances, and
            high-comfort interiors.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 md:auto-rows-[280px]">
          {categoryHighlights.map((item, index) => (
            <article
              key={item.title}
              className={[
                'group relative overflow-hidden rounded-xl',
                index === 0 ? 'md:row-span-2' : '',
                index === 3 ? 'md:col-span-2' : '',
              ].join(' ')}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-6 text-white md:p-8">
                <h3 className="font-heading text-2xl font-medium">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-white/85 md:text-base">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about-us"
        className="grid items-center gap-8 border-t border-[#e5e2d8] pt-12 md:grid-cols-2 md:gap-12 md:pt-16"
      >
        <div className="h-80 overflow-hidden rounded-xl md:h-120">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCldSvOeUbOhfYmk3NN4oRhUYagbhpKIvjxcwFcT6kBqedI3u2C5CTXBHSEdVxsvmV7i25CPfpWoNXL3crB7zWC3zfo8gV1QyqiXmFrK8y00vaAH0Obs_epPTbmDxAg4w4PuekJ3WlYJaY-yBPGh1TW2AO8XRStDz1fh6LBD9mgkLP3ZEtykwlk195jSkBTP3stwcXNzjmIjuzjeQ5ApF0Dx0KVOu0tJGLuEbGkN2DAk4OVGlF4S431rx3SePNIpuASFdkCw3DtuAI"
            alt="Artisan weaving process"
            className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
          />
        </div>

        <div className="space-y-5 text-center md:text-left">
          <h2 className="font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
            About Us
          </h2>
          <div className="mx-auto h-1 w-16 bg-[#f4b400] md:mx-0" />
          <p className="text-base leading-relaxed text-[#504533] md:text-lg">
            Based in {companyInfo.headquarters.city}, our master artisans
            preserve traditional weaving methods with ethically sourced
            materials. Every knot reflects patience, precision, and enduring
            beauty.
          </p>
          <Link
            to="/shop/all"
            className="inline-flex border-b border-[#d4c4ac] pb-1 text-sm font-semibold tracking-widest text-[#1c1c15] uppercase transition hover:border-[#1c1c15]"
          >
            Discover Our Story
          </Link>
        </div>
      </section>

      <section
        id="contact-us"
        className="border-t border-[#d4c4ac] py-12 md:py-16"
      >
        <div className="grid gap-8 rounded-xl border border-[#d4c4ac] bg-[#f7f4e9] p-6 sm:p-8 md:grid-cols-2 md:gap-12 md:p-12">
          {/* Contact Form */}
          <div className="order-last space-y-6 md:order-first md:space-y-8">
            <div>
              <h2 className="mb-2 text-center text-2xl font-semibold text-[#1c1c15] md:text-left md:text-3xl">
                Visit the Atelier
              </h2>
              <p className="text-center text-sm text-[#504533] md:text-left md:text-base">
                Schedule a private viewing in {companyInfo.headquarters.city} or
                consult with our master weavers.
              </p>
            </div>

            <form className="space-y-4 md:space-y-6">
              <div className="space-y-1">
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-[#504533]"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full rounded border border-[#d4c4ac] bg-white px-4 py-3 font-body-md text-[#1c1c15] outline-none transition-colors focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-[#504533]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  className="w-full rounded border border-[#d4c4ac] bg-white px-4 py-3 font-body-md text-[#1c1c15] outline-none transition-colors focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
                />
              </div>

              <div className="space-y-1">
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-[#504533]"
                  htmlFor="message"
                >
                  Inquiry
                </label>
                <textarea
                  id="message"
                  placeholder="How can we assist you?"
                  rows={4}
                  className="w-full resize-none rounded border border-[#d4c4ac] bg-white px-4 py-3 font-body-md text-[#1c1c15] outline-none transition-colors focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
                />
              </div>

              <button
                type="button"
                className="w-full rounded bg-[#1c1c15] py-4 font-semibold uppercase tracking-widest text-white transition hover:bg-[#504533] active:scale-95"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map Visual */}
          <div className="order-first overflow-hidden rounded-lg border border-[#d4c4ac] bg-[#e5e2d8] md:order-last md:h-auto">
            <div className="relative h-75 sm:h-100 md:h-full">
              <img
                alt="Store Location Map"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0m5HpVQOueGiauHZG2P3tLgBq8tKD6bRerEr_YdccyiAo1fTjaa9l1LUnf6Uipa9H2nqiF7jzrmiCzEp7NBbNqMXFqdPLLJunRogg_4SRf4H3BENEKAb6r8yUJfrOx1sx8Zleizdew27bEM_fxwieB71eG4Tx1Z6vvh700VF0lW5zLax8xOgrS_oidxmq2HecV8adfFxFL7kGhIOL78D7aJOG5zOYPrJqq8_ty7KWl97AxsFnudAI5Dp0YDcH_Tju1I9CvCsjbTc"
                className="h-full w-full object-cover opacity-80 grayscale"
              />

              {/* Address overlay */}
              <div className="absolute bottom-4 left-4 right-4 rounded border border-slate-100 bg-white/95 p-4 shadow-lg sm:bottom-6 sm:left-6 sm:right-6 sm:p-6 backdrop-blur">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <MapPin className="mt-1 size-6 shrink-0 text-[#f4b400] sm:mt-0 sm:size-8" />
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-slate-900 md:text-xl">
                      {companyInfo.name} Flagship
                    </h4>
                    <p className="text-sm text-slate-600 md:text-base">
                      {companyInfo.headquarters.addressLines.join(', ')}
                      <br />
                      {companyInfo.headquarters.city},{' '}
                      {companyInfo.headquarters.country}
                    </p>
                    <a
                      href="#"
                      className="mt-2 inline-block text-sm font-semibold text-[#f4b400] transition hover:underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
