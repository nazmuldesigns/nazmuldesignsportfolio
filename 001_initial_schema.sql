-- supabase/migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand_name TEXT,
  professional_title TEXT,
  experience TEXT,
  location TEXT,
  biography TEXT,
  profile_image TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT DEFAULT 'Nazmul Designs',
  seo_description TEXT,
  og_image TEXT,
  favicon TEXT,
  accent_color TEXT DEFAULT '#3B82F6',
  contact_email TEXT,
  whatsapp TEXT,
  phone TEXT,
  footer_text TEXT,
  copyright_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  year TEXT,
  client TEXT,
  short_description TEXT,
  full_description TEXT,
  challenge TEXT,
  approach TEXT,
  solution TEXT,
  creative_direction TEXT,
  tools TEXT[],
  tags TEXT[],
  cover_image TEXT,
  video_url TEXT,
  external_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project images
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  number TEXT,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  review_text TEXT NOT NULL,
  client_image TEXT,
  rating INTEGER DEFAULT 5,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing
CREATE TABLE pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  features TEXT[],
  featured BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'visible',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social links
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  proficiency INTEGER DEFAULT 80,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media library
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  bucket TEXT,
  folder TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Site settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can update site settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published categories are viewable by everyone" ON categories FOR SELECT USING (published = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects are viewable by everyone" ON projects FOR SELECT USING (published = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage projects" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Project images
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project images are viewable with their projects" ON project_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND (projects.published = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')))
);
CREATE POLICY "Only admins can manage project images" ON project_images FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published services are viewable by everyone" ON services FOR SELECT USING (published = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published reviews are viewable by everyone" ON reviews FOR SELECT USING (published = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage reviews" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Pricing
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible pricing is viewable by everyone" ON pricing FOR SELECT USING (visibility = 'visible' OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage pricing" ON pricing FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Social links
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enabled social links are viewable by everyone" ON social_links FOR SELECT USING (enabled = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage social links" ON social_links FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Experience
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published experience is viewable by everyone" ON experience FOR SELECT USING (published = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage experience" ON experience FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published skills are viewable by everyone" ON skills FOR SELECT USING (published = true OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can manage skills" ON skills FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media is viewable by everyone" ON media FOR SELECT USING (true);
CREATE POLICY "Only admins can manage media" ON media FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- User roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- Functions

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial data
INSERT INTO site_settings (site_title, seo_description, footer_text, copyright_text) VALUES (
  'Md. Nazmul Hasan — Graphic Designer | Nazmul Designs',
  'Md. Nazmul Hasan is a graphic designer with 4+ years of experience specializing in branding, social media design, advertising, editorial and visual communication.',
  'Designing visuals that make brands impossible to ignore.',
  '© 2024 Nazmul Designs. All rights reserved.'
);

-- Seed categories
INSERT INTO categories (name, slug, sort_order, published) VALUES
  ('All', 'all', 0, true),
  ('Branding', 'branding', 1, true),
  ('Logo', 'logo', 2, true),
  ('Social Media', 'social-media', 3, true),
  ('Advertising', 'advertising', 4, true),
  ('Poster', 'poster', 5, true),
  ('Editorial', 'editorial', 6, true),
  ('Other', 'other', 7, true);

-- Seed services
INSERT INTO services (title, number, description, sort_order, published) VALUES
  (
    'Logo & Brand Identity',
    '01',
    'Creating memorable logos and comprehensive brand identity systems that capture your brand''s essence and make it stand out in the market.',
    1,
    true
  ),
  (
    'Social Media Design',
    '02',
    'Designing engaging social media graphics, posts, stories, and ad creatives that drive engagement and build your brand presence across platforms.',
    2,
    true
  ),
  (
    'Advertising & Campaign Design',
    '03',
    'Developing compelling advertising creatives and campaign visuals that capture attention and communicate your message effectively.',
    3,
    true
  ),
  (
    'Poster, Banner & Flyer Design',
    '04',
    'Crafting eye-catching posters, banners, and flyers for events, promotions, and marketing campaigns that make people stop and look.',
    4,
    true
  ),
  (
    'Magazine & Editorial Design',
    '05',
    'Designing sophisticated editorial layouts for magazines, brochures, and publications with strong typography and visual storytelling.',
    5,
    true
  ),
  (
    'Marketing Visuals',
    '06',
    'Creating diverse marketing materials and visual content that supports your marketing strategy and brand communication goals.',
    6,
    true
  );

-- Seed social links (empty URLs - to be filled by admin)
INSERT INTO social_links (name, icon, url, enabled, sort_order) VALUES
  ('Behance', 'behance', '', false, 1),
  ('Facebook', 'facebook', '', false, 2),
  ('Instagram', 'instagram', '', false, 3),
  ('LinkedIn', 'linkedin', '', false, 4),
  ('Dribbble', 'dribbble', '', false, 5);
