// src/pages/admin/Projects.tsx
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Project } from '../../types';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const fetchProjects = useCallback(async () => {
    let query = supabase
      .from('projects')
      .select(`
        *,
        category:categories(name, slug)
      `)
      .order('sort_order');

    if (filter === 'published') {
      query = query.eq('published', true);
    } else if (filter === 'draft') {
      query = query.eq('published', false);
    }

    const { data } = await query;
    if (data) setProjects(data);
  }, [filter]);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Project deleted!');
      fetchProjects();
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('projects')
      .update({ published: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(currentStatus ? 'Project unpublished' : 'Project published!');
      fetchProjects();
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-muted">Manage your portfolio projects</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab
                ? 'bg-accent text-background'
                : 'border border-border hover:border-accent'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-muted/5 border border-border rounded-xl overflow-hidden hover:border-accent transition-colors"
          >
            {/* Cover Image */}
            <div className="aspect-video bg-muted/10 relative">
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  No image
                </div>
              )}
              {project.featured && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-background text-xs font-bold rounded-full">
                  FEATURED
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    {project.category && (
                      <span>{project.category.name}</span>
                    )}
                    {project.year && (
                      <>
                        <span>•</span>
                        <span>{project.year}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  project.published ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
              </div>

              {project.short_description && (
                <p className="text-sm text-muted mb-4 line-clamp-2">
                  {project.short_description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/admin/projects/${project.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:border-accent transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => togglePublish(project.id, project.published)}
                  className="px-3 py-2 border border-border rounded-lg hover:border-accent transition-colors"
                  title={project.published ? 'Unpublish' : 'Publish'}
                >
                  {project.published ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-2 border border-border rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-muted" />
          </div>
          <h3 className="text-xl font-bold mb-2">No projects yet</h3>
          <p className="text-muted mb-6">Start building your portfolio by adding your first project</p>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Project
          </Link>
        </div>
      )}
    </div>
  );
}
