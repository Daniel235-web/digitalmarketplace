import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validators";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({// Defining the router for authentication 

    createPayloadUser: publicProcedure// A mutation for creating a new user with given credentials
    .input(AuthCredentialsValidator)
    .mutation( async ({input}) => {
        const {email, password} = input

        // instantiate the payload client for database interaction
        const payload = await getPayloadClient()

        //check if user already exists
        const {docs: users } = await payload.find({
            collection: "users",
            where: {
                email: {
                    equals: email,
                },
            }
        })
        // if a user with the given email already exist throw an error
        if (users.length !== 0)
         throw new TRPCError({
           code: "CONFLICT",
           
         });

         // If there is no user with the given email create one with the given credential
        
         await payload.create({
            collection: 'users',
            data: {
                email,
                password,
                role: "user",
            },
         })
         return {success: true, sentToEmail: email}
    }),

    verifyEmail: publicProcedure
    .input(z.object({token: z.string()}))
    .query(async({input}) =>{
       const {token} = input

       const payload = await getPayloadClient()

       const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
        
       })
       if(!isVerified)
       throw new TRPCError({code: 'UNAUTHORIZED'})

       return {sucess: true}
    }),

    signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async({input, ctx}) => {
       const {email, password} = input
       const {res} = ctx

       const payload = await getPayloadClient()

       try {
        await payload.login({
            collection: "users",
            data: {
                email,
                password,
            },
            res,
        })
        
        return {success: true}
       } catch (err) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
        
       }
    }),
})