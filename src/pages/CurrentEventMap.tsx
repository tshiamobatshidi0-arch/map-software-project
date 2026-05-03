import { useEffect, useState, useMemo } from "react";
import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { TriangleAlert, Radio, Loader2, Navigation, ShieldCheck, MapPin } from "lucide-react";
import { useOutletContext } from "react-router";

// --- TYPES ---
type DraggableMarker = { lat: number; lng: number };
type PlaceInformation = { city: string; street: string };

// --- REUSABLE BEACON VISUAL ---
const BeaconVisual = ({ severity }: { severity: string }) => (
  <div className="relative flex items-center justify-center cursor-pointer group">
    <div className={`relative z-20 size-4 rounded-full border-2 border-white shadow-xl transition-transform group-hover:scale-125 ${severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'}`} />
    <div className={`absolute z-10 size-8 rounded-full animate-ping ${severity === 'CRITICAL' ? 'bg-red-600/40' : 'bg-orange-500/40'}`} />
  </div>
);

// --- COMPONENT: STATIC HAZARD BEACON ---
function HazardBeacon({ report, apiKey }: { report: any; apiKey: string }) {
  const [info, setInfo] = useState({ city: "", street: "" });
  const [loading, setLoading] = useState(false);

  const handleFetchLocation = () => {
    if (info.city) return;
    setLoading(true);
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${report.lat}&lon=${report.lng}&format=json&apiKey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.results?.[0]) {
          setInfo({
            city: data.results[0].city || "Active Zone",
            street: data.results[0].street || "Primary Route",
          });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <MapMarker longitude={report.lng} latitude={report.lat}>
      <MarkerContent onClick={handleFetchLocation}>
        <BeaconVisual severity={report.severity} />
      </MarkerContent>
      <MarkerPopup >
        <div className="w-64 overflow-hidden rounded-2xl border border-white/20 bg-slate-950/90 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-2 ${report.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'}`}>
            <div className="flex items-center gap-2 text-white">
              <TriangleAlert size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">{report.severity} Alert</span>
            </div>
            <span className="text-[10px] font-mono text-white/70">{report.id}</span>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{report.type}</h3>
              {loading ? (
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs italic">Pinpointing location...</span>
                </div>
              ) : (
                <div className="flex items-start gap-1.5 mt-1 text-slate-300">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <p className="text-sm">
                    {info.city ? `${info.street}, ${info.city}` : <span className="text-xs text-slate-500 italic">Click marker to reveal address</span>}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] uppercase font-semibold">
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={12} />
                <span>Verified</span>
              </div>
              <div className="text-slate-500">2 mins ago</div>
            </div>
          </div>
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function GlobalThreatMonitor() {
  const apiKey = "5e7b1eab70f24694a61d4362ce38f88e";
  const reports = useMemo(() => generateMockReports(50), []);
  const { draggableMarker }: { draggableMarker: DraggableMarker } = useOutletContext();
  const [pinnedInfo, setPinnedInfo] = useState<PlaceInformation>({ city: "", street: "" });
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (!draggableMarker?.lat || !draggableMarker?.lng) return;
    setIsGeocoding(true);
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${draggableMarker.lat}&lon=${draggableMarker.lng}&format=json&apiKey=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results?.[0]) {
          setPinnedInfo({
            city: data.results[0].city || "Analyzing...",
            street: data.results[0].street || "Mapping location...",
          });
        }
      })
      .finally(() => setIsGeocoding(false));
  }, [draggableMarker, apiKey]);

  return (
    <>
      {reports.map((report) => (
        <HazardBeacon key={report.id} report={report} apiKey={apiKey} />
      ))}

      {draggableMarker && (
        <MapMarker longitude={draggableMarker.lng} latitude={draggableMarker.lat}>
          <MarkerContent>
            <BeaconVisual severity="CRITICAL" />
          </MarkerContent>
          
          <MarkerPopup>
            <div className="w-72 overflow-hidden rounded-2xl border-2 border-blue-500/50 bg-slate-950 shadow-[0_0_25px_rgba(59,130,246,0.3)] backdrop-blur-xl">
              <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Radio size={16} className="animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Live Selector</span>
                </div>
                <Navigation size={14} className="text-white/80" />
              </div>

              <div className="p-4">
                {isGeocoding ? (
                  <div className="flex flex-col items-center py-4 space-y-3">
                    <Loader2 size={24} className="animate-spin text-blue-500" />
                    <p className="text-xs text-blue-300 font-medium animate-pulse">SYNCHRONIZING COORDINATES</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Current Sector</p>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {pinnedInfo.street}
                      </h3>
                      <p className="text-sm text-slate-400">{pinnedInfo.city}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-[8px] text-slate-500 uppercase">Latitude</p>
                        <p className="text-[10px] font-mono text-blue-300">{draggableMarker.lat.toFixed(5)}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-[8px] text-slate-500 uppercase">Longitude</p>
                        <p className="text-[10px] font-mono text-blue-300">{draggableMarker.lng.toFixed(5)}</p>
                      </div>
                    </div>
                    
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Navigation size={12} />
                      Set as Target
                    </button>
                  </div>
                )}
              </div>
            </div>
          </MarkerPopup>
        </MapMarker>
      )}
    </>
  );
}

// Helper for Mock Data
function generateMockReports(count: number) {
    const reports = [];
    const regions = [{ lat: [-26.3, -25.5], lng: [27.8, 28.5] }];
    for (let i = 0; i < count; i++) {
        reports.push({
            id: `TR-${1000 + i}`,
            lat: Math.random() * (regions[0].lat[1] - regions[0].lat[0]) + regions[0].lat[0],
            lng: Math.random() * (regions[0].lng[1] - regions[0].lng[0]) + regions[0].lng[0],
            type: "Hijacking Risk",
            severity: Math.random() > 0.7 ? "CRITICAL" : "HIGH",
        });
    }
    return reports;
}

// import { useEffect, useState, useMemo } from "react";
// import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
// import { TriangleAlert, Zap, Loader2, Radio } from "lucide-react";
// import { useOutletContext } from "react-router"

// // --- SIMULATION DATA GENERATOR ---
// const generateMockReports = (count: number) => {
//   const reports = [];
//   const regions = [
//     { name: "Gauteng", lat: [-26.3, -25.5], lng: [27.8, 28.5] }, // JHB/Pretoria
//     { name: "Western Cape", lat: [-34.1, -33.7], lng: [18.3, 19.0] }, // Cape Town
//     { name: "KwaZulu-Natal", lat: [-30.0, -29.6], lng: [30.8, 31.1] }, // Durban
//     { name: "Eastern Cape", lat: [-34.0, -33.8], lng: [25.5, 25.7] }, // Gqeberha
//   ];

//   for (let i = 0; i < count; i++) {
//     const region = regions[Math.floor(Math.random() * regions.length)];
//     reports.push({
//       id: `TR-${1000 + i}`,
//       lat: Math.random() * (region.lat[1] - region.lat[0]) + region.lat[0],
//       lng: Math.random() * (region.lng[1] - region.lng[0]) + region.lng[0],
//       type: ["Hijacking Risk", "Civil Unrest", "Road Closure", "High Crime Zone"][Math.floor(Math.random() * 4)],
//       severity: Math.random() > 0.7 ? "CRITICAL" : "HIGH",
//     });
//   }
//   return reports;
// };

// // --- INDIVIDUAL HAZARD COMPONENT ---
// function HazardBeacon({ report, apiKey }: { report: any; apiKey: string }) {
//   const [info, setInfo] = useState({ city: "", street: "" });
//   const [loading, setLoading] = useState(false);

//   // We only fetch geocode when the user clicks the marker to save API credits
//   const handleFetchLocation = () => {
//     if (info.city) return; // Don't re-fetch if we have it
//     setLoading(true);
//     fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${report.lat}&lon=${report.lng}&format=json&apiKey=${apiKey}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.results?.[0]) {
//           setInfo({
//             city: data.results[0].city || "Active Sector",
//             street: data.results[0].street || "Local Route",
//           });
//         }
//       })
//       .finally(() => setLoading(false));
//   };

//   return (
//     <MapMarker longitude={report.lng} latitude={report.lat}>
//       <MarkerContent>
//         <div className="relative flex items-center justify-center cursor-pointer" onClick={handleFetchLocation}>
//           <div className={`relative z-20 size-3 rounded-full border border-white shadow-lg ${report.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'}`} />
//           <div className={`absolute z-10 size-6 rounded-full animate-ping ${report.severity === 'CRITICAL' ? 'bg-red-600/40' : 'bg-orange-500/40'}`} />
//         </div>
//       </MarkerContent>

//       <MarkerPopup>
//         <div className="bg-[#0f0505] text-red-50 p-0 rounded-xl border-2 border-red-600/50 shadow-2xl min-w-[200px] overflow-hidden backdrop-blur-xl">
//           <div className={`${report.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'} px-3 py-1 flex items-center justify-between`}>
//             <span className="text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1">
//               <TriangleAlert size={10} /> {report.severity} ALERT
//             </span>
//             <span className="text-[8px] font-mono text-white/80">{report.id}</span>
//           </div>

//           <div className="p-3 space-y-2">
//             <div>
//               <h4 className="text-[10px] font-black text-white uppercase">{report.type}</h4>
//               {loading ? (
//                 <div className="flex items-center gap-2 mt-1">
//                   <Loader2 size={10} className="animate-spin text-red-500" />
//                   <span className="text-[8px] text-red-400 uppercase">Geolocating...</span>
//                 </div>
//               ) : (
//                 <p className="text-[9px] font-bold text-red-400/80 italic">
//                   {info.city ? `${info.city}, ${info.street}` : "Click to Identify Sector"}
//                 </p>
//               )}
//             </div>
//             <div className="flex items-center gap-2 pt-1 border-t border-red-900/30">
//                <Radio size={10} className="text-red-500 animate-pulse" />
//                <span className="text-[8px] text-slate-400 uppercase">Verified by Community</span>
//             </div>
//           </div>
//         </div>
//       </MarkerPopup>
//     </MapMarker>
//   );
// }

// // --- MAIN PAGE COMPONENT ---
// export default function GlobalThreatMonitor() {
//   const reports = useMemo(() => generateMockReports(50), []);
//   const apiKey = "5e7b1eab70f24694a61d4362ce38f88e";

//   return (
//     <>
//       {reports.map((report) => (
//         <HazardBeacon key={report.id} report={report} apiKey={apiKey} />
//       ))}
//     </>
//   );
// }


// // import { useOutletContext } from "react-router"
// // import { type PlaceInformation } from "../lib/types"
// // import { useEffect, useState } from "react";
// // import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
// // import Spinner from "@/components/Spinner";



// // type DraggableMarker = { lat: number; lng: number } 


// // const apiKey = "5e7b1eab70f24694a61d4362ce38f88e"; 
// // export default function CurrentEventMap() {
// //     const { draggableMarker } : { draggableMarker: DraggableMarker } = useOutletContext();
// //     console.log("Draggable Marker from Outlet Context:", draggableMarker)
// //     const [pinnedInfo , setPinnedInfo] = useState<PlaceInformation>({city:"",street:""})

// //         useEffect(()=>{

// //             fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${draggableMarker?.lat}&lon=${draggableMarker?.lng}&format=json&apiKey=${apiKey}`)
// //             .then(res => res.json())
// //             .then(data => {
// //                 setPinnedInfo({
// //                     city: data.results[0].city || "",
// //                     street: data.results[0].street || ""})
// //             })
              
// //         },[draggableMarker])
    
// //     return <>
// //     <MapMarker
// //         key={100}
// //         longitude={draggableMarker?.lng||0}
// //         latitude={draggableMarker?.lat||0}
// // >
           
// //             <MarkerContent>
// //                 <div className="size-5 rounded-full bg-blue-800 border-2 border-white shadow-lg" ></div>
// //             </MarkerContent>
// //             <MarkerPopup>
// //                { pinnedInfo?.city ?<div className="space-y-1">
// //                     <p className="font-bold text-lg text-blue-600">{pinnedInfo?.city}</p>
// //                     <p className="text-sm font-bold text-blue-600">{pinnedInfo?.street}</p>
// //                 </div>:<Spinner/>}
// //             </MarkerPopup>
               
// //         </MapMarker>
// //     </>
// // }
