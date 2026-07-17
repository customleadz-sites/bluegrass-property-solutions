/* Service-area map — Bluegrass Property Solutions
   Murray, KY centred. 80-mile service radius drawn, towns pinned inside. */
(function () {
  var el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  var MURRAY = [36.6106, -88.3021];
  var RADIUS_MILES = 60;
  var RADIUS_M = RADIUS_MILES * 1609.344;

  // Towns Tyler listed (green pins), geocoded via OpenStreetMap Nominatim.
  // At this zoom the core towns cluster tightly, so only the well-spaced ones
  // get a permanent label (lab:true) — the rest keep their pin and show the
  // name on hover. All are also listed in the chips beside the map. dir spreads
  // permanent labels apart to avoid collisions.
  var TOWNS = [
    { n: 'Murray',     c: [36.6106, -88.3021], hub: true, lab: true, dir: 'right' },
    { n: 'Paducah',    c: [37.0834, -88.6000], lab: true, dir: 'top' },
    { n: 'Mayfield',   c: [36.7413, -88.6355], lab: true, dir: 'left' },
    { n: 'Benton',     c: [36.8573, -88.3503], lab: true, dir: 'right' },
    { n: 'Arlington',  c: [36.7903, -89.0128], lab: true, dir: 'left' },
    { n: 'Fancy Farm', c: [36.7995, -88.7914] },
    { n: 'Symsonia',   c: [36.9203, -88.5200] },
    { n: 'Hickory',    c: [36.8226, -88.6475] },
    { n: 'Wingo',      c: [36.6423, -88.7390] },
    { n: 'Sedalia',    c: [36.6412, -88.6053] },
    { n: 'Lowes',      c: [36.8856, -88.7739] },
    // Edge markers (muted) — real towns near the 60-mile ring, spread around the
    // compass so people can see roughly how far the radius reaches.
    // perimeter labels point inward (toward Murray) so they stay in frame
    { n: 'Princeton',   c: [37.1092, -87.8820], edge: true, lab: true, dir: 'top' },
    { n: 'Hopkinsville', c: [36.8658, -87.4894], edge: true, lab: true, dir: 'left' },
    { n: 'Clarksville', c: [36.5278, -87.3589], edge: true, lab: true, dir: 'left' },
    { n: 'Huntingdon',  c: [36.0009, -88.4280], edge: true, lab: true, dir: 'top' },
    { n: 'Union City',  c: [36.4242, -89.0570], edge: true, lab: true, dir: 'right' },
    { n: 'Cairo',       c: [37.0058, -89.1772], edge: true, lab: true, dir: 'right' }
  ];

  var map = L.map(el, {
    center: MURRAY,
    zoom: 8,
    minZoom: 6,
    maxZoom: 14,
    zoomControl: false,
    zoomSnap: 0.1, // integer snapping leaves the circle floating in dead space
    scrollWheelZoom: true // wheel zoom on by default (client request), plus buttons below
  });
  L.control.zoom({ position: 'topright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  var BASE = { color: '#0D2C54', weight: 2, opacity: 1, fillColor: '#1E5FA8', fillOpacity: 0.12, lineJoin: 'round' };
  var HOVER = { fillOpacity: 0.24, weight: 3 };

  // 80-mile service radius around Murray
  var circle = L.circle(MURRAY, Object.assign({ radius: RADIUS_M }, BASE)).addTo(map);
  circle.bindTooltip('About ' + RADIUS_MILES + ' miles from Murray — Served', {
    sticky: true, direction: 'top', className: 'county-tip', offset: [0, -6]
  });
  circle.on({
    mouseover: function (e) { e.target.setStyle(HOVER); },
    mouseout: function (e) { e.target.setStyle(BASE); }
  });

  // No basemap label layer on purpose: it renders its own town names, which
  // collide with the pins below ("PADUCAH" stacked on "Paducah"). Our towns
  // are the point of this map, so they're the only labels on it.
  var OFFSETS = { right: [10, 0], left: [-10, 0], top: [0, -10], bottom: [0, 12] };
  TOWNS.forEach(function (t) {
    var dir = t.dir || 'right';
    var cls = 'town-dot' + (t.hub ? ' is-hub' : '') + (t.edge ? ' is-edge' : '');
    L.marker(t.c, {
      icon: L.divIcon({
        className: '',
        html: '<div class="' + cls + '">' + (t.hub ? '<i></i>' : '') + '<b></b></div>',
        iconSize: [13, 13]
      }),
      zIndexOffset: t.hub ? 1000 : (t.edge ? 400 : 500),
      keyboard: false
    })
      .addTo(map)
      .bindTooltip(t.n, {
        permanent: !!t.lab, direction: dir, offset: OFFSETS[dir],
        className: t.edge ? 'town-label town-label-edge' : 'town-label'
      });
  });

  map.fitBounds(circle.getBounds().pad(0.06));
  map.setMaxBounds(circle.getBounds().pad(0.4));
})();
