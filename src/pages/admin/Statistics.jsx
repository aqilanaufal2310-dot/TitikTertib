import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { subDays, format } from 'date-fns';

const COLORS = ['hsl(213, 56%, 24%)', 'hsl(199, 89%, 48%)', 'hsl(38, 92%, 50%)'];

export default function Statistics() {
  const [period, setPeriod] = useState('7');

  const { data: reports = [] } = useQuery({
    queryKey: ['all-reports'],
    queryFn: () => base44.entities.Report.list('-created_date'),
  });

  const days = parseInt(period);
  const total = reports.length;
  const approved = reports.filter(r => r.status === 'disetujui').length;
  const rejected = reports.filter(r => r.status === 'ditolak').length;

  // Daily chart
  const dailyData = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = reports.filter(r => r.created_date && r.created_date.startsWith(dateStr)).length;
    return { name: format(date, 'dd MMM'), count };
  });

  // Vehicle type pie
  const vehicleData = [
    { name: 'Mobil', value: reports.filter(r => r.vehicle_type === 'mobil').length },
    { name: 'Motor', value: reports.filter(r => r.vehicle_type === 'motor').length },
    { name: 'Lainnya', value: reports.filter(r => r.vehicle_type === 'lainnya').length },
  ].filter(d => d.value > 0);

  const stats = [
    { label: 'Total Laporan', value: total, icon: FileText },
    { label: 'Rata-rata/Hari', value: days > 0 ? Math.round(total / days) : 0, icon: FileText },
    { label: 'Laporan Valid', value: approved, icon: CheckCircle },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistik & Grafik</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Hari Terakhir</SelectItem>
            <SelectItem value="14">14 Hari Terakhir</SelectItem>
            <SelectItem value="30">30 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 text-center">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Laporan per Hari</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Persentase Jenis Kendaraan</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicleData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">Belum ada data</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehicleData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}