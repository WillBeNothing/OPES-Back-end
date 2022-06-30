import dayjs from "dayjs";
import {client} from '../db/prismaClient'

export class GenerateRefreshToken {
    async execute(userId: string) {
        const expiresIn = dayjs().add(10, "hours").unix();


        const refreshTokenAlreadyExists = await client.refreshToken.findFirst({
            where: {
                userId, 
            }
        })

        if(refreshTokenAlreadyExists) {
            await client.refreshToken.delete({
                where: {
                    id: refreshTokenAlreadyExists.id,
                }
            })
        }

       const generateRefreshToken =  await client.refreshToken.create({
        data: {
            userId,
            expiresIn,
        }
    })

        return generateRefreshToken; 
    }
}