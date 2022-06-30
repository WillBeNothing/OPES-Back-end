import {sign} from 'jsonwebtoken';


export class GenarateTokenUseCase {
    async execute (id: string, role: string) {
        const auth: string = process.env.AUTH_SECRET

        const token = sign({id, role}, auth, {
            subject: id, 
            expiresIn: "900s",
        });

        return token; 
    }
}