import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ScrollyCopy } from "@/components/ScrollyCopy";
import { Benefits } from "@/components/Benefits";
import { TryOn } from "@/components/TryOn";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <ScrollyCopy text="Neo - это стилист на базе искусственного ителлекта, который помогает выбирать одежду проще, увереннее и быстрее на основе ваших персональных параметров и предпочтений." />
      <Benefits />
      <TryOn />
      <FinalCTA />
      <Footer />
    </>
  );
}
