import AboutHero from "@/components/about/AboutHero";
import AboutHeritage from "@/components/about/AboutHeritage";
import AboutProcessStats from "@/components/about/AboutProcessStats";

export default function AboutView({ page }) {
  const hasHeroText = page?.heroTitle || page?.heroSubtitle || page?.heroDes;

  return (
    <div className="w-full bg-[#F9F8F8] overflow-hidden">
      {/* Static hero background/logo (AboutHero) stays as-is; hero copy
          below is driven by the `Page` entity (key: "about"). Body content
          (Heritage/ProcessStats) stays static JSX. */}
      <AboutHero />

      {hasHeroText && (
        <div className="max-w-[1000px] mx-auto px-[30px] w-full pt-[40px] lg:pt-[60px] text-center">
          {page?.heroTitle && (
            <h1 className="font-arima text-[#2E2F2A] text-[28px] lg:text-[40px] font-[500] leading-tight mb-3">
              {page.heroTitle}
            </h1>
          )}
          {page?.heroSubtitle && (
            <p className="font-montserrat text-[#97400C] text-[18px] font-[600] mb-3">
              {page.heroSubtitle}
            </p>
          )}
          {page?.heroDes && (
            <p className="font-montserrat text-[#2E2F2A] text-[16px] leading-[26px]">
              {page.heroDes}
            </p>
          )}
        </div>
      )}

      <AboutHeritage />
      <AboutProcessStats />
    </div>
  );
}
