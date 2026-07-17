import Home from "../components/Home"
import Login from "../components/Login"
import Register from "../components/Register"
import PageNotFound from "../pages/PageNotFound"

export const PublicRoutes  = [
    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/login",
        element:<Login/>

    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/page-not-found",
        element:<PageNotFound/>
    }
]