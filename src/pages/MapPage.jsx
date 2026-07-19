import { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import MapView from "../components/MapView";
import StationSheet from "../components/StationSheet";
import ContactModal from "../components/ContactModal";
import { useStations } from "../hooks/useStations";
import { useGeolocation } from "../hooks/useGeolocation";

// Primary screen: full-bleed map with floating header/nav and overlays.
export default function MapPage() {
  const { stations, loading, isLive } = useStations();
  const { position, status, locate } = useGeolocation();

  const [selected, setSelected] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <MapView
        stations={stations}
        selectedId={selected?.id}
        onSelectStation={setSelected}
        userPosition={position}
      />

      <Header isLive={isLive} />

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-navy shadow">
            Loading stations…
          </span>
        </div>
      )}

      <BottomNav
        onLocate={locate}
        onContact={() => setContactOpen(true)}
        locating={status === "locating"}
      />

      <StationSheet station={selected} onClose={() => setSelected(null)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
