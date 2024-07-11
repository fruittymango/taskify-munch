import { Op, UniqueConstraintError } from 'sequelize';
import Project, { ProjectInput } from '../../database/models/Project';
import { BadRequestError, NotFoundError } from '../../helpers/errors';

export const createProject = async (payload: ProjectInput): Promise<Project> => {
    try {
        const project = await Project.create(payload)
        return project
        
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw new BadRequestError('Project with the same title exist.')
        } else {
            throw error
        }
    }
}

export const updateProjectByGuid = async (guid: string, payload: Partial<ProjectInput>): Promise<Project> => {
    const project = await Project.findOne({where:{guid}})
    if (!project) {
        throw new BadRequestError('Project not found')
    }
    const updatedProject = await (project as Project).update(payload)
    return updatedProject
}

export const deleteProjectByGuid = async (guid: string): Promise<void> => {
    const result = await Project.findOne({
        where: {
            guid: {[Op.eq]: guid}
        },
    })
    if (!result) {
        throw new NotFoundError("Project not found")
    }
    return await result.destroy();
}

export const getProjectByGuid = async (projectGuid:string): Promise<Project> => {
    const result = await Project.findOne({
        where: {
            guid: {[Op.eq]: projectGuid}
        },
    })
    if (!result) {
        throw new NotFoundError("Project not found")
    }
    return result;
}

export const getAllProjectsByUserId = async (id:number): Promise<Project[]> => {
    return await Project.findAll({
        where: {
            userId: {[Op.eq]: id}
        },
    })
}

export const addBulkProjects = async (payload: ProjectInput[]): Promise<ProjectInput[]> => {
    return await Project.bulkCreate(payload);
}