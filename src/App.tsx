// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/layout/CustomCursor';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';
import { Login } from './pages/admin/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Profile } from './pages/admin/Profile';
import { Projects } from './pages/admin/Projects';
import { ProjectEditor } from './pages/admin/ProjectEditor';
import { Services } from './pages/admin/Services';
import { Reviews } from './pages/admin/Reviews';
import { Pricing } from './pages/admin/Pricing';
import { Media } from './pages/admin/Media';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Toaster position="top-right" richColors />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        } />

        <Route path="/work/:slug" element={
          <>
            <Header />
            <ProjectDetail />
            <Footer />
          </>
        } />

        {/* Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectEditor />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="media" element={<Media />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
