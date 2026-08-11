import Hero from "@/components/Hero";
import SofaShowcase from "@/components/sections/SofaShowcase";
import Expertise from "@/components/sections/Expertise";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Activities from "@/components/sections/Activities";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <SofaShowcase />
      <Expertise />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Activities />
      <Contact />
    </main>
  );
}
