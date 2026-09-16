// src/pages/admin/Services.tsx
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, Trash2, Edit, X } from 'lucide-react';
import type { Service } from '../../types';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    number: '',
    description: '',
    published: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('sort_order');

    if (data) setServices(data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Service updated!');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([{ ...formData, sort_order: services.length }]);

        if (error) throw error;
        toast.success('Service added!');
      }

      resetForm();
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Service deleted!');
      fetchServices();
    }
  }

  function handleEdit(service: Service) {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      number: service.number || '',
      description: service.description || '',
      published: service.published,
    });
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      title: '',
      number: '',
      description: '',
      published: true,
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Services</h1>
        <p className="text-muted">Manage your service offerings</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-muted/5 border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'Edit Service' : 'Add New Service'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Number</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="Logo & Brand Identity"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
            placeholder="Service description..."
          />
        </div>

        <div className="flex items-center gap-4 mb-6">
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
            {editingId ? 'Update' : 'Add'} Service
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:border-accent transition-colors"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-muted/5 border border-border rounded-xl p-6 hover:border-accent transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {service.number && (
                    <span className="text-sm font-mono text-muted">{service.number}</span>
                  )}
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  {!service.published && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500">
                      Draft
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-muted">{service.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>No services yet. Add your first service above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
