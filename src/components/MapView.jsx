import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { APP_CONFIG } from "../config";
import { getBatteryStatus } from "../lib/availability";

// ------------------------------------------------------------------
// Real map — Leaflet via react-leaflet, OpenStreetMap tiles.
// Tile provider is config-driven (APP_CONFIG.map.tileUrl) so switching
// to a keyed free-tier provider later is a one-line change.
//
// Props are unchanged from the earlier placeholder:
//   stations, selectedId, onSelectStation, userPosition
// ------------------------------------------------------------------
const PIN_COLORS = {
  good: "var(--pin-good, #2ba524)",
  low: "#f5b301",
  empty: "#94a3b8",
};

function pinSvg(color) {
  return `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.4 0 16.6 0 28 17 44 17 44s17-16 17-27.4C34 7.4 26.4 0 17 0z" fill="${color}"/>
      <circle cx="17" cy="16" r="7" fill="white"/>
      <path d="M18 9 12 18h4l-1 7 6-9h-4l1-7z" fill="${color}"/>
    </svg>`;
}

function makeIcon(level, selected) {
  const color = selected ? "#13294b" : level === "good" ? "#2ba524" : PIN_COLORS[level];
  return L.divIcon({
    className: "pic-pin",
    html: `<div style="transform:${selected ? "scale(1.15)" : "scale(1)"};transform-origin:bottom center;filter:drop-shadow(0 3px 4px rgba(19,41,75,.35))">${pinSvg(color)}</div>`,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
  });
}

// User location: navy dot with a soft ring.
const userIcon = L.divIcon({
  className: "pic-user",
  html: `<div style="position:relative;width:18px;height:18px">
      <span style="position:absolute;inset:0;border-radius:9999px;background:#13294b;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></span>
    </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Pans/zooms to the user once we have their position.
function RecenterOnUser({ userPosition }) {
  const map = useMap();
  useEffect(() => {
    if (userPosition) {
      map.flyTo([userPosition.latitude, userPosition.longitude], 15, {
        duration: 0.8,
      });
    }
  }, [userPosition, map]);
  return null;
}

export default function MapView({
  stations,
  selectedId,
  onSelectStation,
  userPosition,
}) {
  const { defaultCenter, defaultZoom, map: mapCfg } = APP_CONFIG;
  const center = useMemo(
    () => [defaultCenter.latitude, defaultCenter.longitude],
    [defaultCenter],
  );

  return (
    // `isolate` traps Leaflet's internal z-index (panes/controls up to 800)
    // in its own stacking context so the floating header/nav/sheets
    // (z-20+) render above the map.
    <div className="absolute inset-0 z-0 isolate">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        zoomControl={false}
        attributionControl={true}
        className="h-full w-full"
      >
        <TileLayer
          url={mapCfg.tileUrl}
          attribution={mapCfg.tileAttribution}
          maxZoom={mapCfg.maxZoom}
        />

        {stations.map((station) => {
          const coords = station.coordinates;
          if (!coords) return null;
          const level = getBatteryStatus(station.availableBatteries ?? 0).level;
          return (
            <Marker
              key={station.id}
              position={[coords.latitude, coords.longitude]}
              icon={makeIcon(level, station.id === selectedId)}
              eventHandlers={{ click: () => onSelectStation(station) }}
            />
          );
        })}

        {userPosition && (
          <Marker
            position={[userPosition.latitude, userPosition.longitude]}
            icon={userIcon}
          />
        )}

        <RecenterOnUser userPosition={userPosition} />
      </MapContainer>
    </div>
  );
}
