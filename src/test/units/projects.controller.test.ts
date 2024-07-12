import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import sequelizeConnection from "../../database/setup";
import { ProjectsController } from "../../api/controllers/projects.controller";

import "../../helpers/loadEnv";
import humanId from "human-id";
import { v4 as uuidv4 } from "uuid";
import { addBulkUsers } from "../../api/services/user.service";

const generateNewUser = () => {
    return {
        name: humanId(),
        surname: humanId(),
        password: humanId(),
        email: humanId() + "@gmail.com",
        guid: uuidv4(),
    };
};
const testingUser = { ...generateNewUser(), id: 1 };
const testingUsers = [testingUser, generateNewUser(), generateNewUser()];

const generateNewProject = () => {
    return {
        userId: 1,
        title: humanId(),
        description: humanId(),
        guid: uuidv4(),
    };
};
const testingProject = generateNewProject();

beforeAll(async () => {
    await sequelizeConnection.sync({ force: true });
    await addBulkUsers(testingUsers);
});

describe("Manage projects", () => {
    test("should get projects - projects not do exist", async () => {
        const mockRequest: Partial<any> = {
            body: {},
            user: { ...testingUser },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.GetProjects(
            mockRequest as any,
            mockReply as any
        );
        expect(mockReply.send).toHaveBeenCalledWith([]);
    });
    test("should add project - projects do not exist", async () => {
        const mockRequest: Partial<any> = {
            body: { ...testingProject },
            user: { ...testingUser },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.AddProject(
            mockRequest as any,
            mockReply as any
        );
        const dataCalledWith = mockReply.send.mock.calls[0][0];
        expect(mockReply.send).toHaveBeenCalledTimes(1);
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(dataCalledWith.title).toBe(testingProject.title);
    });
    test("should not add projects - projects do exist (duplicate title)", async () => {
        const mockRequest: Partial<any> = {
            body: { ...testingProject },
            user: { ...testingUser },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        try {
            await ProjectsController.AddProject(
                mockRequest as any,
                mockReply as any
            );
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Failed to create the project.");
                expect(error.name).toBe("DatabaseRelatedError");
            }
        }
    });
    test("should add projects - projects do exist", async () => {
        const newProject = generateNewProject();
        const mockRequest: Partial<any> = {
            body: { ...newProject },
            user: { ...testingUser },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.AddProject(
            mockRequest as any,
            mockReply as any
        );
        const dataCalledWith = mockReply.send.mock.calls[0][0];
        expect(mockReply.send).toHaveBeenCalledTimes(1);
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(dataCalledWith.title).toBe(newProject.title);
    });
    test("should get projects - projects do exist", async () => {
        const mockRequest: Partial<any> = {
            body: {},
            user: { ...testingUser },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.GetProjects(
            mockRequest as any,
            mockReply as any
        );
        const dataCalledWith = mockReply.send.mock.calls[0][0][0];
        expect(mockReply.send).toHaveBeenCalledTimes(1);
        expect(dataCalledWith.title).toBe(testingProject.title);
    });
    test("should get project - projects do exist", async () => {
        const mockGetProjectsRequest: Partial<any> = {
            body: {},
            user: { ...testingUser },
        };
        const mocGetProjectskReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.GetProjects(
            mockGetProjectsRequest as any,
            mocGetProjectskReply as any
        );
        const dataCalledWith = mocGetProjectskReply.send.mock.calls[0][0][0];
        expect(mocGetProjectskReply.send).toHaveBeenCalledTimes(1);
        expect(dataCalledWith.title).toBe(testingProject.title);

        const mockRequest: Partial<any> = {
            body: {},
            user: { ...testingUser },
            params: { guid: dataCalledWith.guid },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.GetProject(
            mockRequest as any,
            mockReply as any
        );
        const dataCalledWith2 = mockReply.send.mock.calls[0][0];
        expect(mockReply.send).toHaveBeenCalledTimes(1);
        expect(dataCalledWith2.title).toBe(testingProject.title);
    });

    test("should not update project - project does not exist", async () => {
        const mockRequest: Partial<any> = {
            body: { ...testingProject },
            user: { ...testingUser },
            params: { guid: uuidv4() },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };

        try {
            await ProjectsController.UpdateProject(
                mockRequest as any,
                mockReply as any
            );
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Failed to update the project.");
                expect(error.name).toBe("DatabaseRelatedError");
            }
        }
    });
    test("should update project - project does exist", async () => {
        const mockGetProjectsRequest: Partial<any> = {
            body: {},
            user: { ...testingUser },
        };
        const mockGetProjectsReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.GetProjects(
            mockGetProjectsRequest as any,
            mockGetProjectsReply as any
        );
        const project = mockGetProjectsReply.send.mock.calls[0][0][0];
        expect(mockGetProjectsReply.send).toHaveBeenCalledTimes(1);

        const toUpdatePayload = { ...testingProject, description: humanId() };
        const mockRequest: Partial<any> = {
            body: { toUpdatePayload },
            user: { ...testingUser },
            params: { guid: project.guid },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        await ProjectsController.UpdateProject(
            mockRequest as any,
            mockReply as any
        );
        const dataCalledWith = mockReply.send.mock.calls[0][0];
        expect(mockReply.send).toHaveBeenCalledTimes(1);
        expect(toUpdatePayload.title).toBe(project.title);
        expect(dataCalledWith.description).toBe(project.description);
    });

    test("should not get project - uuid random", async () => {
        const mockRequest: Partial<any> = {
            body: {},
            user: { ...testingUser },
            params: { guid: uuidv4() },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        try {
            await ProjectsController.GetProject(
                mockRequest as any,
                mockReply as any
            );
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Failed to get project using guid.");
                expect(error.name).toBe("DatabaseRelatedError");
            }
        }
    });
    test("should not delete project - projects guid does not exist", async () => {
        const mockRequest: Partial<any> = {
            body: {},
            user: { ...testingUser },
            params: { guid: uuidv4() },
        };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn(),
        };
        try {
            await ProjectsController.DeleteProject(
                mockRequest as any,
                mockReply as any
            );
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Failed to delete project.");
                expect(error.name).toBe("DatabaseRelatedError");
            }
        }
    });
});
