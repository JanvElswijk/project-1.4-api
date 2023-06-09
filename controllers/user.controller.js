const db = require('../util/mysql.db');
const dateConverter = require('../util/converter').dateConverter;
const validation = require('../util/validation');
const bcrypt = require('bcrypt');

const handleError = (err, res) => {
    console.log(err);
    res.status(500).json({
        message: 'Something went wrong',
        error: err
    });
};

const validateInput = (user, preferences, role, res) => {
    validation.validateUserInput(user, (err) => {
        if (err) {
            return res.status(400).json({
                message: 'Invalid user input',
                error: err
            });
        }
    });

    if (role === 'Huurder') {
        validation.validateHuurderPreferencesInput(preferences, (err) => {
            if (err) {
                return res.status(400).json({
                    message: 'Invalid preferences input',
                    error: err
                });
            }
        });
    } else if (role === 'Verhuurder') {
        validation.validateVerhuurderPreferencesInput(preferences, (err) => {
            if (err) {
                return res.status(400).json({
                    message: 'Invalid preferences input',
                    error: err
                });
            }
        });
    } else {
        return res.status(400).json({
            message: 'Invalid role'
        });
    }
};

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
        db.query('SELECT * FROM user', [], (err, rows) => {
            if (err) {
                return handleError(err, res);
            }

            res.status(200).json({
                message: 'Successfully fetched all users',
                data: rows
            });
        });
    },
    getProfile: (req, res) => {
        db.query('SELECT * FROM user WHERE id = ?', [req.userId], (err, rows) => {
            if (err) {
                return handleError(err, res);
            } else {
                if (rows.length > 0) {
                    if (rows[0].role === 'Huurder') {
                        db.query('SELECT * FROM seeker_preferences WHERE userId = ?', [req.userId], (err, rows2) => {
                            if (err) {
                                return handleError(err, res);
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
                                return handleError(err, res);
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


        preferences.house = preferences.house === 'Nee' ? 0 : 1;
        preferences.furniture = preferences.furniture === 'Nee' ? 0 : 1;
        preferences.volunteer = preferences.volunteer === 'Nee' ? 0 : 1;
        preferences.work = preferences.work === 'Nee' ? 0 : 1;
        preferences.pet = preferences.pet === 'Nee' ? 0 : 1;

        user.dateOfBirth = dateConverter(user.dateOfBirth)

        user.password = bcrypt.hashSync(user.password, 10);

        validateInput(user, preferences, "Verhuurder", res);

        const queries = [
            {
                sql: "INSERT INTO `user` (emailAddress, password, dateOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Huurder')",
                params: [user.emailAddress, user.password, user.dateOfBirth, user.firstName, user.middleName, user.lastName, user.picture, user.gender, user.phoneNumber, user.postalCode, user.street, user.houseNumber, user.city, user.country]
            },
            {
                sql: "INSERT INTO `provider_preferences` (situation, house, found, motivation, housePicture, period, nights, roomType, roomSize, furniture, furnitureDescription, price, offer, importantNote, volunteer, volunteerDescription, work, workDescription, `describe`, hobby, pet, petDescription, religion, comment, overallcomment, role) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'Verhuurder')",
                params: [preferences.situation, preferences.house, preferences.found, preferences.motivation, preferences.housePicture, preferences.period, preferences.nights, preferences.roomType, preferences.roomSize, preferences.furniture, preferences.furnitureDescription, preferences.price, preferences.offer, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription, preferences.work, preferences.workDescription, preferences.describe, preferences.hobby, preferences.pet, preferences.petDescription, preferences.religion, preferences.comment, preferences.overallcomment]
            }
        ];

        db.executeTransaction(queries, (err, result) => {
            if (err) {
                return handleError(err, res);
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
        console.log(req.body)
        console.log(user.emailAddress)
        user.dateOfBirth = dateConverter(user.dateOfBirth)
        // --STAR--DATE
        console.log(preferences.starDate)
        // --STAR--DATE
        console.log(dateConverter(preferences.starDate))
        // --STAR--DATE
        preferences.starDate = dateConverter(preferences.starDate)
        console.log(preferences.endDate)
        console.log(dateConverter(preferences.endDate))
        preferences.endDate = dateConverter(preferences.endDate)

        preferences.pet = preferences.pet === 'Nee' ? 0 : 1;
        preferences.ownPet = preferences.ownPet === 'Nee' ? 0 : 1;
        preferences.work = preferences.work === 'Nee' ? 0 : 1;
        preferences.healthRisk = preferences.healthRisk === 'Nee' ? 0 : 1;
        preferences.volunteer = preferences.volunteer === 'Nee' ? 0 : 1;


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
                sql: "INSERT INTO `user` (emailAddress, password, dateOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Huurder')",
                params: [user.emailAddress, user.password, user.dateOfBirth, user.firstName, user.middleName, user.lastName, user.picture, user.gender, user.phoneNumber, user.postalCode, user.street, user.houseNumber, user.city, user.country]
            },
            {// --STAR--DATE// --STAR--DATE// --STAR--DATE// --STAR--DATE// --STAR--DATE
                sql: "INSERT INTO `seeker_preferences` (userId, seekingCity, liveWith, budget, period, nights, pet, ownPet, ownPetDescription, starDate, endDate, reason, schoolFinished, schoolDoing, skill, work, workDescription, healthRisk, healthRiskDescription, selfDescription, selfWords, idealSpace, offer, offerYou, importantNote, volunteer, volunteerDescription, religion, comment, overallcomment) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                params: [preferences.seekingCity, preferences.liveWith, preferences.budget, preferences.period, preferences.nights, preferences.pet, preferences.ownPet, preferences.ownPetDescription, preferences.starDate, preferences.endDate, preferences.reason, preferences.schoolFinished, preferences.schoolDoing, preferences.skill, preferences.work, preferences.workDescription, preferences.healthRisk, preferences.healthRiskDescription, preferences.selfDescription, preferences.selfWords, preferences.idealSpace, preferences.offer, preferences.offerYou, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription, preferences.religion, preferences.comment, preferences.overallcomment]
            }
        ];

        db.executeTransaction(queries, (err, result) => {
            if (err) {
                return handleError(err, res);
            } else {
                console.log("(createHuurder) result length: " + result.length);
                res.status(200).json({
                    message: 'Successfully created huurder',
                    data: result
                });
            }
        });
    },
    getAllVerhuurders: (req, res) => {
        const sql = "SELECT * FROM `user` WHERE role = 'Verhuurder'";
        db.query(sql, (err, result) => {
            if (err) {
                return handleError(err, res);
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
                return handleError(err, res);
            } else {
                console.log("(getAllHuurders) result length: " + result.length);
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
        db.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, userResult) => {
            if (err) {
                return handleError(err, res);
            }

            if (userResult.length === 0) {
                return res.status(404).json({
                    message: 'User not found',
                });
            }

            switch (userResult[0].role) {
                case 'Verhuurder':
                    db.query("SELECT * FROM provider_preferences WHERE userId = ?", [req.params.id], (err, preferencesResult) => {
                        if (err) {
                            return handleError(err, res);
                        }

                        const {password, ...sanitizedUser} = userResult[0]

                        res.status(200).json({
                            message: 'Successfully retrieved user',
                            data: {
                                user: sanitizedUser,
                                preferences: preferencesResult[0]
                            }
                        });
                    });
                    break;
                case 'Huurder':
                    db.query("SELECT * FROM seeker_preferences WHERE userId = ?", [req.params.id], (err, preferencesResult) => {
                        if (err) {
                            return handleError(err, res);
                        }

                        const {password, ...sanitizedUser} = userResult[0]

                        res.status(200).json({
                            message: 'Successfully retrieved user',
                            data: {
                                user: sanitizedUser,
                                preferences: preferencesResult[0]
                            }
                        });
                    });
                    break;
                default:
                    res.status(400).json({
                        message: 'Invalid role'
                    });
                    break;
            }
        });
    },
    updateUser: (req, res) => {
        const { user, preferences } = req.body;
        const { role, userId } = req;

        if (role !== 'Verhuurder' && role !== 'Huurder') {
            return res.status(400).json({
                message: 'Invalid role'
            });
        }

        const updateUserQuery = "UPDATE user SET email = ?, password = ?, firstName = ?, lastName = ?, phoneNumber = ?, address = ?, city = ?, postalCode = ?, country = ? WHERE id = ?";
        const updatePreferencesQuery =
            role === 'Verhuurder'
                ? "UPDATE provider_preferences SET situation = ?, house = ?, found = ?, motivation = ?, housePicture = ?, period = ?, nights = ?, roomType = ?, roomSize = ?, furniture = ?, furnitureDescription = ?, price = ?, offer = ?, importantNote = ?, volunteer = ?, volunteerDescription = ?, work = ?, workDescription = ?, describe = ?, hobby = ?, pet = ?, petDescription = ?, religion = ?, comment = ?, overallcomment = ? WHERE userId = ?"
                : "UPDATE seeker_preferences SET seekingCity = ?, liveWith = ?, budget = ?, period = ?, nights = ?, pet = ?, ownPet = ?, ownPetDescription = ?, starDate = ?, endDate = ?, reason = ?, schoolFinished = ?, schoolDoing = ?, skill = ?, work = ?, workDescription = ?, healthRisk = ?, healthRiskDescription = ?, selfDescription = ?, selfWords = ?, idealSpace = ?, offer = ?, offerYou = ?, importantNote = ?, volunteer = ?, volunteerDescription = ?, religion = ?, comment = ?, overallcomment = ? WHERE userId = ?";

        const updateUserParams = [
            user.email, user.password, user.firstName, user.lastName, user.phoneNumber, user.address,
            user.city, user.postalCode, user.country, userId
        ];
        const updatePreferencesParams =
            role === 'Verhuurder'
                ? [
                    preferences.situation, preferences.house, preferences.found, preferences.motivation,
                    preferences.housePicture, preferences.period, preferences.nights, preferences.roomType,
                    preferences.roomSize, preferences.furniture, preferences.furnitureDescription, preferences.price,
                    preferences.offer, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription,
                    preferences.work, preferences.workDescription, preferences.describe, preferences.hobby, preferences.pet,
                    preferences.petDescription, preferences.religion, preferences.comment, preferences.overallcomment, userId
                ]
                : [
                    preferences.seekingCity, preferences.liveWith, preferences.budget, preferences.period,
                    preferences.nights, preferences.pet, preferences.ownPet, preferences.ownPetDescription,
                    preferences.starDate, preferences.endDate, preferences.reason, preferences.schoolFinished,
                    preferences.schoolDoing, preferences.skill, preferences.work, preferences.workDescription,
                    preferences.healthRisk, preferences.healthRiskDescription, preferences.selfDescription,
                    preferences.selfWords, preferences.idealSpace, preferences.offer, preferences.offerYou,
                    preferences.importantNote, preferences.volunteer, preferences.volunteerDescription,
                    preferences.religion, preferences.comment, preferences.overallcomment, userId
                ];

        const handleUpdateSuccess = (result) => {
            res.status(200).json({
                message: 'Successfully updated user',
                data: result
            });
        };

        db.query(updateUserQuery, updateUserParams, (err, result) => {
            if (err) {
                return handleError(err, res);
            }
            db.query(updatePreferencesQuery, updatePreferencesParams, (err, result) => {
                if (err) {
                    return handleError(err, res);
                }

                handleUpdateSuccess(result);
            });
        });
    },
    deleteUser: (req, res) => {
        const sql = "DELETE FROM user WHERE id = ?";
        db.query(sql, [req.userId], (err, result) => {
            if (err) {
                return handleError(err, res);
            } else {
                console.log("(deleteUser) result length: " + result.length);
                res.status(200).json({
                    message: 'Successfully deleted user',
                    data: result
                });
            }
        });
    },
}

module.exports = userController;