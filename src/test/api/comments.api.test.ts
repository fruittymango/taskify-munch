import {describe, test} from '@jest/globals';

// TODO: Manage task comments
// TODO: should add user comment to a task - user does exist
// TODO: should add user comment to a task - user does not exist
// TODO: should add user comment to a task - task does exist
// TODO: should add user comment to a task - task does not exist
describe('Manage tasks comments - api level', () => {
  test('should not get task comments - unauthorised user',()=>{})
  test('should not get task comments - schema invalid',()=>{})
  test('should get tasks comments - comments do not exist',()=>{})
  test('should get tasks comments - comments do exist',()=>{})

  test('should not add one task comments - schema invalid',()=>{})
  test('should add one task comments - task does not exist',()=>{})
  test('should add one task comments - task does exist',()=>{})

  test('should not remove one task comments - schema invalid',()=>{})
  test('should remove one task comments - task does not exist',()=>{})
  test('should remove one task comments - task does exist',()=>{})
  test('should remove one task comments - user does not exist',()=>{})
  test('should remove one task comments- user does exist',()=>{})
})
