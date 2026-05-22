import { companyInfo } from '@/config/company';
import { useTranslation } from 'react-i18next';

export function LandingAbout() {
  const { t } = useTranslation();

  return (
    <section
      id="about-us"
      className="grid items-center gap-8 border-t border-[#e5e2d8] pt-12 md:grid-cols-2 md:gap-12 md:pt-16"
    >
      <div className="h-80 overflow-hidden rounded-xl md:h-120">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCldSvOeUbOhfYmk3NN4oRhUYagbhpKIvjxcwFcT6kBqedI3u2C5CTXBHSEdVxsvmV7i25CPfpWoNXL3crB7zWC3zfo8gV1QyqiXmFrK8y00vaAH0Obs_epPTbmDxAg4w4PuekJ3WlYJaY-yBPGh1TW2AO8XRStDz1fh6LBD9mgkLP3ZEtykwlk195jSkBTP3stwcXNzjmIjuzjeQ5ApF0Dx0KVOu0tJGLuEbGkN2DAk4OVGlF4S431rx3SePNIpuASFdkCw3DtuAI"
          alt={t('landing.about.imageAlt')}
          className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
        />
      </div>

      <div className="space-y-5 text-center md:text-left">
        <h2 className="font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
          {t('landing.about.title')}
        </h2>
        <div className="mx-auto h-1 w-16 bg-[#f4b400] md:mx-0" />
        <p className="whitespace-pre-line text-base leading-relaxed text-[#504533] md:text-lg">
          {t('landing.about.description', {
            city: companyInfo.headquarters.city,
          })}
        </p>
      </div>
    </section>
  );
}
