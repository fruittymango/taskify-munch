import { FastifyRequest } from "fastify/types/request";

export type AddProjectRequest = FastifyRequest<{
    Body: {
        title: string;
        description?: string;
    }
}>;

export type GuidPathParam = FastifyRequest<{
    Params: { guid: string };
}>;
