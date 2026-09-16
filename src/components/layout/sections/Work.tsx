import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import type { Project, Category } from '../../../types';

const fallbackCategories: Category[] = [
  { id: 'all', name: 'All', slug: 'all', sort_order: 0, published: true, created_at: '', updated_at: '' },
  { id: 'social', name: 'Social Media', slug: 'social-media', sort_order: 1, published: true, created_at: '', updated_at: '' },
  { id: 'branding', name: 'Brand Identity', slug: 'brand-identity', sort_order: 2, published: true, created_at: '', updated_at: '' },
];


function ArcCard({ project, index, total, rotation, paused }: { project: Project; index: number; total: number; rotation: number; paused: boolean }) {
  const angle = ((index / total) * 360 + rotation) % 360;
  const radians = (angle * Math.PI) / 180;
  const x = Math.sin(radians) * 430;
  const y = (1 - Math.cos(radians)) * 105;
  const depth = (Math.cos(radians) + 1) / 2;
  const scale = 0.72 + depth * 0.28;
  const opacity = 0.18 + depth * 0.82;
  const zIndex = 100 + Math.round(depth * 100);
  const cardRotate = Math.sin(radians) * 25;

  return (
    <motion.div className="absolute left-1/2 top-1/2 w-[196px] sm:w-[245px]" animate={{ x: `calc(-50% + ${x}px)`, y: `calc(-50% + ${y - 35}px)`, rotate: cardRotate, scale, opacity, zIndex }} transition={{ duration: paused ? 0.45 : 0.12, ease: 'linear' }} style={{ willChange: 'transform, opacity' }}>
      <Link to={`/work/${project.slug}`} className="group block cursor-pointer">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-slate-900/5 bg-white shadow-[0_22px_44px_rgba(17,17,20,0.16)] transition-shadow duration-300 group-hover:shadow-2xl">
          <img src={project.cover_image || ''} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        </div>
        <div className="mt-3 text-center"><h3 className="font-semibold text-slate-950">{project.title}</h3><p className="text-xs text-slate-500">Open project</p></div>
      </Link>
    </motion.div>
  );
}

export function Work() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);

  const fetchCategories = useCallback(async (): Promise<Category[]> => {
    const { data } = await supabase.from('categories').select('*').eq('published', true).order('sort_order');
    if (data && data.length > 0) { setCategories(data); return data; }
    return fallbackCategories;
  }, []);

  const fetchProjects = useCallback(async (categorySlug?: string, availableCategories = categories) => {
    setLoadError(null);
    let query = supabase.from('projects').select('*, category:categories(name, slug)').eq('published', true).order('sort_order');
    if (categorySlug && categorySlug !== 'all') {
      const category = availableCategories.find((item) => item.slug === categorySlug);
      if (category) query = query.eq('category_id', category.id);
    }
    const { data, error } = await query;
    if (error) {
      setLoadError(error.message);
      setProjects([]);
      return;
    }
    setProjects(data ?? []);
  }, [categories]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const available = await fetchCategories();
      if (!cancelled) await fetchProjects(undefined, available);
      if (!cancelled) setLoading(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [fetchCategories, fetchProjects]);

  useEffect(() => {
    if (paused || projects.length < 2) return;
    const interval = window.setInterval(() => setRotation((value) => (value + 1.2) % 360), 50);
    return () => window.clearInterval(interval);
  }, [paused, projects.length]);

  const visibleProjects = activeCategory === 'all' ? projects : projects.filter((project) => project.category?.slug === activeCategory || project.category_id === activeCategory);
  const carouselProjects = visibleProjects;
  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
  };

  return (
    <section id="work" className="relative overflow-hidden bg-slate-50/70 py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Portfolio</div>
          <h2 className="mb-12 text-center text-5xl font-bold md:text-7xl">Selected <span className="font-display font-medium italic text-indigo-600">work.</span></h2>
          <div className="mb-12 flex flex-wrap justify-center gap-3">{categories.map((category) => <button key={category.id} type="button" onClick={() => handleCategoryChange(category.slug)} className={`rounded-full border px-5 py-3 text-sm transition ${activeCategory === category.slug ? 'border-slate-950 bg-slate-950 text-white' : 'border-border bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}>{category.name}</button>)}</div>
          {loading && <p className="mb-6 text-center text-sm text-slate-500">Loading projects...</p>}
          {loadError && <p className="mb-6 text-center text-sm text-red-500">Could not load projects: {loadError}</p>}
          {!loading && !loadError && carouselProjects.length === 0 && <p className="py-20 text-center text-slate-500">No published projects yet.</p>}
          {carouselProjects.length > 0 && (
            <>
              <div className="relative mx-auto h-[620px] w-full max-w-6xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                {carouselProjects.map((project, index) => <ArcCard key={project.id} project={project} index={index} total={carouselProjects.length} rotation={rotation} paused={paused} />)}
              </div>
              <p className="text-center text-sm text-slate-500">Hover to pause · Click a card to view the full project</p>
            </>
          )}

          <div className="mt-24 border-t border-slate-200 pt-16">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">All projects</p>
                <h3 className="text-3xl font-bold md:text-5xl">Explore the full <span className="font-display font-medium italic text-indigo-600">collection.</span></h3>
              </div>
              <span className="hidden text-sm text-slate-500 sm:block">{carouselProjects.length} projects</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {carouselProjects.map((project, index) => (
                <motion.div key={`grid-${project.id}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                  <Link to={`/work/${project.slug}`} className="group block overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={project.cover_image || ''} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex items-center justify-between gap-4 p-5">
                      <div>
                        <h4 className="text-xl font-bold text-slate-950">{project.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">{project.category?.name || 'Selected project'}{project.year ? ` · ${project.year}` : ''}</p>
                      </div>
                      <span className="text-2xl text-indigo-600 transition-transform group-hover:translate-x-1">↗</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
