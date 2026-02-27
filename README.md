# FinSaathi - Financial Literacy Web App

A comprehensive financial literacy platform designed specifically for marginalized communities to build financial knowledge, manage budgets, and achieve financial independence.

## Project Overview

FinSaathi is a web application tailored to provide accessible financial education and tools to underserved communities. The platform offers educational resources, budgeting tools, and financial literacy guidance in an easy-to-understand format.

## Features

- **Financial Education**: Learn basic to advanced financial concepts
- **Budget Management**: Track income and expenses effectively
- **Financial Planning**: Set and achieve financial goals
- **Community Resources**: Access to financial resources and support
- **User Authentication**: Secure login and account management
- **Personalized Dashboard**: Customized financial insights and recommendations

## Tech Stack

### Frontend

- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) & bcryptjs
- **Utilities**: CORS, dotenv
- **Development**: Nodemon

## Project Structure

```
FinSaathi/
├── backend/           # Express.js API server
│   ├── node_modules/
│   ├── package.json
│   └── index.js
├── frontend/          # React + Vite app
│   ├── node_modules/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:5000` (configure as needed)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default)

## Environment Variables

Create `.env` files in both backend and frontend directories:

### Backend `.env`

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finsaathi
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Run production server

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

We welcome contributions to FinSaathi! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Mission**: Empowering marginalized communities through financial literacy and accessible tools for economic growth.
