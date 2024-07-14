import { FastifyRequest } from "fastify/types/request";

export type GetTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
}>;

export type FilterTaskBy = {
    statusId?: number;
    "$project.guid$": string;
    "$task_assignments.userId$"?: number;
    createdBy?: number;
};

export type GetTasksRequest = FastifyRequest<{
    Querystring: {
        projectGuid: string;
        sort: string;
        status: string;
        ascending: boolean;
    };
}>;

export type UpdateTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
    Body: {
        title?: string;
        description?: string;
        dueDate?: string;
        statusId?: number;
        labelId?: number;
        projectId?: number;
        priorityId?: number;
    };
}>;

export type AddTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
    Body: {
        title: string;
        description: string;
        dueDate: string;
        statusId: number;
        labelId?: number;
        projectId?: number;
        priorityId?: number;
    };
}>;

export type DeleteTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
}>;
