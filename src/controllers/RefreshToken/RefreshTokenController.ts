import {Request, Response} from 'express'
import { client } from '../../db/prismaClient';
import { GenarateTokenUseCase } from '../../provider/GenerateTokenUseCase';

export class RefreshTokenController {
    async handle(req: Request, res: Response) {
        const {refresh_token} = req.body;
        
        const findRefreshToken = await client.refreshToken.findFirst({
            where: {
                id: refresh_token,
            }
        })

        if(!findRefreshToken) {
            return res.json('Refresh token invalid!').status(401);
        }

        const user = await client.user.findFirst({
            where: {
                id: findRefreshToken.userId,
            }
        });
        const {id, role} = user;
        const generateTokenUseCase = new GenarateTokenUseCase;
        const token  = await generateTokenUseCase.execute(id, role);

        return res.json({token})

    }
}