import Task, { TaskInput } from "../../database/models/Task";
import Project from "../../database/models/Project";
import TaskAssignment from "../../database/models/TaskAssignments";
import { NotFoundError, DatabaseRelatedError } from "../../helpers/errors";
import { OrderItem } from "sequelize";

export const createTask = async (payload: TaskInput): Promise<Task> => {
    try {
        const task = await Task.create(payload);
        return task;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to save task");
    }
};

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

export const getTasksByProjectGuidSortedFilter = async (
    projectGuid: string,
    filterBy?:
        | { statusId?: number; "$task_assignments.userId$"?: number }
        | undefined,
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
                "$project.guid$": projectGuid,
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

export const getTasksAssignedByProjectGuidSortedFilter = async (
    projectGuid: string,
    userId: number,
    filterBy?:
        | { statusId?: number; "$task_assignments.userId$"?: number }
        | undefined,
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
                "$project.guid$": projectGuid,
                "$task_assignments.userId$": userId,
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
            "Failed to get assigned tasks for project."
        );
    }
};

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
