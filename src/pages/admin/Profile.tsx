// src/pages/admin/Profile.tsx
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export function Profile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    brand_name: '',
    professional_title: '',
    experience: '',
    location: '',
    biography: '',
    email: '',
    phone: '',
    whatsapp: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
    } else {
      // Create profile if doesn't exist
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{ user_id: user.id }])
        .select()
        .single();

      if (newProfile) setProfile(newProfile);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-muted">Manage your personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-muted/5 border border-border rounded-2xl p-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="Md. Nazmul Hasan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand Name</label>
            <input
              type="text"
              value={profile.brand_name}
              onChange={(e) => setProfile({ ...profile, brand_name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="Nazmul Designs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Professional Title</label>
            <input
              type="text"
              value={profile.professional_title}
              onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="Graphic Designer & Visual Creative"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Experience</label>
            <input
              type="text"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="4+ Years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="Bangladesh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="nazmul@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="+880 1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <input
              type="tel"
              value={profile.whatsapp}
              onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none"
              placeholder="+880 1234567890"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Biography</label>
          <textarea
            value={profile.biography}
            onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
