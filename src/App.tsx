import { Route, RouterProvider  ,createBrowserRouter , createRoutesFromElements, useNavigate,redirect} from "react-router"
import Layout from './components/Layout.tsx'
import HomePage from './pages/HomePage.tsx'
import MapLayout from './pages/MapPage.tsx'
import MapCurrent from './pages/MapCurrent.tsx'
import OsrmRouteExample from './pages/test.tsx'
import StartSession from './pages/StartSession.tsx'
import SignInPage , {action as signInAction} from './pages/SignInPage.tsx'
import LoginPage, {action as loginAction} from "./pages/LoginPage.tsx"
import AccountHolder , {loader as accountHolderLoader} from "./pages/AccountHolder.tsx"
import { loggIn } from "./lib/utils.ts"
//sekelton for app 

function App() {
  
  const router = createBrowserRouter(
      createRoutesFromElements(
         <>
         <Route 
             path="/"
             element={<Layout/>}
          >
              <Route 
                 index 
                 element={<HomePage/>}
                />
              <Route 
                   path="about" 
                   element={<OsrmRouteExample/>}
                />
              <Route 
                  path="contact" 
                  element={<div>Contact Page</div>}
               />
              <Route 
                   path="map"  
                   element={<MapLayout/>}
                   loader={()=>loggIn("login first to use map")}
              >
                  <Route 
                     index 
                     element={<MapCurrent/>}
                     loader={()=>loggIn("login first to use map")}
                    />
                  <Route 
                     path="historical_events" 
                     element={<h1>Current location</h1>}
                     loader={()=>loggIn("login first to use map")}
                   />
                  <Route 
                     path="current_events" 
                     element={<h1>Current location</h1>}
                     loader={()=>loggIn("login first to use map")}
                  />
                  <Route 
                     path="safe_route" 
                     element={<h1>Current location</h1>}
                     loader={()=>loggIn("login first to use map")}
                   />
              </Route>
              <Route 
                 path="account" 
                 loader={accountHolderLoader}
                 element={<AccountHolder/>}
               />
              <Route 
                  path="*" 
                  element={<div>404 Not Found //modify</div>}
                />
          </Route>
         <Route 
            path="/login" 
            element={<StartSession/>}
          >
                   <Route 
                      index 
                      action={loginAction}
                      element={<LoginPage/>}
                    />
                   <Route 
                      path="signin" 
                      action={signInAction}
                      element={<SignInPage/>}
                    />
         </Route>
         </>
      )
  )
  return  <RouterProvider router={router}/>

}

export default App 




