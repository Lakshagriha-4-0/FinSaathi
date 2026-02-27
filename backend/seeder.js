import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Scheme from './models/Scheme.js';
import Alert from './models/Alert.js';
import Loan from './models/Loan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from the backend root
dotenv.config({ path: path.resolve(__dirname, '.env') });

const schemes = [
    {
        title: 'PM-Kisan Samman Nidhi',
        description: 'Direct income support of ₹6,000 per year to all landholding farmer families.',
        benefit: '₹6,000/year in 3 installments',
        eligibility: {
            incomeLimit: 200000,
            minDependents: 0,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmkisan.gov.in/',
        language: 'en'
    },
    {
        title: 'PM Awas Yojana (Gramin)',
        description: 'Financial assistance for construction of pucca house to all houseless householders.',
        benefit: '₹1.20 Lakh in plains, ₹1.30 Lakh in hilly areas',
        eligibility: {
            incomeLimit: 300000,
            minDependents: 1,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmayg.nic.in/',
        language: 'en'
    },
    // Hindi
    {
        title: 'पीएम-किसान सम्मान निधि',
        description: 'सभी भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
        benefit: '₹6,000/वर्ष 3 किस्तों में',
        eligibility: {
            incomeLimit: 200000,
            minDependents: 0,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmkisan.gov.in/',
        language: 'hi'
    },
    {
        title: 'पीएम आवास योजना (ग्रामीण)',
        description: 'सभी बेघर गृहस्वामियों को पक्का घर बनाने के लिए वित्तीय सहायता।',
        benefit: 'मैदानी इलाकों में ₹1.20 लाख, पहाड़ी क्षेत्रों में ₹1.30 लाख',
        eligibility: {
            incomeLimit: 300000,
            minDependents: 1,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmayg.nic.in/',
        language: 'hi'
    },
    // Marathi
    {
        title: 'पीएम-किसान सन्मान निधी',
        description: 'सर्व जमीनधारक शेतकरी कुटुंबांना दरवर्षी ₹६,००० थेट उत्पन्न सहाय्य.',
        benefit: '₹६,०००/वर्ष ३ हप्त्यांमध्ये',
        eligibility: {
            incomeLimit: 200000,
            minDependents: 0,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmkisan.gov.in/',
        language: 'mr'
    },
    {
        title: 'पीएम आवास योजना (ग्रामीण)',
        description: 'सर्व बेघर घरमालकांना पक्के घर बांधण्यासाठी आर्थिक मदत.',
        benefit: 'मैदानी भागात ₹१.२० लाख, डोंगराळ भागात ₹१.३० लाख',
        eligibility: {
            incomeLimit: 300000,
            minDependents: 1,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmayg.nic.in/',
        language: 'mr'
    },
    // Tamil
    {
        title: 'பிஎம்-கிசான் சம்மான் நிதி',
        description: 'அனைத்து நிலம் வைத்திருக்கும் விவசாய குடும்பங்களுக்கும் ஆண்டுக்கு ₹6,000 நேரடி வருமான உதவி.',
        benefit: '3 தவணைகளில் ₹6,000/ஆண்டு',
        eligibility: {
            incomeLimit: 200000,
            minDependents: 0,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmkisan.gov.in/',
        language: 'ta'
    },
    {
        title: 'பிஎம் ஆவாஸ் யோஜனா (கிராமின்)',
        description: 'வீடற்ற அனைத்து வீட்டு உரிமையாளர்களுக்கும் பக்கா வீடு கட்டுவதற்கு நிதி உதவி.',
        benefit: 'சமவெளிகளில் ₹1.20 லட்சம், மலைப்பகுதிகளில் ₹1.30 லட்சம்',
        eligibility: {
            incomeLimit: 300000,
            minDependents: 1,
            isRulerSpecific: true,
        },
        officialLink: 'https://pmayg.nic.in/',
        language: 'ta'
    }
];

const alerts = [
    {
        title: 'Fake Loan Approval SMS',
        description: 'Scammers sending SMS claiming your loan of ₹5 Lakh is approved. Clicking the link installs malware or asks for processing fees.',
        severity: 'high',
        category: 'Loan Scams'
    },
    {
        title: 'UPI "Money Received" Fraud',
        description: 'Fraudsters send a "Pay" request disguised as a "Receive" button. They will ask you to enter PIN to "receive" money.',
        severity: 'critical',
        category: 'UPI'
    }
];

const loans = [
    {
        title: 'Kisan Credit Card (KCC)',
        provider: 'State Bank of India',
        description: 'Need based credit for crop production, post-harvest and consumption requirements.',
        interestRate: 7,
        maxAmount: 300000,
        term: '1-5 years',
        category: 'Crop',
        benefits: ['No collateral for loans up to 1.6L', 'Low interest', 'Flexible repayment'],
        language: 'en'
    },
    {
        title: 'Gold Loan for Farmers',
        provider: 'Gramin Bank',
        description: 'Immediate liquidity against gold ornaments for agricultural needs.',
        interestRate: 8.5,
        maxAmount: 500000,
        term: '12 months',
        category: 'Gold',
        benefits: ['Instant approval', 'Minimal documentation'],
        language: 'en'
    },
    {
        title: 'SHG Mahila Loan',
        provider: 'NRLM',
        description: 'Loans for Self Help Groups to start small businesses in rural areas.',
        interestRate: 11,
        maxAmount: 100000,
        term: '2-3 years',
        category: 'SHG',
        benefits: ['Group guarantee', 'Skill training included'],
        language: 'en'
    },
    // Hindi
    {
        title: 'किसान क्रेडिट कार्ड (KCC)',
        provider: 'भारतीय स्टेट बैंक',
        description: 'फसल उत्पादन, फसल कटाई के बाद और उपभोग की आवश्यकताओं के लिए आवश्यकता आधारित ऋण।',
        interestRate: 7,
        maxAmount: 300000,
        term: '1-5 वर्ष',
        category: 'Crop',
        benefits: ['1.6 लाख तक के ऋण के लिए कोई संपार्श्विक नहीं', 'कम ब्याज', 'लचीला पुनर्भुगतान'],
        language: 'hi'
    },
    {
        title: 'महिलाओं के लिए स्वयं सहायता समूह (SHG) ऋण',
        provider: 'एनआरएलएम',
        description: 'ग्रामीण क्षेत्रों में छोटे व्यवसाय शुरू करने के लिए स्वयं सहायता समूहों के लिए ऋण।',
        interestRate: 11,
        maxAmount: 100000,
        term: '2-3 वर्ष',
        category: 'SHG',
        benefits: ['समूह गारंटी', 'कोशल प्रशिक्षण शामिल'],
        language: 'hi'
    },
    // Marathi
    {
        title: 'किसान क्रेडिट कार्ड (KCC)',
        provider: 'स्टेट बँक ऑफ इंडिया',
        description: 'पीक उत्पादन, कापणीनंतरच्या आणि उपभोग्य गरजांसाठी कर्ज.',
        interestRate: 7,
        maxAmount: 300000,
        term: '1-5 वर्षे',
        category: 'Crop',
        benefits: ['1.6 लाख पर्यंतच्या कर्जासाठी तारण नाही', 'कमी व्याज', 'लवचिक परतफेड'],
        language: 'mr'
    },
    // Tamil
    {
        title: 'கிசான் கிரெடிட் கார்டு (KCC)',
        provider: 'பாரத ஸ்டேட் வங்கி',
        description: 'பயிர் உற்பத்தி, அறுவடைக்கு பிந்தைய மற்றும் நுகர்வு தேவைகளுக்கான கடன்.',
        interestRate: 7,
        maxAmount: 300000,
        term: '1-5 ஆண்டுகள்',
        category: 'Crop',
        benefits: ['1.6 லட்சம் வரையிலான கடன்களுக்கு பிணை தேவையில்லை', 'குறைந்த வட்டி', 'நெகிழ்வான திருப்பிச் செலுத்துதல்'],
        language: 'ta'
    }
];

const seedData = async () => {
    try {
        const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!dbUri) {
            throw new Error('MONGO_URI is not defined in .env file');
        }
        await mongoose.connect(dbUri);

        await Scheme.deleteMany();
        await Alert.deleteMany();
        await Loan.deleteMany();

        await Scheme.insertMany(schemes);
        await Alert.insertMany(alerts);
        await Loan.insertMany(loans);

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
