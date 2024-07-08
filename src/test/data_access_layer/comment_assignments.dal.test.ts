import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { addBulkPrioties, } from '../../database/data_access_layer/priority.dal';
import { addBulkLabels, } from '../../database/data_access_layer/label.dal';
import { addBulkUsers, getUserByEmail } from '../../database/data_access_layer/user.dal';
import { v4 as uuidv4 } from 'uuid';
import { ProjectInput } from '../../database/models/Project.model';
import { createBulkProjects, getAllProjectsByUserId, } from '../../database/data_access_layer/project.dal';
import { addBulkTask, getTasksByProjectGuid, } from '../../database/data_access_layer/task.dal';
import humanId from 'human-id';
import { createComment, getCommentById } from '../../database/data_access_layer/comment.dal';
import { createCommentAssignment, getCommentAssignmentsByTaskId } from '../../database/data_access_layer/commentAssignment.dal';

describe('data access layer - comment_assignments table', () => {
  beforeAll(async ()=>{
    await sequelizeConnection.sync({force:true})
    const userResult = await addBulkUsers([
      {guid:uuidv4(),name:"Apple3", surname:"Ma34ngo", email:"apple@ma4ng2o.com", password:uuidv4(),},
      {guid:uuidv4(),name:"Apple2", surname:"Ma2ngo", email:"apple@mang2o.com", password:uuidv4(),},
      {guid:uuidv4(),name:"Apple2ee", surname:"Ma33ngo", email:"apple@m4an4g2o.com",password:uuidv4(),},
      {guid:uuidv4(),name:"Apple2323", surname:"Ma3ngo", email:"apple@4mang2o.com", password:uuidv4(),},
    ]);
    const labels = await addBulkLabels([{title:"Bug"}, {title:"UI"}, {title:"WEB"}]);
    const priorities = await addBulkPrioties([{title:"High"}, {title:"Medium"}, {title:"Low"}]);
    const project: ProjectInput = {
      guid:uuidv4(),
      title: "Apple Bess",
      description: "With strings and honey,,,,,,,,,!",
      userId: userResult[1].id,
    };
    const projects = await createBulkProjects([
      project,
      {
        ...project,
        description: "With strings, honey and milk,,,,,,,,,!",
        title:"Project2", 
        guid:uuidv4()
      }
    ]);

    const task = {
      title:"TaskTitle",
      guid: uuidv4(),
      dueDate:new Date("2024-08-11"),
      labelId:labels[0].id, priorityId:priorities[0].id, projectId:projects[0].id,
      description: "Tiya moya Bokani Dyer",
      createdBy:userResult[1].id,
    }

    await addBulkTask([
      {
        ...task,
        title:"TaskTitlere",
        dueDate:new Date("2024-08-12"),
        guid: uuidv4(),
        description: "Tiya moya Bokanisddddddd",
      },
      {
        ...task,
        title:"TaskTitlereQwert",
        dueDate:new Date("2024-08-14"),
        guid: uuidv4(),
        description: "Tiya moya !!!!!",
      },
      {
        ...task,
        title:humanId(),
        dueDate:new Date("2024-08-14"),
        guid: uuidv4(),
        description: humanId(),
      }
    ]);
  });

  test('should assign comment to a task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;
    const content = uuidv4()+humanId();
    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);

    const taskId = tasks[0].id;

    const newComment = await createComment({content, guid:uuidv4(),createdBy:userId});
    expect(newComment.dataValues.id).toBeGreaterThan(-1);

    const assignedComment = await createCommentAssignment({commentId:newComment.id, taskId});
    expect(assignedComment.id).toBeGreaterThan(-1);
    expect(assignedComment.createdAt).toBeTruthy();
  });

  test('should read comment on a task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;
    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);

    const taskId = tasks[0].id;

    const assignedComments = await getCommentAssignmentsByTaskId(taskId);
    expect(assignedComments.length).toBeGreaterThan(0);

    const comment = await getCommentById(assignedComments[0].id);
    expect(comment.id).toBeGreaterThan(-1);
    expect(comment.content).toBeTruthy();
    expect(comment.createdBy).toBeTruthy();
  });

  test('should throw no comment assignment found when given a non existing task or comment', async () => {
    try{
      await getCommentAssignmentsByTaskId(-100);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Comment assignment not found');
      }
    }
  });

});
