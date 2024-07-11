import { FastifyRequest } from "fastify/types/request";

export type GetTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
}>;

export type GetTasksRequest = FastifyRequest<{
    Querystring: { projectGuid: string, sorting: string, filter: string };
}>;

export type UpdateTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
    Body: {
        title?: string;
        description?: string;
        dueDate?: Date;
        labelId?: number;
        projectId?: number;
        priorityId?: number;
    }
}>;

export type AddTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
    Body: {
        title: string;
        description: string;
        dueDate: Date;
        labelId: number;
        projectId: number;
        priorityId?: number;
    }
}>;

export type DeleteTaskRequest = FastifyRequest<{
    Querystring: { guid: string };
}>;