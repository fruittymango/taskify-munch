import authMiddleware from "../middleware/authentication.middleware";
import { FastifyInstance } from "fastify/types/instance";
import { PrioritiesController } from "../controllers/priorities.controller";

async function prioritiesRoutes(fastify: FastifyInstance){
  fastify.get("/", {preHandler:authMiddleware}, PrioritiesController.GetPriorities);
}

export default prioritiesRoutes;