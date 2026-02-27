import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true,
        },
        category: {
            type: String,
            required: true, // e.g., Farming, Food, Education, Health
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
