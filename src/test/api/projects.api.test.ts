import {describe, test} from '@jest/globals';

// TODO: Manage task projects
// TODO: should add project - schema invalid
// TODO: should add project - project does exist
// TODO: should add project - project does not exist

// TODO: should read project - schema invalid
// TODO: should read project - project does exist
// TODO: should read project - project does not exist

// TODO: should update project - schema invalid
// TODO: should update project - project does exist
// TODO: should update project - project does not exist
describe('Manage projects - api level', () => {
  test('should not get task comments - unauthorised user',()=>{})
  test('should not get projects - schema invalid',()=>{})
  test('should get projects - projects do not exist',()=>{})
  test('should get projects - projects do exist',()=>{})

  test('should not add one project - schema invalid',()=>{})
  test('should add one project - project does not exist',()=>{})
  test('should add one project - project does exist',()=>{})

  test('should not remove one project - schema invalid',()=>{})
  test('should remove one project - project does not exist',()=>{})
  test('should remove one project - project does exist',()=>{})
})
