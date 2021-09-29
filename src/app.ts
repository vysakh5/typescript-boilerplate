import express from "express";
import * as cors from 'cors';

import config from './config/server';
import dbConnect from './config/db';
import log from './logger/logger';
import routes from './services/routes';
import notFound from "./services/404"



const port = config.port as number; 
const host = config.host as string; 

//express init
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors()); // enable cors

dbConnect(); // database connection
app.use("/api",routes); // routes
app.use('*',notFound); // routes


app.listen(port,host, () => {
  log.info(`Server Running on ${port}`);
});