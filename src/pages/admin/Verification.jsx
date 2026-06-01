import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MapPin, Clock, Car } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Verification() {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['pending-reports'],
    queryFn: () => base44.entities.Report.filter({ status: 'menunggu' }, '-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Report.update(id, { status }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      toast.success(status === 'disetujui' ? 'Laporan disetujui' : 'Laporan ditolak');
    },
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Verifikasi Laporan</h1>
          <p className="text-sm text-muted-foreground">Daftar Laporan Menunggu Verifikasi</p>
        </div>
        <Badge variant="outline" className="text-sm">{reports.length} menunggu</Badge>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-muted-foreground">Semua laporan sudah diverifikasi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {report.photo_url && (
                    <div className="sm:w-48 h-40 sm:h-auto shrink-0">
                      <img src={report.photo_url} alt="Bukti" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <p className="font-semibold">{report.reporter_name || 'Anonim'}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {report.address || `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {report.created_date && format(new Date(report.created_date), 'dd/MM/yyyy HH:mm')}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Car className="w-3.5 h-3.5" />
                          <span className="capitalize">{report.vehicle_type}</span>
                        </div>
                        {report.description && (
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => updateMutation.mutate({ id: report.id, status: 'disetujui' })}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={updateMutation.isPending}
                        >
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateMutation.mutate({ id: report.id, status: 'ditolak' })}
                          disabled={updateMutation.isPending}
                        >
                          Tolak
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}