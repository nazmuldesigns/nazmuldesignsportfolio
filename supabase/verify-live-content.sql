-- Run this in Supabase SQL Editor to verify the exact rows the public site needs.

select id, title, slug, published, cover_image, category_id
from public.projects
order by sort_order, created_at desc;

select id, name, profile_image, updated_at
from public.profiles
order by updated_at desc;

-- If a newly created project is not live, replace the slug and run:
-- update public.projects set published = true where slug = 'your-project-slug';

-- Confirm storage buckets are public:
select id, name, public from storage.buckets
where id in ('project-images', 'profile-images', 'service-images', 'review-images', 'site-assets');
