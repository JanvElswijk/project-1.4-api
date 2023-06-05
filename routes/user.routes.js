const router = require('express').Router();
const userController = require('../controllers/user.controller');

// TODO: Add authentication

// Get all users, no preferences
router.get('/', userController.getAllUsers);

// Create a new user including preferences in a seperate table (one-to-one relationship) (seperate preferences for "Huurder" and "Verhuurder")
router.post('/verhuurder', userController.createVerhuurder);
router.post('/huurder', userController.createHuurder);

// Get all users, including preferences
router.get('/verhuurder', userController.getAllVerhuurders); // This can further be filtered by preferences, using query parameters
router.get('/huurder', userController.getAllHuurders); // This can further be filtered by preferences, using query parameters

// Get a single user, including preferences
router.get('/verhuurder/:id', userController.getVerhuurderById); // This can further be filtered by preferences, using query parameters
router.get('/huurder/:id', userController.getHuurderById); // This can further be filtered by preferences, using query parameters

// Update a user, including preferences
router.put('/verhuurder/:id', userController.updateVerhuurderById); // This can further be filtered by preferences, using query parameters
router.put('/huurder/:id', userController.updateHuurderById); // This can further be filtered by preferences, using query parameters

// Delete a user, including preferences
router.delete('/verhuurder/:id', userController.deleteVerhuurderById); // This can further be filtered by preferences, using query parameters
router.delete('/huurder/:id', userController.deleteHuurderById); // This can further be filtered by preferences, using query parameters

module.exports = router;
