import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Profile } from '../../../types';

export function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (data) setProfile(data);
    };
    void loadProfile();
  }, []);

  const name = profile?.name || 'Md. Nazmul Hasan';
  const title = profile?.professional_title || 'Graphic Designer & Visual Creative';
  const image = profile?.profile_image;

  return (
    <section className="soft-grid relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50 pt-28">
      <div className="absolute left-10 top-40 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-56 w-56 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm text-indigo-700 shadow-sm">
              <Sparkles className="h-4 w-4" /> Available for new projects
            </div>
            <h1 className="max-w-5xl text-6xl font-bold leading-[0.95] text-slate-950 md:text-8xl">
              Posters &amp; Carousels
              <br />that make brands
              <br /><span className="font-display font-medium italic text-indigo-600">impossible to scroll past.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              I&apos;m {name}, a {title.toLowerCase()} creating scroll-stopping visual systems that turn attention into trust and customers.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-4 font-semibold text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700">
                Let&apos;s work together <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href="#work" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-800 transition hover:border-indigo-500 hover:text-indigo-600">
                See my work <ArrowDown className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-12 flex items-center gap-10 text-sm text-slate-500">
              <div><strong className="block text-3xl text-slate-950">4+</strong>Years experience</div>
              <div><strong className="block text-3xl text-slate-950">100+</strong>Visual projects</div>
              <div><strong className="block text-3xl text-slate-950">5★</strong>Client rating</div>
            </div>
          </motion.div>

          <motion.div className="relative mx-auto w-full max-w-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-300/50 to-fuchsia-200/50 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-8 border-white bg-slate-100 shadow-2xl">
              {image ? <img src={image} alt={name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-8xl font-bold text-white">N</div>}
            </div>
            <motion.div className="absolute -bottom-6 -left-8 rounded-2xl border border-white bg-white p-5 shadow-xl" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <div className="text-sm text-slate-500">Crafted with intention</div>
              <div className="font-display text-xl italic text-slate-950">Every pixel matters.</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
