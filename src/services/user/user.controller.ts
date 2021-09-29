import { Request, Response } from "express";
import bcrypt from "bcrypt";
import _ from "lodash";
import jwt from "jsonwebtoken";

import log from "../../logger/logger";
import httpRes from "../../utils/responses"
import {securityKey} from "../../config/default";
import User, {UserDocument} from "../../models/user.model";
import Session, {SessionDocument} from "../../models/session.modal";

export const signup = async (req: Request, res: Response) =>{
  try {
      let params = req.body ;
      const salt = await bcrypt.genSalt(securityKey.saltWorkFactor);
      const hash = await bcrypt.hashSync(params.password, salt);
      params.password = hash;
      params = _.omit(params, ["confirmPassword"]);

      let data = params as UserDocument;
      let newUser = new User(data);
      let userData: any = await newUser.save().catch(err => {
        log.error(err);
        return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
      })
     
      userData = _.omit(userData, ["password"]);
      // log.info(userData);
     
      if(userData){
        return res.status(200).send(httpRes({code:200, message:"User Created Successfully", data:userData}));
      }

    
   
  } catch (e: any) {
    log.error(e);
    return res.status(500).send(httpRes({code:500, message:e}));

  }
}

export const signin = async (req: Request, res: Response) =>{
  try {
    let email = req.body.email;
    let plainPassword = req.body.password;


  let signinUser: any = await User.findOne({ email: email,status:true }).lean().catch(err => {
    log.error(err);
    return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
  })
  if(signinUser){
    let isPasswordValid = await bcrypt.compareSync(plainPassword, signinUser.password);
    if(isPasswordValid){
      
      //Add details to session
      let sessionData = {
        userId: signinUser._id,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip,
      }
      let newSession = new Session(sessionData as SessionDocument);
      let session: any = await newSession.save().catch(err => {
        log.error(err);
        return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
      })
       

      signinUser = _.omit(signinUser, ["password","__v"]);
      let token = jwt.sign({...signinUser,...{sessionId:session.id}}, securityKey.privateKey as string, { expiresIn: securityKey.accessTokenTtl });
      signinUser.accessToken = token;
      return res.status(200).send(httpRes({code:200, message:"User Logged In Successfully", data:signinUser}));
    }else{
      return res.status(401).send(httpRes({code:401, message:"Invalid Password"}));
    }
  }else{
    return res.status(404).send(httpRes({code:404, message:"User Not Found"}));
  }


    
  
 
} catch (e: any) {
  log.error(e);
  return res.status(500).send(httpRes({code:500, message:e}));

}
}

export const signout = async (req: Request, res: Response) =>{
  try {
     // @ts-ignore
      let sessionId = req.user.sessionId;
      let sessionData: any = await Session.findByIdAndDelete(sessionId).catch(err => {
        log.error(err);
        return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
      })
      if(sessionData){
      return res.status(202).send(httpRes({code:202, message:"User Signout Successfully", data:null}));
      }else{
        return res.status(404).send(httpRes({code:404, message:"Session Not Found"}));
      }


    
   
  } catch (e: any) {
    log.error(e);
    return res.status(500).send(httpRes({code:500, message:e}));

  }
}

export const changePassword = async (req: Request, res: Response) =>{
  try {
     // @ts-ignore
    let userId = req.user._id;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;

    let user: any = await User.findOne({_id:userId, status:true}).catch(err => {
      log.error(err);
      return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
    })
    if(user){
      let isPasswordValid = await bcrypt.compareSync(oldPassword, user.password);
      if(isPasswordValid){
        if(newPassword === confirmPassword){
          let salt = await bcrypt.genSalt(securityKey.saltWorkFactor);
          let hash = await bcrypt.hashSync(newPassword, salt);
          user.password = hash;
            user = await user.save().catch(err=> {
            log.error(err);
            return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
          })
          return res.status(200).send(httpRes({code:200, message:"Password Changed Successfully", data:null}));
        }else{
          return res.status(400).send(httpRes({code:400, message:"New Password and Confirm Password does not match"}));
        }
      }else{
        return res.status(401).send(httpRes({code:401, message:"Invalid Old Password"}));
      }
    }else{
      return res.status(404).send(httpRes({code:404, message:"User Not Found"}));
    }
  }catch (e: any) {
    log.error(e);
    return res.status(500).send(httpRes({code:500, message:e}));
  }
}

export const getAllUser = async (req: Request, res: Response) =>{
  try {

  let userData: any = await User.find({status:true}).select("_id email firstName lastName").lean().catch(err => {
    log.error(err);
    return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
  })
  if(userData){
      return res.status(200).send(httpRes({code:200, message:"Users Find Successfully", data:userData}));
    }else{
      return res.status(401).send(httpRes({code:401, message:"Invalid Password"}));
    }
  
  
 
} catch (e: any) {
  log.error(e);
  return res.status(500).send(httpRes({code:500, message:e}));

}
}

export const getSingleUser = async (req: Request, res: Response) =>{
  try {
    let userId = req.query.id as any;
    

  let userData: any = await User.findOne({_id:userId, status:true}).lean().catch(err => {
    log.error(err);
    return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
  })
  if(userData){
    userData = _.omit(userData,["password","__v"]);
      return res.status(200).send(httpRes({code:200, message:"Users Find Successfully", data:userData}));
    }else{
      return res.status(404).send(httpRes({code:404, message:"User not found"}));
    }
  
  
 
} catch (e: any) {
  log.error(e);
  return res.status(500).send(httpRes({code:500, message:e}));

}
}

export const updateUser = async (req: Request, res: Response) =>{
  try {
    let userId = req.body.id as any;
    let userData: any = await User.findByIdAndUpdate(userId, req.body, {new:true}).lean().catch(err => {
      log.error(err);
      return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
    })
    if(userData){
      userData = _.omit(userData,["password","__v"]);
      return res.status(200).send(httpRes({code:200, message:"User Updated Successfully", data:userData}));
    }else{
      return res.status(404).send(httpRes({code:404, message:"User not found"}));
    }
  
  
 
} catch (e: any) {
  log.error(e);
  return res.status(500).send(httpRes({code:500, message:e}));

}
}

export const disableUser = async (req: Request, res: Response) =>{
  try {
     
    let userId = req.query.id as any;
    let userData: any = await User.findOneAndUpdate({_id:userId,status:true},{status:false}).lean().catch(err => {
      log.error(err);
      return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
    })
   
    if(userData){
      let sessionData: any = await Session.findOneAndDelete({userId:userId}).catch(err => {
        log.error(err);
        return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
      })
      return res.status(202).send(httpRes({code:202, message:"User Disabled Successfully"}));
    }else{
      return res.status(404).send(httpRes({code:404, message:"User not found"}));
    }
  
  
 
} catch (e: any) {
  log.error(e);
  return res.status(500).send(httpRes({code:500, message:e}));

}
}

export const enableUser = async (req: Request, res: Response) =>{
  try {
    let userId = req.query.id as string;
    let userData: any = await User.findOneAndUpdate({_id:userId, status:false},{status:true}).lean().catch(err => {
      log.error(err);
      return res.status(500).send(httpRes({code:500,message:`Mongo Error : ${err.code}`}));     
    })
   
    if(userData){
      return res.status(202).send(httpRes({code:202, message:"User Enabled Successfully"}));
    }else{
      return res.status(404).send(httpRes({code:404, message:"User not found"}));
    }
  
  
 
} catch (e: any) {
  log.error(e);
  return res.status(500).send(httpRes({code:500, message:e}));

}
}

