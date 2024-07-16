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
    getAvailableTasks,
} from "../services/task.service";
import { FilterTaskBy, GetTasksRequest } from "../types/task.types";
import { GuidPathParam } from "../types/project.types";
import unsanitize from "../../utils/unsanitize";
import { findStatusByTitle } from "../services/statuses.service";
import sanitize from "sanitize-html";
import { OrderItem } from "sequelize";

/**
 * Function will return tasks available for a project. When the returnOnlyUserTasks flag is set
 * to the function will only returns tasks that are assigned to the authenticated user.
 * @param request
 * @param reply
 * @param returnOnlyUserTasks Flag used to
 * @returns Filtered and/or sorted tasks depending on if the sort, ascending or status to the query parameters were used.
 */
async function getTasksHelper(request: FastifyRequest, reply: FastifyReply) {
    const {
        query: { projectGuid, sort, ascending, status, assigned, createdBy },
    }: GetTasksRequest = request as GetTasksRequest;

    // Prepare filtering
    const filterBy: FilterTaskBy = {} as FilterTaskBy;

    if (projectGuid) {
        filterBy["$project.guid$"] = projectGuid;
    }

    if (assigned) {
        filterBy["$task_assignments.userId$"] = (request.user as User).id;
    }

    if (createdBy) {
        filterBy.createdBy = (request.user as User).id;
    }

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
        const normalisedSort: string = sanitize(sort.toLowerCase().trim());
        orderBy = [
            allowedFilteringOptions[normalisedSort!],
            ascending ? "ASC" : "DESC",
        ] as OrderItem;
    }
    const projectTasks: Task[] = await getAvailableTasks(filterBy, orderBy);

    const unsanitizedTasks = projectTasks?.map((value: Task) => {
        return {
            ...value.dataValues,
            title: unsanitize(value.dataValues.title),
            description: unsanitize(value.dataValues.description || ""),
        };
    });
    return reply.status(200).send(unsanitizedTasks);
}

export class TaskController {
    /**
     * Controller used to retrieve tasks that relates to the given project guid.
     * @param request
     * @param reply
     * @returns status 200 and the list of tasks available.
     */
    static async GetTasks(request: FastifyRequest, reply: FastifyReply) {
        return getTasksHelper(request, reply);
    }

    /**
     * Controller used to retrieve the task that relates to the given task guid.
     * @param request
     * @param reply
     * @returns status 200 and the task retrieved.
     */
    static async GetTask(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        const taskExist = await getTaskByGuid(guid);
        return reply.status(200).send({
            ...taskExist.dataValues,
            title: unsanitize(taskExist.dataValues.title),
            description: unsanitize(taskExist.dataValues.description || ""),
        });
    }

    /**
     * Controller used to add a task that relates to the given task guid.
     * @param request
     * @param reply
     * @returns status 200 and the task added.
     */
    static async AddTask(request: FastifyRequest, reply: FastifyReply) {
        const user: User = request.user as User;
        const taskInput: TaskInput = request.body as TaskInput;
        const addedTasks = await createTask({
            guid: uuidv4(),
            createdBy: user.id,
            dueDate: taskInput?.dueDate,
            title: taskInput.title,
            labelId: taskInput?.labelId,
            projectId: taskInput.projectId,
            statusId: taskInput.statusId,
            priorityId: taskInput?.priorityId,
            description: taskInput?.description,
        });
        return reply.status(200).send({
            ...addedTasks.dataValues,
            title: unsanitize(addedTasks.dataValues.title),
            description: unsanitize(addedTasks.dataValues.description || ""),
        });
    }

    /**
     * Controller used to update a task that relates to the given task guid.
     * @param request
     * @param reply
     * @returns status 200 and the task updated.
     */
    static async UpdateTask(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        const payload: TaskInput = request.body as TaskInput;
        const updatedTask = await updateTaskByGuid(guid, {
            ...payload,
            dueDate: payload?.dueDate,
        });
        return reply.status(200).send(updatedTask);
    }

    /**
     * Controller used to patch the status of the task that relates to the given task guid.
     * @param request
     * @param reply
     * @returns status 200 and the task patched.
     */
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

    /**
     * Controller used to delete a task that relates to the given task guid.
     * @param request
     * @param reply
     * @returns status 200 and the an response message.
     */
    static async DeleteTask(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        await deleteTaskByGuid(guid);
        return reply.status(200).send({ message: "Task deleted." });
    }
}
