// src/pages/admin/Profile.tsx
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, Upload } from 'lucide-react';

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
    profile_image: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      toast.error(`Could not load profile: ${error.message}`);
      return;
    }

    if (data) {
      setProfile({
        name: data.name ?? '',
        brand_name: data.brand_name ?? '',
        professional_title: data.professional_title ?? '',
        experience: data.experience ?? '',
        location: data.location ?? '',
        biography: data.biography ?? '',
        email: data.email ?? user.email ?? '',
        phone: data.phone ?? '',
        whatsapp: data.whatsapp ?? '',
        profile_image: data.profile_image ?? '',
      });
    } else {
      setProfile((current) => ({ ...current, email: user.email ?? '' }));
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = `profile/${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('profile-images').upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('profile-images').getPublicUrl(path);
      setProfile((current) => ({ ...current, profile_image: data.publicUrl }));
      toast.success('Profile image uploaded. Save profile to publish it.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const profilePayload = {
        user_id: user.id,
        name: profile.name || 'Nazmul Hasan',
        brand_name: profile.brand_name || null,
        professional_title: profile.professional_title || null,
        experience: profile.experience || null,
        location: profile.location || null,
        biography: profile.biography || null,
        profile_image: profile.profile_image || null,
        email: profile.email || user.email || null,
        phone: profile.phone || null,
        whatsapp: profile.whatsapp || null,
      };

      const { data: existingProfile, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
      if (lookupError) throw lookupError;

      const result = existingProfile
        ? await supabase.from('profiles').update(profilePayload).eq('id', existingProfile.id)
        : await supabase.from('profiles').insert(profilePayload);

      if (result.error) throw result.error;

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
          <label className="block text-sm font-medium mb-2">Profile image</label>
          <div className="flex items-center gap-4">
            {profile.profile_image && <img src={profile.profile_image} alt="Profile preview" className="h-20 w-20 rounded-full object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-3 hover:border-accent">
              <Upload className="h-5 w-5" /> Upload image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={loading} />
            </label>
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
