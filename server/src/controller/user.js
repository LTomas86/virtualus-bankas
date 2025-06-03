import { Router } from 'express';
import User from '../model/user.js';

// Routerio iniciavimas būtinas norint išskaidyti kelius į atskirus failus
const router = Router();

router.post('/', async (req, res) => {
    try {
        const created = await User.create(req.body);
        res.json(created);
    } catch (err) {
        res.status(500).json({ error: 'Could not save data', details: err.message });
    }
});

// ...add more user routes here as needed...

export default router;