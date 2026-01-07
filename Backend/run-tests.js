import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment variables
dotenv.config({ path: join(__dirname, '.env.test') });

console.log('Test environment loaded');
console.log('MongoDB URI:', process.env.MONGO_URI_TEST);
console.log('Starting tests...\n');
