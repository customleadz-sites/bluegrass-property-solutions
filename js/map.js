/* Service-area map — Bluegrass Property Solutions
   Murray, KY centred. Counties highlighted, towns pinned. Map only, no panel. */
(function () {
  var el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  var MURRAY = [36.6106, -88.3021];

  // Towns Tyler listed, geocoded via OpenStreetMap Nominatim.
  var TOWNS = [
    { n: 'Murray',     c: [36.6106, -88.3021], hub: true },
    { n: 'Paducah',    c: [37.0834, -88.6000] },
    { n: 'Mayfield',   c: [36.7413, -88.6355] },
    { n: 'Benton',     c: [36.8573, -88.3503] },
    { n: 'Fancy Farm', c: [36.7995, -88.7914] },
    { n: 'Arlington',  c: [36.7903, -89.0128] },
    { n: 'Symsonia',   c: [36.9203, -88.5200] },
    { n: 'Hickory',    c: [36.8226, -88.6475] },
    { n: 'Wingo',      c: [36.6423, -88.7390] },
    { n: 'Sedalia',    c: [36.6412, -88.6053] },
    { n: 'Lowes',      c: [36.8856, -88.7739] }
  ];

  var map = L.map(el, {
    center: MURRAY,
    zoom: 9,
    minZoom: 7,
    maxZoom: 14,
    zoomControl: false,
    zoomSnap: 0.1, // integer snapping leaves the service area floating in dead space
    scrollWheelZoom: false // don't hijack the page scroll
  });
  L.control.zoom({ position: 'topright' }).addTo(map);

  // click to enable wheel zoom, blur to release
  map.on('click', function () { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  var BASE = { color: '#0D2C54', weight: 2, opacity: 1, fillColor: '#1E5FA8', fillOpacity: 0.16, lineJoin: 'round' };
  var HOVER = { fillOpacity: 0.34, weight: 3 };

  fetch('js/counties.json')
    .then(function (r) { return r.json(); })
    .then(function (geo) {
      var counties = L.geoJSON(geo, {
        style: function () { return BASE; },
        onEachFeature: function (f, layer) {
          layer.bindTooltip(f.properties.name + ' — Served', {
            sticky: true, direction: 'top', className: 'county-tip', offset: [0, -6]
          });
          layer.on({
            mouseover: function (e) { e.target.setStyle(HOVER); },
            mouseout: function (e) { e.target.setStyle(BASE); }
          });
        }
      }).addTo(map);

      // No basemap label layer on purpose: it renders its own town names, which
      // collide with the pins below ("PADUCAH" stacked on "Paducah"). Our towns
      // are the point of this map, so they're the only labels on it.
      TOWNS.forEach(function (t) {
        L.marker(t.c, {
          icon: L.divIcon({
            className: '',
            html: '<div class="town-dot' + (t.hub ? ' is-hub' : '') + '">' + (t.hub ? '<i></i>' : '') + '<b></b></div>',
            iconSize: [13, 13]
          }),
          zIndexOffset: t.hub ? 1000 : 500,
          keyboard: false
        })
          .addTo(map)
          .bindTooltip(t.n, {
            permanent: true, direction: 'right', offset: [10, 0], className: 'town-label'
          });
      });

      var HOME = counties.getBounds().pad(0.04);
      map.fitBounds(HOME);
      map.setMaxBounds(counties.getBounds().pad(0.6));
    })
    .catch(function () {
      // if the boundaries fail to load, still show the towns rather than an empty box
      TOWNS.forEach(function (t) {
        L.marker(t.c, {
          icon: L.divIcon({ className: '', html: '<div class="town-dot"><b></b></div>', iconSize: [13, 13] })
        }).addTo(map).bindTooltip(t.n, { permanent: true, direction: 'right', offset: [10, 0], className: 'town-label' });
      });
    });
})();
