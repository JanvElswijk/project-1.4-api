const db = require('../util/mysql.db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth.config');

const authController = {
    login: (req, res) => {
        const { emailAddress, password } = req.body;

        const sql = 'SELECT * FROM user WHERE emailAddress = ?';
        const params = [emailAddress];

        db.query(sql, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (rows.length > 0) {
                    if (bcrypt.compareSync(password, rows[0].password)) {
                        res.status(200).json(
                            {
                                token: jwt.sign({ id: rows[0].id, role: rows[0].role }, authConfig.secret),
                                user: {
                                    id: rows[0].id,
                                    firstName: rows[0].firstName,
                                    lastName: rows[0].lastName,
                                    emailAddress: rows[0].emailAddress,
                                    role: rows[0].role,
                                }
                            }
                        );
                    } else {
                        res.status(403).json({ error: "Password doesn't match"});
                    }
                } else {
                    res.status(401).json({ error: 'Invalid username or password' });
                }
            }
        });
    },
    validateToken: (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Invalid token' });
            } else {
                req.userId = decoded.id;
                req.userRole = decoded.role;
                next();
            }
        });
    }
};

module.exports = authController;