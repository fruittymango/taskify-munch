export const AddLabelSchema = {
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
