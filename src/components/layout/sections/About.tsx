import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Check, MapPin, Briefcase } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Profile } from '../../../types';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle();
      if (data) setProfile(data);
    };
    void loadProfile();
  }, []);

  return (
    <section id="about" className="relative overflow-hidden py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">About me</div>
          <h2 className="mb-16 text-center text-5xl font-bold md:text-7xl">The designer behind <span className="font-display font-medium italic text-indigo-600">the work.</span></h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
              {profile?.profile_image ? <img src={profile.profile_image} alt={profile.name} className="absolute inset-0 h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-9xl font-bold text-indigo-300">N</div>}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-8 pt-24 text-white">
                <h3 className="text-3xl font-bold">{profile?.name || 'Md. Nazmul Hasan'}</h3>
                <p className="mt-1 text-white/75">{profile?.professional_title || 'Graphic Designer & Visual Creative'}</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-indigo-100 bg-indigo-50/60 p-8 md:p-12">
              <h3 className="mb-8 text-3xl font-bold">What I deliver</h3>
              <ul className="space-y-5">
                {['Scroll-stopping social creative', 'Consistent, premium brand identity', 'Fast, reliable turnaround'].map((item) => <li key={item} className="flex items-center gap-4 text-lg"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white"><Check className="h-4 w-4" /></span>{item}</li>)}
              </ul>
              <p className="mt-10 leading-8 text-slate-600">{profile?.biography || 'I partner with ambitious brands to build a consistent, premium visual voice that turns feeds into loyal customers.'}</p>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-indigo-600" />4+ years</span><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-600" />{profile?.location || 'Bangladesh'}</span></div>
            </div>
            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm lg:col-span-1"><h3 className="mb-8 text-2xl font-bold">How I work</h3>{[['Concept', 'Execution', 92], ['Minimal', 'Bold', 88], ['Fast', 'Meticulous', 80]].map(([left, right, value]) => <div key={String(left)} className="mb-6"><div className="mb-2 flex justify-between text-sm text-slate-500"><span>{left}</span><span>{right}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${value}%` }} /></div></div>)}</div>
            <div className="flex min-h-[220px] items-center justify-center rounded-[2rem] bg-amber-50 p-8 text-center"><p className="font-display text-3xl italic text-slate-800">“Every pixel earns its place.”</p></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
