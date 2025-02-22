import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyRateLimiter from "@fastify/rate-limit";
import { v4 as uuidv4 } from "uuid";
import "./helpers/loadEnv";
import fastifyOptions from "./config/fastifyOptions";
import fastifyJwt from "@fastify/jwt";
import {
    AuthError,
    BadRequestError,
    DatabaseRelatedError,
    NotFoundError,
    RateLimitError,
    ValidationError,
} from "./helpers/errors";
import userRoutes from "./api/routes/users.route";
import labelsRoutes from "./api/routes/labels.route";
import statusesRoutes from "./api/routes/statuses.route";
import projectsRoutes from "./api/routes/projects.route";
import tasksRoutes from "./api/routes/task.route";
import prioritiesRoutes from "./api/routes/priorities.route";
import taskAssignRoutes from "./api/routes/task_assignments.route";
const JWTSECRET = process.env.JWT_SECRET || uuidv4();

const fastify = Fastify(fastifyOptions);
fastify.register(fastifyJwt, { secret: JWTSECRET });
fastify.register(userRoutes, { prefix: "/users" });
fastify.register(labelsRoutes, { prefix: "/labels" });
fastify.register(projectsRoutes, { prefix: "/projects" });
fastify.register(prioritiesRoutes, { prefix: "/priorities" });
fastify.register(statusesRoutes, { prefix: "/statuses" });
fastify.register(tasksRoutes, { prefix: "/tasks" });
fastify.register(taskAssignRoutes, { prefix: "/assign/task" });

export const setUpRateLimiter = async () => {
    await fastify.register(fastifyRateLimiter, {
        max: 15,
        timeWindow: "1 minute",
        global: true,
        onExceeding: function (request: FastifyRequest) {
            request.log.warn(
                `[Rate Limit Exceeding] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
            );
        },
        onExceeded: function (request: FastifyRequest) {
            request.log.warn(
                `[Rate Limit Exceeded] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
            );
            throw new RateLimitError(
                "You hit the rate limit for this. Please try again after a miniute!"
            );
        },
    });

    fastify.setNotFoundHandler(
        {
            preHandler: fastify.rateLimit({
                max: 5,
                timeWindow: "1 minute",
                onExceeding: function (request: FastifyRequest) {
                    request.log.warn(
                        `[404 Rate Limit Exceeding] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
                    );
                },
                onExceeded: function (request: FastifyRequest) {
                    request.log.warn(
                        `[404 Rate Limit Exceeded] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
                    );
                    throw new RateLimitError(
                        "You have hit the 404 rate limit. Please consult with the support team!"
                    );
                },
            }),
        },
        function (request: FastifyRequest, reply: FastifyReply) {
            reply.code(404).send();
        }
    );
};

fastify.setErrorHandler(function (
    error,
    request: FastifyRequest,
    reply: FastifyReply
) {
    const logMessage = `\n${error.stack}`;
    if (
        error instanceof ValidationError ||
        error instanceof BadRequestError ||
        error instanceof DatabaseRelatedError ||
        error instanceof AuthError ||
        error instanceof NotFoundError ||
        error instanceof RateLimitError
    ) {
        reply.log.warn(logMessage);
        return reply.status(error.statusCode!).send({ error: error.message });
    } else if (error.statusCode == 401) {
        reply.log.warn(error.message);
        return reply.status(401).send({
            error: "User unauthorized! Login required.",
        });
    } else if (error.code === "FST_ERR_VALIDATION") {
        reply.log.warn(error.message);
        return reply.status(422).send({
            error: "Api schema validation failed. Please find taskify-much documentation!",
        });
    } else {
        reply.log.error(logMessage);
        return reply
            .status(error.statusCode!)
            .send({ error: "Cannot process request right now." });
    }
});

fastify.addHook(
    "onRequest",
    (request: FastifyRequest, reply: FastifyReply, done) => {
        request.startTime = Date.now();
        request.log.info(
            `[Incoming] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
        );
        done();
    }
);

fastify.addHook(
    "onResponse",
    (request: FastifyRequest, reply: FastifyReply, done) => {
        request.log.info(
            `[Outgoing] ${request.id} method=${request.raw.method}, url=${
                request.raw.url
            }, ip=${request.ip} status=${reply.statusCode}, duration=${
                Date.now() - request.startTime
            }ms`
        );
        done();
    }
);

export default fastify;
