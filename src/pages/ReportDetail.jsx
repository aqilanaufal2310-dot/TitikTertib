import React from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Car, User, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import ReportMap from '@/components/map/ReportMap';

const statusMap = {
  menunggu: { label: 'Menunggu Verifikasi', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  disetujui: { label: 'Disetujui', class: 'bg-green-100 text-green-800 border-green-200' },
  ditolak: { label: 'Ditolak', class: 'bg-red-100 text-red-800 border-red-200' },
};

export default function ReportDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const reportId = window.location.pathname.split('/').pop();

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: async () => {
      const reports = await base44.entities.Report.filter({ id: reportId });
      return reports[0];
    },
    enabled: !!reportId,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Laporan tidak ditemukan</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/peta')}>
          Kembali ke Peta
        </Button>
      </div>
    );
  }

  const status = statusMap[report.status] || statusMap.menunggu;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Laporan Parkir Liar', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <Badge className={`${status.class} border`}>{status.label}</Badge>
      </div>

      {/* Photo */}
      {report.photo_url && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-border">
          <img src={report.photo_url} alt="Bukti" className="w-full max-h-96 object-cover" />
        </div>
      )}

      {/* Map */}
      <div className="mb-6">
        <ReportMap reports={[report]} height="250px" showPopups={false} />
      </div>

      {/* Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Lokasi</p>
                <p className="font-medium text-sm">{report.address || `${report.latitude}, ${report.longitude}`}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Waktu</p>
                <p className="font-medium text-sm">
                  {report.report_time
                    ? format(new Date(report.report_time), 'dd/MM/yyyy HH:mm', { locale: idLocale })
                    : format(new Date(report.created_date), 'dd/MM/yyyy HH:mm', { locale: idLocale })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Jenis Kendaraan</p>
                <p className="font-medium text-sm capitalize">{report.vehicle_type}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Dibuat oleh</p>
                <p className="font-medium text-sm">{report.reporter_name || 'Anonim'}</p>
              </div>
            </div>
          </div>

          {report.description && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Keterangan</p>
              <p className="text-sm">{report.description}</p>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Bagikan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}