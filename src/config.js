// ------------------------------------------------------------------
// App-wide configuration. Edit these values to match the business.
// ------------------------------------------------------------------

export const APP_CONFIG = {
  name: "Plugged In Charging",
  shortName: "PIC",
  tagline: "P.I.C. Point Locator",

  // Map centers here before/without geolocation.
  // Centered on the Clermont / Minneola, FL service area to fit all stations.
  defaultCenter: { latitude: 28.5665, longitude: -81.7375 },
  defaultZoom: 12,

  // ---- Map tiles ----------------------------------------------------
  // Currently on free OpenStreetMap tiles (no key). Fine for launch /
  // low traffic. For real consumer volume, swap to a keyed free-tier
  // provider — that's a ONE-LINE change here (+ paste a key):
  //
  //   MapTiler:  https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=YOUR_KEY
  //   Stadia:    https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png
  //
  map: {
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },

  // Shown in the Contact Us dialog.
  contact: {
    phone: "407-431-2715",
    email: "Stevenhage85@gmail.com",
    facebook: "https://www.facebook.com/profile.php?id=61590770996509",
  },
};
