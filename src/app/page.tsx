import { Hero } from "@/components/Hero";
import { ScrollyCopy } from "@/components/ScrollyCopy";
import { Benefits } from "@/components/Benefits";
import { TryOn } from "@/components/TryOn";
import { FinalCTA } from "@/components/FinalCTA";

export default function Page() {
  return (
    <>
      <Hero />
      <ScrollyCopy text="AIUTA is a modular AI innovation platform designed to help fashion brands transform how people shop, discover, and connect with fashion." />
      <Benefits />
      <TryOn />
      <FinalCTA />
    </>
  );
}
