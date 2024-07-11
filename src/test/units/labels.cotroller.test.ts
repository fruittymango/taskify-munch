import {beforeAll, describe, expect, jest, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import {LabelsController} from '../../api/controllers/labels.controller'
import taskConstants from '../../database/constants';

import '../../helpers/loadEnv';
import humanId from 'human-id';
import { before } from 'node:test';
import { addBulkLabels } from '../../api/services/label.service';

beforeAll(async ()=>{
  await sequelizeConnection.sync({force:true})
});


describe('Manage labels', () =>{
  const testLabel = {title: humanId()};
  test('should get labels - labels not do exist', async ()=>{
    let mockRequest: Partial<any> = {body:{...testLabel}};
    let mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await LabelsController.GetLabels(mockRequest as any, mockReply as any);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  })
  test('should add label - labels do not exist', async ()=>{
    let mockRequest: Partial<any> = {body:{...testLabel}};
    let mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await LabelsController.AddLabel(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalledTimes(1);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(dataCalledWith.title).toBe(testLabel.title);
  })
  test('should not add label - label do exist (duplicate title)', async ()=>{
    let mockRequest: Partial<any> = {body:{...testLabel}};
    let mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    try {
      await LabelsController.AddLabel(mockRequest as any, mockReply as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Validation error");
        expect(error.name).toBe("SequelizeUniqueConstraintError");
      }
    }
  })
  before(async()=>{
    await addBulkLabels(taskConstants.labels);
  })
  test('should add label - labels do exist', async ()=>{
    const newLabel = {title:humanId()};
    let mockRequest: Partial<any> = {body:{test,...newLabel}};
    let mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await LabelsController.AddLabel(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalledTimes(1);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(dataCalledWith.title).toBe(newLabel.title);
  })
  test('should get labels - labels do exist', async ()=>{
    let mockRequest: Partial<any> = {};
    let mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await LabelsController.GetLabels(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0][0];
    expect(mockReply.send).toHaveBeenCalledTimes(1);
    expect(dataCalledWith.title).toBe(testLabel.title);
  })
  test('should add bulk labels - labels do not exist', async ()=>{
    
    const result = await addBulkLabels([{title:humanId()}, {title:humanId()}]);
    expect(result.length).toBeGreaterThan(0);
  })
})