import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { createUser, getUserByEmail } from '../../database/data_access_layer/user.dal';
import { v4 as uuidv4 } from 'uuid';
import humanId from 'human-id';
import { createComment, deleteCommentByGuid,  getCommentByGuid, getCommentById, updateComment } from '../../database/data_access_layer/comment.dal';

describe('data access layer - comments table', () => {
  beforeAll(async ()=>{
    await sequelizeConnection.sync({force:true})
    await createUser({guid:uuidv4(),name:"Apple2", surname:"Mango", email:"apple@mang2o.com", password:uuidv4(),});

  });
  test('should throw comment not found exception when none existing comment guid is used for retrieval', async () => {
    try{
      await getCommentByGuid(humanId());
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Comment not found');
      }
    }
  });
  test('should throw comment not found exception when none existing comment id is used for retrieval', async () => {
    try{
      await getCommentById(-100);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Comment not found');
      }
    }
  });
  test('should add comment and test fields', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;
    const content = uuidv4()+humanId();
    const result = await createComment({content, guid:uuidv4(),createdBy:userId});
    expect(result.dataValues.id).toBeGreaterThan(-1);
    expect(result.dataValues.content).toEqual(content);
    expect(result.dataValues.updatedAt).toBeTruthy();
    expect(result.dataValues.createdAt).toBeTruthy();
  });
  test('should throw comment not found exception when none existing comment id is used for update', async () => {
    try{
      await updateComment(uuidv4(), {});
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Comment not found');
      }
    }
  });
  test('should create and retreive comment given guid given', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;
    const content = uuidv4()+humanId();
    const guid = uuidv4();
    const result = await createComment({content, guid,createdBy:userId});
    expect(result.createdAt).toBeTruthy();

    const readComment = await getCommentByGuid(guid);
    expect(readComment.createdBy).toBe(userId);
    expect(readComment.content).toBe(content);
    expect(readComment.guid).toBe(guid);
    expect(readComment.createdBy).toBe(userId);

  });
  test('should update commment given comment guid', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;
    const content = uuidv4()+humanId();
    const guid = uuidv4();
    const result = await createComment({content, guid,createdBy:userId});

    const readComment = await updateComment(result.guid,{content:content+"!!", guid,createdBy:userId} );
    expect(readComment.createdBy).toBe(userId);
    expect(readComment.guid).toBe(guid);
    expect(readComment.createdBy).toBe(userId);
  });
  test('should delete comment given comment guid', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;
    const content = uuidv4()+humanId();
    const guid = uuidv4();
    const result = await createComment({content, guid,createdBy:userId});

    const readComment = await deleteCommentByGuid(result.guid);
    expect(readComment).toBeTruthy();
  });
});
