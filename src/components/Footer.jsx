import React from 'react';
import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span className="font-bold">TitikTertib</span>
          </div>
          <p className="text-sm text-primary-foreground/70 text-center">
            Bersama wujudkan Tembalang yang tertib, aman, dan nyaman.
          </p>
          <p className="text-sm text-primary-foreground/50">
            &copy; 2025 TitikTertib. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}