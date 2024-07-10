import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';
import axios, { AxiosError } from 'axios';
import humanId from 'human-id';

import { startServer, stopServer } from '../../server';
import { delay } from '../../utils/delay';

beforeAll(async()=>{
  await startServer();
  await delay(2000);
})

afterAll(async()=>{
  await stopServer()
})

describe('Manage users', () => {

  describe('authentication',()=>{
    test('should not register user - schema invalid',async ()=>{
      try {
        const invalidBody = {
          name:"TestName",
          surname:"Surname",
          email:"testuser@gmail.com", 
        };
    
        await axios.post("http://127.0.0.1:5000/users/register", {
          ...invalidBody
        })
      } catch (error: Error | AxiosError| any) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(422);
          expect(error.response?.data.error).toBe("Api schema validation failed. Please find taskify-much documentation!");
        }
      }
    })
    test('should register user - user email does not exist',async ()=>{
      try {
        const validBody = {
          name:"TestName",
          surname:"Surname",
          email:"testuser@gmail.com", 
          password: "12345@agdjjd"
        };
    
        const result = await axios.post("http://127.0.0.1:5000/users/register", {
          ...validBody
        });
        expect(result.data.name).toBe(validBody.name);
        expect(result.data.email).toBe(validBody.email);
        expect(result.data.surname).toBe(validBody.surname);
        expect(result.status).toBe(200);
      } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.response?.status).toBe(400);
          }
      }
    })
    test('should not register user - user email does exist',async ()=>{
      try {
        const validBody = {
          name:"TestName",
          surname:"Surname",
          email:"testuser@gmail.com", 
          password: "12345@agdjjd"
        };
    
        await axios.post("http://127.0.0.1:5000/users/register", {
          ...validBody
        });      
      } catch (error: Error | AxiosError| any) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(400);
          expect(error.response?.data.error).toBe("User profile exist already.");
        }
      }
    })
  
    test('should not log user in - schema invalid',async ()=>{
      try {
        const invalidBody = {
          Email:"testuser@gmail.com", 
          Password: "12345@agdjjd"
        };
    
        await axios.post("http://127.0.0.1:5000/users/login", {
          ...invalidBody
        })
      } catch (error: Error | AxiosError| any) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(422);
          expect(error.response?.data.error).toBe("Api schema validation failed. Please find taskify-much documentation!");
        }
      }
    })
    test('should not log user in - invalid credentials (password incorrect)',async ()=>{
      try {
        const invalidBody = {
          email:"testuser@gmail.com", 
          password: "12345@agdjjd"
        };
    
        await axios.post("http://127.0.0.1:5000/users/login", {
          ...invalidBody
        })
      } catch (error: Error | AxiosError| any) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(401);
          expect(error.response?.data.error).toBe("Invalid password.");
        }
      }
    })
    test('should not log user in - invalid credentials (email incorrect)',async ()=>{
      try {
        const invalidBody = {
          email:"!testuser@gmail.com", 
          password: "12345@agdjjd"
        };
    
        await axios.post("http://127.0.0.1:5000/users/login", {
          ...invalidBody
        })
      } catch (error: Error | AxiosError| any) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(404);
          expect(error.response?.data.error).toBe("User email not found");
        }
      }
    })
    test('should log user in - credentials valid',async ()=>{
      const validBody = {
        email:"testuser@gmail.com", 
        password: "12345@agdjjd"
      };
  
      const result = await axios.post("http://127.0.0.1:5000/users/login", {
        ...validBody
      })
      expect(result?.status).toBe(200);
      expect(result?.data.token).toBeTruthy();
    })
  })
  

  describe('authorization',()=>{
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

    test('should get users - users do exist', async ()=>{
      const users = await axios.get('http://127.0.0.1:5000/users');
      expect(users.data.length).toBeGreaterThan(0);
      expect(users.status).toBe(200);
    })
  })

})