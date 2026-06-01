import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Send, MapPin } from 'lucide-react';
import LocationPicker from '@/components/map/LocationPicker';
import { toast } from 'sonner';

export default function ReportForm() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [reportTime, setReportTime] = useState(new Date().toISOString().slice(0, 16));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error('Pilih lokasi terlebih dahulu');
      return;
    }
    if (!vehicleType) {
      toast.error('Pilih jenis kendaraan');
      return;
    }

    setSubmitting(true);
    let photoUrl = '';
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      photoUrl = file_url;
    }

    let reporterName = '';
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      const user = await base44.auth.me();
      reporterName = user.full_name || user.email;
    }

    await base44.entities.Report.create({
      latitude: location.lat,
      longitude: location.lng,
      address,
      photo_url: photoUrl,
      description,
      vehicle_type: vehicleType,
      status: 'menunggu',
      reporter_name: reporterName || 'Anonim',
      report_time: reportTime,
    });

    toast.success('Laporan berhasil dikirim!');
    navigate('/peta');
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Buat Laporan Parkir Liar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Lokasi</Label>
              <LocationPicker value={location} onChange={setLocation} />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold">Alamat</Label>
              <Input
                id="address"
                placeholder="Contoh: Jl. Prof. Soedarto, Tembalang"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold">Waktu Kejadian</Label>
              <Input
                id="time"
                type="datetime-local"
                value={reportTime}
                onChange={(e) => setReportTime(e.target.value)}
              />
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Jenis Kendaraan</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kendaraan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobil">Mobil</SelectItem>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-sm font-semibold">Keterangan</Label>
              <Textarea
                id="desc"
                placeholder="Contoh: Parkir di trotoar depan fakultas, menganggu pejalan kaki."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Photo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Foto Bukti</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                {preview ? (
                  <div className="space-y-3">
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                    <label htmlFor="photo-upload" className="text-sm text-primary cursor-pointer hover:underline">
                      Ganti foto
                    </label>
                  </div>
                ) : (
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Klik untuk unggah foto</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG (Maks 5MB)</p>
                  </label>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting}>
              <Send className="w-4 h-4" />
              {submitting ? 'Mengirim...' : 'Kirim Laporan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}