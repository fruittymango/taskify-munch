import { v4 as uuidv4 } from 'uuid';
import humanId from 'human-id';
import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';
import axios, { AxiosError } from 'axios';

import { startServer, stopServer } from '../../server';
import { delay } from '../../utils/delay';

beforeAll(async()=>{
  await startServer();
  await delay(2000);
})

afterAll(async()=>{
  await stopServer()
})

describe('Manage tasks - api level', () => {
  describe("unauthorised access of resource", ()=>{
    test('should not get tasks - unauthorised user', async ()=>{
      try {
       await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+uuidv4());
      } catch (error) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(401);
          expect(error.response?.data.error).toBe("User unauthorized! Login required.")        
        }
      }
    })
  })
  describe("authorised access of resource", ()=>{
    beforeAll(async()=>{
      try{
        const validBody = {
          name:"Test"+humanId(),
          surname:"Test"+humanId(),
          email:humanId()+"@gmail.com", 
          password: humanId()
        };
  
        await axios.post("http://127.0.0.1:5000/users/register", {
          ...validBody
        }); 

        const result = await axios.post("http://127.0.0.1:5000/users/login", {
          email: validBody.email,
          password: validBody.password,
          
        })
        expect(result?.status).toBe(200);
        expect(result?.data.token).toBeTruthy();
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}` 
  
      } catch (error: Error | AxiosError| any) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(400);
          expect(error.response?.data.error).toBe("User profile exist already.");
        }
      }    
    })

    describe("getting tasks", ()=>{
      test('should not get tasks - schema invalid',async ()=>{
        try {
          await axios.get('http://127.0.0.1:5000/tasks?projectGuid1');
         } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(422);
          }
        }
      })
  
      test('should not get tasks - project and tasks do not exist',async ()=>{
        try {
          await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+uuidv4());
        } catch (error: Error | AxiosError| any) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(404);
            expect(error.response?.data.error).toBe("Tasks do not exist.");
          }
        }
      })
    });

    describe("adding tasks", ()=>{
      test('should not add one tasks - schema invalid',async()=>{
        try {      
          const invalidBody = {
            name:"TestName",
            content:"Surname",
          };
    
          await axios.post('http://127.0.0.1:5000/tasks', {...invalidBody}, );
    
        } catch (error: Error | AxiosError| any) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(422);
            expect(error.response?.data.error).toBe("Api schema validation failed. Please find taskify-much documentation!");
          }
        }
      })
  
      test('should add one task to first project - tasks do not exist',async()=>{
        const addProjectBody = {title:humanId(), description: humanId()};
        const addProjectResult = await axios.post('http://127.0.0.1:5000/projects', {...addProjectBody},  );
        expect(addProjectResult.data.title).toBe(addProjectBody.title);
        expect(addProjectResult.status).toBe(200);
  
        const projects = await axios.get('http://127.0.0.1:5000/projects');
        expect(projects.data.length).toBeGreaterThan(0);
        expect(projects.status).toBe(200);
  
        const labels = await axios.get('http://127.0.0.1:5000/labels');
        expect(labels.data.length).toBeGreaterThan(0);
        expect(labels.status).toBe(200);
  
        const priorities = await axios.get('http://127.0.0.1:5000/priorities');
        expect(priorities.data.length).toBeGreaterThan(0);
        expect(priorities.status).toBe(200);
  
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 7);
        const addTaskBody = {
          title:humanId(),
          description: uuidv4(),
          dueDate: futureDate.toISOString().split('T')[0],
          labelId: labels.data[0].id,
          projectId: projects.data[0].id,
          priorityId: priorities.data[0].id,
        };
  
        const addTaskResult = await axios.post('http://127.0.0.1:5000/tasks', {...addTaskBody},  );
        expect(addTaskResult.status).toBe(200);
        expect(addTaskResult.data.title).toBe(addTaskBody.title);
        expect(addTaskResult.data.description).toBe(addTaskBody.description);
      });
    });

    describe("getting one task", ()=>{
      test('should get tasks - tasks do exist', async ()=>{
        const projects = await axios.get('http://127.0.0.1:5000/projects');
        expect(projects.data.length).toBeGreaterThan(0);
        expect(projects.status).toBe(200);
  
        const result = await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+projects.data[0].guid);
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
      })
    
      test('should not get one tasks - schema invalid',async ()=>{
        try {
          await axios.get(`http://127.0.0.1:5000/tasks/1`,)
        } catch (error: Error | AxiosError| any) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(422);
            expect(error.response?.data.error).toBe("Api schema validation failed. Please find taskify-much documentation!");
    
          }
        }
      })
  
      test('should get one task - task guid does not exist',async ()=>{
        try {
          const validGuid = uuidv4();
          await axios.get('http://127.0.0.1:5000/tasks/'+validGuid);
        } catch (error: Error | AxiosError| any) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(404);
            expect(error.response?.data.error).toBe("Task not found");
          }
        }
      })
  
      test('should get one task - task guid does exist',async()=>{
        const projects = await axios.get('http://127.0.0.1:5000/projects');
        const projectIndex = projects.data.length - 1;
        expect(projects.status).toBe(200);
        expect(projects.data.length).toBeGreaterThan(0);
        expect(projects.data[projectIndex].guid).toBeTruthy();
  
        const tasks = await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+projects.data[projectIndex].guid);
  
        const taxIndex = tasks.data.length - 1;
        expect(tasks.status).toBe(200);
        expect(tasks.data.length).toBeGreaterThan(0);
        expect(tasks.data[taxIndex].guid).toBeTruthy();
  
        const task = await axios.get('http://127.0.0.1:5000/tasks/'+tasks.data[taxIndex].guid);
  
        expect(task.data.title).toBe(tasks.data[taxIndex].title);
        expect(task.data.projectId).toBe(tasks.data[taxIndex].projectId);
        expect(task.status).toBe(200);
      })
    });

    describe("updating one task", ()=>{
      test('should not update one tasks - schema invalid',async()=>{
        try {
          const editTask = {
            title:humanId(),
            Description: uuidv4(),
          };
          await axios.put('http://127.0.0.1:5000/tasks/23ws', {...editTask},  );
          
        } catch (error: Error | AxiosError| any) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(422);
            expect(error.response?.data.error).toBe("Api schema validation failed. Please find taskify-much documentation!");
          }
        }
      })
  
      test('should not update task - task does not exist',async()=>{
        try {
          const projects = await axios.get('http://127.0.0.1:5000/projects');
          const projectIndex = projects.data.length - 1;
          expect(projects.status).toBe(200);
          expect(projects.data.length).toBeGreaterThan(0);
          expect(projects.data[projectIndex].guid).toBeTruthy();
          
          const task = await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+projects.data[projectIndex].guid);
          expect(task.status).toBe(200);
          expect(task.data.length).toBeGreaterThan(0);
          expect(task.data[projectIndex].guid).toBeTruthy();
  
          const editTaskBody = {
            ...task.data[0],
            title:humanId(),
            description: uuidv4(),
            dueDate:"2023-04-11"
          };
  
           await axios.put('http://127.0.0.1:5000/tasks/'+uuidv4(), {...editTaskBody},  );
  
        } catch (error: Error | AxiosError| any) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(404);
            expect(error.response?.data.error).toBe("Task not found");
          }
        }
      })
  
      test('should update task - task does exist',async()=>{
        const projects = await axios.get('http://127.0.0.1:5000/projects');
        const projectIndex = projects.data.length - 1;
        expect(projects.status).toBe(200);
        expect(projects.data.length).toBeGreaterThan(0);
        expect(projects.data[projectIndex].guid).toBeTruthy();
  
        const task = await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+projects.data[projectIndex].guid);
        expect(task.status).toBe(200);
        expect(task.data.length).toBeGreaterThan(0);
        expect(task.data[projectIndex].guid).toBeTruthy();
  
        const editTaskBody = {
          ...task.data[0],
          title:humanId(),
          description: uuidv4(),
          dueDate:"2023-04-11"
        };
  
        const editTaskResult = await axios.put('http://127.0.0.1:5000/tasks/'+task.data[0].guid, {...editTaskBody},  );
        expect(editTaskResult.status).toBe(200);
        expect(editTaskResult.data.title).toBe(editTaskBody.title);
        expect(editTaskResult.data.description).toBe(editTaskBody.description);
      })
    });

    describe("patching one task", ()=>{
      test('should patch task status - task does exist',async()=>{
        const projects = await axios.get('http://127.0.0.1:5000/projects');
        const projectIndex = 0;
        expect(projects.status).toBe(200);
        expect(projects.data.length).toBeGreaterThan(0);
        expect(projects.data[projectIndex].guid).toBeTruthy();
  
        const tasks = await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+projects.data[projectIndex].guid);
        expect(tasks.status).toBe(200);
        expect(tasks.data.length).toBeGreaterThan(0);
        expect(tasks.data[projectIndex].guid).toBeTruthy();
  
        const statuses = await axios.get('http://127.0.0.1:5000/statuses');
        expect(statuses.status).toBe(200);
        expect(statuses.data.length).toBeGreaterThan(0);
        const pacthTaskBody = {
          statusId: statuses.data[1].id,
        };
  
        const editTaskResult = await axios.patch('http://127.0.0.1:5000/tasks/'+tasks.data[0].guid, {...pacthTaskBody},  );
        expect(editTaskResult.status).toBe(200);
        expect(editTaskResult.data.statusId).toBe(pacthTaskBody.statusId);
      
      })
    }) 

    describe("deleting one task", ()=>{
      test('should not delete task - task does not exist',async ()=>{
      
        try {
          await axios.delete('http://127.0.0.1:5000/tasks/'+uuidv4(), );
        } catch (error: Error | AxiosError| any) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(404);
            expect(error.response?.data.error).toBe("Task not found");
          }
        }
      })
  
      test('should delete task - task does exist',async ()=>{
        const projects = await axios.get('http://127.0.0.1:5000/projects');
        const projectIndex = 0;
        expect(projects.status).toBe(200);
        expect(projects.data.length).toBeGreaterThan(0);
        expect(projects.data[projectIndex].guid).toBeTruthy();
  
        const tasks = await axios.get('http://127.0.0.1:5000/tasks?projectGuid='+projects.data[projectIndex].guid);
        expect(tasks.status).toBe(200);
        expect(tasks.data.length).toBeGreaterThan(0);
        expect(tasks.data[projectIndex].guid).toBeTruthy();
  
  
        const editTaskResult = await axios.delete('http://127.0.0.1:5000/tasks/'+tasks.data[0].guid,  );
        expect(editTaskResult.status).toBe(200);
        
      })
    });  
      
  })
})