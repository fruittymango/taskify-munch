import { FastifyRequest } from "fastify";
import User from "../../database/models/User";

const authMiddleware = async (request: FastifyRequest) => {
    await request.jwtVerify();
    request.user = request.user as User;
    return;
};

export default authMiddleware;
