// src/pages/admin/Pricing.tsx
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, Trash2, Edit, X } from 'lucide-react';
import type { Pricing as PricingType } from '../../types';

export function Pricing() {
  const [packages, setPackages] = useState<PricingType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    features: [] as string[],
    featured: false,
    visibility: 'visible',
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  async function fetchPricing() {
    const { data } = await supabase
      .from('pricing')
      .select('*')
      .order('sort_order');

    if (data) setPackages(data);
  }

  function handleAddFeature() {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  }

  function handleRemoveFeature(index: number) {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const dataToSave = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (editingId) {
        const { error } = await supabase
          .from('pricing')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Package updated!');
      } else {
        const { error } = await supabase
          .from('pricing')
          .insert([{ ...dataToSave, sort_order: packages.length }]);

        if (error) throw error;
        toast.success('Package created!');
      }

      resetForm();
      fetchPricing();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this pricing package?')) return;

    const { error } = await supabase
      .from('pricing')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Package deleted!');
      fetchPricing();
    }
  }

  function handleEdit(pkg: PricingType) {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price?.toString() || '',
      currency: pkg.currency || 'USD',
      features: pkg.features || [],
      featured: pkg.featured,
      visibility: pkg.visibility,
    });
  }

  function resetForm() {
    setEditingId(null);
    setFeatureInput('');
    setFormData({
      name: '',
      description: '',
      price: '',
      currency: 'USD',
      features: [],
      featured: false,
      visibility: 'visible',
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pricing</h1>
        <p className="text-muted">Manage your pricing packages</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-muted/5 border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'Edit Package' : 'New Package'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Package Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="e.g. Starter, Pro, Premium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="299"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
                placeholder="USD"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
            placeholder="Brief package description"
          />
        </div>

        {/* Features List */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Features</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              className="flex-1 px-4 py-2 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="Add a feature..."
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-muted/20 border border-border rounded-lg hover:border-accent transition-colors"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {formData.features.map((feature, index) => (
              <li key={index} className="flex items-center justify-between bg-background border border-border px-4 py-2 rounded-lg">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
            />
            <div>
              <div className="font-medium">Featured Package</div>
              <div className="text-sm text-muted">Highlight this package</div>
            </div>
          </label>

          <div>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              className="w-full h-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
            >
              <option value="visible">Visible (Shows price)</option>
              <option value="contact">Contact for pricing</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <Save className="w-5 h-5" />
            {editingId ? 'Update' : 'Create'} Package
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

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`border rounded-xl p-6 ${
              pkg.featured ? 'border-accent bg-accent/5' : 'border-border bg-muted/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                {pkg.price && (
                  <div className="text-2xl font-bold mt-2">
                    {pkg.currency} {pkg.price}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-muted mb-4">
              Visibility: {pkg.visibility}
            </div>

            <ul className="space-y-2 text-sm">
              {pkg.features?.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
