import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { addBulkPrioties } from '../../database/data_access_layer/priority.dal';
import { addBulkLabels } from '../../database/data_access_layer/label.dal';
import { addBulkUsers, getUserByEmail, } from '../../database/data_access_layer/user.dal';
import { v4 as uuidv4 } from 'uuid';
import { ProjectInput } from '../../database/models/Project.model';
import { createBulkProjects, getAllProjectsByUserId,  } from '../../database/data_access_layer/project.dal';
import { addBulkTask, getTasksByProjectGuid, } from '../../database/data_access_layer/task.dal';
import humanId from 'human-id';
import { createTaskAssignments, deleteTaskAssignmentsByUserIdTaskId, getTaskAssignmentsByTaskId } from '../../database/data_access_layer/taskAssignment.dal';

describe('data access layer - tasks_assignments table', () => {
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

  test('should find empty task assignments using projects', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;

    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);

    const latestTask = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(1);
    expect(latestTask[0].task_assignments.length).toBeLessThan(1);
    expect(latestTask[1].task_assignments.length).toBeLessThan(1);
    expect(latestTask[2].task_assignments.length).toBeLessThan(1);
  });

  test('should throw task assignments not found exception when using taskId', async () => {
    try{
      await getTaskAssignmentsByTaskId(-1800);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Task assignments not found');
      }
    }
  });
  
  test('should find user, find project and assign user to a task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;

    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);
        
    const assignTask = await createTaskAssignments({
      taskId: tasks[1].id,
      userId
    });

    expect(assignTask.taskId).toBe(tasks[1].id);
    expect(assignTask.createdAt).toBeTruthy();

    const latestTask = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);
    expect(latestTask[1].task_assignments.length).toBeGreaterThan(0);

  });

  test('should find user, find project and assign another user to the same task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;

    const user2 = await getUserByEmail("apple@m4an4g2o.com");
    const userId2 = user2.id;

    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);
        
    const assignTask = await createTaskAssignments({
      taskId: tasks[1].id,
      userId:userId2
    });

    expect(assignTask.taskId).toBe(tasks[1].id);
    expect(assignTask.createdAt).toBeTruthy();

    const latestTask = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(1);
    expect(latestTask[1].task_assignments.length).toBeGreaterThan(0);

  });

  test('should find task assignments using taskId', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;

    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);

    const latestTaskAssignments = await getTaskAssignmentsByTaskId(tasks[1].id);
    expect(latestTaskAssignments.length).toBeGreaterThan(1);
  });

  test('should find task assignments using projects', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;

    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);

    const latestTask = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(1);
    expect(latestTask[1].task_assignments.length).toBeGreaterThan(1);
  });

  test('should find remove task assignments using taskId and userId', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    const userId = user.id;

    const availableProjects = await getAllProjectsByUserId(userId);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectGuid = availableProjects[0].guid;

    const tasks = await getTasksByProjectGuid(projectGuid);
    expect(tasks.length).toBeGreaterThan(0);
        
    const assignTask = await deleteTaskAssignmentsByUserIdTaskId(
      userId,
      tasks[1].id,
    );

    expect(assignTask).toBeTruthy();

    const latestTask = await getTasksByProjectGuid(projectGuid);
    expect(latestTask.length).toBeGreaterThan(0);
    expect(latestTask[1].task_assignments.length).toBeLessThan(tasks[1].task_assignments.length);

  });

});
