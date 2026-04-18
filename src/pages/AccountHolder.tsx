import { UserCircle2, Pen, Camera, LogOut, Trash2, Mail, MapPin, ChevronRight, ShieldCheck, CreditCard, History } from "lucide-react"
import { redirect, useLoaderData, useNavigate } from "react-router"
import { userData, deleteUserAccount, updateUserInfo } from "../database/auth.js"
import { toast } from "react-hot-toast";
import { useState } from "react";

export async function loader() {
    const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"))
    if (!isLoggedIn) return redirect(`/login?message=Sign in to continue`)
    try {
        const userDetails = await userData()
        return userDetails
    } catch (err: any) {
        toast.error("Account sync error")
        return null
    }
}

export default function AccountHolder() {
    const loaderData = useLoaderData()
    const [data, setData] = useState(loaderData || {})
    const navigate = useNavigate()

    const handleEdit = async (field: 'username' | 'name', currentVal: string) => {
        const newVal = prompt(`Update ${field}:`, currentVal)
        if (newVal && newVal !== currentVal) {
            setData((prev: any) => ({ ...prev, [field]: newVal }))
            await updateUserInfo({ [field]: newVal })
            toast.success("Saved")
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans">
            {/* 1. UBER-STYLE TOP NAV */}
            <nav className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#020617] z-50">
                <h1 className="text-xl font-bold tracking-tight">SafeMap</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-400">RSA Support</span>
                </div>
            </nav>

            <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
                
                {/* 2. PROFILE HEADER (Simplified Uber Look) */}
                <section className="flex items-center justify-between group">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-bold">{data?.name || data?.username}</h2>
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600/20 px-2 py-1 rounded text-[10px] font-bold text-blue-400 uppercase">Pro User</div>
                            <span className="text-sm text-slate-400 flex items-center gap-1">
                                4.98 <ShieldCheck size={14} className="text-blue-500" />
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden border-2 border-white/10">
                            <UserCircle2 size="100%" className="text-slate-600" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full shadow-lg">
                            <Camera size={14} />
                        </button>
                    </div>
                </section>

                {/* 3. UBER "BENTO" ACTION GRID */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => navigate("/map")}
                        className="bg-[#0f172a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-28 hover:bg-[#1e293b] transition-colors"
                    >
                        <MapPin className="text-blue-500" />
                        <span className="font-bold text-sm">Navigate</span>
                    </button>
                    <button className="bg-[#0f172a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-28 opacity-50 cursor-not-allowed">
                        <History className="text-blue-500" />
                        <span className="font-bold text-sm">Trip History</span>
                    </button>
                </div>

                {/* 4. LIST-STYLE SETTINGS (Pure Uber UX) */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-500 uppercase px-1">Account Settings</h3>
                    
                    <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5">
                        <button 
                            onClick={() => handleEdit('name', data?.name)}
                            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <UserCircle2 className="text-slate-400" size={20} />
                                <div className="text-left">
                                    <p className="text-sm font-medium">Edit Profile</p>
                                    <p className="text-xs text-slate-500">{data?.username}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-600" />
                        </button>

                        <div className="w-full flex items-center justify-between p-5 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <Mail className="text-slate-400" size={20} />
                                <div className="text-left">
                                    <p className="text-sm font-medium">Email Address</p>
                                    <p className="text-xs text-slate-500">{data?.email}</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <CreditCard className="text-slate-400" size={20} />
                                <div className="text-left">
                                    <p className="text-sm font-medium">Subscription</p>
                                    <p className="text-xs text-slate-500">SafeMap Premium</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* 5. LOGOUT & DANGER ZONE */}
                <div className="pt-4 space-y-4">
                    <button 
                        onClick={() => { localStorage.clear(); navigate("/"); }}
                        className="w-full py-4 text-center font-bold text-sm bg-white text-black rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Log Out
                    </button>

                    <button 
                        onClick={async () => {
                            if(confirm("Confirm account deletion?")) {
                                await deleteUserAccount();
                                navigate("/login");
                            }
                        }}
                        className="w-full py-4 text-center font-bold text-xs text-red-500 uppercase tracking-widest"
                    >
                        Delete Account
                    </button>
                </div>

                <p className="text-center text-[10px] text-slate-600 pt-10 uppercase tracking-widest">
                    v4.12.0 • SafeMap South Africa
                </p>
            </div>
        </div>
    )
}



// import { UserCircle2 ,Pen,Camera} from "lucide-react"
// import { redirect, useLoaderData, useNavigate  } from "react-router"
// import { getDoc, doc } from "firebase/firestore";
// import { userData,deleteUserAccount, updateUserInfo}  from "../database/auth.js"
// import { toast } from "react-hot-toast";
// import { useEffect, useState } from "react";

// // 1. Create a reference to the specific document

// export async function loader(){
//      const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"))
//      if(!isLoggedIn) return redirect(`/login?message=login into your account to view details`)
//      try{
       
//         const userDetails = await userData()
      
//         return userDetails
//      }catch(err){
//          toast.error(err.message)
//      }
    
// }

// export default function AccountHolder(){

//    const [data ,setData] = useState(useLoaderData()||"user")
  
//     const navigate = useNavigate()

//     useEffect(()=>{
//        console.log("rerender")
//     },[data?.username,data?.name])



//    return<>
        
//           <div className="text-blue-300 p-10">
//              <div className="flex flex-col p-4  bg-blue-600/10 backdrop-blur-md rounded-lg ">
//                     <h1 className="text-xl mb-4">Personal Information</h1>
//                   <div className="sm:flex sm:gap-5">
//                         <div className=" text-center    relative flex max-sm:justify-center" >
//                             <UserCircle2 size={100}/>
//                             <Camera className="absolute bottom-1 ml-12 p-1 bg-blue-950  rounded-full cursor-pointer" size={30}/>
//                         </div>
//                         <div>
//                         <span className="font-black">Full Name</span>
//                         <div className="flex justify-between">
//                                 <h2 className="text-xl">{data?.username} {data?.name}</h2>
//                                 <Pen  onClick={async()=>{
//                                       const  updateUsername = prompt("username ",data.username)
//                                       //data.username = updateUsername 
//                                       setData(pre=>({...pre,username:updateUsername}))
//                                       await updateUserInfo({username:updateUsername})

//                                       const  updateName = prompt("Name",data?.name)
//                                       setData(pre=>({...pre,name:updateName}))
//                                       await updateUserInfo({name:updateName})
//                                   }
//                                 }/>
//                         </div>
//                         <span className="font-black">Email</span>
//                         <div className="flex justify-between">
//                                 <h2 className="text-xl">{data.email}</h2>
                             
//                         </div>
//                         </div>
//                   </div>
                   
                   
//              </div>
//             <button 
//                 onClick={()=>{
//                     localStorage.clear()
//                     navigate("/")
//                 }}
//                 className=" bg-amber-600 rounded-2xl border-amber-50 p-2"
//             >Log out</button>
//             <button
//                 className=" bg-red-600 rounded-2xl border-amber-50 p-2"
//                 onClick={async()=>{
//                     await deleteUserAccount()
//                     navigate("/login")
//                 }}>
//                 Delete Account
//             </button>
//          </div>
//    </>
// }
