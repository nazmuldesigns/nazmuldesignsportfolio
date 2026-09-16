// src/pages/admin/Categories.tsx
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, Trash2, Edit } from 'lucide-react';
import type { Category } from '../../types';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    published: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');

    if (data) setCategories(data);
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const slug = formData.slug || generateSlug(formData.name);

      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({ ...formData, slug })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Category updated!');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{ ...formData, slug, sort_order: categories.length }]);

        if (error) throw error;
        toast.success('Category added!');
      }

      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Category deleted!');
      fetchCategories();
    }
  }

  function handleEdit(category: Category) {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      published: category.published,
    });
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      published: true,
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Categories</h1>
        <p className="text-muted">Manage project categories</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-muted/5 border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="Branding"
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
              placeholder="branding"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm">Published</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <Save className="w-5 h-5" />
            {editingId ? 'Update' : 'Add'} Category
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-border rounded-lg hover:border-accent transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.filter(c => c.slug !== 'all').map((category) => (
          <div
            key={category.id}
            className="bg-muted/5 border border-border rounded-xl p-4 hover:border-accent transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{category.name}</h3>
                <p className="text-sm text-muted">/{category.slug}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
