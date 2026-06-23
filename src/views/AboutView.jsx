import AboutHero from "@/components/about/AboutHero";
import AboutHeritage from "@/components/about/AboutHeritage";
import AboutProcessStats from "@/components/about/AboutProcessStats";

export default function AboutView() {
  return (
    <div className="w-full bg-[#F9F8F8] overflow-hidden">
      <AboutHero />
      <AboutHeritage />
      <AboutProcessStats />
    </div>
  );
}
