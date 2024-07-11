import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import { StatusesController } from '../../api/controllers/statuses.controller'
import taskConstants from '../../database/constants';

import '../../helpers/loadEnv';
import humanId from 'human-id';
import { before } from 'node:test';
import { addBulkStatuses } from '../../api/services/statuses.service';

beforeAll(async () => {
  await sequelizeConnection.sync({ force: true })
});


describe('Manage Statuses', () => {
  const testTitle = { title: humanId() };
  test('should get statuses - statuses not do exist', async () => {
    const mockRequest: Partial<any> = { body: { ...testTitle } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await StatusesController.GetStatuses(mockRequest as any, mockReply as any);
    expect(mockReply.send).toHaveBeenCalledWith([]);
    expect(mockReply.status).toHaveBeenCalledWith(200);
  })

  before(async () => {
    await addBulkStatuses(taskConstants.statuses);
  })
  test('should get statuses - statuses do exist', async () => {
    const mockRequest: Partial<any> = { body: { ...testTitle } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await StatusesController.GetStatuses(mockRequest as any, mockReply as any);
    expect(mockReply.status).toHaveBeenCalledWith(200);
  })

  test('should add bulk statuses - status do not exist', async () => {

    const result = await addBulkStatuses([{ title: humanId() }, { title: humanId() }]);
    expect(result.length).toBeGreaterThan(0);
  })
})