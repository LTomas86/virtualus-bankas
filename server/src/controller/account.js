import express from 'express';
import Account from '../model/account.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// IBAN generatorius (LT)
function generateIban() {
  // LTkk 70770 00000 xxxxxxxx (18 raidžių/skaitmenų)
  // Paprasta generacija: LT + 2 kontroliniai + 5 banko kodas + 11 random skaitmenų
  const bankCode = '70770';
  const random = String(Math.floor(1e10 + Math.random() * 9e10));
  // Kontroliniai skaičiuojami paprastai (čia supaprastinta versija)
  const base = `70770${random}`;
  // Pataisymas: base turi būti BigInt, o '252800' ir 97n taip pat BigInt
  const baseBigInt = BigInt(base + '252800');
  let checksum = 98n - (baseBigInt % 97n);
  let checksumStr = checksum.toString().padStart(2, '0');
  return `LT${checksumStr}${bankCode}${random}`;
}

// Gauti visų sąskaitų sąrašą
router.get('/', auth, async (req, res) => {
  const accounts = await Account.find().sort({ lastName: 1 }).populate('owner', 'name email');
  res.json(accounts);
});

// Sukurti naują sąskaitą
router.post('/', auth, upload.single('passportPhotoFile'), async (req, res) => {
  try {
    const { firstName, lastName, personalId } = req.body;
    // Tikrinti ar nėra tokio asmens kodo
    const exists = await Account.findOne({ personalId });
    if (exists) return res.status(400).json({ message: 'Toks asmens kodas jau egzistuoja' });
    const accountNumber = generateIban();
    let passportPhoto = req.body.passportPhoto;
    if (req.file) {
      passportPhoto = `/uploads/${req.file.filename}`;
    }
    const account = await Account.create({
      owner: req.user.id,
      firstName,
      lastName,
      accountNumber,
      personalId,
      passportPhoto,
      balance: 0
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: 'Klaida kuriant sąskaitą', error: err.message });
  }
});

// Pridėti lėšų
router.patch('/:id/add', auth, async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Neteisinga suma' });
  const account = await Account.findById(req.params.id);
  if (!account) return res.status(404).json({ message: 'Sąskaita nerasta' });
  account.balance += amount;
  await account.save();
  res.json(account);
});

// Ištrinti sąskaitą
router.delete('/:id', auth, async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) return res.status(404).json({ message: 'Sąskaita nerasta' });
  if (account.balance > 0) return res.status(400).json({ message: 'Negalima ištrinti sąskaitos su teigiamu balansu' });
  await account.deleteOne();
  res.json({ message: 'Sąskaita ištrinta' });
});

// Nuskaičiuoti lėšas
router.patch('/:id/withdraw', auth, async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Neteisinga suma' });
  const account = await Account.findById(req.params.id);
  if (!account) return res.status(404).json({ message: 'Sąskaita nerasta' });
  if (account.balance < amount) return res.status(400).json({ message: 'Nepakanka lėšų' });
  account.balance -= amount;
  await account.save();
  res.json(account);
});

export default router;
