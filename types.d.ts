import "fastify";
import { FastifyJwtNamespace } from "@fastify/jwt";
import { FastifyRequest } from "fastify/types/request";
import User from "./src/database/models/User";

type UserRequest = {
    user?: User;
    startTime: number;
};

declare module "fastify/types/request" {
    interface FastifyRequest extends UserRequest<> {}
}
declare module "fastify" {
    interface FastifyRequest extends UserRequest<> {}

    interface FastifyInstance
        extends FastifyJwtNamespace<{ namespace: "security" }> {}
}
