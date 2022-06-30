import e, { Request, Response } from "express";

import "dotenv/config"
import * as bcrypt from "bcrypt";

import { client } from "../../db/prismaClient";
import { Prisma } from "@prisma/client";
import { GenarateTokenUseCase } from "../../provider/GenerateTokenUseCase";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";

export class UserController {
    async handle (req: Request, res: Response) {
         const {
             name, 
             password
         } = req.body


         const password_hash = await bcrypt.hash(password, 8);
         const user = await client.user.create({
             data: {
                 character_name: name,
                 password_hash,
             }
         }).catch((e: Prisma.PrismaClientKnownRequestError) => {
            if (e.code == "P2002") res.status(401).json("The user already exists.")
        });

        return res.json({
            message: "User created!"
        })
    }

    async session (req: Request, res: Response) {
        const { username, password } = req.body;

        const user = await client.user.findFirst({
            where: {
                character_name: username
            }
        })

        if (user) {

            const checkpassword = await bcrypt.compare(password, user.password_hash);

            if (!checkpassword) { return res.status(401).json("Invalid password.")}
            
            const {id, role} = user

            const generateToken = new GenarateTokenUseCase;
            const token = await generateToken.execute(id, role);

            const generateRefreshToken = new GenerateRefreshToken;
            const refreshToken = await generateRefreshToken.execute(id); 

            return res.json({
                token,
                refreshToken, 
                id, 
            },).status(200)
        } else {
            return res.status(401).json("Something went wrong || user not found.");
        }
    }
}