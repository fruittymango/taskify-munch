import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import { UserController } from '../../api/controllers/users.controller'
import '../../helpers/loadEnv';
import humanId from 'human-id';

beforeAll(async () => {
  await sequelizeConnection.sync({ force: true })
});

const body = { name: humanId(), surname: humanId(), password: humanId(), email: humanId() + "@gmail.com" };

describe('Manage users - controller level', () => {
  test('should get users - users do not exist', async () => {
    const mockRequest: Partial<any> = {};
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await UserController.GetUsers(mockRequest as any, mockReply as any);
    expect(mockReply.send).toHaveBeenCalledWith([]);

  })
  test('should register user - users does not exist', async () => {
    const mockRequest: Partial<any> = { body: { ...body } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await UserController.RegisterUser(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0];
    expect(mockReply.send).toHaveBeenCalledTimes(1);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(dataCalledWith.name).toBe(body.name);
    expect(dataCalledWith.surname).toBe(body.surname);
    expect(dataCalledWith.email).toBe(body.email);
  })

  test('should register user - users does exist', async () => {
    const mockRequest: Partial<any> = { body: { ...body } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    try {
      await UserController.RegisterUser(mockRequest as any, mockReply as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User profile exist already.");
        expect(error.name).toBe("BadRequestError");
      }
    }

  })

  test('should get users - users do exist', async () => {
    const mockRequest: Partial<any> = {};
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    await UserController.GetUsers(mockRequest as any, mockReply as any);
    const dataCalledWith = mockReply.send.mock.calls[0][0][0];
    expect(mockReply.send).toHaveBeenCalledTimes(1);
    expect(dataCalledWith.name).toBe(body.name);
    expect(dataCalledWith.surname).toBe(body.surname);
    expect(dataCalledWith.email).toBe(body.email);
    expect(dataCalledWith.password).toBeTruthy();


  })

  test('should not log in user - user exist does not exist', async () => {
    const mockRequest: Partial<any> = { body: { email: humanId() + "@gmail.com", password: body.password } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    const mockFastify: Partial<any> = {
      jwt: { sign: { send: jest.fn() } }
    };
    try {
      await UserController.LoginUser(mockRequest as any, mockReply as any, mockFastify as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User email not found");
        expect(error.name).toBe("NotFoundError");
      }
    }

  })

  test('should log in user - incorrect password', async () => {
    const mockRequest: Partial<any> = { body: { email: body.email, password: humanId() } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    const mockFastify: Partial<any> = {
      jwt: { sign: jest.fn() }
    };
    try {
      await UserController.LoginUser(mockRequest as any, mockReply as any, mockFastify as any);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Invalid password.");
        expect(error.name).toBe("AuthError");
      }
    }

  })

  test('should log in user - user exist', async () => {
    const mockRequest: Partial<any> = { body: { email: body.email, password: body.password } };
    const mockReply: Partial<any> = {
      status: jest.fn().mockReturnThis(),
      statusCode: jest.fn(),
      send: jest.fn()
    };
    const mockFastify: Partial<any> = {
      jwt: { sign: jest.fn() }
    };
    await UserController.LoginUser(mockRequest as any, mockReply as any, mockFastify as any);
    expect(mockFastify.jwt.sign).toHaveBeenCalledTimes(1);
  })
})