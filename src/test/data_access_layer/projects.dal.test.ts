import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { createUser, getUserByEmail} from '../../database/data_access_layer/user.dal';
import { v4 as uuidv4 } from 'uuid';
import { ProjectInput } from '../../database/models/Project.model';
import { createProject, deleteProjectById, getAllProjectsByUserId, getProjectByGuid, getProjectById, updateProject } from '../../database/data_access_layer/project.dal';

describe('data access layer - projects table', () => {
  beforeAll(async ()=>{
    await sequelizeConnection.sync({force:true})
    await createUser({guid:uuidv4(),name:"Apple2", surname:"Mango", email:"apple@mang2o.com", password:uuidv4(),});
  });
  
  test('should find user then create project', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");
    
    const project: ProjectInput = {
      guid:uuidv4(),
      title: "Apple Bess",
      description: "With strings and honey,,,,,,,,,!",
      userId: user.dataValues.id,
    };

    const result = await createProject(project);
    expect(result.id).toBeGreaterThan(-1);
    expect(result.title).toEqual("Apple Bess");
  });

  test('should find user and user projects', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const result = await getAllProjectsByUserId(user.dataValues.id,);
    expect(result.length).toBeGreaterThan(0);
  });

  test('should throw project not found exception when none existing id is used for reading', async () => {
    try{
      await getProjectById(-100);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Project not found');
      }
    }
  });

  test('should throw project not found exception when none existing guid is used for reading', async () => {
    try{
      await getProjectByGuid("12e-vhbfdn-mf");
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Project not found');
      }
    }
  });

  test('should throw project not found exception when none existing id is used for updating', async () => {
    try{
      await updateProject(-100, {});
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Project not found');
      }
    }
  });

  test('should find user and user projects then update title of first project ', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const result = await getAllProjectsByUserId(user.dataValues.id,);
    expect(result.length).toBeGreaterThan(0);

    const updateResult = await updateProject(result[0].id, {...result[0], title:"titleUpdated"})
    expect(updateResult.dataValues.title).toEqual("titleUpdated");
    expect(result[0].updatedAt).toBeTruthy();
    expect(result[0].createdAt).toBeTruthy();

  });

  test('should find user and user projects then update title of first project using guid ', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const result = await getAllProjectsByUserId(user.dataValues.id,);
    expect(result.length).toBeGreaterThan(0);

    const updateResult = await getProjectByGuid(result[0].guid);
    expect(updateResult.dataValues.title).toEqual(updateResult.title);
    expect(result[0].createdAt).toEqual(updateResult.dataValues.createdAt);
  });

  test('should find user and user projects using projectId', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const result = await getAllProjectsByUserId(user.dataValues.id,);
    expect(result.length).toBeGreaterThan(0);

    const updateResult = await getProjectById(result[0].id)
    expect(updateResult.updatedAt).toBeTruthy();
    expect(updateResult.createdAt).toBeTruthy();

  });

  test('should find user and user projects then delete title of first project ', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const result = await getAllProjectsByUserId(user.dataValues.id,);
    expect(result.length).toBeGreaterThan(0);

    const deletedResult = await deleteProjectById(result[0].id)
    expect(deletedResult).toBeTruthy();
  });

  test('should find user and empty user projects ', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const result = await getAllProjectsByUserId(user.dataValues.id,);
    expect(result.length).toBeLessThan(1);
  });

});