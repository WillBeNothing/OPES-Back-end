import 'dotenv/config'
import { Response, Request, NextFunction} from 'express'
import { verify } from 'jsonwebtoken';

interface UserPayload {
    id: string,
    role: string,
}


export function Authenticate(req: Request, res: Response, next: NextFunction){
    const authToken = req.headers.authorization;
    
    if (!authToken) return res.status(401).json({message: "Unauthorized"});

    const [, token] = authToken.split(" ") 
    
    const secret = process.env.AUTH_SECRET

    try {
       const {id, role} = verify(token, secret) as UserPayload;
       req.user = {
        id, role
       }; 
       return next()
    } catch (err) {
        return res.status(401).json({message: "Expired Token!"})
    }
}