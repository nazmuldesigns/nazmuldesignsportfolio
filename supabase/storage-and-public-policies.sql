-- Run this in Supabase SQL Editor after 001_initial_schema.sql.
-- It makes published admin content readable by the public site and creates upload buckets.

-- Public storage buckets used by the admin upload screens.
insert into storage.buckets (id, name, public)
values
  ('project-images', 'project-images', true),
  ('profile-images', 'profile-images', true),
  ('service-images', 'service-images', true),
  ('review-images', 'review-images', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

-- Remove old policies if this script is run more than once.
drop policy if exists "Public can view published projects" on public.projects;
drop policy if exists "Public can view published services" on public.services;
drop policy if exists "Public can view published reviews" on public.reviews;
drop policy if exists "Public can view visible pricing" on public.pricing;
drop policy if exists "Authenticated admins can manage project images" on storage.objects;
drop policy if exists "Authenticated admins can manage profile images" on storage.objects;
drop policy if exists "Authenticated admins can manage service images" on storage.objects;
drop policy if exists "Authenticated admins can manage review images" on storage.objects;
drop policy if exists "Public can read portfolio images" on storage.objects;

create policy "Public can view published projects"
on public.projects for select
to anon, authenticated
using (published = true);

create policy "Public can view published services"
on public.services for select
to anon, authenticated
using (published = true);

create policy "Public can view published reviews"
on public.reviews for select
to anon, authenticated
using (published = true);

create policy "Public can view visible pricing"
on public.pricing for select
to anon, authenticated
using (visibility = 'visible');

create policy "Authenticated admins can manage project images"
on storage.objects for all
to authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

create policy "Authenticated admins can manage profile images"
on storage.objects for all
to authenticated
using (bucket_id = 'profile-images')
with check (bucket_id = 'profile-images');

create policy "Authenticated admins can manage service images"
on storage.objects for all
to authenticated
using (bucket_id = 'service-images')
with check (bucket_id = 'service-images');

create policy "Authenticated admins can manage review images"
on storage.objects for all
to authenticated
using (bucket_id = 'review-images')
with check (bucket_id = 'review-images');

create policy "Public can read portfolio images"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('project-images', 'profile-images', 'service-images', 'review-images', 'site-assets'));
