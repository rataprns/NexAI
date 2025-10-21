import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('NexAI'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/nexai-dev'),
  JWT_SECRET: z.string().default('your-super-secret-jwt-key'),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_SECURE: z.string().transform(val => val === 'true').optional(),
  FROM_EMAIL: z.string().optional(),
});

// Use `safeParse` to avoid throwing an error if `process.env` is not defined (e.g., in some client-side scenarios)
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    ' Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  // Fallback to default values in case of parsing error on the client side.
  // The server would ideally fail to start.
}

const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});

export const config = {
  appName: env.NEXT_PUBLIC_APP_NAME,
  mongodbUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    secure: env.EMAIL_SECURE,
    from: env.FROM_EMAIL,
  },
};
