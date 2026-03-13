import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";
import { getMapData } from "../services/apiClient";

export default function VolunteerMapPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [resourceCenters, setResourceCenters] = useState([]);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    });

    let active = true;
    getMapData()
      .then((data) => {
        if (!active) return;
        setVolunteers(data.volunteers || []);
        setEvents(data.events || []);
        setRequests(data.helpRequests || []);
        setResourceCenters(data.resourceCenters || []);
      })
      .catch(() => {
        if (!active) return;
        setVolunteers([]);
        setEvents([]);
        setRequests([]);
        setResourceCenters([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <MapContainer center={[12.976, 77.6]} zoom={13} style={{ height: "560px", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {volunteers.map((point) => (
              <Marker key={point.id} position={[point.lat, point.lng]}>
                <Popup>{point.name}</Popup>
              </Marker>
            ))}

            {events.map((event) => (
              <Marker key={event.id} position={[event.lat, event.lng]}>
                <Popup>{event.name}</Popup>
              </Marker>
            ))}

            {requests.map((request) => (
              <Marker key={request.id} position={[request.lat, request.lng]}>
                <Popup>{request.type} - {request.location}</Popup>
              </Marker>
            ))}

            {resourceCenters.map((center) => (
              <Marker key={center.id} position={[center.lat, center.lng]}>
                <Popup>{center.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <TiltCard>
          <h3 className="font-display text-lg font-semibold text-white">Live Side Panel</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-200">
            <div>
              <p className="font-semibold text-white">Nearby events</p>
              {events.map((event) => (
                <p key={event.id}>{event.name}</p>
              ))}
            </div>
            <div>
              <p className="font-semibold text-white">Help requests</p>
              {requests.map((request) => (
                <p key={request.id}>{request.location} - {request.type}</p>
              ))}
            </div>
            <div>
              <p className="font-semibold text-white">Active volunteers</p>
              {volunteers.map((point) => (
                <p key={point.id}>{point.name}</p>
              ))}
            </div>
          </div>
        </TiltCard>
      </div>
    </PageWrapper>
  );
}
