import authMiddleware from "../middleware/authentication.middleware";
import { LoginUserSchema, RegisterUserSchema } from "../schemas/user.schema";
import { UserController } from "../controllers/users.controller";
import { LoginUserRequest } from "../types/user.types";
import { FastifyInstance } from "fastify/types/instance";

async function userRoutes(fastify: FastifyInstance) {
    fastify.post(
        "/register",
        { schema: RegisterUserSchema },
        UserController.RegisterUser
    );
    fastify.post(
        "/login",
        { schema: LoginUserSchema },
        (request: LoginUserRequest, reply) =>
            UserController.LoginUser(request, reply, fastify as FastifyInstance)
    );
    fastify.get("/", { preHandler: authMiddleware }, UserController.GetUsers);
}

export default userRoutes;
