"use client";
import React, { useState } from "react";
import mapboxgl from "mapbox-gl";
import type { Map as MbMap, LngLatLike } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import feather from "feather-icons";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// Use your provided token; falls back to env if present
mapboxgl.accessToken =
    "pk.eyJ1IjoiZGV2aW5qb2huc29uMTk4NiIsImEiOiJjbWZ0cGIyZjAxMGxlMm5wdWhlZW90c3dlIn0.a2I0aL5eRDCYQFwyHW5XTg";

// Sample itinerary data (as in your HTML)
const itineraryData: GeoJSON.FeatureCollection<GeoJSON.Point, any> = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                id: 1,
                time: "9:00 AM",
                title: "The Sukhothai Hotel",
                type: "Hotel",
                Price: 238.44,
                description: "dates: July 30-Aug 3",
                Lat: 13.573056,
                Long: 100.540833,
                Location: "Bangkok",
                Website: "https://bangkok.sukhothai.com/en/",
                Image_URL: "https://drive.google.com/file/d/1YV5oXIK3nZBVeLqhvLNignTgsCrIEPqa/view?usp=sharing",
                day: 1,
                icon_url: "./0.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.540831631282074, 13.723059730997477] },
        },
        {
            type: "Feature",
            properties: {
                id: 2,
                time: "9:00 AM",

                title: "The Vie Hotel -MGallery",
                type: "Hotel",
                Price: 333.17,
                description:
                    "NULLBoutique. has 1 michelin star 6&8 course dinner restuarant. a sushit bar, an all day bistro and food at pool. located in middle of Bangkok",
                Lat: 13.750556,
                Long: 100.531944,
                Location: "Bangkok",
                Website:
                    "https://all.accor.com/hotel/6469/index.en.shtml?utm_campaign=seo+maps&utm_medium=seo+maps&utm_source=google+Maps",
                Image_URL: "https://drive.google.com/file/d/1oc1cO9aih_HREO67859nzj0nCPs1_Shf/view?usp=sharing",
                day: 2,
                icon_url: "./0.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.531944444444434, 13.750557232987633] },
        },
        {
            type: "Feature",
            properties: {
                id: 3,
                time: "9:00 AM",

                title: "The Lebua Hotel",
                type: "Hotel",
                Price: 201.98,
                description:
                    "michelin star chefs & restuarants. towever design puts all the lounges and restuarants on differnt floors. rooftop bar.loung.",
                Lat: 13.721389,
                Long: 100.516667,
                Location: "Bangkok",
                Website: "https://lebua.com",
                Image_URL: "https://drive.google.com/file/d/1FqdX8WaeKuL08sSKx9hmiPf55D-DRVmN/view?usp=sharing",
                day: 2,
                icon_url: "./0.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.516666666666637, 13.721383855966346] },
        },
        {
            type: "Feature",
            properties: {
                id: 4,
                time: "9:00 AM",

                title: "Myste",
                type: "Resturant",
                Price: null,
                description:
                    "Cave Restaurant. hours: 11AM - 7:15PM daily. lots of tiny fusion plates. looks like we'll be hungry when its over. has tasting menus.",
                Lat: 13.800833,
                Long: 100.311667,
                Location: "Bangkok",
                Website: "https://web.hungryhub.com/en/restaurants/myste/web?rd=0",
                Image_URL: null,
                day: 3,
                icon_url: "./1.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.311666666666667, 13.800827667552049] },
        },
        {
            type: "Feature",
            properties: {
                id: 5,
                title: "Vertigo Too",
                type: "Resturant",
                time: "9:00 AM",

                Price: 78.11,
                description: "dinner 630-1030PM. dress is smart casual. asian/western food",
                Lat: 13.723611,
                Long: 100.539444,
                Location: "Bangkok",
                Website: "https://www.banyantree.com/thailand/bangkok/dining/vertigo-too",
                Image_URL: null,
                day: 1,
                icon_url: "./1.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.53945027865457, 13.723605443459219] },
        },
        {
            type: "Feature",
            properties: {
                id: 6,
                title: "Expresso",
                type: "Resturant",
                time: "9:00 AM",

                Price: 67.08,
                description:
                    "Friday & Saturday. located on the Mezzanine level of the Intercontinental. live jazz music. 6-1030PM.",
                Lat: 13.7225,
                Long: 100.581389,
                Location: "Bangkok",
                Website:
                    "https://bangkok.intercontinental.com/special-offers-and-experiences/premium-seafood-dinner-buffet-at-espresso",
                Image_URL: null,
                day: 3,
                icon_url: "./1.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.581392140208692, 13.722507416797498] },
        },
        {
            type: "Feature",
            properties: {
                id: 7,
                title: "Sol & Luna",
                type: "Bar",
                time: "9:00 AM",

                Price: null,
                description:
                    "360 views. Sol is the restaurant (11:30AM - 11PM) and Luna is the rooftop (5PM - 2AM). Live music 7-9PM Thurs-Sat",
                Lat: 13.736667,
                Long: 100.5975,
                Location: "Bangkok",
                Website: "NULhttps://www.aspira-hotels.com/hotels/glow-sukhumvit-71/L",
                Image_URL: null,
                day: 2,
                icon_url: "./2.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.5975, 13.736660829478728] },
        },
        {
            type: "Feature",
            properties: {
                id: 8,
                title: "Tichuca Skybar",
                type: "Bar",
                time: "9:00 AM",

                Price: null,
                description: "Hours: 5PM on. ID/passport for entry. Greenery terrace vibe. 360 views",
                Lat: 13.722222,
                Long: 100.581944,
                Location: "Bangkok",
                Website: "https://www.tichuca.co",
                Image_URL: null,
                day: 1,
                icon_url: "./2.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.580555555555534, 13.722216384674738] },
        },
        {
            type: "Feature",
            properties: {
                id: 9,
                title: "Pastel Rooftop Bar",
                type: "Bar",
                time: "9:00 AM",

                Price: null,
                description: "mediterranean inspired. Lobster & champagne tuesdays",
                Lat: 13.7425,
                Long: 100.556389,
                Location: "Bangkok",
                Website: "https://www.pastelbangkok.com \t",
                Image_URL: null,
                day: 2,
                icon_url: "./2.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.556382879825932, 13.742505837042483] },
        },
        {
            type: "Feature",
            properties: {
                id: 10,
                title: "Lacol Rooftop Bar",
                type: "Bar",
                time: "9:00 AM",

                Price: null,
                description: "has the cinderellea pumpkin looking clear pod/table",
                Lat: 13.728333,
                Long: 100.580278,
                Location: "Bangkok",
                Website: "https://www.instagram.com/lacolbangkok/",
                Image_URL: null,
                day: 1,
                icon_url: "./2.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.580277777777781, 13.728327495937922] },
        },
        {
            type: "Feature",
            properties: {
                id: 11,
                title: "Tribe Sky Beach CLub",
                type: "Bar",
                time: "9:00 AM",

                Price: null,
                description:
                    "beach club open from 11AM -1AM. reservations recommended by people. check FB page for event flyers and phone number for possible reservations. has IG as well but not as up to date and FB",
                Lat: 13.731944,
                Long: 100.566667,
                Location: "Bangkok",
                Website: "https://tribeskybeachclub.com/?utm_source=google&utm_medium=organic&utm_campaign=google_maps",
                Image_URL: null,
                day: 2,
                icon_url: "./2.png",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
            },
            geometry: { type: "Point", coordinates: [100.566666666666663, 13.731950281749819] },
        },
        {
            type: "Feature",
            properties: {
                id: 12,
                title: "Seen Resturant and Bar",
                type: "Bar",
                time: "9:00 AM",

                Price: null,
                description:
                    "considered a bit pricey for food: $80 steak, $50 crab risotto. has pool. open daily 11AM-1AM. portuguese/brazillian menu. level entertainment and music",
                Location: "Bangkok",
                Website: "https://www.seenrooftopbangkok.com",
                media: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
                    },
                    { type: "video", url: "https://example.com/video1.mp4" },
                ],
                day: 1,
                icon_url: "./2.png",
            },
            geometry: { type: "Point", coordinates: [100.49115428022732, 13.705240906626676] },
        },
    ],
};

export default function Design() {
    const [day, setDay] = useState(1);
    const [dayPoints, setDayPoints] = useState(
        itineraryData.features.filter((feature) => feature.properties.day === day)
    );

    const day1Points = itineraryData.features.filter((feature) => feature.properties.day === 1);
    const day2Points = itineraryData.features.filter((feature) => feature.properties.day === 2);
    const day3Points = itineraryData.features.filter((feature) => feature.properties.day === 3);

    function handleButtonsChange(x: number) {
        if (x === 1) {
            setDayPoints(day1Points);
        } else if (x === 2) {
            setDayPoints(day2Points);
        } else if (x === 3) {
            setDayPoints(day3Points);
        }
        setDay(x);
    }

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
                accessToken:
                    "pk.eyJ1IjoiZGV2aW5qb2huc29uMTk4NiIsImEiOiJjbWcwYnF0dDkwMXFzMmxvc2U2Z3Rtc2NzIn0.FD491D5SHk0g05Pdg1pMAg",
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
          <h3 class="font-bold text-black text-lg">${title}</h3>
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
            {dayPoints.map((feature) => {
                const { title, time, description, type, media } = feature.properties;
                return (
                    <div
                        key={feature.properties.id}
                        className="itinerary-item p-3 rounded-lg cursor-pointer"
                        onClick={() => {
                            mapRef.current?.flyTo({
                                center: feature.geometry.coordinates as [number, number],
                                zoom: 14,
                            });
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
                                <h3 className="text-black font-bold">{title}</h3>
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
                        <h1 className="text-xl font-bold text-gray-800">Devin's Vision ✨</h1>
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
                        <button
                            onClick={() => {
                                handleButtonsChange(1);
                                console.log("Day 1 clicked");
                            }}
                            className="px-4 py-2 rounded-t-lg bg-blue-500 text-white font-medium"
                        >
                            Day 1
                        </button>
                        <button
                            onClick={() => {
                                handleButtonsChange(2);
                                console.log("Day 2 clicked");
                            }}
                            className="px-4 py-2 rounded-t-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Day 2
                        </button>
                        <button
                            onClick={() => {
                                handleButtonsChange(3);
                                console.log("Day 3 clicked");
                            }}
                            className="px-4 py-2 rounded-t-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Day 3
                        </button>
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
                    <div ref={mapDivRef} id="map" className="absolute inset-0 w-full h-full" />

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
                                    new mapboxgl.LngLatBounds(
                                        geo.coordinates[0] as LngLatLike,
                                        geo.coordinates[0] as LngLatLike
                                    )
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
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => setMediaOpen(false)}
                                    >
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
