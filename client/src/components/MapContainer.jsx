import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const createDotIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="position:relative;width:16px;height:16px"><span style="position:absolute;inset:0;border-radius:999px;background:${color};animation:helpHivePulse 1.8s ease-out infinite;opacity:.55"></span><span style="position:relative;display:block;width:16px;height:16px;border-radius:999px;background:${color};border:2px solid var(--background);box-shadow:0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent)"></span></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const MapContainer = ({ points = [], onMarkerSelect, heightClass = 'h-[460px]' }) => (
  <div className={`${heightClass} overflow-hidden rounded-xl border border-[var(--border-muted)]`}>
    <LeafletMap center={[22.9, 79.2]} zoom={5} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map((point) => {
        const markerColor =
          point.type === 'event'
            ? 'var(--primary)'
            : point.type === 'resource'
              ? 'var(--secondary)'
              : point.type === 'help'
                ? 'var(--text)'
                : 'var(--primary)';

        return (
          <Marker
            key={`${point.type}-${point.name}`}
            position={[point.lat, point.lng]}
            icon={point.type ? createDotIcon(markerColor) : defaultIcon}
            eventHandlers={{ click: () => onMarkerSelect?.(point) }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{point.name}</strong>
                <p style={{ margin: 0 }}>{point.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text)' }}>
                  {point.lat.toFixed(3)}, {point.lng.toFixed(3)}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </LeafletMap>
  </div>
);

export default MapContainer;
