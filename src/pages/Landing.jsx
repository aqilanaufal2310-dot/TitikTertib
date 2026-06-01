import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Camera, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: MapPin,
    title: 'Pemetaan Interaktif',
    desc: 'Lihat lokasi parkir liar di peta interaktif kawasan Tembalang secara real-time.',
  },
  {
    icon: Camera,
    title: 'Laporan Mudah',
    desc: 'Laporkan parkir liar dengan foto bukti dan lokasi GPS hanya dalam beberapa langkah.',
  },
  {
    icon: BarChart3,
    title: 'Analisis Hotspot',
    desc: 'Visualisasi heatmap dan statistik untuk mengidentifikasi area rawan parkir liar.',
  },
  {
    icon: Shield,
    title: 'Verifikasi Admin',
    desc: 'Setiap laporan diverifikasi oleh admin untuk memastikan validitas data.',
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent/30 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Kawasan Tembalang</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
                Pantau dan Laporkan{' '}
                <span className="text-accent">Parkir Liar</span>{' '}
                di Kawasan Tembalang
              </h1>
              <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
                Bersama kita wujudkan Tembalang yang tertib dan nyaman. Laporkan parkir liar yang Anda temui dan bantu kami memetakan masalah ini.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/peta">
                  <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                    <MapPin className="w-5 h-5" />
                    Lihat Peta
                  </Button>
                </Link>
                <Link to="/laporkan">
                  <Button size="lg" className="gap-2 font-semibold bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Camera className="w-5 h-5" />
                    Laporkan Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Fitur Utama</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              TitikTertib menyediakan berbagai fitur untuk membantu memetakan dan mengatasi masalah parkir liar.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Mulai Berkontribusi Sekarang</h2>
          <p className="text-muted-foreground mb-8">
            Setiap laporan yang Anda kirim membantu kami memahami masalah parkir liar di kawasan Tembalang.
          </p>
          <Link to="/laporkan">
            <Button size="lg" className="gap-2 font-semibold">
              <Camera className="w-5 h-5" />
              Buat Laporan
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}