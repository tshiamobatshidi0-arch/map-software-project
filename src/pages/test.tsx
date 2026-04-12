//test page that will temporally use the about route

import { MapClusterLayer, MapPopup ,Map} from "@/components/ui/map";
import { useState } from "react";

/*import { useEffect, useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerLabel,
} from "@/components/ui/map";
import { Loader2, Clock, Route,} from "lucide-react";
import { Button } from "@/components/ui/button";

const start = { name: "Amsterdam", lng: 4.9041, lat: 52.3676 };
const end = { name: "Rotterdam", lng: 4.4777, lat: 51.9244 };

// Define the protest area coordinates (Polygon)
const activeProtest = [
  [
    [4.65, 52.15],
    [4.70, 52.15],
    [4.70, 52.20],
    [4.65, 52.20],
    [4.65, 52.15], // Loop must close
  ],
];

interface RouteData {
  coordinates: [number, number][];
  duration: number; // seconds
  distance: number; // meters
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${((meters / 1000)).toFixed(1)} km`;
}

const styles = {
  default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

type StyleKey = keyof typeof styles;
export default function OsrmRouteExample() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

   const [style, setStyle] = useState<StyleKey>("default");
  const selectedStyle = styles[style];
  const is3D = style === "openstreetmap3d";

  // Core Safety Routing Method
  async function getSafetyFirstRoute(coordinates: number[][], protestPolygons = []) {
    const URL = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
    const AUTH_TOKEN = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjZlYTJiNDFjODk2MDRlZTNhZmUzMDM2NzEyNGFlZTA3IiwiaCI6Im11cm11cjY0In0=";

    const requestBody = {
      coordinates: coordinates,
      options: {
        avoid_polygons: {
          type: "MultiPolygon",
          coordinates: [protestPolygons] // Wrapped for ORS spec
        }
      },
      preference: "recommended",
      units: "m"
    };

    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/geo+json',
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Route blocked');
    }

    return await response.json();
  }

  useEffect(() => {
    async function initRouting() {
      setIsLoading(true);
      try {
        const waypoints = [
          [start.lng, start.lat],
          [end.lng, end.lat]
        ];

        // Using your Safety Method instead of OSRM
        const geojsonData = await getSafetyFirstRoute(waypoints, activeProtest);

        if (geojsonData?.features?.length > 0) {
          const mappedRoutes: RouteData[] = geojsonData.features.map((feature: any) => ({
            coordinates: feature.geometry.coordinates,
            duration: feature.properties.summary.duration,
            distance: feature.properties.summary.distance,
          }));
          setRoutes(mappedRoutes);
        }
      } catch (error) {
        console.error("Routing Failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initRouting();
  }, []);

  // Sort routes: non-selected first, selected last (renders on top)
  const sortedRoutes = routes
    .map((route, index) => ({ route, index }))
    .sort((a, b) => (a.index === selectedIndex ? 1 : -1));

  return (
    <div className="h-[500px] w-full relative border rounded-xl overflow-hidden shadow-md">
      <Map center={[4.69, 52.14]} zoom={8.5} styles={
          selectedStyle
            ? { light: selectedStyle, dark: selectedStyle }
            : undefined
        }>
        {sortedRoutes.map(({ route, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <MapRoute
              key={index}
              coordinates={route.coordinates}
              color={isSelected ? "#10b981" : "#94a3b8"} // Green for "Safe" route
              width={isSelected ? 6 : 4}
              opacity={isSelected ? 1 : 0.5}
              onClick={() => setSelectedIndex(index)}
            />
          );
        })}

        <MapMarker longitude={start.lng} latitude={start.lat}>
          <MarkerContent>
            <div className="size-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
            <MarkerLabel position="top">{start.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>

        <MapMarker longitude={end.lng} latitude={end.lat}>
          <MarkerContent>
            <div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
            <MarkerLabel position="bottom">{end.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </Map>

     // {/* Info Panel *}
      {routes.length > 0 && (
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {routes.map((route, index) => {
            const isActive = index === selectedIndex;
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedIndex(index)}
                className="justify-start gap-3 bg-white/90 backdrop-blur hover:bg-white"
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-blue-600" />
                  <span className="font-medium text-slate-900">
                    {formatDuration(route.duration)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Route className="size-3" />
                  {formatDistance(route.distance)}
                </div>
                <div className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-700">
                  SAFE ROUTE
                </div>
              </Button>
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-50">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-emerald-900 mt-2">Calculating safe passage...</p>
        </div>
      )}

            <div className="absolute top-2 right-2 z-10">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as StyleKey)}
                className="bg-background text-foreground rounded-md border px-2 py-1 text-sm shadow"
              >
                <option value="default">Default (Carto)</option>
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="openstreetmap3d">OpenStreetMap 3D</option>
              </select>
          </div>
    </div>
  );
}*/

// 1. Update the interface to match DC Crime data
interface CrimeProperties {
  OFFENSE: string;
  METHOD: string;
  BLOCK_SITE_ADDRESS: string;
  REPORT_DAT: string;
}

export default function CrimeMap() {
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: CrimeProperties;
  } | null>(null);

  return (
    <div className="h-[500px] w-full">
      <Map center={[-77.0369, 38.9072]} zoom={11}>
        <MapClusterLayer<CrimeProperties>
          // 2. Use your DC Gov URL here
          data={`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent('petoria,south africa')}&format=json&apiKey=5e7b1eab70f24694a61d4362ce38f88e`}
          clusterRadius={40}
          pointColor="#ff4d4d"
          onPointClick={(feature, coordinates) => {
            setSelectedPoint({
              coordinates,
              properties: feature.properties,
            });
          }}
        />

        {selectedPoint && (
          <MapPopup
            longitude={selectedPoint.coordinates[0]}
            latitude={selectedPoint.coordinates[1]}
            onClose={() => setSelectedPoint(null)}
          >
            <div className="p-2">
              {/* 3. Update the UI to show Crime details */}
              <h4 className="font-bold border-b mb-1">{selectedPoint.properties.OFFENSE}</h4>
              <p className="text-xs">Method: {selectedPoint.properties.METHOD}</p>
              <p className="text-xs text-muted-foreground">
                Location: {selectedPoint.properties.BLOCK_SITE_ADDRESS}
              </p>
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  );
}


