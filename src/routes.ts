import { Router } from "express";
import { CreateUserController } from "./controllers/CreateUserController";

const router = Router();

const CreateUser = new CreateUserController();

router.post("/register", CreateUser.handle);
router.post('/login', CreateUser.session);

export { router }