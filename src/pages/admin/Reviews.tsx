// src/pages/admin/Reviews.tsx
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, Trash2, Edit, X, Star } from 'lucide-react';
import type { Review } from '../../types';

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    review_text: '',
    rating: 5,
    published: false,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('sort_order');

    if (data) setReviews(data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('reviews')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Review updated!');
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert([{ ...formData, sort_order: reviews.length }]);

        if (error) throw error;
        toast.success('Review added!');
      }

      resetForm();
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Review deleted!');
      fetchReviews();
    }
  }

  function handleEdit(review: Review) {
    setEditingId(review.id);
    setFormData({
      client_name: review.client_name,
      client_role: review.client_role || '',
      review_text: review.review_text,
      rating: review.rating,
      published: review.published,
    });
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      client_name: '',
      client_role: '',
      review_text: '',
      rating: 5,
      published: false,
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Reviews</h1>
        <p className="text-muted">Manage client testimonials</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-muted/5 border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'Edit Review' : 'Add New Review'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Client Name *</label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Client Role</label>
            <input
              type="text"
              value={formData.client_role}
              onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="CEO at Company"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Review *</label>
          <textarea
            value={formData.review_text}
            onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
            placeholder="Client's feedback..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                className={`p-2 rounded-lg transition-colors ${
                  formData.rating >= rating
                    ? 'text-yellow-500'
                    : 'text-muted hover:text-yellow-500'
                }`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
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
            {editingId ? 'Update' : 'Add'} Review
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

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-muted/5 border border-border rounded-xl p-6 hover:border-accent transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <h3 className="font-bold">{review.client_name}</h3>
                {review.client_role && (
                  <p className="text-sm text-muted">{review.client_role}</p>
                )}
                {!review.published && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500">
                    Draft
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-muted italic">"{review.review_text}"</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>No reviews yet. Add your first client testimonial above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
