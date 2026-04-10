import {useEffect,useRef,useState} from "react"
//go to file and modify
import DrawerToggleBtn from "../components/DrawerModifed"
import { NavLink, Outlet } from "react-router"
import { Mountain, RotateCcw, Zap } from "lucide-react"
import { Map ,  MapControls,  useMap, type MapRef} from "@/components/ui/map";
import type { LngLatLike } from "maplibre-gl";
import DialogDemo from "../components/Popup";
import { Button } from "@/components/ui/button";
//code not finalised 


//map type and theme

export default function MapPage():React.JSX.Element{

  const styles = {
  default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

type StyleKey = keyof typeof styles;

const [coords ,setCoords ] = useState<LngLatLike | undefined>([0,0])
const [locationSearched , setLocationSearched] = useState({name:"",lon:0,lat:0})
const [ dataSuggested ,setDataSuggested ] = useState([])
const [distination , setDistination ] = useState<Array<number>>([0,0])

const mapRef = useRef<MapRef>(null);
const [style, setStyle] = useState<StyleKey>("default");
const selectedStyle = styles[style];
const is3D = style === "openstreetmap3d";


   useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
  }, [is3D]);


const locationsSuggests =  dataSuggested?.length? dataSuggested
                            .map( data =><li 
                                        key={data?.properties?.formatted}
                                        className="p-2 rounded-lg hover:bg-blue-700/50 cursor-pointer"
                                        onClick={()=>setLocationSearched(
                                                          {name:data?.properties?.formatted || "",
                                                          lon:data?.geometry?.coordinates?.[0] || 0,
                                                          lat:data?.geometry?.coordinates?.[1] || 0}
                                                        )}        
                                      >
                                        {data?.properties?.formatted}
                                      </li> ) 
                      : <li>No places found</li> 





useEffect(()=>{
  const id = navigator.geolocation.watchPosition((pos) => {
  const crd = pos.coords;
 // navigator.geolocation.clearWatch(id);
  setCoords([crd.longitude , crd.latitude])
},(err)=>{ /*console.error(`ERROR(${err.code}): ${err.message}`)*/},{
  enableHighAccuracy: false,
  timeout: 90000,
  maximumAge: 0,
} );


const requestOptions = {
  method: 'GET',
};



fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${locationSearched.name}&apiKey=5e7b1eab70f24694a61d4362ce38f88e`, requestOptions)
  .then(response => response.json())
  .then(result => {
      setDataSuggested(result.features)
      
  })
  .catch(error => console.log('error', error));

},[coords,locationSearched.name])

const navLinkClasses="text-xl hover:bg-white/60 hover:rounded-lg hover:font-bold hover:text-blue-700 p-2 text-blue-100"
  
const linkStyles = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)', 
  borderRadius: '0.5rem',                     
  fontWeight: '700',                         
  color: '#1d4ed8'
}

     const activeNavLink = ({isActive}:{isActive:boolean})=>isActive ? linkStyles :undefined
     return <main className="p-8 relative  text-white w-full">
               <header className="flex gap-4 absolute top-3 left-3 z-9 items-center">
                      <DrawerToggleBtn>
                            <NavLink 
                                 style={activeNavLink}
                                 className={navLinkClasses} 
                                 end to="../map"
                             >Map</NavLink>
                            <NavLink 
                                 style={activeNavLink}
                                 className={navLinkClasses} 
                                 to="historical_events"
                             >Historical Events</NavLink>
                            <NavLink 
                                 style={activeNavLink}
                                 className={navLinkClasses} 
                                 to="current_events"
                            >Current Events</NavLink>
                            <NavLink 
                                 style={activeNavLink}
                                 className={navLinkClasses} 
                                 to="safe_route"
                             >Safe Route</NavLink>
                      </DrawerToggleBtn>
                      <nav className="flex gap-4 max-w-60">
                         <button className="hover:bg-white hover:text-blue-500 min-w-22 
                                             max-w-30 font-bold p-2 h-10 text-white rounded-3xl 
                                             transition-all hover:font-bold bg-blue-500">
                            report
                         </button>

                         <DialogDemo 
                                locationSearched={locationSearched}
                                setLocationSearched={setLocationSearched} 
                                locationsSuggests={locationsSuggests}
                         />

                         <button className="hover:bg-white flex  hover:text-blue-500 min-w-29
                                             max-w-30 font-bold p-2 h-10 text-white rounded-3xl 
                                             transition-all hover:font-bold bg-blue-500">
                              <Zap />safe path
                         </button>
                      </nav>
               </header>
               <section className="w-screen h-screen  top-0 left-0 absolute">
                  <Map 
                       ref={mapRef}  
                       center={[28.1914,-25.7566]} 
                       zoom={12}
                          styles={
                              selectedStyle
                                ? { light: selectedStyle, dark: selectedStyle }
                                : undefined
                      }
                   >
                       <MapControls
                position="bottom-right"
                showZoom
                showCompass
                showLocate
                showFullscreen
            />
                       <Outlet 
                              context={{coords, distination}}
                       />
                  </Map>
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
               </section>
               <section className="w-screen h-screen">
               </section>
           </main>
}

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

