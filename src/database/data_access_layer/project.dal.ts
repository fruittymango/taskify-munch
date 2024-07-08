import { Op } from 'sequelize';
import Project, { ProjectInput } from '../models/Project.model';

export const createProject = async (payload: ProjectInput): Promise<Project> => {
    const project = await Project.create(payload)
    return project
}

export const updateProject = async (id: number, payload: Partial<ProjectInput>): Promise<Project> => {
    const project = await Project.findByPk(id)
    if (!project) {
        // @todo throw custom error
        throw new Error('Project not found')
    }
    const updatedProject = await (project as Project).update(payload)
    return updatedProject
}

export const getProjectById = async (id: number): Promise<Project> => {
    const project = await Project.findByPk(id)
    if (!project) {
        // @todo throw custom error
        throw new Error('Project not found')
    }
    return project
}

export const deleteProjectById = async (id: number): Promise<boolean> => {
    const deletedProjectCount = await Project.destroy({
        where: {id}
    })
    return !!deletedProjectCount
}

export const getProjectByGuid = async (projectGuid:string): Promise<Project> => {
    const result = await Project.findOne({
        where: {
            guid: {[Op.eq]: projectGuid}
        },
    })
    if (!result) {
        throw new Error("Project not found")
    }
    return result;
}

export const getAllProjectsByUserId = async (id:number): Promise<Project[]> => {
    return Project.findAll({
        where: {
            userId: {[Op.eq]: id}
        },
    })
}

export const createBulkProjects = async (payload: ProjectInput[]): Promise<Project[]> => {
    const project = await Project.bulkCreate(payload)
    return project
}