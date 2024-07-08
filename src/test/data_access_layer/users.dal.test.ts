import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { addBulkUsers, createUser, deleteUserById, getAllUsers, getUserByEmail, getUserByGuid, getUserById, updateUser } from '../../database/data_access_layer/user.dal';
import { v4 as uuidv4 } from 'uuid';

describe('data access layer - users table', () => {
  beforeAll(async ()=>{
    await sequelizeConnection.sync({force:true})
  });
  
  test('should add user and test fields', async () => {
    const result = await createUser({guid:uuidv4(),name:"Apple", surname:"Mango", email:"apple@mango.com", password:"string@1111",});
    expect(result.dataValues.id).toBeGreaterThan(-1);
    expect(result.dataValues.name).toEqual("Apple");
    expect(result.dataValues.surname).toEqual("Mango");
    expect(result.dataValues.email).toEqual("apple@mango.com");
    expect(result.dataValues.updatedAt).toBeTruthy();
    expect(result.dataValues.createdAt).toBeTruthy();
  });

  test('should add bulk users and test first user fields', async () => {
    const result = await addBulkUsers([
      {guid:uuidv4(),name:"Apple", surname:"Mango", email:uuidv4()+"apple@mango.com", password:uuidv4(),},
      {guid:uuidv4(),name:"Apple2", surname:"Ma2ngo", email:uuidv4()+"apple@mang2o.com", password:uuidv4(),},
      {guid:uuidv4(),name:"Apple2ee", surname:"Ma33ngo", email:uuidv4()+"apple@m4an4g2o.com", password:uuidv4(),},
    ]);
    expect(result[0].dataValues.id).toBeGreaterThan(-1);
    expect(result[0].dataValues.name).toEqual("Apple");
    expect(result[0].dataValues.surname).toEqual("Mango");
    expect(result[0].dataValues.updatedAt).toBeTruthy();
    expect(result[0].dataValues.createdAt).toBeTruthy();
    
  });

  test('should find user using id', async () => {
    const allUsers = await getAllUsers();
    expect(allUsers?.length).toBeGreaterThan(0);
    const result = await getUserById(allUsers[0]?.id);
    expect(result.dataValues.id).toBeGreaterThan(-1);
    expect(result.dataValues.name).toEqual("Apple");
    expect(result.dataValues.surname).toEqual("Mango");
    expect(result.dataValues.email).toEqual("apple@mango.com");
    expect(result.dataValues.updatedAt).toBeTruthy();
    expect(result.dataValues.createdAt).toBeTruthy();
  });

  test('should find user using guid', async () => {
    const allUsers = await getAllUsers();
    expect(allUsers?.length).toBeGreaterThan(0);
    const result = await getUserByGuid(allUsers[0]?.guid);
    expect(result.dataValues.id).toBeGreaterThan(-1);
    expect(result.dataValues.name).toEqual("Apple");
    expect(result.dataValues.surname).toEqual("Mango");
    expect(result.dataValues.email).toEqual("apple@mango.com");
    expect(result.dataValues.updatedAt).toBeTruthy();
    expect(result.dataValues.createdAt).toBeTruthy();
  });

  test('should find user using email', async () => {
    const result = await getUserByEmail("apple@mango.com");
    expect(result.dataValues.id).toBeGreaterThan(-1);
    expect(result.dataValues.name).toEqual("Apple");
    expect(result.dataValues.surname).toEqual("Mango");
    expect(result.dataValues.email).toEqual("apple@mango.com");
    expect(result.dataValues.updatedAt).toBeTruthy();
    expect(result.dataValues.createdAt).toBeTruthy();
  });

  test('should throw user not found exception when none existing id is used for reading', async () => {
    try{
      await getUserById(-100);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('User not found');
      }
    }
  });

  test('should throw user not found exception when none existing id is used for updating', async () => {
    try{
      await updateUser(-100, {name:"123455"});
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('User not found');
      }
    }
  }); 
  
  test('should throw user not found exception when none existing email is used for updating', async () => {
    try{
      await getUserByEmail("123@wery.com");
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('User email not found');
      }
    }
  }); 

  test('should throw user not found exception when none existing guid is used for updating', async () => {
    try{
      await getUserByGuid("123@wery.com");
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('User not found');
      }
    }
  }); 

  test('should read all users and update the first one ', async () => {
    const result = await getAllUsers();
    expect(result?.length).toBeGreaterThan(0);

    const updateResult = await updateUser(result[0].id, {...result[0], name:"titleUpdated"})
    expect(updateResult.dataValues.name).toEqual("titleUpdated");
    expect(result[0].surname).toEqual("Mango");
    expect(result[0].email).toEqual("apple@mango.com");
    expect(result[0].updatedAt).toBeTruthy();
    expect(result[0].createdAt).toBeTruthy();
  });

  test('should read all users and delete the first one ', async () => {
    const result = await getAllUsers();
    expect(result?.length).toBeGreaterThan(0);

    const deletedResult = await deleteUserById(result[0].id)
    expect(deletedResult).toBeTruthy();
  });

  test('should read all users and find it with less items', async () => {
    const result = await getAllUsers();
    expect(result?.length).toBeLessThan(4);
  });

});




