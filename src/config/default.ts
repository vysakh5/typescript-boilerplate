import dotenv from 'dotenv';

dotenv.config();

export const PaginationDefaults = {
    page: 1,
    limit: 20,  
}

export const securityKey = {
    saltWorkFactor: 10,
    accessTokenTtl: "7d",

    privateKey: process.env.PRIVATE_KEY,
}