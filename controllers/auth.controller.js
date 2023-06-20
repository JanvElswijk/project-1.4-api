const db = require('../util/mysql.db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth.config');

const authController = {
    login: (req, res) => {
        const { emailAddress, password } = req.body;
        // console.log(req.body)

        const sql = 'SELECT * FROM user WHERE emailAddress = ?';
        const params = [emailAddress];

        db.query(sql, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err });
            } else {
                if (rows.length > 0 && rows[0].isActive === 1) {
                    if (bcrypt.compareSync(password, rows[0].password)) {
                        // console.log("password match" + rows[0].id)
                        // console.log(password)
                        return res.status(200).json(
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
                        return res.status(403).json({ error: "Password doesn't match"});
                    }
                } else if (rows.length > 0 && rows[0].isActive === 0) {
                    return res.status(403).json({ error: 'Email not verified' });
                } else {
                    return res.status(401).json({ error: 'Invalid username or password' });
                }
            }
        });
    },
    validateToken: (req, res, next) => {
        // console.log("validate token");
        // console.log(req.headers.authorization);
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            // console.log("no token")
            return res.status(401).json({ error: 'No token provided' });
        } else {
            jwt.verify(token, authConfig.secret, (err, decoded) => {
                if (err) {
                    // console.log("invalid token")
                    return res.status(401).json({error: 'Invalid token'});
                } else {
                    // console.log("valid token")
                    req.userId = decoded.id;
                    req.userRole = decoded.role;
                    next();
                }
            });
        }
    },
    verifyEmail: (req, res) => {
        const encodedEmail = req.params.encodedEmail;
        const decodedEmail = Buffer.from(encodedEmail, 'base64').toString('ascii');

        const sql = 'UPDATE user SET isActive = 1 WHERE emailAddress = ?';
        const params = [decodedEmail];

        db.query(sql, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err });
            } else {
                if (rows.affectedRows > 0) {
                    return res.status(200).json({ message: 'Email verified' });
                } else {
                    return res.status(404).json({ error: 'Email not found' });
                }
            }
        });
    }
};

module.exports = authController;