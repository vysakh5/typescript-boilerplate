
import { Router } from "express";
import {signup, signin, signout,changePassword, getAllUser, getSingleUser, updateUser, disableUser, enableUser} from "./user.controller";
import {createAccountSchema,updateAccountSchema ,loginSchema, changePasswordSchema} from "./user.schemas";
import verifyAccessToken from "../../middlewares/auth.middleware";


const userRoutes: Router = Router();

//auth routes
userRoutes.post("/signup", createAccountSchema, signup);
userRoutes.post("/signin", loginSchema, signin);
userRoutes.delete("/signout",verifyAccessToken,  signout);
userRoutes.patch("/changepassword",verifyAccessToken, changePasswordSchema, changePassword);

//get alluser
userRoutes.get("/getalluser",verifyAccessToken,  getAllUser);
userRoutes.get("/getsingleuser",verifyAccessToken,  getSingleUser);
userRoutes.patch("/updateuser",verifyAccessToken, updateAccountSchema, updateUser);
userRoutes.delete("/disableuser",verifyAccessToken, disableUser);
userRoutes.patch("/enableuser",verifyAccessToken, enableUser);


export default userRoutes;
