// src/pages/ProjectDetail.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Lightbox } from '../components/ui/Lightbox';
import type { Project, ProjectImage } from '../types';

export function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        category:categories(name, slug)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (projectError) {
      setError(projectError.message);
      setProject(null);
      setLoading(false);
      return;
    }

    if (projectData) {
      setProject(projectData);

      const { data: imageData } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectData.id)
        .order('sort_order');

      if (imageData) setImages(imageData);
    } else {
      setError('Project not found.');
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (slug) void fetchProject();
  }, [slug, fetchProject]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{error ?? 'Project not found'}</h1>
          <Link to="/#work" className="text-accent hover:underline">
            Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [
    project.cover_image,
    ...images.map(img => img.image_url)
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Back button */}
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Work
        </Link>

        {/* Project header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
            {project.category && (
              <span className="px-3 py-1 rounded-full border border-border">
                {project.category.name}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {project.year}
              </span>
            )}
            {project.client && (
              <span>Client: {project.client}</span>
            )}
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            {project.title}
          </h1>

          {project.short_description && (
            <p className="text-xl text-muted max-w-3xl">
              {project.short_description}
            </p>
          )}

          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-accent hover:underline"
            >
              View Live Project
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </motion.div>

        {/* Hero image */}
        {project.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16 rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }
            }}
            data-cursor="explore"
          >
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        )}

        {/* Project details grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Overview */}
          {project.full_description && (
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">Overview</h2>
              <p className="text-lg text-muted leading-relaxed">
                {project.full_description}
              </p>
            </div>
          )}

          {/* Project info sidebar */}
          <div className="space-y-8">
            {project.tools && project.tools.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Tools Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-muted/10 border border-border text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-sm text-muted"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Challenge */}
        {project.challenge && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Challenge</h2>
            <p className="text-lg text-muted leading-relaxed max-w-4xl">
              {project.challenge}
            </p>
          </div>
        )}

        {/* Approach */}
        {project.approach && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Design Approach</h2>
            <p className="text-lg text-muted leading-relaxed max-w-4xl">
              {project.approach}
            </p>
          </div>
        )}

        {/* Solution */}
        {project.solution && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Solution</h2>
            <p className="text-lg text-muted leading-relaxed max-w-4xl">
              {project.solution}
            </p>
          </div>
        )}

        {/* Creative Direction */}
        {project.creative_direction && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Creative Direction</h2>
            <p className="text-lg text-muted leading-relaxed max-w-4xl">
              {project.creative_direction}
            </p>
          </div>
        )}

        {/* Behance-style vertical gallery */}
        {images.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Project visuals</p>
                <h2 className="text-3xl font-bold md:text-4xl">The full story</h2>
              </div>
              <span className="text-sm text-muted">{images.length} images</span>
            </div>
            <div className="space-y-8 md:space-y-12">
              {images.map((image, index) => (
                <motion.figure
                  key={image.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6 }}
                  className="group cursor-pointer overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-sm"
                  onClick={() => {
                    const imageIndex = project.cover_image ? index + 1 : index;
                    setLightboxIndex(imageIndex);
                    setLightboxOpen(true);
                  }}
                  data-cursor="explore"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || `${project.title} gallery image ${index + 1}`}
                    className="block max-h-[85vh] w-full object-contain transition duration-700 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  {image.caption && <figcaption className="px-5 py-3 text-sm text-muted">{image.caption}</figcaption>}
                </motion.figure>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {project.video_url && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Video</h2>
            <div className="aspect-video rounded-2xl overflow-hidden">
              <iframe
                src={project.video_url}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-20 pt-12 border-t border-border flex justify-between">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
          <Link
            to="/#contact"
            className="text-accent hover:underline"
          >
            Start Your Project →
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setLightboxIndex((i) => Math.min(i + 1, allImages.length - 1))}
          onPrevious={() => setLightboxIndex((i) => Math.max(i - 1, 0))}
        />
      )}
    </div>
  );
}
