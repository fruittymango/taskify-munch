import { FastifyRequest } from "fastify/types/request";


export type RegisterUserRequest = FastifyRequest<{
    Body: {
        name: string;
        email: string;
        surname: string;
        password: string;
    }
}>;

export type LoginUserRequest = FastifyRequest<{
    Body: {
        email: string;
        password: string;
    }
}>;