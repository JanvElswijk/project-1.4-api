const db = require('../util/mysql.db');

// User table: id (auto-increment), emailAddress, password, dataOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role (Verhhurder or Huurder)

const userController = {
    getAllUsers: (req, res) => {
        db.query('SELECT * FROM users', null, (err, rows) => {
            if (err) {
                console.log("(getAllUsers) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                console.log("(getAllUsers) amount of rows: " + rows.length);
                res.status(200).json({
                    message: 'Successfully fetched all users',
                    data: rows
                });
            }
        });
    },
    createVerhuurder: (req, res) => {
        const { user, preferences } = req.body;

        const queries = [
            {
                sql: "INSERT INTO user (emailAddress, password, dataOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Verhuurder')",
                params: user.emailAddress
            },


        db.executeTransaction([

    },
    createHuurder: (req, res) => {},
    getAllVerhuurders: (req, res) => {},
    getAllHuurders: (req, res) => {},
    getVerhuurderById: (req, res) => {},
    getHuurderById: (req, res) => {},
    updateVerhuurderById: (req, res) => {},
    updateHuurderById: (req, res) => {},
    deleteVerhuurderById: (req, res) => {},
    deleteHuurderById: (req, res) => {}
}

module.exports = userController;