import { getContent } from "@/lib/content";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

// Content is read from disk per request so /admin edits show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <Navbar content={content.nav} personal={content.personal} />
      <main id="main">
        <Hero content={content.hero} personal={content.personal} />
        <About content={content.about} personal={content.personal} />
        <ExperienceTimeline content={content.experience} />
        <Projects content={content.projects} />
        <Skills content={content.skills} />
        <Credentials
          certifications={content.certifications}
          education={content.education}
          achievements={content.achievements}
        />
        <Contact content={content.contact} personal={content.personal} />
      </main>
      <Footer content={content.footer} personal={content.personal} />
    </>
  );
}
