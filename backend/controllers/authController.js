import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, language, familyCondition } = req.body;
        console.log(`Registration attempt for: ${email}`);

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.warn(`Registration failed: User ${email} already exists`);
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            language,
            familyCondition: {
                incomeBracket: familyCondition?.incomeBracket || '< 2L',
                dependents: Number(familyCondition?.dependents) || 0,
                isRulerArea: familyCondition?.isRulerArea ?? true
            },
        });

        if (user) {
            console.log(`User created successfully: ${user._id}`);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                language: user.language,
                token: generateToken(user._id),
            });
        } else {
            console.error('User creation failed: Unknown reason');
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        console.error('Registration Catch Error:', error.message);
        next(error);
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            console.log(`User logged in: ${user._id}`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                language: user.language,
                token: generateToken(user._id),
            });
        } else {
            console.warn(`Login failed for: ${email}`);
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        console.error('Login Catch Error:', error.message);
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.language = req.body.language || user.language;
            if (req.body.familyCondition) {
                user.familyCondition = {
                    ...user.familyCondition,
                    ...req.body.familyCondition
                };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                language: updatedUser.language,
                familyCondition: updatedUser.familyCondition,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Update Profile Error:', error.message);
        next(error);
    }
};
