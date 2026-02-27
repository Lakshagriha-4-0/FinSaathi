import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Loan from './models/Loan.js';

dotenv.config();

const checkLoans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const loans = await Loan.find({});
        console.log(`Found ${loans.length} loans`);
        console.log(JSON.stringify(loans, null, 2));
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkLoans();
