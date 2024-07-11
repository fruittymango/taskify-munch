import authMiddleware from "../middleware/authentication.middleware";
import { FastifyInstance } from "fastify/types/instance";
import { StatusesController } from "../controllers/statuses.controller";

async function statusesRoutes(fastify: FastifyInstance){
  fastify.get("/", {preHandler:authMiddleware}, StatusesController.GetStatuses);
}

export default statusesRoutes;