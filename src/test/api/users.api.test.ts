import {describe, expect, test} from '@jest/globals';
import axios, { AxiosError } from 'axios';

describe('Manage users - api level', () => {
  test('should not register user - schema invalid',async ()=>{
    try {
      const invalidBody = {
        name:"TestName",
        surname:"Surname",
        email:"testuser@gmail.com", 
      };
  
      await axios.post("http://127.0.0.1:5000/user/register", {
        ...invalidBody
      })
    } catch (error: Error | AxiosError| any) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(422);
        expect(error.response?.data.message).toBe("Api schema validation failed. Please find taskify-much documentation!");
      }
    }
  })
  test('should register user - user email does not exist',async ()=>{
    const validBody = {
      name:"TestName",
      surname:"Surname",
      email:"testuser@gmail.com", 
      password: "12345@agdjjd"
    };

    const result = await axios.post("http://127.0.0.1:5000/user/register", {
      ...validBody
    });
    expect(result.data.name).toBe(validBody.name);
    expect(result.data.email).toBe(validBody.email);
    expect(result.data.surname).toBe(validBody.surname);
    expect(result.status).toBe(200);
  })

  test('should not register user - user email does exist',async ()=>{
    try {
      const validBody = {
        name:"TestName",
        surname:"Surname",
        email:"testuser@gmail.com", 
        password: "12345@agdjjd"
      };
  
      await axios.post("http://127.0.0.1:5000/user/register", {
        ...validBody
      });      
    } catch (error: Error | AxiosError| any) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(400);
        expect(error.response?.data.message).toBe("User profile exist already.");
      }
    }
  })

  test('should not log user in - schema invalid',async ()=>{
    try {
      const invalidBody = {
        Email:"testuser@gmail.com", 
        Password: "12345@agdjjd"
      };
  
      await axios.post("http://127.0.0.1:5000/user/login", {
        ...invalidBody
      })
    } catch (error: Error | AxiosError| any) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(422);
        expect(error.response?.data.message).toBe("Api schema validation failed. Please find taskify-much documentation!");
      }
    }
  })
  test('should not log user in - invalid credentials (password incorrect)',async ()=>{
    try {
      const invalidBody = {
        email:"testuser@gmail.com", 
        password: "12345@agdjjd"
      };
  
      await axios.post("http://127.0.0.1:5000/user/login", {
        ...invalidBody
      })
    } catch (error: Error | AxiosError| any) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(401);
        expect(error.response?.data.message).toBe("Invalid password.");
      }
    }
  })
  test('should not log user in - invalid credentials (email incorrect)',async ()=>{
    try {
      const invalidBody = {
        email:"!testuser@gmail.com", 
        password: "12345@agdjjd"
      };
  
      await axios.post("http://127.0.0.1:5000/user/login", {
        ...invalidBody
      })
    } catch (error: Error | AxiosError| any) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(401);
        expect(error.response?.data.message).toBe("Invalid user credentials.");
      }
    }
  })
  test('should log user in - credentials valid',async ()=>{
    const validBody = {
      email:"testuser@gmail.com", 
      password: "12345@agdjjd"
    };

    const result = await axios.post("http://127.0.0.1:5000/user/login", {
      ...validBody
    })
    expect(result?.status).toBe(200);
    expect(result?.data.token).toBeTruthy();
  })
})