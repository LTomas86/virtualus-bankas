import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './src/controller/user.js';
import authRouter from './src/controller/auth.js';
import accountRouter from './src/controller/account.js';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';


const app = express();
const PORT = 3000;

// MongoDB prisijungimas
mongoose.connect('mongodb://localhost:27017/nesamone3000', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSRF apsauga
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Endpoint CSRF tokenui gauti
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/uploads', express.static('public/uploads'));

app.listen(PORT, () => {
  console.log(`Serveris veikia http://localhost:${PORT}`);
});
