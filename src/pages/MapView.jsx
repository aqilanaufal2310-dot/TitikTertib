import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import ReportMap from '@/components/map/ReportMap';

export default function MapView() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list('-created_date'),
  });

  const filtered = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (vehicleFilter !== 'all' && r.vehicle_type !== vehicleFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Peta Persebaran Parkir Liar</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} laporan ditampilkan</p>
        </div>
        <Link to="/laporkan">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Laporkan
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="menunggu">Menunggu</SelectItem>
            <SelectItem value="disetujui">Disetujui</SelectItem>
            <SelectItem value="ditolak">Ditolak</SelectItem>
          </SelectContent>
        </Select>
        <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="mobil">Mobil</SelectItem>
            <SelectItem value="motor">Motor</SelectItem>
            <SelectItem value="lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="h-[500px] bg-muted rounded-xl animate-pulse" />
      ) : (
        <ReportMap reports={filtered} height="calc(100vh - 280px)" />
      )}

      {/* Legend */}
      <div className="mt-4 bg-card border border-border rounded-xl p-4">
        <p className="text-sm font-medium mb-2">Legenda</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-muted-foreground">Menunggu Verifikasi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Disetujui</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">Ditolak</span>
          </div>
        </div>
      </div>
    </div>
  );
}