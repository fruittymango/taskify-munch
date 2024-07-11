import { FastifyRequest } from "fastify/types/request";

export type GetPriorityRequest = FastifyRequest<{
    Querystring: { guid: string };
}>;

export type UpdatePriorityRequest = FastifyRequest<{
    Querystring: { guid: string };
    Body: {
        title?:string;
    }
}>;

export type AddPriorityRequest = FastifyRequest<{
    Querystring: { guid: string };
    Body:{
        title:string;
    }
}>;
