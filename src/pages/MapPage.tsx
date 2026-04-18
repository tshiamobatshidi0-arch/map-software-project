import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { 
  Mountain, Zap, Map as MapIcon, 
  ShieldCheck, History, Radio, 
  Layers, Navigation2, Search, 
  AlertTriangle 
} from "lucide-react";
import { Map, MapControls, type MapRef } from "@/components/ui/map";
import type { LngLatLike } from "maplibre-gl";
import DialogDemo from "../components/Popup";
import { Button } from "@/components/ui/button";
import DrawerToggleBtn from "../components/DrawerModifed";

export default function MapPage(): React.JSX.Element {
  const styles = {
    default: undefined,
    openstreetmap: "https://tiles.openfreemap.org/styles/bright",
    openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
  };

  type StyleKey = keyof typeof styles;
  const [coords, setCoords] = useState<LngLatLike | undefined>([28.1914, -25.7566]);
  const [locationSearched, setLocationSearched] = useState({ name: "", lon: 0, lat: 0 });
  const [dataSuggested, setDataSuggested] = useState([]);
  const [style, setStyle] = useState<StyleKey>("default");
  
  const mapRef = useRef<MapRef>(null);
  const is3D = style === "openstreetmap3d";
  const selectedStyle = styles[style];



 useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 800 });
  }, [is3D]);

  // 2. LOGIC: Handle Geolocation (Run once on mount)
  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords([pos.coords.longitude, pos.coords.latitude]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    // Cleanup on unmount
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // 3. LOGIC: Handle Search API (Debounced)
  useEffect(() => {
    // Only fetch if there's a name and we haven't already selected these exact coordinates
    if (!locationSearched.name || locationSearched.lat !== 0) {
      if (!locationSearched.name) setDataSuggested([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${locationSearched.name}&apiKey=5e7b1eab70f24694a61d4362ce38f88e`)
        .then(res => res.json())
        .then(result => setDataSuggested(result.features || []))
        .catch(err => console.error("Search error:", err));
    }, 400); // Wait 400ms after user stops typing

    return () => clearTimeout(timer);
  }, [locationSearched.name]);

  // 4. LOGIC: Fly to searched location
  useEffect(() => {
    if (locationSearched.lat !== 0 && locationSearched.lon !== 0) {
      mapRef.current?.flyTo({
        center: [locationSearched.lon, locationSearched.lat],
        zoom: 14,
        duration: 2000
      });
    }
  }, [locationSearched.lat, locationSearched.lon]);

  // NavLink Styling Logic
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
      isActive 
        ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110" 
        : "text-slate-500 hover:bg-white hover:text-blue-600 shadow-sm"
    }`;

  return (
    <main className="relative h-screen w-full overflow-hidden font-sans antialiased text-slate-900">
      
      {/* 1. TOP BAR: Search & Emergency */}
      <header className="absolute top-6 left-0 right-0 z-[1000] px-6 flex justify-between items-start pointer-events-none">
        <div className="flex gap-3 pointer-events-auto items-center">
          <div className="bg-white/70 backdrop-blur-xl p-1.5 rounded-[24px] shadow-2xl border border-white/40 flex items-center gap-2">
            <div className="flex items-center gap-2 pl-4 pr-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Live</span>
            </div>
            
            <DialogDemo 
              locationSearched={locationSearched}
              setLocationSearched={setLocationSearched} 
              locationsSuggests={dataSuggested?.map((data, i) => (
                <div 
                  key={i}
                  className="p-4 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                  onClick={() => setLocationSearched({
                    name: data?.properties?.formatted,
                    lon: data?.geometry?.coordinates[0],
                    lat: data?.geometry?.coordinates[1]
                  })}
                >
                  <Navigation2 size={16} className="text-slate-400 rotate-45" />
                  <span className="text-sm text-slate-700">{data?.properties?.formatted}</span>
                </div>
              ))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto">
          <Button className="h-12 px-6 bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-xl shadow-red-200 border-none transition-transform active:scale-95 flex gap-2">
            <AlertTriangle size={18} />
            <span className="font-bold">Report Danger</span>
          </Button>
        </div>
      </header>

      {/* 2. LEFT DOCK: Navigation */}
      <nav className="absolute left-6 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-4 bg-white/60 backdrop-blur-2xl p-3 rounded-[32px] shadow-2xl border border-white/50">
        <NavLink to="../map" end className={navLinkClasses}>
          <MapIcon size={22} />
        </NavLink>
        <NavLink to="historical_events" className={navLinkClasses}>
          <History size={22} />
        </NavLink>
        <NavLink to="current_events" className={navLinkClasses}>
          <Radio size={22} />
        </NavLink>
        <NavLink to="safe_route" className={navLinkClasses}>
          <ShieldCheck size={22} />
        </NavLink>
        
        <div className="h-[1px] w-8 bg-slate-300 mx-auto my-2" />
        
        <button className="flex items-center justify-center w-12 h-12 rounded-2xl text-slate-500 hover:bg-white hover:text-blue-600 transition-all">
          <Layers size={22} />
        </button>
      </nav>

      {/* 3. MAP AREA */}
      <section className="absolute inset-0 z-0">
        <Map
          ref={mapRef}
          center={coords}
          zoom={12}
          styles={selectedStyle ? { light: selectedStyle, dark: selectedStyle } : undefined}
        >
          <div className="absolute bottom-10 right-10">
             <MapControls position="bottom-right" />
          </div>
          <Outlet context={{ coords, locationSearched }} />
        </Map>

        {/* Floating Style Pill (Bottom Center) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-slate-900/90 backdrop-blur-lg px-4 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-3">
            <Mountain size={16} className="text-blue-400" />
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as StyleKey)}
              className="bg-transparent text-white text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="default">Standard</option>
              <option value="openstreetmap">Detailed</option>
              <option value="openstreetmap3d">3D Terrain</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. SAFE PATH FLOATING BUTTON (Bottom Right) */}
      <div className="absolute bottom-8 right-24 z-10">
        <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl shadow-blue-300 gap-3 group transition-all">
          <Zap size={20} className="fill-current group-hover:animate-bounce" />
          <span className="text-base font-bold">Calculate Safe Path</span>
        </Button>
      </div>

    </main>
  );
}



// import {useEffect,useRef,useState} from "react"
// //go to file and modify
// import DrawerToggleBtn from "../components/DrawerModifed"
// import { NavLink, Outlet } from "react-router"
// import { Mountain, RotateCcw, Zap } from "lucide-react"
// import { Map ,  MapControls,  useMap, type MapRef} from "@/components/ui/map";
// import type { LngLatLike } from "maplibre-gl";
// import DialogDemo from "../components/Popup";
// import { Button } from "@/components/ui/button";
// //code not finalised 


// //map type and theme

// export default function MapPage():React.JSX.Element{

//   const styles = {
//   default: undefined,
//   openstreetmap: "https://tiles.openfreemap.org/styles/bright",
//   openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
// };

// type StyleKey = keyof typeof styles;

// const [coords ,setCoords ] = useState<LngLatLike | undefined>([0,0])
// const [locationSearched , setLocationSearched] = useState({name:"",lon:0,lat:0})
// const [ dataSuggested ,setDataSuggested ] = useState([])
// const [distination , setDistination ] = useState<Array<number>>([0,0])

// const mapRef = useRef<MapRef>(null);
// const [style, setStyle] = useState<StyleKey>("default");
// const selectedStyle = styles[style];
// const is3D = style === "openstreetmap3d";


//    useEffect(() => {
//     mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
//   }, [is3D]);


// const locationsSuggests =  dataSuggested?.length? dataSuggested
//                             .map( data =><li 
//                                         key={data?.properties?.formatted}
//                                         className="p-2 rounded-lg hover:bg-blue-700/50 cursor-pointer"
//                                         onClick={()=>setLocationSearched(
//                                                           {name:data?.properties?.formatted || "",
//                                                           lon:data?.geometry?.coordinates?.[0] || 0,
//                                                           lat:data?.geometry?.coordinates?.[1] || 0}
//                                                         )}        
//                                       >
//                                         {data?.properties?.formatted}
//                                       </li> ) 
//                       : <li>No places found</li> 





// useEffect(()=>{
//   const id = navigator.geolocation.watchPosition((pos) => {
//   const crd = pos.coords;
//  // navigator.geolocation.clearWatch(id);
//   setCoords([crd.longitude , crd.latitude])
// },(err)=>{ /*console.error(`ERROR(${err.code}): ${err.message}`)*/},{
//   enableHighAccuracy: false,
//   timeout: 90000,
//   maximumAge: 0,
// } );


// const requestOptions = {
//   method: 'GET',
// };



// fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${locationSearched.name}&apiKey=5e7b1eab70f24694a61d4362ce38f88e`, requestOptions)
//   .then(response => response.json())
//   .then(result => {
//       setDataSuggested(result.features)
      
//   })
//   .catch(error => console.log('error', error));

// },[coords,locationSearched.name])

// const navLinkClasses="text-xl hover:bg-white/60 hover:rounded-lg hover:font-bold hover:text-blue-700 p-2 text-blue-100"
  
// const linkStyles = {
//   backgroundColor: 'rgba(255, 255, 255, 0.6)', 
//   borderRadius: '0.5rem',                     
//   fontWeight: '700',                         
//   color: '#1d4ed8'
// }

//      const activeNavLink = ({isActive}:{isActive:boolean})=>isActive ? linkStyles :undefined
//      return <main className="p-8 relative  text-white w-full">
//                <header className="flex gap-4 absolute top-3 left-3 z-9 items-center">
//                       <DrawerToggleBtn>
//                             <NavLink 
//                                  style={activeNavLink}
//                                  className={navLinkClasses} 
//                                  end to="../map"
//                              >Map</NavLink>
//                             <NavLink 
//                                  style={activeNavLink}
//                                  className={navLinkClasses} 
//                                  to="historical_events"
//                              >Historical Events</NavLink>
//                             <NavLink 
//                                  style={activeNavLink}
//                                  className={navLinkClasses} 
//                                  to="current_events"
//                             >Current Events</NavLink>
//                             <NavLink 
//                                  style={activeNavLink}
//                                  className={navLinkClasses} 
//                                  to="safe_route"
//                              >Safe Route</NavLink>
//                       </DrawerToggleBtn>
//                       <nav className="flex gap-4 max-w-60">
//                          <button className="hover:bg-white hover:text-blue-500 min-w-22 
//                                              max-w-30 font-bold p-2 h-10 text-white rounded-3xl 
//                                              transition-all hover:font-bold bg-blue-500">
//                             report
//                          </button>

//                          <DialogDemo 
//                                 locationSearched={locationSearched}
//                                 setLocationSearched={setLocationSearched} 
//                                 locationsSuggests={locationsSuggests}
//                          />

//                          <button className="hover:bg-white flex  hover:text-blue-500 min-w-29
//                                              max-w-30 font-bold p-2 h-10 text-white rounded-3xl 
//                                              transition-all hover:font-bold bg-blue-500">
//                               <Zap />safe path
//                          </button>
//                       </nav>
//                </header>
//                <section className="w-screen h-screen  top-0 left-0 absolute">
//                   <Map 
//                        ref={mapRef}  
//                        center={[28.1914,-25.7566]} 
//                        zoom={12}
//                           styles={
//                               selectedStyle
//                                 ? { light: selectedStyle, dark: selectedStyle }
//                                 : undefined
//                       }
//                    >
//                        <MapControls
//                 position="bottom-right"
//                 showZoom
//                 showCompass
//                 showLocate
//                 showFullscreen
//             />
//                        <Outlet 
//                               context={{coords, distination}}
//                        />
//                   </Map>
//                         <div className="absolute top-2 right-2 z-10">
//                           <select
//                             value={style}
//                             onChange={(e) => setStyle(e.target.value as StyleKey)}
//                             className="bg-background text-foreground rounded-md border px-2 py-1 text-sm shadow"
//                           >
//                             <option value="default">Default (Carto)</option>
//                             <option value="openstreetmap">OpenStreetMap</option>
//                             <option value="openstreetmap3d">OpenStreetMap 3D</option>
//                           </select>
//                         </div>
//                </section>
//                <section className="w-screen h-screen">
//                </section>
//            </main>
// }

/**
 *  <MapControls
                            position="bottom-left"
                            showZoom
                            showCompass
                            showLocate
                            showFullscreen
                        />
                        <MapMarker
                            key={3}
                            longitude={28.1871}
                            latitude={-25.7461}
                          >
                             <MarkerTooltip>Somewhere in SA</MarkerTooltip>
                            <MarkerContent>
                            <div className="size-5 rounded-full bg-blue-800 border-2 border-white shadow-lg" ></div>
                            </MarkerContent>
                            <MarkerPopup>
                            <div className="space-y-1">
                                <p className="font-medium text-foreground">Sonxnx</p>
                                <p className="text-xs text-muted-foreground"> 
                                </p>
                            </div>
                            </MarkerPopup>
                           
                          </MapMarker>

                            <input list="browsers" name="browser" id="browser">
 
 */
