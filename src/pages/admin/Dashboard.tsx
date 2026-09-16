// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  FolderOpen,
  Briefcase,
  Star,
  DollarSign,
  Eye,
  ArrowUpRight
} from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalServices: 0,
    totalReviews: 0,
    publishedReviews: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const [projects, publishedProjects, services, reviews, publishedReviews] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('published', true),
    ]);

    setStats({
      totalProjects: projects.count || 0,
      publishedProjects: publishedProjects.count || 0,
      totalServices: services.count || 0,
      totalReviews: reviews.count || 0,
      publishedReviews: publishedReviews.count || 0,
    });
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      sublabel: `${stats.publishedProjects} published`,
      icon: FolderOpen,
      color: 'bg-blue-500/10 text-blue-500',
      link: '/admin/projects'
    },
    {
      label: 'Services',
      value: stats.totalServices,
      icon: Briefcase,
      color: 'bg-green-500/10 text-green-500',
      link: '/admin/services'
    },
    {
      label: 'Reviews',
      value: stats.totalReviews,
      sublabel: `${stats.publishedReviews} published`,
      icon: Star,
      color: 'bg-yellow-500/10 text-yellow-500',
      link: '/admin/reviews'
    },
    {
      label: 'Pricing Plans',
      value: '3',
      icon: DollarSign,
      color: 'bg-purple-500/10 text-purple-500',
      link: '/admin/pricing'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted">Manage your portfolio content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-muted/5 border border-border rounded-2xl p-6 hover:border-accent transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted mb-1">{stat.label}</div>
              {stat.sublabel && (
                <div className="text-xs text-muted">{stat.sublabel}</div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-muted/5 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/projects/new"
              className="block px-4 py-3 rounded-lg bg-accent text-background font-medium hover:bg-accent/90 transition-colors text-center"
            >
              + Add New Project
            </Link>
            <Link
              to="/admin/media"
              className="block px-4 py-3 rounded-lg border border-border hover:border-accent transition-colors text-center"
            >
              Upload Media
            </Link>
            <Link
              to="/admin/reviews/new"
              className="block px-4 py-3 rounded-lg border border-border hover:border-accent transition-colors text-center"
            >
              + Add Review
            </Link>
          </div>
        </div>

        <div className="bg-muted/5 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Portfolio</h2>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent hover:underline mb-4"
          >
            <Eye className="w-5 h-5" />
            View Public Portfolio
          </a>
          <div className="space-y-2 text-sm text-muted">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>All changes are instantly live</p>
          </div>
        </div>
      </div>
    </div>
  );
}
