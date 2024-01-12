import dotenv from "dotenv"
import path from "path"
import type {InitOptions} from "payload/config"
import payload, { Payload } from "payload";
import nodemailer from "nodemailer";

dotenv.config({// configure environment variable from env file
    path: path.resolve (__dirname, "../.env")
})
const transporter = nodemailer.createTransport({// set up nodemailer for sending emails
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY 
    }
})

let cached = (global as any).payload// initialize a global variable to cache the payload client

if (!cached) {// if the cache in not available then initialize it 
    cached = (global as any).payload = {
        client: null,
        Promise: null,
    } 
}
 interface Args {// define an interface for the args object
   initOptions?: Partial<InitOptions>
 }
export const getPayloadClient = async ({// export a function to get the payload client
    initOptions,
}: Args = {}): Promise<Payload> => {
    if (!process.env.PAYLOAD_SECRET) {// check if  PAYLOAD_SECRET is defined 
        throw new Error("PAYLOAD_SECRETE is missing")
    }

    if (cached.client) {// if the client is already cached return it
        return cached.client
    }

    if (!cached.promise) {// if promise is not cached initialize payload
     cached.promise = payload.init({
        email:{
            transport: transporter,
            fromAddress: 'onboarding@resend.dev',
            fromName: 'DigitalMarket',
        },
            secret: process.env.PAYLOAD_SECRET,
            local: initOptions?.express ? false : true,
            ...(initOptions || {}),
        })
    }
    try {// await the initialization of the payload 
        cached.client = await cached.promise
        
    } catch (error: unknown) {// reset the promise cache if the initialization fails rethrow error
        cached.promise = null
        throw error 
    }
    return cached.client;
}
