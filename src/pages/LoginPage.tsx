import { Link ,Form,useSearchParams, useNavigation ,redirect} from "react-router"
import {  EyeIcon,InfoIcon,EyeOff} from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { type ActionProps  } from "@/lib/types"
import { login } from "@/lib/utils"
import { loginWithEmailAndPassword } from "../database/auth.js"

//form action 
export async function action({ request }:ActionProps ){
    //data collection from the form
    const formData = await request.formData()
    const email:string = String(formData.get("email"))
    const password:string = String(formData.get("password"))

    try {
        //submit data of form and display toast then go to the map
        await loginWithEmailAndPassword({email,password})
        //redirects to the map
        toast.success("logged in successfully",)
        return redirect("/map")
    } catch (err) {
        //display toast for network issues,unexsitent users and incorrect password
        toast.error("User does not exist")
        return null
    }
  
}




export default function Login(){
   //state for toggling between input type of text and password in order to hide and show it check label A below
   const [ showPassword , setShowPassword ] = useState<boolean>(false)
   //searchParams to grap message send from the redirect("/login?message=this is to set the url with a message") check labels B
   const [searchParams , setSearchParams] = useSearchParams()
   const message = searchParams.get("message")
   //states of the form e.g loading ,idle and submitting check label c
   const navigation = useNavigation()
   const [readyToPress ,setReadyToPress] = useState<boolean>(false)

 
  //useEffect usecase here avoides a infinate loop
    useEffect(()=>{
        //after 2 sec deletes the message on url bar (label B1)
         setTimeout(()=>{
            setSearchParams(pre=>{
                 if(pre.get("message")) pre.delete("message")  
                 return pre
            })
            setReadyToPress(true)
        },2000)
    },[])

   
    return<div className="text-white p-4">
               <h1 className="text-4xl my-4">Login to an account</h1>

               {/**if user tries to use the map without logging in this message will display for 2 secs  label B2*/}
               {message && <p className="text-red-700 transition  flex gap-3 rounded-2xl px-0 bg-white font-bold "><InfoIcon/>{message}</p>}
               <p className="text-blue-600 my-2">Don't have an account? <Link to="signin" className="text-purple-500 underline">Sign in</Link></p>
               <Form  
                   method="POST" 
                   replace
                   className="my-9"
                >
                        <input 
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            className="block mb-5 h-10 px-3 text-white bg-blue-900/38 w-full rounded-lg placeholder:text-purple-400"
                                style={{
                                   // fix for the Chrome Autofill  
                                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                                    transition: "background-color 5000s ease-in-out 0s",
                                }}
                        />
                        <div className="w-full mb-5 bg-blue-900/38
                                        flex justify-between 
                                     focus-within:border-blue-500 
                                        focus-within:ring-1
                                        focus-within:ring-blue-500 
                                        items-center rounded-lg  text-white">
                            <input 
                            /**label A */
                            type={showPassword ? "text":"password"}
                            name="password"
                            required
                            placeholder="Password"
                            className="min-w-20 bg-transparent text-white placeholder:text-purple-400 outline-none w-full px-3 selection:bg-indigo-100 autofill:bg-transparent"
                                style={{
                                    // Direct fix for the Chrome Autofill "Yellow/White" background bug
                                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                                    transition: "background-color 5000s ease-in-out 0s",
                                }}
                            
                            />
                            <div 
                            className="size-10 text-center flex items-center justify-center text-purple-400"
                            //label B2
                            onClick={()=>setShowPassword(pre=>!pre)}
                            >  
                                 {/**label B3 */}
                                {showPassword ? <EyeIcon /> :<EyeOff/>}
                            </div>
                        </div>

                        <button 
                           //label c1
                           className={`${navigation.state==="submitting"?"bg-gray-500  hover:bg-gray-900 cursor-not-allowed":" hover:bg-purple-600  bg-purple-900 cursor-pointer"} w-full
                                    text-white py-2 px-4 
                                     rounded-lg`}
                             //label c2
                           disabled={navigation.state==="submitting"||!readyToPress}
                         //label c4
                        >{navigation.state==="submitting"?"logging in..":"Login"}</button>
               </Form>
         </div>
}
