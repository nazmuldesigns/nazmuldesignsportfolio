import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Review } from '../../../types';

const fallbackReviews: Review[] = [
  { id: 'review-1', client_name: 'Ariana Rahman', client_role: 'Founder, Good Day Market', review_text: 'Nazmul understood the brief immediately and gave our brand a visual voice that finally feels consistent.', client_image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, sort_order: 1, published: true, created_at: '', updated_at: '' },
  { id: 'review-2', client_name: 'Farhan Kabir', client_role: 'Marketing Lead, Northline Studio', review_text: 'The work feels premium, thoughtful and made for real-world use. Our campaign engagement improved noticeably.', client_image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, sort_order: 2, published: true, created_at: '', updated_at: '' },
  { id: 'review-3', client_name: 'Nabila Sultana', client_role: 'Founder, Form House', review_text: 'Fast communication, strong ideas and beautiful execution. Nazmul is now our go-to designer.', client_image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, sort_order: 3, published: true, created_at: '', updated_at: '' },
];

export function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase.from('reviews').select('*').eq('published', true).order('sort_order');
      if (data && data.length > 0) setReviews(data);
    };
    void fetchReviews();
  }, []);


  return (
    <section id="reviews" className="relative overflow-hidden py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Client reviews</div>
          <h2 className="mb-16 text-center text-5xl font-bold md:text-7xl">Kind words from <span className="font-display font-medium italic text-indigo-600">good people.</span></h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => <motion.article key={review.id} initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.1 }} className="rounded-[2rem] border border-indigo-100 bg-indigo-50/60 p-8"><Quote className="mb-6 h-9 w-9 text-indigo-500" /><div className="mb-5 flex gap-1">{Array.from({ length: review.rating || 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div><p className="mb-8 text-lg leading-8 text-slate-700">“{review.review_text}”</p><div className="flex items-center gap-3">{review.client_image ? <img src={review.client_image} alt={review.client_name} className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-indigo-600">{review.client_name.charAt(0)}</div>}<div><div className="font-bold">{review.client_name}</div><div className="text-sm text-slate-500">{review.client_role}</div></div></div></motion.article>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
