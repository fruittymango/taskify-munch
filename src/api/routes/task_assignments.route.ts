import authMiddleware from "../middleware/authentication.middleware";
import { FastifyInstance } from "fastify/types/instance";
import { TaskAssignmentsController } from "../controllers/task_assignments.controller";
import { TaskAssignmentSchema } from "../schemas/task_assignments.schema";

async function taskAssignRoutes(fastify: FastifyInstance) {
    fastify.post(
        "/:guid",
        { schema: TaskAssignmentSchema, preHandler: authMiddleware },
        TaskAssignmentsController.AddTaskAssignment
    );
    fastify.delete(
        "/:guid",
        { schema: TaskAssignmentSchema, preHandler: authMiddleware },
        TaskAssignmentsController.DeleteTaskAssignment
    );
}

export default taskAssignRoutes;
