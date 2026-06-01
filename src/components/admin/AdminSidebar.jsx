import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, LayoutDashboard, FileText, CheckCircle, Map, BarChart3, Users, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Laporan', path: '/admin/laporan', icon: FileText },
  { label: 'Verifikasi', path: '/admin/verifikasi', icon: CheckCircle },
  { label: 'Peta', path: '/peta', icon: Map },
  { label: 'Analisis', path: '/admin/analisis', icon: BarChart3 },
  { label: 'Statistik', path: '/admin/statistik', icon: BarChart3 },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col shrink-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">TitikTertib</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => base44.auth.logout('/')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}