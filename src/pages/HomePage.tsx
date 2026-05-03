import videoImage from "../assets/landing_page.mp4"
import mapImage from "../assets/map_image1.png"
import React, { useState, useEffect } from "react"
import { ChevronsLeft, ChevronsRight, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { newsItems, displayMessageToScreen } from "../lib/utils";
import { type NewsItem } from "../lib/types"
import { useNavigate } from "react-router";
import spaceImage from "../assets/space_image.jpg"

export default function HomePage(): React.JSX.Element {
    const [blurEffect, setBlurEffect] = useState<boolean>(false)
    const [buttonDisplayed, setButtonDisplayed] = useState<boolean>(false)
    const [messageToBeDisplayed, setMessageToBeDisplayed] = useState<string>("")
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    
    const message: string = "Our mission is to help our fellow South Africans navigate our country's roads with safety and peace of mind by recommending travel paths and giving real-time alerts."
    const navigate = useNavigate()

    useEffect(() => {
        displayMessageToScreen({ message, setButtonDisplayed, setMessageToBeDisplayed })
    }, [])

    const nextItem = () => setCurrentIndex(prev => (prev < newsItems.length - 1 ? prev + 1 : 0))
    const prevItem = () => setCurrentIndex(prev => (prev <= 0 ? newsItems.length - 1 : prev - 1))

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-blue-500/30">
            
            {/* HERO SECTION: Minimalist & Focused */}
            <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
                {/* <video 
                    autoPlay playsInline loop muted 
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40 scale-105"
                >
                    <source src={videoImage} type="video/mp4" />
                </video> */}
                <img src={spaceImage} alt="Space Background" className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40 scale-105" />
                
                <div className="relative z-10 w-full h-full bg-gradient-to-b from-transparent via-black/20 to-[#050505] flex flex-col items-center justify-center px-6 text-center">
                    <div className="max-w-3xl space-y-8">
                        <h1 className="text-xl md:text-3xl font-light tracking-tight text-blue-100/90 leading-relaxed italic">
                            "{messageToBeDisplayed}"
                        </h1>
                        
                        <div className={`transition-all duration-1000 transform ${buttonDisplayed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                            <button 
                                onClick={() => navigate("/map")}
                                className="group relative px-8 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full overflow-hidden transition-all hover:bg-blue-500 hover:ring-4 hover:ring-blue-500/20"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Launch Map Explorer <Zap size={16} />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO GRID CONTENT SECTION */}
            <section className="py-24 px-6 max-w-7xl mx-auto w-full space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
                    <div>
                        <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">Real-time Intelligence</span>
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mt-2">Trending across the Republic</h2>
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs">Live updates from verified sources and community reports.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Featured News: Large Bento Box */}
                    <div className="lg:col-span-8 relative group h-[450px] rounded-3xl overflow-hidden border border-white/5 bg-white/5">
                        {newsItems.map((item: NewsItem, index: number) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-all duration-1000 ${index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}
                                style={{ backgroundImage: `url(${item.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-10">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase mb-4 inline-block">Flash Report</span>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-300 line-clamp-2 max-w-xl">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Minimalist Controls */}
                        <div className="absolute bottom-10 right-10 flex gap-3 z-20">
                            <button onClick={prevItem} className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all">
                                <ChevronsLeft size={20} />
                            </button>
                            <button onClick={nextItem} className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all">
                                <ChevronsRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Small Bento Box: Features */}
                    <div className="lg:col-span-4 grid grid-rows-2 gap-6">
                        <div className="bg-[#111] p-8 rounded-3xl border border-white/5 flex flex-col justify-center space-y-4 hover:bg-[#161616] transition-colors">
                            <ShieldCheck className="text-blue-500" size={32} />
                            <h4 className="text-lg font-semibold text-white">Safety Analysis</h4>
                            <p className="text-xs leading-relaxed text-slate-400">High-risk zone detection using localized incident history.</p>
                        </div>
                        <div className="bg-[#111] p-8 rounded-3xl border border-white/5 flex flex-col justify-center space-y-4 hover:bg-[#161616] transition-colors">
                            <MapPin className="text-blue-500" size={32} />
                            <h4 className="text-lg font-semibold text-white">Smart Routing</h4>
                            <p className="text-xs leading-relaxed text-slate-400">Path optimization that avoids congestion and road hazards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACTION SECTION: Glassmorphism Card */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/10 rounded-[3rem] p-12 border border-white/10 relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white leading-tight">Join the community protecting <br/><span className="text-blue-500">South African Commuters.</span></h2>
                            <p className="text-sm text-slate-400 max-w-md leading-relaxed">Create an account to personalize your alerts and contribute to the real-time road safety network.</p>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-slate-200 transition-colors">Create Account</button>
                                <button className="px-6 py-2.5 bg-transparent border border-white/20 text-white text-xs font-bold rounded-full hover:bg-white/5 transition-colors">Sign In</button>
                            </div>
                        </div>

                        {/* Interactive Map Card */}
                        <div className="relative group cursor-none" 
                             onMouseEnter={() => setBlurEffect(true)}
                             onMouseLeave={() => setBlurEffect(false)}
                             onClick={() => navigate("/map")}>
                            <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video">
                                <img 
                                    src={mapImage} 
                                    alt="Map Preview"
                                    className={`w-full h-full object-cover transition-all duration-700 ${blurEffect ? "scale-105 blur-[2px]" : "scale-100"}`}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Enter Map</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}


// import videoImage from "../assets/landing_page.mp4"
// import mapImage from "../assets/map_image1.png"
// import React , {useState,useEffect} from "react"
// import { ChevronsLeft, ChevronsRight }  from 'lucide-react'; 
// import { newsItems, displayMessageToScreen } from "../lib/utils";
// import { type NewsItem } from "../lib/types"
// import { useNavigate } from "react-router";


// //this is the home page component /
// export default function HomePage():React.JSX.Element{
  
// //the states used to control the visual effects on the map 
// const [blurEffect,setBlurEffect] = useState<boolean>(false)

// //states to display the message on the landing page and to control the display of the navigate button after the message has been fully displayed.
// const [buttonDisplayed,setButtonDisplayed] = useState<boolean>(false)
// const [messageToBeDisplayed,setMessageToBeDisplayed] = useState<string>("")
// const message : string =" Our mission is to help our fellow South Africans navigate our country's roads with safety and peace of mind by recommending travel paths and giving real-time alerts based off current news on what's happening on the roads"
// //used to change the route when the user clicks on the navigate button after the message has been fully displayed. 
// const navigate = useNavigate()

// useEffect(()=>{  
//      displayMessageToScreen({message,setButtonDisplayed,setMessageToBeDisplayed}) 
// },[])


// //index state to keep track of the current news item being displayed in the trending section.
// const [currentIndex , setCurrentIndex] = useState<number>(0)

// //functions to move back and forth between the news items in the trending section. 
// function nextItem(){
//    setCurrentIndex( prevIndex => prevIndex < newsItems.length-1?prevIndex+1 : 0)
// }

// function previousItem(){
//    setCurrentIndex( prevIndex => prevIndex <=0 ? newsItems.length-1:prevIndex-1)
// }

// //this is the slide show images for the trending section. it maps through the newsItems array and creates a JSX element 
// const newsItemsElement : Array<React.JSX.Element> = newsItems.map( (item:NewsItem,index:number) => {

//     const styles = {
//                      backgroundImage: `url(${item.src})`,
//                      backgroundSize: "cover",
//                     }
//     return <div
//              style={styles}
//              className={`${index === currentIndex ? "block" : "hidden"}
//                         "w-full h-full z-[-1] object-cover rounded-lgss`}
//              key={item.id}
//             >
//                    <div className="costume-background-color">
//                      <div className="flex flex-col gap-2 absolute bottom-9
//                                      left-5 w-30  h-20  text-ellipsis overflow-hidden  text-white">
//                         <h2 className="text-xl font-bold">{item.title}</h2>
//                         <p className="">{item.description}</p>  
//                      </div> 
//                    </div>
//                </div>
                
// })

//     return <>
//          <main className="h-full w-full mb-10 ">
//              <div className="min-h-full absolute w-full ">
//                 <video autoPlay  
//                        playsInline 
//                        loop 
//                        muted 
//                        className="w-full relative 
//                                   z-[-1] top-0 left-0 
//                                   overflow-hidden h-screen
//                                   object-cover">
//                     <source src={videoImage} type="video/mp4"/>
//                 </video>

//                 <div className=" z-5 bg-black/40 text-blue-300 flex flex-col  gap-10 top-0 text-center 
//                                  items-center left-0 absolute h-full 
//                                w-full justify-center text-3xl 
//                                  font-sans font-bold">
                    
//                    <div className="w-full">
//                      {messageToBeDisplayed}
//                    </div>
//                    {
//                         buttonDisplayed && 
//                         <button 
//                             className="bg-blue-600 hover:bg-blue-500
//                                         text-white font-medium
//                                         rounded-md transition-colors
//                                         text-sm px-4 py-2"
//                             onClick={()=>navigate("/map")}
//                          >Navigate</button>
//                    }
                   
                
//                 </div>


//              </div>
//           </main>
//          <div className="min-w-250 h-120 p-8 text-blue-400 flex gap-8 rounded-lg  mb-10 ">
//             <div>
//                <h1 className="text-2xl text-white font-bold">Trending today in South Africa</h1>
//                 <p className="text-white mb-4">Stay updated with the latest news and events happening in South Africa.</p>
//                     <div className="relative  z-9 w-150 h-full ">
//                         <button 
//                             className="rounded-full bg-black/60 p-4 hover:bg-blue-500 
//                                         absolute left-5 top-[40%]   transition-colors"     
//                             onClick={previousItem}
//                         ><ChevronsLeft /></button>

//                         {newsItemsElement}

//                         <button 
//                             className="rounded-full bg-black/60 p-4
//                                     absolute right-5 top-[40%] 
//                                     hover:bg-blue-500 transition-colors"
//                             onClick={nextItem}
//                         ><ChevronsRight /></button>
//                     </div>
//             </div>
//             <div className="max-w-140 mt-16 text-blue-500">
//                 <h1 className="text-2xl font-bold">Item 1</h1>
//                 <p className="font-bold text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, doloremque.Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, doloremque.</p>
//             </div>
//          </div>
//          <div className="mt-20 ">
//             <div className="flex  gap-14 p-8 bg-indigo-950">
//                 <div className="max-w-210 min-w-110 mt-4 font-bold text-xl text-blue-400">
//                     <div>to be replaced with the login and sign up sections. these sections
//                      will have a hover effect that will change their border color to indicate t
//                      hat they are interactive elements. when the user hovers over the login section,
//                       the border color will change to indicate that it is clickable. the same applies 
//                       to the sign up section. this visual feedback helps users understand that they can
//                        interact with these sections to either log in or sign up for an account.</div>

//                     <div>to be replaced with the login and sign up sections. these sections
//                      will have a hover effect that will change their border color to indicate t
//                      hat they are interactive elements. when the user hovers over the login section,
//                       the border color will change to indicate that it is clickable. the same applies 
//                       to the sign up section. this visual feedback helps users understand that they can
//                        interact with these sections to either log in or sign up for an account.</div>
//                 </div>
//                 <div  className="rounded-xl max-sm:hidden relative
//                                 bg-white/5 p-4 min-w-89 max-w-100 h-76 mt-4 
//                                     text-center font-bold"
//                     >
//                     <img 
//                         src={mapImage} 
//                         className={
//                                     `w-full h-full z-[-1]
//                                     rounded-xl border
//                                     ${blurEffect ? "blur-sm" : ""}
//                                     transition-blur`
//                                     }
//                         />
//                     <button 
//                             className="z-3 absolute w-34 h-10 text-center  
//                                     align-middle inset-30 bg-blue-600 
//                                     hover:bg-blue-500 text-white font-medium 
//                                     rounded-md transition-colors text-sm"
//                             onMouseEnter={()=>setBlurEffect(true)}
//                             onMouseLeave={()=>setBlurEffect(false)}
//                             onClick={()=>navigate("/map")}
//                     >go to</button>
//                 </div>
//             </div>
//          </div>
//     </>
// } 



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
