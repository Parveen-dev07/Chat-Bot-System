import { PublicRoutes } from "./commonRoutes";
import { useRoutes } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";


const routes = [
    ...PublicRoutes,
    ...PrivateRoutes
    
]
const AppRoutes= () =>{
    return useRoutes(routes)
}

export default AppRoutes