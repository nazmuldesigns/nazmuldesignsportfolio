import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Service } from '../../../types';

const fallbackServices: Service[] = [
  { id: 'service-1', title: 'Social Media Design', number: '01', description: 'Scroll-stopping posts, carousels, stories and ad creatives designed to turn attention into action.', image: null, sort_order: 1, published: true, created_at: '', updated_at: '' },
  { id: 'service-2', title: 'Brand Identity', number: '02', description: 'Logo direction, colour systems, typography and brand guidelines that make your business instantly recognisable.', image: null, sort_order: 2, published: true, created_at: '', updated_at: '' },
  { id: 'service-3', title: 'Campaign Creative', number: '03', description: 'Big ideas translated into cohesive campaign visuals for launches, promotions and important brand moments.', image: null, sort_order: 3, published: true, created_at: '', updated_at: '' },
  { id: 'service-4', title: 'Product Visuals', number: '04', description: 'Clean, premium product graphics and art direction that help products look as good as they feel.', image: null, sort_order: 4, published: true, created_at: '', updated_at: '' },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').eq('published', true).order('sort_order');
      if (data && data.length > 0) setServices(data);
    };
    void fetchServices();
  }, []);

  return (
    <section id="services" className="relative py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">What I do</div>
          <h2 className="mb-16 text-center text-5xl font-bold md:text-7xl">Services that <span className="font-display font-medium italic text-indigo-600">move brands.</span></h2>
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service, index) => <motion.article key={service.id} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.1 }} className="group rounded-[2rem] border border-border bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl md:p-10"><div className="mb-12 flex items-start justify-between"><span className="text-sm font-semibold text-indigo-600">{service.number || `0${index + 1}`}</span><span className="rounded-full bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white"><ArrowUpRight className="h-5 w-5" /></span></div><h3 className="mb-4 text-3xl font-bold">{service.title}</h3><p className="max-w-md leading-8 text-slate-500">{service.description}</p></motion.article>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
