import authMiddleware from "../middleware/authentication.middleware";
import { FastifyInstance } from "fastify/types/instance";
import { TaskController } from "../controllers/tasks.controller";
import { GetTasksSchema, AddTaskSchema, GetTaskSchema, UpdateTaskSchema, PatchTaskSchema, DeleteTaskSchema } from "../schemas/task.schema";

async function tasksRoutes(fastify: FastifyInstance){
  fastify.get("/",{schema:GetTasksSchema, preHandler:authMiddleware}, TaskController.GetTasks);
  fastify.post("/", {schema: AddTaskSchema, preHandler:authMiddleware}, TaskController.AddTask);
  fastify.get<{ Params: { guid: string } }>("/:guid",{schema: GetTaskSchema, preHandler:authMiddleware}, TaskController.GetTask);
  fastify.put<{ Params: { guid: string } }>("/:guid", {schema: UpdateTaskSchema, preHandler:authMiddleware}, TaskController.UpdateTask);
  fastify.patch<{ Params: { guid: string } }>("/:guid", {schema: PatchTaskSchema, preHandler:authMiddleware},TaskController.PatchTask);
  fastify.delete<{ Params: { guid: string } }>("/:guid", {schema: DeleteTaskSchema, preHandler:authMiddleware}, TaskController.DeleteTask);
}

export default tasksRoutes;