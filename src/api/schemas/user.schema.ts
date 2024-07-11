export const RegisterUserSchema = {
  body: {
    type: 'object',
    required: ['name', 'surname', 'email', 'password'],
    properties: {
      name: { type: 'string', minLength: 3 },
      surname: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8, }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        guid: { type: 'string' },
        name: { type: 'string', minLength: 3 },
        surname: { type: 'string', minLength: 3 },
        email: { type: 'string', format: 'email' },
      }
    }
  }
}

export const LoginUserSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8, }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      }
    }
  }
}