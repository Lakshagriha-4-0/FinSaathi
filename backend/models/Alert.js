import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        category: {
            type: String, // e.g., UPI, Banking, Loan Scams
            required: true,
        },
        isLive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
