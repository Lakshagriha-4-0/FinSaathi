import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    investmentRequired: { type: String },
    profitMargin: { type: String },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    category: { type: String },
    mentorshipAvailable: { type: Boolean, default: true },
    resources: [String]
}, { timestamps: true });

const Startup = mongoose.model('Startup', startupSchema);
export default Startup;
