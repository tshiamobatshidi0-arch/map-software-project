import { Outlet ,useNavigate} from "react-router";
import loginWelcomImage from "../assets/start.png"

//login and sign in page 
export default function StartSession(){
    //makes button behave like a link also it is similer to the rediect() function and to the to-prop of the Link component
    const navigate = useNavigate()
    return <div className="w-screen h-screen  flex gap-20 p-7">
               <div className="max-sm:hidden  relative w-180 h-140">
                     <img 
                         src={loginWelcomImage} 
                         className=" rounded-2xl w-full h-full object-cover" 
                         alt="logo"
                    />
                     <button 
                          className="absolute top-2 right-2  font-bold
                                   bg-purple-900/50 hover:bg-purple-600 
                                   text-white py-2 px-4 rounded-lg"
                          onClick={()=>navigate("/")}
                     >Go back to home</button>
                </div>
                {/**this is where the form for login  and sign in renders depending on on the clicked link */}
               <Outlet/>
           </div>
}