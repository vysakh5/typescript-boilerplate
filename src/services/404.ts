
import {Express, NextFunction, Request, Response, Router } from "express";
import httpRes from "../utils/responses";



const notFound: Router = Router();
notFound.use("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send(httpRes({code:404}));
});

export default notFound;
