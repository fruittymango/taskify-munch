import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { addBulkPrioties, createPriority, deletePriorityById, getAllPriorities, getPriorityById, updatePriority } from '../../database/data_access_layer/priority.dal';

describe('data access layer - priorities table', () => {
  beforeAll(async ()=>{
    await sequelizeConnection.sync({force:true})
  });
  test('should throw priority not found exception when none existing id is used for reading', async () => {
    try{
      await getPriorityById(-100);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Priority not found');
      }
    }
  });
  test('should add priority and test fields', async () => {
    const result = await createPriority({title:"title"});
    expect(result.dataValues.id).toBeGreaterThan(-1);
    expect(result.dataValues.title).toEqual("title");
    expect(result.dataValues.updatedAt).toBeTruthy();
    expect(result.dataValues.createdAt).toBeTruthy();
  });
  test('should add bulk priorities', async () => {
    const result = await addBulkPrioties([{title:"Bug"}, {title:"UI"}, {title:"WEB"}]);
    expect(result.length).toBeGreaterThan(2);
  });
  test('should throw priority not found exception when none existing id is used for update', async () => {
    try{
      await updatePriority(-100, {title:"title"});
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Priority not found');
      }
    }
  });
  test('should retreive priority of id given ', async () => {
    const result = await getAllPriorities();
    expect(result?.length).toBeGreaterThan(0);

    const readPriority = await getPriorityById(result[0].id);
    expect(readPriority).toBeTruthy();
  });
  test('should read all priorities and update the first one ', async () => {
    const result = await getAllPriorities();
    expect(result?.length).toBeGreaterThan(0);

    const updateResult = await updatePriority(result[0].id, {...result[0], title:"titleUpdated"})
    expect(updateResult.dataValues.title).toEqual("titleUpdated");
    expect(updateResult.dataValues.updatedAt).toBeTruthy();
    expect(updateResult.dataValues.createdAt).toBeTruthy();
  });
  test('should read all priorities and delete the first one ', async () => {
    const result = await getAllPriorities();
    expect(result?.length).toBeGreaterThan(0);

    const deletedResult = await deletePriorityById(result[0].id)
    expect(deletedResult).toBeTruthy();
  });
  test('should read all priorities and find it with less items', async () => {
    const result = await getAllPriorities();
    expect(result?.length).toBeLessThan(4);
  });
});


