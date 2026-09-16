-- Portfolio content seed for Nazmul Designs.
-- Run after 001_initial_schema.sql. Replace profile email/user id if needed.
-- All copy, image URLs and fields remain editable from the admin panel.

-- Profile (replace the email and user_id with your Auth user)
insert into public.profiles (
  user_id, name, brand_name, professional_title, experience, location,
  biography, profile_image, email
)
select
  id,
  'Md. Nazmul Hasan',
  'Nazmul Designs',
  'Graphic Designer & Visual Creative',
  '4+ years',
  'Dhaka, Bangladesh',
  'I create scroll-stopping social media design, brand identities and campaign visuals that help ambitious brands look consistent, confident and memorable.',
  'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1200',
  email
from auth.users
where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict (id) do update set
  name = excluded.name,
  brand_name = excluded.brand_name,
  professional_title = excluded.professional_title,
  experience = excluded.experience,
  location = excluded.location,
  biography = excluded.biography,
  profile_image = excluded.profile_image,
  email = excluded.email,
  updated_at = now();

-- Categories
insert into public.categories (name, slug, sort_order, published) values
  ('All', 'all', 0, true),
  ('Social Media', 'social-media', 1, true),
  ('Brand Identity', 'brand-identity', 2, true),
  ('Campaign Design', 'campaign-design', 3, true),
  ('Product Creative', 'product-creative', 4, true)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order, published = true;

-- Projects: Pexels images are replaceable through the admin project editor.
with category_ids as (
  select slug, id from public.categories
)
insert into public.projects (
  title, slug, category_id, year, client, short_description, full_description,
  challenge, approach, solution, creative_direction, tools, tags, cover_image,
  featured, published, sort_order
)
select * from (values
  (
    'Urban Motion Campaign', 'urban-motion-campaign', (select id from category_ids where slug = 'campaign-design'), '2025', 'Northline Studio',
    'A bold campaign system built for movement, energy and attention.',
    'A modular campaign identity for a modern lifestyle brand, designed to work across social posts, stories and launch graphics.',
    'The brand needed to stand out in a crowded feed without losing clarity.',
    'We combined oversized typography, energetic crops and a flexible colour system.',
    'A complete visual toolkit that stays recognisable across every touchpoint.',
    'High-contrast editorial composition with a confident, youthful rhythm.',
    ARRAY['Photoshop', 'Illustrator', 'Figma'], ARRAY['campaign', 'social media', 'art direction'],
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400', true, true, 1
  ),
  (
    'Pure Product Stories', 'pure-product-stories', (select id from category_ids where slug = 'product-creative'), '2025', 'Pure & Co.',
    'Premium product visuals that make simple products feel unforgettable.',
    'A clean product storytelling direction for social content and promotional layouts.',
    'The product needed a stronger premium perception online.',
    'We used soft light, considered spacing and confident headline systems.',
    'A reusable social media template family for launches and evergreen content.',
    'Minimal, clean and tactile with a premium editorial finish.',
    ARRAY['Photoshop', 'Lightroom', 'Figma'], ARRAY['product', 'minimal', 'branding'],
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1400', true, true, 2
  ),
  (
    'Studio Brand Identity', 'studio-brand-identity', (select id from category_ids where slug = 'brand-identity'), '2024', 'Form House',
    'A flexible identity system for a creative studio with big ambitions.',
    'From logo direction to social templates, this identity creates a consistent visual voice.',
    'The existing identity looked fragmented across different platforms.',
    'We simplified the system into a distinctive mark, typography and layout language.',
    'A confident, flexible identity that can grow with the studio.',
    'Warm neutrals, strong type and thoughtful whitespace.',
    ARRAY['Illustrator', 'Figma', 'InDesign'], ARRAY['identity', 'logo', 'visual system'],
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1400', true, true, 3
  ),
  (
    'Everyday Social Series', 'everyday-social-series', (select id from category_ids where slug = 'social-media'), '2024', 'Good Day Market',
    'A friendly content series designed to build daily brand recognition.',
    'A set of social-first compositions that balance useful information with personality.',
    'The brand needed regular content that did not feel repetitive.',
    'We created a repeatable grid with changing image crops, headlines and accent shapes.',
    'A complete monthly content direction that is easy to edit and scale.',
    'Bright, approachable and human with a little editorial polish.',
    ARRAY['Photoshop', 'Canva', 'Figma'], ARRAY['content', 'social', 'campaign'],
    'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1400', false, true, 4
  )
) as projects(title, slug, category_id, year, client, short_description, full_description, challenge, approach, solution, creative_direction, tools, tags, cover_image, featured, published, sort_order)
on conflict (slug) do update set
  title = excluded.title, category_id = excluded.category_id, year = excluded.year, client = excluded.client,
  short_description = excluded.short_description, full_description = excluded.full_description,
  challenge = excluded.challenge, approach = excluded.approach, solution = excluded.solution,
  creative_direction = excluded.creative_direction, tools = excluded.tools, tags = excluded.tags,
  cover_image = excluded.cover_image, featured = excluded.featured, published = excluded.published,
  sort_order = excluded.sort_order, updated_at = now();

-- Services
insert into public.services (title, number, description, image, sort_order, published) values
  ('Social Media Design', '01', 'Scroll-stopping posts, carousels, stories and ad creatives designed to turn attention into action.', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1000', 1, true),
  ('Brand Identity', '02', 'Logo direction, colour systems, typography and brand guidelines that make your business instantly recognisable.', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1000', 2, true),
  ('Campaign Creative', '03', 'Big ideas translated into cohesive campaign visuals for launches, promotions and important brand moments.', 'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1000', 3, true),
  ('Product Visuals', '04', 'Clean, premium product graphics and art direction that help products look as good as they feel.', 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1000', 4, true)
on conflict do nothing;

-- Five-star reviews
insert into public.reviews (client_name, client_role, review_text, client_image, rating, sort_order, published) values
  ('Ariana Rahman', 'Founder, Good Day Market', 'Nazmul understood the brief immediately and gave our brand a visual voice that finally feels consistent.', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200', 5, 1, true),
  ('Farhan Kabir', 'Marketing Lead, Northline Studio', 'The work feels premium, thoughtful and made for real-world use. Our campaign engagement improved noticeably.', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', 5, 2, true),
  ('Nabila Sultana', 'Founder, Form House', 'Fast communication, strong ideas and beautiful execution. Nazmul is now our go-to designer.', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', 5, 3, true),
  ('Rafi Ahmed', 'Creative Director, Pure & Co.', 'Every detail was considered. The final product visuals look clean, confident and ready to sell.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200', 5, 4, true)
on conflict do nothing;
