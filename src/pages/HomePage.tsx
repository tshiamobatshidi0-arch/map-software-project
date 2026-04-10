import videoImage from "../assets/landing_page.mp4"
import mapImage from "../assets/map_image1.png"
import React , {useState,useEffect} from "react"
import { ChevronsLeft, ChevronsRight }  from 'lucide-react'; 
import { newsItems, displayMessageToScreen } from "../lib/utils";
import { type NewsItem } from "../lib/types"
import { useNavigate } from "react-router";


//this is the home page component /
export default function HomePage():React.JSX.Element{
  
//the states used to control the visual effects on the map 
const [blurEffect,setBlurEffect] = useState<boolean>(false)

//states to display the message on the landing page and to control the display of the navigate button after the message has been fully displayed.
const [buttonDisplayed,setButtonDisplayed] = useState<boolean>(false)
const [messageToBeDisplayed,setMessageToBeDisplayed] = useState<string>("")
const message : string =" website goal statement and a call to action button to encourage users to explore the website further."+
                        "This section is designed to capture the user's attention and provide a clear message about the purpose "+
                        "of the website."
//used to change the route when the user clicks on the navigate button after the message has been fully displayed. 
const navigate = useNavigate()

useEffect(()=>{  
     displayMessageToScreen({message,setButtonDisplayed,setMessageToBeDisplayed}) 
},[])


//index state to keep track of the current news item being displayed in the trending section.
const [currentIndex , setCurrentIndex] = useState<number>(0)

//functions to move back and forth between the news items in the trending section. 
function nextItem(){
   setCurrentIndex( prevIndex => prevIndex < newsItems.length-1?prevIndex+1 : 0)
}

function previousItem(){
   setCurrentIndex( prevIndex => prevIndex <=0 ? newsItems.length-1:prevIndex-1)
}

//this is the slide show images for the trending section. it maps through the newsItems array and creates a JSX element 
const newsItemsElement : Array<React.JSX.Element> = newsItems.map( (item:NewsItem,index:number) => {

    const styles = {
                     backgroundImage: `url(${item.src})`,
                     backgroundSize: "cover",
                    }
    return <div
             style={styles}
             className={`${index === currentIndex ? "block" : "hidden"}
                        "w-full h-full z-[-1] object-cover rounded-lgss`}
             key={item.id}
            >
                   <div className="costume-background-color">
                     <div className="flex flex-col gap-2 absolute bottom-9
                                     left-5 w-30  h-20  text-ellipsis overflow-hidden  text-white">
                        <h2 className="text-xl font-bold">{item.title}</h2>
                        <p className="">{item.description}</p>  
                     </div> 
                   </div>
               </div>
                
})

    return <>
         <main className="min-h-screen w-full mb-10 ">
             <div className="min-h-full absolute w-full ">
                <video autoPlay  
                       playsInline 
                       loop 
                       muted 
                       className="w-screen relative 
                                  z-[-1] top-0 left-0 
                                  overflow-hidden h-screen
                                  object-cover">
                    <source src={videoImage} type="video/mp4"/>
                </video>

                <div className=" z-5 bg-black/40 text-blue-300 flex flex-col  gap-10 top-0 text-center 
                                 items-center left-0 absolute h-full 
                               w-full justify-center text-3xl 
                                 font-sans font-bold">
                    
                   <div className="w-180">
                     {messageToBeDisplayed}
                   </div>
                   {
                        buttonDisplayed && 
                        <button 
                            className="bg-blue-600 hover:bg-blue-500
                                        text-white font-medium
                                        rounded-md transition-colors
                                        text-sm px-4 py-2"
                            onClick={()=>navigate("/map")}
                         >Navigate</button>
                   }
                   
                
                </div>


             </div>
          </main>
         <div className="min-w-250 h-120 p-8 text-blue-400 flex gap-8 rounded-lg  mb-10 ">
            <div>
               <h1 className="text-2xl text-white font-bold">Trending today in South Africa</h1>
                <p className="text-white mb-4">Stay updated with the latest news and events happening in South Africa.</p>
                    <div className="relative  z-9 w-150 h-full ">
                        <button 
                            className="rounded-full bg-black/60 p-4 hover:bg-blue-500 
                                        absolute left-5 top-[40%]   transition-colors"     
                            onClick={previousItem}
                        ><ChevronsLeft /></button>

                        {newsItemsElement}

                        <button 
                            className="rounded-full bg-black/60 p-4
                                    absolute right-5 top-[40%] 
                                    hover:bg-blue-500 transition-colors"
                            onClick={nextItem}
                        ><ChevronsRight /></button>
                    </div>
            </div>
            <div className="max-w-140 mt-16 text-blue-500">
                <h1 className="text-2xl font-bold">Item 1</h1>
                <p className="font-bold text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, doloremque.Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, doloremque.</p>
            </div>
         </div>
         <div className="mt-20 ">
            <div className="flex  gap-14 p-8 bg-indigo-950">
                <div className="max-w-210 min-w-110 mt-4 font-bold text-xl text-blue-400">
                    <div>to be replaced with the login and sign up sections. these sections
                     will have a hover effect that will change their border color to indicate t
                     hat they are interactive elements. when the user hovers over the login section,
                      the border color will change to indicate that it is clickable. the same applies 
                      to the sign up section. this visual feedback helps users understand that they can
                       interact with these sections to either log in or sign up for an account.</div>

                    <div>to be replaced with the login and sign up sections. these sections
                     will have a hover effect that will change their border color to indicate t
                     hat they are interactive elements. when the user hovers over the login section,
                      the border color will change to indicate that it is clickable. the same applies 
                      to the sign up section. this visual feedback helps users understand that they can
                       interact with these sections to either log in or sign up for an account.</div>
                </div>
                <div  className="rounded-xl max-sm:hidden relative
                                bg-white/5 p-4 min-w-89 max-w-100 h-76 mt-4 
                                    text-center font-bold"
                    >
                    <img 
                        src={mapImage} 
                        className={
                                    `w-full h-full z-[-1]
                                    rounded-xl border
                                    ${blurEffect ? "blur-sm" : ""}
                                    transition-blur`
                                    }
                        />
                    <button 
                            className="z-3 absolute w-34 h-10 text-center  
                                    align-middle inset-30 bg-blue-600 
                                    hover:bg-blue-500 text-white font-medium 
                                    rounded-md transition-colors text-sm"
                            onMouseEnter={()=>setBlurEffect(true)}
                            onMouseLeave={()=>setBlurEffect(false)}
                            onClick={()=>navigate("/map")}
                    >go to</button>
                </div>
            </div>
         </div>
    </>
} 


//<div className="flex max-sm:hidden  flex-col gap-2">

//                        {/*Login and Sign Up section*/}
//                        <div className="w-160 flex gap-9 text-center font-bold justify-end  items-center">

                                {/*Login section*/}
 /*                               <div 
                                    className={
                                            `flex flex-col p-4 w-40 h-40
                                           bg-white/5 rounded-2xl gap-7
                                             ${loginEffect ? "border":""}
                                             transition-colors
                                            `}
                                >
                                    <p>Already have an account? </p>
                                    <button 
                                        className="bg-white/5 border p-1
                                                    hover:bg-blue-500 
                                                    text-center  rounded-lg"
                                        onMouseEnter={()=>setLoginEffect(true)}
                                        onMouseLeave={()=>setLoginEffect(false)}
                                    >Login</button>
                                </div>
*/
                                {/*Sign Up section*/}
 /*                               <div className={
                                    `flex flex-col p-4 w-40 h-40 
                                   bg-white/5 rounded-lg gap-7
                                     ${signEffect ? "border":""}
                                     transition-colors`
                                }>
                                    <p>Don't have an account? </p>
                                    <button 
                                         className="bg-white/5 border p-1 hover:bg-blue-500  
                                                      text-center rounded-xl"
                                         onMouseEnter={()=>setSignEffect(true)}
                                         onMouseLeave={()=>setSignEffect(false)}
                                     >Sign Up</button>
                                </div>
                        </div>
*/
                        {/*Map Content*/}
 /*                       

                    </div> */