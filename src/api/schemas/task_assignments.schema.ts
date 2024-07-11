export const TaskIdUserIdBodySchema = {
  params: {
    type: 'object',
    required: ['guid'],
    properties: {
      guid: { type: 'string', format: 'uuid' },
    }
  },
  body: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'number' },
    }
  }
}

export const TaskAssignmentSchema = {
  params: {
    type: 'object',
    required: ['guid'],
    properties: {
      guid: { type: 'string', format: 'uuid' },
    }
  },
  body: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'number' },
    }
  }
}

