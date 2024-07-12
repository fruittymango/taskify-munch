import { FastifyRequest, FastifyReply } from "fastify";
import {
    createTaskAssignments,
    deleteTaskAssignmentsByUserIdTaskId,
} from "../services/taskAssignment.service";
import { GuidPathParam } from "../types/project.types";
import { getTaskByGuid } from "../services/task.service";
import { TaskAssigmentRequest } from "../types/task_assignments.types";
import { getUserById } from "../services/user.service";

export class TaskAssignmentsController {
    static async AddTaskAssignment(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { userId } = (request as TaskAssigmentRequest).body;
        const { guid } = (request as GuidPathParam).params;

        const task = await getTaskByGuid(guid);

        await getUserById(userId);

        await createTaskAssignments({
            userId,
            taskId: task.id,
        });
        return reply.status(200).send({ message: "Added user to task" });
    }
    static async DeleteTaskAssignment(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { userId } = (request as TaskAssigmentRequest).body;
        const { guid } = (request as GuidPathParam).params;

        const task = await getTaskByGuid(guid);

        await getUserById(userId);

        await deleteTaskAssignmentsByUserIdTaskId(userId, task.id);
        return reply.status(200).send({ message: "Removed user from task" });
    }
}
