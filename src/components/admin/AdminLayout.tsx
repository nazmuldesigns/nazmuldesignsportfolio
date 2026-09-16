// src/components/admin/AdminLayout.tsx
import { useEffect, useState, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Image as ImageIcon,

  DollarSign,

  LogOut,
  Menu,
  X,
  FolderOpen,
  MessageSquare,

} from 'lucide-react';
import { toast } from 'sonner';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Check if the signed-in user has an admin role.
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Admin role lookup failed:', roleError);
        toast.error(`Could not verify admin access: ${roleError.message}`);
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      if (roleData?.role?.trim().toLowerCase() !== 'admin') {
        toast.error(
          `Access denied. Found role: ${roleData?.role ?? 'none'} for user ${user.email ?? user.id}.`,
        );
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
    { icon: Briefcase, label: 'Services', path: '/admin/services' },
    { icon: FolderOpen, label: 'Projects', path: '/admin/projects' },
    { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
    { icon: DollarSign, label: 'Pricing', path: '/admin/pricing' },
    { icon: ImageIcon, label: 'Media Library', path: '/admin/media' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">NAZMUL<span className="text-accent">.</span></h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-muted/5 border-r border-border z-40
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">NAZMUL<span className="text-accent">.</span></h1>
          <p className="text-sm text-muted">Admin Panel</p>
        </div>

        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-accent text-background'
                    : 'text-muted hover:bg-muted/10 hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 pt-20 lg:pt-0">
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
