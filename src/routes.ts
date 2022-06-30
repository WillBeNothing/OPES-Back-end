import { Router } from "express";
import { RefreshTokenController } from "./controllers/RefreshToken/RefreshTokenController";
import { UserController } from "./controllers/User/UserController";
import { Authenticate } from "./middlewares/AuthenticationMiddleware";

const router = Router();

const User = new UserController();

const Refresh = new RefreshTokenController();

router.post("/register", User.handle);
router.post('/login', User.session);

router.post('/auth/refresh', Refresh.handle)

router.get('/sla', Authenticate, (request, response) => {
    return response.json(request.user);
})

export { router }