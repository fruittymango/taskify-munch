import { FastifyReply, FastifyRequest } from "fastify";
import User from "../../database/models/User";

const authMiddleware = async (request: FastifyRequest, reply:FastifyReply ) => {
    await request.jwtVerify()
    request.user = request.user as User;
    return;
};

export default authMiddleware;