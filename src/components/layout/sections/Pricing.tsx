import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Pricing as PricingType } from '../../../types';

const fallbackPackages: PricingType[] = [
  { id: 'starter', name: 'Starter', description: 'A focused visual starter kit for growing brands.', price: 120, currency: 'USD', features: ['3 social media designs', '1 revision round', 'Ready-to-post files'], featured: false, visibility: 'visible', sort_order: 1, created_at: '', updated_at: '' },
  { id: 'growth', name: 'Growth', description: 'A consistent monthly content system for active brands.', price: 280, currency: 'USD', features: ['10 social media designs', 'Carousel or campaign concept', '2 revision rounds', 'Source files included'], featured: true, visibility: 'visible', sort_order: 2, created_at: '', updated_at: '' },
  { id: 'identity', name: 'Brand Identity', description: 'A polished identity foundation built to last.', price: 650, currency: 'USD', features: ['Logo direction', 'Colour and typography system', 'Brand presentation', 'Social starter templates'], featured: false, visibility: 'visible', sort_order: 3, created_at: '', updated_at: '' },
];

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [packages, setPackages] = useState<PricingType[]>(fallbackPackages);

  useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase.from('pricing').select('*').eq('visibility', 'visible').order('sort_order');
      if (data && data.length > 0) setPackages(data);
    };
    void fetchPricing();
  }, []);

  return (
    <section id="pricing" className="relative bg-slate-50/70 py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Simple packages</div>
          <h2 className="mb-16 text-center text-5xl font-bold md:text-7xl">Choose your <span className="font-display font-medium italic text-indigo-600">direction.</span></h2>
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((pkg, index) => <motion.article key={pkg.id} initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.1 }} className={`relative rounded-[2rem] border p-8 ${pkg.featured ? 'border-indigo-500 bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'border-border bg-white'}`}>
              {pkg.featured && <span className="absolute -top-3 left-8 rounded-full bg-amber-300 px-4 py-1 text-xs font-bold text-slate-900">MOST POPULAR</span>}
              <h3 className="text-2xl font-bold">{pkg.name}</h3>
              <p className={`mt-3 min-h-14 ${pkg.featured ? 'text-indigo-100' : 'text-slate-500'}`}>{pkg.description}</p>
              <div className="my-8 text-5xl font-bold">{pkg.currency === 'USD' ? '$' : pkg.currency}{pkg.price}</div>
              <ul className="mb-8 space-y-4">{(pkg.features || []).map((feature) => <li key={feature} className="flex items-start gap-3"><Check className={`mt-0.5 h-5 w-5 shrink-0 ${pkg.featured ? 'text-indigo-100' : 'text-indigo-600'}`} />{feature}</li>)}</ul>
              <a href="#contact" className={`block rounded-full px-6 py-3 text-center font-semibold transition ${pkg.featured ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-slate-950 text-white hover:bg-indigo-600'}`}>Get started</a>
            </motion.article>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
