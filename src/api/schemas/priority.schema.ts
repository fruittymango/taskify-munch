export const AddPrioritySchema = {
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        guid: { type: 'string' },
        title: { type: 'string' },
      }
    }
  }
}

export const GetPrioritiesSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          guid: { type: 'string' }
        }
      }
    }
  }
}

export const UpdatePrioritySchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        guid: { type: 'string' },
        title: { type: 'string' },
      }
    }
  }
}
