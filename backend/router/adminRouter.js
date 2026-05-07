const express = require('express');
const multer = require('multer');
const { getStats, getAllUsers, updateUserRole, deleteUser, createPlace, deletePlace } = require('../controllers/adminController');
const { checkAuth } = require('../middlewares/checkLogin');
const { isAdmin } = require('../middlewares/adminMiddleware');

const router = express.Router();
const upload = multer(); // memory storage for ImageKit

router.use(checkAuth);
router.use(isAdmin);

// Dashboard Stats
router.get('/stats', getStats);

// User Management
router.get('/users', getAllUsers);
router.patch('/user/:id/role', updateUserRole);
router.delete('/user/:id', deleteUser);

// Place Management
router.post('/places', upload.single('image'), createPlace);
router.delete('/place/:id', deletePlace);

module.exports = router;
