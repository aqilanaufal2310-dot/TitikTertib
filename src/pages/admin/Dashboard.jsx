import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: reports = [] } = useQuery({
    queryKey: ['all-reports'],
    queryFn: () => base44.entities.Report.list('-created_date'),
  });

  const total = reports.length;
  const pending = reports.filter(r => r.status === 'menunggu').length;
  const approved = reports.filter(r => r.status === 'disetujui').length;
  const rejected = reports.filter(r => r.status === 'ditolak').length;

  // Chart: reports per day (last 7 days)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = reports.filter(r => r.created_date && r.created_date.startsWith(dateStr)).length;
    return { name: format(date, 'dd MMM'), count };
  });

  // Top locations
  const locationCounts = {};
  reports.filter(r => r.address).forEach(r => {
    locationCounts[r.address] = (locationCounts[r.address] || 0) + 1;
  });
  const topLocations = Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const stats = [
    { label: 'Total Laporan', value: total, icon: FileText, color: 'text-primary' },
    { label: 'Menunggu', value: pending, icon: Clock, color: 'text-yellow-600' },
    { label: 'Disetujui', value: approved, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Ditolak', value: rejected, icon: XCircle, color: 'text-red-600' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon className={`w-8 h-8 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Grafik Laporan (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hotspot Terbanyak</CardTitle>
          </CardHeader>
          <CardContent>
            {topLocations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data</p>
            ) : (
              <div className="space-y-3">
                {topLocations.map(([loc, count], i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{loc}</p>
                      <p className="text-xs text-muted-foreground">{count} laporan</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}