import {describe, test} from '@jest/globals';

// TODO: Manage tasks
// TODO: should get tasks - empty
// TODO: should get task - found
// TODO: should get task - not found
// TODO: should add task
// TODO: should get tasks - not empty
// TODO: should edit task - correct guid
// TODO: should edit task - incorrect guid
// TODO: should delete task - correct guid
// TODO: should delete task - incorrect guid
describe('Manage tasks - api level', () => {
  test('should not get tasks - unauthorised user',()=>{})
  test('should not get tasks - schema invalid',()=>{})
  test('should get tasks - tasks do not exist',()=>{})
  test('should get tasks - tasks do exist',()=>{})

  test('should not get one tasks - schema invalid',()=>{})
  test('should get one task - task does not exist',()=>{})
  test('should get one task - task does exist',()=>{})

  test('should not add one tasks - schema invalid',()=>{})
  test('should add one task - task does not exist',()=>{})
  test('should add one task - task does exist',()=>{})

  test('should not edit one tasks - schema invalid',()=>{})
  test('should edit one task - task does not exist',()=>{})
  test('should edit one task - task does exist',()=>{})

  test('should not delete one tasks - schema invalid',()=>{})
  test('should delete one task - task does not exist',()=>{})
  test('should delte one task - task does exist',()=>{})
})

// TODO: Manage task assignments
// TODO: should assign user to task - task does exist
// TODO: should assign user to task - task does not exist
// TODO: should assign user to task - user does exist
// TODO: should assign user to task - user does not exist
// TODO: should remove user from a task - user does exist
// TODO: should remove user from a task - user does not exist
// TODO: should remove user from a task - task does exist
// TODO: should remove user from a task - task does not exist
describe('Manage tasks assignments', () => {
    test('should not get tasks assignments - unauthorised user',()=>{})
    test('should not get tasks assignments - schema invalid',()=>{})
    test('should get tasks assignments - assignments do not exist',()=>{})
    test('should get tasks assignments - assignments do exist',()=>{})
  
    test('should not add one tasks assignments - schema invalid',()=>{})
    test('should add one task assignments - task does not exist',()=>{})
    test('should add one task assignments - task does exist',()=>{})
    test('should add one task assignments - user does not exist',()=>{})
    test('should add one task assignments - user does exist',()=>{})
  
    test('should not remove one tasks assignments - schema invalid',()=>{})
    test('should remove one task assignments - task does not exist',()=>{})
    test('should remove one task assignments - task does exist',()=>{})
    test('should remove one task assignments - user does not exist',()=>{})
    test('should remove one task assignments- user does exist',()=>{})
  })