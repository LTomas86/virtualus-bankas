import mongoose from 'mongoose';

function validatePersonalId(id) {
  // LT asmens kodas: 11 skaitmenų, pirmas 1-6, likę skaitmenys
  return /^[1-6]\d{10}$/.test(id);
}

const accountSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  personalId: {
    type: String,
    required: true,
    unique: true,
    validate: [validatePersonalId, 'Neteisingas asmens kodas']
  },
  passportPhoto: { type: String }, // URL or base64
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);
