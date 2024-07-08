import {describe, test} from '@jest/globals';

// TODO: Manage task priorities
// TODO: should add priority - schema invalid
// TODO: should add priority - priority does exist
// TODO: should add priority - priority does not exist

// TODO: should read priority - schema invalid
// TODO: should read priority - priority does exist
// TODO: should read priority - priority does not exist

// TODO: should update priority - schema invalid
// TODO: should update priority - priority does exist
// TODO: should update priority - priority does not exist

// TODO: should delete priority - schema invalid
// TODO: should delete priority - priority does exist
// TODO: should delete priority - priority does not exist

describe('Manage priorities - controller level', () => {
  test('should not get priorities - unauthorised user',()=>{})
  test('should not get priorities - schema invalid',()=>{})
  test('should get priorities - priorities do not exist',()=>{})
  test('should get priorities - priorities do exist',()=>{})

  test('should not add one priority - schema invalid',()=>{})
  test('should add one priority - priority does not exist',()=>{})
  test('should add one priority - priority does exist',()=>{})

  test('should not update one priority - schema invalid',()=>{})
  test('should update one priority - priority does not exist',()=>{})
  test('should update one priority - priority does exist',()=>{})

  test('should not remove one priority - schema invalid',()=>{})
  test('should remove one priority - priority does not exist',()=>{})
  test('should remove one priority - priority does exist',()=>{})
})
