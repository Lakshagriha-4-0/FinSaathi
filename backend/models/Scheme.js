import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        benefit: String,
        eligibility: {
            incomeLimit: Number,
            minDependents: Number,
            isRulerSpecific: {
                type: Boolean,
                default: true,
            },
        },
        officialLink: String,
        language: {
            type: String,
            default: 'en',
        },
    },
    {
        timestamps: true,
    }
);

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
