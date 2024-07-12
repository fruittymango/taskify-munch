import { FastifyRequest, FastifyReply } from "fastify";
import { StatusInput } from "../../database/models/Status";
import Task, { TaskInput } from "../../database/models/Task";
import User from "../../database/models/User";
import { v4 as uuidv4 } from "uuid";
import {
    getTaskByGuid,
    createTask,
    updateTaskByGuid,
    deleteTaskByGuid,
    getTasksByProjectGuidSortedFilter,
    getTasksAssignedByProjectGuidSortedFilter,
} from "../services/task.service";
import { GetTasksRequest } from "../types/task.types";
import { GuidPathParam } from "../types/project.types";
import unsanitize from "../../utils/unsanitize";
import { findStatusByTitle } from "../services/statuses.service";
import sanitize from "sanitize-html";
import { OrderItem } from "sequelize";

type filterByType = {
    statusId?: number;
};

export class TaskController {
    static async GetTasks(request: FastifyRequest, reply: FastifyReply) {
        const {
            query: { projectGuid, sort, ascending, status },
        }: GetTasksRequest = request as GetTasksRequest;

        let filterBy: filterByType = {} as filterByType;
        // Prepare filtering
        if (status) {
            const statusResult = await findStatusByTitle(
                sanitize(status.toLowerCase().trim())
            );
            filterBy.statusId = statusResult.id;
        }

        // Prepare sorting
        const allowedFilteringOptions: { [key: string]: string } = {
            duedate: "dueDate",
            priority: "priorityId",
        };
        let orderBy: OrderItem | undefined = undefined;
        if (sort) {
            let normalisedSort: string = sanitize(sort.toLowerCase().trim());
            orderBy = [
                allowedFilteringOptions[normalisedSort!],
                ascending ? "ASC" : "DESC",
            ] as OrderItem;
        }
        let projectTasks: Task[] = await getTasksByProjectGuidSortedFilter(
            projectGuid,
            filterBy,
            orderBy
        );

        const unsanitizedTasks = projectTasks?.map((value: Task) => {
            return {
                ...value.dataValues,
                title: unsanitize(value.dataValues.title),
                description: unsanitize(value.dataValues.description || ""),
            };
        });
        return reply.status(200).send(unsanitizedTasks);
    }

    static async GetTasksAssigned(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const {
            query: { projectGuid, sort, ascending, status },
        }: GetTasksRequest = request as GetTasksRequest;

        let filterBy: filterByType = {} as filterByType;

        // Prepare filtering
        if (status) {
            const statusResult = await findStatusByTitle(
                sanitize(status.toLowerCase().trim())
            );
            filterBy.statusId = statusResult.id;
        }

        // Prepare sorting
        const allowedFilteringOptions: { [key: string]: string } = {
            duedate: "dueDate",
            priority: "priorityId",
        };
        let orderBy: OrderItem | undefined = undefined;
        if (sort) {
            let normalisedSort: string = sanitize(sort.toLowerCase().trim());
            orderBy = [
                allowedFilteringOptions[normalisedSort!],
                ascending ? "ASC" : "DESC",
            ] as OrderItem;
        }
        let projectTasks: Task[] =
            await getTasksAssignedByProjectGuidSortedFilter(
                projectGuid,
                (request.user as User).id,
                filterBy,
                orderBy
            );

        const unsanitizedTasks = projectTasks?.map((value: Task) => {
            return {
                ...value.dataValues,
                title: unsanitize(value.dataValues.title),
                description: unsanitize(value.dataValues.description || ""),
            };
        });
        return reply.status(200).send(unsanitizedTasks);
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
            dueDate: taskInput?.dueDate,
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
        console.log({ guid });
        const payload: TaskInput = request.body as TaskInput;
        const updatedTask = await updateTaskByGuid(guid, {
            ...payload,
            dueDate: payload?.dueDate!,
        });
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
        return reply
            .status(200)
            .send({ message: "Task does not exist anymore." });
    }
}
