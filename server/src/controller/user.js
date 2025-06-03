import { Router } from 'express';
import User from '../model/user.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const created = await User.create(req.body);
        res.json(created);
    } catch (err) {
        res.status(500).json({ error: 'Could not save data', details: err.message });
    }
});

export default router;