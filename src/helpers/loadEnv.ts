import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const ENV = process.env.NODE_ENV || 'development';
const envFile = path.resolve(process.cwd(), `.env.${ENV}`);

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

