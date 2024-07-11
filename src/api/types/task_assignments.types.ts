import { FastifyRequest } from "fastify/types/request";

export type TaskAssigmentRequest = FastifyRequest<{
    Params: {
        guid: string;
    },
    Body: {
        userId: number;
    }
}>;