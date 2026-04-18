import { Search, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, useNavigate } from "react-router";

type locationProperties = {
  name: string;
  lon: number;
  lat: number;
};

interface DialogDemoProps {
  locationSearched: locationProperties;
  setLocationSearched: React.Dispatch<React.SetStateAction<locationProperties>>;
  locationsSuggests: React.JSX.Element[] | React.JSX.Element;
}

export default function DialogDemo({
  locationSearched,
  setLocationSearched,
  locationsSuggests,
}: DialogDemoProps) {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="pointer-events-auto flex items-center gap-2 px-6 h-11 bg-white/80 backdrop-blur-md border border-white/20 text-blue-600 font-bold rounded-2xl shadow-lg hover:bg-white hover:scale-105 transition-all">
          <Search size={18} />
          <span>Where to?</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] z-[2000] overflow-visible border-white/20 bg-slate-900/80 backdrop-blur-2xl text-white shadow-2xl rounded-[28px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="text-blue-400" />
            Set Destination
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Search for a location to find the safest route.
          </DialogDescription>
        </DialogHeader>

        <div className="relative py-4">
          <div className="relative">
            <input
              autoFocus
              placeholder="Search city, street, or landmark..."
              value={locationSearched?.name}
              onChange={(e) =>
                setLocationSearched({
                  name: e.currentTarget.value,
                  lon: locationSearched?.lon || 0,
                  lat: locationSearched?.lat || 0,
                })
              }
              className="w-full bg-white/10 border border-white/10 text-white placeholder:text-slate-400 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            {locationSearched?.name && (
              <button 
                onClick={() => setLocationSearched({name: "", lon: 0, lat: 0})}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Improved Suggestions Dropdown */}
          {Array.isArray(locationsSuggests) && locationsSuggests.length > 0 && 
           locationSearched?.lat === 0 && (
            <div className="absolute top-[calc(100%-8px)] left-0 right-0 z-[2001] bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl mt-2 max-h-[200px] overflow-y-auto overflow-hidden custom-scrollbar">
              <ul className="divide-y divide-white/5">
                {locationsSuggests}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="text-white">
  <DialogClose asChild>
    <Button 
      variant="ghost" 
      onClick={() => setLocationSearched({name: "", lon: 0, lat: 0})}
    >
      Cancel
    </Button>
  </DialogClose>
  
  <DialogClose asChild>
    <Button 
      type="button" // Change to button to prevent form submission reload
      className="bg-blue-600 hover:bg-blue-700"
      disabled={!locationSearched.lon} // Don't allow navigate if coords aren't set
      onClick={() => {
        // Use the coordinates to fly the map
        navigate(`/map?name=${encodeURIComponent(locationSearched.name)}&lon=${locationSearched.lon}&lat=${locationSearched.lat}`);
        
        // Finalize selection
        setLocationSearched({name: locationSearched.name, lon: locationSearched.lon, lat: locationSearched.lat});
      }}
    >
      Navigate
    </Button>
  </DialogClose>
</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Form ,useNavigate } from "react-router"

// type locationProperties ={
//     name : string,
//     lon: number,
//     lat:number
// }
// interface DialogDemoProps {
//     locationSearched:locationProperties , 
//     setLocationSearched:React.Dispatch<React.SetStateAction<locationProperties>>,
//     locationsSuggests:React.JSX.Element[]|React.JSX.Element
// }

// export default function DialogDemo({locationSearched , setLocationSearched , locationsSuggests }:DialogDemoProps) {

//   const navigate = useNavigate()
//   return (
//     <Dialog>
//         <DialogTrigger asChild>
//             <button className="hover:bg-white hover:text-blue-500 min-w-22 
//                                              max-w-30 font-bold p-2 h-10 text-white rounded-3xl 
//                                              transition-all hover:font-bold bg-blue-500">
//                  Direction
//            </button>
//         </DialogTrigger>
//       <Form method="POST">
//         <DialogContent className="sm:max-w-sm z-50 border-blue-700 text-blue-500 w-sm h-56 bg-purple-950/30" >
          
//           <DialogHeader>
//             <DialogTitle><h1 className="font-bold ">Where to?</h1></DialogTitle>
//             <DialogDescription>
//                <p>Enter name of a place in order to get directions</p>
//             </DialogDescription>
//           </DialogHeader>
//               <input 
//                 list="locations" 
//                 value={locationSearched?.name} 
//                 onChange={(e)=>setLocationSearched({name: e.currentTarget.value, lon: locationSearched?.lon || 0, lat: locationSearched?.lat || 0})}
//                 className=" w-full
//                             bg-purple-900/50 border border-blue-700 text-white 
//                             p-1 rounded-lg text-center outline-none 
//                             focus:ring-2 focus:ring-blue-500 
//                             placeholder-slate-400 appearance-none "
//                 />
//                {locationsSuggests.length > 0  && locationSearched?.lat==0 && locationSearched?.lon==0  ? <div className="z-55 text-white font-bold w-[94%] absolute bg-blue-900 p-1 text-center top-33 left-3 rounded-lg" id="locations">
//                     <ul>
//                       {locationsSuggests}
//                     </ul>
//                 </div> : null}
//           <DialogFooter className="text-white">
//             <DialogClose  asChild>
//               <Button  className="bg-purple-700" onClick={()=>navigate("/map")} variant="outline">Cancel</Button>
//             </DialogClose>
//              <DialogClose asChild>
//                 <Button 
//                     variant="outline"
//                     type="submit" 
//                     className="bg-blue-700"
//                     onClick={()=>{
//                         navigate(`/map?name=${locationSearched.name}&lon=${locationSearched.lon}&lat=${locationSearched.lat}`)
//                         setLocationSearched({name:"",lon:0,lat:0})
//                     }}>Navigate</Button>
//              </DialogClose>
//           </DialogFooter>
//         </DialogContent>
//       </Form>
//     </Dialog>
//   )
// }

