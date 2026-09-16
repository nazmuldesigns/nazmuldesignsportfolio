// src/pages/Home.tsx
import { Hero } from '../components/layout/sections/Hero';
import { About } from '../components/layout/sections/About';
import { Services } from '../components/layout/sections/Services';
import { Work } from '../components/layout/sections/Work';
import { Reviews } from '../components/layout/sections/Reviews';
import { Pricing } from '../components/layout/sections/Pricing';
import { Contact } from '../components/layout/sections/Contact';

export function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Work />
      <Reviews />
      <Pricing />
      <Contact />
    </main>
  );
}
