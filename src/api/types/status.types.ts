import { FastifyRequest } from "fastify/types/request";

export type PatchTaskStatusRequest = FastifyRequest<{
    Params: { guid: string };
    Body: {
        statudId?:string;
    }
}>;
