process.env.DB_DATABASE =
    process.env.DB_DATABASE || 'mijnwoongenoot';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const db = require('../util/mysql.db');

chai.use(chaiHttp);

chai.should();

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



const seekerBody = {
    "user": {
        "emailAddress": "test@test.test",
        "password": "test",
        "dateOfBirth": "1999-01-01",
        "firstName": "test",
        "middleName": "test",
        "lastName": "test",
        "picture": "test",
        "gender": "M",
        "phoneNumber": "0612345678",
        "postalCode": "1234AB",
        "street": "test",
        "houseNumber": "1",
        "city": "test",
        "country": "test",
        "role": "Huurder",
    },
    "preferences": {
        "seekingCity": "test",
        "liveWith": "M",
        "budget": "1",
        "period": "1",
        "nights": "1",
        "pet": "Ja",
        "ownPet": "Ja",
        "ownPetDescription": "test",
        "starDate": "2020-01-01",
        "endDate": "2020-01-01",
        "reason": "Studie",
        "schoolFinished": "test",
        "schoolDoing": "test",
        "skill": "EHBO",
        "work": "Ja",
        "workDescription": "test",
        "healthRisk": "Ja",
        "healthRiskDescription": "test",
        "selfDescription": "test",
        "selfWords": "test",
        "idealSpace": "test",
        "offer": "test",
        "offerYou": "test",
        "importantNote": "test",
        "volunteer": "Ja",
        "volunteerDescription": "test",
        "religion": "test",
        "comment": "test",
        "overallcomment": "test"
    }
}

const providerBody = {
    "user": {
        "emailAddress": "test2@test.test",
        "password": "test",
        "dateOfBirth": "1999-01-01",
        "firstName": "test",
        "middleName": "test",
        "lastName": "test",
        "picture": "test",
        "gender": "M",
        "phoneNumber": "0612345678",
        "postalCode": "1234AB",
        "street": "test",
        "houseNumber": "1",
        "city": "test",
        "country": "test"
    },
    "preferences": {
        "situation": "Anders",
        "house": "Ja",
        "found": "Ja",
        "motivation": "test",
        "housePicture": "test",
        "period": "1",
        "nights": "1",
        "roomType": "test",
        "roomSize": "Ja",
        "furniture": "Ja",
        "furnitureDescription": "test",
        "price": "Ja",
        "offer": "test",
        "importantNote": "test",
        "volunteer": "Ja",
        "volunteerDescription": "test",
        "work": "Ja",
        "workDescription": "test",
        "describe": "test",
        "hobby": "test",
        "pet": "Ja",
        "petDescription": "test",
        "religion": "test",
        "comment": "test",
        "overallcomment": "test"
    }
}

let token = null;
let id = null;

describe('App', () => {
    describe('Niet functioneel', () => {
        describe('GET /', () => {
            it('should return a message', (done) => {
                chai.request(app)
                    .get('/')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Dit is niet de goeie route, gebruik /api/user of /about');
                        done();
                    });
            });
        });
        describe('GET /about', () => {
            it('should return a message', (done) => {
                chai.request(app)
                    .get('/about')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Dit is de backend van MijnWoongenoot, gebruik /api/user voor alle functionaliteiten');
                        done();
                    });
            });
        });
    });
    describe('Functioneel', () => {
        describe('GET /api/user', () => {
            it('should return all users', (done) => {
                chai.request(app)
                    .get('/api/user')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.length.should.be.eql(20);
                        done();
                    });
            });
        });
        describe('GET /api/user/:id', () => {
            before((done) => {
                chai.request(app)
                    .post('/api/user/huurder')
                    .send(seekerBody)
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
            before((done) => {
                db.query('SELECT id FROM user WHERE emailAddress = ?', [seekerBody.user.emailAddress], (err, result) => {
                    if (err) throw err;
                    id = result[0].id;
                    done();
                });
            });
            it('should return a user', (done) => {
                chai.request(app)
                    .get(`/api/user/${id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.length.should.be.eql(0);
                        done();
                    });
            });
            after((done) => {
                db.query('DELETE FROM user WHERE emailAddress = ?', [seekerBody.user.emailAddress], (err) => {
                    if (err) throw err;
                    done();
                });
            });
            after((done) => {
                id = null;
                done();
            });
        });
        describe('POST /api/user/...', () => {
            it('should create a verhuurder /verhuurder', (done) => {
                chai.request(app)
                    .post('/api/user/verhuurder')
                    .send(providerBody)
                    .end((err, res) => {
                        if (res.error) {
                            console.log(res.error);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.length.should.be.eql(0);
                        done();
                    });
            });
            after((done) => {
                db.query('DELETE FROM user WHERE emailAddress = ?', [providerBody.user.emailAddress], (err) => {
                    if (err) throw err;
                    done();
                });
            });
            it('should create a huurder /huurder', (done) => {
                chai.request(app)
                    .post('/api/user/huurder')
                    .send(seekerBody)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.length.should.be.eql(0);
                        done();
                    });
            });
            after((done) => {
                db.query('DELETE FROM user WHERE emailAddress = ?', [seekerBody.user.emailAddress], (err) => {
                    if (err) throw err;
                    done();
                });
            });
        });
        describe('PUT /api/user/:id', () => {
            before((done) => {
                chai.request(app)
                    .post('/api/user/verhuurder')
                    .send(providerBody)
                    .end((err, res) => {
                        if (res.error) {
                            console.log(res.error);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.length.should.be.eql(0);
                        done();
                    });
            });
            before((done) => {
                db.query('UPDATE user SET isActive = 1 WHERE emailAddress = ?', [providerBody.user.emailAddress], (err) => {
                    if (err) throw err;
                    done();
                });
            });
            before((done) => {
                chai.request(app)
                    .post('/api/user/login')
                    .send({emailAddress: providerBody.user.emailAddress, password: providerBody.user.password})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        token = res.body.token;
                        id = res.body.user.id;
                        done();
                    });
            });
            it('should update a user', (done) => {
                const newBody = {...providerBody};
                newBody.user.gender = 'F';
                chai.request(app)
                    .put(`/api/user/${id}`)
                    .send(newBody)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.length.should.be.eql(0);
                        done();
                    });
            });
            after((done) => {
                db.query('DELETE FROM user WHERE emailAddress = ?', [providerBody.user.emailAddress], (err) => {
                    if (err) throw err;
                    done();
                });
            });
            after((done) => {
                token = null;
                id = null;
                done();
            });
        });
        describe('DELETE /api/user/:id', () => {
            before((done) => {
                chai.request(app)
                    .post('/api/user/verhuurder')
                    .send(providerBody)
                    .end((err, res) => {
                        if (res.error) {
                            console.log(res.error);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.length.should.be.eql(0);
                        done();
                    });
            });
            before((done) => {
                db.query('UPDATE user SET isActive = 1 WHERE emailAddress = ?', [providerBody.user.emailAddress], (err) => {
                    if (err) throw err;
                    done();
                });
            });
            before((done) => {
                chai.request(app)
                    .post('/api/user/login')
                    .send({emailAddress: providerBody.user.emailAddress, password: providerBody.user.password})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        token = res.body.token;
                        id = res.body.user.id;
                        done();
                    });
            });
            it('should delete a user', (done) => {
                const id = 1;
                chai.request(app)
                    .delete(`/api/user/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.length.should.be.eql(0);
                        done();
                    });
            });
            after((done) => {
                token = null;
                id = null;
                done();
            });
        });
    });
});
after((done) => {
    db.query('DELETE FROM user WHERE emailAddress = ?', [providerBody.user.emailAddress], (err) => {
        if (err) throw err;
        done();
    });
    db.query('DELETE FROM user WHERE emailAddress = ?', [seekerBody.user.emailAddress], (err) => {
        if (err) throw err;
        done();
    });
});

