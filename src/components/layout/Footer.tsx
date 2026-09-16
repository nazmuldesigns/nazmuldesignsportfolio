// src/components/layout/Footer.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { SocialLink } from '../../types';

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  async function fetchFooterData() {
    const [social, site] = await Promise.all([
      supabase.from('social_links').select('*').eq('enabled', true).order('sort_order'),
      supabase.from('site_settings').select('*').single()
    ]);

    if (social.data) setSocialLinks(social.data);
    if (site.data) setSettings(site.data);
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              NAZMUL<span className="text-accent">.</span>
            </div>
            <p className="text-muted">
              Graphic Designer & Visual Creative
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Work', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-muted hover:text-accent transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-muted">
              <li>Logo Design</li>
              <li>Brand Identity</li>
              <li>Social Media</li>
              <li>Advertising</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition-all flex items-center justify-center"
                >
                  {link.name.substring(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted text-sm">
          <p>{settings?.copyright_text || `© ${currentYear} Nazmul Designs. All rights reserved.`}</p>
          <p>Designed & Built with passion</p>
        </div>
      </div>
    </footer>
  );
}
