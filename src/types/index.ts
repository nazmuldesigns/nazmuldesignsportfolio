// src/types/index.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  year: string | null;
  client: string | null;
  short_description: string | null;
  full_description: string | null;
  challenge: string | null;
  approach: string | null;
  solution: string | null;
  creative_direction: string | null;
  tools: string[] | null;
  tags: string[] | null;
  cover_image: string | null;
  video_url: string | null;
  external_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  number: string | null;
  description: string | null;
  image: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  client_name: string;
  client_role: string | null;
  review_text: string;
  client_image: string | null;
  rating: number;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pricing {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
  features: string[] | null;
  featured: boolean;
  visibility: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string | null;
  enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  brand_name: string | null;
  professional_title: string | null;
  experience: string | null;
  location: string | null;
  biography: string | null;
  profile_image: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  seo_description: string | null;
  og_image: string | null;
  favicon: string | null;
  accent_color: string;
  contact_email: string | null;
  whatsapp: string | null;
  phone: string | null;
  footer_text: string | null;
  copyright_text: string | null;
  created_at: string;
  updated_at: string;
}
