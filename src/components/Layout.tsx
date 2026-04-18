

import { Outlet, NavLink } from "react-router";
import { CircleUserRound, Github, Linkedin, Twitter, Menu, X } from 'lucide-react';
import logo from "../assets/logo2.png";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../database/config.js";
import { useEffect, useState } from "react";
import { userData } from "../database/auth.js";

export default function HomePage() {
  const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch User Data
    async function fetchUserData() {
      const userDetails = await userData();
      setUser(userDetails);
    }
    if (isLoggedIn) fetchUserData();

    // 2. Geolocation Permission Logic
    const handlePermission = (state) => {
      if (state === 'granted' || state === 'prompt') {
        getLocation();
      }
    };

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      handlePermission(result.state);
      result.onchange = () => handlePermission(result.state);
    });

    // 3. Firestore Example (Keep logic inside useEffect to prevent multiple calls)
    getDocs(collection(db, "users")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => console.log(doc.id, " => ", doc.data()));
    });
  }, [isLoggedIn]);

  function getLocation() {
    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (pos) => console.log("Location found:", pos.coords),
      (err) => console.warn(`ERROR(${err.code}): ${err.message}`),
      options
    );
  }

  const activeLink = ({ isActive }) => 
    isActive ? "bg-white text-blue-600 px-3 py-1 rounded-full font-bold transition-all" : "px-3 py-1 hover:text-blue-200 transition-colors";

  const currentYear = new Date().getFullYear();
  const footerLinks = [
    { title: "Product", links: ["Features", "Integrations", "Enterprise", "Solutions"] },
    { title: "Support", links: ["Documentation", "API Reference", "Community", "Status"] },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* HEADER */}
      <header className="p-4 sticky top-0 left-0 flex items-center justify-between text-white h-16 w-full z-50 bg-blue-600/80 backdrop-blur-md border-b border-white/10">
        <nav className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
          <span className="ml-2 font-bold text-lg hidden sm:block">Safe Map</span>
        </nav>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-6 text-sm">
          <NavLink to="/" className={activeLink}>Home</NavLink>
          <NavLink to="about" className={activeLink}>About</NavLink>
          <NavLink to="contact" className={activeLink}>Contact</NavLink>
          <NavLink to="map" className={activeLink}>Map</NavLink>
          {!isLoggedIn ? (
            <NavLink to="login" className={activeLink}>Login</NavLink>
          ) : (
            <NavLink to="account" className={activeLink}>
              <div className="flex gap-2 items-center">
                <CircleUserRound size={18} />
                <span>{user?.username || "Profile"}</span>
              </div>
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-blue-600 text-white flex flex-col items-center justify-center gap-8 text-xl md:hidden">
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
          <NavLink to="map" onClick={() => setIsMenuOpen(false)}>Map</NavLink>
          <NavLink to="login" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-blue-950 text-slate-400 py-12 px-6 font-sans mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold">Safe Map</h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Innovative solutions for the modern web. Built with React, powered by passion.
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="#" className="hover:text-blue-400"><Github size={20} /></a>
              <a href="#" className="hover:text-blue-400"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-blue-400"><Twitter size={20} /></a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href={`/${link.toLowerCase()}`} className="hover:text-white transition-all">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Newsletter</h3>
            <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-blue-900/50 border border-blue-800 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-md transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-900 flex flex-col md:flex-row justify-between items-center text-[10px] gap-4">
          <p>&copy; {currentYear} Safe Map Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>

      {/* GUEST BANNER */}
      {!isLoggedIn && (
        <div className="sticky bottom-0 z-30 w-full bg-indigo-950 text-amber-50/80 border-t border-white/10">
          <p className="text-center py-2 text-[10px] uppercase tracking-widest">
            Guest Mode — <span className="text-amber-400 font-bold">Login</span> for full access
          </p>
        </div>
      )}
    </div>
  );
}

//orginal code
// import { Outlet, NavLink } from "react-router"
// import { CircleUserRound, Github, Linkedin, Twitter } from 'lucide-react';
// import logo from "../assets/logo2.png"
// //import { type LinkProps } from  "";
// import {  getDocs ,collection } from "firebase/firestore";
// import {db  } from "../database/config.js"
// import { useEffect, useState } from "react";
// import {userData } from "../database/auth.js"


// export default function HomePage(){

//   const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"))
//   const [user,setUser] = useState()

//  // Assuming an HTML element for feedback

// navigator.permissions.query({ name: 'geolocation' }).then((result) => {
//   // Define a function to handle the state logic
//   const report = (state) => {
//     console.log(`Permission status: ${state}`);
    
//     if (state === 'granted') {
//       // Automatically get position or show your "Locate Me" button
//       getLocation();
//     } else if (state === 'prompt') {
//       console.log("Please click 'Allow' when the browser asks for your location.");
//       // Trigger the actual prompt
//       getLocation();
//     } else if (state === 'denied') {
//       console.warn("Location access is blocked. Please enable it in your browser settings to use this feature.");
//     }
//   };

//   // Run the check immediately
//   report(result.state);

//   // OPTIONAL: Listen for changes (if the user toggles settings)
//   result.onchange = () => {
//     report(result.state);
//   };
// });

// // The actual function that interacts with the GPS hardware
// function getLocation() {
//   const options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
//   };

//   navigator.geolocation.getCurrentPosition(
//     (pos) => {
//       const { latitude, longitude, accuracy } = pos.coords;
//       console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
//     },
//     (err) => {
//       console.warn(`ERROR(${err.code}): ${err.message}`);
//     },
//     options
//   );
// }

//   getDocs(collection(db, "users")).then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     console.log(doc.id, " => ", doc.data());
//   });
// });

// useEffect(()=>{


//      async function fetchUserData(){
//       const userDetails = await userData()
//       setUser(userDetails)
//     }

//     fetchUserData()
// },[isLoggedIn])


//   const currentYear = new Date().getFullYear();

//   const footerLinks = [
//     {
//       title: "Product",
//       links: ["Features", "Integrations", "Enterprise", "Solutions"],
//     },
//     {
//       title: "Support",
//       links: ["Documentation", "API Reference", "Community", "Status"],
//     },
    
//   ];

  
//   const styles ={
//     borderRadius:"999px",
//     color:"blue",
//     fontWeight:"bold",
//     backgroundColor:"white",
//     paddingInline:"6px"
//   }

//   type LinkProps = { isActive: boolean}

//   const activeLink = ({ isActive }:LinkProps)=>isActive ? styles : undefined
//     //this jsx element returns a layout  that will be used in most of the pages
//     return <div className="max-w-full max-h-full ">
//               <header 
//                  className="p-5 sticky top-0 left-0 flex items-center 
//                             justify-between text-white h-16 w-full
//                             font-bold text-sm  z-10 bg-blue-600/10 backdrop-blur-md
//                             "
//                 >
//                    <nav>
//                        <img src={logo} alt="Logo" className="size-14 object-cover  "/>
//                    </nav>
//                    <nav className="flex  items-center gap-4">
//                       <NavLink 
//                          to="/"
//                          style={activeLink}
//                       >Home</NavLink> 
//                       <NavLink 
//                          to="about"
//                          style={activeLink}
//                       >About</NavLink>
//                       <NavLink 
//                          to="contact"
//                          style={activeLink}
//                       >Contact</NavLink>
//                       <NavLink 
//                          to="map"
//                          style={activeLink}
//                       >Map</NavLink>
//                      {!isLoggedIn  && <NavLink 
//                          to="login"
//                          style={activeLink}
//                       >Login</NavLink> }
//                       {isLoggedIn  && <NavLink 
//                          to="account"
//                          style={activeLink}
//                       >
//                         <div className="flex gap-1 justify-center items-center ">
//                           <CircleUserRound />
//                           <p>{user?.username}</p>
//                         </div>
//                       </NavLink> }
//                    </nav>
//               </header>
//                   {
//                     /*
//                      this Outlet component serves as a placeholder for the content of the child routes.
//                      when a user navigates to a specific route, the corresponding component will be rendered in place of the <Outlet/> component.
//                     */
//                   }
//                   <Outlet/>
//     <footer className="bg-blue-950 text-slate-300 py-12 px-6 font-sans">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
//         {/* Brand Section */}
//         <div className="space-y-4">
//           <h2 className="text-white text-2xl font-bold tracking-tight">Safe Map</h2>
//           <p className="text-sm leading-relaxed">
//             Innovative solutions for the modern web. Built with express, powered by passion.
//           </p>
//           <div className="flex space-x-5 pt-2">
//             <a href="#" className="hover:text-blue-400 transition-colors"><Github size={20} /></a>
//             <a href="#" className="hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
//             <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
//           </div>
//         </div>

//         {/* Dynamic Link Sections */}
//         {footerLinks.map((section) => (
//           <div key={section.title}>
//             <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
//               {section.title}
//             </h3>
//             <ul className="space-y-2 text-sm">
//               {section.links.map((link) => (
//                 <li key={link}>
//                   <a href={`/${link.toLowerCase()}`} className="hover:text-white transition-all">
//                     {link}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* Newsletter Section */}
//         <div>
//           <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm font-sans">
//             Stay Updated
//           </h3>
//           <p className="text-xs mb-4">Get the latest technical updates in your inbox.</p>
//           <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
//             <input 
//               type="email" 
//               placeholder="email@example.com" 
//               className="bg-blue-900 border border-blue-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//             <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-md transition-colors text-sm">
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-900 flex flex-col md:flex-row justify-between items-center text-xs">
//         <p>&copy; {currentYear} Safe Map Inc. All rights reserved.</p>
//         <div className="flex space-x-6 mt-4 md:mt-0">
//           <a href="/privacy" className="hover:text-white">Privacy Policy</a>
//           <a href="/terms" className="hover:text-white">Terms of Service</a>
//           <a href="/cookies" className="hover:text-white">Cookies</a>
//         </div>
//       </div>
//     </footer>
//     {!isLoggedIn && (
//   <div className="fixed bottom-0 z-20 left-0 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-amber-50/80 border-t border-white/10">
//     <p className="text-center py-1.5 text-[10px] uppercase tracking-widest">
//       Guest Mode — <span className="text-amber-400">Login</span> for full access
//     </p>
//   </div>
// )}
//  </div>
// }
