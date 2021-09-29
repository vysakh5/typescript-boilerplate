import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import httpRes from "../../utils/responses";

export function createAccountSchema(req: Request , res: Response, next: NextFunction) {
  // create schema object
  const schema = Joi.object({
      
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      countryCode: Joi.string().required(),
      phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      role: Joi.string().valid('super_admin','admin','user').required()
  });

  // schema options
  const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true // remove unknown props
  };

  // validate request body against schema
  const { error, value } = schema.validate(req.body, options);
  
  if (error) {
      // on fail return comma separated errors
      // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
      res.status(400).send(httpRes({code:400, message: `Validation error: ${error.details.map(x => x.message).join(', ')}`}));
  } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      next();
  }
}

export function updateAccountSchema(req: Request , res: Response, next: NextFunction) {
    // create schema object
    const schema = Joi.object({
        id: Joi.string().required(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email(),
        countryCode: Joi.string(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/),
        role: Joi.string().valid('super_admin','admin','user')
    });
  
    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
  
    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        res.status(400).send(httpRes({code:400, message: `Validation error: ${error.details.map(x => x.message).join(', ')}`}));
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
  }

export function loginSchema(req: Request , res: Response, next: NextFunction) {
    // create schema object
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
  
    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
  
    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        res.status(400).send(httpRes({code:400, message: `Validation error: ${error.details.map(x => x.message).join(', ')}`}));
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
  }

  export function changePasswordSchema(req: Request , res: Response, next: NextFunction) {
    // create schema object
    const schema = Joi.object({
        userId: Joi.string().required(),
        oldPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
    });
  
    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
  
    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        res.status(400).send(httpRes({code:400, message: `Validation error: ${error.details.map(x => x.message).join(', ')}`}));
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
  }