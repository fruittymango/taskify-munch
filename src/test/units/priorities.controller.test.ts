import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import { PrioritiesController } from '../../api/controllers/priorities.controller'
import taskConstants from '../../database/constants';

import '../../helpers/loadEnv';
import humanId from 'human-id';
import { before } from 'node:test';
import { addBulkPriorities } from '../../api/services/priority.service';

beforeAll(async () => {
  await sequelizeConnection.sync({ force: true })
});

describe('Manage Priorities', () => {
  test('should not get priorities - priorities do not exist', async () => {
    const mockRequest: Partial<any> = { body: {} };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await PrioritiesController.GetPriorities(mockRequest as any, mockReply as any);
    expect(mockReply.send).toHaveBeenCalledWith([]);
    expect(mockReply.status).toHaveBeenCalledWith(200);
  })

  before(async () => {
    await addBulkPriorities(taskConstants.priorities);
  })

  test('should get priorities - priorities do exist', async () => {
    const mockRequest: Partial<any> = { body: {} };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await PrioritiesController.GetPriorities(mockRequest as any, mockReply as any);
    expect(mockReply.status).toHaveBeenCalledWith(200);
  })

  test('should add bulk priorities - priorities do not exist', async () => {
    const result = await addBulkPriorities([{ title: humanId() }, { title: humanId() }]);
    expect(result.length).toBeGreaterThan(0);
  })


})
