import jwt from 'jsonwebtoken';

import User from '../models/User';

import auth from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match' });
        }
        const { id, name, password_hash } = user;
        return res.json(
            {
                id,
                name,
                email,
                password_hash,
            },
            {
                token: jwt.sign({ id }, auth.secret, {
                    expiresIn: auth.expiresIn,
                }),
            }
        );
    }
}
export default new SessionController();