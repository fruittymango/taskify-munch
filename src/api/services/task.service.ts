import Task, { TaskInput } from "../../database/models/Task";
import Project from "../../database/models/Project";
import TaskAssignment from "../../database/models/TaskAssignments";
import { NotFoundError, DatabaseRelatedError } from "../../helpers/errors";
import { OrderItem } from "sequelize";
import { FilterTaskBy } from "../types/task.types";

/**
 * Service used to add a task to the Task table.
 * @param payload type TaskInput
 * @returns the task added.
 */
export const createTask = async (payload: TaskInput): Promise<Task> => {
    try {
        const task = await Task.create(payload);
        return task;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to save task");
    }
};

/**
 * Service used to update a task in the Task table using the primary key.
 * @param id is the primary key of the existing task
 * @param payload should contain the optional fields that match TaskInput
 * @returns the task updated.
 */
export const updateTask = async (
    id: number,
    payload: Partial<TaskInput>
): Promise<Task> => {
    try {
        const task = await Task.findByPk(id, { paranoid: false });
        if (!task) {
            throw new NotFoundError("Task not found");
        }
        return await (task as Task).update(payload);
    } catch (error) {
        throw new DatabaseRelatedError("Failed to update task");
    }
};

/**
 * Service used to update a task in the Task table using a guid.
 * @param guid is the unique identifier of the existing task
 * @param payload should contain the optional fields that match TaskInput
 * @returns the task added. * @returns the task updated.
 */
export const updateTaskByGuid = async (
    guid: string,
    payload: Partial<TaskInput>
): Promise<Task> => {
    try {
        const task = await Task.findOne({ where: { guid }, paranoid: false });
        if (!task) {
            throw new NotFoundError("Task not found");
        }
        return await (task as Task).update(payload);
    } catch (error) {
        throw new DatabaseRelatedError("Failed to update task");
    }
};

/**
 * Service used to delete a task in the Task table using a guid.
 * @param guid is the unique identifier of the existing task
 * @returns boolean true if the task was deleted and a false if not.
 */
export const deleteTaskByGuid = async (guid: string): Promise<boolean> => {
    try {
        const deletedTaskCount = await Task.destroy({
            where: { guid },
        });
        if (!deletedTaskCount) {
            throw new NotFoundError("Task not found");
        }
        return !!deletedTaskCount;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to delete task.");
    }
};

/**
 * Service used to read available tasks from the Task table filtering and/or sorting
 * the read data according to the options given by the sortBy and filterBy parameters
 * @param filterBy used to read the project guid, optional user primary key id, and an
 * optional status id for tasks to be filtered
 * @param orderBy an OrderItem to use for the sorting order
 * @returns an array of the available tasks read.
 */
export const getAvailableTasks = async (
    filterBy?: FilterTaskBy | undefined,
    orderBy?: OrderItem | undefined
): Promise<Task[]> => {
    try {
        let order:
            | {
                  [key: string]: [OrderItem[]];
              }
            | undefined;

        if (orderBy) {
            order = { order: [[orderBy as OrderItem]] };
        }
        const result = await Task.findAll({
            where: {
                ...filterBy,
            },
            ...order,
            paranoid: false,
            attributes: [
                "id",
                "guid",
                "projectId",
                "priorityId",
                "dueDate",
                "createdBy",
                "statusId",
                "title",
                "updatedAt",
                "deletedAt",
                "description",
            ],
            include: [
                { model: Project, as: "project" },
                { model: TaskAssignment, as: "task_assignments" },
            ],
        });
        if (!result) {
            throw new NotFoundError("Tasks not found");
        }
        return result;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to get tasks for project.");
    }
};

/**
 * Service used to read tasks in the Task table using a guid.
 * @param guid is the unique identifier of the project
 * @returns an array of the available tasks read.
 */
export const getTasksByProjectGuid = async (
    projectGuid: string
): Promise<Task[]> => {
    try {
        const result = await Task.findAll({
            where: {
                "$project.guid$": projectGuid,
            },
            paranoid: false,
            attributes: [
                "id",
                "guid",
                "projectId",
                "dueDate",
                "createdBy",
                "statusId",
                "title",
                "description",
            ],
            include: [
                { model: Project, as: "project" },
                { model: TaskAssignment, as: "task_assignments" },
            ],
        });
        if (!result) {
            throw new NotFoundError("Tasks not found");
        }
        return result;
    } catch (error) {
        throw new DatabaseRelatedError(
            "Failed to get tasks for project using  guid."
        );
    }
};

/**
 * Service used to read a task in the Task table using a taskGuid.
 * @param taskGuid is the unique identifier of the task
 * @returns the tasks read.
 */
export const getTaskByGuid = async (taskGuid: string): Promise<Task> => {
    try {
        const result = await Task.findOne({
            where: {
                guid: taskGuid,
            },
            paranoid: false,
            include: [{ model: TaskAssignment, as: "task_assignments" }],
        });
        if (!result) {
            throw new NotFoundError("Task not found");
        }
        return result;
    } catch (error) {
        throw new DatabaseRelatedError(
            "Failed to get task for project using guid."
        );
    }
};
