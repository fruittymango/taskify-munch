import { FastifyInstance } from "fastify/types/instance";
import authMiddleware from "../middleware/authentication.middleware";
import { ProjectsController } from "../controllers/projects.controller";
import {
    AddProjectSchema,
    ProjectGuidParamSchema,
    UpdateProjectSchema,
} from "../schemas/project.schema";

async function projectsRoutes(fastify: FastifyInstance) {
    fastify.get(
        "/",
        { preHandler: authMiddleware },
        ProjectsController.GetProjects
    );

    fastify.get<{ Params: { guid: string } }>(
        "/:guid",
        { schema: ProjectGuidParamSchema, preHandler: authMiddleware },
        ProjectsController.GetProject
    );

    fastify.post(
        "/",
        { schema: AddProjectSchema, preHandler: authMiddleware },
        ProjectsController.AddProject
    );

    fastify.put<{ Params: { guid: string } }>(
        "/:guid",
        { schema: UpdateProjectSchema, preHandler: authMiddleware },
        ProjectsController.UpdateProject
    );

    fastify.delete<{ Params: { guid: string } }>(
        "/:guid",
        { schema: ProjectGuidParamSchema, preHandler: authMiddleware },
        ProjectsController.DeleteProject
    );
}

export default projectsRoutes;
