import "fastify";
import { FastifyJwtNamespace } from "@fastify/jwt";
import User from "./src/database/models/User";

declare module "fastify" {
    interface FastifyRequest {
        user?: User;
        startTime: number;
    }

    interface FastifyInstance
        extends FastifyJwtNamespace<{ namespace: "security" }> {}
}
