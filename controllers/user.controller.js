const db = require('../util/mysql.db');
const dateConverter = require('../util/converter').dateConverter;
const validation = require('../util/validation');
const bcrypt = require('bcrypt');
const mailer = require('../util/mailer');

const handleError = (err, res) => {
    console.log(err);
    return res.status(500).json({
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
const compareDataHuurder = (huurderData, verhuurdersData) => {
    // Compare the following fields:
    // huurder.seekingCity === verhuurder.city
    // huurder.budget >= verhuurder.price
    // huurder.period <= verhuurder.period
    // huurder.nights <= verhuurder.nights
    // huurder.pet === verhuurder.pet

    const cityWeight = 15;
    const budgetWeight = 35;
    const periodWeight = 20;
    const nightsWeight = 20;
    const petWeight = 10;

    const matchingScores = [];

    for (let i = 0; i < verhuurdersData.length; i++) {
        let matchingScore = 0;
        if (huurderData.seekingCity === verhuurdersData[i].city) {
            matchingScore += cityWeight;
        }
        if (huurderData.budget >= verhuurdersData[i].price) {
            matchingScore += budgetWeight;
        }
        if (huurderData.period <= verhuurdersData[i].period) {
            matchingScore += periodWeight;
        }
        if (huurderData.nights <= verhuurdersData[i].nights) {
            matchingScore += nightsWeight;
        }
        if (huurderData.pet === verhuurdersData[i].pet) {
            matchingScore += petWeight;
        }
        verhuurdersData[i].matchingScore = matchingScore;

        matchingScores.push(verhuurdersData[i]);
    }

    matchingScores.sort((a, b) => {
        return b.matchingScore - a.matchingScore;
    });

    return matchingScores;

}
const compareDataVerhuurder = (verhuurderData, huurdersData) => {
    // Compare the following fields:
    // verhuurder.city === huurder.seekingCity
    // verhuurder.price <= huurder.budget
    // verhuurder.period >= huurder.period
    // verhuurder.nights >= huurder.nights
    // verhuurder.pet === huurder.pet

    const cityWeight = 15;
    const budgetWeight = 35;
    const periodWeight = 20;
    const nightsWeight = 20;
    const petWeight = 10;

    const matchingScores = [];

    for (let i = 0; i < huurdersData.length; i++) {
        let matchingScore = 0;
        if (verhuurderData.city === huurdersData[i].seekingCity) {
            matchingScore += cityWeight;
        }
        if (verhuurderData.price <= huurdersData[i].budget) {
            matchingScore += budgetWeight;
        }
        if (verhuurderData.period >= huurdersData[i].period) {
            matchingScore += periodWeight;
        }
        if (verhuurderData.nights >= huurdersData[i].nights) {
            matchingScore += nightsWeight;
        }
        if (verhuurderData.pet === huurdersData[i].pet) {
            matchingScore += petWeight;
        }

        huurdersData[i].matchingScore = matchingScore;

        matchingScores.push(huurdersData[i]);
    }

    matchingScores.sort((a, b) => {
        return b.matchingScore - a.matchingScore;
    });

    return matchingScores;

}

// User table: id (auto-increment), emailAddress, password, dataOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role (Verhhurder or Huurder)
// Seeker preferences table: id, userId, seekingCity, liveWith, budget, period, nights, pet, ownPet, ownPetDescription, starDate endDate, reason, schoolFinished, schoolDoing, skill, work, workDescription, healthRisk, healthRiskDescription, selfDescription, selfWords, idealSpace, offer, offerYou, importantNote, volunteer, volunteerDescription, religion, comment,	overallcomment
// Provider prefernces table: id, userId, situation, house, found, motivation, housePicture, period, nights, roomType, roomSize, furniture, furnitureDescription, price, offer, importantNote, volunteer, volunteerDescription, work, workDescription, describe, hobby, pet, petDescription, religion, comment, overallcomment

// User sql

// CREATE TABLE `user` (
//     `id` int(11) NOT NULL,
//     `emailAddress` varchar(255) NOT NULL,
//     `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
//     `dateOfBirth` date NOT NULL,
//     `firstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
//     `middleName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
//     `lastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
//     `picture` longblob NOT NULL,
//     `gender` enum('M','F','O') NOT NULL,
//     `phoneNumber` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
//     `postalCode` varchar(6) NOT NULL,
//     `street` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
//     `houseNumber` int(11) NOT NULL,
//     `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
//     `country` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
//     `role` enum('Huurder','Verhuurder') NOT NULL
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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



// columns that can be compared between seeker and provider to find a matching percentage, these cannot be simple text without an enum or set
// seekingCity, budget, period, nights, pet, starDate, endDate, reason, work, volunteer


const userController = {
    getAllUsers: (req, res) => {
        db.query('SELECT * FROM user', [], (err, rows) => {
            if (err) {
                return handleError(err, res);
            }

            return res.status(200).json({
                message: 'Successfully fetched all users',
                data: rows
            });
        });
    },
    getProfile: (req, res) => {
        console.log("(getProfile) userId: " + req.userId);
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
                                return res.status(200).json({
                                    message: 'Successfully fetched profile',
                                    user: rows[0],
                                    preferences: rows2[0]
                                });
                            }
                        });
                    } else if (rows[0].role === 'Verhuurder') {
                        db.query('SELECT * FROM provider_preferences WHERE userId = ?', [req.userId], (err, rows2) => {
                            if (err) {
                                return handleError(err, res);
                            } else {
                                console.log("(getProfile) amount of rows: " + rows.length);
                                return res.status(200).json({
                                    message: 'Successfully fetched profile',
                                    user: rows[0],
                                    preferences: rows2[0]
                                });
                            }
                        });
                    }
                } else {
                    return res.status(404).json({
                        message: 'User not found'
                    });
                }
            }
        });
    },
    getAllProfilePictures: (req, res) => {
        db.query('SELECT id, picture, role FROM user', [], (err, rows) => {
            if (err) {
                return handleError(err, res);
            }

            let counter = 0;

            rows.forEach(row => {
                if (row.role === 'Verhuurder') {
                    db.query('SELECT housePicture FROM provider_preferences WHERE userId = ?', [row.id], (err, rows2) => {
                        if (err) {
                            return handleError(err, res);
                        } else {
                            row.housePicture = rows2[0].housePicture;
                            counter++;

                            if (counter === rows.length) {
                                sendResponse();
                            }
                        }
                    });
                } else {
                    counter++;

                    if (counter === rows.length) {
                        sendResponse();
                    }
                }
            });

            function sendResponse() {
                return res.status(200).json({
                    message: 'Successfully fetched all profile pictures',
                    data: rows
                });
            }
        });
    },
    createVerhuurder: (req, res) => {
        let user, preferences;
        if (req.body.user && req.body.preferences) {
            ({ user, preferences } = req.body);
        } else {
            return res.status(400).json({
                message: 'Bad request'
            });
        }

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
                sql: "INSERT INTO `user` (emailAddress, password, dateOfBirth, firstName, middleName, lastName, picture, gender, phoneNumber, postalCode, street, houseNumber, city, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Verhuurder')",
                params: [user.emailAddress, user.password, user.dateOfBirth, user.firstName, user.middleName, user.lastName, user.picture, user.gender, user.phoneNumber, user.postalCode, user.street, user.houseNumber, user.city, user.country]
            },
            {
                sql: "INSERT INTO `provider_preferences` (userId, situation, house, found, motivation, housePicture, period, nights, roomType, roomSize, furniture, furnitureDescription, price, offer, importantNote, volunteer, volunteerDescription, work, workDescription, `describe`, hobby, pet, petDescription, religion, comment, overallcomment) VALUES (LAST_INSERT_ID(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                params: [preferences.situation, preferences.house, preferences.found, preferences.motivation, preferences.housePicture, preferences.period, preferences.nights, preferences.roomType, preferences.roomSize, preferences.furniture, preferences.furnitureDescription, preferences.price, preferences.offer, preferences.importantNote, preferences.volunteer, preferences.volunteerDescription, preferences.work, preferences.workDescription, preferences.describe, preferences.hobby, preferences.pet, preferences.petDescription, preferences.religion, preferences.comment, preferences.overallcomment]
            }
        ];

        db.executeTransaction(queries, (err, result) => {
            if (err) {
                return handleError(err, res);
            } else {
                console.log("(createVerhuurder) result: " + result);
                const userId = result[0].id;
                mailer.sendMail(user.emailAddress, userId,(err, info) => {
                    if (err) {
                        return handleError(err, res);
                    } else {
                        console.log("(createVerhuurder) info: " + info);
                    }
                });
                return res.status(200).json({
                    message: 'Successfully created verhuurder',
                    data: result
                });
            }
        });
    },
    createHuurder: (req, res) => {
        let user, preferences;
        if (req.body.user && req.body.preferences) {
            ({ user, preferences } = req.body);
        } else {
            return res.status(400).json({
                message: 'Bad request'
            });
        }

        console.log(user.dateOfBirth)

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
                return res.status(400).json({
                    message: 'Invalid user input',
                    error: err
                });
            }
        });

        validation.validateHuurderPreferencesInput(preferences, (err) => {
            if (err) {
                return res.status(400).json({
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
                const userId = result[0].id;
                mailer.sendMail(user.emailAddress, userId, (err, info) => {
                    if (err) {
                        return handleError(err, res);
                    } else {
                        console.log("(createVerhuurder) info: " + info);
                    }
                });
                return res.status(200).json({
                    message: 'Successfully created huurder',
                    data: result
                });
            }
        });
    },
    getAllVerhuurders: (req, res) => {
        const sql = "SELECT * FROM `user` JOIN `provider_preferences` ON `user`.`id` = `provider_preferences`.`userId` WHERE `user`.`role` = 'Verhuurder'";

        const query_params = req.query;
        const query_keys = Object.keys(query_params);
        const query_values = Object.values(query_params);
        // If the one of the keys is empty, remove it from the query
        for (let i = 0; i < query_keys.length; i++) {
            if (query_values[i] === '') {
                query_keys.splice(i, 1);
                query_values.splice(i, 1);
            }
        }

        let query = sql;
        if (query_keys.length > 0) {
            query += " AND ";
            for (let i = 0; i < query_keys.length; i++) {
                if (query_keys[i] === 'price') {
                    query += "price <= " + query_values[i];
                } else if (query_keys[i] === 'roomSize') {
                    query += "roomSize >= " + query_values[i];
                } else {
                    query += query_keys[i] + " = '" + query_values[i] + "'";
                }
                if (i !== query_keys.length - 1) {
                    query += " AND ";
                }
            }
        }

        console.log("(getAllVerhuurders) query: " + query);

        db.query(query, (err, result) => {
            if (err) {
                return handleError(err, res);
            } else {
                console.log("(getAllVerhuurders) result length: " + result.length);
                return res.status(200).json({
                    message: 'Successfully retrieved all verhuurders',
                    data: result
                });
            }
        });

    },
    getAllHuurders: (req, res) => {
        const sql = "SELECT * FROM `user` JOIN `seeker_preferences` ON `user`.`id` = `seeker_preferences`.`userId` WHERE `user`.`role` = 'Huurder'";
        const query_params = req.query;
        const query_keys = Object.keys(query_params);
        const query_values = Object.values(query_params);
        // If the one of the keys is empty, remove it from the query
        for (let i = 0; i < query_keys.length; i++) {
            if (query_values[i] === '') {
                query_keys.splice(i, 1);
                query_values.splice(i, 1);
            }
        }

        for (let i = 0; i < query_keys.length; i++) {
            if (query_keys[i] === 'skill') {
                query_keys.splice(i, 1);
                query_values.splice(i, 1);
            }
        }

        let query = sql;
        if (query_keys.length > 0) {
            query += " AND ";
            for (let i = 0; i < query_keys.length; i++) {
                if (query_keys[i] === 'EHBO' || query_keys[i] === 'BHV' || query_keys[i] === 'Reanimatie') {
                    query += "skill LIKE '%" + query_keys[i] + "%'";
                } else {
                    query += query_keys[i] + " = '" + query_values[i] + "'";
                }
                if (i !== query_keys.length - 1) {
                    query += " AND ";
                }
            }
        }

        console.log("(getAllHuurders) query: " + query);

        db.query(query, (err, result) => {
            if (err) {
                return handleError(err, res);
            } else {
                console.log("(getAllHuurders) result length: " + result.length);
                return res.status(200).json({
                    message: 'Successfully retrieved all huurders',
                    data: result
                });
            }
        });
    },
    getVerhuurderMatches: (req, res) => {
        const id = req.userId
        console.log(id)

        db.query("SELECT * FROM user JOIN provider_preferences ON user.id = provider_preferences.userId WHERE user.id = ?", [id], (err, userResult) => {
            if (err) {
                return handleError(err, res);
            }

            if (userResult.length === 0) {
                console.log("User not found this one 1")
                return res.status(404).json({
                    message: 'User not found',
                });
            }

            const user = userResult[0];

            const sql = "SELECT * FROM `user` JOIN `seeker_preferences` ON `user`.`id` = `seeker_preferences`.`userId` WHERE `user`.`role` = 'Huurder'";
            const query_params = req.query;
            const query_keys = Object.keys(query_params);
            const query_values = Object.values(query_params);
            // If the one of the keys is empty, remove it from the query
            for (let i = 0; i < query_keys.length; i++) {
                if (query_values[i] === '') {
                    query_keys.splice(i, 1);
                    query_values.splice(i, 1);
                }
            }

            for (let i = 0; i < query_keys.length; i++) {
                if (query_keys[i] === 'skill') {
                    query_keys.splice(i, 1);
                    query_values.splice(i, 1);
                }
            }

            let query = sql;
            if (query_keys.length > 0) {
                query += " AND ";
                for (let i = 0; i < query_keys.length; i++) {
                    if (query_keys[i] === 'EHBO' || query_keys[i] === 'BHV' || query_keys[i] === 'Reanimatie') {
                        query += "skill LIKE '%" + query_keys[i] + "%'";
                    } else {
                        query += query_keys[i] + " = '" + query_values[i] + "'";
                    }
                    if (i !== query_keys.length - 1) {
                        query += " AND ";
                    }
                }
            }

            console.log("(getVerhuurderMatches) query: " + query);

            db.query(query, (err, seekerResult) => {
                if (err) {
                    return handleError(err, res);
                }

                const matches = compareDataVerhuurder(user, seekerResult);

                return res.status(200).json({
                    message: 'Successfully retrieved matches',
                    data: matches
                });
            });
        });
    },
    getHuurderMatches: (req, res) => {
        const id = req.userId
        console.log(id)

        db.query("SELECT * FROM user JOIN seeker_preferences ON user.id = seeker_preferences.userId WHERE user.id = ?", [id], (err, userResult) => {
            if (err) {
                return handleError(err, res);
            }

            if (userResult.length === 0) {
                console.log("User not found this one 1")
                return res.status(404).json({
                    message: 'User not found',
                });
            }

            const user = userResult[0];

            const sql = "SELECT * FROM `user` JOIN `provider_preferences` ON `user`.`id` = `provider_preferences`.`userId` WHERE `user`.`role` = 'Verhuurder'";

            const query_params = req.query;
            const query_keys = Object.keys(query_params);
            const query_values = Object.values(query_params);
            // If the one of the keys is empty, remove it from the query
            for (let i = 0; i < query_keys.length; i++) {
                if (query_values[i] === '') {
                    query_keys.splice(i, 1);
                    query_values.splice(i, 1);
                }
            }

            let query = sql;
            if (query_keys.length > 0) {
                query += " AND ";
                for (let i = 0; i < query_keys.length; i++) {
                    if (query_keys[i] === 'price') {
                        query += "price <= " + query_values[i];
                    } else if (query_keys[i] === 'roomSize') {
                        query += "roomSize >= " + query_values[i];
                    } else {
                        query += query_keys[i] + " = '" + query_values[i] + "'";
                    }
                    if (i !== query_keys.length - 1) {
                        query += " AND ";
                    }
                }
            }

            console.log("(getHuurderMatches) query: " + query);

            db.query(query, (err, providerResult) => {
                if (err) {
                    return handleError(err, res);
                }

                const matches = compareDataHuurder(user, providerResult);

                return res.status(200).json({
                    message: 'Successfully retrieved matches',
                    data: matches
                });
            });
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

                        return res.status(200).json({
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

                        return res.status(200).json({
                            message: 'Successfully retrieved user',
                            data: {
                                user: sanitizedUser,
                                preferences: preferencesResult[0]
                            }
                        });
                    });
                    break;
                default:
                    return res.status(400).json({
                        message: 'Invalid role'
                    });
            }
        });
    },
    updateUser: (req, res) => {
        console.log("(updateUser) called")
        const { user, preferences } = req.body;
        const linkUserId = parseInt(req.params.id);
        const role = req.userRole;
        const userId = req.userId;

        if (userId !== linkUserId) {
            console.log("(updateUser) Unauthorized")
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        validateInput(user, preferences, role, (err, result) => {
            if (err) {
                return handleError(err, res);
            }

            if (!result) {
                return res.status(400).json({
                    message: 'Invalid input'
                });
            }
        });


        const updateUserQuery = "UPDATE user SET emailAddress = ?, password = ?, firstName = ?, middleName = ?, lastName = ?, gender = ? ,phoneNumber = ?, street = ?, city = ?, postalCode = ?, country = ?, houseNumber = ? WHERE id = ?";
        const updatePreferencesQuery =
            role === 'Verhuurder'
                ? "UPDATE provider_preferences SET situation = ?, house = ?, found = ?, motivation = ?, housePicture = ?, period = ?, nights = ?, roomType = ?, roomSize = ?, furniture = ?, furnitureDescription = ?, price = ?, offer = ?, importantNote = ?, volunteer = ?, volunteerDescription = ?, work = ?, workDescription = ?, `describe` = ?, hobby = ?, pet = ?, petDescription = ?, religion = ?, comment = ?, overallcomment = ? WHERE userId = ?"
                : "UPDATE seeker_preferences SET seekingCity = ?, liveWith = ?, budget = ?, period = ?, nights = ?, pet = ?, ownPet = ?, ownPetDescription = ?, starDate = ?, endDate = ?, reason = ?, schoolFinished = ?, schoolDoing = ?, skill = ?, work = ?, workDescription = ?, healthRisk = ?, healthRiskDescription = ?, selfDescription = ?, selfWords = ?, idealSpace = ?, offer = ?, offerYou = ?, importantNote = ?, volunteer = ?, volunteerDescription = ?, religion = ?, comment = ?, overallcomment = ? WHERE userId = ?";

        const updateUserParams = [
            user.emailAddress, user.password, user.firstName, user.middleName, user.lastName, user.gender, user.phoneNumber, user.street,
            user.city, user.postalCode, user.country, user.houseNumber, userId
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
            console.log("(updateUser) Successfully updated user")
            return res.status(200).json({
                message: 'Successfully updated user',
                data: result
            });
        };

        db.query(updateUserQuery, updateUserParams, (err) => {
            console.log("(updateUser) updateUserQuery called")
            if (err) {
                console.log("(updateUser) updateUserQuery error")
                return handleError(err, res);
            }
            db.query(updatePreferencesQuery, updatePreferencesParams, (err, result) => {
                console.log("(updateUser) updatePreferencesQuery called")
                if (err) {
                    console.log("(updateUser) updatePreferencesQuery error")
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
                return res.status(200).json({
                    message: 'Successfully deleted user',
                    data: result
                });
            }
        });
    },
}

module.exports = userController;