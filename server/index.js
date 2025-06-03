import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './src/controller/user.js';
import authRouter from './src/controller/auth.js';
import accountRouter from './src/controller/account.js';


const app = express();
const PORT = 3000;

// MongoDB prisijungimas
mongoose.connect('mongodb://localhost:27017/nesamone3000', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Labas iš nodemon + import!');
});

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/uploads', express.static('public/uploads'));

app.listen(PORT, () => {
  console.log(`Serveris veikia http://localhost:${PORT}`);
});
