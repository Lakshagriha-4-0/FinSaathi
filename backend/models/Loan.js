import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        provider: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        interestRate: {
            type: Number,
            required: true,
        },
        maxAmount: Number,
        term: String,
        category: {
            type: String,
            enum: ['Crop', 'Gold', 'SHG', 'Personal', 'Home', 'Education'],
            required: true,
        },
        benefits: [String],
        language: {
            type: String,
            default: 'en',
        },
    },
    {
        timestamps: true,
    }
);

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;
