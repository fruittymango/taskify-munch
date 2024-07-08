import {describe, test} from '@jest/globals';

// TODO: Manage task labels
// TODO: should add label - schema invalid
// TODO: should add label - label does exist
// TODO: should add label - label does not exist

// TODO: should read label - schema invalid
// TODO: should read label - label does exist
// TODO: should read label - label does not exist

// TODO: should update label - schema invalid
// TODO: should update label - label does exist
// TODO: should update label - label does not exist

// TODO: should delete label - schema invalid
// TODO: should delete label - label does exist
// TODO: should delete label - label does not exist

describe('Manage labels - api level', () => {
  test('should not get labels - unauthorised user',()=>{})
  test('should not get labels - schema invalid',()=>{})
  test('should get labels - labels do not exist',()=>{})
  test('should get labels - labels do exist',()=>{})

  test('should not add one label - schema invalid',()=>{})
  test('should add one label - label does not exist',()=>{})
  test('should add one label - label does exist',()=>{})

  test('should not update one label - schema invalid',()=>{})
  test('should update one label - label does not exist',()=>{})
  test('should update one label - label does exist',()=>{})

  test('should not remove one label - schema invalid',()=>{})
  test('should remove one label - label does not exist',()=>{})
  test('should remove one label - label does exist',()=>{})
})
