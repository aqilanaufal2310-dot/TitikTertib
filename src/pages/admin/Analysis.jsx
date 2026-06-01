import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const TEMBALANG_CENTER = [-7.0496, 110.4381];

export default function Analysis() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: reports = [] } = useQuery({
    queryKey: ['approved-reports'],
    queryFn: () => base44.entities.Report.filter({ status: 'disetujui' }),
  });

  // Filter by date range
  const filtered = reports.filter(r => {
    if (startDate && r.created_date < startDate) return false;
    if (endDate && r.created_date > endDate + 'T23:59:59') return false;
    return true;
  });

  // Clustering
  const clusters = [];
  const visited = new Set();
  const RADIUS = 0.003;

  filtered.forEach((r, i) => {
    if (visited.has(i)) return;
    const cluster = { lat: r.latitude, lng: r.longitude, count: 1 };
    visited.add(i);
    filtered.forEach((r2, j) => {
      if (visited.has(j)) return;
      const dist = Math.sqrt(Math.pow(r.latitude - r2.latitude, 2) + Math.pow(r.longitude - r2.longitude, 2));
      if (dist < RADIUS) {
        cluster.lat = (cluster.lat * cluster.count + r2.latitude) / (cluster.count + 1);
        cluster.lng = (cluster.lng * cluster.count + r2.longitude) / (cluster.count + 1);
        cluster.count++;
        visited.add(j);
      }
    });
    clusters.push(cluster);
  });

  const maxCount = Math.max(...clusters.map(c => c.count), 1);
  const getColor = (count) => {
    const ratio = count / maxCount;
    if (ratio > 0.6) return '#ef4444';
    if (ratio > 0.3) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Analisis Spasial</h1>

      <Tabs defaultValue="density">
        <TabsList className="mb-6">
          <TabsTrigger value="density">Kepadatan</TabsTrigger>
          <TabsTrigger value="clustering">Clustering</TabsTrigger>
          <TabsTrigger value="temporal">Temporal</TabsTrigger>
        </TabsList>

        <TabsContent value="density">
          <div className="rounded-xl overflow-hidden border border-border" style={{ height: '500px' }}>
            <MapContainer center={TEMBALANG_CENTER} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {clusters.map((c, i) => (
                <CircleMarker
                  key={i}
                  center={[c.lat, c.lng]}
                  radius={Math.max(15, c.count * 8)}
                  pathOptions={{ color: getColor(c.count), fillColor: getColor(c.count), fillOpacity: 0.4, weight: 2 }}
                >
                  <Popup>{c.count} laporan</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </TabsContent>

        <TabsContent value="clustering">
          <div className="rounded-xl overflow-hidden border border-border" style={{ height: '500px' }}>
            <MapContainer center={TEMBALANG_CENTER} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {clusters.map((c, i) => (
                <CircleMarker
                  key={i}
                  center={[c.lat, c.lng]}
                  radius={Math.max(10, c.count * 5)}
                  pathOptions={{ color: 'hsl(213, 56%, 24%)', fillColor: 'hsl(199, 89%, 48%)', fillOpacity: 0.6, weight: 2 }}
                >
                  <Popup>{c.count} laporan dalam cluster ini</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </TabsContent>

        <TabsContent value="temporal">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filter Rentang Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="space-y-1">
                  <Label>Dari Tanggal</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Sampai Tanggal</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Total laporan dalam rentang ini: <strong>{filtered.length}</strong>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Parameters */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Parameter</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Dari Tanggal</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Sampai Tanggal</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}