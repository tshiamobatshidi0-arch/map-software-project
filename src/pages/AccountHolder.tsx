import { UserCircle2 ,Pen,Camera} from "lucide-react"
import { redirect, useLoaderData, useNavigate  } from "react-router"
import { getDoc, doc } from "firebase/firestore";
import { userData,deleteUserAccount, updateUserInfo}  from "../database/auth.js"
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

// 1. Create a reference to the specific document

export async function loader(){
     const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"))
     if(!isLoggedIn) return redirect(`/login?message=login into your account to view details`)
     try{
       
        const userDetails = await userData()
      
        return userDetails
     }catch(err){
         toast.error(err.message)
     }
    
}

export default function AccountHolder(){

   const [data ,setData] = useState(useLoaderData()||"user")
  
    const navigate = useNavigate()

    useEffect(()=>{
       console.log("rerender")
    },[data?.username,data?.name])



   return<>
        
          <div className="text-blue-300 p-10">
             <div className="flex flex-col p-4  bg-blue-600/10 backdrop-blur-md rounded-lg ">
                    <h1 className="text-xl mb-4">Personal Information</h1>
                  <div className="sm:flex sm:gap-5">
                        <div className=" text-center    relative flex max-sm:justify-center" >
                            <UserCircle2 size={100}/>
                            <Camera className="absolute bottom-1 ml-12 p-1 bg-blue-950  rounded-full cursor-pointer" size={30}/>
                        </div>
                        <div>
                        <span className="font-black">Full Name</span>
                        <div className="flex justify-between">
                                <h2 className="text-xl">{data?.username} {data?.name}</h2>
                                <Pen  onClick={async()=>{
                                      const  updateUsername = prompt("username ",data.username)
                                      //data.username = updateUsername 
                                      setData(pre=>({...pre,username:updateUsername}))
                                      await updateUserInfo({username:updateUsername})

                                      const  updateName = prompt("Name",data?.name)
                                      setData(pre=>({...pre,name:updateName}))
                                      await updateUserInfo({name:updateName})
                                  }
                                }/>
                        </div>
                        <span className="font-black">Email</span>
                        <div className="flex justify-between">
                                <h2 className="text-xl">{data.email}</h2>
                             
                        </div>
                        </div>
                  </div>
                   
                   
             </div>
            <button 
                onClick={()=>{
                    localStorage.clear()
                    navigate("/")
                }}
                className=" bg-amber-600 rounded-2xl border-amber-50 p-2"
            >Log out</button>
            <button
                className=" bg-red-600 rounded-2xl border-amber-50 p-2"
                onClick={async()=>{
                    await deleteUserAccount()
                    navigate("/login")
                }}>
                Delete Account
            </button>
         </div>
   </>
}