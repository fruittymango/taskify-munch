import {beforeAll, describe, expect, test} from '@jest/globals';
import sequelizeConnection from '../../database/setup';
import '../../helpers/loadEnv';
import { addBulkPrioties} from '../../database/data_access_layer/priority.dal';
import {  getAllLabels, addBulkLabels, } from '../../database/data_access_layer/label.dal';
import {  createUser, getUserByEmail, } from '../../database/data_access_layer/user.dal';
import { v4 as uuidv4 } from 'uuid';
import { ProjectInput } from '../../database/models/Project.model';
import { createBulkProjects, getAllProjectsByUserId, updateProject } from '../../database/data_access_layer/project.dal';
import { addBulkTask, createTask, deleteTaskById, getTaskById, getTasksByProjectGuid, getTasksByProjectId, updateTask } from '../../database/data_access_layer/task.dal';
import humanId from 'human-id';

describe('data access layer - tasks table', () => {
  beforeAll(async ()=>{
    await sequelizeConnection.sync({force:true})
    const userResult = await createUser({guid:uuidv4(),name:"Apple2", surname:"Mango", email:"apple@mang2o.com", password:uuidv4(),});
    await addBulkLabels([{title:"Bug"}, {title:"UI"}, {title:"WEB"}]);
    await addBulkPrioties([{title:"High"}, {title:"Medium"}, {title:"Low"}]);
    const project: ProjectInput = {
      guid:uuidv4(),
      title: "Apple Bess",
      description: "With strings and honey,,,,,,,,,!",
      userId: userResult.id,
    };
    await createBulkProjects([
      project,
      {
        ...project,
        description: "With strings, honey and milk,,,,,,,,,!",
        title:"Project2", 
        guid:uuidv4()
      }
    ]);
  });
  
  test('should find user, create project then add task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");
    
    const createdBy = user.id;

    const availableProjects = await getAllProjectsByUserId(user.id);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectId = availableProjects[0].id;

    const availableLabels = await getAllLabels();
    expect(availableLabels.length).toBeGreaterThan(0);

    const labelId = availableLabels[0].id;

    const availablePriorities = await getAllLabels();
    expect(availablePriorities.length).toBeGreaterThan(0);

    const priorityId = availablePriorities[0].id;

    const task = {
      title:"TaskTitle",
      dueDate:new Date("2024-08-11"),
      guid: uuidv4(),
      labelId, priorityId, projectId,
      description: "Tiya moya Bokani Dyer",
      createdBy,
    }

    const addedTask = await createTask(task);
    expect(addedTask.id).toBeGreaterThan(-1)
    expect(addedTask.projectId).toBe(priorityId)
    expect(addedTask.labelId).toBe(labelId)
    expect(addedTask.createdBy).toBe(createdBy)
    expect(addedTask.priorityId).toBe(priorityId)
    expect(addedTask.dueDate).toBe(task.dueDate)
  });

  test('should throw task not found exception when none existing id is used for reading', async () => {
    try{
      await getTaskById(-100);
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Task not found');
      }
    }
  });

  test('should throw task not found exception when none existing id is used for updating', async () => {
    try{
      await updateTask(-100, {});
    }
    catch(error){
      if (error instanceof Error) {
        expect(error.message).toBe('Task not found');
      }
    }
  });

  test('should find user, user projects then tasks using project id', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const projects = await getAllProjectsByUserId(user.dataValues.id,);
    expect(projects.length).toBeGreaterThan(0);

    const projectTasks = await getTasksByProjectId(projects[0].id,);
    expect(projectTasks.length).toBeGreaterThan(0);
  });

  test('should find user, user projects then a task using task id', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const projects = await getAllProjectsByUserId(user.dataValues.id,);
    expect(projects.length).toBeGreaterThan(0);

    const projectTasks = await getTasksByProjectId(projects[0].id,);
    expect(projectTasks.length).toBeGreaterThan(0);

    const task = await getTaskById(projectTasks[0].id,);
    expect(task).toBeTruthy();
  });

  test('should find user, user projects then tasks using project guid', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const projects = await getAllProjectsByUserId(user.dataValues.id,);
    expect(projects.length).toBeGreaterThan(0);

    const tasks = await getTasksByProjectGuid(projects[0].guid,);
    expect(tasks.length).toBeGreaterThan(0);
  });

  test('should find user, user projects then update title of first task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const projects = await getAllProjectsByUserId(user.dataValues.id,);
    expect(projects.length).toBeGreaterThan(0);

    const tasks = await getTasksByProjectGuid(projects[0].guid,);
    expect(tasks.length).toBeGreaterThan(0);

    const updateResult = await updateProject(tasks[0].id, {...tasks[0], title:"titleUpdated"})
    expect(updateResult.dataValues.title).toEqual("titleUpdated");
    expect(tasks[0].updatedAt).toBeTruthy();
    expect(tasks[0].createdAt).toBeTruthy();
  });

  test('should find user, user projects then update title of first task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const projects = await getAllProjectsByUserId(user.dataValues.id,);
    expect(projects.length).toBeGreaterThan(0);

    const tasks = await getTasksByProjectGuid(projects[0].guid,);
    expect(tasks.length).toBeGreaterThan(0);

    const updateResult = await updateTask(tasks[0].id, {...tasks[0], title:"titleUpdated"})
    expect(updateResult.dataValues.title).toEqual("titleUpdated");
    expect(updateResult.updatedAt).toBeTruthy();
  });

  test('should find user, user projects then delete title of first task', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const projects = await getAllProjectsByUserId(user.dataValues.id,);
    expect(projects.length).toBeGreaterThan(0);

    const tasks = await getTasksByProjectGuid(projects[0].guid,);
    expect(tasks.length).toBeGreaterThan(0);

    const deletedResult = await deleteTaskById(tasks[0].id)
    expect(deletedResult).toBeTruthy();
  });

  test('should find user, user projects then tasks that are less than 2', async () => {
    const user = await getUserByEmail("apple@mang2o.com");
    expect(user.dataValues.email).toEqual("apple@mang2o.com");

    const projects = await getAllProjectsByUserId(user.dataValues.id,);
    expect(projects.length).toBeGreaterThan(0);

    const tasks = await getTasksByProjectGuid(projects[0].guid,);
    expect(tasks.length).toBeLessThan(1);
  });

  test('should find user, create project then add bulk tasks', async () => {    
    const userEmail = "apple@mang2o.com";
    const user = await getUserByEmail(userEmail);
    expect(user.dataValues.email).toEqual(userEmail);
    
    const createdBy = user.id;

    const availableProjects = await getAllProjectsByUserId(user.id);
    expect(availableProjects.length).toBeGreaterThan(0);

    const projectId = availableProjects[0].id;

    const availableLabels = await getAllLabels();
    expect(availableLabels.length).toBeGreaterThan(0);

    const labelId = availableLabels[0].id;

    const availablePriorities = await getAllLabels();
    expect(availablePriorities.length).toBeGreaterThan(0);

    const priorityId = availablePriorities[0].id;

    const task = {
      title:"TaskTitle",
      dueDate:new Date("2024-08-11"),
      guid: uuidv4(),
      labelId, priorityId, projectId,
      description: "Tiya moya Bokani Dyer",
      createdBy,
    }

    const addedTask = await createTask(task);
    expect(addedTask.id).toBeGreaterThan(-1)
    
    const tasks = await addBulkTask([
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
    expect(tasks?.length).toBeGreaterThan(2);
    expect(tasks[0].id).toBeGreaterThan(-1);
  });

});
