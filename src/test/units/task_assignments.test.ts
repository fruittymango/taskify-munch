import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import { TaskController } from '../../api/controllers/tasks.controller'
import { TaskAssignmentsController } from '../../api/controllers/task_assignments.controller'

import '../../helpers/loadEnv';
import humanId from 'human-id';
import { v4 as uuidv4 } from 'uuid';
import { addBulkStatuses } from '../../api/services/statuses.service';
import { addBulkPriorities } from '../../api/services/priority.service';
import { addBulkLabels } from '../../api/services/label.service';
import { addBulkUsers } from '../../api/services/user.service';
import constants from '../../database/constants';
import { addBulkProjects } from '../../api/services/project.service';
import { createTask } from '../../api/services/task.service';
import { before } from 'node:test';

const generateNewUser = () => { return { name: humanId(), surname: humanId(), password: humanId(), email: humanId() + "@gmail.com", guid: uuidv4(), } };
const testingUser = { ...generateNewUser(), id: 1 };
const testingUsers = [testingUser, generateNewUser(), generateNewUser()]

const generateNewProject = () => { return { title: humanId(), description: humanId(), guid: uuidv4() } }
const testingProject = { ...generateNewProject(), userId: 1, id: 1 };
const testingProjects = [testingProject, { userId: 2, ...generateNewProject() }, { userId: 3, ...generateNewProject() }]

const testTask = {
    title: humanId(),
    dueDate: new Date("2021-01-23"),
    description: "task description",
    labelId: 1,
    projectId: testingProject.id,
    statusId: 1,
    priorityId: 1,
    createdBy: 1,
    guid: uuidv4(),
}

beforeAll(async () => {
    await sequelizeConnection.sync({ force: true })
    await addBulkUsers(testingUsers);
    await addBulkProjects(testingProjects)
    await addBulkPriorities(constants.priorities);
    await addBulkLabels(constants.labels);
    await addBulkStatuses(constants.statuses);
    await createTask(testTask);
});


describe('Manage tasks assignments', () => {
    test('should get tasks assignments - assignments do not exist', async () => {
        // Get project tasks 
        const mockGetProjectTasksRequest: Partial<any> = { body: {}, user: { ...testingUser }, query: { projectGuid: testingProject.guid } };
        const mockGetProjectTasksReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        await TaskController.GetTasks(mockGetProjectTasksRequest as any, mockGetProjectTasksReply as any);
        expect(mockGetProjectTasksReply.send).toHaveBeenCalled();
        const task = mockGetProjectTasksReply.send.mock.calls[0][0][0];
        expect(task.task_assignments.length).toBe(0);
        expect(mockGetProjectTasksReply.status).toHaveBeenCalledWith(200);
    })

    test('should not add one task assignments - task does not exist', async () => {
        const mockRequest: Partial<any> = { body: { userId: 1 }, user: { userId: 1 }, params: { guid: uuidv4() }, };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        try {
            await TaskAssignmentsController.AddTaskAssignment(mockRequest as any, mockReply as any);
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Task not found");
                expect(error.name).toBe("NotFoundError");
            }
        }
    })
    test('should not add one task assignment - user does not exist', async () => {
        const mockRequest: Partial<any> = { body: { userId: 110 }, user: { userId: 1 }, params: { guid: testTask.guid }, };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        try {
            await TaskAssignmentsController.AddTaskAssignment(mockRequest as any, mockReply as any);
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("User not found");
                expect(error.name).toBe("NotFoundError");
            }
        }
    })
    test('should add one task assignments - task does exist', async () => {
        // Get project tasks 
        const mockAssignTaskRequest: Partial<any> = { body: { userId: 1 }, user: { ...testingUser }, params: { guid: testTask.guid } };
        const mockAssignTasksReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        await TaskAssignmentsController.AddTaskAssignment(mockAssignTaskRequest as any, mockAssignTasksReply as any);
        expect(mockAssignTasksReply.send).toHaveBeenCalled();
        expect(mockAssignTasksReply.status).toHaveBeenCalledWith(200);
    })

    test('should get tasks assignments - assignments do exist', async () => {
        // Get project tasks 
        const mockGetProjectTasksRequest: Partial<any> = { body: {}, user: { ...testingUser }, query: { projectGuid: testingProject.guid } };
        const mockGetProjectTasksReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        await TaskController.GetTasks(mockGetProjectTasksRequest as any, mockGetProjectTasksReply as any);
        expect(mockGetProjectTasksReply.send).toHaveBeenCalled();
        const task = mockGetProjectTasksReply.send.mock.calls[0][0][0];
        expect(task.task_assignments.length).toBeGreaterThan(0);
        expect(mockGetProjectTasksReply.status).toHaveBeenCalledWith(200);
    })

    test('should not remove one task assignments - task does not exist', async () => {
        const mockRequest: Partial<any> = { body: { userId: 2 }, user: { userId: 1 }, params: { guid: uuidv4() }, };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        try {
            await TaskAssignmentsController.DeleteTaskAssignment(mockRequest as any, mockReply as any);
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Task not found");
                expect(error.name).toBe("NotFoundError");
            }
        }
    })
    test('should remove one task assignments - task does exist', async () => {
        const mockAssignTaskRequest: Partial<any> = { body: { userId: 1 }, user: { ...testingUser }, params: { guid: testTask.guid } };
        const mockAssignTasksReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        await TaskAssignmentsController.DeleteTaskAssignment(mockAssignTaskRequest as any, mockAssignTasksReply as any);
        expect(mockAssignTasksReply.send).toHaveBeenCalled();
        expect(mockAssignTasksReply.status).toHaveBeenCalledWith(200);
    })
    test('should not remove one task assignments - user does not exist', async () => {
        const mockRequest: Partial<any> = { body: {}, user: { userId: 101 }, params: { guid: testTask.guid }, };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };

        try {
            await TaskAssignmentsController.DeleteTaskAssignment(mockRequest as any, mockReply as any);
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("User not found");
                expect(error.name).toBe("NotFoundError");
            }
        }
    })
    test('should remove one task assignments- user does exist', async () => {
        const mockRequest: Partial<any> = { body: { userId: 1 }, user: { userId: 1 }, params: { guid: testTask.guid }, };
        const mockReply: Partial<any> = {
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn(),
            send: jest.fn()
        };
        await TaskAssignmentsController.DeleteTaskAssignment(mockRequest as any, mockReply as any);
        expect(mockReply.send).toHaveBeenCalled();
        expect(mockReply.status).toHaveBeenCalledWith(200);

    })
})