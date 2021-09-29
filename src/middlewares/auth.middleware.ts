import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import httpRes from "../utils/responses";
import {securityKey} from "../config/default";
import log from "../logger/logger";
import Session from "../models/session.modal";


//to check the access token
const verifyAccessToken = async (req: Request, res: Response, next: any) => {
  let token = req.headers['x-access-token'] as string; // custom header name
  if (token == undefined) {
    return res.status(401).send(httpRes({code: 401, message: "No Token provided"}));
  }
  
  jwt.verify(token, securityKey.privateKey as string, async (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send(httpRes({code: 401, message: "Invalid Token"}));
    }
    let sessionId = decoded.sessionId;
    let sessionData: any = await Session.findOne({_id: sessionId}).lean().catch(err => {
      log.error(err);
      return res.status(500).send(httpRes({code: 500, message: "Internal Server Error while checking session data"}));
    });
    if (sessionData == null) {
      return res.status(401).send(httpRes({code: 401, message: "Invalid Token"}));
    }else{
     // @ts-ignore
    req.user = decoded;
    next();
    }

 
  });



}

export default verifyAccessToken;
