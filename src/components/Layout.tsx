import { Outlet, NavLink } from "react-router"
import { CircleUserRound, Github, Linkedin, Twitter } from 'lucide-react';
import logo from "../assets/logo2.png"
//import { type LinkProps } from  "";
import {  getDocs ,collection } from "firebase/firestore";
import {db  } from "../database/config.js"
import { useEffect, useState } from "react";
import {userData } from "../database/auth.js"


export default function HomePage(){

  const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"))
  const [user,setUser] = useState()

  getDocs(collection(db, "users")).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
});

useEffect(()=>{


     async function fetchUserData(){
      const userDetails = await userData()
      setUser(userDetails)
    }

    fetchUserData()
},[isLoggedIn])


  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Integrations", "Enterprise", "Solutions"],
    },
    {
      title: "Support",
      links: ["Documentation", "API Reference", "Community", "Status"],
    },
    
  ];

  
  const styles ={
    borderRadius:"999px",
    color:"blue",
    fontWeight:"bold",
    backgroundColor:"white",
    paddingInline:"6px"
  }

  type LinkProps = { isActive: boolean}

  const activeLink = ({ isActive }:LinkProps)=>isActive ? styles : undefined
    //this jsx element returns a layout  that will be used in most of the pages
    return <div className=" w-full ">
              <header 
                 className="p-5 sticky top-0 left-0 flex items-center 
                            justify-between text-white h-16 w-screen
                            font-bold text-sm  z-10 bg-blue-600/10 backdrop-blur-md
                            "
                >
                   <nav>
                       <img src={logo} alt="Logo" className="size-14 object-cover  "/>
                   </nav>
                   <nav className="flex  items-center gap-4">
                      <NavLink 
                         to="/"
                         style={activeLink}
                      >Home</NavLink> 
                      <NavLink 
                         to="about"
                         style={activeLink}
                      >About</NavLink>
                      <NavLink 
                         to="contact"
                         style={activeLink}
                      >Contact</NavLink>
                      <NavLink 
                         to="map"
                         style={activeLink}
                      >Map</NavLink>
                     {!isLoggedIn  && <NavLink 
                         to="login"
                         style={activeLink}
                      >Login</NavLink> }
                      {isLoggedIn  && <NavLink 
                         to="account"
                         style={activeLink}
                      >
                        <div className="flex gap-1 justify-center items-center ">
                          <CircleUserRound />
                          <p>{user?.username}</p>
                        </div>
                      </NavLink> }
                   </nav>
              </header>
                  {
                    /*
                     this Outlet component serves as a placeholder for the content of the child routes.
                     when a user navigates to a specific route, the corresponding component will be rendered in place of the <Outlet/> component.
                    */
                  }
                  <Outlet/>
    <footer className="bg-blue-950 text-slate-300 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-white text-2xl font-bold tracking-tight">Safe Map</h2>
          <p className="text-sm leading-relaxed">
            Innovative solutions for the modern web. Built with express, powered by passion.
          </p>
          <div className="flex space-x-5 pt-2">
            <a href="#" className="hover:text-blue-400 transition-colors"><Github size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Dynamic Link Sections */}
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              {section.title}
            </h3>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase()}`} className="hover:text-white transition-all">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter Section */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm font-sans">
            Stay Updated
          </h3>
          <p className="text-xs mb-4">Get the latest technical updates in your inbox.</p>
          <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="email@example.com" 
              className="bg-blue-900 border border-blue-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-md transition-colors text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-900 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>&copy; {currentYear} Safe Map Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms" className="hover:text-white">Terms of Service</a>
          <a href="/cookies" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
    {!isLoggedIn && (
  <div className="fixed bottom-0 z-20 left-0 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-amber-50/80 border-t border-white/10">
    <p className="text-center py-1.5 text-[10px] uppercase tracking-widest">
      Guest Mode — <span className="text-amber-400">Login</span> for full access
    </p>
  </div>
)}
 </div>
}