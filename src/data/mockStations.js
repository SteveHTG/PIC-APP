// Real Plugged In Charging locations (all 8-bank stations).
// Mirrors the Supabase `stations` table (via rowToStation mapping) so the UI
// and the live data path are interchangeable.
//
// NOTE: availableBatteries / emptySlots are PLACEHOLDER counts until the
// hardware API is wired up. totalSlots (8) is real, as are the addresses
// and coordinates.
//
// Schema (per station document):
//   id                  string   unique station identifier
//   name                string   venue name
//   address             string
//   coordinates         { latitude, longitude }
//   hours               string
//   terminalId          string   hardware reference
//   totalSlots          number   physical bank capacity of the kiosk
//   availableBatteries  number   banks currently available to rent
//   emptySlots          number   free slots available to return a bank
//   lastUpdated         string   ISO timestamp of last count update

export const MOCK_STATIONS = [
  {
    id: "pic-001",
    name: "The View Clermont",
    address: "2601 Clermont National Drive, Clermont, FL 34711",
    coordinates: { latitude: 28.5560419, longitude: -81.7058031 },
    hours: "See venue for hours",
    terminalId: "HW-0001",
    totalSlots: 8,
    availableBatteries: 6,
    emptySlots: 2,
    lastUpdated: "2026-07-19T12:00:00Z",
  },
  {
    id: "pic-002",
    name: "Mullet's Sports Bar",
    address: "736 W Montrose Street, Clermont, FL 34711",
    coordinates: { latitude: 28.5556446, longitude: -81.7675447 },
    hours: "See venue for hours",
    terminalId: "HW-0002",
    totalSlots: 8,
    availableBatteries: 2,
    emptySlots: 6,
    lastUpdated: "2026-07-19T12:00:00Z",
  },
  {
    id: "pic-003",
    name: "Crooked Can Brewing Company",
    address: "1600 Crooked Can Loop, Minneola, FL 34715",
    coordinates: { latitude: 28.579278, longitude: -81.743056 },
    hours: "See venue for hours",
    terminalId: "HW-0003",
    totalSlots: 8,
    availableBatteries: 4,
    emptySlots: 4,
    lastUpdated: "2026-07-19T12:00:00Z",
  },
  {
    id: "pic-004",
    name: "Pups Pub Clermont",
    address: "898 W Montrose Street, Clermont, FL 34711",
    coordinates: { latitude: 28.5554544, longitude: -81.7701869 },
    hours: "See venue for hours",
    terminalId: "HW-0004",
    totalSlots: 8,
    availableBatteries: 5,
    emptySlots: 3,
    lastUpdated: "2026-07-19T12:00:00Z",
  },
];
