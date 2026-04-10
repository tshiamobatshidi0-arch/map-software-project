import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type NewsItem ,type User} from "./types"
import newImage1 from "../assets/newImage1.jpg"
import newImage2 from "../assets/newImage2.jpg"
import newImage3 from "../assets/newImage2.jpg"
import React from "react"
import { redirect } from "react-router"

//do not modify this code it came with installations
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//fake data
export const newsItems :Array<NewsItem> = [
    {
        id : 1,
        title: "News Item 1",
        description: "Description for News Item 1 sddgd   bdjddjsjjss wwjww wjhwhwhqhq"+
               "edde  njdskkkdd wke ee dewjnedned wejedjjewjdkw fdreryreyyeueuurffwwe",
        src:newImage1
    },
    {
        id : 2,
        title: "News Item 2",
        description: "Description for News Item 2",
        src:newImage2
    },
    {
        id : 3,
        title: "News Item 3",
        description: "Description for News Item 3",
        src:newImage3
    }
]

type DisplayMessageToScreenProps = {
       message:string;
       setButtonDisplayed:React.Dispatch<React.SetStateAction<boolean>>;
       setMessageToBeDisplayed:React.Dispatch<React.SetStateAction<string>>;
}


//delay to simulate a promise form a server
export const sleep: (ms: number) => Promise<void> = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export async function  displayMessageToScreen({ message, setButtonDisplayed,setMessageToBeDisplayed }:DisplayMessageToScreenProps )
 {
       for(let i=0;i<message.length;i++){
             await  sleep(50)
             setMessageToBeDisplayed(pre=>pre.length<message.length ? pre+message[i]:pre)
        }  
        setButtonDisplayed(true)
   }


   //login api simulation that stores an token in localstorage
export async function login(user:User){
      //waits for 3 sec
      await sleep(3000)
      //gurad cluaseses for sad paths
      if(user.email !=="x@gmail.com" ) throw new LoginError("User does not exist")
    
      if(user.password !== '123')  throw new LoginError("Incorrect password")
      
      localStorage.setItem("isLoggedIn",String(true))
    
}

//login error
class LoginError extends Error{
    constructor(message:string){
       super("Login Error: "+message)
    }
}

 export const loggIn =  async (message:string)=>{
                        const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"))
                        if(!isLoggedIn) return redirect(`/login?message=${message}`)
                     }