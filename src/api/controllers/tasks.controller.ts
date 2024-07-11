import { FastifyRequest, FastifyReply } from "fastify";
import { StatusInput } from "../../database/models/Status";
import Task, { TaskInput } from "../../database/models/Task";
import User from "../../database/models/User";
import { v4 as uuidv4 } from 'uuid';
import { getTasksByProjectGuid, getTaskByGuid, createTask, updateTaskByGuid, deleteTaskByGuid } from "../services/task.service";
import { GetTasksRequest } from "../types/task.types";
import { GuidPathParam } from "../types/project.types";
import unsanitize from "../../utils/unsanitize";

export class TaskController {
    static async GetTasks(request: FastifyRequest, reply: FastifyReply) {
        const { query: { projectGuid } }: GetTasksRequest = request as GetTasksRequest;
        const projectTasks = (await getTasksByProjectGuid(projectGuid))?.map((value: Task) => {
            return {
                ...value.dataValues,
                title: unsanitize(value.dataValues.title),
                description: unsanitize(value.dataValues.description || ""),
            }
        });
        return reply.status(200).send(projectTasks);
    }

    static async GetTask(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        const taskExist = await getTaskByGuid(guid);
        return reply.status(200).send({
            ...taskExist.dataValues,
            title: unsanitize(taskExist.dataValues.title),
            description: unsanitize(taskExist.dataValues.description || ""),
        });
    }

    static async AddTask(request: FastifyRequest, reply: FastifyReply) {
        const user: User = request.user as User;
        const taskInput: TaskInput = request.body as TaskInput;
        const addedTasks = await createTask({
            guid: uuidv4(),
            createdBy: user.id,
            dueDate: new Date(taskInput?.dueDate!),
            title: taskInput.title,
            labelId: taskInput.labelId,
            projectId: taskInput.projectId,
            statusId: taskInput?.statusId,
            priorityId: taskInput?.priorityId,
            description: taskInput?.description,
        });
        return reply.status(200).send({
            ...addedTasks.dataValues,
            title: unsanitize(addedTasks.dataValues.title),
            description: unsanitize(addedTasks.dataValues.description || ""),
        });
    }

    static async UpdateTask(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        const payload: TaskInput = request.body as TaskInput;
        const updatedTask = await updateTaskByGuid(guid, { ...payload, dueDate: new Date(payload?.dueDate!), });
        return reply.status(200).send(updatedTask);
    }

    static async PatchTask(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        const payload: StatusInput = request.body as StatusInput;
        const updatedTask = await updateTaskByGuid(guid, payload);
        return reply.status(200).send({
            ...updatedTask.dataValues,
            title: unsanitize(updatedTask.dataValues.title),
            description: unsanitize(updatedTask.dataValues.description || ""),
        });
    }

    static async DeleteTask(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        await deleteTaskByGuid(guid);
        return reply.status(200).send({ message: "Task does not exist anymore." });
    }
}