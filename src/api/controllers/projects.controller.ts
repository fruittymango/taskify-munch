
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import Project, { ProjectInput } from '../../database/models/Project';
import User from '../../database/models/User';
import { getAllProjectsByUserId, getProjectByGuid, createProject, updateProjectByGuid, deleteProjectByGuid } from '../services/project.service';
import { GuidPathParam } from '../types/project.types';
import unsanitize from '../../utils/unsanitize';

export class ProjectsController {
    static async GetProjects(request: FastifyRequest, reply: FastifyReply) {
        const user: User = request.user as User;
        const findProjects = (await getAllProjectsByUserId(user.id))?.map((value: Project) => {
            return {
                ...value.dataValues,
                title: unsanitize(value.dataValues.title),
                description: unsanitize(value.dataValues.description || ""),
            }
        });
        return reply.send(findProjects);
    }

    static async GetProject(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        const projectExist = await getProjectByGuid(guid);
        return reply.status(200).send({
            ...projectExist.dataValues,
            title: unsanitize(projectExist.dataValues.title),
            description: unsanitize(projectExist.dataValues?.description || ""),
        });
    }

    static async AddProject(request: FastifyRequest, reply: FastifyReply) {
        const user: User = request.user as User;
        const projectInput: ProjectInput = request.body as ProjectInput;
        const addedProject = await createProject({ userId: user.id, guid: uuidv4(), title: projectInput.title, description: projectInput?.description });
        return reply.status(200).send({
            ...addedProject,
            title: unsanitize(addedProject.dataValues.title),
            description: unsanitize(addedProject.dataValues?.description || ""),
        });
    }

    static async UpdateProject(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        const payload: ProjectInput = request.body as ProjectInput;
        const updatedProjects = await updateProjectByGuid(guid, payload);
        return reply.send({
            ...updatedProjects,
            title: unsanitize(updatedProjects.dataValues.title),
            description: unsanitize(updatedProjects.dataValues?.description || ""),
        });
    }

    static async DeleteProject(request: FastifyRequest, reply: FastifyReply) {
        const { guid } = (request as GuidPathParam).params;
        await deleteProjectByGuid(guid)
    }
}