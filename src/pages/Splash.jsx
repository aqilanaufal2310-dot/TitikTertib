import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Shield, Camera, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Splash() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Jika sudah login, redirect sesuai role
    const check = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const me = await base44.auth.me();
          if (me?.role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (me) {
            navigate('/beranda', { replace: true });
          } else {
            setChecking(false);
          }
        } else {
          setChecking(false);
        }
      } catch {
        setChecking(false);
      }
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent/40 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920')] bg-cover bg-center opacity-5" />

      {/* Floating icons decoration */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"
      >
        <Camera className="w-6 h-6 text-white/60" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-12 w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center"
      >
        <BarChart3 className="w-5 h-5 text-white/60" />
      </motion.div>
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-32 left-16 w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center"
      >
        <Shield className="w-5 h-5 text-white/60" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center text-center max-w-md"
      >
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <MapPin className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">TitikTertib</h1>
        <p className="text-white/70 text-sm font-medium mb-2 uppercase tracking-widest">Kawasan Tembalang</p>

        <p className="text-white/80 text-base leading-relaxed mb-10 mt-4">
          Platform pelaporan dan pemantauan parkir liar untuk mewujudkan Tembalang yang tertib dan nyaman.
        </p>

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full h-14 text-base font-semibold bg-white text-primary hover:bg-white/90 rounded-2xl shadow-lg"
            onClick={() => navigate('/login')}
          >
            Masuk ke Akun
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-base font-semibold border-white/40 text-white hover:bg-white/10 rounded-2xl"
            onClick={() => navigate('/register')}
          >
            Daftar Akun Baru
          </Button>
        </div>

        <p className="text-white/50 text-xs mt-8">
          Dengan masuk, Anda menyetujui ketentuan penggunaan platform TitikTertib.
        </p>
      </motion.div>
    </div>
  );
}