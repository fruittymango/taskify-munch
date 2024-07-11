import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import { TaskController } from '../../api/controllers/tasks.controller'
import { ProjectsController } from '../../api/controllers/projects.controller'

import '../../helpers/loadEnv';
import humanId from 'human-id';
import { v4 as uuidv4 } from 'uuid';
import { addBulkStatuses } from '../../api/services/statuses.service';
import { addBulkPriorities } from '../../api/services/priority.service';
import { addBulkLabels } from '../../api/services/label.service';
import { addBulkUsers } from '../../api/services/user.service';
import constants from '../../database/constants';
import { addBulkProjects } from '../../api/services/project.service';

const generateNewUser = () => { return { name: humanId(), surname: humanId(), password: humanId(), email: humanId() + "@gmail.com", guid: uuidv4(), } };
const testingUser = { ...generateNewUser(), id: 1 };
const testingUsers = [testingUser, generateNewUser(), generateNewUser()]

const generateNewProject = () => { return { title: humanId(), description: humanId(), guid: uuidv4() } }
const testingProject = { ...generateNewProject(), userId: 1, id: 1 };
const testingProjects = [testingProject, { userId: 2, ...generateNewProject() }, { userId: 3, ...generateNewProject() }]

beforeAll(async () => {
  await sequelizeConnection.sync({ force: true })
  await addBulkUsers(testingUsers);
  await addBulkProjects(testingProjects)
  await addBulkPriorities(constants.priorities);
  await addBulkLabels(constants.labels);
  await addBulkStatuses(constants.statuses);
});

describe('Manage tasks', () => {
  test('should not get tasks - tasks do not exist (project empty)', async () => {
    // Get project tasks using the first project in the array
    const mockRequest: Partial<any> = { body: {}, user: { ...testingUser }, query: { projectGuid: testingProject.guid } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.GetTasks(mockRequest as any, mockReply as any);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  })

  test('should add tasks - tasks do not exist', async () => {
    // Add Task
    const addTaskPayload = {
      dueDate: "2021-01-23",
      title: humanId(),
      labelId: 1,
      projectId: testingProject.id,
      statusId: 1,
      priorityId: 1,
      description: "taskInput description",
    }
    const mockRequest: Partial<any> = { body: { ...addTaskPayload }, user: { ...testingUser }, query: { projectGuid: testingProject.guid } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.AddTask(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalled();
    expect(dataCalledWith.title).toBe(addTaskPayload.title);
    expect(dataCalledWith.description).toBe(addTaskPayload.description);
    expect(dataCalledWith.statusId).toBe(addTaskPayload.statusId);
    expect(dataCalledWith.labelId).toBe(addTaskPayload.labelId);
    expect(dataCalledWith.priorityId).toBe(addTaskPayload.priorityId);

  })

  test('should get tasks - task does exist (not empty project)', async () => {
    // Get project tasks using the first project in the array
    const mockRequest: Partial<any> = { body: {}, user: { ...testingUser }, query: { projectGuid: testingProject.guid } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.GetTasks(mockRequest as any, mockReply as any);
    expect(mockReply.send).toHaveBeenCalled();
  })

  test('should not update tasks - task does not exist', async () => {
    // Edit Task
    const editTaskPayload = {
      dueDate: "2021-01-23",
      title: humanId(),
      labelId: 1,
      projectId: testingProject.id,
      statusId: 1,
      priorityId: 1,
      description: "taskInput description",
    }
    const mockRequest: Partial<any> = { body: { ...editTaskPayload }, user: { ...testingUser }, params: { guid: uuidv4() } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    try {
      await TaskController.UpdateTask(mockRequest as any, mockReply as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Task not found");
        expect(error.name).toBe("NotFoundError");
      }
    }
  })

  test('should update tasks - task does exist', async () => {
    const mockGetTasksRequest: Partial<any> = { body: {}, user: { ...testingUser }, query: { projectGuid: testingProject.guid } };
    const mockGetTasksReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.GetTasks(mockGetTasksRequest as any, mockGetTasksReply as any);
    const task = mockGetTasksReply.send.mock.calls[0][0][0];


    // Edit Task
    const editTaskPayload = {
      dueDate: "2021-01-23",
      title: humanId(),
      labelId: 1,
      projectId: testingProject.id,
      statusId: 1,
      priorityId: 1,
      description: "taskInput description",
    }
    const mockRequest: Partial<any> = { body: { ...editTaskPayload }, user: { ...testingUser }, params: { guid: task.guid }, };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.UpdateTask(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalled();
    expect(dataCalledWith.title).toBe(editTaskPayload.title);
    expect(dataCalledWith.description).toBe(editTaskPayload.description);
  })

  test('should not patch tasks status - task does not exist', async () => {
    // Patch Task
    const pacthPayload = {
      statusId: 2,
    }
    const mockRequest: Partial<any> = { body: { ...pacthPayload }, user: { ...testingUser }, params: { guid: uuidv4() }, };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };

    try {
      await TaskController.PatchTask(mockRequest as any, mockReply as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Task not found");
        expect(error.name).toBe("NotFoundError");
      }
    }
  })

  test('should patch tasks status - task does exist', async () => {
    // Get project tasks using the first project in the array
    const mockGetProjectTasksRequest: Partial<any> = { body: {}, user: { ...testingUser }, query: { projectGuid: testingProject.guid } };
    const mockGetProjectTasksReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.GetTasks(mockGetProjectTasksRequest as any, mockGetProjectTasksReply as any);
    expect(mockGetProjectTasksReply.send).toHaveBeenCalled();
    const task = mockGetProjectTasksReply.send.mock.calls[0][0][0];


    // Patch Task
    const pacthPayload = {
      statusId: 2,
    }
    const mockRequest: Partial<any> = { body: { ...pacthPayload }, user: { ...testingUser }, params: { guid: task.guid }, query: { projectGuid: testingProject.guid } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.PatchTask(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalled();
    expect(dataCalledWith.statusId).toBe(pacthPayload.statusId);
  })

  test('should get task - task does not exist', async () => {
    // Delete Task
    const mockRequest: Partial<any> = { body: {}, user: { ...testingUser }, params: { guid: uuidv4() }, };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };

    try {
      await TaskController.GetTask(mockRequest as any, mockReply as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Task not found");
        expect(error.name).toBe("NotFoundError");
      }
    }
  })

  test('should get task - task does exist', async () => {
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

    // Get task details
    const pacthPayload = {
      statusId: 2,
    }
    const mockRequest: Partial<any> = { body: { ...pacthPayload }, user: { ...testingUser }, params: { guid: task.guid }, query: { projectGuid: testingProject.guid } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.GetTask(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalled();
    expect(dataCalledWith.statusId).toBe(pacthPayload.statusId);
  })

  test('should not delete tasks - task does not exist', async () => {
    // Delete Task
    const mockRequest: Partial<any> = { body: {}, user: { ...testingUser }, params: { guid: uuidv4() }, };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };

    try {
      await TaskController.DeleteTask(mockRequest as any, mockReply as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Task not found");
        expect(error.name).toBe("NotFoundError");
      }
    }
  })

  test('should delete tasks status - task does exist', async () => {
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

    // Patch Task
    const pacthPayload = {
      statusId: 2,
    }
    const mockRequest: Partial<any> = { body: { ...pacthPayload }, user: { ...testingUser }, params: { guid: task.guid }, query: { projectGuid: testingUser.guid } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await TaskController.PatchTask(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(dataCalledWith.statusId).toBe(pacthPayload.statusId);
    const deletedTask = mockReply.send.mock.calls[0][0];
    expect(deletedTask.description).toBe(task.description);
    expect(deletedTask.title).toBe(task.title);
  })

})