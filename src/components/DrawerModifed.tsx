//do not touch "@/components/ui/drawer and @/components/ui/button files
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import  { CircleChevronRight } from "lucide-react"

//modify
export default function ModifiedComponent({children}:{children:Array<React.JSX.Element>}){
    return<Drawer  direction="left">
                <DrawerTrigger 
                          className="hover:bg-white flex  hover:text-blue-500 min-w-22
                                       max-w-28 font-bold p-2 h-10 text-white rounded-3xl 
                                      transition-all hover:font-bold bg-blue-500"
                ><CircleChevronRight/> More</DrawerTrigger>
                <DrawerContent className="bg-blue-800 border-none p-8">
                    <DrawerHeader>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription>App Functions will go here</DrawerDescription>
                    </DrawerHeader>
                        {children}
                    <DrawerFooter>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
           </Drawer>
}
