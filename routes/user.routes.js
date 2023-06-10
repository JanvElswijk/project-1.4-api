const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');


// Login, get token back
router.post('/login', authController.login);

// Get all users, no preferences
router.get('/', userController.getAllUsers);

// Get profile of logged in user, including preferences
router.get('/profile', authController.validateToken, userController.getProfile);

// Create a new user including preferences in a seperate table (one-to-one relationship) (seperate preferences for "Huurder" and "Verhuurder")
router.post('/verhuurder', userController.createVerhuurder);
router.post('/huurder', userController.createHuurder);

// Get all users, including preferences
router.get('/verhuurder', userController.getAllVerhuurders); // This can further be filtered using query parameters
router.get('/huurder', userController.getAllHuurders); // This can further be filtered using query parameters

//TODO: this
router.post('/verhuurder/match', authController.validateToken, userController.getVerhuurderMatches); // Get all verhuurders that match the preferences of the huurder whose id is in the body and give a percentage of how much they match
router.post('/huurder/match', authController.validateToken, userController.getHuurderMatches); // Get all huurders that match the preferences of the verhuurder whose id is in the body and give a percentage of how much they match

// Get a single user, with preferences, check if user is verhuurder or huurder
router.get('/:id', userController.getUserById);
// Update a user, with preferences, check if user is verhuurder or huurder and update preferences as well
router.put('/:id', authController.validateToken, userController.updateUser);
// Delete a user, with preferences, check if user is verhuurder or huurder and delete preferences as well
router.delete('/:id', authController.validateToken, userController.deleteUser);

module.exports = router;
