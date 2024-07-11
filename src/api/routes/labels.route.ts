import authMiddleware from "../middleware/authentication.middleware";
import { FastifyInstance } from "fastify/types/instance";
import { LabelsController } from "../controllers/labels.controller";
import { AddLabelSchema } from "../schemas/label.schema";

async function labelsRoutes(fastify: FastifyInstance){
  fastify.get("/",{ preHandler:authMiddleware}, LabelsController.GetLabels);

  fastify.post("/", 
    {schema: AddLabelSchema, preHandler:authMiddleware},LabelsController.AddLabel);
}

export default labelsRoutes;