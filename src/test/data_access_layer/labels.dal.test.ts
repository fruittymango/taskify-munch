import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { createLabel, deleteLabelById, getAllLabels, addBulkLabels, updateLabel, getLabelById } from '../../database/data_access_layer/label.dal';

describe('data access layer - labels table', () => {
  beforeAll(async ()=>{
    await sequelizeConnection.sync({force:true})
  });
  
  test('should add label and test fields', async () => {
    const result = await createLabel({title:"title3"});
    expect(result.dataValues.id).toBeGreaterThan(-1);
    expect(result.dataValues.title).toEqual("title3");
    expect(result.dataValues.updatedAt).toBeTruthy();
    expect(result.dataValues.createdAt).toBeTruthy();
  });
  test('should add bulk labels', async () => {
    const result = await addBulkLabels([{title:"Bug"}, {title:"UI"}, {title:"WEB"}]);
    expect(result.length).toBeGreaterThan(2);
  });
  test('should retreive label of id given ', async () => {
    const result = await getAllLabels();
    expect(result?.length).toBeGreaterThan(0);
    
    const readResult = await getLabelById(result[0].id);
    expect(readResult).toBeTruthy();
  });
  test('should throw label not found exception when none existing id is used for reading', async () => {
    try{
      await getLabelById(-100);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Label not found');
      }
    }
  });
  test('should throw label not found exception when none existing id is used for updating', async () => {
    try{
      await updateLabel(-100, {title:"title3"});
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Label not found');
      }
    }
  });  
  test('should read all labels and update the first one ', async () => {
    const result = await getAllLabels();
    expect(result?.length).toBeGreaterThan(0);

    const updateResult = await updateLabel(result[0].id, {...result[0], title:"titleUpdated"})
    expect(updateResult.dataValues.title).toEqual("titleUpdated");
  });
  test('should read all labels and delete the first one ', async () => {
    const result = await getAllLabels();
    expect(result?.length).toBeGreaterThan(0);

    const deletedResult = await deleteLabelById(result[0].id)
    expect(deletedResult).toBeTruthy();
  });
  test('should read all labels and find it with less items', async () => {
    const result = await getAllLabels();
    expect(result?.length).toBeLessThan(4);
  });

});

