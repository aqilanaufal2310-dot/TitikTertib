import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TEMBALANG_CENTER = [-7.0496, 110.4381];

function HeatCircles({ reports }) {
  // Simple density-based circles - group nearby reports
  const clusters = [];
  const visited = new Set();
  const RADIUS = 0.003; // ~300m

  reports.forEach((r, i) => {
    if (visited.has(i)) return;
    const cluster = { lat: r.latitude, lng: r.longitude, count: 1, reports: [r] };
    visited.add(i);
    
    reports.forEach((r2, j) => {
      if (visited.has(j)) return;
      const dist = Math.sqrt(Math.pow(r.latitude - r2.latitude, 2) + Math.pow(r.longitude - r2.longitude, 2));
      if (dist < RADIUS) {
        cluster.lat = (cluster.lat * cluster.count + r2.latitude) / (cluster.count + 1);
        cluster.lng = (cluster.lng * cluster.count + r2.longitude) / (cluster.count + 1);
        cluster.count++;
        cluster.reports.push(r2);
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
    <>
      {clusters.map((c, i) => (
        <CircleMarker
          key={i}
          center={[c.lat, c.lng]}
          radius={Math.max(15, Math.min(50, c.count * 8))}
          pathOptions={{
            color: getColor(c.count),
            fillColor: getColor(c.count),
            fillOpacity: 0.4,
            weight: 2,
          }}
        />
      ))}
    </>
  );
}

export default function Heatmap() {
  const [mode, setMode] = useState('heatmap');

  const { data: reports = [] } = useQuery({
    queryKey: ['reports-approved'],
    queryFn: () => base44.entities.Report.filter({ status: 'disetujui' }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Heatmap Titik Rawan</h1>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="heatmap">Heatmap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl overflow-hidden border border-border shadow-sm" style={{ height: 'calc(100vh - 260px)' }}>
        <MapContainer
          center={TEMBALANG_CENTER}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatCircles reports={reports} />
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-card border border-border rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Kepadatan</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500 opacity-60" />
            <span className="text-xs text-muted-foreground">Tinggi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-yellow-500 opacity-60" />
            <span className="text-xs text-muted-foreground">Sedang</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 opacity-60" />
            <span className="text-xs text-muted-foreground">Rendah</span>
          </div>
        </div>
      </div>
    </div>
  );
}