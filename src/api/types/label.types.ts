import { FastifyRequest } from "fastify/types/request";

export type UpdateLabelRequest = FastifyRequest<{
    Querystring: { guid: string };
    Body: {
        title?: string;
    }
}>;

export type AddLabelRequest = FastifyRequest<{
    Body: {
        title: string;
    }
}>;