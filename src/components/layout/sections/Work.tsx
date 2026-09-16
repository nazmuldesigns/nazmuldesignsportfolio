import { motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import type { Category, Project } from '../../../types';

const fallbackCategories: Category[] = [
  { id: 'all', name: 'All', slug: 'all', sort_order: 0, published: true, created_at: '', updated_at: '' },
];

function MarqueeCard({ project }: { project: Project }) {
  return (
    <article className="arc-card w-[clamp(180px,22vw,280px)] shrink-0">
      <Link to={`/work/${project.slug}`} className="group block">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-slate-900/5 bg-white shadow-[0_22px_44px_rgba(17,17,20,0.16)] transition-shadow duration-300 group-hover:shadow-2xl">
          <img
            src={project.cover_image || ''}
            alt={project.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="mt-3 text-center">
          <h3 className="font-semibold text-slate-950">{project.title}</h3>
          <p className="text-xs text-slate-500">Open project</p>
        </div>
      </Link>
    </article>
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
  const [paused, setPaused] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const [categoryResult, projectResult] = await Promise.all([
      supabase.from('categories').select('*').eq('published', true).order('sort_order'),
      supabase
        .from('projects')
        .select('*, category:categories(name, slug)')
        .eq('published', true)
        .order('sort_order'),
    ]);

    if (categoryResult.error) {
      console.error('Could not load categories:', categoryResult.error);
    }

    if (projectResult.error) {
      setProjects([]);
      setLoadError(projectResult.error.message);
    } else {
      setProjects(projectResult.data ?? []);
    }

    setCategories(categoryResult.data?.length ? categoryResult.data : fallbackCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchPortfolio();
  }, [fetchPortfolio]);

  const visibleProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter(
          (project) =>
            project.category?.slug === activeCategory ||
            project.category_id === activeCategory,
        );

  return (
    <section id="work" className="relative overflow-hidden bg-slate-50/70 py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
            Portfolio
          </div>
          <h2 className="mb-12 text-center text-5xl font-bold md:text-7xl">
            Selected <span className="font-display font-medium italic text-indigo-600">work.</span>
          </h2>

          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`rounded-full border px-5 py-3 text-sm transition ${
                  activeCategory === category.slug
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-border bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading && <p className="mb-6 text-center text-sm text-slate-500">Loading projects...</p>}
          {loadError && <p className="mb-6 text-center text-sm text-red-500">Could not load projects: {loadError}</p>}
          {!loading && !loadError && visibleProjects.length === 0 && (
            <p className="py-20 text-center text-slate-500">No published projects yet.</p>
          )}

          {visibleProjects.length > 0 && (
            <>
              <div
                className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-6"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <motion.div
                  className="flex w-max gap-4 pr-4"
                  animate={{ x: paused ? 0 : ['0%', '-50%'] }}
                  transition={{
                    x: {
                      duration: Math.max(visibleProjects.length * 6, 24),
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'linear',
                    },
                  }}
                >
                  {[...visibleProjects, ...visibleProjects].map((project, index) => (
                    <MarqueeCard key={`${project.id}-${index}`} project={project} />
                  ))}
                </motion.div>
              </div>
              <p className="text-center text-sm text-slate-500">
                Hover to pause · Click a card to view the full project
              </p>
            </>
          )}

          <div className="mt-24 border-t border-slate-200 pt-16">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
                  All projects
                </p>
                <h3 className="text-3xl font-bold md:text-5xl">
                  Explore the full <span className="font-display font-medium italic text-indigo-600">collection.</span>
                </h3>
              </div>
              <span className="hidden text-sm text-slate-500 sm:block">{visibleProjects.length} projects</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {visibleProjects.map((project, index) => (
                <motion.div
                  key={`grid-${project.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    to={`/work/${project.slug}`}
                    className="group block overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={project.cover_image || ''}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 p-5">
                      <div>
                        <h4 className="text-xl font-bold text-slate-950">{project.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {project.category?.name || 'Selected project'}
                          {project.year ? ` · ${project.year}` : ''}
                        </p>
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
