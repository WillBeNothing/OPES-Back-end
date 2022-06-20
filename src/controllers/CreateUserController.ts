import e, { Request, Response } from "express";

import "dotenv/config"
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';

import { prismaClient } from "../db/prismaClient";
import { Prisma } from "@prisma/client";

export class CreateUserController {
    async handle (req: Request, res: Response) {
         const {
             name, 
             password
         } = req.body


         const password_hash = await bcrypt.hash(password, 8);
         const user = await prismaClient.user.create({
             data: {
                 character_name: name,
                 password_hash,
             }
         }).catch((e: Prisma.PrismaClientKnownRequestError) => {
            if (e.code == "P2002") res.status(401).json("The user already exists.")
        });

         if(user) {
            const userID = user.id;

            const auth: string = process.env.AUTH_SECRET
            const token = jwt.sign({userID}, auth);
            return res.json(token);
         }
         
    }

    async session (req: Request, res: Response) {
        const { username, password } = req.body;

        const user = await prismaClient.user.findFirst({
            where: {
                character_name: username
            }
        })

        if (user) {

            const checkpassword = await bcrypt.compare(password, user.password_hash);

            if (!checkpassword) { return res.status(401).json("Invalid password.")}
            
            const userID = user.id

            const auth: string = process.env.AUTH_SECRET
            const token = jwt.sign({userID}, auth);

            return res.json({token, checkpassword}).status(200)
        } else {
            return res.status(401).json("Something went wrong || user not found.");
        }
    }
}