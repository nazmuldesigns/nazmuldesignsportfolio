import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Mail, MessageSquare, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [contactInfo, setContactInfo] = useState<{ contact_email?: string | null; whatsapp?: string | null } | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase.from('site_settings').select('contact_email, whatsapp').limit(1).maybeSingle();
      if (data) setContactInfo(data);
    };
    void fetchContactInfo();
  }, []);

  return (
    <section id="contact" className="relative overflow-hidden py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div className="mx-auto max-w-4xl text-center" initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Let&apos;s work together</div>
          <h2 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">Let&apos;s create something <span className="font-display font-medium italic text-indigo-600">people remember.</span></h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-8 text-slate-600">Have a brand, campaign or creative project in mind? Let&apos;s build something visually powerful together.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={contactInfo?.contact_email ? `mailto:${contactInfo.contact_email}` : 'mailto:hello@nazmul.design'} className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 font-semibold text-white transition hover:bg-indigo-600"><Mail className="h-5 w-5" />Email me<ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
            {contactInfo?.whatsapp && <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-8 py-4 font-semibold text-slate-800 transition hover:border-indigo-500 hover:text-indigo-600"><MessageSquare className="h-5 w-5" />WhatsApp</a>}
          </div>
          <div className="mt-20 font-display text-8xl italic text-indigo-100 md:text-[12rem]">NAZMUL</div>
        </motion.div>
      </div>
    </section>
  );
}
