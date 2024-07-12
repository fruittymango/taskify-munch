import { Op } from "sequelize";
import Project, { ProjectInput } from "../../database/models/Project";
import {
    BadRequestError,
    DatabaseRelatedError,
    NotFoundError,
} from "../../helpers/errors";

export const createProject = async (
    payload: ProjectInput
): Promise<Project> => {
    try {
        const project = await Project.create(payload);
        return project;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to create the project.");
    }
};

export const updateProjectByGuid = async (
    guid: string,
    payload: Partial<ProjectInput>
): Promise<Project> => {
    try {
        const project = await Project.findOne({ where: { guid } });
        if (!project) {
            throw new BadRequestError("Project not found");
        }
        const updatedProject = await (project as Project).update(payload);
        return updatedProject;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to update the project.");
    }
};

export const deleteProjectByGuid = async (guid: string): Promise<void> => {
    try {
        const result = await Project.findOne({
            where: {
                guid: { [Op.eq]: guid },
            },
        });
        if (!result) {
            throw new NotFoundError("Project not found");
        }
        return await result.destroy();
    } catch (error) {
        throw new DatabaseRelatedError("Failed to delete project.");
    }
};

export const getProjectByGuid = async (
    projectGuid: string
): Promise<Project> => {
    try {
        const result = await Project.findOne({
            where: {
                guid: { [Op.eq]: projectGuid },
            },
        });
        if (!result) {
            throw new NotFoundError("Project not found");
        }
        return result;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to get project using guid.");
    }
};

export const getAllProjectsByUserId = async (
    id: number
): Promise<Project[]> => {
    try {
        return await Project.findAll({
            where: {
                userId: { [Op.eq]: id },
            },
        });
    } catch (error) {
        throw new DatabaseRelatedError(
            "Failed to get available projects using id."
        );
    }
};

export const addBulkProjects = async (
    payload: ProjectInput[]
): Promise<ProjectInput[]> => {
    try {
        return await Project.bulkCreate(payload);
    } catch (error) {
        throw new DatabaseRelatedError("Failed to add bulk projects.");
    }
};
