import Fastify from "fastify";
import { v4 as uuidv4 } from 'uuid';
import './helpers/loadEnv';
import fastifyOptions from './config/fastifyOptions';
import fastifyJwt, { FastifyJwtNamespace, } from "@fastify/jwt";
import { AuthError, BadRequestError, InternalServerError, NotFoundError, RateLimtError, ValidationError } from "./helpers/errors";
import userRoutes from "./api/routes/users.route";
import labelsRoutes from "./api/routes/labels.route";
import statusesRoutes from "./api/routes/statuses.route";
import projectsRoutes from "./api/routes/projects.route";
import tasksRoutes from "./api/routes/task.route";
import prioritiesRoutes from "./api/routes/priorities.route";
import taskAssignRoutes from "./api/routes/task_assignments.route";
const JWTSECRET = process.env.JWT_SECRET || uuidv4();

declare module 'fastify' {
  interface FastifyRequest {
    startTime: number;
  }
  
  interface FastifyInstance extends 
    FastifyJwtNamespace<{namespace: 'security'}> {
  }
}

const fastify = Fastify(fastifyOptions);
fastify.register(fastifyJwt, {secret:JWTSECRET, });
fastify.register(userRoutes, { prefix: '/users' });
fastify.register(labelsRoutes, { prefix: '/labels' });
fastify.register(projectsRoutes, { prefix: '/projects' });
fastify.register(prioritiesRoutes, { prefix: '/priorities'});
fastify.register(statusesRoutes, { prefix: '/statuses' });
fastify.register(tasksRoutes, { prefix: '/tasks' });
fastify.register(taskAssignRoutes, { prefix: '/assign/task' });

export const setUpRateLimiter = async () =>{
  await fastify.register(import("@fastify/rate-limit"), {
    max: 100,
    timeWindow: "1 minute",
    global: true,
    onExceeding: function (request, key) {
      request.log.warn(
        `[Rate Limit Exceeding] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
      );
    },
    onExceeded: function (request, key) {
      request.log.warn(
        `[Rate Limit Exceeded] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
      );
    },
  });
}

fastify.setErrorHandler(function (error, request, reply) {
  if (error instanceof BadRequestError) {
    reply.log.warn(error.message);
    return reply.status(error.statusCode!).send({ error: error.message });
  } 
  else if (error.statusCode === 422 || error.validation || error instanceof ValidationError) {
    reply.log.warn(error.message);
    return reply.status(422).send({ error: 'Api schema validation failed. Please find taskify-much documentation!' });
  }
  else if (error.statusCode === 401 || error instanceof AuthError) {
    reply.log.warn(error.message);
    return reply.send({ error: error.message });
  } 
  else if (error.statusCode === 404 || error instanceof NotFoundError) {
    reply.log.warn(error.message);
    return reply.status(error.statusCode!).send({ error: error.message });
  } 
  else if (error.statusCode === 500 || error instanceof InternalServerError) {
    reply.log.error(error.message);
    return reply.status(error.statusCode!).send({ error: 'Cannot process request right now.' });
  }
  else if (error.statusCode === 429 || error instanceof RateLimtError) {
    reply.log.warn(error.message);
    return reply.send({ error: "You hit the rate limit. Slow down please!" });
  } 
  else {
    console.log(error)
    reply.log.error(error);
    return reply.send({ error: 'Internal Server Error' });
  }
});

fastify.setNotFoundHandler(
    {
        preHandler: fastify.rateLimit({
        max: 50,
        timeWindow: '1 minute',
        }),
    },
    function (request, reply) {
        reply.code(404).send();
    }
);  

fastify.addHook("onRequest", (request, reply, done) => {
  request.startTime = Date.now();
   request.log.info(
    `[Incoming] ${request.id} method=${request.raw.method}, url=${request.raw.url}, ip=${request.ip}`
  );
  done();
});

fastify.addHook("onResponse", (request, reply, done) => {
  request.log.info(
    `[Outgoing] ${request.id} method=${request.raw.method}, url=${
      request.raw.url
    }, ip=${request.ip} status=${reply.statusCode}, duration=${
      Date.now() - request.startTime
    }ms`
  );
  done();
});

export default fastify;