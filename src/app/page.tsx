import { ColorwayProvider } from "@/components/ColorwayProvider";
import { Colorways } from "@/components/Colorways";
import { CountdownSection } from "@/components/CountdownSection";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { SizeGuide } from "@/components/SizeGuide";
import { ScrollMotion } from "@/components/ScrollMotion";
import { NotifyForm } from "@/components/NotifyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ShoeStage } from "@/components/shoe/ShoeStage";

export default function Home() {
  return (
    <ColorwayProvider>
      <a className="skip" href="#notify">
        通知の登録へ飛ぶ
      </a>
      <SiteHeader />
      <ShoeStage />
      <main id="top">
        <Hero />
        <Marquee />
        <Features />
        <SizeGuide />
        <Colorways />
        <CountdownSection />
        <NotifyForm />
      </main>
      <SiteFooter />
      <ScrollMotion />
    </ColorwayProvider>
  );
}
