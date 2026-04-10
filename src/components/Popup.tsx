import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form ,useNavigate } from "react-router"

type locationProperties ={
    name : string,
    lon: number,
    lat:number
}
interface DialogDemoProps {
    locationSearched:locationProperties , 
    setLocationSearched:React.Dispatch<React.SetStateAction<locationProperties>>,
    locationsSuggests:React.JSX.Element[]|React.JSX.Element
}

export default function DialogDemo({locationSearched , setLocationSearched , locationsSuggests }:DialogDemoProps) {

  const navigate = useNavigate()
  return (
    <Dialog>
        <DialogTrigger asChild>
            <button className="hover:bg-white hover:text-blue-500 min-w-22 
                                             max-w-30 font-bold p-2 h-10 text-white rounded-3xl 
                                             transition-all hover:font-bold bg-blue-500">
                 Direction
           </button>
        </DialogTrigger>
      <Form method="POST">
        <DialogContent className="sm:max-w-sm z-50 border-blue-700 text-blue-500 w-sm h-56 bg-purple-950/30" >
          
          <DialogHeader>
            <DialogTitle><h1 className="font-bold ">Where to?</h1></DialogTitle>
            <DialogDescription>
               <p>Enter name of a place in order to get directions</p>
            </DialogDescription>
          </DialogHeader>
              <input 
                list="locations" 
                value={locationSearched?.name} 
                onChange={(e)=>setLocationSearched({name: e.currentTarget.value, lon: locationSearched?.lon || 0, lat: locationSearched?.lat || 0})}
                className=" w-full
                            bg-purple-900/50 border border-blue-700 text-white 
                            p-1 rounded-lg text-center outline-none 
                            focus:ring-2 focus:ring-blue-500 
                            placeholder-slate-400 appearance-none "
                />
               {locationsSuggests.length > 0  && locationSearched?.lat==0 && locationSearched?.lon==0  ? <div className="z-55 text-white font-bold w-[94%] absolute bg-blue-900 p-1 text-center top-33 left-3 rounded-lg" id="locations">
                    <ul>
                      {locationsSuggests}
                    </ul>
                </div> : null}
          <DialogFooter className="text-white">
            <DialogClose  asChild>
              <Button  className="bg-purple-700" onClick={()=>navigate("/map")} variant="outline">Cancel</Button>
            </DialogClose>
             <DialogClose asChild>
                <Button 
                    variant="outline"
                    type="submit" 
                    className="bg-blue-700"
                    onClick={()=>{
                        navigate(`/map?name=${locationSearched.name}&lon=${locationSearched.lon}&lat=${locationSearched.lat}`)
                        setLocationSearched({name:"",lon:0,lat:0})
                    }}>Navigate</Button>
             </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Form>
    </Dialog>
  )
}
