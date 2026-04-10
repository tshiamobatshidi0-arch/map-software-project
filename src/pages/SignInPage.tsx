import { useState } from "react"
import { Form, Link ,redirect,  useNavigate} from "react-router"
import { EyeIcon  , EyeOff, ImagePlus} from "lucide-react"
import { addUser } from "../database/auth.js"
import type { ActionProps } from "@/lib/types"
import toast from "react-hot-toast"

//test
// eslint-disable-next-line react-refresh/only-export-components
export async function action({request}:ActionProps){
    localStorage.setItem("isLoggedIn",String(true))

    try {
            const formData = await request.formData()
            const email:string = String(formData.get("email"))
            const password:string = String(formData.get("password"))
            const username:string = String(formData.get("first_name"))
            const name:string = String(formData.get("last_name"))
            const image:File | null = formData.get("profile_picture") as File | null
            const userId = await addUser(email, password, username, name, image)
            toast.success("Account created successfully")
            console.log(userId)
            localStorage.setItem("userId",userId)
            localStorage.setItem("isLoggedIn",String(true))
            return redirect("/map")
    } catch (error) {
             toast.error("Error adding user:" + error.message)
             return null
    }

}

export default function Sigin(){
    const [ showPassword , setShowPassword ] = useState<boolean>(false)
    const [hasAgreed , setHasAgreed] =  useState<boolean>(false)
    const [fileName ,setFileName] = useState<string>("")
    const navigate = useNavigate()
    return<div className="text-white p-4">
               <h1 className="text-4xl my-4">Create an account</h1>
               <p className="text-blue-600 my-2">Already have an account? <Link to="/login" className="text-purple-500 underline">Login in</Link></p>
               <Form 
                   method="POST" 
                   replace
                   className="my-9"
                >
                 <div className="gap-4 flex mb-5">
                    <input 
                         required
                         name="first_name"
                         className="h-10 px-3 bg-blue-900/38 rounded-lg placeholder:text-purple-400" 
                         placeholder="First name"
                             style={{
                            // Direct fix for the Chrome Autofill "Yellow/White" background bug
                            WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                            transition: "background-color 5000s ease-in-out 0s",
                        }}
                    />
                    <input 
                          required
                          name="last_name"
                          className="h-10 px-3 bg-blue-900/38 rounded-lg placeholder:text-purple-400"
                          placeholder="Last name"
                              style={{
                            // Direct fix for the Chrome Autofill "Yellow/White" background bug
                            WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                            transition: "background-color 5000s ease-in-out 0s",
                        }}
                    />
                 </div>
              <div className="w-full mb-5">
                    <label 
                        htmlFor="profile_upload" 
                        className="flex items-center gap-3 h-10 px-4 bg-blue-900/30 border border-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-900/50 transition-all active:scale-[0.98]"
                    >
                        {/* The Icon */}
                        <ImagePlus className="size-5 text-purple-400" />
                        
                        {/* The Custom Text */}
                       {fileName ==="" && <span className="text-purple-400 text-sm font-medium">
                          Profile picture
                        </span>}

                        {/* The Hidden Actual Input */}
                        <input
                       
                        id="profile-upload"
                        name="profile_picture"
                        type="file"
                        className={fileName!==""?"":"hidden"}
                        
                         // Hides the "No file chosen" text
                        accept="image/*"
                        onChange={async(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                 setFileName(file?.name);
                               // console.log(await file.arrayBuffer())
                            }
                        }}
                        />
                    </label>
                </div>
                 <input 
                       required
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="block mb-5 h-10 px-3 text-white bg-blue-900/38 w-full rounded-lg placeholder:text-purple-400"
                          style={{
                            // Direct fix for the Chrome Autofill "Yellow/White" background bug
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
                       required 
                       type={showPassword ? "text":"password"}
                       name="password"
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
                            onClick={()=>setShowPassword(pre=>!pre)}
                            >
                                {showPassword ? <EyeIcon /> :<EyeOff/>}
                            </div>
                 </div>
                 <legend className="flex gap-2  mb-5 items-center">
                    <input className="size-5" onClick={()=>setHasAgreed(pre=>!pre)}type="checkbox"/>
                    <p>I agree to the <button 
                                         onClick={()=>{
                                            navigate("/conditions")
                                            setHasAgreed(pre=>!pre)
                                         }} 
                                         className="text-purple-500 underline"
                                        >
                                            Terms&Conditions
                                        </button></p>
                 </legend>
                 <button disabled={!hasAgreed} className={`w-full ${hasAgreed?'cursor-pointer  bg-purple-900  hover:bg-purple-600':'cursor-not-allowed bg-gray-700 hover:bg-gray-500'}  text-white py-2 px-4 rounded-lg`}>Create account</button>
               </Form>
         </div>
}