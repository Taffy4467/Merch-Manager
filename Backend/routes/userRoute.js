const express = require('express');
const { registeruser, loginuser, logoutuser, getuser, loggedstatus, updateuser, changepassword, forgotpassword, resetpassword} = require('../controllers/userController');
const router = express.Router();
const bcrypt = require('bcryptjs');
const protect = require('../middleware/authMiddleware');


router.post('/register', registeruser);
router.post('/login', loginuser);
router.get('/logout', logoutuser);
router.get('/getuser', protect, getuser);
router.get('/loggedstatus', loggedstatus);
router.patch('/updateuser', protect, updateuser);
router.patch('/changepassword', protect, changepassword);
router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword', resetpassword);

module.exports = router;