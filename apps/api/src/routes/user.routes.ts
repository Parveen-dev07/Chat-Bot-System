import Router from "express"
import { getUsers, Userlogin, UserRegister } from "../controllers/user.controller.js";

const route = Router();
console.log("show reach user route successfully");


route.post("/user-register",UserRegister);
route.post("/user-login",Userlogin);
route.get("/get-users",getUsers)

export default route