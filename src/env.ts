export const envSchema = {
  type: 'object',
  required: ['DATABASE_URL'],
  properties: {
    DATABASE_URL: {
      type: 'string',
    },
  },
};
