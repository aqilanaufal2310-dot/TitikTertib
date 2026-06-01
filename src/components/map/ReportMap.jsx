import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TEMBALANG_CENTER = [-7.0496, 110.4381];

const statusColors = {
  menunggu: '#f59e0b',
  disetujui: '#22c55e',
  ditolak: '#ef4444',
};

function FitBounds({ reports }) {
  const map = useMap();
  useEffect(() => {
    if (reports && reports.length > 0) {
      const bounds = reports.map(r => [r.latitude, r.longitude]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [reports, map]);
  return null;
}

export default function ReportMap({ reports = [], height = '500px', showPopups = true, fitBounds = false }) {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={TEMBALANG_CENTER}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fitBounds && <FitBounds reports={reports} />}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
          >
            {showPopups && (
              <Popup>
                <div className="text-sm space-y-1 min-w-[180px]">
                  <p className="font-semibold">{report.address || 'Lokasi parkir liar'}</p>
                  <p className="text-xs text-gray-500">Jenis: {report.vehicle_type}</p>
                  <p className="text-xs">
                    Status:{' '}
                    <span style={{ color: statusColors[report.status] }} className="font-medium capitalize">
                      {report.status}
                    </span>
                  </p>
                  {report.description && <p className="text-xs">{report.description.substring(0, 80)}...</p>}
                  <Link to={`/laporan/${report.id}`} className="text-xs text-blue-600 hover:underline block mt-1">
                    Lihat Detail →
                  </Link>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}