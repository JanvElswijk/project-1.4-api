const assert = require('assert');

// User sql

// CREATE TABLE `user` (
//     `id` int NOT NULL AUTO_INCREMENT,
//     `emailAddress` varchar(255) NOT NULL,
//     `password` varchar(255) NOT NULL,
//     `dateOfBirth` date NOT NULL,
//     `firstName` varchar(255) NOT NULL,
//     `middleName` varchar(255) DEFAULT NULL,
//     `lastName` varchar(255) NOT NULL,
//     `picture` varchar(255) NOT NULL,
//     `gender` enum('M','F','O') NOT NULL,
//     `phoneNumber` varchar(10) NOT NULL,
//     `postalCode` varchar(6) NOT NULL,
//     `street` varchar(255) NOT NULL,
//     `houseNumber` int NOT NULL,
//     `city` varchar(255) NOT NULL,
//     `country` varchar(255) NOT NULL,
//     `role` enum('Huurder','Verhuurder') NOT NULL,
//     `isActive` tinyint(1) DEFAULT NULL,
//     `phoneNumberVisible` tinyint(1) DEFAULT NULL,
//     PRIMARY KEY (id),
//     UNIQUE KEY emailAddress (emailAddress)
// ) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;;

// Provider sql

// CREATE TABLE `provider_preferences` (
//     `id` int NOT NULL AUTO_INCREMENT,
//     `userId` int NOT NULL,
//     `situation` enum('Alleenstaand','Met partner','Met huisgenoot','Met kinderen','Anders') NOT NULL,
//     `house` tinyint(1) NOT NULL,
//     `found` text NOT NULL,
//     `motivation` text NOT NULL,
//     `housePicture` longblob,
//     `period` enum('1','2','3','4','5','6','7','8','9','10','11') NOT NULL,
//     `nights` enum('1','2','3','4','5','6','7') NOT NULL,
//     `roomType` text NOT NULL,
//     `roomSize` int NOT NULL,
//     `furniture` tinyint(1) NOT NULL,
//     `furnitureDescription` text,
//     `price` int NOT NULL,
//     `offer` text NOT NULL,
//     `importantNote` text NOT NULL,
//     `volunteer` tinyint(1) NOT NULL,
//     `volunteerDescription` text,
//     `work` tinyint(1) NOT NULL,
//     `workDescription` text,
//     `describe` text NOT NULL,
//     `hobby` text NOT NULL,
//     `pet` tinyint(1) NOT NULL,
//     `petDescription` text,
//     `religion` text,
//     `comment` text,
//     `overallcomment` text,
//     PRIMARY KEY (id),
//     KEY FK_provider_preferences_userId (userId),
//     CONSTRAINT FK_provider_preferences_userId FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
// ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;


// Seeker sql

// CREATE TABLE seeker_preferences (
//     `id` int NOT NULL AUTO_INCREMENT,
//     `userId` int NOT NULL,
//     `seekingCity` varchar(255) NOT NULL,
//     `liveWith` enum('M','V','K') DEFAULT NULL,
//     `budget` int NOT NULL,
//     `period` enum('1','2','3','4','5','6','7','8','9','10','11') NOT NULL,
//     `nights` enum('1','2','3','4','5','6','7') NOT NULL,
//     `pet` tinyint(1) NOT NULL,
//     `ownPet` tinyint(1) NOT NULL,
//     `ownPetDescription` text,
//     `starDate` date NOT NULL,
//     `endDate` date NOT NULL,
//     `reason` enum('Studie','Starter','Scheiding','Anders') NOT NULL,
//     `schoolFinished` text,
//     `schoolDoing` text,
//     `skill` set('EHBO','BHV','Reanimatie') DEFAULT NULL,
//     `work` tinyint(1) NOT NULL,
//     `workDescription` text,
//     `healthRisk` tinyint(1) NOT NULL,
//     `healthRiskDescription` text,
//     `selfDescription` text NOT NULL,
//     `selfWords` text NOT NULL,
//     `idealSpace` text NOT NULL,
//     `offer` text NOT NULL,
//     `offerYou` text NOT NULL,
//     `importantNote` text NOT NULL,
//     `volunteer` tinyint(1) NOT NULL,
//     `volunteerDescription` text,
//     `religion` text,
//     `comment` text,
//     `overallcomment` text,
//     PRIMARY KEY (id),
//     KEY FK_seeker_preferences_userId (userId),
//     CONSTRAINT `FK_seeker_preferences_userId` FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
// ) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

const validateUserInput = (user) => {
    try {
        assert(user, 'User is required');
        assert(user.emailAddress, 'Email address is required');
        assert(typeof user.emailAddress === 'string', 'Email address is invalid');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        assert(emailRegex.test(user.emailAddress), 'Email address is invalid');
        assert(user.password, 'Password is required');
        assert(typeof user.password === 'string', 'Password is invalid');
        // TODO: password regex
        assert(user.dateOfBirth, 'Date of birth is required');
        assert(user.dateOfBirth.split('-')[0].length === 4, 'Date of birth is invalid');
        assert(user.dateOfBirth.split('-')[1].length === 2, 'Date of birth is invalid');
        assert(user.dateOfBirth.split('-')[2].length === 2, 'Date of birth is invalid');
        assert(user.firstName, 'First name is required');
        assert(typeof user.firstName === 'string', 'First name is invalid');
        assert(user.lastName, 'Last name is required');
        // Check if middle name is present, if so, check if it's a string and if not, don't check
        if (user.middleName) {
            assert(typeof user.middleName === 'string', 'Middle name is invalid');
        }
        assert(typeof user.lastName === 'string', 'Last name is invalid');
        assert(user.picture, 'Picture is required');
        const genders = ['M', 'F', 'O'];
        assert(user.gender, 'Gender is required')
        assert(genders.includes(user.gender), 'Gender is invalid')
        assert(user.phoneNumber, 'Phone number is required');
        assert(typeof user.phoneNumber === 'string', 'Phone number is invalid');
        assert(user.postalCode, 'Postal code is required');
        assert(typeof user.postalCode === 'string', 'Postal code is invalid');
        assert(user.street, 'Street is required');
        assert(typeof user.street === 'string', 'Street is invalid');
        assert(user.houseNumber, 'House number is required');
        assert(typeof user.houseNumber === 'string', 'House number is invalid');
        assert(user.city, 'City is required');
        assert(typeof user.city === 'string', 'City is invalid');
        assert(user.country, 'Country is required');
        assert(typeof user.country === 'string', 'Country is invalid');
    }
    catch (err) {
        throw new Error(err);
    }
}

const validateVerhuurderPreferencesInput = (preferences) => {
    try {
        assert(preferences, 'Preferences are required');
        assert(preferences.situation, 'Situation is required');
        const situations = ['Alleenstaand', 'Met partner', 'Met huisgenoot', 'Met kinderen', 'Anders'];
        assert(situations.includes(preferences.situation), 'Situation is invalid');
        assert(preferences.house === 0|| preferences.house === 1, 'House is required');
        assert(typeof preferences.house === 'number', 'House is invalid');
        assert(preferences.found, 'Found is required');
        assert(typeof preferences.found === 'string', 'Found is invalid');
        assert(preferences.motivation, 'Motivation is required');
        assert(typeof preferences.motivation === 'string', 'Motivation is invalid');
        assert(preferences.period, 'Period is required');
        const periods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        assert(periods.includes(preferences.period), 'Period is invalid');
        assert(preferences.nights, 'Nights is required');
        const nights = ['1', '2', '3', '4', '5', '6', '7'];
        assert(nights.includes(preferences.nights), 'Nights is invalid');
        assert(preferences.roomType, 'Room type is required');
        assert(typeof preferences.roomType === 'string', 'Room type is invalid');
        assert(preferences.roomSize, 'Room size is required');
        assert(typeof preferences.roomSize === 'string', 'Room size is invalid');
        assert(preferences.furniture === 1 || preferences.furniture === 0, 'Furniture is required');
        assert(typeof preferences.furniture === 'number', 'Furniture is invalid');
        // Check if furniture description is present, if so, check if it's a string and if not, don't check
        if (preferences.furnitureDescription) {
            assert(typeof preferences.furnitureDescription === 'string', 'Furniture description is invalid');
        }
        assert(preferences.price, 'Price is required');
        assert(typeof preferences.price === 'string', 'Price is invalid');
        assert(preferences.offer, 'Offer is required');
        assert(typeof preferences.offer === 'string', 'Offer is invalid');
        assert(preferences.importantNote, 'Important note is required');
        assert(typeof preferences.importantNote === 'string', 'Important note is invalid');
        assert(preferences.volunteer === 1 || preferences.volunteer === 0, 'Volunteer is required');
        assert(typeof preferences.volunteer === 'number', 'Volunteer is invalid');
        // Check if volunteer description is present, if so, check if it's a string and if not, don't check
        if (preferences.volunteerDescription) {
            assert(typeof preferences.volunteerDescription === 'string', 'Volunteer description is invalid');
        }
        assert(preferences.work  === 1 || preferences.work  === 0, 'Work is required');
        assert(typeof preferences.work === 'number', 'Work is invalid');
        // Check if work description is present, if so, check if it's a string and if not, don't check
        if (preferences.workDescription) {
            assert(typeof preferences.workDescription === 'string', 'Work description is invalid');
        }
        assert(preferences.describe, 'Describe is required');
        assert(typeof preferences.describe === 'string', 'Describe is invalid');
        assert(preferences.hobby, 'Hobby is required');
        assert(typeof preferences.hobby === 'string', 'Hobby is invalid');
        assert(preferences.pet === 1 || preferences.pet === 0, 'Pet is required');
        assert(typeof preferences.pet === 'number', 'Pet is invalid');
        // Check if pet description is present, if so, check if it's a string and if not, don't check
        if (preferences.petDescription) {
            assert(typeof preferences.petDescription === 'string', 'Pet description is invalid');
        }
        // Check if religion is present, if so, check if it's a string and if not, don't check
        if (preferences.religion) {
            assert(typeof preferences.religion === 'string', 'Religion is invalid');
        }
        // Check if comment is present, if so, check if it's a string and if not, don't check
        if (preferences.comment) {
            assert(typeof preferences.comment === 'string', 'Comment is invalid');
        }
        // Check if overall comment is present, if so, check if it's a string and if not, don't check
        if (preferences.overallcomment) {
            assert(typeof preferences.overallcomment === 'string', 'Overall comment is invalid');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const validateHuurderPreferencesInput = (preferences) => {
    try {
        assert(preferences, 'Preferences is required');
        assert(preferences.seekingCity, 'Seeking city is required');
        assert(typeof preferences.seekingCity === 'string', 'Seeking city is invalid');
        const liveWith = ['M', 'V', 'K', ''];
        assert(liveWith.includes(preferences.liveWith), 'Live with is invalid');
        assert(preferences.budget, 'Budget is required');
        assert(typeof preferences.budget === 'string', 'Budget is invalid');
        assert(preferences.period, 'Period is required');
        const periods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        assert(periods.includes(preferences.period), 'Period is invalid');
        assert(preferences.nights, 'Nights is required');
        const nights = ['1', '2', '3', '4', '5', '6', '7'];
        assert(nights.includes(preferences.nights), 'Nights is invalid');
        assert(preferences.pet === 0 || preferences.pet === 1, 'Pet is required');
        assert(typeof preferences.pet === 'number', 'Pet is invalid');
        // Check if pet description is present, if so, check if it's a string and if not, don't check
        if (preferences.petDescription) {
            assert(typeof preferences.petDescription === 'string', 'Pet description is invalid');
        }
        assert(preferences.ownPet === 1 || preferences.ownPet === 0, 'Own pet is required');
        assert(typeof preferences.ownPet === 'number', 'Own pet is invalid');
        // Check if own pet description is present, if so, check if it's a string and if not, don't check
        if (preferences.ownPetDescription) {
            assert(typeof preferences.ownPetDescription === 'string', 'Own pet description is invalid');
        }
        assert(preferences.starDate, 'Start date is required');
        assert(typeof preferences.starDate === 'string', 'Start date is invalid');
        assert(preferences.endDate, 'End date is required');
        assert(typeof preferences.endDate === 'string', 'End date is invalid');
        assert(preferences.reason, 'Reason is required');
        const reasons = ['Studie', 'Starter', 'Scheiding', 'Anders'];
        assert(reasons.includes(preferences.reason), 'Reason is invalid');
        // Check if school finished is present, if so, check if it's a string and if not, don't check
        if (preferences.schoolFinished) {
            assert(typeof preferences.schoolFinished === 'string', 'School finished is invalid');
        }
        // Check if school doing is present, if so, check if it's a string and if not, don't check
        if (preferences.schoolDoing) {
            assert(typeof preferences.schoolDoing === 'string', 'School doing is invalid');
        }
        // Check if skill is present, if so, check if it's a string and if not, don't check
        if (preferences.skill) {
            assert(typeof preferences.skill === 'string', 'Skill is invalid');
        }
        assert(preferences.work  === 0 || preferences.work  === 1, 'Work is required');
        assert(typeof preferences.work === 'number', 'Work is invalid');
        // Check if work description is present, if so, check if it's a string and if not, don't check
        if (preferences.workDescription) {
            assert(typeof preferences.workDescription === 'string', 'Work description is invalid');
        }
        assert(preferences.healthRisk  === 1 || preferences.healthRisk === 0, 'Health risk is required');
        assert(typeof preferences.healthRisk === 'number', 'Health risk is invalid');
        // Check if health risk description is present, if so, check if it's a string and if not, don't check
        if (preferences.healthRiskDescription) {
            assert(typeof preferences.healthRiskDescription === 'string', 'Health risk description is invalid');
        }
        assert(preferences.selfDescription, 'Self description is required');
        assert(typeof preferences.selfDescription === 'string', 'Self description is invalid');
        assert(preferences.selfWords, 'Self words is required');
        assert(typeof preferences.selfWords === 'string', 'Self words is invalid');
        assert(preferences.idealSpace, 'Ideal space is required');
        assert(typeof preferences.idealSpace === 'string', 'Ideal space is invalid');
        assert(preferences.offer, 'Offer is required');
        assert(typeof preferences.offer === 'string', 'Offer is invalid');
        assert(preferences.offerYou, 'Offer you is required');
        assert(typeof preferences.offerYou === 'string', 'Offer you is invalid');
        assert(preferences.importantNote, 'Important note is required');
        assert(typeof preferences.importantNote === 'string', 'Important note is invalid');
        assert(preferences.volunteer  === 1 || preferences.volunteer === 0, 'Volunteer is required');
        assert(typeof preferences.volunteer === 'number', 'Volunteer is invalid');
        // Check if volunteer description is present, if so, check if it's a string and if not, don't check
        if (preferences.volunteerDescription) {
            assert(typeof preferences.volunteerDescription === 'string', 'Volunteer description is invalid');
        }
        // Check if religion is present, if so, check if it's a string and if not, don't check
        if (preferences.religion) {
            assert(typeof preferences.religion === 'string', 'Religion is invalid');
        }
        // Check if comment is present, if so, check if it's a string and if not, don't check
        if (preferences.comment) {
            assert(typeof preferences.comment === 'string', 'Comment is invalid');
        }
        // Check if overall comment is present, if so, check if it's a string and if not, don't check
        if (preferences.overallcomment) {
            assert(typeof preferences.overallcomment === 'string', 'Overall comment is invalid');
        }
    } catch (error) {
        throw new Error(error.message);
    }

}

module.exports = {
    validateUserInput,
    validateVerhuurderPreferencesInput,
    validateHuurderPreferencesInput
}