// src/pages/admin/Media.tsx
import { useEffect, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Upload, Copy, Trash2, Image as ImageIcon } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  id: string;
  created_at: string;
}

export function Media() {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState('project-images');

  const buckets = [
    { id: 'project-images', name: 'Project Images' },
    { id: 'profile-images', name: 'Profile Images' },
    { id: 'service-images', name: 'Service Images' },
    { id: 'review-images', name: 'Review Images' },
    { id: 'site-assets', name: 'Site Assets' }
  ];

  const fetchMedia = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from(selectedBucket)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error fetching media:', error);
      return;
    }

    if (data) {
      // Filter out empty placeholder files
      const validFiles = data.filter(file =>
        file.name !== '.emptyFolderPlaceholder' &&
        !file.name.startsWith('.')
      );

      const filesWithUrls = validFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from(selectedBucket)
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: publicUrl,
          id: file.id ?? file.name,
          created_at: file.created_at ?? new Date().toISOString()
        };
      });

        setImages(filesWithUrls);
    }
  }, [selectedBucket]);

  useEffect(() => {
    void fetchMedia();
  }, [fetchMedia]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      try {
        const { error } = await supabase.storage
          .from(selectedBucket)
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
        } else {
          successCount++;
        }
      } catch (error: any) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`);
      fetchMedia();
    }

    setUploading(false);
    // Reset file input
    e.target.value = '';
  }

  async function handleDelete(fileName: string) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const { error } = await supabase.storage
      .from(selectedBucket)
      .remove([fileName]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Image deleted');
      fetchMedia();
    }
  }

  function copyToClipboard(url: string) {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Media Library</h1>
          <p className="text-muted">Manage your uploaded images</p>
        </div>

        <div>
          <label className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading...' : 'Upload Images'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Bucket Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {buckets.map((bucket) => (
          <button
            key={bucket.id}
            onClick={() => setSelectedBucket(bucket.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedBucket === bucket.id
                ? 'bg-accent text-background'
                : 'border border-border hover:border-accent'
            }`}
          >
            {bucket.name}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div key={image.name} className="group relative aspect-square bg-muted/10 rounded-xl overflow-hidden border border-border hover:border-accent transition-colors">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <button
                onClick={() => copyToClipboard(image.url)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy URL
              </button>

              <button
                onClick={() => handleDelete(image.name)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-20 bg-muted/5 rounded-2xl border border-border border-dashed">
          <ImageIcon className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No images found in this folder.</p>
          <p className="text-sm text-muted mt-2">Upload some images to get started</p>
        </div>
      )}
    </div>
  );
}
