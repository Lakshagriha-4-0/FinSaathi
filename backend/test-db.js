import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const testDb = async () => {
    try {
        const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log('Using DB URI:', dbUri ? 'DEFINED' : 'UNDEFINED');

        if (!dbUri) {
            console.error('ERROR: MONGO_URI is missing from .env');
            process.exit(1);
        }

        await mongoose.connect(dbUri);
        console.log('SUCCESS: Connected to MongoDB');

        // Try to create a dummy user
        const testEmail = `test_${Date.now()}@example.com`;
        const user = await User.create({
            name: 'Test user',
            email: testEmail,
            password: 'password123',
            familyCondition: { incomeBracket: '< 2L', dependents: 1, isRulerArea: true }
        });

        console.log('SUCCESS: User stored in DB:', user._id);

        // Clean up
        await User.findByIdAndDelete(user._id);
        console.log('SUCCESS: Test user cleaned up');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('FAILURE:', error.message);
        process.exit(1);
    }
};

testDb();
