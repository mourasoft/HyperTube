const router = require('express').Router();
const intra = require('../controllers/intra');




router.post('/intra/register', intra.register);
router.post('/intra/login', intra.login);







exports.router = router;