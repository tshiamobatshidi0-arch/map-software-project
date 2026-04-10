import { useOutletContext ,useSearchParams} from "react-router"
import { MapControls,MarkerContent,MapMarker,MarkerPopup, MapRoute } from "../components/ui/map"
import { useEffect, useState } from "react"
//import { MapPin } from "lucide-react";


export default function MapCurrent(){
//comment before procceding
  interface RouteData {
  coordinates: [number, number][];
  duration: number; // seconds
  distance: number; // meters
}
    interface Distination {
        coords : Array<number> ,
        distination : Array<number>
    }

    
    const [searchParams , setSearchParams] = useSearchParams()
    const {coords , distination } : Distination = useOutletContext()
    const [pinnedInfo , setPinnedInfo] = useState({city:"",street:""})
    const [endInfo , setEndInfo] = useState({city:"",street:""})

      const [routes, setRoutes] = useState<RouteData[]>([]);
      const [selectedIndex, setSelectedIndex] = useState(0);
      const [isLoading, setIsLoading] = useState(true);


    const distinationName = searchParams.get("name")
    const distinationLon = searchParams.get("lon") && Number(searchParams.get("lon"))
    const distinationLat = searchParams.get("lat") && Number(searchParams.get("lat"))

    console.log(distinationLat,distinationLon)
    useEffect(()=>{

          async function fetchRoutes() {
      try {
       
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coords[0]},${coords[1]};${distinationLon},${distinationLat}?overview=full&geometries=geojson&alternatives=true`
        );

        const data = await response.json();

        
        if (data.routes?.length > 0) {
          const routeData: RouteData[] = data.routes.map(
            (route: {
              geometry: { coordinates: [number, number][] };
              duration: number;
              distance: number;
            }) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
            })
          );
          setRoutes(routeData);
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        setIsLoading(false);
      }
    }

        fetchRoutes()
        async function reverseGeocoding(){
          const startRes = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${coords[1]}&lon=${coords[0]}&format=json&apiKey=5e7b1eab70f24694a61d4362ce38f88e`)
          const startData = await startRes.json()

          const endRes = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${distinationLat}&lon=${distinationLon}&format=json&apiKey=5e7b1eab70f24694a61d4362ce38f88e`)
          const endData = await endRes.json()
         
           setPinnedInfo({city:startData.results[0].city , street:startData.results[0].formatted})
           setEndInfo({city:endData.results[0].city , street:endData.results[0].formatted})

           console.log(endData.results[0])
        }


        reverseGeocoding()
    },[coords,distinationLat,distinationLon])
   

      const sortedRoutes = routes
    .map((route, index) => ({ route, index }))
    .sort((a, b) => {
      if (a.index === selectedIndex) return 1;
      if (b.index === selectedIndex) return -1;
      return 0;
    });

    return <>

      
        {(distinationLon && distinationLat ) && sortedRoutes.map(({ route, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <MapRoute
              key={index}
              coordinates={route.coordinates}
              color={isSelected ? "red" : "green"}
              width={isSelected ? 6 : 5}
              opacity={isSelected ? 1 : 0.6}
              onClick={() => setSelectedIndex(index)}
            />
          );
        })}
        
            <MapMarker
                key={1}
                longitude={coords[0]+0.0001}
                latitude={coords[1]}
            >
           
            <MarkerContent>
                <div className="size-5 rounded-full bg-blue-800 border-2 border-white shadow-lg" ></div>
            </MarkerContent>
            <MarkerPopup>
                <div className="space-y-1">
                    <p className="font-bold text-lg text-blue-600">{pinnedInfo.city || "loading.."}</p>
                    <p className="text-sm font-bold text-blue-600">{pinnedInfo.street|| "loading.."}</p>
                </div>
            </MarkerPopup>
               
            </MapMarker>

            {(distinationLon && distinationLat ) && (
                <MapMarker
                    key={3}
                    longitude={distinationLon}
                    latitude={distinationLat}
                >
                        <MarkerContent >
                          
                             { /*
                             <div className=" flex items-center flex-col   justify-center" >
                                 <MapPin className="  w-7 h-9 text-red-500 shadow-lg m-0"/ >
                             </div>
                             */}
                              <div className="size-5 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                        </MarkerContent>
                        <MarkerPopup>
                            <div className="space-y-1">
                                <p className="font-bold text-lg text-blue-600">{endInfo.city || "loading.."}</p>
                                <p className="text-sm font-bold text-blue-600">{endInfo.street|| "loading.."}</p>
                            </div>
                        </MarkerPopup>
                </MapMarker>   
            )}
         </>
}