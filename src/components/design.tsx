'use client'
import React from "react";
import mapboxgl from "mapbox-gl";
import type { Map as MbMap, LngLatLike } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import feather from "feather-icons";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";


// Use your provided token; falls back to env if present
mapboxgl.accessToken = "pk.eyJ1IjoiZGV2aW5qb2huc29uMTk4NiIsImEiOiJjbWZ0cGIyZjAxMGxlMm5wdWhlZW90c3dlIn0.a2I0aL5eRDCYQFwyHW5XTg";

// Sample itinerary data (as in your HTML)
const itineraryData: GeoJSON.FeatureCollection<GeoJSON.Point, any> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        day: 1,
        title: "Eiffel Tower",
        time: "09:00 AM",
        description:
          "Start your day at the iconic Eiffel Tower. Don't forget to go to the top for amazing views of Paris.",
        type: "Landmark",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
          },
          { type: "video", url: "https://example.com/video1.mp4" },
        ],
      },
      geometry: { type: "Point", coordinates: [2.2945, 48.8584] },
    },
  ],
};

export default function Design() {
  const mapRef = React.useRef<MbMap | null>(null);
  const mapDivRef = React.useRef<HTMLDivElement | null>(null);
  const geocoderMountRef = React.useRef<HTMLDivElement | null>(null);

  const [saveOpen, setSaveOpen] = React.useState(false);
  const [mediaOpen, setMediaOpen] = React.useState(false);
  const [mediaHtml, setMediaHtml] = React.useState<string>("");
  const lastRouteRef = React.useRef<GeoJSON.Feature<GeoJSON.LineString> | null>(null);

  // Init map and controls
  React.useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapDivRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 12,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-left");

    // Create Geocoder and mount it where the input sits
    if (geocoderMountRef.current) {
      const geocoder = new MapboxGeocoder({
        accessToken: 'pk.eyJ1IjoiZGV2aW5qb2huc29uMTk4NiIsImEiOiJjbWcwYnF0dDkwMXFzMmxvc2U2Z3Rtc2NzIn0.FD491D5SHk0g05Pdg1pMAg',
        mapboxgl: mapboxgl as unknown as typeof import("mapbox-gl"),
        placeholder: "Search destination...",
        marker: true,
      });
      geocoderMountRef.current.innerHTML = ""; // clear any fallback input
      geocoderMountRef.current.appendChild(geocoder.onAdd(map));

      geocoder.on("result", (e: any) => {
        const dest = e.result.geometry.coordinates as [number, number];
        getStartLocation().then((start) => getRoute(start, dest));
      });
    }

    // When map loads, add markers, fit bounds, wire media
    map.on("load", () => {
      addItineraryMarkers(map);
      fitToItinerary(map);
      feather.replace(); // render feather icons
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-render feather icons after any open/close UI change
  React.useEffect(() => {
    feather.replace();
  }, [saveOpen, mediaOpen, mediaHtml]);

  // ----- helpers -----
  const addMarker = (coords: [number, number], title: string, color: string) => {
    const map = mapRef.current!;
    new mapboxgl.Marker({ color })
      .setLngLat(coords)
      .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="font-bold">${title}</h3>`))
      .addTo(map);
  };

  const fitToItinerary = (map: MbMap) => {
    const b = itineraryData.features.reduce((bounds, f) => {
      return bounds.extend(f.geometry.coordinates as LngLatLike);
    }, new mapboxgl.LngLatBounds());
    if (!b.isEmpty()) map.fitBounds(b, { padding: 100 });
  };

  const addItineraryMarkers = (map: MbMap) => {
    itineraryData.features.forEach((feature) => {
      const { coordinates } = feature.geometry;
      const { title, time, type, description, media } = feature.properties;

      const popupHtml = `
        <div class="w-64">
          <h3 class="font-bold text-lg">${title}</h3>
          <div class="flex items-center text-sm text-gray-600 mb-2">
            <i data-feather="${type === "Landmark" ? "map-pin" : "coffee"}" class="w-4 h-4 mr-1"></i>
            <span>${type} • ${time}</span>
          </div>
          <p class="text-gray-700 mb-2">${description}</p>
          <button class="view-media text-blue-500 text-sm font-medium" data-id="${feature.properties.id}">
            View Media (${media.length})
          </button>
        </div>
      `;

      new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat(coordinates as [number, number])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml))
        .addTo(map);
    });
  };

  const getStartLocation = async (): Promise<[number, number]> => {
    // Try geolocation, fallback to first itinerary point
    const fallback = itineraryData.features[0].geometry.coordinates as [number, number];
    if (!("geolocation" in navigator)) return fallback;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
        () => resolve(fallback),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  const getRoute = (start: [number, number], end: [number, number]) => {
    const map = mapRef.current!;
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const route = d?.routes?.[0]?.geometry as GeoJSON.LineString | undefined;
        if (!route) return;

        // Remove old route
        if (map.getLayer("route")) map.removeLayer("route");
        if (map.getSource("route")) map.removeSource("route");

        const feature: GeoJSON.Feature<GeoJSON.LineString> = {
          type: "Feature",
          properties: {},
          geometry: route,
        };
        lastRouteRef.current = feature;

        map.addLayer({
          id: "route",
          type: "line",
          source: { type: "geojson", data: feature },
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#3b82f6", "line-width": 4, "line-opacity": 0.75 },
        });

        // Endpoints & quick fit
        addMarker(start, "Start", "#10b981");
        addMarker(end, "Destination", "#ef4444");
        const bounds = new mapboxgl.LngLatBounds().extend(start).extend(end);
        map.fitBounds(bounds, { padding: 100 });
      })
      .catch(() => {});
  };

  // Click handler for “View Media” buttons inside popups & list
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.classList?.contains("view-media")) {
        const id = Number(target.getAttribute("data-id"));
        const feature = itineraryData.features.find((f) => f.properties.id === id);
        if (!feature) return;

        const html = feature.properties.media
          .map((m: any) =>
            m.type === "image"
              ? `<div class="mb-4"><img src="${m.url}" class="w-full h-auto rounded-lg shadow-md"></div>`
              : `<div class="mb-4"><video controls class="w-full rounded-lg shadow-md"><source src="${m.url}" type="video/mp4"></video></div>`
          )
          .join("");
        setMediaHtml(html);
        setMediaOpen(true);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Build itinerary list items
  const ItineraryList = () => (
    <>
      {itineraryData.features.map((feature) => {
        const { title, time, description, type, media } = feature.properties;
        return (
          <div
            key={feature.properties.id}
            className="itinerary-item p-3 rounded-lg cursor-pointer"
            onClick={() => {
              mapRef.current?.flyTo({ center: feature.geometry.coordinates as [number, number], zoom: 14 });
              document.querySelectorAll(".itinerary-item").forEach((el) => el.classList.remove("active"));
              // mark this as active
              (event?.currentTarget as HTMLElement)?.classList?.add("active");
            }}
          >
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                <i data-feather={type === "Landmark" ? "map-pin" : "coffee"} className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-gray-500">{time}</p>
                <p className="text-gray-700 mt-1 text-sm">{String(description).slice(0, 100)}...</p>
                {media?.length > 0 && (
                  <div className="flex mt-2 space-x-2">
                    {media.slice(0, 3).map((m: any, idx: number) => (
                      <div key={idx} className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                        {m.type === "image" ? (
                          <img src={m.url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <i data-feather="play" className="text-white w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    {media.length > 3 && (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                        +{media.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="h-full">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <i data-feather="map" className="text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">WanderLens Vision ✨</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-blue-500 font-medium">
              My Trips
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500">
              Discover
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500">
              About
            </a>
            <button
              className="text-gray-600 hover:text-blue-500"
              onClick={() => setSaveOpen(true)}
              aria-label="Save Project"
            >
              Save Project
            </button>
          </nav>
          <button className="md:hidden text-gray-600" aria-label="Open Menu">
            <i data-feather="menu" />
          </button>
        </div>
      </header>

      {/* Day Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 py-2">
            <button className="px-4 py-2 rounded-t-lg bg-blue-500 text-white font-medium">Day 1</button>
            <button className="px-4 py-2 rounded-t-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Day 2</button>
            <button className="px-4 py-2 rounded-t-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Day 3</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100%-120px)]">
        {/* Sidebar */}
        <aside className="w-96 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-4">
              {/* Geocoder will mount into this div */}
              <div ref={geocoderMountRef} />
              {/* Fallback (will be replaced) */}
              <input
                type="text"
                placeholder="Search destination..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i data-feather="search" className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            <div id="directions-panel" className="hidden mb-4 bg-gray-50 rounded-lg p-3">
              <h3 className="font-bold text-gray-700 mb-2">Directions</h3>
              <div id="direction-steps" className="space-y-2" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">Day 1 Itinerary</h2>
            <div id="itinerary-list" className="space-y-2">
              <ItineraryList />
            </div>
          </div>
        </aside>

        {/* Map */}
        <section className="flex-1 relative">
          <div ref={mapDivRef} id="map" className="absolute inset-0" />

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2 z-10">
            <button
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              title="Zoom to route"
              onClick={() => {
                const map = mapRef.current!;
                const geo = lastRouteRef.current?.geometry;
                if (!geo?.coordinates?.length) return;
                const bounds = geo.coordinates.reduce(
                  (b, c) => b.extend(c as LngLatLike),
                  new mapboxgl.LngLatBounds(geo.coordinates[0] as LngLatLike, geo.coordinates[0] as LngLatLike)
                );
                map.fitBounds(bounds, { padding: 100 });
              }}
            >
              <i data-feather="maximize-2" />
            </button>
            <button
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              title="Go to my location"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    mapRef.current?.flyTo({
                      center: [pos.coords.longitude, pos.coords.latitude],
                      zoom: 14,
                    });
                  },
                  (err) => alert("Unable to get your location: " + err.message)
                );
              }}
            >
              <i data-feather="navigation" />
            </button>
          </div>

          {/* Media Gallery Modal */}
          {mediaOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center border-b p-4">
                  <h3 className="text-lg font-semibold">Media Gallery</h3>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setMediaOpen(false)}>
                    <i data-feather="x" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: mediaHtml }} />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Save Project Modal */}
      {saveOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Save Your Project</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setSaveOpen(false)}>
                <i data-feather="x" />
              </button>
            </div>
            <SaveForm onClose={() => setSaveOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- small sub-component for the Save dialog ---
function SaveForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        onClick={() => {
          if (!name.trim()) {
            alert("Please enter a project name");
            return;
          }
          const html = document.documentElement.outerHTML;
          const blob = new Blob([html], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${name.replace(/\s+/g, "_")}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          onClose();
          alert(`Project "${name}" saved successfully!`);
        }}
      >
        Save Project
      </button>
    </div>
  );
}
