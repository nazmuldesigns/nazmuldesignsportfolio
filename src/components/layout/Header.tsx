import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '#about' },
  { name: 'Services', path: '#services' },
  { name: 'Work', path: '#work' },
  { name: 'Reviews', path: '#reviews' },
  { name: 'Pricing', path: '#pricing' },
  { name: 'Contact', path: '#contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('profile_image')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.profile_image) setProfileImage(data.profile_image);
    };
    void loadProfileImage();

    
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 py-3 shadow-sm backdrop-blur-xl' : 'bg-transparent py-5'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="relative z-50 flex items-center gap-3">
            {profileImage ? <img src={profileImage} alt="Nazmul profile" className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-lg" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-lg">N</span>}
            <span className="font-display text-2xl italic">Nazmul</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-slate-100/90 p-1 lg:flex">
            {navLinks.map((link) => (
              <a key={link.path} href={link.path} className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">
                {link.name}
              </a>
            ))}
          </nav>

          <a href="#contact" className="group hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent lg:inline-flex">
            Let&apos;s Collaborate
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <button type="button" aria-label="Toggle menu" className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div className="fixed inset-0 z-40 bg-white lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex h-full flex-col items-center justify-center gap-6">
              {navLinks.map((link) => (
                <a key={link.path} href={link.path} className="text-3xl font-semibold" onClick={() => setIsMobileMenuOpen(false)}>{link.name}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
