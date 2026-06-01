import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { MapPin, Crosshair } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TEMBALANG_CENTER = [-7.0496, 110.4381];

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 17);
    }
  }, [position, map]);
  return null;
}

export default function LocationPicker({ value, onChange }) {
  const [loading, setLoading] = useState(false);

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleGPS} disabled={loading}>
          <Crosshair className="w-4 h-4 mr-2" />
          {loading ? 'Mengambil lokasi...' : 'Ambil Lokasi Saya'}
        </Button>
        <span className="text-xs text-muted-foreground">atau klik pada peta</span>
      </div>

      <div className="h-64 rounded-xl overflow-hidden border border-border">
        <MapContainer
          center={value ? [value.lat, value.lng] : TEMBALANG_CENTER}
          zoom={value ? 17 : 14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={onChange} />
          {value && (
            <>
              <FlyTo position={value} />
              <Marker position={[value.lat, value.lng]} />
            </>
          )}
        </MapContainer>
      </div>

      {value && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}