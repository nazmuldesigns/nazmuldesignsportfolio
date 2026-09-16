// src/pages/admin/ProjectEditor.tsx
import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import type { Category } from '../../types';

export function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    year: new Date().getFullYear().toString(),
    client: '',
    short_description: '',
    full_description: '',
    challenge: '',
    approach: '',
    solution: '',
    creative_direction: '',
    tools: '',
    tags: '',
    cover_image: '',
    video_url: '',
    external_url: '',
    featured: false,
    published: false,
  });

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('published', true)
      .order('sort_order');

    if (data) setCategories(data);
  }, []);

  const fetchProject = useCallback(async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        category_id: data.category_id || '',
        year: data.year || '',
        client: data.client || '',
        short_description: data.short_description || '',
        full_description: data.full_description || '',
        challenge: data.challenge || '',
        approach: data.approach || '',
        solution: data.solution || '',
        creative_direction: data.creative_direction || '',
        tools: data.tools?.join(', ') || '',
        tags: data.tags?.join(', ') || '',
        cover_image: data.cover_image || '',
        video_url: data.video_url || '',
        external_url: data.external_url || '',
        featured: data.featured,
        published: data.published,
      });
    }
  }, [id]);

  useEffect(() => {
    void fetchCategories();
    if (id) void fetchProject();
  }, [id, fetchCategories, fetchProject]);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, cover_image: publicUrl });
      toast.success('Image uploaded!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tools: formData.tools ? formData.tools.split(',').map(t => t.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        category_id: formData.category_id || null,
      };

      if (id) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Project updated!');
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project created!');
      }

      navigate('/admin/projects');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/projects')}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>
        <h1 className="text-4xl font-bold mb-2">
          {id ? 'Edit Project' : 'New Project'}
        </h1>
        <p className="text-muted">Fill in the project details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-muted/5 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value)
                  });
                }}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="Amazing Brand Identity Design"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="amazing-brand-identity"
              />
              <p className="text-xs text-muted mt-1">URL: /work/{formData.slug}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.filter(c => c.slug !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Client</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="Client Name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
              placeholder="Brief description for project cards..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Description</label>
            <textarea
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
              placeholder="Detailed project description..."
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-muted/5 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Cover Image</h2>

          {formData.cover_image ? (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={formData.cover_image}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, cover_image: '' })}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="block aspect-video border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors cursor-pointer">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-muted mb-2" />
                <span className="text-muted">
                  {uploading ? 'Uploading...' : 'Click to upload cover image'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Project Details */}
        <div className="bg-muted/5 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Project Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Challenge</label>
              <textarea
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
                placeholder="What was the challenge?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Design Approach</label>
              <textarea
                value={formData.approach}
                onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
                placeholder="How did you approach the design?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Solution</label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
                placeholder="What was the solution?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Creative Direction</label>
              <textarea
                value={formData.creative_direction}
                onChange={(e) => setFormData({ ...formData, creative_direction: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none resize-none"
                placeholder="Creative direction notes..."
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-muted/5 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Additional Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tools Used</label>
              <input
                type="text"
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="Photoshop, Illustrator, Figma (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="branding, logo, identity (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video URL (YouTube/Vimeo)</label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="https://youtube.com/embed/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">External URL (Behance, Dribbble, etc.)</label>
              <input
                type="url"
                value={formData.external_url}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="https://behance.net/..."
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-muted/5 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Settings</h2>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
              />
              <div>
                <div className="font-medium">Featured Project</div>
                <div className="text-sm text-muted">Show this project prominently</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
              />
              <div>
                <div className="font-medium">Published</div>
                <div className="text-sm text-muted">Make this project visible on your portfolio</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : (id ? 'Update Project' : 'Create Project')}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-3 border border-border rounded-lg hover:border-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
