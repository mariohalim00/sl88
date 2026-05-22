import { MapPin } from "lucide-react";
import { companyInfo } from "@/config/company";

export function LandingContact() {
  return (
    <section
      id="contact-us"
      className="border-t border-[#d4c4ac] py-12 md:py-16"
    >
      <div className="grid gap-8 rounded-xl border border-[#d4c4ac] bg-[#f7f4e9] p-6 sm:p-8 md:grid-cols-2 md:gap-12 md:p-12">
        <div className="order-last space-y-6 md:order-first md:space-y-8">
          <div>
            <h2 className="mb-2 text-center text-2xl font-semibold text-[#1c1c15] md:text-left md:text-3xl">
              Visit the Shop!
            </h2>
            <p className="text-center text-sm text-[#504533] md:text-left md:text-base">
              Schedule a visit to the shop in {companyInfo.headquarters.city}.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 md:items-start">
            <a
              href={companyInfo.ecommerce.tokopedia}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 transition-transform hover:scale-110"
            >
              <img
                src="/public/branding/tokopedia_mascot_icon.png"
                alt="Tokopedia"
                className="h-auto w-12"
              />
              <span className="text-lg font-medium text-[#1c1c15]">Tokopedia</span>
            </a>
            <a
              href={companyInfo.ecommerce.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 transition-transform hover:scale-110"
            >
              <img
                src="/public/branding/tiktok_shop_icon_logo.png"
                alt="TikTok"
                className="h-12 w-12"
              />
              <span className="text-lg font-medium text-[#1c1c15]">TikTok Shop</span>
            </a>
            <a
              href={companyInfo.ecommerce.shopee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 transition-transform hover:scale-110"
            >
              <img
                src="/public/branding/shopee_logo.png"
                alt="Shopee"
                className="h-auto w-12"
              />
              <span className="text-lg font-medium text-[#1c1c15]">Shopee</span>
            </a>
          </div>
        </div>

        <div className="order-first overflow-hidden rounded-lg border border-[#d4c4ac] bg-[#e5e2d8] md:order-last md:h-auto">
          <div className="relative h-75 sm:h-100 md:h-full">
            <iframe
              src={companyInfo.headquarters.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="absolute bottom-4 left-4 right-4 rounded border border-slate-100 bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:right-6 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <MapPin className="mt-1 size-6 shrink-0 text-[#f4b400] sm:mt-0 sm:size-8" />
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-slate-900 md:text-xl">
                    {companyInfo.name} Flagship
                  </h4>
                  <p className="text-sm text-slate-600 md:text-base">
                    {companyInfo.headquarters.addressLines.join(", ")}
                    <br />
                    {companyInfo.headquarters.city},{" "}
                    {companyInfo.headquarters.country}
                  </p>
                  <a
                    href={companyInfo.headquarters.googleMapsLink}
                    target="_blank"
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
  );
}
