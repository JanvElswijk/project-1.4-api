const db = require('../util/mysql.db');
const dateConverter = require('../util/converter').dateConverter;
const validation = require('../util/validation');
const bcrypt = require('bcrypt');

// User table: id (auto-increment), emailAddress, password, dataOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role (Verhhurder or Huurder)
// Seeker preferences table: id, userId, seekingCity, liveWith, budget, period, nights, pet, ownPet, ownPetDescription, starDate endDate, reason, schoolFinished, schoolDoing, skill, work, workDescription, healthRisk, healthRiskDescription, selfDescription, selfWords, idealSpace, offer, offerYou, importantNote, volunteer, volunteerDescription, religion, comment,	overallcomment
// Provider prefernces table: id, userId, situation, house, found, motivation, housePicture, period, nights, roomType, roomSize, furniture, furnitureDescription, price, offer, importantNote, volunteer, volunteerDescription, work, workDescription, describe, hobby, pet, petDescription, religion, comment, overallcomment

// Provider sql

// CREATE TABLE `provider_preferences` (
//     `id` int(11) NOT NULL,
//     `userId` int(11) NOT NULL,
//     `situation` enum('Alleenstaand','Met partner','Met huisgenoot','Met kinderen','Anders') NOT NULL,
//     `house` tinyint(1) NOT NULL,
//     `found` text NOT NULL,
//     `motivation` text NOT NULL,
//     `housePicture` longblob DEFAULT NULL,
//     `period` enum('1','2','3','4','5','6','7','8','9','10','11') NOT NULL,
//     `nights` enum('1','2','3','4','5','6','7') NOT NULL,
//     `roomType` text NOT NULL,
//     `roomSize` int(11) NOT NULL,
//     `furniture` tinyint(1) NOT NULL,
//     `furnitureDescription` text DEFAULT NULL,
//     `price` int(11) NOT NULL,
//     `offer` text NOT NULL,
//     `importantNote` text NOT NULL,
//     `volunteer` tinyint(1) NOT NULL,
//     `volunteerDescription` text DEFAULT NULL,
//     `work` tinyint(1) NOT NULL,
//     `workDescription` text DEFAULT NULL,
//     `describe` text NOT NULL,
//     `hobby` text NOT NULL,
//     `pet` tinyint(1) NOT NULL,
//     `petDescription` text DEFAULT NULL,
//     `religion` text DEFAULT NULL,
//     `comment` text DEFAULT NULL,
//     `overallcomment` text DEFAULT NULL
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// Seeker sql

// CREATE TABLE `seeker_preferences` (
//     `id` int(11) NOT NULL,
//     `userId` int(11) NOT NULL,
//     `seekingCity` varchar(255) NOT NULL,
//     `liveWith` enum('M','V','K') DEFAULT NULL,
//     `budget` int(11) NOT NULL,
//     `period` enum('1','2','3','4','5','6','7','8','9','10','11') NOT NULL,
//     `nights` enum('1','2','3','4','5','6','7') NOT NULL,
//     `pet` tinyint(1) NOT NULL,
//     `ownPet` tinyint(1) NOT NULL,
//     `ownPetDescription` text DEFAULT NULL,
//     `starDate` date NOT NULL,
//     `endDate` date NOT NULL,
//     `reason` enum('Studie','Starter','Scheiding','Anders') NOT NULL,
//     `schoolFinished` text DEFAULT NULL,
//     `schoolDoing` text DEFAULT NULL,
//     `skill` set('EHBO','BHV','Reanimatie') DEFAULT NULL,
//     `work` tinyint(1) NOT NULL,
//     `workDescription` text DEFAULT NULL,
//     `healthRisk` tinyint(1) NOT NULL,
//     `healthRiskDescription` text DEFAULT NULL,
//     `selfDescription` text NOT NULL,
//     `selfWords` text NOT NULL,
//     `idealSpace` text NOT NULL,
//     `offer` text NOT NULL,
//     `offerYou` text NOT NULL,
//     `importantNote` text NOT NULL,
//     `volunteer` tinyint(1) NOT NULL,
//     `volunteerDescription` text DEFAULT NULL,
//     `religion` text DEFAULT NULL,
//     `comment` text DEFAULT NULL,
//     `overallcomment` text DEFAULT NULL
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



const userController = {
    getAllUsers: (req, res) => {
        db.query('SELECT * FROM user', null, (err, rows) => {
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
    getProfile: (req, res) => {
        db.query('SELECT * FROM user WHERE id = ?', [req.userId], (err, rows) => {
            if (err) {
                console.log("(getProfile) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                if (rows.length > 0) {
                    if (rows[0].role === 'Huurder') {
                        db.query('SELECT * FROM seeker_preferences WHERE userId = ?', [req.userId], (err, rows2) => {
                            if (err) {
                                console.log("(getProfile) error: " + err);
                                res.status(500).json({
                                    message: 'Something went wrong',
                                    error: err
                                });
                            } else {
                                console.log("(getProfile) amount of rows: " + rows.length);
                                res.status(200).json({
                                    message: 'Successfully fetched profile',
                                    user: rows[0],
                                    preferences: rows2[0]
                                });
                            }
                        });
                    } else if (rows[0].role === 'Verhuurder') {
                        db.query('SELECT * FROM verhuurder_preferences WHERE userId = ?', [req.userId], (err, rows2) => {
                            if (err) {
                                console.log("(getProfile) error: " + err);
                                res.status(500).json({
                                    message: 'Something went wrong',
                                    error: err
                                });
                            } else {
                                console.log("(getProfile) amount of rows: " + rows.length);
                                res.status(200).json({
                                    message: 'Successfully fetched profile',
                                    user: rows[0],
                                    preferences: rows2[0]
                                });
                            }
                        });
                    }
                } else {
                    res.status(404).json({
                        message: 'User not found'
                    });
                }
            }
        });
    },
    createVerhuurder: (req, res) => {
        const { user, preferences } = req.body;
        user.dateOfBirth = dateConverter(user.dateOfBirth)
        preferences.startDate = dateConverter(preferences.startDate)
        preferences.endDate = dateConverter(preferences.endDate)

        user.password = bcrypt.hashSync(user.password, 10);

        validation.validateUserInput(user, (err) => {
            if (err) {
                res.status(400).json({
                    message: 'Invalid user input',
                    error: err
                });
            }
        });

        validation.validateHuurderPreferencesInput(preferences, (err) => {
            if (err) {
                res.status(400).json({
                    message: 'Invalid preferences input',
                    error: err
                });
            }
        });


        const queries = [
            {
                sql: "INSERT INTO user (emailAddress, password, dateOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Verhuurder')",
                params: [user.emailAddress, user.password, user.dateOfBirth, user.firstName, user.middleName, user.lastName, user.picture, user.gender, user.phoneNumber, user.postalCode, user.street, user.houseNumber, user.city, user.country]
            },
            {
                sql: "INSERT INTO verhuurder_preferences (userId, seekingCity, liveWith, budget, period, nights, pet, ownPet, ownPetDescription, starDate, endDate, reason, schoolFinished, schoolDoing, skill, work, workDescription, healthRisk, healthRiskDescription, selfDescription, selfWords, idealSpace, offer, offerYou, importantNote, volunteer, volunteerDescription, religion, comment, overallcomment) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                params: [preferences.seekingCity, preferences.liveWith, preferences.budget, preferences.period, preferences.nights, preferences.pet, preferences.ownPet, preferences.ownPetDescription, preferences.starDate, preferences.endDate, preferences.reason, preferences.schoolFinished, preferences.schoolDoing, preferences.skill, preferences.work, preferences.workDescription, preferences.healthRisk, preferences.healthRiskDescription, preferences.selfDescription, preferences.selfWords, preferences.idealSpace, preferences.offer, preferences.offerYou, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription, preferences.religion, preferences.comment, preferences.overallcomment]
            }
        ];

        db.executeTransaction(queries, (err, result) => {
            if (err) {
                console.log("(createVerhuurder) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                console.log("(createVerhuurder) result: " + result);
                res.status(200).json({
                    message: 'Successfully created verhuurder',
                    data: result
                });
            }
        });
    },
    createHuurder: (req, res) => {
        const { user, preferences } = req.body;
        user.dateOfBirth = dateConverter(user.dateOfBirth)
        preferences.startDate = dateConverter(preferences.startDate)
        preferences.endDate = dateConverter(preferences.endDate)

        user.password = bcrypt.hashSync(user.password, 10);

        validation.validateUserInput(user, (err) => {
            if (err) {
                res.status(400).json({
                    message: 'Invalid user input',
                    error: err
                });
            }
        });

        validation.validateHuurderPreferencesInput(preferences, (err) => {
            if (err) {
                res.status(400).json({
                    message: 'Invalid preferences input',
                    error: err
                });
            }
        });

        const queries = [
            {
                sql: "INSERT INTO user (emailAddress, password, dateOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Verhuurder')",
                params: [user.emailAddress, user.password, user.dateOfBirth, user.firstName, user.middleName, user.lastName, user.picture, user.gender, user.phoneNumber, user.postalCode, user.street, user.houseNumber, user.city, user.country]
            },
            {
                sql: "INSERT INTO huurder_preferences (userId, seekingCity, liveWith, budget, period, nights, pet, ownPet, ownPetDescription, starDate, endDate, reason, schoolFinished, schoolDoing, skill, work, workDescription, healthRisk, healthRiskDescription, selfDescription, selfWords, idealSpace, offer, offerYou, importantNote, volunteer, volunteerDescription, religion, comment, overallcomment) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                params: [preferences.seekingCity, preferences.liveWith, preferences.budget, preferences.period, preferences.nights, preferences.pet, preferences.ownPet, preferences.ownPetDescription, preferences.starDate, preferences.endDate, preferences.reason, preferences.schoolFinished, preferences.schoolDoing, preferences.skill, preferences.work, preferences.workDescription, preferences.healthRisk, preferences.healthRiskDescription, preferences.selfDescription, preferences.selfWords, preferences.idealSpace, preferences.offer, preferences.offerYou, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription, preferences.religion, preferences.comment, preferences.overallcomment]
            }
        ];

        db.executeTransaction(queries, (err, result) => {
            if (err) {
                console.log("(createHuurder) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                console.log("(createHuurder) result: " + result);
                res.status(200).json({
                    message: 'Successfully created huurder',
                    data: result
                });
            }
        });
    },
    getAllVerhuurders: (req, res) => {
        const sql = "SELECT * FROM user WHERE role = 'Verhuurder'";
        db.query(sql, (err, result) => {
            if (err) {
                console.log("(getAllVerhuurders) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                console.log("(getAllVerhuurders) result: " + result);
                res.status(200).json({
                    message: 'Successfully retrieved all verhuurders',
                    data: result
                });
            }
        });
    },
    getAllHuurders: (req, res) => {
        const sql = "SELECT * FROM user WHERE role = 'Huurder'";
        db.query(sql, (err, result) => {
            if (err) {
                console.log("(getAllHuurders) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                console.log("(getAllHuurders) result: " + result);
                res.status(200).json({
                    message: 'Successfully retrieved all huurders',
                    data: result
                });
            }
        });
    },
    getVerhuurderMatches: (req, res) => {
        //TODO: Make matches
        const id = req.userId
        res.status(200).json({
            message: 'NYI: getVerhuurderMatches',
        });
    },
    getHuurderMatches: (req, res) => {
        //TODO: Make matches
        const id = req.userId
        res.status(200).json({
            message: 'NYI: getHuurderMatches',
        });
    },
    getUserById: (req, res) => {
        db.query("SELECT * FROM user WHERE id = ?", [req.userId], (err, userResult) => {
            if (err) {
                console.log("(getUserById) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                if (userResult.length === 0) {
                    res.status(404).json({
                        message: 'User not found',
                    });
                } else if (userResult[0].role === 'Verhuurder') {
                    db.query("SELECT * FROM provider_preferences WHERE userId = ?", [req.userId], (err, preferencesResult) => {
                        if (err) {
                            console.log("(getUserById) error: " + err);
                            res.status(500).json({
                                message: 'Something went wrong',
                                error: err
                            });
                        } else {
                            console.log("(getUserById) result: " + userResult);
                            res.status(200).json({
                                message: 'Successfully retrieved user',
                                data: {
                                    user: userResult,
                                    preferences: preferencesResult
                                }
                            });
                        }
                    });
                } else if (userResult[0].role === 'Huurder') {
                    db.query("SELECT * FROM seeker_preferences WHERE userId = ?", [req.userId], (err, preferencesResult) => {
                        if (err) {
                            console.log("(getUserById) error: " + err);
                            res.status(500).json({
                                message: 'Something went wrong',
                                error: err
                            });
                        } else {
                            console.log("(getUserById) result: " + userResult);
                            res.status(200).json({
                                message: 'Successfully retrieved user',
                                data: {
                                    user: userResult,
                                    preferences: preferencesResult
                                }
                            });
                        }
                    });
                } else {
                    console.log(userResult[0].role)
                    res.status(400).json({
                        message: 'Invalid role'
                    });
                }
            }
        });
    },
    updateUser: (req, res) => {
        const {user, preferences} = req.body;
        if (req.role === 'Verhuurder') {
            const sql = "UPDATE user SET email = ?, password = ?, firstName = ?, lastName = ?, phoneNumber = ?, address = ?, city = ?, postalCode = ?, country = ? WHERE id = ?";
            db.query(sql, [user.email, user.password, user.firstName, user.lastName, user.phoneNumber, user.address, user.city, user.postalCode, user.country, req.userId], (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: 'Something went wrong',
                        error: err
                    });
                } else {
                    // Provider prefernces table: id, userId, situation, house, found, motivation, housePicture, period, nights, roomType, roomSize, furniture, furnitureDescription, price, offer, importantNote, volunteer, volunteerDescription, work, workDescription, describe, hobby, pet, petDescription, religion, comment, overallcomment
                    const sql2 = "UPDATE provider_preferences SET situation = ?, house = ?, found = ?, motivation = ?, housePicture = ?, period = ?, nights = ?, roomType = ?, roomSize = ?, furniture = ?, furnitureDescription = ?, price = ?, offer = ?, importantNote = ?, volunteer = ?, volunteerDescription = ?, work = ?, workDescription = ?, describe = ?, hobby = ?, pet = ?, petDescription = ?, religion = ?, comment = ?, overallcomment = ? WHERE userId = ?";
                    db.query(sql2, [preferences.situation, preferences.house, preferences.found, preferences.motivation, preferences.housePicture, preferences.period, preferences.nights, preferences.roomType, preferences.roomSize, preferences.furniture, preferences.furnitureDescription, preferences.price, preferences.offer, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription, preferences.work, preferences.workDescription, preferences.describe, preferences.hobby, preferences.pet, preferences.petDescription, preferences.religion, preferences.comment, preferences.overallcomment, req.userId], (err, result) => {
                        if (err) {
                            res.status(500).json({
                                message: 'Something went wrong',
                                error: err
                            });
                        } else {
                            res.status(200).json({
                                message: 'Successfully updated user',
                                data: result
                            });
                        }
                    });
                }
            });
        } else if (req.role === 'Huurder') {
            const sql = "UPDATE user SET email = ?, password = ?, firstName = ?, lastName = ?, phoneNumber = ?, address = ?, city = ?, postalCode = ?, country = ? WHERE id = ?";
            db.query(sql, [user.email, user.password, user.firstName, user.lastName, user.phoneNumber, user.address, user.city, user.postalCode, user.country, req.userId], (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: 'Something went wrong',
                        error: err
                    });
                } else {
                    // Seeker preferences table: id, userId, seekingCity, liveWith, budget, period, nights, pet, ownPet, ownPetDescription, starDate endDate, reason, schoolFinished, schoolDoing, skill, work, workDescription, healthRisk, healthRiskDescription, selfDescription, selfWords, idealSpace, offer, offerYou, importantNote, volunteer, volunteerDescription, religion, comment,	overallcomment
                    const sql2 = "UPDATE seeker_preferences SET seekingCity = ?, liveWith = ?, budget = ?, period = ?, nights = ?, pet = ?, ownPet = ?, ownPetDescription = ?, starDate = ?, endDate = ?, reason = ?, schoolFinished = ?, schoolDoing = ?, skill = ?, work = ?, workDescription = ?, healthRisk = ?, healthRiskDescription = ?, selfDescription = ?, selfWords = ?, idealSpace = ?, offer = ?, offerYou = ?, importantNote = ?, volunteer = ?, volunteerDescription = ?, religion = ?, comment = ?, overallcomment = ? WHERE userId = ?";
                    db.query(sql2, [preferences.seekingCity, preferences.liveWith, preferences.budget, preferences.period, preferences.nights, preferences.pet, preferences.ownPet, preferences.ownPetDescription, preferences.starDate, preferences.endDate, preferences.reason, preferences.schoolFinished, preferences.schoolDoing, preferences.skill, preferences.work, preferences.workDescription, preferences.healthRisk, preferences.healthRiskDescription, preferences.selfDescription, preferences.selfWords, preferences.idealSpace, preferences.offer, preferences.offerYou, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription, preferences.religion, preferences.comment, preferences.overallcomment, req.userId], (err, result) => {
                        if (err) {
                            res.status(500).json({
                                message: 'Something went wrong',
                                error: err
                            });
                        } else {
                            res.status(200).json({
                                message: 'Successfully updated user',
                                data: result
                            });
                        }
                    });
                }
            });
        } else {
            res.status(400).json({
                message: 'Invalid role'
            });
        }
    },
    deleteUser: (req, res) => {
        const sql = "DELETE FROM user WHERE id = ?";
        db.query(sql, [req.userId], (err, result) => {
            if (err) {
                console.log("(deleteUser) error: " + err);
                res.status(500).json({
                    message: 'Something went wrong',
                    error: err
                });
            } else {
                console.log("(deleteUser) result: " + result);
                res.status(200).json({
                    message: 'Successfully deleted user',
                    data: result
                });
            }
        });
    },
}

module.exports = userController;