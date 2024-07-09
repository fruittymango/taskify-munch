import {beforeAll, describe, expect, test} from '@jest/globals';
import axios, { AxiosError } from 'axios';
import humanId from 'human-id';

describe('Manage ptiotities - api level', () => {
  describe("unauthorised access of resource", ()=>{
    test('should not get priorities - unauthorised user', async ()=>{
      try {
       await axios.get('http://127.0.0.1:5000/priorities');
      } catch (error) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(401);
          expect(error.response?.data.message).toBe("User unauthorized! Login required.")        
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
  
        await axios.post("http://127.0.0.1:5000/user/register", {
          ...validBody
        }); 

        const result = await axios.post("http://127.0.0.1:5000/user/login", {
          email: validBody.email,
          password: validBody.password,
          
        })
        expect(result?.status).toBe(200);
        expect(result?.data.token).toBeTruthy();
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}` 
  
      } catch (error: Error | AxiosError| any) {
        if (error instanceof AxiosError) {
          expect(error.response?.status).toBe(400);
          expect(error.response?.data.message).toBe("User profile exist already.");
        }
      }    
    })
    test('should get priorities',async()=>{
      const result = await axios.get('http://127.0.0.1:5000/priorities');
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.status).toBe(200);
    })
  })

})

