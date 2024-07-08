import {describe, test} from '@jest/globals';

// TODO: Manage Users
// TODO: should get users - users does exist
// TODO: should get users - users does not exist
// TODO: should add user - does not exist
// TODO: should add user - does exist
// TODO: should get user - does exit exist
// TODO: should get user - does not exist
// TODO: should update user - does exist
// TODO: should update user - does not exist
// TODO: should delete user - does exist
// TODO: should delete user - does not exist  
describe('Manage users - api level', () => {
  test('should not get users - user unauthorized',()=>{})
  test('should get users - schema invalid',()=>{})
  test('should get users - users does not exist',()=>{})
  test('should get users - users does exist',()=>{})

  test('should not add user - schema invalid',()=>{})
  test('should add user - user email does not exist',()=>{})
  test('should add user - user email does exist',()=>{})

  test('should not get delete user - schema invalid',()=>{})
  test('should get user - user does exist',()=>{})
  test('should get user - users does not exist',()=>{})

  test('should not update delete user - schema invalid',()=>{})
  test('should update user - users does not exist',()=>{})
  test('should update user - users does exist',()=>{})

  test('should not delete user - schema invalid',()=>{})
  test('should delete user - users does exist',()=>{})
  test('should get user - users does not exist',()=>{})
})